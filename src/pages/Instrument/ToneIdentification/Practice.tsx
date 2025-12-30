import ScaleSettings from '@/components/ScaleSettings';
import {
  DEFAULT_INSTRUMENT_NAME,
  DEFAULT_TONE_TYPE,
  GET_DURATION_FORMATTER,
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
import { useIntl } from '@umijs/max';
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
  const intl = useIntl();
  const durationFormatter = GET_DURATION_FORMATTER(intl);

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
      form.setFieldsValue(saved as any);
    }
  }, [form]);

  const onValuesChange = (_: any, allValues: any) => {
    setPageSettings(
      TONES_IDENTIFICATION_STORAGE_KEY,
      allValues,
      intl.formatMessage({ id: 'tone-identification.storage-name' }),
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
        intl.formatMessage(
          { id: 'tone-identification.difficulty-error' },
          { count: selectedTones.length, difficulty },
        ),
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
            submitText: intl.formatMessage({
              id: 'tone-identification.start-test',
            }),
          },
          render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
        }}
      >
        <ScaleSettings />

        <Card
          title={intl.formatMessage({ id: 'tone-identification.test-settings' })}
          className="mb-6"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 border-b pb-4">
              <ProFormRadio.Group
                name="instrumentName"
                label={intl.formatMessage({
                  id: 'tone-identification.instrument',
                })}
                radioType="button"
                fieldProps={{ buttonStyle: 'solid', size: 'small' }}
                options={INSTRUMENT_NAME_OPTIONS.map((opt) => ({
                  ...opt,
                  label: intl.formatMessage({ id: opt.label }),
                }))}
              />
              <ProFormRadio.Group
                name="difficulty"
                label={intl.formatMessage({
                  id: 'tone-identification.difficulty',
                })}
                radioType="button"
                fieldProps={{ buttonStyle: 'solid', size: 'small' }}
                options={[
                  {
                    label: intl.formatMessage({
                      id: 'tone-identification.difficulty.easy',
                    }),
                    value: 2,
                  },
                  {
                    label: intl.formatMessage({
                      id: 'tone-identification.difficulty.medium',
                    }),
                    value: 4,
                  },
                  {
                    label: intl.formatMessage({
                      id: 'tone-identification.difficulty.hard',
                    }),
                    value: 6,
                  },
                  {
                    label: intl.formatMessage({
                      id: 'tone-identification.difficulty.hell',
                    }),
                    value: 8,
                  },
                ]}
              />
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-0 border-b pb-4">
              <ProFormSlider
                name="toneDuration"
                label={intl.formatMessage({
                  id: 'tone-identification.tone-duration',
                })}
                min={100}
                max={5000}
                step={100}
                width="md"
                fieldProps={{
                  tooltip: { formatter: durationFormatter },
                }}
              />
              <ProFormSlider
                name="toneWait"
                label={intl.formatMessage({
                  id: 'tone-identification.tone-wait',
                })}
                min={100}
                max={5000}
                step={100}
                width="md"
                fieldProps={{
                  tooltip: { formatter: durationFormatter },
                }}
              />
            </div>

            <div className="flex flex-wrap items-center gap-8">
              <ProFormRadio.Group
                name="mode"
                label={intl.formatMessage({ id: 'tone-identification.mode' })}
                radioType="button"
                fieldProps={{ buttonStyle: 'solid', size: 'small' }}
                options={[
                  {
                    label: intl.formatMessage({
                      id: 'tone-identification.mode.infinite',
                    }),
                    value: 'infinite',
                  },
                  {
                    label: intl.formatMessage({
                      id: 'tone-identification.mode.timed',
                    }),
                    value: 'timed',
                  },
                ]}
              />

              <ProFormDependency name={['mode']}>
                {({ mode }) =>
                  mode === 'timed' && (
                    <ProFormDigit
                      name="timeLimit"
                      label={intl.formatMessage({
                        id: 'tone-identification.time-limit',
                      })}
                      width="xs"
                      min={10}
                      fieldProps={{
                        step: 10,
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
