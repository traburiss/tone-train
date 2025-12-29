import { Formatter } from 'antd/es/slider';

export const DEFAULT_NAME = 'Umi Max';

export type ToneType = 'GuitarChords' | '12Tone' | '8Tone';
export const DEFAULT_TONE_TYPE = 'GuitarChords';
export const TONE_TYPE_OPTIONS = [
  { label: '吉他和弦', value: 'GuitarChords' },
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

export const TONE_LIST_CHORDS = [
  'C',
  'D',
  'E',
  'F',
  'G',
  'A',
  'B',
  'Em',
  'Am',
  'Dm',
  'Bm',
  'F#m',
  'C#m',
  'Gm',
  'C5',
  'D5',
  'E5',
  'F5',
  'G5',
  'A5',
  'B5',
  // 7
  'G7',
  'C7',
  'D7',
  'E7',
  'A7',
  'B7',
  // maj7
  'Cmaj7',
  'Gmaj7',
  'Fmaj7',
  'Amaj7',
  // m7
  'Am7',
  'Em7',
  'Dm7',
  'Bm7',
  'F#m7',
  // sus
  'Dsus4',
  'Asus4',
  'Esus4',
  // slash
  'D/F#',
  'C/G',
  'G/B',
];

export const DEFAULT_GUITAR_CHORDS = ['C', 'D', 'G', 'A', 'Em', 'Am', 'Dm'];

// Default select common chords
export const DEFAULT_TONE_LIST = ['C', 'D', 'G', 'A', 'Em', 'Am', 'Dm'];

export const LOOP_COUNT_OPTIONS = [
  { label: '无限', value: '0' },
  { label: '20次', value: '20' },
  { label: '50次', value: '50' },
  { label: '200次', value: '200' },
  { label: '手动输入', value: 'custom' },
];

export const DEFAULT_TTS_ENABLE = true;
export const DEFAULT_TTS_SOLFEGE = false;
export const DEFAULT_TTS_SOLFEGE_WAIT = 1500;
export const DEFAULT_TTS_NOTATION = false;
export const DEFAULT_TTS_NOTATION_WAIT = 1500;

export const MIX_DURATION = 100;
export const MAX_DURATION = 10 * 1000;
export const DURATION_STEP = 100;
export const DURATION_FORMATTER: Formatter = (value: any) => {
  const ms = Number(value);
  if (isNaN(ms)) return `${value}`;

  const seconds = Math.floor(ms / 1000);
  let timeStr = '';

  if (seconds < 60) {
    timeStr = `${seconds}秒`;
  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timeStr = `${minutes}分`;
    if (remainingSeconds > 0) {
      timeStr += `${remainingSeconds}秒`;
    }
  }

  return `${ms} 毫秒 (${timeStr})`;
};
export const DEFAULT_TONE_DURATION = 1000;
export const DEFAULT_TONE_WAIT = 1500;
export const DEFAULT_TTS_WAIT = 2000;
export const DEFAULT_TTS_RATE = 1;

export const DEFAULT_RANDOM = true;

export declare type TrainPlayerArgs = {
  toneType: ToneType;
  instrumentName: InstrumentName;
  toneList: string[];
  toneDuration: number; // ms
  toneWait: number; // ms,
  ttsEnable: boolean;
  ttsWait: number;
  ttsRate: number; // 0.1 ~ 10
  ttsSolfege: boolean;
  ttsSolfegeWait: number;
  ttsNotation: boolean;
  ttsNotationWait: number;
  random: boolean;
  loopCount: number;
  referenceNoteEnabled: boolean;
  referenceNote: string;
};

export const REFERENCE_NOTE_OPTIONS = [
  { label: 'C2', value: 'C2' },
  { label: 'C3', value: 'C3' },
  { label: 'C4', value: 'C4' },
  { label: 'C5', value: 'C5' },
  { label: 'C6', value: 'C6' },
];

export const DEFAULT_TRAIN_PLAYER_ARGS: TrainPlayerArgs = {
  toneType: DEFAULT_TONE_TYPE,
  instrumentName: DEFAULT_INSTRUMENT_NAME,
  toneList: DEFAULT_TONE_LIST,
  toneDuration: DEFAULT_TONE_DURATION,
  toneWait: DEFAULT_TONE_WAIT,
  ttsEnable: DEFAULT_TTS_ENABLE,
  ttsWait: DEFAULT_TTS_WAIT,
  ttsRate: DEFAULT_TTS_RATE,
  ttsSolfege: DEFAULT_TTS_SOLFEGE,
  ttsSolfegeWait: DEFAULT_TTS_SOLFEGE_WAIT,
  ttsNotation: DEFAULT_TTS_NOTATION,
  ttsNotationWait: DEFAULT_TTS_NOTATION_WAIT,
  random: DEFAULT_RANDOM,
  loopCount: 0,
  referenceNoteEnabled: false,
  referenceNote: 'C4',
};

export const STORAGE_PREFIX = 'mta:cfg:';
export const STATS_PREFIX = 'mta:sta:';

export const TONES_TRAINING_STORAGE_KEY = 'tones:training';
export const TONES_IDENTIFICATION_STORAGE_KEY = 'tones:identification';

export const CONFIG_kEY_LIST = [
  {
    name: '听音训练',
    key: TONES_TRAINING_STORAGE_KEY,
  },
  {
    name: '听音判断',
    key: TONES_IDENTIFICATION_STORAGE_KEY,
  },
];
