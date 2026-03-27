// Reactive key-value storage using expo-sqlite localStorage polyfill
// Per skill guide: use this for simple settings/preferences, not large datasets
import 'expo-sqlite/localStorage/install';

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
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
