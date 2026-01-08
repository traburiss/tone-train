import { useInstrumentStatus } from '@/hooks/useInstrumentStatus';
import { loadInstrument } from '@/utils/toneInstruments';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import {
  Alert,
  Button,
  Card,
  Modal,
  Space,
  Typography,
  message,
  theme,
} from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import './VocalExercisePlayer.less';

interface VocalExercisePlayerProps {
  visible: boolean;
  onClose: () => void;
  patternOffsets: number[]; // e.g. [7, 5, 4, 2, 0] or [0, 2, 4, 5, 7, 5, 4, 2, 0]
  localizationPrefix: string;
  startNote: string;
  endNote: string;
  rootNoteWait: number;
  firstNoteDuration: number;
  intervalDuration: number;
  lastNoteDuration: number;
  postMelodyWait: number;
  loopCount: number;
  countdown: number;
  bpm: number;
}

const VocalExercisePlayer: React.FC<VocalExercisePlayerProps> = ({
  visible,
  onClose,
  patternOffsets,
  localizationPrefix,
  startNote,
  endNote,
  rootNoteWait = 1500,
  firstNoteDuration = 1500,
  intervalDuration = 500,
  lastNoteDuration = 1500,
  postMelodyWait = 1000,
  loopCount = 2,
  countdown = 3000,
  bpm = 60,
}) => {
  const intl = useIntl();
  const { token } = theme.useToken();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [usingMidi, setUsingMidi] = useState(false);

  // Progress Tracking
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalStepsInCycle, setTotalStepsInCycle] = useState(0);
  const [currentStepInCycle, setCurrentStepInCycle] = useState(1);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);

  const [currentNote, setCurrentNote] = useState<string>('');
  const [currentTip, setCurrentTip] = useState<string>('');
  const [currentPatternNotes, setCurrentPatternNotes] = useState<string[]>([]);
  const samplerRef = useRef<Tone.Sampler | Tone.PolySynth | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load tips
  const tips = useRef<string[]>([]);
  useEffect(() => {
    const loadedTips: string[] = [];
    let i = 1;
    while (true) {
      const id = `${localizationPrefix}.tip.${i}`;
      const text = intl.formatMessage({ id, defaultMessage: 'END' });
      if (text === 'END' || text === id) break;
      loadedTips.push(text);
      i++;
    }
    tips.current = loadedTips;
  }, [localizationPrefix, intl]);

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
    if (tips.current.length === 0) return '';
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
    Tone.Transport.bpm.value = bpm;

    const startMidi = Tone.Frequency(startNote).toMidi();
    const endMidi = Tone.Frequency(endNote).toMidi();
    const direction = endMidi >= startMidi ? 1 : -1;
    const totalSteps = Math.abs(endMidi - startMidi);
    setTotalStepsInCycle(totalSteps + 1);

    let currentTime = 0;

    // Convert ms to s
    const rootWaitS = rootNoteWait / 1000;
    const firstDurS = firstNoteDuration / 1000;
    const intervalDurS = intervalDuration / 1000;
    const lastDurS = lastNoteDuration / 1000;
    const postWaitS = postMelodyWait / 1000;

    for (let loop = 0; loop < loopCount; loop++) {
      for (let i = 0; i <= totalSteps; i++) {
        const rootMidi = startMidi + i * direction;
        const rootNoteName = Tone.Frequency(rootMidi, 'midi').toNote();
        const patternNoteNames = patternOffsets.map((offset) =>
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
            if (isFirstGlobalStep) {
              setCurrentTip(
                intl.formatMessage({ id: `${localizationPrefix}.tip.0` }),
              );
            }
          }, t);
          samplerRef.current?.triggerAttackRelease(rootNoteName, rootWaitS, t);
        }, currentTime);

        currentTime += rootWaitS;

        // --- 2. Melody Phase ---
        Tone.Transport.schedule((t) => {
          Tone.Draw.schedule(() => {
            if (!isFirstGlobalStep) {
              setCurrentTip(getRandomTip());
            }
          }, t);
        }, currentTime);

        for (let idx = 0; idx < patternOffsets.length; idx++) {
          const noteMidi = rootMidi + patternOffsets[idx];
          const noteName = Tone.Frequency(noteMidi, 'midi').toNote();
          let duration = intervalDurS;
          if (idx === 0) duration = firstDurS;
          else if (idx === patternOffsets.length - 1) duration = lastDurS;

          Tone.Transport.schedule((t) => {
            Tone.Draw.schedule(() => {
              setCurrentNote(noteName);
              setActiveNoteIndex(idx);
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
    bpm,
    intl,
    getRandomTip,
    stopExercise,
    patternOffsets,
    localizationPrefix,
  ]);

  const { status: instrumentStatus } = useInstrumentStatus('piano');
  const instrumentStatusRef = useRef(instrumentStatus);
  instrumentStatusRef.current = instrumentStatus;

  const startSequence = useCallback(async () => {
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

    if (instrumentStatusRef.current === 'loaded') {
      loadInstrument('piano').then((sampler) => {
        samplerRef.current = sampler;
        setUsingMidi(false);
        run();
      });
    } else {
      console.log('Instrument not loaded, falling back to synth');
      samplerRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
      setUsingMidi(true);
      run();
    }
  }, [countdown, startExercise]);

  useEffect(() => {
    if (visible && usingMidi && instrumentStatus === 'loaded') {
      loadInstrument('piano').then((sampler) => {
        samplerRef.current = sampler;
        setUsingMidi(false);
        message.success(
          intl.formatMessage({ id: 'vocal.ma-exercise.piano-loaded' }),
        );
      });
    }
  }, [visible, usingMidi, instrumentStatus, intl]);

  useEffect(() => {
    if (!visible) {
      stopExercise();
      return;
    }
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
      title={
        isPlaying
          ? `${currentCycle}/${loopCount} - ${currentStepInCycle}/${totalStepsInCycle}`
          : intl.formatMessage({ id: `${localizationPrefix}.title` })
      }
    >
      <div className="vocal-player-container">
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
              {intl.formatMessage({ id: `vocal.ready` })}
            </Typography.Text>
          </div>
        )}

        {usingMidi && (
          <Alert
            type="warning"
            showIcon
            title={intl.formatMessage({ id: 'vocal.ma-exercise.midi-warning' })}
            style={{ marginBottom: 16 }}
            closable
          />
        )}

        {/* Main Content */}
        <Space orientation="vertical" size={32} className="player-content">
          {/* Main Display Area */}
          <div className="display-area">
            <Card className="display-card" variant="borderless">
              <Typography.Text
                strong
                className="display-tip"
                style={{ color: token.colorTextSecondary }}
              >
                {isPlaying
                  ? currentTip
                  : intl.formatMessage({ id: `${localizationPrefix}.tip.0` })}
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
                    className={`note-circle ${isCurrent ? 'note-circle-active' : ''}`}
                  >
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

export default VocalExercisePlayer;
