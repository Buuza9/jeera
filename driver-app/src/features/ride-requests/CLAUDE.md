# CLAUDE.md — `ride-requests` feature (D2)

Incoming ride-request modal shown over the dashboard when a request arrives.

## Scope

- Map (dimmed) behind a slide-up bottom sheet: driver pin + rider pickup pin + drop-off pin + route polyline.
- Incoming-request notice pill (top).
- **Auto-decline countdown ring** (~15s placeholder; amber ≤7s, red ≤3s; auto-routes back to dashboard at 0).
- Pickup→destination route card (pickup dot, destination dot, connecting track).
- Metrics: To rider (km) · Trip distance (km) · Fare (LYD, highlighted).
- Actions: **Reject** (→ dashboard) · **Accept** (→ active-trip/to-pickup).

## Prototype reference

[`../../../../driver-prototype/ride-requests/`](../../../../driver-prototype/ride-requests/) — `index.html` (modal over dashboard).

## Planned files

`RideRequestScreen.tsx`, `CountdownRing.tsx`, `data.ts` (mock request payload). Presented as a modal route (`src/app/ride-requests.tsx`, `presentation: 'modal'` or transparent overlay).

## Notes / TODO

- §5 auto-decline timer value is client-blocked — surface a TODO chip.
- Reuse map shim + route polyline from the shared map module.
