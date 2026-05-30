# TRACKING.md — `active-trip`

**Status legend:** ✅ Live · 🟡 Partial / WIP · ⏳ Pending · 🔌 Blocked on backend

The trip lifecycle after accepting a request. Navigation is handed off to
**Google Maps** (real turn-by-turn); the in-app screens show context + actions.

| Item | Status | Notes |
|---|---|---|
| To-pickup screen | ✅ | Interactive map (real GPS driver + pickup **pin icon**), live distance/ETA (haversine), rider card. Actions: **View directions** (→ Google Maps) · **Call** (`tel:`) · **I've arrived** → in-trip. Recenter/location button. |
| In-trip screen | ✅ | Interactive map (driver + drop-off **pin icon**), remaining km/ETA, destination + fare card. Actions: **View directions** · **I've arrived** (no Call) → collect. Recenter button. |
| Collect-payment screen | ✅ | After arriving at drop-off: amount to collect, **payment method** (Cash — rider pays directly), breakdown (fare → −15% commission → your earnings), **"I've collected the cash"** → success. |
| Success screen | ✅ | Animated check, "You earned" net highlight, itemized trip details (cash collected · commission · distance · duration), Back to home → dashboard (clears ride state). |
| Google Maps handoff | ✅ | `src/shared/maps.ts openDirections` — Google Maps app, universal-URL fallback. Only opens when the driver taps **View directions** (never auto). |
| Map framing | ✅ | Request → dashboard fits pickup + drop-off; to-pickup/in-trip frame driver + target via `regionForPoints`; location button recenters + zooms. |
| Real GPS | ✅ | Driver position from `useDeviceLocation`; distance/ETA from `haversineKm`. |
| Ride lifecycle | ✅ | `useRideStore` (ride-requests): offer → accept (active) → finish. Active-trip screens read the accepted trip. |
| Commission rate (15%) | 🔌 | Placeholder — client-blocked (§2.10/§5). In `data.ts commissionRate`. |
| AR/RTL + dark pass | ⏳ | Strings translated; needs a screenshot pass. |

## Flow

dashboard online → request sheet (pickup+drop-off pinned, no lines) → accept →
to-pickup → I've arrived → in-trip → I've arrived → collect payment →
I've collected the cash → success → back to home.

## Future enhancements (nice-to-haves for later)

- **Real routing/ETA** — distances via OSRM road routes, not straight-line haversine; live ETA.
- **Background location** while on a trip so the platform tracks position for the rider.
- **Commission to the ledger** — write the −15% accrual to `commission_entries` (D3) on cash collected, so balances are real not mock.
- **Waze option** — let the driver pick Google Maps / Waze / Apple Maps for directions.
- **Trip state persistence** — survive app kill mid-trip (offline-mid-trip §5); resume into the right stage.
- **GPS-gated "Arrived"** — enable arrival only within ~150 m of pickup/drop-off.
- **Receipt** — link the success screen to the real trip-history detail (D3).
- **Rate the rider** — insert `ratings/rate-rider` between success and home once ratings (D4) lands.
