import { useEffect, useState } from 'react';
import {
  getInstrumentProgress,
  getInstrumentStatus,
  LoadingProgress,
  LoadingStatus,
  subscribeToStatus,
} from '../utils/toneInstruments';

export type InstrumentStatusState = {
  status: LoadingStatus;
  progress?: LoadingProgress;
};

export const useInstrumentStatus = (
  instrumentName: string,
): InstrumentStatusState => {
  const [state, setState] = useState<InstrumentStatusState>(() => ({
    status: getInstrumentStatus(instrumentName),
    progress: getInstrumentProgress(instrumentName),
  }));

  useEffect(() => {
    // Current status might have changed since initial render
    setState({
      status: getInstrumentStatus(instrumentName),
      progress: getInstrumentProgress(instrumentName),
    });

    const unsubscribe = subscribeToStatus((name, newStatus, newProgress) => {
      if (name === instrumentName) {
        setState({
          status: newStatus,
          progress: newProgress,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [instrumentName]);

  return state;
};
