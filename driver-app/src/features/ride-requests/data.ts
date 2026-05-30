import { TRIPOLI } from '@/shared/geo';
import { type LatLng } from '@/shared/components';

export type RideRequest = {
  pickup: { coord: LatLng; address: string; distanceKm: number };
  dropoff: { coord: LatLng; address: string };
  tripDistanceKm: number;
  fare: number; // LYD
  riderRating: number;
  /** Auto-decline window in seconds (client-blocked §5 — placeholder). */
  autoDeclineSeconds: number;
};

/** Mock incoming request — Hai al-Andalus → Gargaresh, matching the prototype. */
export const MOCK_REQUEST: RideRequest = {
  pickup: { coord: TRIPOLI.andalus, address: 'req.pickupAddr', distanceKm: 1.5 },
  dropoff: { coord: TRIPOLI.gargaresh, address: 'req.destAddr' },
  tripDistanceKm: 8.5,
  fare: 25,
  riderRating: 4.8,
  autoDeclineSeconds: 15,
};
