import { CHORD_FINGERINGS } from '@/utils/musicTheory';
import { useIntl } from '@umijs/max';
import { Button, Checkbox } from 'antd';
import React, { useMemo, useState } from 'react';
import ChordDiagram from './ChordDiagram';

const MAJOR_CHORDS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const MINOR_CHORDS = ['Em', 'Am', 'Dm', 'Bm', 'F#m', 'C#m', 'Gm'];
const POWER_CHORDS = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];
const DOM7_CHORDS = ['G7', 'C7', 'D7', 'E7', 'A7', 'B7'];
const MAJ7_CHORDS = ['Cmaj7', 'Gmaj7', 'Fmaj7', 'Amaj7'];
const M7_CHORDS = ['Am7', 'Em7', 'Dm7', 'Bm7', 'F#m7'];
const SUS_CHORDS = ['Dsus4', 'Asus4', 'Esus4'];
const SLASH_CHORDS = ['D/F#', 'C/G', 'G/B'];

interface ChordSettingsProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const ChordSettings: React.FC<ChordSettingsProps> = ({ value, onChange }) => {
  const intl = useIntl();
  const selectedValues = value || [];

  const groups = useMemo(
    () => [
      {
        label: intl.formatMessage({ id: 'chord.group.major' }),
        value: 'Major',
        chords: MAJOR_CHORDS,
      },
      {
        label: intl.formatMessage({ id: 'chord.group.minor' }),
        value: 'Minor',
        chords: MINOR_CHORDS,
      },
      {
        label: intl.formatMessage({ id: 'chord.group.dom7' }),
        value: 'Dom7',
        chords: DOM7_CHORDS,
      },
      {
        label: intl.formatMessage({ id: 'chord.group.m7' }),
        value: 'm7',
        chords: M7_CHORDS,
      },
      {
        label: intl.formatMessage({ id: 'chord.group.maj7' }),
        value: 'maj7',
        chords: MAJ7_CHORDS,
      },
      {
        label: intl.formatMessage({ id: 'chord.group.sus' }),
        value: 'sus',
        chords: SUS_CHORDS,
      },
      {
        label: intl.formatMessage({ id: 'chord.group.slash' }),
        value: 'slash',
        chords: SLASH_CHORDS,
      },
      {
        label: intl.formatMessage({ id: 'chord.group.power' }),
        value: 'power',
        chords: POWER_CHORDS,
      },
    ],
    [intl],
  );

  const [activeGroups, setActiveGroups] = useState<string[]>([
    'Major',
    'Minor',
    'Dom7',
    'm7',
  ]);

  const handleToggle = (chord: string) => {
    const newValues = selectedValues.includes(chord)
      ? selectedValues.filter((v) => v !== chord)
      : [...selectedValues, chord];
    onChange?.(newValues);
  };

  const handleSelectAll = (scale: string[]) => {
    // If all in scale are selected, deselect them. Otherwise select all.
    const allSelected = scale.every((c) => selectedValues.includes(c));
    let newValues = [...selectedValues];
    if (allSelected) {
      newValues = newValues.filter((v) => !scale.includes(v));
    } else {
      // Add missing ones
      scale.forEach((c) => {
        if (!newValues.includes(c)) {
          newValues.push(c);
        }
      });
    }
    onChange?.(newValues);
  };

  const renderGroup = (title: string, chords: string[]) => {
    const allSelected = chords.every((c) => selectedValues.includes(c));
    return (
      <div className="mb-6 rounded-md border border-gray-100 p-3 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-base text-gray-700">{title}</span>
          <Button size="small" onClick={() => handleSelectAll(chords)}>
            {allSelected
              ? intl.formatMessage({ id: 'common.deselect-all' })
              : intl.formatMessage({ id: 'common.select-all' })}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-start">
          {chords.map((chordName) => {
            const isSelected = selectedValues.includes(chordName);
            return (
              <div
                key={chordName}
                className={`
                  cursor-pointer rounded-lg border-2 p-1 sm:p-2 bg-white transition-all
                  flex flex-col items-center
                  ${
                    isSelected
                      ? 'border-blue-500 shadow-md'
                      : 'border-transparent hover:border-gray-200'
                  }
                `}
                onClick={() => handleToggle(chordName)}
              >
                <ChordDiagram
                  width={50}
                  height={70}
                  name={chordName}
                  fingering={CHORD_FINGERINGS[chordName]}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-white border border-gray-200 rounded-lg">
        <Checkbox.Group
          options={groups.map((g) => ({ label: g.label, value: g.value }))}
          value={activeGroups}
          onChange={(v) => {
            const newActiveGroups = v as string[];
            // Find groups that were removed
            const removedGroups = activeGroups.filter(
              (g) => !newActiveGroups.includes(g),
            );

            if (removedGroups.length > 0) {
              const chordsToRemove = removedGroups.flatMap((gVal) => {
                const group = groups.find((g) => g.value === gVal);
                return group ? group.chords : [];
              });

              const newSelectedValues = selectedValues.filter(
                (c) => !chordsToRemove.includes(c),
              );
              onChange?.(newSelectedValues);
            }

            setActiveGroups(newActiveGroups);
          }}
          className="flex flex-wrap gap-y-2"
        />
      </div>

      {groups
        .filter((g) => activeGroups.includes(g.value))
        .map((g) => (
          <div key={g.value}>{renderGroup(g.label, g.chords)}</div>
        ))}
    </div>
  );
};


export default ChordSettings;
