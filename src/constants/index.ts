import { Formatter } from 'antd/es/slider';

export const DEFAULT_NAME = 'Umi Max';

export type ToneType = '8Tone' | '12Tone';
export const DEFAULT_TONE_TYPE = '8Tone';
export const TONE_TYPE_OPTIONS = [
  { label: '八度音阶', value: '8Tone' },
  { label: '十二音阶', value: '12Tone' },
];

export type TimberType = 'guitar-acoustic' | 'guitar-electric' | 'piano';
export const DEFAULT_TIMBRE_TYPE = 'guitar-acoustic';
export const TIMBRE_TYPE_OPTIONS = [
  { label: '原声吉他', value: 'guitar-acoustic' },
  { label: '电吉他', value: 'guitar-electric' },
  { label: '钢琴', value: 'piano' },
];

export const DEFAULT_TONE_LIST = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

export const DEFAULT_TTS_ENABLE = true;

export const MIX_DURATION = 1000;
export const MAX_DURATION = 10 * 1000;
export const DURATION_STEP = 100;
export const DURATION_FORMATTER: Formatter = (value: any) => `${value} 毫秒`;
export const DEFAULT_TONE_DURATION = 2000;
export const DEFAULT_TONE_WAIT = 2000;
export const DEFAULT_TTS_WAIT = 2000;

export const DEFAULT_RANDOM = true;

export declare type TrainPlayerArgs = {
  toneType: ToneType;
  timbreType: TimberType;
  toneList: string[];
  toneDuration: number; // ms
  toneWait: number; // ms,
  ttsEnable: boolean;
  ttsWait: number;
  random: boolean;
};

export const DEFAULT_TRAIN_PLAYER_ARGS: TrainPlayerArgs = {
  toneType: DEFAULT_TONE_TYPE,
  timbreType: DEFAULT_TIMBRE_TYPE,
  toneList: DEFAULT_TONE_LIST,
  toneDuration: DEFAULT_TONE_DURATION,
  toneWait: DEFAULT_TONE_WAIT,
  ttsEnable: DEFAULT_TTS_ENABLE,
  ttsWait: DEFAULT_TTS_WAIT,
  random: DEFAULT_RANDOM,
};
