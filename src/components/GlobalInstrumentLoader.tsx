import {
  AVAILABLE_INSTRUMENTS,
  getInstrumentProgress,
  getInstrumentStatus,
  LoadingProgress,
  subscribeToStatus,
} from '@/utils/toneInstruments';
import { LoadingOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

// Instrument names are now handled by intl.formatMessage({ id: 'option.instrument.' + name })

const GlobalInstrumentLoader: React.FC = () => {
  const intl = useIntl();
  // Use generic State holding both status and progress
  const [displayState, setDisplayState] = useState<{
    status: Record<string, string>;
    progress: Record<string, LoadingProgress>;
  }>({ status: {}, progress: {} });

  // Refs to hold real-time data to prevent stale closures and allow polling
  const statusRef = useRef<Record<string, string>>({});
  const progressRef = useRef<Record<string, LoadingProgress>>({});

  useEffect(() => {
    // 1. Initialize Refs
    const initialStatus: Record<string, string> = {};
    const initialProgress: Record<string, LoadingProgress> = {};
    AVAILABLE_INSTRUMENTS.forEach((name) => {
      initialStatus[name] = getInstrumentStatus(name);
      const prog = getInstrumentProgress(name);
      if (prog) initialProgress[name] = prog;
    });
    statusRef.current = initialStatus;
    progressRef.current = initialProgress;

    // 2. Initial Setup for Display
    setDisplayState({
      status: { ...initialStatus },
      progress: { ...initialProgress },
    });

    // 3. Auto-load Removed as per user request (On-Demand loading triggered by pages)
    // The component now only passively monitors and visualizes the status.

    // 4. Subscribe to updates (Updating Refs Only)
    const unsubscribe = subscribeToStatus((name, status, progress) => {
      statusRef.current[name] = status;
      if (progress) {
        progressRef.current[name] = progress;
      }
    });

    // 5. Throttled UI Update Loop (Every 200ms)
    const intervalId = setInterval(() => {
      setDisplayState({
        status: { ...statusRef.current },
        progress: { ...progressRef.current },
      });
    }, 200);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const totalInstruments = AVAILABLE_INSTRUMENTS.length;
  const loadedInstruments = Object.values(displayState.status).filter(
    (s) => s === 'loaded' || s === 'error',
  ).length;

  // Check if anything is actively loading
  const isAnyLoading = Object.values(displayState.status).some(
    (s) => s === 'loading',
  );

  // Hide if nothing is loading (On-Demand behavior)
  if (!isAnyLoading) {
    return null;
  }

  const currentLoadingName = AVAILABLE_INSTRUMENTS.find(
    (name) => displayState.status[name] === 'loading',
  );

  let details = '';
  if (currentLoadingName) {
    const nameLabel = intl.formatMessage({
      id: `option.instrument.${currentLoadingName}`,
    });
    const prog = displayState.progress[currentLoadingName];
    if (prog) {
      details = intl.formatMessage(
        { id: 'common.instrument-loading-progress' },
        { name: nameLabel, loaded: prog.loaded, total: prog.total },
      );
    } else {
      details = intl.formatMessage(
        { id: 'common.instrument-loading-current' },
        { name: nameLabel },
      );
    }
  }

  return (
    <Tag icon={<LoadingOutlined />} color="processing">
      {intl.formatMessage(
        { id: 'common.instrument-loading-total' },
        { loaded: loadedInstruments, total: totalInstruments },
      )}{' '}
      {details}
    </Tag>
  );
};

export default GlobalInstrumentLoader;
