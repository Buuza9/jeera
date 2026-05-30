# TRACKING.md — `ride-requests`

**Status legend:** ✅ Live · 🟡 Partial / WIP · ⏳ Pending · 🔌 Blocked on backend

| Item | Status | Notes |
|---|---|---|
| Ride-request sheet | ✅ | **Transparent modal** — slides up as a sheet OVER the live dashboard (map stays mounted behind, dimmed). Sheet = grabber, header + countdown ring, route card, metrics, accept/reject. Exact replica of the `driver-prototype/ride-requests` sheet. Verified on iOS sim. |
| Modal presentation | ✅ | `ride-requests` route configured `presentation: 'transparentModal'` in root `_layout`; no full-page navigation. |
| Countdown ring | ✅ | `CountdownRing.tsx` (react-native-svg + Reanimated) — **smooth continuous sweep** over 15s (not per-second jumps); brand → amber (≤7s) → red (≤3s); dismisses at 0. |
| Reject → re-search | ✅ | Reject / timeout dismiss the sheet; the dashboard (focused + online) auto-searches again via `useFocusEffect` and presents a new request — until the driver accepts or goes offline. |
| Route polyline | ✅ | Added `route` prop to shared `DjeraMap` (brand-green polyline) — used by active-trip next. |
| Mock request | ✅ | `data.ts` `MOCK_REQUEST` — Hai al-Andalus → Gargaresh, 1.5/8.5 km, 25 LYD, rider 4.8. |
| Entry / exit | ✅ | Dashboard go-online → searches → presents sheet. Reject → re-search; Accept → `/active-trip/to-pickup` (placeholder until active-trip lands). |
| Animations | ✅ | Sheet slide-up + dim backdrop fade, prototype `--ease-spring` curve (gentle overshoot, no hard bounce). |
| Auto-decline timer value | 🔌 | 15s placeholder — client-blocked (§5). Lives in `data.ts autoDeclineSeconds`. |
| AR/RTL + dark pass | ⏳ | Strings translated; needs a screenshot pass. |

## Future enhancements (nice-to-haves for later)

- **Real dispatch** — receive live requests via Supabase Realtime (push/subscription) instead of the dashboard's mock 3s timer; accept/reject writes back to the trip row.
- **Modal presentation** — present as a true modal over the dashboard (Expo Router `presentation: 'modal'`) so the map underneath stays mounted, rather than a full-screen route.
- **Haptics + sound** — vibrate / play an alert when a request arrives (`expo-haptics`).
- **Accept race handling** — handle the case where the rider cancels or another driver takes it first (show "request no longer available").
- **Distance/ETA from routing** — compute to-rider + trip distance from OSRM instead of static mock values; draw the real road route, not a 3-point line.
- **Auto-decline analytics** — log declines/timeouts to tune the timer + acceptance metrics.
