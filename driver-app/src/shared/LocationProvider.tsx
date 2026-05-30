import { createContext, useContext, type ReactNode } from 'react';

import { useDeviceLocation, type LocationStatus } from './useDeviceLocation';
import { type LatLng } from './components/Map';

type LocationValue = {
  location: LatLng;
  hasFix: boolean;
  status: LocationStatus;
};

const LocationContext = createContext<LocationValue | null>(null);

/**
 * Fetches device location ONCE at the app root and shares it. Screens read it
 * via {@link useLocation} instead of each calling useDeviceLocation — which
 * would re-request permission + re-fetch GPS on every mount, making navigation
 * between trip screens feel like a reload (the pin jumps from the fallback).
 */
export function LocationProvider({ children }: { children: ReactNode }) {
  const value = useDeviceLocation();
  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside LocationProvider');
  return ctx;
}
