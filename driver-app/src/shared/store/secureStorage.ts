import * as SecureStore from 'expo-secure-store';
import { type StateStorage } from 'zustand/middleware';

/**
 * Zustand `persist` storage adapter backed by expo-secure-store.
 * Use for sensitive state (auth tokens, driverId, PIN hash). For non-sensitive
 * prefs (theme, language) use AsyncStorage instead.
 *
 * SecureStore keys must be alphanumeric + ".-_"; persist passes the store name
 * as the key, so keep store names simple (e.g. "djera.auth").
 */
export const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};
