# TRACKING — `commission` feature (D3)

The platform's revenue mechanism: commission accrues per completed trip at the
admin-configured rate, settles weekly (or at a cap), and overdue settlement
triggers admin-initiated suspension.

## Status: ✅ built (mock-first), translated to RN from the prototype

Exact replica of [`../../../../driver-prototype/commission/`](../../../../driver-prototype/commission/)
(`index.html` · `settle.html` · `history.html` · `suspended.html`).

## Screens / files

| Screen | File | Route | Mirrors |
|---|---|---|---|
| Balance | `BalanceScreen.tsx` | `/commission` | `index.html` |
| Settle | `SettleScreen.tsx` | `/commission/settle` | `settle.html` |
| History | `HistoryScreen.tsx` | `/commission/history` | `history.html` |
| Suspended | `SuspendedScreen.tsx` | `/commission/suspended` | `suspended.html` |

- `store.ts` — in-memory commission ledger (`outstanding`, `cap`, `status`, `settle()`, `accrue()`), not persisted (matches ride/dashboard stores).
- `data.ts` — mock accruals, settlements, channels, summary, suspended demo state; `accrued(fare,rate)`.
- Icons added to `shared/components/Icon.tsx`: `bankTransfer`, `building`, `alertCircle`.
- Palette: added `accent.50/100/700` to `tailwind.config.js`.
- i18n: `com.*`, `set.*`, `susp.*` blocks added to `en.json` + `ar.json`.

## Behaviour

- **Balance**: amber outstanding-balance hero + cap progress bar (`outstanding/cap`); settlement-info card (rate · next due · auto-suspend policy w/ TODO chip); recent per-trip accruals (`+fare×rate`); sticky "Settlement history" + "Settle now".
- **Settle**: amount block with Full/Partial segmented control (partial clamps to outstanding); channel picker (bank · in-person · mobile, radio-style); Confirm → animated success overlay with `JRA-` reference → history. Confirm disabled when amount ≤ 0.
- **History**: summary strip (settled this month · all-time); month-grouped settlement cards (channel icon · amount · date · ref · Paid badge).
- **Suspended**: blocking danger state — alert icon, badge, balance-to-clear card (exceeds cap), 3-step reactivation guide, "Settle now to reactivate" → settle. Contact-support link inert until the support feature lands.

## Client-blocked (§5) — surfaced behind TODO chips

- Commission **rate** default (placeholder 15%).
- Settlement **cap** value (placeholder 200 LYD).
- Approved **channels** list (bank / in-person / mobile placeholders).
- Overdue **grace period** before suspension.

## Future enhancements

- **Persist** the commission store (`zustand/persist`) so the balance survives reloads.
- **Wire `accrue()`** into `active-trip` trip-finish so completed trips actually grow the outstanding balance (currently the `CompleteScreen` only notes this in a comment).
- **Real settlement flow**: `POST /commission/settlements { amount, channel }` → server reference; replace the pseudo `JRA-` sequence in `store.ts`.
- **Suspended gating**: when `status === 'suspended'`, block the dashboard "go online" toggle and route here; today the suspended screen is reachable only by direct route with its own demo balance.
- **Contact support** link → wire to the `support` feature route once it exists.
- Localize accrual route names / dates (currently literal, like place names in the prototype).
