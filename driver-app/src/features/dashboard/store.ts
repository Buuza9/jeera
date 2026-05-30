import { create } from 'zustand';

type DashboardState = {
  online: boolean;
  setOnline: (online: boolean) => void;
};

/**
 * Online/offline toggle. Deliberately NOT persisted — a driver always starts
 * **offline** on app launch / login and must explicitly go online. (Persisting
 * it would leave the platform thinking a closed app is still available.)
 */
export const useDashboardStore = create<DashboardState>((set) => ({
  online: false,
  setOnline: (online) => set({ online }),
}));
