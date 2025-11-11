import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async setItem(key: string, value: any) {
    try {
      const jsonValue =
        typeof value === "string" ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.warn("Storage set error:", e);
    }
  },

  async getItem<T = any>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn("Storage get error:", e);
      return null;
    }
  },

  async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn("Storage remove error:", e);
    }
  },
};
export const mmkvStorage = storage;