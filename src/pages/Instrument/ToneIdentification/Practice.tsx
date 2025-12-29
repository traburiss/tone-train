import ScaleSettings from '@/components/ScaleSettings';
import {
  DEFAULT_INSTRUMENT_NAME,
  DEFAULT_TONE_TYPE,
  DURATION_FORMATTER,
  INSTRUMENT_NAME_OPTIONS,
  TONES_IDENTIFICATION_STORAGE_KEY,
} from '@/constants';
import { getPageSettings, setPageSettings } from '@/utils/storage';
import { loadInstrument } from '@/utils/toneInstruments';
import {
  FooterToolbar,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSlider,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import React, { useEffect, useState } from 'react';
import IdentificationGame from './IdentificationGame';

export type IdentificationMode = 'timed' | 'infinite';
export type Difficulty = 2 | 4 | 6 | 8;

export interface IdentificationSettings {
  toneType: string;
  instrumentName: string;
  toneListGroup: Record<string, string[]>;
  difficulty: Difficulty;
  mode: IdentificationMode;
  timeLimit: number; // in seconds
  toneDuration: number; // ms
  toneWait: number; // ms
}

const DEFAULT_SETTINGS: IdentificationSettings = {
  toneType: DEFAULT_TONE_TYPE,
  instrumentName: DEFAULT_INSTRUMENT_NAME,
  toneListGroup: {
    chords: ['C', 'D', 'G', 'Em', 'Am'],
  },
  difficulty: 2,
  mode: 'timed',
  timeLimit: 60,
  toneDuration: 1000,
  toneWait: 1500,
};

const Practice: React.FC = () => {
  const [form] = ProForm.useForm();
  const [gameOpen, setGameOpen] = useState(false);
  const [gameArgs, setGameArgs] = useState<IdentificationSettings | null>(null);

  const instrumentName =
    ProForm.useWatch('instrumentName', form) || DEFAULT_INSTRUMENT_NAME;

  useEffect(() => {
    loadInstrument(instrumentName).catch(console.error);
  }, [instrumentName]);

  // Load settings
  useEffect(() => {
    const saved = getPageSettings<IdentificationSettings>(
      TONES_IDENTIFICATION_STORAGE_KEY,
      null,
    );
    if (saved) {
      form.setFieldsValue(saved);
    }
  }, [form]);

  const onValuesChange = (_: any, allValues: any) => {
    setPageSettings(
      TONES_IDENTIFICATION_STORAGE_KEY,
      allValues,
      '听音判断配置',
    );
  };

  const onFinish = async (values: IdentificationSettings) => {
    // Validate number of selected tones vs difficulty
    const { toneListGroup, toneType, difficulty } = values;
    let selectedTones: string[] = [];

    if (toneType === 'GuitarChords') {
      selectedTones = toneListGroup['chords'] || [];
    } else {
      selectedTones = Object.entries(toneListGroup)
        .filter(([key]) => !isNaN(Number(key)))
        .map(([, values]) => values)
        .flat()
        .filter(Boolean);
    }

    if (selectedTones.length < difficulty) {
      message.error(
        `当前选择的音符/和弦数量 (${selectedTones.length}) 不足，至少需要选择 ${difficulty} 个才能开始当前难度的测试。`,
      );
      return;
    }

    setGameArgs(values);
    setGameOpen(true);
  };

  return (
    <div>
      <ProForm
        form={form}
        initialValues={DEFAULT_SETTINGS}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: '开始测试',
          },
          render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
        }}
      >
        <ScaleSettings />

        <Card title="测试配置" className="mb-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 border-b pb-4">
              <ProFormRadio.Group
                name="instrumentName"
                label="乐器音色"
                radioType="button"
                fieldProps={{ buttonStyle: 'solid', size: 'small' }}
                options={INSTRUMENT_NAME_OPTIONS}
              />
              <ProFormRadio.Group
                name="difficulty"
                label="问题难度"
                radioType="button"
                fieldProps={{ buttonStyle: 'solid', size: 'small' }}
                options={[
                  { label: '简单 (2选1)', value: 2 },
                  { label: '中等 (4选1)', value: 4 },
                  { label: '困难 (6选1)', value: 6 },
                  { label: '地狱 (8选1)', value: 8 },
                ]}
              />
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-0 border-b pb-4">
              <ProFormSlider
                name="toneDuration"
                label="音播放时长"
                min={100}
                max={5000}
                step={100}
                width="md"
                fieldProps={{
                  tooltip: { formatter: DURATION_FORMATTER },
                }}
              />
              <ProFormSlider
                name="toneWait"
                label="音播放完等待时长"
                min={100}
                max={5000}
                step={100}
                width="md"
                fieldProps={{
                  tooltip: { formatter: DURATION_FORMATTER },
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <ProFormRadio.Group
                name="mode"
                label="测试模式"
                radioType="button"
                fieldProps={{ buttonStyle: 'solid', size: 'small' }}
                options={[
                  { label: '限时挑战', value: 'timed' },
                  { label: '无限模式', value: 'infinite' },
                ]}
              />

              <ProFormDependency name={['mode']}>
                {({ mode }) =>
                  mode === 'timed' && (
                    <ProFormDigit
                      name="timeLimit"
                      label="时间上限 (秒)"
                      width="xs"
                      min={10}
                      fieldProps={{
                        step: 30,
                      }}
                    />
                  )
                }
              </ProFormDependency>
            </div>
          </div>
        </Card>
      </ProForm>

      {gameArgs && (
        <IdentificationGame
          open={gameOpen}
          settings={gameArgs}
          onCancel={() => setGameOpen(false)}
        />
      )}
    </div>
  );
};

export default Practice;
