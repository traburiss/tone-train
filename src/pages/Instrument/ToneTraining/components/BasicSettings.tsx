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
import { useIntl } from '@umijs/max';
import { Card } from 'antd';
import React from 'react';

const BasicSettings: React.FC = () => {
  const intl = useIntl();

  return (
    <Card
      title={intl.formatMessage({ id: 'common.basic-settings' })}
      className="mb-3 sm:mb-6"
    >
      <ProForm.Group>
        <ProFormRadio.Group
          name="instrumentName"
          label={intl.formatMessage({ id: 'common.instrument-choice' })}
          tooltip={intl.formatMessage({
            id: 'common.instrument-choice.tooltip',
          })}
          radioType="button"
          fieldProps={{ buttonStyle: 'solid', size: 'middle' }}
          options={INSTRUMENT_NAME_OPTIONS.map((opt) => ({
            ...opt,
            label: intl.formatMessage({ id: opt.label }),
          }))}
        />
      </ProForm.Group>

      <ProForm.Group>
        <ProFormRadio.Group
          name="loopCountType"
          label={intl.formatMessage({ id: 'common.loop-count' })}
          tooltip={intl.formatMessage({ id: 'common.loop-count.tooltip' })}
          radioType="button"
          fieldProps={{ buttonStyle: 'solid', size: 'middle' }}
          options={LOOP_COUNT_OPTIONS.map((opt) => ({
            ...opt,
            label: intl.formatMessage({ id: opt.label }, { n: opt.value }),
          }))}
        />
        <ProFormDependency name={['loopCountType']}>
          {({ loopCountType }) =>
            loopCountType === 'custom' && (
              <ProFormDigit
                name="loopCountCustom"
                label=" "
                width="xs"
                placeholder={intl.formatMessage({ id: 'common.count' })}
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
          label={intl.formatMessage({ id: 'common.random-play' })}
          tooltip={intl.formatMessage({ id: 'common.random-play.tooltip' })}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSwitch
          name="referenceNoteEnabled"
          label={intl.formatMessage({ id: 'common.reference-note' })}
          tooltip={intl.formatMessage({ id: 'common.reference-note.tooltip' })}
        />
        <ProFormDependency name={['referenceNoteEnabled']}>
          {({ referenceNoteEnabled }) =>
            referenceNoteEnabled && (
              <ProFormSelect
                name="referenceNote"
                label=" "
                width="xs"
                options={REFERENCE_NOTE_OPTIONS}
                placeholder={intl.formatMessage({
                  id: 'common.reference-note.placeholder',
                })}
              />
            )
          }
        </ProFormDependency>
      </ProForm.Group>
    </Card>
  );
};

export default BasicSettings;
