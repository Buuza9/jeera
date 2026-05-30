import { forwardRef } from 'react';
import { View, type ViewStyle } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, type Region } from 'react-native-maps';

import { TRIPOLI_REGION } from '@/shared/geo';

import { Icon } from './Icon';

export type LatLng = { latitude: number; longitude: number };

type DjeraMapProps = {
  region?: Region;
  style?: ViewStyle;
  /** Driver position; renders a green GPS pin. Pulses when `online`. */
  driver?: LatLng;
  online?: boolean;
  /** Additional pins (rider pickup, destination, …). */
  markers?: { id: string; coord: LatLng; kind?: 'rider' | 'dest' }[];
  /** Route polyline (pickup → destination), drawn in brand green. */
  route?: LatLng[];
  scrollEnabled?: boolean;
};

const PIN_COLOR = { rider: '#2a673a', dest: '#c5372f' };

/**
 * Map shim over react-native-maps (Apple provider on iOS — no API key needed;
 * Google on Android via PROVIDER_DEFAULT). Mock-first: region/markers are
 * passed in. Mirrors the prototype JeeraMap pins.
 */
export const DjeraMap = forwardRef<MapView, DjeraMapProps>(function DjeraMap(
  { region = TRIPOLI_REGION, style, driver, online = false, markers = [], route, scrollEnabled = true },
  ref,
) {
  return (
    <MapView
      ref={ref}
      provider={PROVIDER_DEFAULT}
      initialRegion={region}
      style={[{ flex: 1 }, style]}
      scrollEnabled={scrollEnabled}
      showsCompass={false}
      toolbarEnabled={false}
    >
      {route && route.length > 1 ? (
        <Polyline coordinates={route} strokeColor="#2a673a" strokeWidth={4} />
      ) : null}

      {driver ? (
        <Marker coordinate={driver} anchor={{ x: 0.5, y: 0.5 }} flat>
          <View className="h-11 w-11 items-center justify-center">
            {online ? (
              <View className="absolute h-11 w-11 rounded-full bg-brand-500/25" />
            ) : null}
            <View className="h-5 w-5 rounded-full border-2 border-white bg-brand-600 shadow" />
          </View>
        </Marker>
      ) : null}

      {markers.map((m) => {
        const color = PIN_COLOR[m.kind ?? 'rider'];
        return (
          <Marker key={m.id} coordinate={m.coord} anchor={{ x: 0.5, y: 1 }}>
            {/* Teardrop location pin with the icon inside */}
            <View className="items-center">
              <View
                className="h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color }}
              >
                <Icon name={m.kind === 'dest' ? 'pin' : 'user'} size={18} color="#ffffff" />
              </View>
              <View
                className="-mt-1 h-2 w-2 rotate-45 border-b-2 border-e-2 border-white"
                style={{ backgroundColor: color }}
              />
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
});
