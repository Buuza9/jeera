# TRACKING — `trip-history` feature (D3)

Past-trips list + per-trip detail.

## Status: ✅ built (mock-first), translated 1:1 from the prototype

Mirrors [`../../../../driver-prototype/trip-history/`](../../../../driver-prototype/trip-history/) (`index.html`, `detail.html`).

## Files

- `TripHistoryScreen.tsx` (`/trips`): stats strip (trips · cash · hours), search (rider/origin/destination), day filter (All/Today/Yesterday), day-grouped sections with per-day count + total, empty state, Navbar (Trips active).
- `TripDetailScreen.tsx` (`/trips/[id]`): map (pickup + drop-off pins + route polyline) with floating back + "Completed" badge; scrollable sheet — date/time + net, route card, distance + duration, fare breakdown (fare · −commission · net), rider row (rating · paid in cash · call), vertical timeline (accepted · arrived · started · ended), support link.
- `TripCard.tsx`: route-rail card → detail; cancelled variant (red badge, struck-through fare, not tappable).
- `data.ts`: `TRIPS` mock, `commissionOf`/`netOf`/`tripById`/`initials`/`stripZeros`.
- Routes: `src/app/trips/{index,[id]}.tsx` (replaced the `trips.tsx` placeholder).
- i18n: `hist.*` block expanded in `en.json` / `ar.json`. Reuses `req.*`, `trip.*`, `earn.*`, `unit.*`, `dash.trips`.

## Notes

- Detail map uses a fixed Tripoli route (andalus → gargaresh), like the prototype — mock-first.
- Segmented filter + search use the inline `<Pressable>` + inner-`<View>` pattern (no `shadow-sm` toggle) to avoid the NativeWind component-swap crash.
- Back chevron → `/dashboard` (reached via Navbar replace); detail back → `/trips`.

## Future enhancements

- Real completed-trips query (pagination, date ranges) replacing mock `TRIPS`.
- Per-trip real pickup/drop-off coordinates for the detail map instead of the fixed route.
- Wire the rider **Call** + "Get help with this trip" (support feature) once those land.
- Commission rate (§5) client-blocked — feeds the fare breakdown.
