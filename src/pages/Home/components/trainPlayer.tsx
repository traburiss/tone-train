import { TrainPlayerArgs } from '@/constants';
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
const initIndex = 1;
let tonePlayer: Tone.Synth<Tone.SynthOptions> | Tone.Sampler | null = null;

const TrainPlayer: React.FC<TrainPlayerProps> = (props: TrainPlayerProps) => {
  const [paused, setPaused] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [nextIndex, setNextIndex] = useState(initIndex);
  const [api, contextHolder] = notification.useNotification();

  const sayTone = (tone: string) => {
    const utterance = new SpeechSynthesisUtterance(tone);
    window.speechSynthesis.speak(utterance);
  };

  const playTone = async (tone: string, duration: number) => {
    console.info('playTone', tone, duration);
    if (tonePlayer !== null) {
      tonePlayer.triggerAttackRelease(tone, duration / 1000);
    }
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  };

  const totalWaitTime =
    props.toneDuration +
    props.toneWait +
    props.ttsWait +
    (props.referenceNoteEnabled ? props.toneDuration + props.toneWait : 0);

  useEffect(() => {
    if (paused) {
      if (tonePlayer !== null) {
        tonePlayer.triggerRelease(Tone.now());
      }
      return;
    }

    let currentLoop = 0;
    const toneLen = props.toneList.length;

    const runStep = async () => {
      setNextIndex((prev) => {
        const idx = prev - 1;

        // Determine target note
        let targetIdx = idx;
        if (props.random) {
          targetIdx = Math.floor(Math.random() * toneLen);
        }
        const tone = props.toneList[targetIdx];

        // Play sequence
        const sequence = async () => {
          if (props.referenceNoteEnabled && props.referenceNote) {
            await playTone(props.referenceNote, props.toneDuration);
            await new Promise((r) => {
              setTimeout(r, props.toneWait);
            });
          }
          await playTone(tone, props.toneDuration);
          if (props.ttsEnable) {
            setTimeout(() => sayTone(tone), props.toneWait);
          }
        };
        sequence();

        // Handle loop count
        const isLast = prev >= toneLen;
        if (isLast) {
          currentLoop++;
          if (props.loopCount > 0 && currentLoop >= props.loopCount) {
            setPaused(true);
            return initIndex;
          }
        }

        return isLast ? initIndex : prev + 1;
      });
    };

    runStep();
    const timer = setInterval(runStep, totalWaitTime);

    return () => {
      clearInterval(timer);
    };
  }, [paused, props]); // Added props to dependency array as it's used inside useEffect

  useEffect(() => {
    console.info('open 1 ', props);
    if (props.open) {
      console.info('open 2 ');
      setNextIndex(initIndex);
      setLoading(true);
      console.info(`open 3 load instrumentName ${props.instrumentName}`);
      loadInstrument(props.instrumentName)
        .then((sample: Tone.Sampler) => {
          console.info(`load instrumentName ${props.instrumentName} success`);
          tonePlayer = sample;
        })
        .catch((e: any) => {
          console.info(`load instrumentName ${props.instrumentName} error`, e);
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
        destroyOnClose={true}
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
        <div>{JSON.stringify(props)}</div>
        <Result
          className={styles.trainPlayInfo}
          title={props.toneList ? props?.toneList[nextIndex - 1] : '没有任何音'}
          subTitle="当前的音是"
          icon={<SoundOutlined />}
        />
      </Modal>
    </>
  );
};

export default TrainPlayer;
