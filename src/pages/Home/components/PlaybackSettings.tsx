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
} from '@ant-design/pro-components';
import { Card, Tooltip } from 'antd';
import React from 'react';

const PlaybackSettings: React.FC = () => {
  return (
    <Card title="播放参数" className="mb-3 sm:mb-6">
      <ProForm.Group>
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
        <ProFormSlider
          name="ttsWait"
          label="报音阶后等待"
          width="md"
          min={MIX_DURATION}
          max={MAX_DURATION}
          step={DURATION_STEP}
          fieldProps={{ tooltip: { formatter: DURATION_FORMATTER } }}
        />
        <ProFormDependency name={['ttsEnable']}>
          {({ ttsEnable }) =>
            ttsEnable && (
              <ProFormSlider
                name="ttsRate"
                label={<Tooltip title="倍数越大越慢">报音阶语速</Tooltip>}
                width="md"
                min={0.5}
                max={4.0}
                step={0.1}
                fieldProps={{ tooltip: { formatter: (v) => `${v}x 时长` } }}
              />
            )
          }
        </ProFormDependency>
      </ProForm.Group>
    </Card>
  );
};

export default PlaybackSettings;
