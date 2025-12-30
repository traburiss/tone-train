import ChordSettings from '@/components/ChordSettings';
import {
  CHROMATIC_SCALE,
  DEFAULT_GUITAR_CHORDS,
  MAJOR_SCALE,
  OCTAVES,
  TONE_LIST_CHORDS,
  TONE_TYPE_OPTIONS,
} from '@/constants';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import {
  ProFormCheckbox,
  ProFormDependency,
  ProFormRadio,
} from '@ant-design/pro-components';
import { Button, Card, Form, Space } from 'antd';
import { useIntl } from '@umijs/max';
import React, { useState } from 'react';
import './index.css';

const ScaleSettings: React.FC = () => {
  const form = Form.useFormInstance();
  const [expandedOctaves, setExpandedOctaves] = useState<number[]>([]);
  const intl = useIntl();

  const toggleOctave = (oct: number) => {
    setExpandedOctaves((prev) =>
      prev.includes(oct) ? prev.filter((o) => o !== oct) : [...prev, oct],
    );
  };

  const handleSelectAllOctave = (
    oct: number,
    checked: boolean,
    scale: string[],
  ) => {
    const allNotes = scale.map((note) => `${note}${oct}`);
    form.setFieldValue(['toneListGroup', oct], checked ? allNotes : []);
  };

  const handleSelectMajorOctave = (oct: number, checked: boolean) => {
    const majorNotes = MAJOR_SCALE.map((note) => `${note}${oct}`);
    form.setFieldValue(['toneListGroup', oct], checked ? majorNotes : []);
  };

  const handleSelectAllGlobal = (checked: boolean, toneType: string) => {
    if (toneType === 'GuitarChords') {
      // Default select common chords
      const currentChords = form.getFieldValue(['toneListGroup', 'chords']);
      if (!currentChords || currentChords.length === 0) {
        form.setFieldValue(['toneListGroup', 'chords'], DEFAULT_GUITAR_CHORDS);
      } else {
        form.setFieldValue('toneListGroup', {
          chords: checked ? TONE_LIST_CHORDS : [],
        });
      }
      return;
    }
    const scale = toneType === '8Tone' ? MAJOR_SCALE : CHROMATIC_SCALE;
    const newGroup: Record<number, string[]> = {};
    OCTAVES.forEach((oct) => {
      newGroup[oct] = checked ? scale.map((n) => `${n}${oct}`) : [];
    });
    form.setFieldValue('toneListGroup', newGroup);
  };

  const handleSelectMajorGlobal = (checked: boolean) => {
    const newGroup: Record<number, string[]> = {};
    OCTAVES.forEach((oct) => {
      newGroup[oct] = checked ? MAJOR_SCALE.map((n) => `${n}${oct}`) : [];
    });
    form.setFieldValue('toneListGroup', newGroup);
  };

  return (
    <ProFormDependency name={['toneType', 'toneListGroup']}>
      {({ toneType, toneListGroup }) => (
        <Card
          title={intl.formatMessage({ id: 'tone-training.scale-settings' })}
          className="scale-card mb-6"
          extra={
            <Space size={12} wrap>
              <Space size={4}>
                <Button
                  size="small"
                  onClick={() => handleSelectAllGlobal(true, toneType)}
                >
                  {intl.formatMessage({ id: 'common.select-all' })}
                </Button>
                {toneType !== '8Tone' && toneType !== 'GuitarChords' && (
                  <Button
                    size="small"
                    onClick={() => handleSelectMajorGlobal(true)}
                  >
                    {intl.formatMessage({ id: 'tone-training.select-major' })}
                  </Button>
                )}
              </Space>
              <div className="w-[1px] h-[14px] bg-[#e8e8e8]" />
              <ProFormRadio.Group
                name="toneType"
                noStyle
                radioType="button"
                fieldProps={{
                  size: 'small',
                  buttonStyle: 'solid',
                  onChange: (e) => {
                    const value = e.target.value;
                    if (value === 'GuitarChords') {
                      const currentChords = form.getFieldValue([
                        'toneListGroup',
                        'chords',
                      ]);
                      if (!currentChords || currentChords.length === 0) {
                        form.setFieldValue(
                          ['toneListGroup', 'chords'],
                          DEFAULT_GUITAR_CHORDS,
                        );
                      }
                    }
                  },
                }}
                options={TONE_TYPE_OPTIONS.map((opt) => ({
                  ...opt,
                  label: intl.formatMessage({ id: opt.label }),
                }))}
              />
            </Space>
          }
        >
          <div className="flex flex-col gap-2">
            {toneType === 'GuitarChords' ? (
              <div className="octave-row p-2 sm:p-2.5 border border-[#f0f0f0] rounded-lg bg-[#fafafa] flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <span className="font-bold text-[14px] sm:text-[15px] text-[#1a1a1a] mr-1">
                    {intl.formatMessage({ id: 'tone-training.chords' })}
                  </span>
                  <Space size={4}>
                    <Button
                      size="small"
                      type={
                        (toneListGroup?.chords || []).length ===
                        TONE_LIST_CHORDS.length
                          ? 'primary'
                          : 'default'
                      }
                      onClick={() => {
                        const allSelected =
                          (toneListGroup?.chords || []).length ===
                          TONE_LIST_CHORDS.length;
                        form.setFieldValue(
                          ['toneListGroup', 'chords'],
                          allSelected ? [] : TONE_LIST_CHORDS,
                        );
                      }}
                      className="text-[12px]"
                    >
                      {intl.formatMessage({ id: 'common.select-all' })}
                    </Button>
                  </Space>
                  <span className="text-[11px] sm:text-[12px] color-[#888] ml-1 min-w-[20px]">
                    ({(toneListGroup?.chords || []).length})
                  </span>
                </div>
                <div className="hidden sm:block w-[1px] h-6 bg-[#e8e8e8]" />
                <div className="flex flex-wrap gap-4 flex-1 w-full justify-center sm:justify-start">
                  <Form.Item
                    name={['toneListGroup', 'chords']}
                    style={{ marginBottom: 0, width: '100%' }}
                  >
                    <ChordSettings />
                  </Form.Item>
                </div>
              </div>
            ) : (
              OCTAVES.map((oct) => {
                const scale =
                  toneType === '8Tone' ? MAJOR_SCALE : CHROMATIC_SCALE;
                const currentOctSelected = toneListGroup?.[oct] || [];
                const isAllSelected =
                  currentOctSelected.length === scale.length;
                const isMajorSelected =
                  currentOctSelected.length === MAJOR_SCALE.length &&
                  MAJOR_SCALE.every((m) =>
                    currentOctSelected.includes(`${m}${oct}`),
                  );

                return (
                  <div
                    key={oct}
                    className="octave-row p-2 sm:p-2.5 border border-[#f0f0f0] rounded-lg bg-[#fafafa] flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3"
                  >
                    {/* Octave Controls */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <span className="font-bold text-[14px] sm:text-[15px] text-[#1a1a1a] mr-1">
                        Oct {oct}
                      </span>
                      <Space size={4}>
                        <Button
                          size="small"
                          type={isAllSelected ? 'primary' : 'default'}
                          onClick={() =>
                            handleSelectAllOctave(oct, !isAllSelected, scale)
                          }
                          className="text-[12px]"
                        >
                          {intl.formatMessage({ id: 'common.select-all' })}
                        </Button>
                        {toneType !== '8Tone' && (
                          <Button
                            size="small"
                            type={isMajorSelected ? 'primary' : 'default'}
                            onClick={() =>
                              handleSelectMajorOctave(oct, !isMajorSelected)
                            }
                            className="text-[12px]"
                          >
                            {intl.formatMessage({ id: 'tone-training.select-major' })}
                          </Button>
                        )}
                      </Space>
                      <span className="text-[11px] sm:text-[12px] color-[#888] ml-1 min-w-[20px]">
                        ({currentOctSelected.length})
                      </span>

                      {/* Mobile Toggle Button */}
                      <Button
                        type="text"
                        size="small"
                        className="sm:hidden ml-auto flex items-center gap-1 text-[#1890ff]"
                        onClick={() => toggleOctave(oct)}
                      >
                        {expandedOctaves.includes(oct) ? (
                          <>
                            {intl.formatMessage({ id: 'common.collapse' })}{' '}
                            <DownOutlined className="text-[10px]" />
                          </>
                        ) : (
                          <>
                            {intl.formatMessage({ id: 'common.expand' })}{' '}
                            <RightOutlined className="text-[10px]" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Divider */}
                    <div className="hidden sm:block w-[1px] h-6 bg-[#e8e8e8]" />

                    {/* Notes Group */}
                    <div
                      className={`${expandedOctaves.includes(oct) ? 'flex' : 'hidden sm:flex'} flex-wrap gap-1.5 flex-1 w-full`}
                    >
                      <ProFormCheckbox.Group
                        name={['toneListGroup', oct]}
                        className="touch-button-group"
                        options={scale.map((note) => ({
                          label: note,
                          value: `${note}${oct}`,
                        }))}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}
    </ProFormDependency>
  );
};

export default ScaleSettings;
