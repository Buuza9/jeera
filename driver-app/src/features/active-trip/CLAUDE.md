# CLAUDE.md — `active-trip` feature (D2)

The trip lifecycle after accepting a request: navigate to pickup → start → navigate to drop-off → complete + collect cash.

## Scope

- **to-pickup**: map; driver pin animates along the route to the rider; remaining-distance + ETA strip; rider card (avatar, name, pickup address); Call + Arrived (enables near pickup) → in-trip.
- **in-trip**: map; driver pin animates pickup → drop-off; destination + fare card (LYD); single "End trip" → complete.
- **complete**: animated check ring; "Trip completed"; fare-due card (LYD + Cash pill); Distance + Duration; commission accrual note (§2.10); "Confirm cash received" + "Back to home" → dashboard (and → ratings/rate-rider per the prototype flow).

## Prototype reference

[`../../../../driver-prototype/active-trip/`](../../../../driver-prototype/active-trip/) — `to-pickup.html`, `in-trip.html`, `complete.html`.

## Planned files

`ToPickupScreen.tsx`, `InTripScreen.tsx`, `CompleteScreen.tsx`, `store.ts` (active trip state machine), routes under `src/app/active-trip/`.

## Notes / TODO

- §2.5 Arrived button enables near pickup (~<120 m).
- §2.10 commission accrual rate is client-blocked — TODO chip.
- Offline-mid-trip behavior (§5) client-blocked.
- Needs map `animateAlong` (port from prototype `JeeraMap`).
