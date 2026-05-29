# CLAUDE.md — `trip-history` feature (D3)

Past trips list + per-trip detail.

## Scope

- **List**: back header + title; stats strip (Trips today · Earnings LYD · Hours); **search** (rider name + origin + destination) + **filter chips** (All / Today / Yesterday) feeding one `applyView()`; empty state; day-grouped sections with per-day count + total; trip cards (→ detail?id=N) with route, time, distance, rider chip, fare; **cancelled variant** (red badge, strikethrough fare, reason, not tappable). Bottom navbar (Trips active).
- **Detail**: floating back + status pill over a map of the trip route (pickup + drop-off pins + polyline, fitBounds); bottom sheet with date/time, route card, Distance + Duration, **fare breakdown** (fare · −commission · net), rider row + rating, **vertical timeline** (accepted · arrived · started · ended), support link. Driven by `?id=`.

## Prototype reference

[`../../../../driver-prototype/trip-history/`](../../../../driver-prototype/trip-history/) — `index.html`, `detail.html`.

## Planned files

`TripHistoryScreen.tsx`, `TripDetailScreen.tsx`, `TripCard.tsx`, `data.ts` (`TRIPS` mock map), routes `src/app/trips/{index,[id]}.tsx`.

## Notes / TODO

- Commission rate (§5) affects the breakdown — TODO chip.
