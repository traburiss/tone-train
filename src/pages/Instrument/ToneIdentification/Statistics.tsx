import { Button, Card, Empty, Select, Space, Statistic, Table } from 'antd';
import React, { useMemo, useState } from 'react';
import { clearIdentificationStats, getIdentificationStats } from './statsStore';

const HistoryChart: React.FC<{
  data: number[];
  label: string;
  color: string;
  suffix?: string;
}> = ({ data, label, color = '' }) => {
  if (data.length === 0) return <Empty description="暂无数据" />;

  const width = 600;
  const height = 200;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const max = Math.max(...data, 1);
  const min = 0;
  const range = max - min;

  const points = data
    .map((val, i) => {
      const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight - ((val - min) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full overflow-x-auto">
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
        {/* Points */}
        {data.map((val, i) => {
          const x = padding + (i / (data.length - 1 || 1)) * chartWidth;
          const y = padding + chartHeight - ((val - min) / range) * chartHeight;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              onMouseEnter={() => {}} // Could add tooltip
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-5">
        <span>较早</span>
        <span>最近</span>
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
      <Card title="统计配置" size="small">
        <Space wrap size={16}>
          <div>
            <span className="mr-2">历史长度:</span>
            <Select
              value={historyLength}
              onChange={setHistoryLength}
              style={{ width: 100 }}
              options={[
                { label: '最近10次', value: 10 },
                { label: '最近20次', value: 20 },
                { label: '最近50次', value: 50 },
                { label: '最近100次', value: 100 },
              ]}
            />
          </div>
          <div>
            <span className="mr-2">难度筛选:</span>
            <Select
              value={filterDifficulty}
              onChange={setFilterDifficulty}
              style={{ width: 120 }}
              options={[
                { label: '全部难度', value: 'all' },
                { label: '简单 (2)', value: 2 },
                { label: '中等 (4)', value: 4 },
                { label: '困难 (6)', value: 6 },
                { label: '地狱 (8)', value: 8 },
              ]}
            />
          </div>
          <div>
            <span className="mr-2">模式筛选:</span>
            <Select
              value={filterMode}
              onChange={setFilterMode}
              style={{ width: 120 }}
              options={[
                { label: '全部模式', value: 'all' },
                { label: '限时挑战', value: 'timed' },
                { label: '无限模式', value: 'infinite' },
              ]}
            />
          </div>
          <Button danger size="small" onClick={handleClear}>
            重置所有数据
          </Button>
        </Space>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card size="small">
          <Statistic
            title="平均准确率"
            value={avgAccuracy * 100}
            precision={1}
            suffix="%"
            valueStyle={{ color: '#3f8600' }}
          />
          <div className="mt-4">
            <HistoryChart
              data={filteredStats.map((s) => s.accuracy * 100)}
              label="准确率趋势 (%)"
              color="#3f8600"
            />
          </div>
        </Card>

        <Card size="small">
          <Statistic
            title="平均反应时间"
            value={avgTime}
            precision={2}
            suffix="s"
            valueStyle={{ color: '#1890ff' }}
          />
          <div className="mt-4">
            <HistoryChart
              data={filteredStats.map((s) => s.avgResponseTime)}
              label="反应时间趋势 (秒)"
              color="#1890ff"
            />
          </div>
        </Card>
      </div>

      <Card title="详细历史" size="small">
        <Table
          dataSource={filteredStats.map((s, i) => ({ ...s, key: i }))}
          columns={[
            {
              title: '时间',
              dataIndex: 'timestamp',
              render: (t) => new Date(t).toLocaleString(),
              responsive: ['md'],
            },
            {
              title: '难度',
              dataIndex: 'difficulty',
              render: (d) => `${d}选1`,
            },
            {
              title: '模式',
              dataIndex: 'mode',
              render: (m) => (m === 'timed' ? '限时' : '无限'),
            },
            { title: '得分', dataIndex: 'correctCount' },
            {
              title: '准确率',
              dataIndex: 'accuracy',
              render: (a) => `${(a * 100).toFixed(0)}%`,
            },
            {
              title: '耗时',
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
