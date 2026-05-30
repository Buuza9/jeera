import { type RefObject } from 'react';
import { Pressable } from 'react-native';
import type MapView from 'react-native-maps';

import { Icon, type LatLng } from '@/shared/components';

/**
 * Floating control that recenters the map on the driver's location and zooms in.
 * Sits above the bottom sheet on the trailing edge.
 */
export function RecenterButton({
  mapRef,
  location,
}: {
  mapRef: RefObject<MapView | null>;
  location: LatLng;
}) {
  const recenter = () =>
    mapRef.current?.animateCamera({ center: location, zoom: 16 }, { duration: 400 });

  return (
    <Pressable
      onPress={recenter}
      accessibilityLabel="Recenter on my location"
      className="absolute end-4 top-36 h-12 w-12 items-center justify-center rounded-full border border-border bg-surface shadow-md dark:border-dark-border dark:bg-dark-surface"
    >
      <Icon name="navigation" size={20} color="#2a673a" />
    </Pressable>
  );
}
