# CLAUDE.md — `earnings` feature (D3)

Driver earnings overview: daily / weekly / monthly, with per-trip breakdown.

## Scope

- Back-chevron header → dashboard.
- **Segmented period tabs** (Today / This week / This month) driving a single `render(period)`.
- Brand-gradient **hero**: net earnings + delta-vs-previous pill.
- **Mini bar chart** (animated): hourly for Today · 7 daily bars (Sat→Fri Libya week) · 4 weekly bars; current bucket highlighted.
- **Stats grid** (2×2): Trips · Cash collected (LYD) · Online hours · Commission −15% (amber).
- **Breakdown list**: per-trip (Today) / per-day (week) / per-week (month).
- Bottom navbar (Earnings active).

## Prototype reference

[`../../../../driver-prototype/earnings/`](../../../../driver-prototype/earnings/) — `index.html`.

## Planned files

`EarningsScreen.tsx`, `BarChart.tsx`, `data.ts` (mock earnings by period), route `src/app/earnings.tsx`.

## Notes / TODO

- Commission rate (§5) client-blocked — TODO chip.
- All currency via `unit.currency` (LYD / د.ل).
