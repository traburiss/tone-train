import {
  DEFAULT_INSTRUMENT_NAME,
  DEFAULT_TRAIN_PLAYER_ARGS,
  OCTAVES,
  TrainPlayerArgs,
} from '@/constants';
import BasicSettings from '@/pages/Home/components/BasicSettings';
import PlaybackSettings from '@/pages/Home/components/PlaybackSettings';
import ScaleSettings from '@/pages/Home/components/ScaleSettings';
import TrainPlayer from '@/pages/Home/components/trainPlayer';
import { loadInstrument } from '@/utils/toneInstruments';
import {
  FooterToolbar,
  PageContainer,
  ProForm,
} from '@ant-design/pro-components';
import React, { useEffect, useState } from 'react';

import { useInstrumentStatus } from '@/hooks/useInstrumentStatus';
import { LoadingOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

const InstrumentStatusTag: React.FC<{ name: string }> = ({ name }) => {
  const status = useInstrumentStatus(name);

  if (status === 'loading') {
    return (
      <Tag icon={<LoadingOutlined />} color="processing">
        加载音色中...
      </Tag>
    );
  }
  if (status === 'error') {
    return <Tag color="error">{name} 加载失败</Tag>;
  }
  return null;
};

const SETTINGS_KEY = 'tone-train-settings';

const HomePage: React.FC = () => {
  const [tonePlayerArgs, setTonePlayerArgs] = useState<TrainPlayerArgs>(
    DEFAULT_TRAIN_PLAYER_ARGS,
  );
  const [tonePlayerOpen, setTonePlayerOpen] = useState<boolean>(false);
  const [form] = ProForm.useForm();

  // Watch instrument name for status display
  // Use correct default constant as fallback
  const instrumentName =
    ProForm.useWatch('instrumentName', form) || DEFAULT_INSTRUMENT_NAME;

  useEffect(() => {
    // Immediately load the selected instrument whenever it changes or on mount
    loadInstrument(instrumentName).catch(console.error);
  }, [instrumentName]);

  // Helper to transform grouped selection back to flat toneList
  const flattenGroupedTones = (groups: Record<number, string[]>) => {
    return Object.values(groups || {})
      .flat()
      .filter(Boolean);
  };

  // Helper to transform flat toneList to grouped structure for form
  const groupTones = (toneList: string[]) => {
    const groups: Record<number, string[]> = {};
    OCTAVES.forEach((oct) => {
      groups[oct] = toneList.filter((t) => t.endsWith(String(oct)));
    });
    return groups;
  };

  // Persistence logic
  useEffect(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate old flat toneList if exists
        if (parsed.toneList && !parsed.toneListGroup) {
          parsed.toneListGroup = groupTones(parsed.toneList);
        }
        const loopCountType =
          parsed.loopCountType || String(parsed.loopCount || 0);
        const loopCountCustom =
          parsed.loopCountCustom || parsed.loopCount || 10;

        form.setFieldsValue({
          ...parsed,
          loopCountType,
          loopCountCustom: loopCountType === 'custom' ? loopCountCustom : 10,
        });

        // Trigger immediate load for the persisted instrument
        if (parsed.instrumentName) {
          loadInstrument(parsed.instrumentName).catch(console.error);
        }

        setTonePlayerArgs({
          ...DEFAULT_TRAIN_PLAYER_ARGS,
          ...parsed,
          loopCount:
            loopCountType === 'custom'
              ? loopCountCustom
              : parseInt(loopCountType, 10),
          toneList: flattenGroupedTones(parsed.toneListGroup),
        });
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }, [form]);

  const onValuesChange = (_: any, allValues: any) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(allValues));
  };

  const formCommit = (v: any) => {
    const toneList = flattenGroupedTones(v.toneListGroup);
    const loopCount =
      v.loopCountType === 'custom'
        ? v.loopCountCustom
        : parseInt(v.loopCountType, 10);
    const finalArgs = {
      ...DEFAULT_TRAIN_PLAYER_ARGS,
      ...v,
      toneList,
      loopCount: isNaN(loopCount) ? 0 : loopCount,
    };
    setTonePlayerArgs(finalArgs);
    setTonePlayerOpen(true);
  };

  return (
    <PageContainer ghost className="px-1 sm:px-4">
      <ProForm
        form={form}
        size={'large'}
        initialValues={{
          ...DEFAULT_TRAIN_PLAYER_ARGS,
          loopCountType: String(DEFAULT_TRAIN_PLAYER_ARGS.loopCount),
          loopCountCustom: 10,
          toneListGroup: groupTones(DEFAULT_TRAIN_PLAYER_ARGS.toneList),
        }}
        onValuesChange={onValuesChange}
        onFinish={formCommit}
        layout={'horizontal'}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '开始训练',
          },
          render: (_, dom) => (
            <FooterToolbar
              extra={<InstrumentStatusTag name={instrumentName} />}
            >
              {dom}
            </FooterToolbar>
          ),
        }}
      >
        <ScaleSettings />
        <BasicSettings />
        <PlaybackSettings />
      </ProForm>
      <TrainPlayer
        open={tonePlayerOpen}
        onCancel={() => setTonePlayerOpen(false)}
        {...tonePlayerArgs}
      />
    </PageContainer>
  );
};

export default HomePage;
