import { useEffect, useState } from 'react';
import {
  getInstrumentStatus,
  LoadingStatus,
  subscribeToStatus,
} from '../utils/toneInstruments';

export const useInstrumentStatus = (instrumentName: string): LoadingStatus => {
  const [status, setStatus] = useState<LoadingStatus>(() =>
    getInstrumentStatus(instrumentName),
  );

  useEffect(() => {
    // Current status might have changed since initial render
    setStatus(getInstrumentStatus(instrumentName));

    const unsubscribe = subscribeToStatus((name, newStatus) => {
      if (name === instrumentName) {
        setStatus(newStatus);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [instrumentName]);

  return status;
};
