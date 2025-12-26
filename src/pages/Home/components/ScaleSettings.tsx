import {
  CHROMATIC_SCALE,
  MAJOR_SCALE,
  OCTAVES,
  TONE_TYPE_OPTIONS,
} from '@/constants';
import {
  ProFormCheckbox,
  ProFormDependency,
  ProFormRadio,
} from '@ant-design/pro-components';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Form, Space } from 'antd';
import React, { useState } from 'react';
import './ScaleSettings.css';

const ScaleSettings: React.FC = () => {
  const form = Form.useFormInstance();
  const [expandedOctaves, setExpandedOctaves] = useState<number[]>([]);

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
          title="音阶设置"
          className="scale-card mb-6"
          extra={
            <Space size={12} wrap>
              <Space size={4}>
                <Button
                  size="small"
                  onClick={() => handleSelectAllGlobal(true, toneType)}
                >
                  全选
                </Button>
                {toneType !== '8Tone' && (
                  <Button
                    size="small"
                    onClick={() => handleSelectMajorGlobal(true)}
                  >
                    全音
                  </Button>
                )}
              </Space>
              <div className="w-[1px] h-[14px] bg-[#e8e8e8]" />
              <ProFormRadio.Group
                name="toneType"
                noStyle
                radioType="button"
                // fieldProps={{ size: 'small' }}
                options={TONE_TYPE_OPTIONS}
              />
            </Space>
          }
        >
          <div className="flex flex-col gap-2">
            {OCTAVES.map((oct) => {
              const scale =
                toneType === '8Tone' ? MAJOR_SCALE : CHROMATIC_SCALE;
              const currentOctSelected = toneListGroup?.[oct] || [];
              const isAllSelected = currentOctSelected.length === scale.length;
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
                        全选
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
                          全音
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
                          收起 <DownOutlined className="text-[10px]" />
                        </>
                      ) : (
                        <>
                          展开 <RightOutlined className="text-[10px]" />
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
            })}
          </div>
        </Card>
      )}
    </ProFormDependency>
  );
};

export default ScaleSettings;
