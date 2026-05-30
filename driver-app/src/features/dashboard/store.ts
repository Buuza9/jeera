import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { asyncStorage } from '@/shared/store/asyncStorage';

type DashboardState = {
  online: boolean;
  setOnline: (online: boolean) => void;
};

/** Online/offline toggle state, persisted so it survives app restarts. */
export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      online: false,
      setOnline: (online) => set({ online }),
    }),
    {
      name: 'djera.dashboard',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
