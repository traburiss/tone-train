import { useInstrumentStatus } from '@/hooks/useInstrumentStatus';
import { loadInstrument } from '@/utils/toneInstruments';
import {
  CaretRightOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Card, Modal, Space, Typography, theme } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import './MaExercisePlayer.less';

interface MaExercisePlayerProps {
  visible: boolean;
  onClose: () => void;
  startNote: string;
  endNote: string;
  rootNoteWait: number; // ms
  firstNoteDuration: number;
  intervalDuration: number;
  lastNoteDuration: number;
  postMelodyWait: number;
  loopCount: number;
  countdown: number;
}

// 5-note Descending Pattern (Perfect 5th range: Sol-Fa-Mi-Re-Do)
const PATTERN_OFFSETS = [7, 5, 4, 2, 0];

const MaExercisePlayer: React.FC<MaExercisePlayerProps> = ({
  visible,
  onClose,
  startNote,
  endNote,
  rootNoteWait = 1500,
  firstNoteDuration = 1500,
  intervalDuration = 500,
  lastNoteDuration = 1500,
  postMelodyWait = 1000,
  loopCount = 2,
  countdown = 3000,
}) => {
  const intl = useIntl();
  const { token } = theme.useToken();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);

  // Progress Tracking
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalStepsInCycle, setTotalStepsInCycle] = useState(0);
  const [currentStepInCycle, setCurrentStepInCycle] = useState(1);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null); // -1: Root, 0-4: Pattern, null: idle

  const [currentNote, setCurrentNote] = useState<string>('');
  const [currentTip, setCurrentTip] = useState<string>('');
  const [currentPatternNotes, setCurrentPatternNotes] = useState<string[]>([]);
  const samplerRef = useRef<Tone.Sampler | Tone.PolySynth | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const tips = useRef([
    intl.formatMessage({ id: 'vocal.ma-exercise.tip.1' }),
    intl.formatMessage({ id: 'vocal.ma-exercise.tip.2' }),
    intl.formatMessage({ id: 'vocal.ma-exercise.tip.3' }),
    intl.formatMessage({ id: 'vocal.ma-exercise.tip.4' }),
    intl.formatMessage({ id: 'vocal.ma-exercise.tip.5' }),
    intl.formatMessage({ id: 'vocal.ma-exercise.tip.6' }),
    intl.formatMessage({ id: 'vocal.ma-exercise.tip.7' }),
    intl.formatMessage({ id: 'vocal.ma-exercise.tip.8' }),
  ]);

  const stopExercise = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCountdownValue(null);
    setCurrentNote('');
    setCurrentPatternNotes([]);
    setActiveNoteIndex(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const getRandomTip = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * tips.current.length);
    return tips.current[randomIndex];
  }, []);

  const togglePause = useCallback(() => {
    if (isPaused) {
      Tone.Transport.start();
      setIsPaused(false);
    } else {
      Tone.Transport.pause();
      samplerRef.current?.releaseAll();
      setIsPaused(true);
    }
  }, [isPaused]);

  const startExercise = useCallback(async () => {
    setIsPlaying(true);
    setIsPaused(false);
    setCurrentCycle(1);
    setCurrentStepInCycle(1);
    Tone.Transport.cancel();

    const startMidi = Tone.Frequency(startNote).toMidi();
    const endMidi = Tone.Frequency(endNote).toMidi();
    const totalSteps = Math.abs(endMidi - startMidi);
    setTotalStepsInCycle(totalSteps + 1);

    let currentTime = 0;

    // Convert ms to s for Tone.js
    const rootWaitS = rootNoteWait / 1000;
    const firstDurS = firstNoteDuration / 1000;
    const intervalDurS = intervalDuration / 1000;
    const lastDurS = lastNoteDuration / 1000;
    const postWaitS = postMelodyWait / 1000;

    for (let loop = 0; loop < loopCount; loop++) {
      const direction = endMidi >= startMidi ? 1 : -1;

      for (let i = 0; i <= totalSteps; i++) {
        const rootMidi = startMidi + i * direction;
        const rootNoteName = Tone.Frequency(rootMidi, 'midi').toNote();
        const patternNoteNames = PATTERN_OFFSETS.map((offset) =>
          Tone.Frequency(rootMidi + offset, 'midi').toNote(),
        );

        const currentLoop = loop + 1;
        const currentStep = i + 1;
        const isFirstGlobalStep = loop === 0 && i === 0;

        // --- 1. Root Note Phase ---
        Tone.Transport.schedule((t) => {
          Tone.Draw.schedule(() => {
            setCurrentCycle(currentLoop);
            setCurrentStepInCycle(currentStep);
            setCurrentPatternNotes(patternNoteNames);
            setCurrentNote(rootNoteName);
            setActiveNoteIndex(-1); // Root Playing
            // Initial Tip
            if (isFirstGlobalStep) {
               setCurrentTip(intl.formatMessage({ id: 'vocal.ma-exercise.tip.0' }));
            }
          }, t);
          samplerRef.current?.triggerAttackRelease(rootNoteName, rootWaitS, t);
        }, currentTime);

        currentTime += rootWaitS;

        // --- 2. Melody Phase ---
        
        // Update Tip for melody phase (random rotation after first step)
        Tone.Transport.schedule((t) => {
            Tone.Draw.schedule(() => {
                if (!isFirstGlobalStep) {
                    setCurrentTip(getRandomTip());
                }
            }, t);
        }, currentTime);

        for (let idx = 0; idx < PATTERN_OFFSETS.length; idx++) {
          const noteMidi = rootMidi + PATTERN_OFFSETS[idx];
          const noteName = Tone.Frequency(noteMidi, 'midi').toNote();
          let duration = intervalDurS;
          if (idx === 0) duration = firstDurS;
          else if (idx === PATTERN_OFFSETS.length - 1) duration = lastDurS;

          Tone.Transport.schedule((t) => {
            Tone.Draw.schedule(() => {
              setCurrentNote(noteName);
              setActiveNoteIndex(idx); // Highlight current note
            }, t);
            samplerRef.current?.triggerAttackRelease(noteName, duration, t);
          }, currentTime);
          currentTime += duration;
        }

        currentTime += postWaitS;
      }
    }

    // End playback
    Tone.Transport.schedule(() => {
      Tone.Draw.schedule(() => {
        stopExercise();
      }, Tone.Transport.seconds + 0.1);
    }, currentTime);

    Tone.Transport.start();
  }, [
    startNote,
    endNote,
    rootNoteWait,
    firstNoteDuration,
    intervalDuration,
    lastNoteDuration,
    postMelodyWait,
    loopCount,
    intl,
    getRandomTip,
    stopExercise,
  ]);

  const { status: instrumentStatus } = useInstrumentStatus('piano');

  const startSequence = useCallback(async () => {
    // Resume context first
    await Tone.context.resume();
    await Tone.start();

    const run = () => {
      if (countdown > 0) {
        let count = Math.ceil(countdown / 1000);
        setCountdownValue(count);
        timerRef.current = setInterval(() => {
          count--;
          if (count > 0) {
            setCountdownValue(count);
          } else {
            setCountdownValue(null);
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            startExercise();
          }
        }, 1000);
      } else {
        startExercise();
      }
    };

    // Check instrument status
    if (instrumentStatus === 'loaded') {
      loadInstrument('piano').then((sampler) => {
        samplerRef.current = sampler;
        run();
      });
    } else {
      console.log('Instrument not loaded, falling back to synth');
      samplerRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
      run();
    }
  }, [countdown, startExercise, instrumentStatus]);

  useEffect(() => {
    if (!visible) {
      stopExercise();
      return;
    }
    // Start sequence immediately when visible
    startSequence();
    return () => stopExercise();
  }, [visible, startSequence, stopExercise]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width="90%"
      style={{ maxWidth: 800 }}
      centered
      maskClosable={false}
      title={isPlaying ? `${currentCycle}/${loopCount} - ${currentStepInCycle}/${totalStepsInCycle}` : intl.formatMessage({ id: 'vocal.ma-exercise.title' })}
    >
      <div className="ma-exercise-player-container">
        {/* Countdown Overlay */}
        {countdownValue !== null && (
          <div className="countdown-overlay">
            <Typography.Title
              className="countdown-number"
              style={{ color: token.colorPrimary }}
            >
              {countdownValue}
            </Typography.Title>
            <Typography.Text strong className="countdown-text">
              准备开始 | Ready
            </Typography.Text>
          </div>
        )}

        {/* Main Content */}
          <Space orientation="vertical" size={32} className="player-content">
            {/* Main Display Area */}
            <div className="display-area">
              <Card
                className="display-card"
                variant="borderless"
              >
                <Typography.Text
                  strong
                  className="display-tip"
                  style={{ color: token.colorTextSecondary }}
                >
                  {isPlaying
                    ? currentTip
                    : intl.formatMessage({ id: 'vocal.ma-exercise.tip.0' })}
                </Typography.Text>
              </Card>
            </div>

            {/* Visualization Area */}
            <div className="visualization-area">
              {currentPatternNotes.length > 0 ? (
                currentPatternNotes.map((note, index) => {
                  const isCurrent = activeNoteIndex === index;
                  return (
                    <div
                      key={index}
                      className={`note-circle ${isCurrent ? 'note-circle-active' : ''}`}>
                      {note}
                    </div>
                  );
                })
              ) : (
                <Typography.Title
                  level={4}
                  type="secondary"
                  className="visualization-ready"
                >
                  READY TO TRAIN
                </Typography.Title>
              )}
            </div>

            <Space orientation="vertical" size={16} className="controls-area">
              <div
                className="current-note-name"
                style={{ color: token.colorText }}
              >
                {currentNote || '-'}
              </div>

              <Button
                type="primary"
                size="large"
                shape="round"
                icon={isPaused ? <CaretRightOutlined /> : <PauseOutlined />}
                onClick={togglePause}
                style={{ width: 160 }}
              >
                {intl.formatMessage({
                  id: isPaused
                    ? 'vocal.ma-exercise.resume'
                    : 'vocal.ma-exercise.pause',
                })}
              </Button>
            </Space>
          </Space>
      </div>
    </Modal>
  );
};

export default MaExercisePlayer;
