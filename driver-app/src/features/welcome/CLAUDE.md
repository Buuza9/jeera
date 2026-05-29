# CLAUDE.md — `welcome` feature

The app entry screen. First thing a driver sees on launch (before auth/enrollment).

## Scope

- Brand mark, title, tagline.
- Three value-prop feature cards (drive on your schedule · cash per trip · track earnings).
- Two CTAs: **Get started** → `/enrollment`, **I already have an account** → `/auth`.
- Legal line (Terms + Privacy).

## Prototype reference

[`../../../../driver-prototype/welcome/index.html`](../../../../driver-prototype/welcome/index.html) — ported 1:1, including the `.row` card styling for the feature list.

## Files

- `WelcomeScreen.tsx` — the screen. Rendered by `src/app/index.tsx`.
- Copy lives in `src/i18n/locales/{en,ar}.json` under `welcome.*`.

## Notes

- Uses shared primitives: `Screen`, `Brand`, `Button`, `Icon` (`src/shared/components`).
- Feature icons (`clock`, `cash`, `chart`) come from the ported Djera icon set in `Icon.tsx`.
- RTL-safe: logical spacing only; `flex-row` auto-flips under `I18nManager.isRTL`.
- The `/enrollment` and `/auth` targets are placeholder routes (`ComingSoon`) until those features land.
