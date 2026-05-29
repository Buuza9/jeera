# CLAUDE.md — `commission` feature (D3)

**The platform's revenue mechanism** — not just a wallet. Commission accrues per completed trip at the admin-configured rate, settles weekly (or at a cap), and overdue settlement triggers admin-initiated suspension. Coordinate with admin pricing controls.

## Scope (4 screens)

- **balance** (`index`): amber outstanding-balance hero + cap progress bar; settlement-info card (rate · next due · auto-suspend policy); recent accruals (per-trip `+fare×rate`); sticky "Settle now" + "View history".
- **settle**: amount block with Full/Partial segmented (partial clamps to outstanding); channel picker (bank transfer · in-person · mobile money); Confirm → animated success w/ reference → history.
- **history**: summary strip (settled this month · all-time); month-grouped settlement cards (channel · amount · date · `JRA-` ref · Paid badge).
- **suspended**: blocking danger state — warning icon, "Account suspended", balance-to-clear (exceeds cap), 3-step reactivation guide, "Settle now to reactivate" → settle, contact support.

## Prototype reference

[`../../../../driver-prototype/commission/`](../../../../driver-prototype/commission/) — `index.html`, `settle.html`, `history.html`, `suspended.html`.

## Planned files

`BalanceScreen.tsx`, `SettleScreen.tsx`, `HistoryScreen.tsx`, `SuspendedScreen.tsx`, `store.ts` (commission balance/status), `data.ts`, routes under `src/app/commission/`.

## Notes / TODO (all client-blocked — §5)

- Commission **rate** default · settlement **cap** value · approved **channels** list · settlement **grace period**. Surface TODO chips until confirmed.
