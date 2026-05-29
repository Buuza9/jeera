# CLAUDE.md — `dashboard` feature (D2)

Driver home. The screen a signed-in, approved driver lands on. Go online/offline, see the map, glance at today's summary.

## Scope

- **Full-bleed map** of Tripoli (react-native-maps, mock region) filling the screen.
- Driver GPS-chevron pin, centred; gains a pulse ring when online.
- **Online toggle** pill (Go online ↔ You're online). Going online mocks an incoming request after ~3s → routes to `ride-requests`.
- Floating overlays: avatar fab (→ profile) · notifications bell · map-control fabs (layers, recenter).
- Bottom **dock**: today's earnings (→ earnings) · outstanding commission §2.10 in saffron (→ commission).
- **Bottom tab bar** (Home active) — Home · Trips · Earnings · Profile.

## Prototype reference

[`../../../../driver-prototype/dashboard/`](../../../../driver-prototype/dashboard/) — `index.html`.

## Planned files

`DashboardScreen.tsx`, `OnlineToggle.tsx`, `store.ts` (online/offline state, persisted), route `src/app/dashboard.tsx` (replaces the ComingSoon placeholder). Map via the shared map shim (TODO).

## Depends on

- Shared `Navbar` component (build with this feature — first screen that needs it).
- Map shim (`react-native-maps`) — mock-first, mirror prototype `JeeraMap`.

## Notes / TODO

- §2.2 boot/auth gate should route approved → here, pending → enrollment/pending, suspended → commission/suspended.
- Currency `LYD / د.ل` via i18n.
