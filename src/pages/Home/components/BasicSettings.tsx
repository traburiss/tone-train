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
      <ProForm.Group>
        <ProFormRadio.Group
          name="instrumentName"
          label="音色选择"
          tooltip="用户可以选择自己习惯的音色来听音名播放"
          radioType="button"
          fieldProps={{ buttonStyle: 'solid' }}
          options={INSTRUMENT_NAME_OPTIONS}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormRadio.Group
          name="loopCountType"
          label="循环次数"
          tooltip="用户可以选择循环次数，或者自定义循环次数"
          radioType="button"
          fieldProps={{ buttonStyle: 'solid' }}
          options={LOOP_COUNT_OPTIONS}
        />
        <ProFormDependency name={['loopCountType']}>
          {({ loopCountType }) =>
            loopCountType === 'custom' && (
              <ProFormDigit
                name="loopCountCustom"
                label=" "
                width="xs"
                placeholder="次数"
                min={1}
                max={1000}
                fieldProps={{ precision: 0 }}
              />
            )
          }
        </ProFormDependency>
      </ProForm.Group>

      <ProForm.Group>
        <ProFormSwitch
          name="random"
          label="随机播放"
          tooltip="不要按照音阶顺序播放音阶"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSwitch
          name="referenceNoteEnabled"
          label="播放基准"
          tooltip="播放音阶时，会先播放基准音，再播放音阶，以降低难度"
        />
        <ProFormDependency name={['referenceNoteEnabled']}>
          {({ referenceNoteEnabled }) =>
            referenceNoteEnabled && (
              <ProFormSelect
                name="referenceNote"
                label=" "
                width="xs"
                options={REFERENCE_NOTE_OPTIONS}
                placeholder="选择基准音"
              />
            )
          }
        </ProFormDependency>
      </ProForm.Group>
    </Card>
  );
};

export default BasicSettings;
