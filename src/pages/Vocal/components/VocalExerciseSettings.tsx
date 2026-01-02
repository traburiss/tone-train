import {
  DURATION_STEP,
  GET_DURATION_FORMATTER,
  MAX_DURATION,
  MIX_DURATION,
} from '@/constants';
import {
  ProForm,
  ProFormDependency,
  ProFormRadio,
  ProFormSelect,
  ProFormSlider,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Card, Space } from 'antd';
import React from 'react';
import * as Tone from 'tone';
import './VocalExerciseSettings.less';

// Generate notes from A2 to C6 (covering full vocal range)
const generateNotes = () => {
  const notes = [];
  const startMidi = Tone.Frequency('A2').toMidi();
  const endMidi = Tone.Frequency('C6').toMidi();

  for (let i = startMidi; i <= endMidi; i++) {
    notes.push(Tone.Frequency(i, 'midi').toNote());
  }
  return notes;
};
const NOTE_OPTIONS = generateNotes().map((n) => ({ label: n, value: n }));

interface VocalExerciseSettingsProps {
  presets: Record<string, { startNote: string; endNote: string }>;
  localizationPrefix: string; // e.g., 'vocal.ma-exercise' or 'vocal.resonance'
}

const VocalExerciseSettings: React.FC<VocalExerciseSettingsProps> = ({
  presets,
  localizationPrefix,
}) => {
  const intl = useIntl();
  const form = ProForm.useFormInstance();
  const durationFormatter = GET_DURATION_FORMATTER(intl);

  const handlePresetChange = (value: string) => {
    if (presets[value]) {
      form?.setFieldsValue(presets[value]);
    }
  };

  return (
    <div className="vocal-settings-container">
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
                id: `${localizationPrefix}.settings.preset.male`,
              }),
              value: 'male',
            },
            {
              label: intl.formatMessage({
                id: `${localizationPrefix}.settings.preset.female`,
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
                wrap
                style={{ width: '100%', marginTop: 16 }}
              >
                <ProFormSelect
                  name="startNote"
                  label={intl.formatMessage({
                    id: 'vocal.ma-exercise.settings.start-note',
                  })}
                  options={NOTE_OPTIONS}
                  width="sm"
                  disabled={!isCustom}
                  rules={[{ required: true }]}
                />
                <ProFormSelect
                  name="endNote"
                  label={intl.formatMessage({
                    id: 'vocal.ma-exercise.settings.end-note',
                  })}
                  options={NOTE_OPTIONS}
                  width="sm"
                  disabled={!isCustom}
                  rules={[{ required: true }]}
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

export default VocalExerciseSettings;
