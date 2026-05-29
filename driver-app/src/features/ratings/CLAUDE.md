# CLAUDE.md — `ratings` feature (D4)

The driver's own rating overview + post-trip rate-the-rider screen.

## Scope

- **overview** (`index`): rating hero (e.g. 4.92 + stars + "top rated" pill); star breakdown bars (5★→1★); behaviour stats (acceptance / cancellation / completion); recent rider reviews (avatar · stars · comment · tags). Reached from Profile → "Your rating".
- **rate-rider**: post-trip screen — rider avatar + name; 5 big tappable stars (hint label Poor→Excellent); quick tags revealed after rating; optional note; Submit → dashboard; Skip link. Entered after `active-trip/complete`.

## Prototype reference

[`../../../../driver-prototype/ratings/`](../../../../driver-prototype/ratings/) — `index.html`, `rate-rider.html`.

## Planned files

`RatingsScreen.tsx`, `RateRiderScreen.tsx`, `StarRating.tsx` (reuse the `star` icon, filled/outline), `data.ts`, routes `src/app/ratings/{index,rate-rider}.tsx`.

## Notes

- Reuse the `star` icon from the shared Icon set (supports `filled`).
