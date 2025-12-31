import ChordDiagram from '@/components/ChordDiagram';
import { TrainPlayerArgs } from '@/constants';
import { useInstrumentStatus } from '@/hooks/useInstrumentStatus';
import {
  CHORD_FINGERINGS,
  getChordNotes,
  getNoteDetails,
} from '@/utils/musicTheory';
import { loadInstrument } from '@/utils/toneInstruments';
import { SoundOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Modal, notification, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import styles from './trainPlayer.less';

export declare type TrainPlayerProps = TrainPlayerArgs & {
  open: boolean;
  onCancel: () => void;
};
let tonePlayer:
  | Tone.Synth<Tone.SynthOptions>
  | Tone.Sampler
  | Tone.PolySynth
  | null = null;

const TrainPlayer: React.FC<TrainPlayerProps> = (props: TrainPlayerProps) => {
  const [paused, setPaused] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [currentTone, setCurrentTone] = useState<string>('...');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [, contextHolder] = notification.useNotification();
  const intl = useIntl();

  // Ref to track the sequential index (0 to length-1) across intervals
  const seqIndexRef = React.useRef(0);
  // Ref to track loop count
  const loopCountRef = React.useRef(0);

  const say = (text: string) => {
    let processedText = text;

    // Mapping for Solfege to ensure standard musical pronunciation
    const SOLFEGE_MAP: Record<string, string> = {
      Do: 'Duo',
      Re: 'Rui',
      // Mi stays Mi
      Fa: 'Fa',
      Sol: 'Suo',
      La: 'La',
      Si: 'Xi',
      升: 'Sheng ',
      降: 'Jiang ',
    };

    // Handle Solfege transformations
    Object.entries(SOLFEGE_MAP).forEach(([key, value]) => {
      const regex = new RegExp(key, 'g');
      processedText = processedText.replace(regex, value);
    });

    // Transform musical terms for better TTS pronunciation
    processedText = processedText
      .replace(/#/g, ' sharp')
      .replace(/m($|7)/g, ' minor$1') // Am -> A minor, Am7 -> A minor 7
      .replace(/maj/g, ' major ')
      .replace(/sus/g, ' suspended ')
      .replace(/\//g, ' over ')
      .replace(/([A-G])(\d)/g, '$1 $2') // "C 4" instead of "C4", but keeps "Duo" intact
      .trim();

    const utterance = new SpeechSynthesisUtterance(processedText);
    // User requested "operation reversed" (larger value = slower)
    // So we treat ttsRate as "Slowness Factor" or "Duration Multiplier"
    // Rate = 1 / Factor.
    const factor = props.ttsRate || 1;
    utterance.rate = 1 / factor;
    window.speechSynthesis.speak(utterance);
  };

  const propsRef = React.useRef(props);
  propsRef.current = props;

  const playTone = async (tone: string, duration: number) => {
    // Show hint if playing via MIDI (not fully loaded)
    // Removed toast message as per user request to show next to tone name

    if (tonePlayer !== null) {
      let chordNotes: string[] = [];
      // Only resolve chords if explicitly in GuitarChords mode to avoid
      // collisions with single notes (e.g., C5, D5, E5)
      if (propsRef.current.toneType === 'GuitarChords') {
        chordNotes = getChordNotes(tone);
      }

      if (chordNotes.length > 0) {
        // Play chord
        // Use a small stagger or just play all at once?
        // Trigger attack for all notes
        (tonePlayer as any).triggerAttackRelease(chordNotes, duration / 1000);
      } else {
        // Single note
        tonePlayer.triggerAttackRelease(tone, duration / 1000);
      }
    }
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  };

  const totalWaitTime = React.useMemo(() => {
    const base =
      (props.toneDuration || 0) +
      (props.toneWait || 0) +
      (props.ttsWait || 0) +
      (props.referenceNoteEnabled
        ? (props.toneDuration || 0) + (props.toneWait || 0)
        : 0);

    let ttsExtra = 0;
    if (props.ttsEnable) {
      // Estimate 1s per speech utterance to be safe + configured waits
      ttsExtra += 1000;
      if (propsRef.current.toneType !== 'GuitarChords') {
        if (props.ttsSolfege) {
          ttsExtra += (props.ttsSolfegeWait || 0) + 1000;
        }
        if (props.ttsNotation) {
          ttsExtra += (props.ttsNotationWait || 0) + 1000;
        }
      }
    }

    return Math.max(base + ttsExtra, 500); // Minimum 500ms safety
  }, [
    props.toneDuration,
    props.toneWait,
    props.ttsWait,
    props.referenceNoteEnabled,
    props.ttsEnable,
    props.ttsSolfege,
    props.ttsSolfegeWait,
    props.ttsNotation,
    props.ttsNotationWait,
  ]);

  useEffect(() => {
    if (paused || !props.open) {
      if (tonePlayer !== null) {
        tonePlayer.triggerRelease(Tone.now());
      }
      return;
    }

    let isCancelled = false;
    let ttsTimer: NodeJS.Timeout | null = null;
    let refWaitTimer: NodeJS.Timeout | null = null;

    const runStep = async () => {
      if (isCancelled) return;

      const currentProps = propsRef.current;
      const toneLen = currentProps.toneList.length;
      if (toneLen === 0) return;

      // 1. Determine target index
      let targetIdx = 0;
      if (currentProps.random) {
        targetIdx = Math.floor(Math.random() * toneLen);
      } else {
        targetIdx = seqIndexRef.current;
      }

      // 2. Get Tone
      const tone = currentProps.toneList[targetIdx];

      // 3. Update State for Display
      setCurrentTone(tone);
      setShowResult(false);

      // 4. Update Sequential Logic for NEXT time
      if (!currentProps.random) {
        seqIndexRef.current++;
        if (seqIndexRef.current >= toneLen) {
          seqIndexRef.current = 0;
          loopCountRef.current++;

          // Check loop termination
          if (
            Number(currentProps.loopCount) > 0 &&
            loopCountRef.current >= Number(currentProps.loopCount)
          ) {
            setPaused(true);
            return;
          }
        }
      } else {
        seqIndexRef.current++;
        if (seqIndexRef.current >= toneLen) {
          seqIndexRef.current = 0;
          loopCountRef.current++;
          if (
            Number(currentProps.loopCount) > 0 &&
            loopCountRef.current >= Number(currentProps.loopCount)
          ) {
            setPaused(true);
            return;
          }
        }
      }

      // 5. Execute Playback
      if (currentProps.referenceNoteEnabled && currentProps.referenceNote) {
        if (isCancelled) return;
        await playTone(currentProps.referenceNote, currentProps.toneDuration);

        if (isCancelled) return;
        await new Promise((r) => {
          refWaitTimer = setTimeout(r, currentProps.toneWait);
        });
      }

      if (isCancelled) return;
      await playTone(tone, currentProps.toneDuration);

      if (isCancelled) return;
      if (!currentProps.ttsEnable) {
        setShowResult(true);
      }

      if (isCancelled) return;
      if (currentProps.ttsEnable) {
        // Sequential TTS logic
        // 1. Wait toneWait (gap between sound and first speech)
        await new Promise((r) => {
          ttsTimer = setTimeout(r, currentProps.toneWait || 200);
        });
        if (isCancelled) return;

        // 2. Speak Tone Name
        setShowResult(true);
        say(tone);

        // 吉他不需要播放唱名和简谱
        if (propsRef.current.toneType === 'GuitarChords') {
          return;
        }
        // 3. Solfege
        if (currentProps.ttsSolfege) {
          await new Promise((r) => {
            ttsTimer = setTimeout(r, currentProps.ttsSolfegeWait || 500);
          });
          if (isCancelled) return;
          const { solfege } = getNoteDetails(tone);
          if (solfege) {
            say(solfege);
            setCurrentTone((prev) => `${prev} ${solfege}`);
          }
        }

        // 4. Notation
        if (currentProps.ttsNotation) {
          await new Promise((r) => {
            ttsTimer = setTimeout(r, currentProps.ttsNotationWait || 500);
          });
          if (isCancelled) return;
          const { number } = getNoteDetails(tone);
          if (number) {
            say(number);
            setCurrentTone((prev) => `${prev} ${number}`);
          }
        }
      }
    };

    runStep();
    const timer = setInterval(runStep, totalWaitTime);

    return () => {
      isCancelled = true;
      clearInterval(timer);
      if (ttsTimer) clearTimeout(ttsTimer);
      if (refWaitTimer) clearTimeout(refWaitTimer);
      // Stop any currently playing sound immediately
      if (tonePlayer !== null) {
        tonePlayer.triggerRelease(Tone.now());
      }
    };
  }, [paused, props.open, totalWaitTime]);

  useEffect(() => {
    if (props.open) {
      // Reset logic state
      seqIndexRef.current = 0;
      loopCountRef.current = 0;
      setCurrentTone('...');
      setShowResult(false);

      // Optimistic UI: Start with Synth immediately
      setLoading(false);
      if (!tonePlayer) {
        tonePlayer = new Tone.PolySynth(Tone.Synth).toDestination();
      }

      loadInstrument(props.instrumentName)
        .then((sample: Tone.Sampler) => {
          tonePlayer = sample;
        })
        .catch((e) => {
          console.error('加载音色错误，降级使用Synth', e);
        });
      setPaused(false);
    }
  }, [props.open]);

  const pauseTrain = () => {
    setPaused(!paused);
  };

  const { status } = useInstrumentStatus(props.instrumentName);

  const getHintTitle = () => {
    if (status === 'loading') {
      return (
        <>
          <div>{intl.formatMessage({ id: 'tone-training.current-tone' })}</div>
          <div className="text-yellow-600 text-sm">
            {intl.formatMessage({
              id: 'tone-training.instrument-loading-hint',
            })}
          </div>
        </>
      );
    }
    if (status === 'error') {
      return (
        <>
          <div>{intl.formatMessage({ id: 'tone-training.current-tone' })}</div>
          <div className="text-red-600 text-sm">
            {intl.formatMessage({ id: 'tone-training.instrument-error-hint' })}
          </div>
        </>
      );
    }
    return intl.formatMessage({ id: 'tone-training.current-tone' });
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={props.open}
        destroyOnHidden
        width="90%"
        style={{ maxWidth: 800 }}
        centered
        maskClosable={false}
        okText={
          paused
            ? intl.formatMessage({ id: 'tone-training.resume' })
            : intl.formatMessage({ id: 'tone-training.pause' })
        }
        onOk={pauseTrain}
        cancelText={intl.formatMessage({ id: 'tone-training.stop' })}
        onCancel={() => {
          props.onCancel();
        }}
        loading={loading}
        title={
          loading
            ? intl.formatMessage({ id: 'tone-training.instrument-loading' })
            : intl.formatMessage({ id: 'tone-training.title' })
        }
      >
        <Result
          className={styles.trainPlayInfo}
          title={getHintTitle()}
          subTitle={
            <div className="text-2xl sm:text-4xl flex items-center justify-center gap-2">
              {showResult ? currentTone : '?'}
            </div>
          }
          icon={
            showResult && CHORD_FINGERINGS[currentTone] ? (
              <div className="flex justify-center">
                <ChordDiagram
                  name={currentTone}
                  fingering={CHORD_FINGERINGS[currentTone]}
                  width={100}
                  height={140}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[140px]">
                <SoundOutlined className="text-6xl text-blue-400 animate-pulse" />
              </div>
            )
          }
        />
      </Modal>
    </>
  );
};

export default TrainPlayer;
