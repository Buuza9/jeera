# TRACKING.md — Driver App

Single source of truth for what's built in `driver-app/`. Update on every
commit that touches this workspace. Per `../INSTRUCTIONS.MD` §7.

**Status legend:** ✅ Live · 🟡 Partial / WIP · ⏳ Pending · 📌 Stub · ❌ Dead · 🔌 Blocked on backend

> **Design source:** [`../driver-prototype/`](../driver-prototype/) is feature-complete (D1–D4) and acts as the visual reference for every screen built here. Open `../driver-prototype/dev.html` for the screen index.

---

## Tech stack

**Locked** = installed by the Expo scaffold or confirmed by the client.
**Deferred** = postponed but not ruled out.

Stack confirmed 2026-05-29: Supabase (Frankfurt), email OTP for auth (SMS deferred), free OSM tiles + OSRM, Expo Push, Sentry + PostHog from day one, Next.js (admin).

### Client (mobile)

| Concern | Choice | Status |
|---|---|---|
| Framework / runtime | Expo SDK 56 · React Native 0.85.3 · React 19.2.3 | Locked |
| Routing | Expo Router v5+ (file-based, typed) | Locked |
| Animations / gestures | Reanimated v4 + `react-native-worklets` · Gesture Handler v2 | Locked |
| Splash / status / system UI | `expo-splash-screen` · `expo-status-bar` · `expo-system-ui` | Locked |
| Image | `expo-image` | Locked |
| Styling | NativeWind v4 (Tailwind utilities; `global.css` ready) | Locked |
| State (client) | Zustand v4 + `persist` | Locked |
| State (server) | TanStack Query v5 | Locked |
| i18n | `react-i18next` + `i18next` + `I18nManager` (EN default, AR + RTL) | Locked |
| Maps SDK | `react-native-maps` (Apple/Google providers; mock-first) | Locked |
| Secure storage | `expo-secure-store` (tokens, PIN hash) | Locked |
| Plain storage | `@react-native-async-storage/async-storage` (theme, lang) | Locked |
| Biometric / crypto | `expo-local-authentication` · `expo-crypto` (SHA-256 PIN) | Locked |
| Icons | `react-native-heroicons` wrapped in `src/shared/components/Icon.tsx` | Locked |

### Backend / data plane

| Concern | Choice | Status |
|---|---|---|
| Platform (auth + DB + realtime + storage + functions) | **Supabase** (managed Postgres) | Locked |
| Database | Postgres (via Supabase) | Locked |
| File storage (KYC docs: ID, license, vehicle photos) | Supabase Storage (S3-compatible) | Locked |
| Realtime (driver location, dispatch) | Supabase Realtime (Postgres logical replication) | Locked |
| Auth | Supabase Auth — **email OTP (magic link / 6-digit code)** | Locked |
| Email delivery (OTP) | Supabase built-in SMTP for dev → **Resend** free tier (3k/mo) for production | Locked |
| SMS provider (phone OTP) | — | Deferred |
| Maps tiles + routing | OpenStreetMap (MapTiler / CARTO) + OSRM | Locked |
| Push notifications | Expo Push (free) → FCM/APNs direct later if scale demands | Locked |

### Hosting / DevOps

| Concern | Choice | Status |
|---|---|---|
| Mobile builds | EAS Build (Expo cloud) | Locked |
| OTA updates | EAS Update | Locked |
| App distribution (testing) | TestFlight (iOS) · Play Console internal track (Android) | Locked |
| App distribution (production) | App Store · Google Play | Locked |
| Backend hosting | Supabase Cloud (managed) | Locked |
| Region | Frankfurt (Supabase EU-Central · free tier) | Locked |
| Admin dashboard hosting | Vercel | Locked |
| CI | GitHub Actions | Locked |
| Error monitoring | Sentry (RN + web) | Locked |
| Analytics | PostHog (self-hostable, EU) | Locked |

---

## Foundation (playbook §0–§6)

| Item | Status | Notes |
|---|---|---|
| Expo scaffold | ✅ | `create-expo-app@latest` default template. SDK 56, RN 0.85.3, React 19.2.3, Expo Router v5+, Reanimated v4 + Worklets, Gesture Handler v2. Template demo files (`AppTabs`, `animated-icon`, `themed-text`, `hint-row`, etc.) removed once foundation landed. |
| Folder layout (`src/theme/`, `src/i18n/`, `src/app/`, `src/shared/`, `src/features/`) | ✅ | All present. `src/shared/components/` and `src/features/welcome/` landed with the welcome feature. |
| NativeWind v4 | ✅ | Wired via `metro.config.js` (`withNativeWind`), `babel.config.js` (preset-expo + `nativewind/babel`), `tailwind.config.js` (Djera oklch tokens — palm-green brand, saffron accent, terracotta danger, warm cream surfaces light + warm-midnight dark), `nativewind-env.d.ts`. `src/global.css` carries `@tailwind` directives. |
| Theme system (light/dark + tokens ported from prototype) | ✅ | `src/theme/tokens.ts` (TS mirror for non-NativeWind use). `src/theme/ThemeProvider.tsx` exposes `preference` (`light`/`dark`/`system`), `active` (resolved name), `setPreference`; persisted to `AsyncStorage` (`djera.theme`). |
| `react-i18next` + EN/AR | ✅ | `src/i18n/index.ts` initializes `i18next` lazily; resources in `src/i18n/locales/{en,ar}.json`. `src/i18n/LangProvider.tsx` exposes `lang`, `rtl`, `setLang`, `needsReload`; persists to `AsyncStorage` (`djera.lang`); detects device locale on first run via `expo-localization`. |
| RTL via `I18nManager` | ✅ | `LangProvider` calls `I18nManager.allowRTL(true)` + `forceRTL` on lang change; surfaces `needsReload: boolean` so the UI can prompt for an app reload when native layout direction differs from the picked language. |
| Zustand stores | 🟡 | `authStore` (secure-store) + `enrollmentStore` (AsyncStorage) live. Both storage adapters in `src/shared/store/`. `settingsStore`/`driverStore` land as features need them. |
| TanStack Query v5 | ⏳ | Query client provider in root layout. |
| `expo-secure-store` (tokens, PIN hash) | ✅ | Installed + linked (native build). Backs `authStore` persistence via `src/shared/store/secureStorage.ts` adapter. |
| `AsyncStorage` | ✅ | Used by theme + lang providers. Available for future state. |
| Mock layer (`USE_MOCKS`) | 🟡 | `src/shared/config.ts` reads `EXPO_PUBLIC_USE_MOCKS` (default true), `.env` committed. Per-feature mock data lives in `<feature>/data.ts` (e.g. `auth/data.ts`). |
| Boot flow (splash → auth gate → enrollment/auth/dashboard) | 🟡 | Root layout wires `ThemeProvider` → `LangProvider` → `Stack`. Auth gate + splash lands with the `auth` feature PR. Current entry (`src/app/index.tsx`) is a foundation demo: theme picker + lang picker + direction note. |
| Shared component primitives | 🟡 | Live in `src/shared/components/`: `Screen`, `Brand`, `Button`, `Icon` (full Djera set on `react-native-svg`), `Field` (label/error/prefix, centered), `Appbar` (back + title, RTL chevron). `Badge`, `Card`, `Navbar`, `Segment` land as features need them. |
| Icons (`react-native-svg`) | ✅ | Custom monoline set in `Icon.tsx` (currentColor stroke, 24×24, 1.8 base). Replaced `react-native-heroicons` for prototype fidelity. Requires native build (linked). |
| Map shim (`react-native-maps`) | ⏳ | Mock-first; mirror `JeeraMap` API from prototype. |
| Brand assets (icon, splash, fonts) | ⏳ | Replace template's defaults with Djera mark + Geist/Inter/IBM Plex Sans Arabic (load via `expo-font`). |

## Features (per `CLAUDE.md` §3 — D1 → D4)

| Feature | Phase | Status | Prototype reference |
|---|---|---|---|
| `welcome` | D1 | ✅ | `../driver-prototype/welcome/` — entry screen, ported 1:1. Verified on iOS sim. |
| `enrollment` | D1 | ✅ | `../driver-prototype/enrollment/` — form + pending, ported 1:1. enrollmentStore (AsyncStorage), mock submit, doc upload tiles (mock toggle). Verified on iOS sim. |
| `auth` | D1 | ✅ | `../driver-prototype/auth/` — sign-in → OTP → success, ported 1:1. authStore + secure-store + mock OTP (123456). Verified on iOS sim. SMS deferred; Supabase email OTP stubbed. |
| `dashboard` | D2 | ⏳ | `../driver-prototype/dashboard/` |
| `ride-requests` | D2 | ⏳ | `../driver-prototype/ride-requests/` |
| `active-trip` | D2 | ⏳ | `../driver-prototype/active-trip/` |
| `earnings` | D3 | ⏳ | `../driver-prototype/earnings/` |
| `trip-history` | D3 | ⏳ | `../driver-prototype/trip-history/` |
| `commission` | D3 | ⏳ | `../driver-prototype/commission/` |
| `ratings` | D4 | ⏳ | `../driver-prototype/ratings/` |
| `profile` | D4 | ⏳ | `../driver-prototype/profile/` |
| `settings` | D4 | ⏳ | `../driver-prototype/settings/` |
| `support` | D4 | ⏳ | `../driver-prototype/support/` |

## Open decisions

Stack locked 2026-05-29 — see the **Tech stack** section above.

Per-feature client-blocked items (the prototype's `.todo-chip`s):
- Commission rate default · settlement cap · approved channels
- Auto-decline timer on incoming requests
- Document expiry / re-upload UX
- PIN / biometric session lock scope
- Offline-mid-trip behavior
