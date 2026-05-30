// Shared Tripoli coordinates — mirrors the prototype's JeeraMap.TRIPOLI.
// Used by dashboard, ride-requests, active-trip, trip-history maps.

export const TRIPOLI = {
  center: { latitude: 32.8872, longitude: 13.1913 },
  andalus: { latitude: 32.8525, longitude: 13.1668 }, // Hai al-Andalus
  gargaresh: { latitude: 32.8447, longitude: 13.1156 },
  souqJuma: { latitude: 32.8987, longitude: 13.2295 },
  oldCity: { latitude: 32.8975, longitude: 13.1797 },
} as const;

/** Default map region (deltas ≈ city-level zoom). */
export const TRIPOLI_REGION = {
  ...TRIPOLI.center,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

type Pt = { latitude: number; longitude: number };

/** Great-circle distance between two points, in kilometres. */
export function haversineKm(a: Pt, b: Pt): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** A region that frames all given points with comfortable padding. */
export function regionForPoints(points: Pt[]) {
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.6, 0.02),
    longitudeDelta: Math.max((maxLng - minLng) * 1.6, 0.02),
  };
}
