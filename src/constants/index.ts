import { Formatter } from 'antd/es/slider';

export const DEFAULT_NAME = 'Umi Max';

export type ToneType = '12Tone' | '8Tone';
export const DEFAULT_TONE_TYPE = '12Tone';
export const TONE_TYPE_OPTIONS = [
  { label: '十二音阶', value: '12Tone' },
  { label: '八度音阶', value: '8Tone' },
];

export type InstrumentName = 'guitar-acoustic' | 'guitar-electric' | 'piano';
export const DEFAULT_INSTRUMENT_NAME = 'guitar-acoustic';
export const INSTRUMENT_NAME_OPTIONS = [
  { label: '原声吉他', value: 'guitar-acoustic' },
  { label: '电吉他', value: 'guitar-electric' },
  { label: '钢琴', value: 'piano' },
];

export const MAJOR_SCALE = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const CHROMATIC_SCALE = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const OCTAVES = [2, 3, 4, 5, 6];

export const TONE_LIST_8 = OCTAVES.flatMap((oct) =>
  MAJOR_SCALE.map((note) => `${note}${oct}`),
);
export const TONE_LIST_12 = OCTAVES.flatMap((oct) =>
  CHROMATIC_SCALE.map((note) => `${note}${oct}`),
);

// Default select octaves 3, 4, 5
export const DEFAULT_TONE_LIST = [3, 4, 5].flatMap((oct) =>
  MAJOR_SCALE.map((note) => `${note}${oct}`),
);

export const LOOP_COUNT_OPTIONS = [
  { label: '无限循环', value: 0 },
  { label: '10次', value: 10 },
  { label: '20次', value: 20 },
  { label: '50次', value: 50 },
];

export const DEFAULT_TTS_ENABLE = true;

export const MIX_DURATION = 100;
export const MAX_DURATION = 10 * 1000;
export const DURATION_STEP = 100;
export const DURATION_FORMATTER: Formatter = (value: any) => `${value} 毫秒`;
export const DEFAULT_TONE_DURATION = 1000;
export const DEFAULT_TONE_WAIT = 1500;
export const DEFAULT_TTS_WAIT = 1500;

export const DEFAULT_RANDOM = true;

export declare type TrainPlayerArgs = {
  toneType: ToneType;
  instrumentName: InstrumentName;
  toneList: string[];
  toneDuration: number; // ms
  toneWait: number; // ms,
  ttsEnable: boolean;
  ttsWait: number;
  random: boolean;
  loopCount: number;
  referenceNoteEnabled: boolean;
  referenceNote: string;
};

export const DEFAULT_TRAIN_PLAYER_ARGS: TrainPlayerArgs = {
  toneType: DEFAULT_TONE_TYPE,
  instrumentName: DEFAULT_INSTRUMENT_NAME,
  toneList: DEFAULT_TONE_LIST,
  toneDuration: DEFAULT_TONE_DURATION,
  toneWait: DEFAULT_TONE_WAIT,
  ttsEnable: DEFAULT_TTS_ENABLE,
  ttsWait: DEFAULT_TTS_WAIT,
  random: DEFAULT_RANDOM,
  loopCount: 0,
  referenceNoteEnabled: false,
  referenceNote: 'C4',
};
