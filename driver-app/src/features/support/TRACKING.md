# TRACKING — `support` feature (D4)

Help & support: SOS, contact channels, FAQ. Linked from Profile, Settings, and trip detail.

## Status: ✅ built (mock-first), translated 1:1 from the prototype

Mirrors [`../../../../driver-prototype/support/`](../../../../driver-prototype/support/) (`index.html`).

## Files

- `SupportScreen.tsx` (`/support`): red **SOS** card (confirm dialog → `tel:` emergency), Contact list (call `tel:`, live chat (mock alert), email `mailto:`), FAQ accordion (5 Q&A), version footer.
- `FaqItem.tsx`: expand/collapse row, smooth height via `LayoutAnimation`, chevron rotates.
- `data.ts`: `SUPPORT_PHONE`/`SUPPORT_EMAIL`, `CONTACTS`, `FAQ`.
- i18n: `sup.*` block (flat keys — `sosSub`/`callSub`/etc. avoid the leaf/parent collision).
- New icons: `sos`, `chat`.

## Behaviour

- SOS → confirm `Alert` then `Linking.openURL('tel:1515')` (placeholder number; real dispatch is backend work).
- Contacts use `Linking` for `tel:` / `mailto:`; live chat shows a "coming soon" alert.
- Back → profile (`router.back`, falls back to `/profile`).
- Now reached from: Profile → "Help & support", Settings → "Help & support", and trip detail → "Get help with this trip" (previously inert).

## Future enhancements

- Real emergency number / safety-team dispatch for SOS (confirm scope with client).
- Wire live chat to a real chat provider.
- Source FAQ from a CMS / remote config.
