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
