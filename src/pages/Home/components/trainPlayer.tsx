import { TrainPlayerArgs } from '@/constants';
import { ExclamationCircleFilled, SoundOutlined } from '@ant-design/icons';
import { Modal, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import styles from './trainPlayer.less';

const { confirm } = Modal;

export declare type TrainPlayerProps = TrainPlayerArgs & {
  open: boolean;
  onCancel: () => void;
};
const initIndex = 1;
const synth = new Tone.Synth().toDestination();
const TrainPlayer: React.FC<TrainPlayerProps> = (props: TrainPlayerProps) => {
  const [paused, setPaused] = useState<boolean>(true);
  const [nextIndex, setNextIndex] = useState(initIndex);

  const sayTone = (tone: string) => {
    const utterance = new SpeechSynthesisUtterance(tone);
    window.speechSynthesis.speak(utterance);
  };

  const playTone = (index: number, props: TrainPlayerProps) => {
    const { toneList, toneDuration, toneWait } = props;
    const tone = toneList[index];
    console.info('playTone', tone, toneDuration);
    const start = Tone.now();
    const end = start + toneDuration / 1000;
    synth.triggerAttack(tone, start);
    synth.triggerRelease(end);
    if (props.ttsEnable) {
      return setTimeout(() => {
        sayTone(toneList[index]);
      }, toneDuration + toneWait);
    } else {
      return null;
    }
  };

  useEffect(() => {
    console.info('useEffect 1 ', paused);
    if (paused) {
      synth.triggerRelease(Tone.now());
      return;
    }
    console.info('useEffect 2 ', props);
    const toneLen = props.toneList.length;
    const totalWait = props.toneDuration + props.toneWait + props.ttsWait;
    let ttsTimer = playTone(nextIndex - 1, props);
    const timer = setInterval(() => {
      setNextIndex((prev) => {
        ttsTimer = playTone(prev, props);
        return prev < toneLen ? prev + 1 : initIndex;
      });
    }, totalWait);
    return () => {
      clearInterval(timer);
      if (ttsTimer !== null) {
        clearTimeout(ttsTimer);
      }
    };
  }, [paused]);

  useEffect(() => {
    console.info('open 1 ', props);
    if (props.open) {
      console.info('open 2 ');
      setNextIndex(initIndex);
      setPaused(false);
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
    >
      <div>{JSON.stringify(props)}</div>
      <Result
        className={styles.trainPlayInfo}
        title={props.toneList ? props?.toneList[nextIndex - 1] : '没有任何音'}
        subTitle="当前的音是"
        icon={<SoundOutlined />}
      />
    </Modal>
  );
};

export default TrainPlayer;
