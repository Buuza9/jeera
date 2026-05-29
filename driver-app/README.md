# Djera Driver — `driver-app/`

The driver side of [Djera](../README.md) (formerly Jeera) — a motorcycle ride-hailing app for Libya. Drivers onboard with documents, toggle online/offline, accept incoming requests, navigate trips, collect cash, and settle a platform commission weekly.

Built mock-first (`USE_MOCKS=true`) so the app runs end-to-end with no backend.

## Read first

1. [`CLAUDE.md`](./CLAUDE.md) — workspace rules (stack, folder layout, conventions).
2. [`REQUIREMENTS.md`](./REQUIREMENTS.md) — client requirements per screen.
3. [`TRACKING.md`](./TRACKING.md) — current foundation + feature status.
4. [`../DEVELOPMENT_PLAYBOOK.md`](../DEVELOPMENT_PLAYBOOK.md) — monorepo methodology.
5. [`../driver-prototype/`](../driver-prototype/) — clickable HTML mockups for every screen we're building here. Open `dev.html` for the screen index.

## Stack

| Concern | Choice |
|---|---|
| Framework | Expo SDK 56 · React Native 0.85 · React 19.2 |
| Routing | Expo Router v5+ (file-based, typed routes) — `src/app/` |
| Styling | NativeWind v4 (planned — `global.css` ready) |
| State (client) | Zustand v4 + `persist` (planned) |
| State (server) | TanStack Query v5 (planned) |
| i18n | `react-i18next` + EN default · AR + RTL via `I18nManager` (planned) |
| Maps | `react-native-maps` (planned, mock-first) |
| Secure storage | `expo-secure-store` (tokens, PIN hash) — planned |
| Animations / gestures | Reanimated v4 + `react-native-worklets` + Gesture Handler v2 |
| Auth helpers | `expo-local-authentication`, `expo-crypto` (planned) |

"Planned" = not yet installed; lands in the foundation PRs that follow this scaffold. See `TRACKING.md`.

## Run

```bash
cd driver-app
npm install              # (already done by create-expo-app)
npm run ios              # iOS simulator
npm run android          # Android emulator
npm run web              # Web preview
npm run start            # Expo dev server (pick a target from the menu)
```

If a fresh checkout: `npm install` once before `npm run start`.

## Layout

```
driver-app/
├── src/
│   ├── app/             ← Expo Router routes (file-based)
│   ├── components/      ← scaffold stubs (template)
│   ├── constants/       ← scaffold stubs (template)
│   ├── hooks/           ← scaffold stubs (template)
│   └── global.css       ← NativeWind / Tailwind entrypoint
├── assets/              ← icons, splash, fonts
├── scripts/             ← reset-project + foundation scripts
├── app.json             ← Expo config
├── package.json
└── tsconfig.json
```

The playbook layout (`src/features/<feature>/`, `src/shared/`, `src/theme/`, `src/i18n/`, etc.) lands during the foundation PRs.

## Conventions

- **RTL day one** — only logical properties (`ms-/me-/start-/end-`, `padding-inline`, `margin-inline-start/end`). Never `ml-/mr-/pl-/pr-` or `margin-left/right`.
- **Mock-first** — `USE_MOCKS=true` in `.env`; every API/auth/map call has a mock path so the app runs offline.
- **Theme + lang** — persisted via `AsyncStorage` (theme/lang) and `expo-secure-store` (auth tokens / PIN hash).
- **Per-feature TRACKING.md** — update on every commit that touches the feature; see [`../INSTRUCTIONS.MD`](../INSTRUCTIONS.MD) §7.

## Commit style

`<scope>: <verb> <what>` — lowercase, no period. Examples: `driver-app/scaffold: bootstrap expo app`, `driver-app/theme: wire nativewind tokens`. See [`../INSTRUCTIONS.MD`](../INSTRUCTIONS.MD) for details. No `Co-Authored-By:` trailer.

## Status

See [`TRACKING.md`](./TRACKING.md) for the live foundation + feature checklist. The HTML prototype at [`../driver-prototype/`](../driver-prototype/) is feature-complete and serves as the design source of truth.
