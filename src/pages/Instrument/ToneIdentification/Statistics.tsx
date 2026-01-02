import { useIntl } from '@umijs/max';
import { Button, Card, Empty, Select, Space, Statistic, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { clearIdentificationStats, getIdentificationStats } from './statsStore';

const HistoryChart: React.FC<{
  data: number[];
  label: string;
  color: string;
  suffix?: string;
}> = ({ data, label, color = '', suffix = '' }) => {
  const intl = useIntl();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  if (data.length === 0)
    return <Empty description={intl.formatMessage({ id: 'common.no-data' })} />;

  const height = 200;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Avoid division by zero if width is not yet determined
  if (width === 0) {
    return <div ref={containerRef} style={{ height }} className="w-full" />;
  }

  const max = Math.max(...data, 1);
  const min = 0;
  const range = max - min;

  const getX = (i: number) =>
    padding + (i / (data.length - 1 || 1)) * chartWidth;
  const getY = (val: number) =>
    padding + chartHeight - ((val - min) / range) * chartHeight;

  const points = data.map((val, i) => `${getX(i)},${getY(val)}`).join(' ');

  return (
    <div className="w-full relative" ref={containerRef}>
      <div className="font-semibold mb-2">{label}</div>
      <svg width={width} height={height} className="bg-gray-50 rounded">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={padding}
            y1={padding + chartHeight * p}
            x2={width - padding}
            y2={padding + chartHeight * p}
            stroke="#e5e7eb"
            strokeDasharray="4"
          />
        ))}
        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinejoin="round"
          points={points}
        />
        {/* Points - Rendered only for visual, interactions are on overlay */}
        {data.map((val, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(val)}
            r={hoveredIndex === i ? 6 : 4}
            fill={color}
            style={{ transition: 'r 0.2s' }}
          />
        ))}
        {/* Interaction Overlay using transparent rect columns */}
        {data.map((val, i) => {
          // Calculate the width of each "slice" for hover detection
          // We divide the total chart width by the number of points (roughly)
          // to create touch targets that touch each other.
          const stepWidth = chartWidth / (data.length - 1 || 1);
          // Logic to center the rect around the point:
          // If it's the first point, start at 0, width is half step + padding
          // If middle, start at x - half step, width is step
          // If last, start at x - half step, width is half step + padding

          // Simplified approach: equal slices
          // x start position of the slice
          let sliceX = getX(i) - stepWidth / 2;
          let sliceWidth = stepWidth;

          // Edge adjustments
          if (i === 0) {
            sliceX = 0;
            sliceWidth = padding + stepWidth / 2;
          } else if (i === data.length - 1) {
            sliceWidth = padding + stepWidth / 2;
          }

          // For single point case
          if (data.length === 1) {
            sliceX = 0;
            sliceWidth = width;
          }

          return (
            <rect
              key={`overlay-${i}`}
              x={sliceX}
              y={0}
              width={sliceWidth}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: 'crosshair' }}
            />
          );
        })}
      </svg>
      {/* Tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute bg-black/75 text-white text-xs px-2 py-1 rounded pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: getX(hoveredIndex),
            top: getY(data[hoveredIndex]) - 8,
          }}
        >
          {data[hoveredIndex].toFixed(2)}
          {suffix}
        </div>
      )}
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-5">
        <span>{intl.formatMessage({ id: 'common.earlier' })}</span>
        <span>{intl.formatMessage({ id: 'common.recent' })}</span>
      </div>
    </div>
  );
};

const Statistics: React.FC = () => {
  const [historyLength, setHistoryLength] = useState(20);
  const [filterDifficulty, setFilterDifficulty] = useState<number | 'all'>(
    'all',
  );
  const [filterMode, setFilterMode] = useState<string | 'all'>('all');
  const intl = useIntl();

  const allStats = useMemo(() => getIdentificationStats(), []);

  const filteredStats = useMemo(() => {
    let result = allStats;
    if (filterDifficulty !== 'all') {
      result = result.filter((s) => s.difficulty === filterDifficulty);
    }
    if (filterMode !== 'all') {
      result = result.filter((s) => s.mode === filterMode);
    }
    return result.slice(-historyLength);
  }, [allStats, historyLength, filterDifficulty, filterMode]);

  const avgAccuracy = useMemo(() => {
    if (filteredStats.length === 0) return 0;
    return (
      filteredStats.reduce((acc, curr) => acc + curr.accuracy, 0) /
      filteredStats.length
    );
  }, [filteredStats]);

  const avgTime = useMemo(() => {
    if (filteredStats.length === 0) return 0;
    return (
      filteredStats.reduce((acc, curr) => acc + curr.avgResponseTime, 0) /
      filteredStats.length
    );
  }, [filteredStats]);

  const handleClear = () => {
    clearIdentificationStats();
    window.location.reload(); // Simple way to refresh
  };

  return (
    <div className="flex flex-col gap-6">
      <Card title={intl.formatMessage({ id: 'stats.config' })} size="small">
        <Space wrap size={16}>
          <div>
            <span className="mr-2">
              {intl.formatMessage({ id: 'stats.history-length' })}:
            </span>
            <Select
              value={historyLength}
              onChange={setHistoryLength}
              style={{ width: 140 }}
              options={[10, 20, 50, 100].map((n) => ({
                label: intl.formatMessage(
                  { id: 'stats.history-length.n' },
                  { n },
                ),
                value: n,
              }))}
            />
          </div>
          <div>
            <span className="mr-2">
              {intl.formatMessage({ id: 'stats.difficulty-filter' })}:
            </span>
            <Select
              value={filterDifficulty}
              onChange={setFilterDifficulty}
              style={{ width: 140 }}
              options={[
                {
                  label: intl.formatMessage({
                    id: 'stats.difficulty-all',
                  }),
                  value: 'all',
                },
                {
                  label: intl.formatMessage(
                    { id: 'option.difficulty.n-choice-1' },
                    { n: 2 },
                  ),
                  value: 2,
                },
                {
                  label: intl.formatMessage(
                    { id: 'option.difficulty.n-choice-1' },
                    { n: 4 },
                  ),
                  value: 4,
                },
                {
                  label: intl.formatMessage(
                    { id: 'option.difficulty.n-choice-1' },
                    { n: 6 },
                  ),
                  value: 6,
                },
                {
                  label: intl.formatMessage(
                    { id: 'option.difficulty.n-choice-1' },
                    { n: 8 },
                  ),
                  value: 8,
                },
              ]}
            />
          </div>
          <div>
            <span className="mr-2">
              {intl.formatMessage({ id: 'stats.mode-filter' })}:
            </span>
            <Select
              value={filterMode}
              onChange={setFilterMode}
              style={{ width: 140 }}
              options={[
                {
                  label: intl.formatMessage({ id: 'stats.mode-all' }),
                  value: 'all',
                },
                {
                  label: intl.formatMessage({
                    id: 'tone-identification.mode.timed',
                  }),
                  value: 'timed',
                },
                {
                  label: intl.formatMessage({
                    id: 'tone-identification.mode.infinite',
                  }),
                  value: 'infinite',
                },
              ]}
            />
          </div>
          <Button danger size="small" onClick={handleClear}>
            {intl.formatMessage({ id: 'stats.reset-data' })}
          </Button>
        </Space>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card size="small">
          <Statistic
            title={intl.formatMessage({ id: 'stats.avg-accuracy' })}
            value={avgAccuracy * 100}
            precision={1}
            suffix="%"
            valueStyle={{ color: '#3f8600' }}
          />
          <div className="mt-4">
            <HistoryChart
              data={filteredStats.map((s) => s.accuracy * 100)}
              label={intl.formatMessage({ id: 'stats.accuracy-trend' })}
              color="#3f8600"
            />
          </div>
        </Card>

        <Card size="small">
          <Statistic
            title={intl.formatMessage({ id: 'stats.avg-response-time' })}
            value={avgTime}
            precision={2}
            suffix="s"
            valueStyle={{ color: '#1890ff' }}
          />
          <div className="mt-4">
            <HistoryChart
              data={filteredStats.map((s) => s.avgResponseTime)}
              label={intl.formatMessage({
                id: 'stats.response-time-trend',
              })}
              color="#1890ff"
            />
          </div>
        </Card>
      </div>

      <Card
        title={intl.formatMessage({ id: 'stats.detailed-history' })}
        size="small"
      >
        <Table
          dataSource={filteredStats.map((s, i) => ({ ...s, key: i }))}
          columns={[
            {
              title: intl.formatMessage({ id: 'table.column.time' }),
              dataIndex: 'timestamp',
              render: (t) => new Date(t).toLocaleString(),
              responsive: ['md'],
            },
            {
              title: intl.formatMessage({ id: 'table.column.difficulty' }),
              dataIndex: 'difficulty',
              render: (d) =>
                intl.formatMessage(
                  { id: 'option.difficulty.n-choice-1' },
                  { n: d },
                ),
            },
            {
              title: intl.formatMessage({ id: 'table.column.mode' }),
              dataIndex: 'mode',
              render: (m) =>
                m === 'timed'
                  ? intl.formatMessage({
                      id: 'option.mode.timed.short',
                    })
                  : intl.formatMessage({
                      id: 'option.mode.infinite.short',
                    }),
            },
            {
              title: intl.formatMessage({ id: 'table.column.score' }),
              dataIndex: 'correctCount',
            },
            {
              title: intl.formatMessage({ id: 'table.column.accuracy' }),
              dataIndex: 'accuracy',
              render: (a) => `${(a * 100).toFixed(0)}%`,
            },
            {
              title: intl.formatMessage({ id: 'table.column.duration' }),
              dataIndex: 'avgResponseTime',
              render: (r) => `${r.toFixed(2)}s`,
            },
          ]}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default Statistics;
