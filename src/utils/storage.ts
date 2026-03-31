// In-memory storage mock for Native CLI (Persistence should be added via AsyncStorage or MMKV)
const memoryStorage: Record<string, string> = {};

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const value = memoryStorage[key];
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    memoryStorage[key] = JSON.stringify(value);
    listeners.get(key)?.forEach((fn) => fn());
  },

  remove(key: string): void {
    localStorage.removeItem(key);
    listeners.get(key)?.forEach((fn) => fn());
  },

  subscribe(key: string, listener: Listener): () => void {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);
    return () => listeners.get(key)?.delete(listener);
  },
};

// Storage keys used across the app
export const STORAGE_KEYS = {
  SETTINGS: 'wealthflow_settings',
  ONBOARDING_COMPLETE: 'wealthflow_onboarding',
  DB_INITIALIZED: 'wealthflow_db_init',
} as const;
