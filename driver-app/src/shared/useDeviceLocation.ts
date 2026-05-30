import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';

import { TRIPOLI } from './geo';
import { type LatLng } from './components/Map';

export type LocationStatus = 'pending' | 'granted' | 'denied';

type DeviceLocation = {
  /** Live position when granted; Tripoli fallback while pending/denied. */
  location: LatLng;
  /** True once we have a real GPS fix (not the fallback). */
  hasFix: boolean;
  status: LocationStatus;
};

/**
 * Foreground device location with permission handling + Tripoli fallback.
 * Requests permission on mount, grabs an initial fix, then watches for updates.
 * Mock-friendly: callers always get a usable `location` even before/without GPS.
 */
export function useDeviceLocation(): DeviceLocation {
  const [status, setStatus] = useState<LocationStatus>('pending');
  const [location, setLocation] = useState<LatLng>(TRIPOLI.center);
  const [hasFix, setHasFix] = useState(false);
  const subRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (perm !== 'granted') {
        setStatus('denied');
        return;
      }
      setStatus('granted');

      // Initial fix.
      try {
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setHasFix(true);
      } catch {
        // keep fallback
      }

      // Watch for movement.
      subRef.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 25, timeInterval: 5000 },
        (pos) => {
          setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setHasFix(true);
        },
      );
    })();

    return () => {
      cancelled = true;
      subRef.current?.remove();
    };
  }, []);

  return { location, hasFix, status };
}
