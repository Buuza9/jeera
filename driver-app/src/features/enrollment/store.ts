import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { asyncStorage } from '@/shared/store/asyncStorage';

export type Application = {
  fullName: string;
  phone: string; // local part, e.g. "91 234 5678"
  nationalId: string;
  licenseNumber: string;
  plate: string;
  idPhoto: boolean; // mock: whether a doc was "uploaded"
  licensePhoto: boolean;
};

export type EnrollmentStatus = 'none' | 'pending' | 'approved' | 'suspended';

type EnrollmentState = {
  application: Application | null;
  status: EnrollmentStatus;
  hydrated: boolean;
  setSubmitted: (application: Application) => void;
  reset: () => void;
};

export const useEnrollmentStore = create<EnrollmentState>()(
  persist(
    (set) => ({
      application: null,
      status: 'none',
      hydrated: false,
      setSubmitted: (application) => set({ application, status: 'pending' }),
      reset: () => set({ application: null, status: 'none' }),
    }),
    {
      name: 'djera.enrollment',
      storage: createJSONStorage(() => asyncStorage),
      partialize: (s) => ({ application: s.application, status: s.status }),
      onRehydrateStorage: () => () => {
        useEnrollmentStore.setState({ hydrated: true });
      },
    },
  ),
);
