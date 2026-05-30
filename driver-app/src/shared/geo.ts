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
