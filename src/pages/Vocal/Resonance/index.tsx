import { VOCAL_RESONANCE_EXERCISE_STORAGE_KEY } from '@/constants';
import { getPageSettings, setPageSettings } from '@/utils/storage';
import { loadInstrument } from '@/utils/toneInstruments';
import {
  FooterToolbar,
  PageContainer,
  ProForm,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import VocalExercisePlayer from '../components/VocalExercisePlayer';
import VocalExerciseSettings from '../components/VocalExerciseSettings';
import './index.less';

const DEFAULT_SETTINGS = {
  preset: 'male',
  startNote: 'C3',
  endNote: 'C4',
  rootNoteWait: 1500,
  firstNoteDuration: 1000,
  intervalDuration: 500,
  lastNoteDuration: 1500,
  postMelodyWait: 1000,
  loopCount: 2,
  countdown: 3000,
  bpm: 60,
};

// Resonance Pattern: [0, 2, 4, 5, 7, 5, 4, 2, 0]
const PATTERN_OFFSETS = [0, 2, 4, 5, 7, 5, 4, 2, 0];

const PRESETS = {
  male: { startNote: 'C3', endNote: 'C4' },
  female: { startNote: 'G3', endNote: 'E4' },
};

const ResonancePage: React.FC = () => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = getPageSettings(
      VOCAL_RESONANCE_EXERCISE_STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    if (saved) {
      setSettings(saved);
      form.setFieldsValue(saved);
    }

    // Preload piano instrument
    loadInstrument('piano').catch((e) => {
      console.error('Failed to preload instrument:', e);
    });
  }, [form]);

  const onValuesChange = (_: any, allValues: any) => {
    setPageSettings(
      VOCAL_RESONANCE_EXERCISE_STORAGE_KEY,
      allValues,
      intl.formatMessage({ id: 'vocal.resonance.title' }),
    );
  };

  const handleFinish = async (values: any) => {
    setSettings(values);
    setModalOpen(true);
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'vocal.resonance.title' }),
      }}
    >
      <ProForm
        form={form}
        initialValues={DEFAULT_SETTINGS}
        onValuesChange={onValuesChange}
        onFinish={handleFinish}
        submitter={{
          render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
          searchConfig: {
            resetText: intl.formatMessage({ id: 'common.reset' }),
            submitText: intl.formatMessage({ id: 'vocal.resonance.start' }),
          },
        }}
        layout="vertical"
        className="resonance-exercise-container"
      >
        <div className="resonance-exercise-settings-wrapper">
          <VocalExerciseSettings
            presets={PRESETS}
            localizationPrefix="vocal.resonance"
          />
        </div>
      </ProForm>

      <VocalExercisePlayer
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        patternOffsets={PATTERN_OFFSETS}
        localizationPrefix="vocal.resonance"
        {...settings}
      />
    </PageContainer>
  );
};

export default ResonancePage;
