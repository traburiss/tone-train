import ChordDiagram from '@/components/ChordDiagram';
import { useInstrumentStatus } from '@/hooks/useInstrumentStatus';
import { CHORD_FINGERINGS, getChordNotes } from '@/utils/musicTheory';
import { loadInstrument } from '@/utils/toneInstruments';
import { SoundOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, Modal, Progress, message } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Tone from 'tone';
import { IdentificationSettings } from './Practice';
import { addIdentificationStat } from './statsStore';

interface IdentificationGameProps {
  open: boolean;
  settings: IdentificationSettings;
  onCancel: () => void;
}

let tonePlayer: Tone.Sampler | Tone.PolySynth | null = null;

const IdentificationGame: React.FC<IdentificationGameProps> = ({
  open,
  settings,
  onCancel,
}) => {
  const [currentTone, setCurrentTone] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [isCorrect, setIsCorrect] = useState(false);
  const intl = useIntl();

  const startTimeRef = useRef<number>(0);
  const questionStartTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStatsRef = useRef<{ timeTaken: number; correct: boolean }[]>([]);

  const flattenTones = useMemo(() => {
    const { toneListGroup, toneType } = settings;
    if (toneType === 'GuitarChords') {
      return toneListGroup['chords'] || [];
    }
    return Object.entries(toneListGroup)
      .filter(([key]) => !isNaN(Number(key)))
      .map(([, values]) => values)
      .flat()
      .filter(Boolean);
  }, [settings]);

  const playSound = async (tone: string) => {
    if (!tonePlayer) return;
    setIsPlaying(true);

    const duration = (settings.toneDuration || 1000) / 1000; // convert to seconds
    if (settings.toneType === 'GuitarChords') {
      const notes = getChordNotes(tone);
      if (notes.length > 0) {
        (tonePlayer as any).triggerAttackRelease(notes, duration);
      } else {
        tonePlayer.triggerAttackRelease(tone, duration);
      }
    } else {
      tonePlayer.triggerAttackRelease(tone, duration);
    }

    setTimeout(() => setIsPlaying(false), duration * 1000);
  };

  const nextQuestion = () => {
    if (flattenTones.length === 0) {
      message.error(intl.formatMessage({ id: 'game.error.no-tones' }));
      onCancel();
      return;
    }

    // Pick a random tone
    const target =
      flattenTones[Math.floor(Math.random() * flattenTones.length)];
    setCurrentTone(target);
    setWrongOptions([]);
    setIsCorrect(false);

    // Generate options
    const candidates = [target];
    const others = flattenTones.filter((t) => t !== target);

    // Mix in random candidates from the rest of the list
    const needed = settings.difficulty - 1;
    const shuffledOthers = others.sort(() => 0.5 - Math.random());
    candidates.push(...shuffledOthers.slice(0, needed));

    // Final shuffle
    setOptions(candidates.sort(() => 0.5 - Math.random()));

    // Play the sound
    playSound(target);
    questionStartTimeRef.current = Date.now();
  };

  const initPlayer = async () => {
    setIsPreparing(true);
    try {
      const sampler = await loadInstrument(settings.instrumentName);
      tonePlayer = sampler;
    } catch (e) {
      console.error('Failed to load instrument, falling back to PolySynth', e);
      tonePlayer = new Tone.PolySynth(Tone.Synth).toDestination();
    }
    setIsPreparing(false);
    nextQuestion();
  };

  const handleSelect = (selected: string) => {
    if (selected === currentTone) {
      // Correct!
      const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000;
      sessionStatsRef.current.push({
        timeTaken,
        correct: wrongOptions.length === 0,
      });

      setScore((s) => s + 1);
      setCorrectCount((c) => c + 1);
      setTotalAttempts((a) => a + 1);

      const isFirstTry = wrongOptions.length === 0;
      if (isFirstTry) {
        setConsecutiveCorrect((c) => {
          const newCount = c + 1;
          if (newCount % 3 === 0 && settings.mode === 'timed') {
            setTimeLeft((t) => t + 5); // Reward 5 seconds
            message.success(
              intl.formatMessage(
                { id: 'game.success.combo' },
                { count: newCount, bonus: 5 },
              ),
            );
          }
          return newCount;
        });
      } else {
        setConsecutiveCorrect(0);
      }

      setIsCorrect(true);
      setTimeout(nextQuestion, settings.toneWait || 1000);
    } else {
      // Wrong
      if (!wrongOptions.includes(selected)) {
        setWrongOptions((prev) => [...prev, selected]);
        setTotalAttempts((a) => a + 1);
        setConsecutiveCorrect(0);
      }
    }
  };

  const saveStats = () => {
    if (sessionStatsRef.current.length === 0) return null;

    const duration = (Date.now() - startTimeRef.current) / 1000;
    const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0;
    const avgResponseTime =
      sessionStatsRef.current.reduce((acc, curr) => acc + curr.timeTaken, 0) /
      sessionStatsRef.current.length;

    const stat = {
      timestamp: Date.now(),
      difficulty: settings.difficulty,
      mode: settings.mode,
      correctCount,
      totalQuestions: sessionStatsRef.current.length,
      accuracy,
      avgResponseTime,
      duration,
    };

    addIdentificationStat(stat);
    return { accuracy, avgResponseTime };
  };

  const handleGameOver = () => {
    const stats = saveStats();
    if (!stats) {
      onCancel();
      return;
    }

    Modal.info({
      title: intl.formatMessage({ id: 'game.over.title' }),
      content: (
        <div>
          <p>
            {intl.formatMessage(
              { id: 'game.over.correct-count' },
              { count: correctCount },
            )}
          </p>
          <p>
            {intl.formatMessage(
              { id: 'game.over.accuracy' },
              { accuracy: (stats.accuracy * 100).toFixed(1) },
            )}
          </p>
          <p>
            {intl.formatMessage(
              { id: 'game.over.avg-time' },
              { time: stats.avgResponseTime.toFixed(2) },
            )}
          </p>
        </div>
      ),
      onOk: onCancel,
    });
  };

  const handleCancel = () => {
    if (sessionStatsRef.current.length > 0) {
      saveStats();
      message.info(intl.formatMessage({ id: 'game.cancel.info' }));
    }
    onCancel();
  };

  // Lifecycle
  useEffect(() => {
    if (open) {
      initPlayer();
      startTimeRef.current = Date.now();

      if (settings.mode === 'timed') {
        setTimeLeft(settings.timeLimit);
        timerRef.current = setInterval(() => {
          setTimeLeft((t) => {
            if (t <= 1) {
              if (timerRef.current) clearInterval(timerRef.current);
              handleGameOver();
              return 0;
            }
            return t - 1;
          });
        }, 1000);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [open]);

  const { status } = useInstrumentStatus(settings.instrumentName);

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
      title={
        <div className="flex justify-between items-center pr-8">
          <span>
            {intl.formatMessage({ id: 'game.title.prefix' })}
            {settings.mode === 'timed'
              ? intl.formatMessage({ id: 'tone-identification.mode.timed' })
              : intl.formatMessage({
                  id: 'tone-identification.mode.infinite',
                })}
          </span>
          {settings.mode === 'timed' && (
            <div className="flex items-center gap-2">
              <span className={timeLeft < 10 ? 'text-red-500 font-bold' : ''}>
                {intl.formatMessage({ id: 'game.time-left' }, { time: timeLeft })}
              </span>
              <Progress
                type="circle"
                percent={(timeLeft / settings.timeLimit) * 100}
                size={{ width: 30 }}
                showInfo={false}
                strokeColor={timeLeft < 10 ? '#ff4d4f' : '#1890ff'}
              />
            </div>
          )}
        </div>
      }
      maskClosable={false}
      destroyOnHidden
    >
      <div className="py-4 text-center">
        <div className="mb-8">
          <Button
            type="primary"
            shape="round"
            icon={<SoundOutlined />}
            size="large"
            onClick={() => currentTone && playSound(currentTone)}
            loading={isPlaying || isPreparing}
          >
            {intl.formatMessage({ id: 'game.replay-sound' })}
          </Button>
          <div className="mt-2 text-gray-400 text-xs">
            {isPreparing
              ? intl.formatMessage({ id: 'game.preparing-instrument' })
              : status === 'loaded'
                ? intl.formatMessage({ id: 'game.instrument-ready' })
                : intl.formatMessage({ id: 'game.instrument-loading-midi' })}
          </div>
        </div>

        <div
          className="grid gap-2 mb-6"
          style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
        >
          {options.map((opt) => {
            const isAnsweredCorrectly = isCorrect && opt === currentTone;
            const isAnsweredWrong = wrongOptions.includes(opt);
            const isOtherAfterCorrect = isCorrect && opt !== currentTone;
            const isChord = settings.toneType === 'GuitarChords';

            return (
              <div
                key={opt}
                className={`
                  flex flex-col items-center justify-center p-0.5 border rounded transition-all select-none overflow-hidden
                  ${
                    isAnsweredCorrectly
                      ? 'bg-green-50 border-green-500 shadow-md scale-105 z-10'
                      : isAnsweredWrong
                        ? 'bg-red-50 border-red-200 opacity-60 cursor-not-allowed'
                        : isOtherAfterCorrect
                          ? 'bg-gray-50 border-gray-100 opacity-30 cursor-not-allowed'
                          : 'bg-white border-blue-50 shadow-sm hover:border-blue-300 active:scale-95 cursor-pointer'
                  }
                `}
                onClick={() =>
                  !isAnsweredWrong && !isCorrect && handleSelect(opt)
                }
              >
                <div
                  className={`font-bold truncate w-full text-center leading-tight ${
                    isAnsweredCorrectly
                      ? 'text-green-600 text-sm'
                      : isAnsweredWrong
                        ? 'text-red-500'
                        : isChord
                          ? 'text-[10px] text-gray-400'
                          : 'text-sm text-gray-700'
                  }`}
                >
                  {opt}
                </div>
                {CHORD_FINGERINGS[opt] && (
                  <div className="flex items-center justify-center w-full">
                    <ChordDiagram
                      name={opt}
                      fingering={CHORD_FINGERINGS[opt]}
                      width={60}
                      height={80}
                      showName={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-gray-500 border-t pt-4">
          <span>
            {intl.formatMessage(
              { id: 'game.correct-count-title' },
              { count: correctCount },
            )}
          </span>
          <span>
            {intl.formatMessage(
              { id: 'game.combo-bonus' },
              { count: consecutiveCorrect },
            )}
          </span>
          <span>
            {intl.formatMessage(
              { id: 'game.accuracy-title' },
              {
                accuracy:
                  totalAttempts > 0
                    ? ((correctCount / totalAttempts) * 100).toFixed(0)
                    : 0,
              },
            )}
          </span>
        </div>
      </div>
    </Modal>
  );
};


export default IdentificationGame;
