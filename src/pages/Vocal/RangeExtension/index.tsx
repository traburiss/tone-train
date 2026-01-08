import { VOCAL_RANGE_EXTENSION_EXERCISE_STORAGE_KEY } from '@/constants';
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
  startNote: 'D3',
  endNote: 'A#3',
  rootNoteWait: 1500,
  firstNoteDuration: 500,
  intervalDuration: 500,
  lastNoteDuration: 500,
  postMelodyWait: 1000,
  loopCount: 2,
  countdown: 3000,
  bpm: 60,
};

// Range Extension Pattern: 0 +4 +8 +12 +8 +4 +0
const PATTERN_OFFSETS = [0, 4, 7, 12, 7, 4, 0];

const PRESETS = {
  male: { startNote: 'D3', endNote: 'A#3' },
  female: { startNote: 'G3', endNote: 'D4' },
};

const RangeExtensionPage: React.FC = () => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = getPageSettings(
      VOCAL_RANGE_EXTENSION_EXERCISE_STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    if (saved) {
      setSettings(saved);
      form.setFieldsValue(saved);
    }

    // Preload piano instrument when entering the page
    loadInstrument('piano').catch((e) => {
      console.error('Failed to preload instrument:', e);
    });
  }, [form]);

  const onValuesChange = (_: any, allValues: any) => {
    setPageSettings(
      VOCAL_RANGE_EXTENSION_EXERCISE_STORAGE_KEY,
      allValues,
      intl.formatMessage({ id: 'vocal.range-extension.title' }),
    );
  };

  const handleFinish = async (values: any) => {
    setSettings(values);
    setModalOpen(true);
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'vocal.range-extension.title' }),
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
            submitText: intl.formatMessage({ id: 'vocal.ma-exercise.start' }),
          },
        }}
        layout="vertical"
        className="ma-exercise-container"
      >
        <div className="ma-exercise-settings-wrapper">
          <VocalExerciseSettings
            presets={PRESETS}
            localizationPrefix="vocal.ma-exercise"
            customPresetPrefix="vocal.range-extension"
          />
        </div>
      </ProForm>

      <VocalExercisePlayer
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        patternOffsets={PATTERN_OFFSETS}
        localizationPrefix="vocal.range-extension"
        {...settings}
      />
    </PageContainer>
  );
};

export default RangeExtensionPage;
