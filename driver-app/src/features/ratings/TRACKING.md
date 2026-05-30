# TRACKING — `ratings` feature (D4)

The driver's own rating overview + the post-trip rate-the-rider screen.

## Status: ✅ built (mock-first), translated 1:1 from the prototype

Mirrors [`../../../../driver-prototype/ratings/`](../../../../driver-prototype/ratings/) (`index.html`, `rate-rider.html`).

## Files

- `RatingsScreen.tsx` (`/ratings`): rating hero (4.92 ★ + count + top-rated pill), star breakdown bars (5★→1★), behaviour stats (acceptance / cancellation / completion), recent rider reviews (avatar · stars · comment · tags). Reached from Profile → "Your rating".
- `RateRiderScreen.tsx` (`/ratings/rate-rider`): rider avatar + name, 5 big tappable stars (Poor→Excellent hint), quick tags revealed after rating, optional note, Submit / Skip → dashboard. Entered after `active-trip/complete`.
- `StarRating.tsx`: read-only star row (reuses the shared `star` icon, filled/outline).
- `data.ts`: mock `OVERVIEW`, `REVIEWS`, `RATE_TAGS`, `RATE_HINTS`.
- i18n: `rat.*` + `rr.*` blocks; `success.rate` added.

## Behaviour

- Overview back → profile (`router.back`, falls back to `/profile`).
- Rate-rider: stars set the rating (reveals tags + enables Submit); Submit/Skip call `useRideStore.finish()` then `router.replace('/dashboard')`.
- `active-trip/complete` now routes to rate-rider (the "Rate your rider" CTA) instead of clearing state itself — the rate-rider screen does the cleanup.

## Future enhancements

- Source the overview (rating, breakdown, reviews) from the backend.
- POST the rider rating (stars + tags + note) on Submit; carry the real rider name/initials from the trip instead of the mock "Khalid / KA".
