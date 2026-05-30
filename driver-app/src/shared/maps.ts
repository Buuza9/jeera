import { Linking } from 'react-native';

import { type LatLng } from './components/Map';

/**
 * Open external turn-by-turn navigation to a destination.
 * Tries the Google Maps app first, then falls back to the universal Google
 * Maps URL (which opens the app via universal link if installed, else the
 * browser). Driving mode.
 */
export async function openDirections(dest: LatLng) {
  const { latitude, longitude } = dest;
  const appUrl = `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`;
  const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
  try {
    if (await Linking.canOpenURL(appUrl)) {
      await Linking.openURL(appUrl);
      return;
    }
  } catch {
    // fall through to the universal URL
  }
  await Linking.openURL(webUrl);
}
