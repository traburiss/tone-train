import { STATS_PREFIX, STORAGE_PREFIX } from '@/constants';

export interface SettingWrapper<T = any> {
  name: string;
  value: T;
  updatedAt: number;
}

export interface AppSettings {
  [key: string]: SettingWrapper;
}

/**
 * Get settings for a specific page/component
 */
export const getPageSettings = <T>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(`${STORAGE_PREFIX}${key}`);

  // Migration logic for old key if it exists and new key doesn't
  if (!saved && key === 'tones:training') {
    const oldSaved = localStorage.getItem('music-teaching-assistant-settings');
    if (oldSaved) {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, oldSaved);
      return JSON.parse(oldSaved) as T;
    }
  }

  if (!saved) return defaultValue;
  try {
    const parsed = JSON.parse(saved);
    // Check if it's the new wrapped format
    if (
      parsed &&
      typeof parsed === 'object' &&
      'name' in parsed &&
      'value' in parsed
    ) {
      return parsed.value as T;
    }
    // Backward compatibility for raw format
    return parsed as T;
  } catch (e) {
    console.error(`Failed to parse settings for ${key}`, e);
    return defaultValue;
  }
};

/**
 * Set settings for a specific page/component with an optional name
 */
export const setPageSettings = (key: string, value: any, name?: string) => {
  const existing = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  let finalName = name;

  if (!finalName && existing) {
    try {
      const parsed = JSON.parse(existing);
      if (parsed?.name) finalName = parsed.name;
    } catch (e) {
      // ignore
    }
  }

  const wrapper: SettingWrapper = {
    name: finalName || key,
    value,
    updatedAt: Date.now(),
  };
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(wrapper));
};

/**
 * Get statistics for a specific function
 */
export const getStats = <T>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(`${STATS_PREFIX}${key}`);
  if (!saved) return defaultValue;
  try {
    const parsed = JSON.parse(saved);
    if (
      parsed &&
      typeof parsed === 'object' &&
      'name' in parsed &&
      'value' in parsed
    ) {
      return parsed.value as T;
    }
    return parsed as T;
  } catch (e) {
    console.error(`Failed to parse stats for ${key}`, e);
    return defaultValue;
  }
};

/**
 * Set statistics for a specific function
 */
export const setStats = (key: string, value: any, name?: string) => {
  const existing = localStorage.getItem(`${STATS_PREFIX}${key}`);
  let finalName = name;

  if (!finalName && existing) {
    try {
      const parsed = JSON.parse(existing);
      if (parsed?.name) finalName = parsed.name;
    } catch (e) {
      // ignore
    }
  }

  const wrapper: SettingWrapper = {
    name: finalName || key,
    value,
    updatedAt: Date.now(),
  };
  localStorage.setItem(`${STATS_PREFIX}${key}`, JSON.stringify(wrapper));
};

/**
 * Get all application settings managed by this utility
 */
export const getAllSettings = (): AppSettings => {
  const settings: AppSettings = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          settings[key.replace(STORAGE_PREFIX, '')] = JSON.parse(value);
        } catch (e) {
          console.error(`Failed to parse all settings for key ${key}`, e);
        }
      }
    }
  }
  return settings;
};

/**
 * Get all statistics managed by this utility
 */
export const getAllStats = (): AppSettings => {
  const stats: AppSettings = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STATS_PREFIX)) {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          stats[key.replace(STATS_PREFIX, '')] = JSON.parse(value);
        } catch (e) {
          console.error(`Failed to parse all stats for key ${key}`, e);
        }
      }
    }
  }
  return stats;
};

/**
 * Replace all settings with a new set.
 * Supports both raw value objects and wrapped SettingWrapper objects.
 */
/**
 * Replace all settings and stats with a new set.
 * Supports combined format { settings: Record<string, any>, stats: Record<string, any> }
 * or raw format for backward compatibility.
 */
export const importAllSettings = (data: any) => {
  if (data && typeof data === 'object') {
    // Check for combined format
    if (data.settings || data.stats) {
      if (data.settings) {
        Object.entries(data.settings).forEach(([key, val]) => {
          if (
            val &&
            typeof val === 'object' &&
            'name' in val &&
            'value' in val
          ) {
            localStorage.setItem(
              `${STORAGE_PREFIX}${key}`,
              JSON.stringify(val),
            );
          } else {
            setPageSettings(key, val, key);
          }
        });
      }
      if (data.stats) {
        Object.entries(data.stats).forEach(([key, val]) => {
          if (
            val &&
            typeof val === 'object' &&
            'name' in val &&
            'value' in val
          ) {
            localStorage.setItem(`${STATS_PREFIX}${key}`, JSON.stringify(val));
          } else {
            setStats(key, val, key);
          }
        });
      }
      return;
    }

    // Fallback to old flat format (assumed to be settings)
    Object.entries(data).forEach(([key, val]) => {
      if (val && typeof val === 'object' && 'name' in val && 'value' in val) {
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(val));
      } else {
        setPageSettings(key, val, key);
      }
    });
  }
};

/**
 * Clear all application related settings
 */
export const clearAllSettings = () => {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
};

export const clearPageSettings = (key: string) => {
  localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
};

/**
 * Clear all statistics related data
 */
export const clearAllStats = () => {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STATS_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
};

export const clearPageStats = (key: string) => {
  localStorage.removeItem(`${STATS_PREFIX}${key}`);
};
