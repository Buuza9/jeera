# TRACKING.md — `dashboard`

**Status legend:** ✅ Live · 🟡 Partial / WIP · ⏳ Pending · 🔌 Blocked on backend

| Item | Status | Notes |
|---|---|---|
| Dashboard screen | ✅ | Full-bleed map, top overlay (avatar + bell), greeting card, online toggle, map controls, Today/Commission dock, bottom navbar. Ported from `driver-prototype/dashboard`. Verified on iOS sim. |
| Map shim (`DjeraMap`) | ✅ | `src/shared/components/Map.tsx` — react-native-maps, Apple provider on iOS (no key), driver pin (pulse when online) + rider/dest pins. Reused by ride-requests/active-trip/trip-history later. |
| Real GPS (`expo-location`) | ✅ | `src/shared/useDeviceLocation.ts` — foreground permission, initial fix + watch, Tripoli fallback. Map + driver pin center on live position; recenter control re-centers. Permission strings in app.json. |
| Navbar | ✅ | `src/shared/components/Navbar.tsx` — 4 tabs (Home/Trips/Earnings/Profile), active highlight, safe-area aware. Reused across D2–D4. |
| Online toggle | ✅ | `dashboardStore` (Zustand + AsyncStorage, persisted). Going online mocks an incoming request after 3s → `/ride-requests`. |
| Today summary | 🟡 | Mock values (320 LYD · 15 trips · 6h). Real data from earnings store later. |
| Commission indicator | 🟡 | Mock (48 LYD · Due Sunday). Real data from commission store later. |
| Notifications bell | 🟡 | Static dot; no notifications feature yet. |
| Layers control | 📌 | Static; map-style switch not wired. |
| AR/RTL + dark pass | ⏳ | Strings translated; needs a screenshot pass. |

## Native deps added

`react-native-maps` (map), `expo-location` (GPS). Both required a native rebuild to link.

## Routes added (placeholders until their features land)

`/trips`, `/earnings`, `/profile`, `/commission`, `/ride-requests` → `ComingSoon`.

## Future enhancements (nice-to-haves for later)

Not required for the feature to ship, but worth revisiting:

- **Live data wiring** — replace the mock Today summary (320 LYD · 15 trips · 6h) and commission (48 LYD · Due Sunday) with real values from the earnings + commission stores once those features land.
- **Backend presence** — when the driver goes online, publish availability to Supabase Realtime so dispatch can match them; reflect connection state in the toggle.
- **Background location while online** — request background location so the platform can track position for dispatch even when the app is backgrounded (needs `NSLocationAlwaysAndWhenInUseUsageDescription` + background mode).
- **Driver-pin heading** — rotate the pin to face direction of travel using GPS bearing (mirrors the prototype's `animateAlong`); animate the online pulse ring with Reanimated instead of a static ring.
- **Map style toggle** — wire the (currently static) layers control to switch map style, and auto-match the active light/dark theme.
- **Neighborhood + real weather** — reverse-geocode the live location for the greeting card; replace the mock "Tripoli · 26°" with a real weather call.
- **Location-denied UX** — show a friendly banner prompting the user to enable location in Settings when permission is denied (currently silently falls back to Tripoli).
- **Notifications** — make the bell open a real notifications feed with an unread badge driven by data.
