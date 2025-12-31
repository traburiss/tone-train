import { VOCAL_MA_EXERCISE_STORAGE_KEY } from '@/constants';
import { getPageSettings, setPageSettings } from '@/utils/storage';
import {
  FooterToolbar,
  PageContainer,
  ProForm,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import MaExercisePlayer from './components/MaExercisePlayer';
import MaExerciseSettings from './components/MaExerciseSettings';
import './index.less';

const DEFAULT_SETTINGS = {
  preset: 'male',
  startNote: 'B2',
  endNote: 'B3',
  rootNoteWait: 1500,
  firstNoteDuration: 1500,
  intervalDuration: 500,
  lastNoteDuration: 1500,
  postMelodyWait: 1000,
  loopCount: 2,
  countdown: 3000,
};

const MaExercisePage: React.FC = () => {
  const intl = useIntl();
  const [form] = ProForm.useForm();
  const [modalOpen, setModalOpen] = useState(false);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = getPageSettings(
      VOCAL_MA_EXERCISE_STORAGE_KEY,
      DEFAULT_SETTINGS,
    );
    if (saved) {
      setSettings(saved);
      form.setFieldsValue(saved);
    }
  }, [form]);

  const onValuesChange = (_: any, allValues: any) => {
    setPageSettings(
      VOCAL_MA_EXERCISE_STORAGE_KEY,
      allValues,
      intl.formatMessage({ id: 'vocal.ma-exercise.title' }),
    );
  };

  const handleFinish = async (values: any) => {
    setSettings(values);
    setModalOpen(true);
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'vocal.ma-exercise.title' }),
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
          <MaExerciseSettings />
        </div>
      </ProForm>

      <MaExercisePlayer
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        {...settings}
      />
    </PageContainer>
  );
};

export default MaExercisePage;
