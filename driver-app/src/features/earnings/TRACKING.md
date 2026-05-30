# TRACKING — `earnings` feature (D3)

Driver earnings overview: daily / weekly / monthly with per-bucket breakdown.

## Status: ✅ built (mock-first), translated 1:1 from the prototype

Mirrors [`../../../../driver-prototype/earnings/`](../../../../driver-prototype/earnings/) (`index.html`).

## Files

- `EarningsScreen.tsx` — period segmented control (Today / This week / This month), brand hero (net + delta-vs-prev pill), animated bar chart, 2×2 stats grid, breakdown list. Route `src/app/earnings.tsx`. Navbar (Earnings active).
- `BarChart.tsx` — mini bar chart; bars grow from baseline on mount, replayed on period switch (keyed remount). Current bucket brand-filled.
- `data.ts` — `EARNINGS` mock by period (net/prev/trips/cash/hours/comm + bars/labels/rows); `group()` Hermes-safe thousands separator.
- i18n: `earn.*` + `hist.title` added to `en.json` / `ar.json`. Reuses `dash.trips`, `unit.hr/km/currency`.

## Behaviour

- Three periods drive a single data lookup; switching re-renders hero, chart, stats, and breakdown.
- Stats grid: Trips · Cash collected (LYD) · Online hours · Commission (amber/accent-700).
- Breakdown rows: per-trip (today, `from → to`) / per-day (week) / per-week (month).
- Back chevron → `/dashboard`. "Trip history" link → `/trips` (the trip-history feature isn't built yet).

## Future enhancements

- Wire **real aggregation** from the trips/commission ledgers (today/week/month) instead of mock `EARNINGS`.
- Make today's breakdown rows tap through to the **trip-history detail** screen (the prototype links per-trip rows to `trip-history/detail`); inert until that feature lands.
- Point the "Trip history" link at the real `trip-history` route once it exists (currently `/trips` placeholder).
- Commission rate (§5) is client-blocked — surfaced as the amber Commission stat.
- Consider a real charting lib / gesture scrubbing if the client wants interactive bars.
