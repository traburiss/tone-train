import {
  INSTRUMENT_NAME_OPTIONS,
  LOOP_COUNT_OPTIONS,
  REFERENCE_NOTE_OPTIONS,
} from '@/constants';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const BasicSettings: React.FC = () => {
  return (
    <Card title="基础配置" className="mb-3 sm:mb-6">
      <ProForm.Group size={8}>
        <ProFormRadio.Group
          name="instrumentName"
          label="音色"
          radioType="button"
          options={INSTRUMENT_NAME_OPTIONS}
        />
        <ProFormRadio.Group
          name="loopCountType"
          label="循环次数"
          radioType="button"
          options={LOOP_COUNT_OPTIONS}
        />
        <ProFormDependency name={['loopCountType']}>
          {({ loopCountType }) =>
            loopCountType === 'custom' && (
              <ProFormDigit
                name="loopCountCustom"
                label="自定义次数"
                width="xs"
                min={1}
                max={1000}
                fieldProps={{ precision: 0 }}
              />
            )
          }
        </ProFormDependency>
      </ProForm.Group>
      <ProForm.Group size={8}>
        <ProFormSwitch name="ttsEnable" label="语音报号" />
        <ProFormSwitch name="random" label="随机播放" />
        <ProFormSwitch name="referenceNoteEnabled" label="播放对比基准音" />
        <ProFormDependency name={['referenceNoteEnabled']}>
          {({ referenceNoteEnabled }) =>
            referenceNoteEnabled && (
              <ProFormSelect
                name="referenceNote"
                label="基准音"
                width="xs"
                options={REFERENCE_NOTE_OPTIONS}
              />
            )
          }
        </ProFormDependency>
      </ProForm.Group>
    </Card>
  );
};

export default BasicSettings;
