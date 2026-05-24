# CLAUDE.md — Jeera Driver (`driver-app/`)

This file governs the **driver-app workspace**. The repo root is one level up
(`jeera/`), with cross-cutting docs (`../DEVELOPMENT_PLAYBOOK.md`,
`../INSTRUCTIONS.MD`, `../ROADMAP.md`, `../CLAUDE.md`) shared across all six
workspaces.

> **Read [`../DEVELOPMENT_PLAYBOOK.md`](../DEVELOPMENT_PLAYBOOK.md) end-to-end before starting any feature.**
> It is the authoritative source for folder structure, the three-tier doc
> convention, mock-first development (`USE_MOCKS`), the theme system, RTL rules
> (apply from day one — retrofit is painful), state management, auth/navigation,
> the shared component library, commit conventions, and the verification workflow.
>
> When spinning up a feature, follow playbook §20 step by step. Spawn one agent
> per `src/features/<feature>/` and keep that feature's `TRACKING.md` updated as
> the single source of progress. Never skip the `TRACKING.md` update on a commit.

> **Also read [`REQUIREMENTS.md`](./REQUIREMENTS.md) before scoping any feature.**
> It is the extracted client requirements (from the proposal deck) — screen-by-screen
> behaviour, copy, fields, CTAs, the commission-settlement mechanism, and
> out-of-scope items. CLAUDE.md is *how*; REQUIREMENTS.md is *what*. If the two
> disagree, REQUIREMENTS.md wins on scope.

---

## 1. Project overview

The **driver side** of Jeera. Drivers onboard with documents (ID, license,
vehicle registration), toggle online/offline, receive incoming ride requests,
accept and navigate trips, collect **cash** from the rider at the end, and
**settle a platform commission weekly** (or when hitting a configurable cap).
Overdue commission triggers a temporary account suspension by the admin.

Built **mock-first** (`USE_MOCKS=true` in `.env`) so it runs end-to-end with
no backend.

## 2. Tech stack (target)

| Concern | Choice |
|---|---|
| Framework / runtime | Expo SDK 55+ · React Native 0.83+ · React 19+ |
| Routing | Expo Router v5 (file-based, typed routes) |
| Styling | NativeWind v4 (Tailwind classes; RTL-safe `ms-/me-/start-/end-`) |
| Icons | `react-native-heroicons` wrapped in `src/shared/components/Icon.tsx` |
| Global state | Zustand v4 + `persist` (one store per domain) |
| Server state | TanStack Query v5 |
| i18n | `react-i18next` + `i18next` (EN default + AR, RTL switching) |
| Maps | `react-native-maps` (mocked region/markers until a key lands) |
| Secure storage | `expo-secure-store` (tokens, PIN hash, driverId) |
| Plain storage | `@react-native-async-storage/async-storage` (theme, settings) |
| Animation / gestures | Reanimated v4 (+ `react-native-worklets`) + `react-native-gesture-handler` v2 |
| Biometric / crypto | `expo-local-authentication` · `expo-crypto` (SHA-256 PIN hash) |
| Build / OTA | EAS Build + EAS Update |

## 3. Planned features

| Feature | Purpose | Phase |
|---|---|---|
| `enrollment` | First-time KYC: phone, OTP, ID, license, vehicle docs, PIN, biometric | D1 |
| `auth` | Returning-user sign-in (biometric/PIN), session lock, sign-out | D1 |
| `dashboard` | Home: go online/offline, map, today's summary | D2 |
| `ride-requests` | Incoming request modal, accept/decline with countdown | D2 |
| `active-trip` | Navigate to pickup → start → navigate to drop-off → complete | D2 |
| `earnings` | Daily/weekly/monthly earnings, per-trip breakdown | D3 |
| `trip-history` | Past trips list + detail | D3 |
| **`commission`** | Auto-calc per trip, weekly settlement, settlement UI, suspension logic | D3 |
| `ratings` | Driver's own rating; rate the rider after a trip | D4 |
| `profile` | Driver profile, vehicle details, document status | D4 |
| `settings` | Theme, language (AR/EN), notifications, security, privacy | D4 |
| `support` | Help center, FAQ, contact, SOS | D4 |

**Note on `commission`:** this is the platform's revenue mechanism per the
client spec — not just a "wallet" feature. The driver's commission balance
accumulates per completed trip at the admin-configured rate, settles weekly
(or at a cap), and overdue settlement results in admin-initiated account
suspension. Coordinate this feature spec carefully with the admin workspace's
pricing controls.

## 4. Folder structure

Mirrors the playbook §2 layout internally.

```
driver-app/
├── CLAUDE.md                ← this file
├── README.md                ← how to run
├── app/                     ← Expo Router routes
├── src/
│   ├── features/<feature>/  ← CLAUDE.md · TRACKING.md · components / hooks / store / data
│   ├── shared/              ← components, constants, hooks, store, theme, types
│   ├── navigation/          ← route param types
│   └── i18n/                ← en.ts · ar.ts · index.ts
└── assets/                  ← icons, fonts, splash
```

## 5. Status

⏳ **Not scaffolded yet.** Phase 0 of the playbook is the next build step.
