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
| Expo scaffold | 🟡 | `create-expo-app@latest` default template. SDK 56, RN 0.85.3, React 19.2.3, Expo Router v5+, Reanimated v4 + Worklets, Gesture Handler v2. Template ships `src/app/`, `src/components/`, `src/constants/`, `src/hooks/`, `src/global.css`. |
| Folder layout (`src/features/`, `src/shared/`, `src/theme/`, `src/i18n/`) | ⏳ | Not yet — replaces template's flat `src/` once feature work starts. |
| NativeWind v4 | ⏳ | `global.css` is in the scaffold but NativeWind is not yet installed/configured. |
| Theme system (light/dark + tokens ported from prototype) | ⏳ | Source: `../driver-prototype/_shared/tokens.css` oklch palette. |
| `react-i18next` + EN/AR | ⏳ | EN default; AR via toggle. Wire `I18nManager` for RTL. |
| Zustand stores (`authStore`, `settingsStore`, `driverStore`) | ⏳ | Persist via `AsyncStorage`. |
| TanStack Query v5 | ⏳ | Query client provider in root layout. |
| `expo-secure-store` (tokens, PIN hash) | ⏳ | |
| `AsyncStorage` (theme, language, toolbar collapsed) | ⏳ | |
| Mock layer (`USE_MOCKS=true`) | ⏳ | Mirrors prototype mock branches; lives in `src/shared/mocks/`. |
| Boot flow (splash → auth gate → enrollment/auth/dashboard) | ⏳ | |
| Shared component primitives (`Button`, `Card`, `Field`, `Segment`, `Badge`, `Row`, `Appbar`, `Navbar`) | ⏳ | Match `../driver-prototype/_shared/app.css` primitives. |
| Map shim (`react-native-maps`) | ⏳ | Mock-first; mirror `JeeraMap` API from prototype. |
| Brand assets (icon, splash, fonts) | ⏳ | Replace template's defaults with Djera mark + Geist/Inter/IBM Plex Sans Arabic. |

## Features (per `CLAUDE.md` §3 — D1 → D4)

| Feature | Phase | Status | Prototype reference |
|---|---|---|---|
| `enrollment` | D1 | ⏳ | `../driver-prototype/enrollment/` |
| `auth` | D1 | ⏳ | `../driver-prototype/auth/` |
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
