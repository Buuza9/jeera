import { create } from 'zustand';

import { type RideRequest } from './data';

type RideState = {
  /** The request currently being offered (drives the dashboard pickup pin + the sheet). */
  incoming: RideRequest | null;
  /** The accepted trip (set on accept, used by the active-trip screens). */
  active: RideRequest | null;
  offer: (req: RideRequest) => void;
  reject: () => void;
  accept: () => void;
  finish: () => void;
};

/** In-memory ride lifecycle: offer → accept (active) → finish. Not persisted. */
export const useRideStore = create<RideState>((set, get) => ({
  incoming: null,
  active: null,
  offer: (req) => set({ incoming: req }),
  reject: () => set({ incoming: null }),
  accept: () => set({ active: get().incoming, incoming: null }),
  finish: () => set({ active: null, incoming: null }),
}));
