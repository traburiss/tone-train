import * as Tone from 'tone';

const toneSamplerMap: Record<string, Record<string, string>> = {
  'bass-electric': {
    'A#1': 'As1.ogg',
    'A#2': 'As2.ogg',
    'A#3': 'As3.ogg',
    'A#4': 'As4.ogg',
    'C#1': 'Cs1.ogg',
    'C#2': 'Cs2.ogg',
    'C#3': 'Cs3.ogg',
    'C#4': 'Cs4.ogg',
    E1: 'E1.ogg',
    E2: 'E2.ogg',
    E3: 'E3.ogg',
    E4: 'E4.ogg',
    G1: 'G1.ogg',
    G2: 'G2.ogg',
    G3: 'G3.ogg',
    G4: 'G4.ogg',
  },
  bassoon: {
    A4: 'A4.ogg',
    C3: 'C3.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    E4: 'E4.ogg',
    G2: 'G2.ogg',
    G3: 'G3.ogg',
    G4: 'G4.ogg',
    A2: 'A2.ogg',
    A3: 'A3.ogg',
  },

  cello: {
    E3: 'E3.ogg',
    E4: 'E4.ogg',
    F2: 'F2.ogg',
    F3: 'F3.ogg',
    F4: 'F4.ogg',
    'F#3': 'Fs3.ogg',
    'F#4': 'Fs4.ogg',
    G2: 'G2.ogg',
    G3: 'G3.ogg',
    G4: 'G4.ogg',
    'G#2': 'Gs2.ogg',
    'G#3': 'Gs3.ogg',
    'G#4': 'Gs4.ogg',
    A2: 'A2.ogg',
    A3: 'A3.ogg',
    A4: 'A4.ogg',
    'A#2': 'As2.ogg',
    'A#3': 'As3.ogg',
    B2: 'B2.ogg',
    B3: 'B3.ogg',
    B4: 'B4.ogg',
    C2: 'C2.ogg',
    C3: 'C3.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    'C#3': 'Cs3.ogg',
    'C#4': 'Cs4.ogg',
    D2: 'D2.ogg',
    D3: 'D3.ogg',
    D4: 'D4.ogg',
    'D#2': 'Ds2.ogg',
    'D#3': 'Ds3.ogg',
    'D#4': 'Ds4.ogg',
    E2: 'E2.ogg',
  },

  clarinet: {
    D4: 'D4.ogg',
    D5: 'D5.ogg',
    D6: 'D6.ogg',
    F3: 'F3.ogg',
    F4: 'F4.ogg',
    F5: 'F5.ogg',
    'F#6': 'Fs6.ogg',
    'A#3': 'As3.ogg',
    'A#4': 'As4.ogg',
    'A#5': 'As5.ogg',
    D3: 'D3.ogg',
  },

  contrabass: {
    C2: 'C2.ogg',
    'C#3': 'Cs3.ogg',
    D2: 'D2.ogg',
    E2: 'E2.ogg',
    E3: 'E3.ogg',
    'F#1': 'Fs1.ogg',
    'F#2': 'Fs2.ogg',
    G1: 'G1.ogg',
    'G#2': 'Gs2.ogg',
    'G#3': 'Gs3.ogg',
    A2: 'A2.ogg',
    'A#1': 'As1.ogg',
    B3: 'B3.ogg',
  },

  flute: {
    A6: 'A6.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    C6: 'C6.ogg',
    C7: 'C7.ogg',
    E4: 'E4.ogg',
    E5: 'E5.ogg',
    E6: 'E6.ogg',
    A4: 'A4.ogg',
    A5: 'A5.ogg',
  },

  'french-horn': {
    D3: 'D3.ogg',
    D5: 'D5.ogg',
    'D#2': 'Ds2.ogg',
    F3: 'F3.ogg',
    F5: 'F5.ogg',
    G2: 'G2.ogg',
    A1: 'A1.ogg',
    A3: 'A3.ogg',
    C2: 'C2.ogg',
    C4: 'C4.ogg',
  },

  'guitar-acoustic': {
    F4: 'F4.ogg',
    'F#2': 'Fs2.ogg',
    'F#3': 'Fs3.ogg',
    'F#4': 'Fs4.ogg',
    G2: 'G2.ogg',
    G3: 'G3.ogg',
    G4: 'G4.ogg',
    'G#2': 'Gs2.ogg',
    'G#3': 'Gs3.ogg',
    'G#4': 'Gs4.ogg',
    A2: 'A2.ogg',
    A3: 'A3.ogg',
    A4: 'A4.ogg',
    'A#2': 'As2.ogg',
    'A#3': 'As3.ogg',
    'A#4': 'As4.ogg',
    B2: 'B2.ogg',
    B3: 'B3.ogg',
    B4: 'B4.ogg',
    C3: 'C3.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    'C#3': 'Cs3.ogg',
    'C#4': 'Cs4.ogg',
    'C#5': 'Cs5.ogg',
    D2: 'D2.ogg',
    D3: 'D3.ogg',
    D4: 'D4.ogg',
    D5: 'D5.ogg',
    'D#2': 'Ds2.ogg',
    'D#3': 'Ds3.ogg',
    'D#4': 'Ds3.ogg',
    E2: 'E2.ogg',
    E3: 'E3.ogg',
    E4: 'E4.ogg',
    F2: 'F2.ogg',
    F3: 'F3.ogg',
  },

  'guitar-electric': {
    'D#3': 'Ds3.ogg',
    'D#4': 'Ds4.ogg',
    'D#5': 'Ds5.ogg',
    E2: 'E2.ogg',
    'F#2': 'Fs2.ogg',
    'F#3': 'Fs3.ogg',
    'F#4': 'Fs4.ogg',
    'F#5': 'Fs5.ogg',
    A2: 'A2.ogg',
    A3: 'A3.ogg',
    A4: 'A4.ogg',
    A5: 'A5.ogg',
    C3: 'C3.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    C6: 'C6.ogg',
    'C#2': 'Cs2.ogg',
  },

  'guitar-nylon': {
    'F#2': 'Fs2.ogg',
    'F#3': 'Fs3.ogg',
    'F#4': 'Fs4.ogg',
    'F#5': 'Fs5.ogg',
    G3: 'G3.ogg',
    G5: 'G3.ogg',
    'G#2': 'Gs2.ogg',
    'G#4': 'Gs4.ogg',
    'G#5': 'Gs5.ogg',
    A2: 'A2.ogg',
    A3: 'A3.ogg',
    A4: 'A4.ogg',
    A5: 'A5.ogg',
    'A#5': 'As5.ogg',
    B1: 'B1.ogg',
    B2: 'B2.ogg',
    B3: 'B3.ogg',
    B4: 'B4.ogg',
    'C#3': 'Cs3.ogg',
    'C#4': 'Cs4.ogg',
    'C#5': 'Cs5.ogg',
    D2: 'D2.ogg',
    D3: 'D3.ogg',
    D5: 'D5.ogg',
    'D#4': 'Ds4.ogg',
    E2: 'E2.ogg',
    E3: 'E3.ogg',
    E4: 'E4.ogg',
    E5: 'E5.ogg',
  },

  harmonium: {
    C2: 'C2.ogg',
    C3: 'C3.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    'C#2': 'Cs2.ogg',
    'C#3': 'Cs3.ogg',
    'C#4': 'Cs4.ogg',
    'C#5': 'Cs5.ogg',
    D2: 'D2.ogg',
    D3: 'D3.ogg',
    D4: 'D4.ogg',
    D5: 'D5.ogg',
    'D#2': 'Ds2.ogg',
    'D#3': 'Ds3.ogg',
    'D#4': 'Ds4.ogg',
    E2: 'E2.ogg',
    E3: 'E3.ogg',
    E4: 'E4.ogg',
    F2: 'F2.ogg',
    F3: 'F3.ogg',
    F4: 'F4.ogg',
    'F#2': 'Fs2.ogg',
    'F#3': 'Fs3.ogg',
    G2: 'G2.ogg',
    G3: 'G3.ogg',
    G4: 'G4.ogg',
    'G#2': 'Gs2.ogg',
    'G#3': 'Gs3.ogg',
    'G#4': 'Gs4.ogg',
    A2: 'A2.ogg',
    A3: 'A3.ogg',
    A4: 'A4.ogg',
    'A#2': 'As2.ogg',
    'A#3': 'As3.ogg',
    'A#4': 'As4.ogg',
  },

  harp: {
    C5: 'C5.ogg',
    D2: 'D2.ogg',
    D4: 'D4.ogg',
    D6: 'D6.ogg',
    D7: 'D7.ogg',
    E1: 'E1.ogg',
    E3: 'E3.ogg',
    E5: 'E5.ogg',
    F2: 'F2.ogg',
    F4: 'F4.ogg',
    F6: 'F6.ogg',
    F7: 'F7.ogg',
    G1: 'G1.ogg',
    G3: 'G3.ogg',
    G5: 'G5.ogg',
    A2: 'A2.ogg',
    A4: 'A4.ogg',
    A6: 'A6.ogg',
    B1: 'B1.ogg',
    B3: 'B3.ogg',
    B5: 'B5.ogg',
    B6: 'B6.ogg',
    C3: 'C3.ogg',
  },

  organ: {
    C3: 'C3.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    C6: 'C6.ogg',
    'D#1': 'Ds1.ogg',
    'D#2': 'Ds2.ogg',
    'D#3': 'Ds3.ogg',
    'D#4': 'Ds4.ogg',
    'D#5': 'Ds5.ogg',
    'F#1': 'Fs1.ogg',
    'F#2': 'Fs2.ogg',
    'F#3': 'Fs3.ogg',
    'F#4': 'Fs4.ogg',
    'F#5': 'Fs5.ogg',
    A1: 'A1.ogg',
    A2: 'A2.ogg',
    A3: 'A3.ogg',
    A4: 'A4.ogg',
    A5: 'A5.ogg',
    C1: 'C1.ogg',
    C2: 'C2.ogg',
  },

  piano: {
    A7: 'A7.ogg',
    A1: 'A1.ogg',
    A2: 'A2.ogg',
    A3: 'A3.ogg',
    A4: 'A4.ogg',
    A5: 'A5.ogg',
    A6: 'A6.ogg',
    'A#7': 'As7.ogg',
    'A#1': 'As1.ogg',
    'A#2': 'As2.ogg',
    'A#3': 'As3.ogg',
    'A#4': 'As4.ogg',
    'A#5': 'As5.ogg',
    'A#6': 'As6.ogg',
    B7: 'B7.ogg',
    B1: 'B1.ogg',
    B2: 'B2.ogg',
    B3: 'B3.ogg',
    B4: 'B4.ogg',
    B5: 'B5.ogg',
    B6: 'B6.ogg',
    C1: 'C1.ogg',
    C2: 'C2.ogg',
    C3: 'C3.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    C6: 'C6.ogg',
    C7: 'C7.ogg',
    'C#7': 'Cs7.ogg',
    'C#1': 'Cs1.ogg',
    'C#2': 'Cs2.ogg',
    'C#3': 'Cs3.ogg',
    'C#4': 'Cs4.ogg',
    'C#5': 'Cs5.ogg',
    'C#6': 'Cs6.ogg',
    D7: 'D7.ogg',
    D1: 'D1.ogg',
    D2: 'D2.ogg',
    D3: 'D3.ogg',
    D4: 'D4.ogg',
    D5: 'D5.ogg',
    D6: 'D6.ogg',
    'D#7': 'Ds7.ogg',
    'D#1': 'Ds1.ogg',
    'D#2': 'Ds2.ogg',
    'D#3': 'Ds3.ogg',
    'D#4': 'Ds4.ogg',
    'D#5': 'Ds5.ogg',
    'D#6': 'Ds6.ogg',
    E7: 'E7.ogg',
    E1: 'E1.ogg',
    E2: 'E2.ogg',
    E3: 'E3.ogg',
    E4: 'E4.ogg',
    E5: 'E5.ogg',
    E6: 'E6.ogg',
    F7: 'F7.ogg',
    F1: 'F1.ogg',
    F2: 'F2.ogg',
    F3: 'F3.ogg',
    F4: 'F4.ogg',
    F5: 'F5.ogg',
    F6: 'F6.ogg',
    'F#7': 'Fs7.ogg',
    'F#1': 'Fs1.ogg',
    'F#2': 'Fs2.ogg',
    'F#3': 'Fs3.ogg',
    'F#4': 'Fs4.ogg',
    'F#5': 'Fs5.ogg',
    'F#6': 'Fs6.ogg',
    G7: 'G7.ogg',
    G1: 'G1.ogg',
    G2: 'G2.ogg',
    G3: 'G3.ogg',
    G4: 'G4.ogg',
    G5: 'G5.ogg',
    G6: 'G6.ogg',
    'G#7': 'Gs7.ogg',
    'G#1': 'Gs1.ogg',
    'G#2': 'Gs2.ogg',
    'G#3': 'Gs3.ogg',
    'G#4': 'Gs4.ogg',
    'G#5': 'Gs5.ogg',
    'G#6': 'Gs6.ogg',
  },

  saxophone: {
    'D#5': 'Ds5.ogg',
    E3: 'E3.ogg',
    E4: 'E4.ogg',
    E5: 'E5.ogg',
    F3: 'F3.ogg',
    F4: 'F4.ogg',
    F5: 'F5.ogg',
    'F#3': 'Fs3.ogg',
    'F#4': 'Fs4.ogg',
    'F#5': 'Fs5.ogg',
    G3: 'G3.ogg',
    G4: 'G4.ogg',
    G5: 'G5.ogg',
    'G#3': 'Gs3.ogg',
    'G#4': 'Gs4.ogg',
    'G#5': 'Gs5.ogg',
    A4: 'A4.ogg',
    A5: 'A5.ogg',
    'A#3': 'As3.ogg',
    'A#4': 'As4.ogg',
    B3: 'B3.ogg',
    B4: 'B4.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    'C#3': 'Cs3.ogg',
    'C#4': 'Cs4.ogg',
    'C#5': 'Cs5.ogg',
    D3: 'D3.ogg',
    D4: 'D4.ogg',
    D5: 'D5.ogg',
    'D#3': 'Ds3.ogg',
    'D#4': 'Ds4.ogg',
  },

  trombone: {
    'A#3': 'As3.ogg',
    C3: 'C3.ogg',
    C4: 'C4.ogg',
    'C#2': 'Cs2.ogg',
    'C#4': 'Cs4.ogg',
    D3: 'D3.ogg',
    D4: 'D4.ogg',
    'D#2': 'Ds2.ogg',
    'D#3': 'Ds3.ogg',
    'D#4': 'Ds4.ogg',
    F2: 'F2.ogg',
    F3: 'F3.ogg',
    F4: 'F4.ogg',
    'G#2': 'Gs2.ogg',
    'G#3': 'Gs3.ogg',
    'A#1': 'As1.ogg',
    'A#2': 'As2.ogg',
  },

  trumpet: {
    C6: 'C6.ogg',
    D5: 'D5.ogg',
    'D#4': 'Ds4.ogg',
    F3: 'F3.ogg',
    F4: 'F4.ogg',
    F5: 'F5.ogg',
    G4: 'G4.ogg',
    A3: 'A3.ogg',
    A5: 'A5.ogg',
    'A#4': 'As4.ogg',
    C4: 'C4.ogg',
  },

  tuba: {
    'A#2': 'As2.ogg',
    'A#3': 'As3.ogg',
    D3: 'D3.ogg',
    D4: 'D4.ogg',
    'D#2': 'Ds2.ogg',
    F1: 'F1.ogg',
    F2: 'F2.ogg',
    F3: 'F3.ogg',
    'A#1': 'As1.ogg',
  },

  violin: {
    A3: 'A3.ogg',
    A4: 'A4.ogg',
    A5: 'A5.ogg',
    A6: 'A6.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    C6: 'C6.ogg',
    C7: 'C7.ogg',
    E4: 'E4.ogg',
    E5: 'E5.ogg',
    E6: 'E6.ogg',
    G4: 'G4.ogg',
    G5: 'G5.ogg',
    G6: 'G6.ogg',
  },

  xylophone: {
    C8: 'C8.ogg',
    G4: 'G4.ogg',
    G5: 'G5.ogg',
    G6: 'G6.ogg',
    G7: 'G7.ogg',
    C5: 'C5.ogg',
    C6: 'C6.ogg',
    C7: 'C7.ogg',
  },
};
// ... (imports remain)

// ... (toneSamplerMap remains)

const toneCache: Record<string, Promise<Tone.Sampler>> = {};

export type LoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';
export type LoadingProgress = { loaded: number; total: number };

const toneStatus: Record<string, LoadingStatus> = {};
const toneProgress: Record<string, LoadingProgress> = {};

type StatusListener = (
  name: string,
  status: LoadingStatus,
  progress?: LoadingProgress,
) => void;

const statusListeners: Set<StatusListener> = new Set();

const notifyStatus = (
  name: string,
  status: LoadingStatus,
  progress?: LoadingProgress,
) => {
  toneStatus[name] = status;
  if (progress) {
    toneProgress[name] = progress;
  }
  statusListeners.forEach((listener) => listener(name, status, progress));
};

export const getInstrumentStatus = (name: string): LoadingStatus => {
  return toneStatus[name] || 'idle';
};

export const getInstrumentProgress = (
  name: string,
): LoadingProgress | undefined => {
  return toneProgress[name];
};

export const subscribeToStatus = (listener: StatusListener) => {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
};

export const loadInstrument = (
  instrumentsName: string,
): Promise<Tone.Sampler> => {
  const samplerMap = toneSamplerMap[instrumentsName];
  if (samplerMap === undefined || samplerMap === null) {
    notifyStatus(instrumentsName, 'error');
    throw new Error(`no such instruments: ${instrumentsName}`);
  }

  const cachedPromise = toneCache[instrumentsName];
  if (cachedPromise !== undefined && cachedPromise !== null) {
    return cachedPromise;
  }

  const total = Object.keys(samplerMap).length;
  let loadedCount = 0;
  notifyStatus(instrumentsName, 'loading', { loaded: 0, total });

  const promise = new Promise<Tone.Sampler>((resolve, reject) => {
    // 1. Manually load buffers to track progress
    const bufferMap: Record<string, Tone.ToneAudioBuffer> = {};
    const baseUrl = `samples/${instrumentsName}/`;

    // Create a list of load promises
    const loadPromises = Object.entries(samplerMap).map(([note, filename]) => {
      const url = baseUrl + filename;
      const buffer = new Tone.Buffer();
      // Use load() promise for better error handling
      return buffer
        .load(url)
        .then(() => {
          loadedCount++;
          notifyStatus(instrumentsName, 'loading', {
            loaded: loadedCount,
            total,
          });
          bufferMap[note] = buffer;
        })
        .catch((e) => {
          console.error(`Failed to load sample: ${url}`, e);
          throw e; // Re-throw to fail Promise.all
        });
    });

    Promise.all(loadPromises)
      .then(() => {
        // 2. All buffers loaded, create Sampler
        const sampler = new Tone.Sampler({
          urls: bufferMap,
          release: 1,
          // baseUrl is not needed since we passed loaded buffers
          onload: () => {
            // Though buffers are preloaded, Sampler might do some init.
            // Usually instant if buffers are passed.
            notifyStatus(instrumentsName, 'loaded', { loaded: total, total });
            resolve(sampler);
          },
        }).toDestination();
      })
      .catch((e) => {
        notifyStatus(instrumentsName, 'error');
        reject(e);
      });
  });

  toneCache[instrumentsName] = promise;
  promise.catch(() => {
    delete toneCache[instrumentsName];
  });

  return promise;
};
