import {
  DURATION_FORMATTER,
  DURATION_STEP,
  MAX_DURATION,
  MIX_DURATION,
} from '@/constants';
import {
  ProForm,
  ProFormDependency,
  ProFormSlider,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const PlaybackSettings: React.FC = () => {
  return (
    <Card title="播放配置" className="mb-3 sm:mb-6">
      <ProForm.Group title="时间设置">
        <ProFormSlider
          name="toneDuration"
          label="音阶时长"
          width="md"
          min={MIX_DURATION}
          max={MAX_DURATION}
          step={DURATION_STEP}
          fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
        />
        <ProFormSlider
          name="toneWait"
          label="音阶播后等待"
          width="md"
          min={MIX_DURATION}
          max={MAX_DURATION}
          step={DURATION_STEP}
          fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
        />
      </ProForm.Group>

      <ProForm.Group title="音名播报设置">
        <ProFormSwitch
          name="ttsEnable"
          label="语音报音名"
          tooltip="每次结束后播报音名"
        />
        <ProFormDependency name={['ttsEnable']}>
          {({ ttsEnable }) =>
            ttsEnable && (
              <ProFormSlider
                name="ttsRate"
                label="报音阶语速"
                tooltip="倍数越大越慢"
                width="md"
                min={0.5}
                max={4.0}
                step={0.1}
                fieldProps={{ tooltip: { formatter: (v) => `${v}x 时长` } }}
              />
            )
          }
        </ProFormDependency>

        <ProFormDependency name={['ttsEnable']}>
          {({ ttsEnable }) =>
            ttsEnable && (
              <ProFormSlider
                name="ttsWait"
                label="报音名后等待"
                width="md"
                min={MIX_DURATION}
                max={MAX_DURATION}
                step={DURATION_STEP}
                fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
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
                label="额外报唱名"
                tooltip="报完音名后，追加唱名（如：Do）"
              />
              <ProFormDependency name={['ttsSolfege']}>
                {({ ttsSolfege }) =>
                  ttsSolfege && (
                    <ProFormSlider
                      name="ttsSolfegeWait"
                      label="唱名间隔"
                      width="sm"
                      min={MIX_DURATION}
                      max={MAX_DURATION}
                      step={DURATION_STEP}
                      fieldProps={{
                        tooltip: { formatter: DURATION_FORMATTER },
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
                label="额外报简谱"
                tooltip="报完音名后，追加简谱记号（如：1）"
              />
              <ProFormDependency name={['ttsNotation']}>
                {({ ttsNotation }) =>
                  ttsNotation && (
                    <ProFormSlider
                      name="ttsNotationWait"
                      label="简谱间隔"
                      width="sm"
                      min={MIX_DURATION}
                      max={MAX_DURATION}
                      step={DURATION_STEP}
                      fieldProps={{
                        tooltip: { formatter: DURATION_FORMATTER },
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
