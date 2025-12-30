import {
  GET_DURATION_FORMATTER,
  MAX_DURATION,
  MIX_DURATION,
  DURATION_STEP,
} from '@/constants';
import {
  ProForm,
  ProFormDependency,
  ProFormSlider,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card } from 'antd';
import React from 'react';

const PlaybackSettings: React.FC = () => {
  const intl = useIntl();
  const durationFormatter = GET_DURATION_FORMATTER(intl);

  return (
    <Card
      title={intl.formatMessage({ id: 'common.playback-settings' })}
      className="mb-3 sm:mb-6"
    >
      <ProForm.Group
        title={intl.formatMessage({ id: 'common.time-settings' })}
      >
        <ProFormSlider
          name="toneDuration"
          label={intl.formatMessage({ id: 'common.tone-duration' })}
          width="md"
          min={MIX_DURATION}
          max={MAX_DURATION}
          step={DURATION_STEP}
          fieldProps={{ tooltip: { formatter: durationFormatter } }}
        />
        <ProFormSlider
          name="toneWait"
          label={intl.formatMessage({ id: 'common.tone-wait' })}
          width="md"
          min={MIX_DURATION}
          max={MAX_DURATION}
          step={DURATION_STEP}
          fieldProps={{ tooltip: { formatter: durationFormatter } }}
        />
      </ProForm.Group>

      <ProForm.Group
        title={intl.formatMessage({ id: 'common.tts-settings' })}
      >
        <ProFormSwitch
          name="ttsEnable"
          label={intl.formatMessage({ id: 'common.tts-enable' })}
          tooltip={intl.formatMessage({ id: 'common.tts-enable.tooltip' })}
        />
        <ProFormDependency name={['ttsEnable']}>
          {({ ttsEnable }) =>
            ttsEnable && (
              <ProFormSlider
                name="ttsRate"
                label={intl.formatMessage({ id: 'common.tts-rate' })}
                tooltip={intl.formatMessage({ id: 'common.tts-rate.tooltip' })}
                width="md"
                min={0.5}
                max={4.0}
                step={0.1}
                fieldProps={{
                  tooltip: {
                    formatter: (v) =>
                      `${v}x ${intl.formatMessage({ id: 'common.tone-duration' })}`,
                  },
                }}
              />
            )
          }
        </ProFormDependency>

        <ProFormDependency name={['ttsEnable']}>
          {({ ttsEnable }) =>
            ttsEnable && (
              <ProFormSlider
                name="ttsWait"
                label={intl.formatMessage({ id: 'common.tts-wait' })}
                width="md"
                min={MIX_DURATION}
                max={MAX_DURATION}
                step={DURATION_STEP}
                fieldProps={{ tooltip: { formatter: durationFormatter } }}
              />
            )
          }
        </ProFormDependency>
      </ProForm.Group>
      <ProFormDependency name={['ttsEnable']}>
        {({ ttsEnable }) =>
          ttsEnable && (
            <ProForm.Group>
              <ProFormSwitch
                name="ttsSolfege"
                label={intl.formatMessage({ id: 'common.tts-solfege' })}
                tooltip={intl.formatMessage({
                  id: 'common.tts-solfege.tooltip',
                })}
              />
              <ProFormDependency name={['ttsSolfege']}>
                {({ ttsSolfege }) =>
                  ttsSolfege && (
                    <ProFormSlider
                      name="ttsSolfegeWait"
                      label={intl.formatMessage({
                        id: 'common.tts-solfege-wait',
                      })}
                      width="sm"
                      min={MIX_DURATION}
                      max={MAX_DURATION}
                      step={DURATION_STEP}
                      fieldProps={{
                        tooltip: { formatter: durationFormatter },
                      }}
                    />
                  )
                }
              </ProFormDependency>
            </ProForm.Group>
          )
        }
      </ProFormDependency>
      <ProFormDependency name={['ttsEnable']}>
        {({ ttsEnable }) =>
          ttsEnable && (
            <ProForm.Group>
              <ProFormSwitch
                name="ttsNotation"
                label={intl.formatMessage({ id: 'common.tts-notation' })}
                tooltip={intl.formatMessage({
                  id: 'common.tts-notation.tooltip',
                })}
              />
              <ProFormDependency name={['ttsNotation']}>
                {({ ttsNotation }) =>
                  ttsNotation && (
                    <ProFormSlider
                      name="ttsNotationWait"
                      label={intl.formatMessage({
                        id: 'common.tts-notation-wait',
                      })}
                      width="sm"
                      min={MIX_DURATION}
                      max={MAX_DURATION}
                      step={DURATION_STEP}
                      fieldProps={{
                        tooltip: { formatter: durationFormatter },
                      }}
                    />
                  )
                }
              </ProFormDependency>
            </ProForm.Group>
          )
        }
      </ProFormDependency>
    </Card>
  );
};

export default PlaybackSettings;
