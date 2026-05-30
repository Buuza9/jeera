import { TRIPOLI } from '@/shared/geo';

// Mock active trip — seeded from the accepted ride request (Andalus → Gargaresh).
// Real version: hydrated from the trips row created on accept.
export const TRIP = {
  rider: 'trip.rider',
  pickup: { coord: TRIPOLI.andalus, address: 'req.pickupAddr', toRiderMeters: 800, etaMin: 5 },
  dropoff: { coord: TRIPOLI.gargaresh, address: 'req.destAddr', remainingKm: 5.2, etaMin: 13 },
  fare: 25, // LYD
  distanceKm: 8.5,
  durationMin: 18,
  commissionRate: 0.15, // §2.10 placeholder — client-blocked
};

export const commissionAmount = (fare: number, rate: number) => +(fare * rate).toFixed(2);
