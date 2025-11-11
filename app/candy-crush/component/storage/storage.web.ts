// storage.web.ts
// This file will be used on web and SSR bundles.
// If running on server (no window.localStorage) we gracefully fallback to in-memory.

type Value = string | number | boolean | object | null;

// simple in-memory fallback for SSR / Node
const memoryStore: Record<string, string> = {};

const hasLocalStorage = typeof window !== "undefined" && !!window.localStorage;

const webStorage = {
  setItem: (key: string, value: Value) => {
    const s = value === null ? "" : typeof value === "string" ? value : JSON.stringify(value);
    if (hasLocalStorage) {
      window.localStorage.setItem(key, s);
    } else {
      memoryStore[key] = s;
    }
  },

  getItem: (key: string): string | null => {
    if (hasLocalStorage) {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? raw : null;
    } else {
      return memoryStore[key] ?? null;
    }
  },

  removeItem: (key: string) => {
    if (hasLocalStorage) {
      window.localStorage.removeItem(key);
    } else {
      delete memoryStore[key];
    }
  },
};

export const mmkvStorage = webStorage;
