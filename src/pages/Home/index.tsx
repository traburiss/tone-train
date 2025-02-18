import {
  DEFAULT_TRAIN_PLAYER_ARGS,
  DURATION_FORMATTER,
  DURATION_STEP,
  MAX_DURATION,
  MIX_DURATION,
  TIMBRE_TYPE_OPTIONS,
  TONE_TYPE_OPTIONS,
  TrainPlayerArgs,
} from '@/constants';
import TrainPlayer from '@/pages/Home/components/trainPlayer';
import {
  FooterToolbar,
  PageContainer,
  ProForm,
  ProFormRadio,
  ProFormSlider,
  ProFormSwitch,
} from '@ant-design/pro-components';
import React, { useState } from 'react';

const defaultFormValue = DEFAULT_TRAIN_PLAYER_ARGS;

const HomePage: React.FC = () => {
  const [tonePlayerArgs, setTonePlayerArgs] = useState<TrainPlayerArgs>(
    DEFAULT_TRAIN_PLAYER_ARGS,
  );
  const [tonePlayerOpen, setTonePlayerOpen] = useState<boolean>(false);

  const formValueChange = (v: any) => {
    console.info('value change', v);
  };

  const formCommit = (v: any) => {
    console.info('commit', v);
    setTonePlayerArgs({ ...tonePlayerArgs, ...v });
    setTonePlayerOpen(true);
  };

  const formReset = (v: any) => {
    console.info('reset', v);
  };

  const trainPlayerClose = () => {
    console.info('trainPlayerClose');
    setTonePlayerOpen(false);
  };

  return (
    <PageContainer ghost>
      <ProForm
        size={'large'}
        initialValues={defaultFormValue}
        onValuesChange={formValueChange}
        onFinish={formCommit}
        onReset={formReset}
        layout={'horizontal'}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '开始训练',
          },
          render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
        }}
      >
        <ProForm.Group>
          <ProFormRadio.Group
            name="toneType"
            label="音阶"
            required={true}
            radioType="button"
            options={TONE_TYPE_OPTIONS}
          />
          <ProFormRadio.Group
            name="timbreType"
            label="音色"
            required={true}
            radioType="button"
            options={TIMBRE_TYPE_OPTIONS}
          />
          <ProFormSlider
            name="toneDuration"
            label="音阶时长"
            required={true}
            fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
            min={MIX_DURATION}
            max={MAX_DURATION}
            step={DURATION_STEP}
          />
          <ProFormSlider
            name="toneWait"
            label="音阶播后等待"
            required={true}
            fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
            min={MIX_DURATION}
            max={MAX_DURATION}
            step={DURATION_STEP}
          />
          <ProFormSwitch name="ttsEnable" label="音名播报" required={true} />
          <ProFormSlider
            name="ttsWait"
            label="音名播后等待"
            required={true}
            fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
            min={MIX_DURATION}
            max={MAX_DURATION}
            step={DURATION_STEP}
          />
        </ProForm.Group>
      </ProForm>
      <TrainPlayer
        open={tonePlayerOpen}
        onCancel={trainPlayerClose}
        {...tonePlayerArgs}
      ></TrainPlayer>
    </PageContainer>
  );
};

export default HomePage;
