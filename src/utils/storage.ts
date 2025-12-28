export interface SettingWrapper<T = any> {
  name: string;
  value: T;
  updatedAt: number;
}

export interface AppSettings {
  [key: string]: SettingWrapper;
}

const STORAGE_PREFIX = 'mta:cfg';

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
 * Replace all settings with a new set.
 * Supports both raw value objects and wrapped SettingWrapper objects.
 */
export const importAllSettings = (settings: Record<string, any>) => {
  Object.entries(settings).forEach(([key, data]) => {
    // If it's already a wrapper, use it. Otherwise wrap it.
    if (data && typeof data === 'object' && 'name' in data && 'value' in data) {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
    } else {
      setPageSettings(key, data, key);
    }
  });
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
