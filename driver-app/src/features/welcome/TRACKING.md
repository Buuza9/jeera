# TRACKING.md — `welcome`

**Status legend:** ✅ Live · 🟡 Partial / WIP · ⏳ Pending

| Item | Status | Notes |
|---|---|---|
| Welcome screen | ✅ | Brand mark + title + tagline + 3 feature cards + 2 CTAs + legal. Ported 1:1 from `driver-prototype/welcome`. Verified on iOS sim (iPhone 17 Pro Max), EN/LTR. |
| i18n (EN + AR) | ✅ | `welcome.*` keys in both locales. |
| Get started → enrollment | 🟡 | Navigates to `/enrollment` placeholder (`ComingSoon`) until the enrollment feature lands. |
| Sign in → auth | 🟡 | Navigates to `/auth` placeholder (`ComingSoon`) until the auth feature lands. |
| AR/RTL visual pass | ⏳ | Not yet screenshotted in Arabic; flex-row flips via I18nManager but needs a verification pass. |
| Dark theme visual pass | ⏳ | dark: classes in place; needs a screenshot pass. |

## Shared primitives introduced with this feature

`src/shared/components/`: `Screen`, `Brand`, `Button`, `Icon` (full Djera icon set ported from `claude-design-mockups/app/icons.jsx`). These are reused by all later features.
