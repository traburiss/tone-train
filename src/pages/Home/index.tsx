import {
  DEFAULT_TRAIN_PLAYER_ARGS,
  DURATION_FORMATTER,
  DURATION_STEP,
  INSTRUMENT_NAME_OPTIONS,
  LOOP_COUNT_OPTIONS,
  MAX_DURATION,
  MIX_DURATION,
  OCTAVES,
  TrainPlayerArgs,
} from '@/constants';
import ScaleSettings from '@/pages/Home/components/ScaleSettings';
import TrainPlayer from '@/pages/Home/components/trainPlayer';
import {
  FooterToolbar,
  PageContainer,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';

const SETTINGS_KEY = 'tone-train-settings';

const HomePage: React.FC = () => {
  const [tonePlayerArgs, setTonePlayerArgs] = useState<TrainPlayerArgs>(
    DEFAULT_TRAIN_PLAYER_ARGS,
  );
  const [tonePlayerOpen, setTonePlayerOpen] = useState<boolean>(false);
  const [form] = ProForm.useForm();

  // Helper to transform grouped selection back to flat toneList
  const flattenGroupedTones = (groups: Record<number, string[]>) => {
    return Object.values(groups || {})
      .flat()
      .filter(Boolean);
  };

  // Helper to transform flat toneList to grouped structure for form
  const groupTones = (toneList: string[]) => {
    const groups: Record<number, string[]> = {};
    OCTAVES.forEach((oct) => {
      groups[oct] = toneList.filter((t) => t.endsWith(String(oct)));
    });
    return groups;
  };

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old flat toneList if exists
        if (parsed.toneList && !parsed.toneListGroup) {
          parsed.toneListGroup = groupTones(parsed.toneList);
        }
        form.setFieldsValue(parsed);
        setTonePlayerArgs({
          ...DEFAULT_TRAIN_PLAYER_ARGS,
          ...parsed,
          toneList: flattenGroupedTones(parsed.toneListGroup),
        });
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }, [form]);

  const onValuesChange = (_: any, allValues: any) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(allValues));
  };

  const formCommit = (v: any) => {
    const toneList = flattenGroupedTones(v.toneListGroup);
    const finalArgs = { ...v, toneList };
    setTonePlayerArgs(finalArgs);
    setTonePlayerOpen(true);
  };

  return (
    <PageContainer ghost className="px-1 sm:px-4">
      <ProForm
        form={form}
        size={'large'}
        initialValues={{
          ...DEFAULT_TRAIN_PLAYER_ARGS,
          toneListGroup: groupTones(DEFAULT_TRAIN_PLAYER_ARGS.toneList),
        }}
        onValuesChange={onValuesChange}
        onFinish={formCommit}
        layout={'horizontal'}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '开始训练',
          },
          render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
        }}
      >
        <ScaleSettings />

        <Card title="基础配置" className="mb-3 sm:mb-6">
          <ProForm.Group size={8}>
            <ProFormRadio.Group
              name="instrumentName"
              label="音色"
              required={true}
              radioType="button"
              options={INSTRUMENT_NAME_OPTIONS}
            />
            <ProFormSelect
              name="loopCount"
              label="循环次数"
              width="sm"
              options={LOOP_COUNT_OPTIONS}
            />
          </ProForm.Group>
          <ProForm.Group size={8}>
            <ProFormSwitch name="ttsEnable" label="语音报号" />
            <ProFormSwitch name="random" label="随机播放" />
            <ProFormSwitch name="referenceNoteEnabled" label="播放对比基准音" />
          </ProForm.Group>
        </Card>

        <Card title="播放参数" className="mb-3 sm:mb-6">
          <ProForm.Group>
            <ProFormSlider
              name="toneDuration"
              label="音阶时长"
              width="md"
              fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
              min={MIX_DURATION}
              max={MAX_DURATION}
              step={DURATION_STEP}
            />
            <ProFormSlider
              name="toneWait"
              label="音阶播后等待"
              width="md"
              fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
              min={MIX_DURATION}
              max={MAX_DURATION}
              step={DURATION_STEP}
            />
            <ProFormSlider
              name="ttsWait"
              label="报号后等待"
              width="md"
              fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
              min={MIX_DURATION}
              max={MAX_DURATION}
              step={DURATION_STEP}
            />
          </ProForm.Group>
        </Card>
      </ProForm>
      <TrainPlayer
        open={tonePlayerOpen}
        onCancel={() => setTonePlayerOpen(false)}
        {...tonePlayerArgs}
      />
    </PageContainer>
  );
};

export default HomePage;
