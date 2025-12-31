import {
  DURATION_STEP,
  GET_DURATION_FORMATTER,
  MAX_DURATION,
  MIX_DURATION,
} from '@/constants';
import {
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormSlider,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card, Divider, Form, Space } from 'antd';
import React from 'react';
import './MaExerciseSettings.less';

// Generate notes from C2 to C6
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const generateNotes = () => {
  const notes = [];
  for (let i = 2; i <= 5; i++) {
    NOTES.forEach((note) => notes.push(`${note}${i}`));
  }
  notes.push('C6');
  return notes;
};
const NOTE_OPTIONS = generateNotes().map((n) => ({ label: n, value: n }));

const MaExerciseSettings: React.FC = () => {
  const intl = useIntl();
  const form = Form.useFormInstance();
  const durationFormatter = GET_DURATION_FORMATTER(intl);

  const handlePresetChange = (value: string) => {
    if (value === 'male') {
      form.setFieldsValue({ startNote: 'B2', endNote: 'B3' });
    } else if (value === 'female') {
      form.setFieldsValue({ startNote: 'F3', endNote: 'D4' });
    }
  };

  return (
    <div className="settings-container">
      {/* Group 1: Range Selection */}
      <Card
        title={intl.formatMessage({
          id: 'vocal.ma-exercise.settings.group.range',
        })}
        size="small"
        className="settings-card"
      >
        <ProFormRadio.Group
          name="preset"
          radioType="button"
          label={intl.formatMessage({
            id: 'vocal.ma-exercise.settings.preset',
          })}
          options={[
            {
              label: intl.formatMessage({
                id: 'vocal.ma-exercise.settings.preset.male',
              }),
              value: 'male',
            },
            {
              label: intl.formatMessage({
                id: 'vocal.ma-exercise.settings.preset.female',
              }),
              value: 'female',
            },
            {
              label: intl.formatMessage({
                id: 'vocal.ma-exercise.settings.preset.custom',
              }),
              value: 'custom',
            },
          ]}
          fieldProps={{
            buttonStyle: 'solid',
            size: 'middle',
            onChange: (e) => handlePresetChange(e.target.value),
          }}
        />

        <ProFormDependency name={['preset']}>
          {({ preset }) => {
            const isCustom = preset === 'custom';
            return (
              <Space
                direction="horizontal"
                size={window.innerWidth < 640 ? 0 : 16}
                wrap={window.innerWidth < 640}
                style={{ width: '100%' }}
              >
                <ProFormSelect
                  name="startNote"
                  label={intl.formatMessage({
                    id: 'vocal.ma-exercise.settings.start-note',
                  })}
                  options={NOTE_OPTIONS}
                  width="sm"
                  disabled={!isCustom}
                />
                <Divider type="vertical" className="range-divider" />
                <ProFormSelect
                  name="endNote"
                  label={intl.formatMessage({
                    id: 'vocal.ma-exercise.settings.end-note',
                  })}
                  options={NOTE_OPTIONS}
                  width="sm"
                  disabled={!isCustom}
                />
              </Space>
            );
          }}
        </ProFormDependency>

        <ProFormSlider
          name="loopCount"
          label={intl.formatMessage({
            id: 'vocal.ma-exercise.settings.loop-count',
          })}
          min={1}
          max={10}
          width="md"
        />
      </Card>

      {/* Group 2: Root Note Settings */}
      <Card
        title={intl.formatMessage({
          id: 'vocal.ma-exercise.settings.group.root',
        })}
        size="small"
        className="settings-card"
      >
        <Space direction="horizontal" size={16} wrap className="settings-row">
          <ProFormSlider
            name="countdown"
            label={intl.formatMessage({
              id: 'vocal.ma-exercise.settings.countdown',
            })}
            width="md"
            min={MIX_DURATION}
            max={MAX_DURATION}
            step={DURATION_STEP}
            fieldProps={{ tooltip: { formatter: durationFormatter } }}
          />
          <ProFormSlider
            name="rootNoteWait"
            label={intl.formatMessage({
              id: 'vocal.ma-exercise.settings.root-wait',
            })}
            width="md"
            min={MIX_DURATION}
            max={MAX_DURATION}
            step={DURATION_STEP}
            fieldProps={{ tooltip: { formatter: durationFormatter } }}
          />
        </Space>
      </Card>

      {/* Group 3: Guide Melody Settings */}
      <Card
        title={intl.formatMessage({
          id: 'vocal.ma-exercise.settings.group.melody',
        })}
        size="small"
        className="settings-card"
      >
        <Space direction="horizontal" size={16} wrap className="settings-row">
          <ProFormSlider
            name="firstNoteDuration"
            label={intl.formatMessage({
              id: 'vocal.ma-exercise.settings.first-note-duration',
            })}
            width="md"
            min={MIX_DURATION}
            max={MAX_DURATION}
            step={DURATION_STEP}
            fieldProps={{ tooltip: { formatter: durationFormatter } }}
          />
          <ProFormSlider
            name="intervalDuration"
            label={intl.formatMessage({
              id: 'vocal.ma-exercise.settings.interval-duration',
            })}
            width="md"
            min={MIX_DURATION}
            max={MAX_DURATION}
            step={DURATION_STEP}
            fieldProps={{ tooltip: { formatter: durationFormatter } }}
          />
          <ProFormSlider
            name="lastNoteDuration"
            label={intl.formatMessage({
              id: 'vocal.ma-exercise.settings.last-note-duration',
            })}
            width="md"
            min={MIX_DURATION}
            max={MAX_DURATION}
            step={DURATION_STEP}
            fieldProps={{ tooltip: { formatter: durationFormatter } }}
          />
          <ProFormSlider
            name="postMelodyWait"
            label={intl.formatMessage({
              id: 'vocal.ma-exercise.settings.post-melody-wait',
            })}
            width="md"
            min={MIX_DURATION}
            max={MAX_DURATION}
            step={DURATION_STEP}
            fieldProps={{ tooltip: { formatter: durationFormatter } }}
          />
        </Space>
      </Card>
    </div>
  );
};

export default MaExerciseSettings;
