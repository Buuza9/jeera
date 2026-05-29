import AsyncStorage from '@react-native-async-storage/async-storage';
import { type StateStorage } from 'zustand/middleware';

/**
 * Zustand `persist` adapter backed by AsyncStorage. Use for non-sensitive
 * state (drafts, settings, cached lists). For tokens/PIN use {@link secureStorage}.
 */
export const asyncStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name),
};
