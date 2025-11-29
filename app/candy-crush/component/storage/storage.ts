// storage.ts
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// -------- Web / SSR fallback store ----------
const memoryStore: Record<string, string> = {};
const hasLocalStorage =
  typeof window !== "undefined" && !!window.localStorage;

const webStorage = {
  async setItem(key: string, value: any) {
    try {
      const str =
        value === null ? "" : typeof value === "string" ? value : JSON.stringify(value);

      if (hasLocalStorage) {
        window.localStorage.setItem(key, str);
      } else {
        memoryStore[key] = str;
      }
    } catch (e) {
      console.warn("webStorage set error:", e);
    }
  },

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const raw = hasLocalStorage
        ? window.localStorage.getItem(key)
        : memoryStore[key];

      if (raw === undefined || raw === null) return null;

      try {
        return JSON.parse(raw);
      } catch {
        return raw as T;
      }
    } catch (e) {
      console.warn("webStorage get error:", e);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      if (hasLocalStorage) {
        window.localStorage.removeItem(key);
      } else {
        delete memoryStore[key];
      }
    } catch (e) {
      console.warn("webStorage remove error:", e);
    }
  },
};

// -------- Mobile Storage (Android / iOS) ----------
const nativeStorage = {
  async setItem(key: string, value: any) {
    try {
      const jsonValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.warn("AsyncStorage set error:", e);
    }
  },

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;

      try {
        return JSON.parse(raw);
      } catch {
        return raw as T;
      }
    } catch (e) {
      console.warn("AsyncStorage get error:", e);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn("AsyncStorage remove error:", e);
    }
  },
};

// -------- Auto-switching storage wrapper ----------
const storage = Platform.OS === "web" ? webStorage : nativeStorage;

export default storage;
