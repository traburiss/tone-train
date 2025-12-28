import { TrainPlayerArgs } from '@/constants';
import { getChordNotes, getNoteDetails } from '@/utils/musicTheory';
import { loadInstrument } from '@/utils/toneInstruments';
import { ExclamationCircleFilled, SoundOutlined } from '@ant-design/icons';
import { Modal, notification, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import styles from './trainPlayer.less';

const { confirm } = Modal;

export declare type TrainPlayerProps = TrainPlayerArgs & {
  open: boolean;
  onCancel: () => void;
};
let tonePlayer: Tone.Synth<Tone.SynthOptions> | Tone.Sampler | null = null;

const TrainPlayer: React.FC<TrainPlayerProps> = (props: TrainPlayerProps) => {
  const [paused, setPaused] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [currentTone, setCurrentTone] = useState<string>('...');
  const [api, contextHolder] = notification.useNotification();

  // Ref to track the sequential index (0 to length-1) across intervals
  const seqIndexRef = React.useRef(0);
  // Ref to track loop count
  const loopCountRef = React.useRef(0);

  const say = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    // User requested "operation reversed" (larger value = slower)
    // So we treat ttsRate as "Slowness Factor" or "Duration Multiplier"
    // Rate = 1 / Factor.
    const factor = props.ttsRate || 1;
    utterance.rate = 1 / factor;
    window.speechSynthesis.speak(utterance);
  };

  const playTone = async (tone: string, duration: number) => {
    if (tonePlayer !== null) {
      const chordNotes = getChordNotes(tone);
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

  const propsRef = React.useRef(props);
  propsRef.current = props;

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
      if (props.ttsSolfege) {
        ttsExtra += (props.ttsSolfegeWait || 0) + 1000;
      }
      if (props.ttsNotation) {
        ttsExtra += (props.ttsNotationWait || 0) + 1000;
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
      if (isCancelled) return;
      if (currentProps.ttsEnable) {
        // Sequential TTS logic
        // 1. Wait toneWait (gap between sound and first speech)
        await new Promise((r) => {
          ttsTimer = setTimeout(r, currentProps.toneWait || 200);
        });
        if (isCancelled) return;

        // 2. Speak Tone Name
        say(tone);

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

      setLoading(true);
      loadInstrument(props.instrumentName)
        .then((sample: Tone.Sampler) => {
          tonePlayer = sample;
        })
        .catch((e) => {
          console.error('加载音色错误，只能播放MIDI音', e);
          api['error']({
            message: '异常',
            description: '无法加载音色，只能播放MIDI音',
          });
          tonePlayer = new Tone.Synth().toDestination();
        })
        .finally(() => {
          setLoading(false);
          setPaused(false);
        });
    }
  }, [props.open]);

  const pauseTrain = () => {
    setPaused(!paused);
  };

  const confirmCancel = () => {
    setPaused(true);
    confirm({
      title: '确认停止',
      icon: <ExclamationCircleFilled />,
      content: '确认停止训练吗？',
      okText: '确认关闭',
      cancelText: '我点错了',
      onOk() {
        props.onCancel();
      },
      onCancel() {
        setPaused(false);
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={props.open}
        destroyOnHidden={true}
        width={'80%'}
        height={'80%'}
        maskClosable={false}
        okText={paused ? '恢复训练' : '暂停训练'}
        onOk={pauseTrain}
        cancelText={'停止训练'}
        onCancel={confirmCancel}
        loading={loading}
        title={loading ? '加载音色中' : '训练'}
      >
        <Result
          className={styles.trainPlayInfo}
          title={<div className="text-2xl sm:text-4xl">{currentTone}</div>}
          subTitle="当前的音是"
          icon={<SoundOutlined />}
        />
      </Modal>
    </>
  );
};

export default TrainPlayer;
