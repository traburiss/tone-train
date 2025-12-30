import ScaleSettings from '@/components/ScaleSettings';
import {
  DEFAULT_INSTRUMENT_NAME,
  DEFAULT_TONE_TYPE,
  DEFAULT_TRAIN_PLAYER_ARGS,
  OCTAVES,
  TONE_LIST_CHORDS,
  TONES_TRAINING_STORAGE_KEY,
  TrainPlayerArgs,
} from '@/constants';
import BasicSettings from '@/pages/Instrument/ToneTraining/components/BasicSettings';
import PlaybackSettings from '@/pages/Instrument/ToneTraining/components/PlaybackSettings';
import TrainPlayer from '@/pages/Instrument/ToneTraining/components/trainPlayer';
import { getPageSettings, setPageSettings } from '@/utils/storage';
import { loadInstrument } from '@/utils/toneInstruments';
import {
  FooterToolbar,
  PageContainer,
  ProForm,
} from '@ant-design/pro-components';

import React, { useEffect, useState } from 'react';

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

  const flattenGroupedTones = (
    groups: Record<string, string[]>,
    toneType: string,
  ) => {
    console.log('flattenGroupedTones input:', { groups, toneType });
    if (toneType === 'GuitarChords') {
      const chords = groups['chords'] || [];
      console.log('Returning chords:', chords);
      return chords;
    }
    // For scales, only include numeric keys (octaves)
    const scales = Object.entries(groups || {})
      .filter(([key]) => !isNaN(Number(key)))
      .map(([, values]) => values)
      .flat()
      .filter(Boolean);
    console.log('Returning scales:', scales);
    return scales;
  };

  // Helper to transform flat toneList to grouped structure for form
  const groupTones = (toneList: string[]) => {
    const groups: Record<string, string[]> = {};
    // Put anything that is in TONE_LIST_CHORDS into 'chords' group
    groups['chords'] = toneList.filter((t) => TONE_LIST_CHORDS.includes(t));

    // Put others into octave groups
    OCTAVES.forEach((oct) => {
      groups[oct] = toneList.filter(
        (t) => t.endsWith(String(oct)) && !TONE_LIST_CHORDS.includes(t),
      );
    });
    return groups;
  };

  // Persistence logic
  useEffect(() => {
    const saved = getPageSettings<any>(TONES_TRAINING_STORAGE_KEY, null);
    if (saved) {
      try {
        const parsed = saved;
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
          toneList: flattenGroupedTones(
            parsed.toneListGroup,
            parsed.toneType || DEFAULT_TONE_TYPE,
          ),
        });
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }, [form]);

  const onValuesChange = (_: any, allValues: any) => {
    setPageSettings(TONES_TRAINING_STORAGE_KEY, allValues, '听音训练配置');
  };

  const formCommit = (v: any) => {
    const toneList = flattenGroupedTones(v.toneListGroup, v.toneType);
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
    <PageContainer
      header={{
        title: '听音训练',
      }}
    >
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
          render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
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
