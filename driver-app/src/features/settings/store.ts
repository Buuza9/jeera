import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { asyncStorage } from '@/shared/store/asyncStorage';

// Notification + security toggle keys.
export type ToggleKey = 'nRequests' | 'nEarnings' | 'nPromos' | 'pinLock' | 'biometric';

type SettingsState = {
  toggles: Record<ToggleKey, boolean>;
  setToggle: (key: ToggleKey, value: boolean) => void;
};

/** Persisted notification/security preferences. Security toggles are §5
 *  client-blocked (no real PIN/biometric wiring yet) — they just store intent. */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      toggles: {
        nRequests: true,
        nEarnings: true,
        nPromos: false,
        pinLock: false,
        biometric: false,
      },
      setToggle: (key, value) => set((s) => ({ toggles: { ...s.toggles, [key]: value } })),
    }),
    {
      name: 'djera.settings',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
