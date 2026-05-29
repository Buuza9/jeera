# CLAUDE.md — `support` feature (D4)

Help & support: SOS, contact channels, FAQ. Linked from Profile and trip detail.

## Scope

- Appbar.
- Prominent **SOS** card (danger gradient) → alert emergency services + safety team. White text on the red gradient.
- **Contact** list: call support (`tel:`), live chat, email (`mailto:`).
- **FAQ accordion**: 5 Q&A (pay · commission · no-show · documents · going offline) — tap to expand.

## Prototype reference

[`../../../../driver-prototype/support/`](../../../../driver-prototype/support/) — `index.html`.

## Planned files

`SupportScreen.tsx`, `FaqItem.tsx` (expand/collapse via Reanimated or LayoutAnimation), `data.ts` (FAQ + contact constants), route `src/app/support.tsx`.

## Notes

- Use `Linking.openURL` for `tel:` / `mailto:`.
- SOS action: confirm dialog before triggering (no real dispatch in mock).
