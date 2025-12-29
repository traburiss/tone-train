import { TONES_IDENTIFICATION_STORAGE_KEY } from '@/constants';
import { getStats, setStats } from '@/utils/storage';

export interface IdentificationStat {
  timestamp: number;
  difficulty: number;
  mode: string;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  avgResponseTime: number;
  duration: number;
}

export const getIdentificationStats = (): IdentificationStat[] => {
  return getStats<IdentificationStat[]>(TONES_IDENTIFICATION_STORAGE_KEY, []);
};

export const addIdentificationStat = (stat: IdentificationStat) => {
  const stats = getIdentificationStats();
  stats.push(stat);
  // Keep only the last 100 for storage sanity
  if (stats.length > 100) {
    stats.shift();
  }
  setStats(TONES_IDENTIFICATION_STORAGE_KEY, stats, '听音判断统计数据');
};

export const clearIdentificationStats = () => {
  setStats(TONES_IDENTIFICATION_STORAGE_KEY, [], '听音判断统计数据');
};
