# CLAUDE.md — Jeera Rider (`rider-app/`)

This file governs the **rider-app workspace**. The repo root is one level up
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
> behaviour, copy, fields, CTAs, and out-of-scope items. CLAUDE.md is *how*;
> REQUIREMENTS.md is *what*. If the two disagree, REQUIREMENTS.md wins on scope.

---

## 1. Project overview

The **rider side** of Jeera. Riders register with email/phone + OTP, set
their pickup and destination on a map, see an approximate fare *before*
requesting, watch their assigned driver approach in real time, pay cash at
the end of the trip, and rate the driver.

This workspace is built **mock-first** (`USE_MOCKS=true` in `.env`) so it
runs end-to-end with no backend.

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
| Secure storage | `expo-secure-store` (tokens, riderId) |
| Plain storage | `@react-native-async-storage/async-storage` (theme, settings) |
| Animation / gestures | Reanimated v4 (+ `react-native-worklets`) + `react-native-gesture-handler` v2 |
| Build / OTA | EAS Build + EAS Update |

## 3. Planned features

| Feature | Purpose | Phase |
|---|---|---|
| `auth` | Email/phone signup + OTP, returning-user sign-in, sign-out | R1 |
| `profile` | Rider profile basics (name, contact, language) | R1 |
| `pickup-destination` | Set pickup + destination on map, search by address | R2 |
| `fare-estimate` | Show approximate fare before requesting (opening + per-km) | R2 |
| `request` | Submit ride request, wait for driver assignment | R2 |
| `driver-tracking` | Live driver position as they approach pickup | R3 |
| `trip-progress` | Show current state (to-pickup, on-trip, at destination) | R3 |
| `payment-confirm` | Confirm cash payment at end of trip | R4 |
| `rating` | Rate the driver after trip completion | R4 |
| `trip-history` | Past trips list + detail | R5 |
| `settings` | Theme, language, notifications | R5 |
| `support` | Help center, contact, FAQ | R5 |

## 4. Folder structure

Mirrors the playbook §2 layout internally. See `../CLAUDE.md` "Playbook ↔ this
monorepo" for how playbook references to "the root" map here.

```
rider-app/
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

⏳ **Not scaffolded yet.** Phase 0 of the playbook (Expo scaffold, theme, i18n,
RTL, shared stores, atomic components, brand assets, boot flow) is the next
build step for this workspace.
