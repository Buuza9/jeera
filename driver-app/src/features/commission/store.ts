import { create } from 'zustand';

import { OUTSTANDING_SEED, SETTLEMENT_CAP } from './data';

type Status = 'active' | 'suspended';

type CommissionState = {
  /** Outstanding commission owed to the platform (LYD). */
  outstanding: number;
  /** Auto-suspend cap (§5 placeholder). */
  cap: number;
  status: Status;
  /** Reference number of the most recent settlement (shown on the success overlay). */
  lastRef: string | null;
  /** Record a settlement of `amount`; clamps to the outstanding balance. */
  settle: (amount: number) => string;
  /** Accrue commission from a completed trip (real impl is called on trip finish). */
  accrue: (amount: number) => void;
};

// Pseudo settlement reference — JRA- + 5 digits. Real impl gets it from the API.
let refSeq = 48213;
const nextRef = () => `JRA-${refSeq++}`;

/**
 * In-memory commission ledger: outstanding balance + settle/accrue. Not
 * persisted (matches the ride/dashboard stores); a real build hydrates this
 * from the platform commission API.
 */
export const useCommissionStore = create<CommissionState>((set, get) => ({
  outstanding: OUTSTANDING_SEED,
  cap: SETTLEMENT_CAP,
  status: OUTSTANDING_SEED > SETTLEMENT_CAP ? 'suspended' : 'active',
  lastRef: null,
  settle: (amount) => {
    const ref = nextRef();
    set((s) => {
      const paid = Math.min(Math.max(amount, 0), s.outstanding);
      const outstanding = +(s.outstanding - paid).toFixed(2);
      return { outstanding, lastRef: ref, status: outstanding > s.cap ? 'suspended' : 'active' };
    });
    return ref;
  },
  accrue: (amount) =>
    set((s) => {
      const outstanding = +(s.outstanding + amount).toFixed(2);
      return { outstanding, status: outstanding > s.cap ? 'suspended' : 'active' };
    }),
}));
