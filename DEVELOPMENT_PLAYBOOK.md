# Mobile App Development Playbook

A reusable blueprint for building a feature-rich React Native / Expo app
with AI agents. Hand this file to your new agent as the foundation —
it captures **everything** about how we work, not what we built.

---

## Table of Contents

0. [What this playbook gives you](#0-what-this-playbook-gives-you)
1. [Tech stack](#1-tech-stack)
2. [Folder structure](#2-folder-structure)
3. [Three-tier documentation convention](#3-three-tier-documentation-convention)
4. [Multi-agent workflow](#4-multi-agent-workflow)
5. [Mock-first development](#5-mock-first-development)
6. [Theme system](#6-theme-system)
7. [i18n + RTL](#7-i18n--rtl)
8. [State management](#8-state-management)
9. [Auth & navigation](#9-auth--navigation)
10. [Security](#10-security)
11. [Animation patterns (Reanimated)](#11-animation-patterns-reanimated)
12. [Shared components library](#12-shared-components-library)
13. [Forms & input patterns](#13-forms--input-patterns)
14. [Loading & feedback system](#14-loading--feedback-system)
15. [Bottom sheet patterns](#15-bottom-sheet-patterns)
16. [Persistence & storage](#16-persistence--storage)
17. [Commit conventions](#17-commit-conventions)
18. [Versioning + OTA + builds](#18-versioning--ota--builds)
19. [EAS Build & device registration](#19-eas-build--device-registration)
20. [Adding a new feature — step by step](#20-adding-a-new-feature--step-by-step)
21. [Verification workflow](#21-verification-workflow)
22. [Gotchas — things that bit us](#22-gotchas--things-that-bit-us)
23. [Memory & session continuity](#23-memory--session-continuity)
24. [Handoff to your new agent](#24-handoff-to-your-new-agent)

---

## 0. What this playbook gives you

- A repeatable folder structure agents can navigate without re-learning every session.
- A multi-agent workflow with clear ownership boundaries.
- Mock-first development so the UI ships ahead of the backend.
- A theming + i18n + RTL setup that's hard to retrofit later.
- A three-tier documentation convention (`CLAUDE.md` + `TRACKING.md` + per-screen journals) that keeps agents oriented across sessions.
- Concrete patterns for animations, forms, sheets, loading states, toast feedback, and security — every recurring problem solved once.

Adapt the names, the brand, the domain — but keep the structure.

---

## 1. Tech stack

Pick this stack on day one. Adding things later is fine; swapping foundations is not.

| Concern | Choice | Why |
|---|---|---|
| Framework | **Expo SDK (latest stable)** | Managed workflow — no Xcode/AS for most features |
| Runtime | React Native (matched to Expo SDK) | — |
| Routing | **Expo Router v3+ (file-based)** | Folder = route. Route groups `(group)` don't appear in the URL. |
| Styling | **NativeWind v4** | Tailwind-style class names; `ms-/me-/start-/end-` are RTL-safe |
| Icons | **react-native-heroicons** wrapped in `src/shared/components/Icon.tsx` | Single name registry across features |
| Global state | **Zustand v4 + persist middleware** | One store per domain. Trivial to test. |
| Server state | **TanStack Query v5** | Query/mutate, caching, refetch on focus |
| i18n | **react-i18next + i18next** | EN/AR (or whatever) with RTL switching |
| Secure storage | **expo-secure-store** | Tokens, PIN hash, customerId — never AsyncStorage |
| Plain storage | **@react-native-async-storage/async-storage** | Settings, preferences, theme |
| Animation | **Reanimated v3** | 60fps; runs on UI thread |
| Gestures | **react-native-gesture-handler v2** | Pair with Reanimated |
| Fonts | **expo-font** (load in root layout) | — |
| Vector | **react-native-svg** | Logos, gradients, custom illustrations |
| Camera | **react-native-vision-camera** (+ face-detector if needed) | For KYC / scan flows |
| Biometric | **expo-local-authentication** | Face ID / Touch ID / fingerprint |
| Crypto | **expo-crypto** | PIN hashing (SHA-256) |
| Clipboard | **expo-clipboard** | Confirm it's in the native build before relying on it |
| Sharing | **expo-sharing** | PDF receipts, etc. |
| App state | **expo-constants** for `extra.useMocks` etc. | Read from `app.config.js` |
| Build / OTA | **EAS Build + EAS Update** | One config, multi-channel |

**Skip:**
- `expo-linear-gradient` unless you've confirmed it's in the native build. `react-native-svg` does gradients just as well.
- `react-router-native` — Expo Router replaces it.
- Premature MMKV — AsyncStorage is fine until benchmarks say otherwise.

---

## 2. Folder structure

```
my-app/
├── DEVELOPMENT_PLAYBOOK.md       ← this file (root)
├── CLAUDE.md                     ← project-level agent instructions (root)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── app.config.js                 ← Expo config + extra.useMocks flag
├── eas.json                      ← EAS Build profiles (preview, internal, production)
├── .env                          ← API_BASE_URL, USE_MOCKS, etc. (gitignored)
├── .env.example                  ← Template committed
├── assets/                       ← Images, fonts, illustration HTML mockups
│   └── loading/                  ← Branded loader source (HTML reference + SVG paths)
├── app/                          ← Expo Router file tree (routes ONLY, not components)
│   ├── _layout.tsx               ← Root layout: providers, fonts, theme bootstrap, auth watchdog, Toast mount
│   ├── index.tsx                 ← Boot redirect (welcome / signin / tabs)
│   ├── (auth)/                   ← Pre-login + post-login modal screens (welcome, signin, settings, etc.)
│   │   ├── welcome.tsx
│   │   ├── signin.tsx            ← Biometric returning-user screen
│   │   ├── login.tsx             ← PIN unlock
│   │   ├── settings.tsx
│   │   └── …
│   ├── enroll/                   ← First-time KYC flow (own stack)
│   │   ├── _layout.tsx
│   │   ├── TRACKING.MD           ← Per-screen dev journal for this flow
│   │   ├── start.tsx
│   │   ├── phone.tsx
│   │   ├── otp.tsx
│   │   ├── id.tsx
│   │   ├── pin.tsx
│   │   ├── biometric.tsx
│   │   └── done.tsx
│   ├── (tabs)/                   ← Bottom-tab routes after login
│   │   ├── _layout.tsx
│   │   ├── index.tsx             ← Home/Dashboard
│   │   └── …
│   ├── (banking)/                ← Modal stack for account detail, fees, etc.
│   └── (transfers)/              ← Modal stack for the send flow
└── src/
    ├── features/                 ← One folder per domain feature
    │   └── <feature>/
    │       ├── CLAUDE.md         ← Spec / design / acceptance for this feature
    │       ├── TRACKING.md       ← Progress log (done / pending / blocked)
    │       ├── components/       ← Feature-local UI
    │       ├── hooks/            ← useFoo, useFooMutation
    │       ├── store/            ← Optional Zustand store
    │       ├── data/             ← API client + mock data + types
    │       │   ├── api.ts        ← Real fetch + USE_MOCKS branch
    │       │   ├── mockFoo.ts    ← Realistic-looking fixtures
    │       │   └── types.ts      ← Feature-local TS types
    │       └── lib/              ← Pure helpers
    ├── shared/
    │   ├── components/           ← Cross-feature UI
    │   │   ├── Icon.tsx          ← Heroicons wrapper (string name → component)
    │   │   ├── Button.tsx        ← Primary / secondary / ghost / danger variants
    │   │   ├── Card.tsx
    │   │   ├── BottomSheet.tsx   ← Reanimated bottom sheet
    │   │   ├── LoadingOverlay.tsx ← Branded full-screen loader
    │   │   └── Toast.tsx         ← Global feedback snackbar (mounted at root)
    │   ├── constants/
    │   │   ├── colors.ts         ← Live `Colors` object — mutated by theme swaps
    │   │   └── version.ts        ← APP_VERSION (read by About screen)
    │   ├── hooks/
    │   │   ├── useAuth.ts
    │   │   └── useDismissKeyboardOnBlur.ts
    │   ├── store/
    │   │   ├── authStore.ts      ← Tokens, customerId, enrolled, sessionUnlocked
    │   │   ├── themeStore.ts     ← themeId, themeVersion, setTheme
    │   │   ├── settingsStore.ts  ← Persisted preferences (toggles)
    │   │   ├── privacyStore.ts   ← hideAmounts flag (lives alone so dashboard doesn't import settings)
    │   │   └── toastStore.ts     ← Global toast API
    │   ├── theme/
    │   │   ├── themes.ts         ← THEMES array + resolveThemeTokens()
    │   │   └── bootstrap.ts      ← bootstrapTheme() called from root layout
    │   └── types/
    │       └── index.ts          ← Cross-feature TypeScript types
    ├── navigation/
    │   └── types.ts              ← RouteParams, TabParams
    └── i18n/
        ├── en.ts
        ├── ar.ts                 ← (or your second language)
        └── index.ts              ← i18next config + switchLanguage()
```

**Hard rules:**
- New code goes in `src/features/<feature>/` first. Promote to `src/shared/` only when a second feature actually needs it.
- Routes live in `app/`. Components do not. A file in `app/` should be thin — just compose the feature.
- Never put business logic in `app/<screen>.tsx`. Push it into the feature's hooks/store.
- `app/<group>/` parentheses create route groups (don't show in URL). Use them to keep stacks organised: `(auth)`, `(tabs)`, `(banking)`, `(transfers)`.
- Per-screen dev journals (`app/<flow>/TRACKING.MD`) are allowed for long flows like enrollment, in addition to the feature-level `TRACKING.md`.

---

## 3. Three-tier documentation convention

Three markdown surfaces, three different jobs. Agents read them in order.

### Tier 1 — Root `CLAUDE.md`

The project's master instructions. Lives at the repo root. Loaded into every Claude Code session automatically.

Sections:
- Project overview (one paragraph)
- Tech stack table
- Folder structure overview
- Multi-agent workflow rules
- NativeWind usage patterns + RTL rule
- Heroicons usage
- Navigation patterns
- Zustand patterns
- TanStack Query patterns
- i18n usage
- Prototype-to-RN conversion cheatsheet (if you have a prototype)
- RTL / Arabic notes
- How to run the app
- How to add a new feature
- Security considerations
- API conventions

### Tier 2 — Per-feature `CLAUDE.md`

What the feature is. Lives in `src/features/<feature>/CLAUDE.md`. Written once at feature kickoff; updated when scope changes.

Template:
1. **Feature purpose** — one paragraph
2. **Screens** — table: name · file path · description
3. **Components** — table: name · file path · what it renders
4. **Data types** — TS interfaces (lift from `src/shared/types/`)
5. **Navigation flow** — ASCII tree of routes + transitions
6. **Prototype reference** (if applicable) — file + line pointers
7. **Key RN implementation notes** — patterns, gotchas, code snippets
8. **NativeWind class examples**
9. **API endpoints** — REST contract
10. **State management** — Zustand keys, TanStack Query keys
11. **RTL / second-language considerations**
12. **Acceptance criteria** — `- [ ]` checklist

### Tier 3 — Per-feature `TRACKING.md`

Progress log. Lives next to the feature `CLAUDE.md`. **Update after every commit that touches the feature.** This is the single biggest lever for agent continuity.

Template:
1. **Header** — feature name, branch, brief description, sister-doc links
2. **At a glance** — table summarizing each area + status emoji
3. **Done** — table: # · task · commit SHA · notes
4. **Pending** — table: # · task · blocker
5. **Deferred follow-ups** — bullets of "not in scope today"
6. **Folder map** — ASCII tree of the feature folder
7. **Routes wired** — table: trigger · target · status
8. **Acceptance status** — mirror the checklist from `CLAUDE.md`, ticked

Status emojis we use:
- ✅ Live
- ⏳ Pending
- 🟡 Partially live / WIP
- 📌 Stub
- ❌ Dead / broken
- 🔌 Blocked on backend

### Tier 3b — Per-screen dev journals (optional)

For long linear flows (enrollment, onboarding) drop an `app/<flow>/TRACKING.MD` next to the screens. Keeps the feature-level `TRACKING.md` clean.

---

## 4. Multi-agent workflow

Pattern: **one agent per feature**, coordinated by a lead.

### Setting up a feature
1. Lead writes `src/features/<feature>/CLAUDE.md` (the spec) and an empty `TRACKING.md` skeleton.
2. Spawn an agent with the feature's `CLAUDE.md` as the primary instructions.
3. Agent reads shared files first: `src/shared/types/`, `src/shared/constants/colors.ts`, `src/shared/components/`, `src/i18n/en.ts`.
4. Agent writes files into `src/features/<feature>/` and adds routes under `app/`.
5. Agent updates `TRACKING.md` after each meaningful commit.

### Hard boundaries
- Agents **don't modify `src/shared/`** unless explicitly tasked. Need a shared component? Open a separate task for the lead.
- Agents **don't create new Zustand stores for UI-only state** — use `useState`.
- Agents **don't hardcode user-facing strings** — every visible string goes through `t('...')`.
- Agents **don't invent translation keys** without adding both `en.ts` and `ar.ts` (or your two languages).
- Agents **don't add error handling for impossible states** — trust internal code; only validate at system boundaries.
- Agents **don't add comments for what the code does** — only why, and only when non-obvious.

### When something is cross-cutting
Examples: a new shared component, a new theme token, a navigation refactor, a new auth gate. These belong to the lead agent or a dedicated task — not the feature agent.

---

## 5. Mock-first development

Every API call has two branches behind a single flag:

```js
// app.config.js
extra: {
  apiBaseUrl: process.env.API_BASE_URL,
  useMocks: process.env.USE_MOCKS === 'true',
}
```

```ts
// src/features/<feature>/data/api.ts
import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiBaseUrl?: string;
  useMocks?: boolean;
};
const BASE_URL = extra.apiBaseUrl ?? '';
const USE_MOCKS = extra.useMocks === true;

export const getFoo = async (): Promise<Foo> => {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 300));  // simulate latency
    return MOCK_FOO;
  }
  const res = await fetch(`${BASE_URL}/foo`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};
```

**Why:** lets the UI ship before the backend lands, lets the agent run the app without secrets, and gives QA a stable demo path.

**Mock data:** goes in `src/features/<feature>/data/mockFoo.ts` — never inline in component files.

**Switching:** `.env` with `USE_MOCKS=true` for local dev; CI builds set it `false` for staging/prod. Document the toggle in the feature's `CLAUDE.md`.

**Realistic-looking mocks:**
- Use believable names, amounts, dates.
- Include today + yesterday dates (groups in date-grouped lists won't render right with all-historic data).
- Cover edge cases: empty arrays, error states, pagination boundaries.

---

## 6. Theme system

A single live `Colors` object that all components read from, with hot palette swaps that don't require a full reload.

```ts
// src/shared/constants/colors.ts
export const Colors = {
  primary: '#0066FF',
  primary50: '#EAF1FF',
  primary700: '#0044CC',
  text: '#0F172A',
  textMuted: '#64748B',
  bg: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E2E8F0',
  emerald600: '#059669',
  red500: '#EF4444',
  // …
};
```

```ts
// src/shared/store/themeStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';
import { THEMES, resolveThemeTokens, type ThemeId } from '../theme/themes';

interface ThemeState {
  themeId: ThemeId;
  themeVersion: number;
  setTheme: (id: ThemeId) => Promise<void>;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeId: 'default',
      themeVersion: 0,
      setTheme: async (id) => {
        const theme = THEMES.find((t) => t.id === id);
        if (!theme) return;
        Object.assign(Colors, resolveThemeTokens(theme));  // mutate in place
        set({ themeId: id, themeVersion: get().themeVersion + 1 });
      },
    }),
    { name: '@app/theme/v1', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
```

```ts
// src/shared/theme/bootstrap.ts
export async function bootstrapTheme() {
  await useThemeStore.persist.rehydrate();
  const id = useThemeStore.getState().themeId;
  const theme = THEMES.find((t) => t.id === id);
  if (theme) Object.assign(Colors, resolveThemeTokens(theme));
}
```

```tsx
// app/_layout.tsx
export default function RootLayout() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    bootstrapTheme().then(() => setReady(true));
  }, []);
  if (!ready) return null;
  return <Stack screenOptions={{ headerShown: false }}>…</Stack>;
}
```

**Why `themeVersion`:** module-level `StyleSheet.create({ color: Colors.text })` captures the value at evaluation time. Components that need to respond to swaps must:

```tsx
// Subscribe so React re-renders on swap
useThemeStore((s) => s.themeVersion);
// Read Colors inline so the new value is picked up
return <View style={{ backgroundColor: Colors.primary }} />;
```

For static color usage where you don't care about live swaps, `StyleSheet` is fine — but document the choice.

**Watch out for `react-native-svg` gradient caching:** bake `themeVersion` into the gradient `id` to defeat the cache:
```tsx
<LinearGradient id={`bar-${themeVersion}`} … />
```

---

## 7. i18n + RTL

```ts
// src/i18n/en.ts
export default {
  welcome_cta: 'Get started',
  send_amount: 'Send {{amount}}',
  toast_on: '{{label}} on',
  toast_off: '{{label}} off',
};
```

```tsx
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
<Text>{t('welcome_cta')}</Text>
<Text>{t('send_amount', { amount: 'LYD 100' })}</Text>
```

```ts
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';
import en from './en';
import ar from './ar';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: 'en',
  fallbackLng: 'en',
});

export async function switchLanguage(lng: 'en' | 'ar') {
  await i18n.changeLanguage(lng);
  I18nManager.forceRTL(lng === 'ar');
  await Updates.reloadAsync();
}
```

**RTL rules (apply on day one or pay for it later):**
- NativeWind: use `ms-`/`me-`/`start-`/`end-` — they flip automatically. **Never** `ml-`/`mr-`/`pl-`/`pr-`.
- StyleSheet: use `marginStart`/`marginEnd`/`paddingStart`/`paddingEnd`, not `marginLeft`/`marginRight`.
- Chevron icons: flip in RTL via `I18nManager.isRTL` check or `scaleX(-1)`.
- Phone numbers, IBAN, card PAN, account numbers: force LTR with `writingDirection: 'ltr'` and `textAlign: 'left'`.
- OTP boxes: always LTR order (digit 1 at left). Wrap container in `{ direction: 'ltr' }`.
- Amounts: always LTR (`LYD 1,250.00`, not reversed). `+` / `-` prefixes stay as-is.
- Swipe-to-confirm: in RTL, the swipe direction inverts. Flip gesture start/end.
- `switchLanguage('ar')` forces `I18nManager.forceRTL(true)` and reloads the app.

---

## 8. State management

### Zustand — domain state, persisted

One store per domain. Persist only what matters across launches.

```ts
// Non-sensitive
export const useAccountsStore = create<AccountsState>()(
  persist(
    (set) => ({
      selectedId: null,
      setSelected: (id) => set({ selectedId: id }),
    }),
    {
      name: '@app/accounts/v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ selectedId: s.selectedId }),  // exclude setters
    },
  ),
);

// Sensitive — backed by SecureStore
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ tokens: null, … }),
    { name: '@app/auth/v1', storage: createJSONStorage(() => secureStorage) },
  ),
);
```

**Storage key convention:** `@app/<domain>/v<n>`. Bump `v` and write a migration if the shape changes.

**`partialize`:** always use it to exclude setter functions from the serialized blob.

### TanStack Query — server state

```ts
const { data, isLoading, error } = useQuery({
  queryKey: ['accounts'],
  queryFn: () => api.getAccounts(),
  staleTime: 30_000,
});

const mutation = useMutation({
  mutationFn: (payload) => api.send(payload),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['accounts'] });
    qc.invalidateQueries({ queryKey: ['transactions'] });
  },
});
```

**Key conventions** — write these into the feature's `CLAUDE.md`:
- `['domain']` — list
- `['domain', id]` — single
- `['domain', id, 'sub']` — nested
- `['domain', { filter, search, page }]` — filtered/paginated

### Local state — `useState`

Don't reach for Zustand for "is this sheet open." That's `useState`. Reserve Zustand for cross-component / persisted state.

---

## 9. Auth & navigation

### Boot redirect

```tsx
// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/shared/store/authStore';

export default function Boot() {
  const isEnrolled = useAuthStore((s) => s.isEnrolled);
  const sessionUnlocked = useAuthStore((s) => s.sessionUnlocked);
  if (!isEnrolled) return <Redirect href="/(auth)/welcome" />;
  if (!sessionUnlocked) return <Redirect href="/(auth)/signin" />;
  return <Redirect href="/(tabs)" />;
}
```

### Foreground re-lock watchdog

In root layout, listen to `AppState`. On `active` transition, check token expiry. Redirect to lock screen if expired.

```tsx
function useForegroundLockWatchdog() {
  const router = useRouter();
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active') return;
      const auth = useAuthStore.getState();
      if (auth.isTokenExpired()) {
        auth.setSessionUnlocked(false);
        router.replace('/(auth)/signin');
      }
    });
    return () => sub.remove();
  }, [router]);
}
```

### Declarative `<Redirect>` over imperative `router.replace`

For cross-group navigation (e.g. `(auth)` → `(tabs)`), imperative `router.replace` races and can bounce users back. Use a state flag + `<Redirect>` in the render:

```tsx
const [unlocked, setUnlocked] = useState(false);
// …on success:
setUnlocked(true);
// …in render:
if (unlocked) return <Redirect href="/(tabs)" />;
```

### Sign-out

Wipe everything (tokens, customerId, enrollment flags, biometric flag, session flag) → `router.replace('/welcome')`. Don't half-clear.

```ts
logout: () => set({ tokens: null, customerId: null, isEnrolled: false, biometricEnabled: false, pinSet: false, sessionUnlocked: false })
```

### Route group conventions

- `(auth)` — pre-login + post-login modal screens that should still feel "outside" the tabs (settings, security flows)
- `(tabs)` — bottom-tab navigator
- `enroll/` — first-time KYC stack (no group — it's its own top-level flow)
- `(banking)`, `(transfers)` — modal stacks pushed on top of tabs

### Navigation API

```ts
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';

router.push('/foo');                                  // push
router.push({ pathname: '/foo', params: { id: '1' }}); // with params
router.replace('/foo');                                // replace (no back)
router.back();
router.dismissAll();                                   // collapse modal stack

const { id } = useLocalSearchParams<{ id: string }>();

useFocusEffect(useCallback(() => {
  return () => Keyboard.dismiss();  // cleanup on blur
}, []));
```

---

## 10. Security

- [ ] Tokens in **SecureStore** only (never AsyncStorage)
- [ ] PIN stored as hash (`expo-crypto` SHA-256 with salt: `userId + pin`), never plaintext
- [ ] Biometric availability checked before showing the button: `await LocalAuthentication.hasHardwareAsync() && await LocalAuthentication.isEnrolledAsync()`
- [ ] HTTPS-only API base URL
- [ ] API keys in `app.config.js` `extra` field via env vars — never committed
- [ ] Sensitive data masked by default (card PAN, account number → last 4)
- [ ] Privacy mode (`hideAmounts` flag) masks all balances
- [ ] Clipboard auto-clears 5s after copying card details
- [ ] Auto-hide revealed PAN after 30s
- [ ] Reveal flow requires biometric or PIN re-auth before fetching full details
- [ ] `.env` is gitignored; commit only `.env.example`

### Biometric pattern

```ts
const unlockWithBiometric = async (prompt: string) => {
  const has = await LocalAuthentication.hasHardwareAsync();
  if (!has) return { ok: false, reason: 'no-hardware' };
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) return { ok: false, reason: 'not-enrolled' };
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: prompt,
    fallbackLabel: 'Use PIN instead',
  });
  return { ok: result.success, reason: result.success ? null : result.error };
};
```

---

## 11. Animation patterns (Reanimated)

Use Reanimated v3 for anything that should feel smooth.

**Cheat sheet:**
```ts
const value = useSharedValue(0);
value.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
value.value = withSpring(1, { damping: 15, stiffness: 120 });
value.value = withRepeat(withTiming(1, { duration: 400 }), -1, true);

const style = useAnimatedStyle(() => ({
  transform: [{ scale: value.value }],
  opacity: value.value,
}));

// Bridge back to JS thread when animation completes
withTiming(1, {}, (finished) => finished && runOnJS(onDone)());
```

**Common recipes:**

- **3D card flip:** `interpolate(rotate.value, [0, 1], [0, 180])` for front, `[180, 360]` for back; both with `backfaceVisibility: 'hidden'`.
- **Bottom sheet:** `translateY` from screen-height to 0, with `useAnimatedGestureHandler` pan tracking.
- **Swipe-to-confirm:** `translateX` clamped to `[0, trackWidth - thumbSize]`, threshold check on release.
- **Pulsing dot:** `withRepeat(withSequence(withTiming(1.2), withTiming(1)), -1, false)`.
- **Equalizer bars:** three `useSharedValue`s with staggered `withDelay`.
- **Drawn-in stroke:** SVG `<Path strokeDasharray={L} strokeDashoffset={animValue}>` interpolated `L → 0`.
- **Fade transitions on screen swap:** `Animated.View` with `useAnimatedStyle({ opacity: progress.value })`.

**Don't:** drive animations with `setState` and `Animated` from RN core. Bad performance, bad ergonomics.

---

## 12. Shared components library

Build these once, in `src/shared/components/`, before the first feature ships.

### `Icon.tsx`
Heroicons wrapper. Maps a string name to a component. Pass `size`, `color`, optional `strokeWidth`. Support both outline (default) and solid (`name-solid`).

### `Button.tsx`
Variants: `primary`, `secondary`, `ghost`, `danger`. Sizes: `sm`, `md`, `lg`. Loading state with spinner inline. Full-width prop. Disabled state.

### `Card.tsx`
Rounded white surface with shadow. Padding prop. Wraps grouped content.

### `BottomSheet.tsx`
Reanimated bottom sheet. Pan-to-dismiss. Backdrop tap to close. `maxHeight` prop. Renders inside a `Modal` so it's above the native stack.

### `LoadingOverlay.tsx`
Branded full-screen loader. Use sparingly — only for long-running async work where the user shouldn't tap anything. For button-level loading, put a spinner inline in the button instead.

Example: an animated SVG logo trace + soft pulse. Position absolute, fills the screen, intercepts touches.

### `Toast.tsx`
Global feedback snackbar. Wired via `useToastStore`. Mount once at the root layout level inside a `Modal` with `pointerEvents="box-none"` on every wrapping layer except the pill itself — so toasts don't intercept touches when not actively showing.

```tsx
// usage anywhere
import { toast } from '@/shared/store/toastStore';
toast.success('Saved');
toast.error('Failed');
toast.info('Theme applied');
```

```ts
// store
interface ToastState {
  current: { id: string; message: string; variant: 'info'|'success'|'error'; durationMs: number } | null;
  show: (msg: string, opts?: { variant?, duration? }) => void;
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  hide: () => void;
}
```

---

## 13. Forms & input patterns

### Display-name on add forms
When the user types a nickname, it becomes the saved entity's `name` AND `nick`. Mock lookup names are only fallbacks for the empty-input demo. Until the real lookup endpoint lands, don't overwrite the user's typed value with mock data.

```ts
const typed = nick.trim();
const displayName = typed || MOCK_FOUND.name;
const saved = { name: displayName, nick: typed || displayName.split(/\s+/)[0] };
```

### OTP auto-submit
On the 6th digit, fire the verify mutation automatically — no explicit button. Use `textContentType="oneTimeCode"` (iOS) + `autoComplete="sms-otp"` (Android) for SMS auto-fill.

### Keyboard hygiene
- Phone screens should **not** auto-focus on mount. User taps the input to open the keyboard.
- Between screens, dismiss the keyboard via a `useDismissKeyboardOnBlur` hook in the screen's `useFocusEffect` cleanup.

### PIN setup (two-pass)
1. "Create your PIN" + PinPad
2. On 6 digits → transition to "Confirm your PIN"
3. Match → SHA-256 hash → SecureStore → next screen
4. Mismatch → shake animation + reset both inputs + inline error

### Phone (Libyan example — adapt)
Fixed `+218` prefix block, 9-digit national input, auto-format `9X XXX XXXX`, validation rejects non-Libyan numbers.

### IBAN / account number / card PAN
Always LTR, monospace font, auto-format with spaces every 4 chars.

---

## 14. Loading & feedback system

Three tiers of feedback:

1. **Button-level inline spinner.** Default for most mutations. Replace button text with a small animated indicator. Keep the button width stable.
2. **Toast snackbar.** Confirms success/error after a mutation completes. Auto-dismisses after 2–3s.
3. **Full-screen `LoadingOverlay`.** Only for long-running blocking work where the user must wait (PIN unlock, app boot). Branded.

**Rules:**
- Don't double up — if you show inline + toast, drop the inline.
- Don't show the `LoadingOverlay` for fast mutations — it feels heavy.
- Always pair an error toast with a recovery action (retry button, "go back").

---

## 15. Bottom sheet patterns

Use a single `<BottomSheet>` component for every sheet — don't reinvent per-feature.

**Behaviors built in:**
- Slide up from bottom 280ms ease-out
- Backdrop fade-in synced
- Pan-to-dismiss with velocity-aware spring
- Tap backdrop to close
- `maxHeight` prop with internal `ScrollView` if content exceeds
- Renders inside a `Modal` so it's above any native stack

**Common pitfall:** if you set both `overflow: 'hidden'` and `overflowY: 'auto'` on the same view, scroll dies. Use a two-div wrapper.

**Keep content mounted through close animation:** unmounting content on `visible=false` causes a flicker. Render content while `visible || closing`.

---

## 16. Persistence & storage

| Data | Where | Key pattern |
|---|---|---|
| Auth tokens | SecureStore (via Zustand persist) | `@app/auth/v1` |
| PIN hash | SecureStore (direct) | `app-pin-hash` |
| customerId | SecureStore (direct) | `app-customer-id` |
| Refresh token | SecureStore (direct) | `app-refresh-token` |
| Theme | AsyncStorage (via Zustand persist) | `@app/theme/v1` |
| Settings toggles | AsyncStorage | `@app/settings/v1` |
| Privacy flag | AsyncStorage | `@app/privacy/v1` |
| Payees / cached lists | AsyncStorage | `@app/<domain>/v1` |

**Versioning:** every key ends `/v<n>`. Bump and write a migration when the shape changes.

**`partialize`:** always exclude setters from the serialized blob:
```ts
partialize: (s) => ({ field1: s.field1, field2: s.field2 })
```

---

## 17. Commit conventions

Subject line: `<feature>: <verb> <what>` — lowercase, no period.

```
cards: smooth freeze overlay transition
auth: re-apply mock PIN unlock + settings theme picker
fees: hero tracks active theme
tracking: refresh feature docs against recent commits
```

Body: 1–3 short lines, focused on *why* not file inventory.

**No commit trailers** (Co-Authored-By etc.) — git config handles attribution.

**Bundle related changes** into one commit. A commit should be a complete idea, not a snapshot.

**Don't commit:**
- `.env`
- Generated screenshots / debug files
- Files you haven't read
- Files matched by the user's "do not commit" patterns

**Before committing:**
- `git status` to see what's staged
- `git diff` of staged changes
- Stage specific files by name (`git add path/to/file.ts`), not `git add .`

---

## 18. Versioning + OTA + builds

Two files for version bumps:
- `app.config.js` — `version` field (shows up in stores, used by EAS)
- `src/shared/constants/version.ts` — what your "About" screen reads

**Bump both.** Otherwise the about/welcome screen lies to the user.

```ts
// src/shared/constants/version.ts
export const APP_VERSION = 'V1.3.5';
```

```js
// app.config.js
export default {
  expo: {
    version: '1.3.5',
    runtimeVersion: { policy: 'sdkVersion' },
    // …
  },
};
```

### OTA flow

1. Bump both version files → commit `chore: bump APP_VERSION to vX.Y.Z`
2. Push branch
3. `eas update --branch <channel> --message "..."`

Channels: `preview-mocks`, `staging`, `production`.

---

## 19. EAS Build & device registration

### Build profiles in `eas.json`

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "ios": { "simulator": false },
      "env": { "USE_MOCKS": "true" }
    },
    "production": {
      "distribution": "store",
      "env": { "USE_MOCKS": "false" }
    }
  }
}
```

### Device registration (iOS internal builds)

The integrity-could-not-be-verified error means the device's UDID isn't in the provisioning profile.

```bash
eas device:create   # generates a registration link
```

Teammates open the link in Safari on iPhone → Download Profile → Settings → General → VPN & Device Management → Install.

Then **rebuild** — existing builds were signed before registration and won't work no matter what:
```bash
eas build --platform ios --profile preview
```

If teammates grow past ~5: switch to **TestFlight** instead (`distribution: "store"` + App Store Connect upload).

### Running locally

```bash
npm install
npx expo start            # then press `i` (iOS) or `a` (Android)
npx expo start --clear    # clear Metro cache
npx expo run:ios          # native dev build (requires Xcode)
npx expo run:android      # native dev build
```

---

## 20. Adding a new feature — step by step

1. **Spec it** — write `src/features/<feature>/CLAUDE.md`. Include screens, types, routes, API contract, acceptance criteria. Reference any design / prototype source.
2. **Skeleton** — create empty `src/features/<feature>/{components,data,hooks,store}/` folders and a `TRACKING.md` with the "At a glance" table.
3. **Types** — add cross-feature types to `src/shared/types/`. Feature-local types stay in `data/types.ts`.
4. **Translations** — add EN + AR keys in `src/i18n/`. Use placeholder text only when copy is genuinely TBD.
5. **Mock data** — write `data/mockFoo.ts` with realistic-looking fixtures, including today/yesterday dates and edge cases.
6. **API client** — write `data/api.ts` with the real `fetch` + the `USE_MOCKS` branch.
7. **Hooks** — `useFoo`, `useFooMutation` wrapping TanStack Query. Document query keys in `CLAUDE.md`.
8. **Store (if needed)** — Zustand store in `store/`. Skip if local `useState` suffices.
9. **Components** — feature-local in `components/`. Import shared from `src/shared/components/`.
10. **Routes** — add files under `app/`. Each screen should be thin — compose the feature.
11. **Update `TRACKING.md`** — tick items in "Done", reference the commit SHA.
12. **Manual smoke** — both LTR (English) and RTL (Arabic if you have it). Both light and dark theme. Both mock and real API.
13. **Commit** — `<feature>: <verb> <what>`. Push.
14. **Update root `CLAUDE.md`** *only if* the feature introduces a new cross-cutting pattern.

---

## 21. Verification workflow

After making changes, before declaring done:

1. **Type check** — `npx tsc --noEmit` (or whatever your project uses).
2. **Lint** — `npx eslint .` if configured.
3. **Manual UI test** — open the simulator and exercise the golden path + 1–2 edge cases.
4. **Theme + RTL** — toggle theme in settings, toggle to Arabic, walk the flow again.
5. **Mock + real** — flip `USE_MOCKS` and confirm both branches behave.

For UI changes, **launch the simulator and use the feature before reporting complete.** Type-checking proves the code compiles, not that it works.

---

## 22. Gotchas — things that bit us

Apply these patterns from day one — they're expensive to retrofit.

- **Theme system from the start.** Retrofitting means visiting every `StyleSheet.create({ color: ... })` in the codebase.
- **RTL classes from the start.** Same reason. `ml-2` everywhere = audit hell.
- **Mock branches from the start.** Don't write code that assumes a backend exists. You'll regret it the day APIs slip.
- **TRACKING.md from the start.** It's the single best lever for AI-agent continuity. Don't skip it for "small" features.
- **One Zustand store per domain.** Resist the megastore.
- **Declarative routing on group transitions.** Imperative `router.replace` across `(auth)` → `(tabs)` races.
- **Pressable + Switch.** Wrapping a `Switch` inside a `Pressable` swallows the switch's taps. Conditionally wrap (`<View>` when there's no `onPress`, `<Pressable>` otherwise).
- **Pressable function-style.** `<Pressable>{({ pressed }) => …}</Pressable>` is broken in some RN versions — use the plain array + state-based press feedback (`onPressIn`/`onPressOut` → `setPressed`).
- **Persist tokens to SecureStore, never AsyncStorage.** Easy mistake when copy-pasting Zustand persist examples.
- **Module-level StyleSheet freezes theme tokens.** Subscribe to `themeVersion` and read `Colors` inline if the component must respond to swaps.
- **`react-native-svg` gradients cache by id.** Bake `themeVersion` into the id to defeat the cache.
- **Bottom sheet content unmount flicker.** Keep content rendered through the close animation.
- **Cross-group `<Redirect>` over imperative.** Eliminates races.
- **`expo-linear-gradient` may not be linked.** Use `react-native-svg` LinearGradient until verified.
- **`expo-clipboard` may not be linked.** Verify before relying on it.
- **Heroicons casing.** Some icon files have weird casing (e.g. `Squares2X2Icon.js` not `Squares2x2Icon.js`). Import path is case-sensitive.
- **AppState foreground re-lock.** Always route to lock screen on token expiry — don't trust component-level checks.
- **Sign-out wipes everything.** Half-clearing causes weird zombie states on next launch.
- **Version bump touches two files.** `app.config.js` AND `src/shared/constants/version.ts`.
- **Don't add `// removed` comments for deleted code.** Just delete.
- **Don't preserve backwards-compat shims.** Change the code outright.
- **Don't write multi-line docstrings or planning docs.** Work from conversation context, not intermediate files.
- **Don't add error handling for impossible states.** Validate at boundaries (user input, external APIs) only.
- **`find` from `.` not `/`.** Scanning the full filesystem exhausts resources.

---

## 23. Memory & session continuity

If your AI agent has persistent memory (e.g. Claude Code's `memory/` folder), use it for:

- **User preferences** — name, role, working style, deep expertise
- **Feedback patterns** — corrections AND validated approaches, with the *why*
- **Project context** — non-obvious motivation behind decisions, deadlines, stakeholders
- **References** — where things live in external systems (Linear, Slack channels, Grafana)

Don't use memory for:
- Code patterns / file paths / architecture (derive from the code)
- Git history (use `git log`)
- Debugging recipes (the fix is in the code; the why is in the commit)
- Anything already in `CLAUDE.md`
- Ephemeral task state

The `TRACKING.md` files do the heavy lifting for *project* continuity; memory does it for *user* continuity.

---

## 24. Handoff to your new agent

Open the new repo's root `CLAUDE.md` with:

> Read `DEVELOPMENT_PLAYBOOK.md` end-to-end before starting any feature. It is the authoritative source for:
> - Folder structure and the two/three-tier doc convention
> - Mock-first development with the `USE_MOCKS` flag
> - Theme system + RTL rules (apply from day one — retrofit is painful)
> - State management (Zustand per domain, TanStack Query for server state)
> - Auth gating + navigation patterns
> - Shared component library expectations
> - Commit conventions and verification workflow
>
> When spinning up a feature, follow §20 step by step. Spawn one agent per `src/features/<feature>/` and keep `TRACKING.md` updated as the source of progress. Never skip the `TRACKING.md` update on a commit — it is how the next session picks up the thread.

That's the handshake. The playbook is the manual.

---

# Appendices — Comprehensive Patterns Reference

The main sections above describe *how to work*. The appendices below
describe *every recurring pattern in the codebase* — copy any of these
into the new project as a starting point.

---

## Appendix A — Tailwind config & color tokens

Set up `tailwind.config.js` with brand tokens before writing any UI:

```js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066FF',
          50:  '#EAF1FF',
          100: '#D6E4FF',
          500: '#0066FF',
          700: '#0044CC',
          900: '#001A66',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          light: '#94A3B8',
          100: '#F1F5F9',
          200: '#E2E8F0',
        },
        bg: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          dark: { DEFAULT: '#0B1220', card: '#111827' },
        },
        border: '#E2E8F0',
        emerald: { 50: '#ECFDF5', 600: '#059669' },
        amber: { 50: '#FFFBEB', 600: '#D97706' },
        rose: { 50: '#FFF1F2', 600: '#E11D48' },
        danger: { DEFAULT: '#EF4444', 50: '#FEF2F2' },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(15, 23, 42, 0.04)',
        'primary-sm': '0 4px 8px rgba(0, 102, 255, 0.2)',
      },
    },
  },
};
```

**Mirror the Tailwind tokens in `src/shared/constants/colors.ts`.** That object is what `StyleSheet` reads — Tailwind classes and `StyleSheet` should produce identical visual output.

---

## Appendix B — Icon registry pattern

```tsx
// src/shared/components/Icon.tsx
import * as Outline from 'react-native-heroicons/outline';
import * as Solid from 'react-native-heroicons/solid';
import { type SvgProps } from 'react-native-svg';

const NAMES = {
  'arrow-back': Outline.ArrowLeftIcon,
  'arrow-right': Outline.ArrowRightIcon,
  'chev-r': Outline.ChevronRightIcon,
  'chev-l': Outline.ChevronLeftIcon,
  'chev-u': Outline.ChevronUpIcon,
  'chev-d': Outline.ChevronDownIcon,
  'home': Outline.HomeIcon,
  'home-solid': Solid.HomeIcon,
  'card': Outline.CreditCardIcon,
  'send': Outline.PaperAirplaneIcon,
  'bank': Outline.BuildingLibraryIcon,
  'check': Outline.CheckIcon,
  'check-circle': Outline.CheckCircleIcon,
  'x': Outline.XMarkIcon,
  'x-circle': Outline.XCircleIcon,
  'info': Outline.InformationCircleIcon,
  'sparkles': Outline.SparklesIcon,
  'sparkles-solid': Solid.SparklesIcon,
  'snow': Outline.NoSymbolIcon, // adapt
  'eye': Outline.EyeIcon,
  'eye-off': Outline.EyeSlashIcon,
  'plus': Outline.PlusIcon,
  // …add as you go
};

export type IconName = keyof typeof NAMES;

interface Props extends SvgProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function Icon({ name, size = 24, color, strokeWidth = 1.7, ...rest }: Props) {
  const Cmp = NAMES[name];
  if (!Cmp) return null;
  return <Cmp width={size} height={size} color={color} strokeWidth={strokeWidth} {...rest} />;
}
```

**Why a registry:** short names (`chev-r`) instead of long imports, type-safe (`IconName`), trivial to grep "is this icon used anywhere?", one place to swap icon library.

---

## Appendix C — Screen shell patterns

### `PageShell.tsx`

Standard screen wrapper: SafeArea + Nav + ScrollView. Forward the ScrollView ref so screens can scroll programmatically.

```tsx
import { forwardRef } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';

interface Props {
  title: string;
  onBack?: () => void;
  children: React.ReactNode;
  scroll?: boolean;
}

export default forwardRef<ScrollView, Props>(function PageShell({ title, onBack, children, scroll = true }, ref) {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <NavBar title={title} onBack={onBack} />
      {scroll ? (
        <ScrollView ref={ref} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
    </SafeAreaView>
  );
});
```

### `NavBar.tsx`

```tsx
export default function NavBar({ title, onBack, right }: Props) {
  return (
    <View className="flex-row items-center h-14 px-3 border-b border-border">
      {onBack && (
        <Pressable onPress={onBack} className="w-10 h-10 items-center justify-center rounded-full">
          <Icon name="arrow-back" size={22} color={Colors.text} />
        </Pressable>
      )}
      <Text className="flex-1 text-base font-semibold text-ink text-center">{title}</Text>
      <View className="w-10 h-10 items-center justify-center">{right}</View>
    </View>
  );
}
```

---

## Appendix D — Splash + bootstrap order

`app/_layout.tsx` orchestrates cold-start. Order matters:

```tsx
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { bootstrapTheme } from '@/shared/theme/bootstrap';
import { rehydrateAuth } from '@/shared/store/authStore';
import Toast from '@/shared/components/Toast';

SplashScreen.preventAutoHideAsync();

const qc = new QueryClient();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({ /* … */ });

  useEffect(() => {
    (async () => {
      await Promise.all([bootstrapTheme(), rehydrateAuth()]);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (ready && fontsLoaded) SplashScreen.hideAsync();
  }, [ready, fontsLoaded]);

  if (!ready || !fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={qc}>
        <ForegroundLockWatchdog />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="enroll" />
          <Stack.Screen name="(banking)" />
          <Stack.Screen name="(transfers)" />
        </Stack>
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
```

**Bootstrap order:**
1. Splash screen held visible
2. Fonts loading
3. Theme rehydrated → `Colors` mutated to active palette
4. Auth rehydrated → `isEnrolled`, `sessionUnlocked` set
5. Once both ready → splash hides → `<Stack>` renders → `index.tsx` redirects

**Why `<Toast>` is a sibling to `<Stack>`:** the Toast component uses `Modal` with `pointerEvents="box-none"` so it floats above every route + sheet without blocking touches.

---

## Appendix E — AuthSheet pattern for biometric-gated actions

For actions that need step-up auth (purchase a voucher, reveal card PAN, change PIN), use a shared `AuthSheet` that auto-fires Face ID and falls back to PIN.

```tsx
// src/shared/components/AuthSheet.tsx
export default function AuthSheet({ visible, onClose, onSuccess, reason }: Props) {
  const autoFire = useSettingsStore((s) => s.autoFireBiometric);
  const [phase, setPhase] = useState<'idle'|'bio'|'pin'>('idle');

  useEffect(() => {
    if (!visible) return;
    if (autoFire) {
      tryBiometric();
    } else {
      setPhase('idle');
    }
  }, [visible]);

  const tryBiometric = async () => {
    setPhase('bio');
    const r = await unlockWithBiometric(reason);
    if (r.ok) {
      onSuccess();
      onClose();
    } else if (r.reason === 'no-hardware' || r.reason === 'not-enrolled') {
      setPhase('pin');
    } else {
      setPhase('idle');
    }
  };

  // … render: pin pad when phase==='pin', loading when 'bio', CTA when 'idle'
}
```

**Toggle in settings:** `autoFireBiometric: boolean` so the user can disable auto-prompt. Persist in `settingsStore`.

---

## Appendix F — Send-flow architecture

Three screens: `amount` → `review` → `success`. State carried by a `sendStore` (Zustand, **not persisted** — session-only).

```ts
// src/features/payments/store/sendStore.ts
interface SendStore {
  draft: SendDraft | null;
  origin: string | null;  // where to return after Success
  setDraft: (d: SendDraft) => void;
  setOrigin: (path: string) => void;
  clear: () => void;
}
```

**Origin pattern:** every entry point that pushes `/send-amount` calls `setOrigin(pathname)` first. On Success "Done", `router.dismissAll()` + `router.push(origin)` collapses the modal stack and returns to the rail.

```ts
// Entry: dashboard favourites row
useSendStore.getState().setOrigin('/(tabs)');
router.push('/send-amount?payeeId=p1');

// Entry: /onepay-pay row
useSendStore.getState().setOrigin('/onepay-pay');
router.push('/send-amount?payeeId=…');

// Success "Done":
const origin = useSendStore.getState().origin ?? '/(tabs)';
router.dismissAll();
router.push(origin);
```

**Fee estimate:** call as user types amount. Show in Review.
```ts
const { data: fee } = useQuery({
  queryKey: ['fee-estimate', { method, amount, currency }],
  queryFn: () => api.estimateFee({ method, amount, currency }),
  enabled: amount > 0,
  staleTime: 60_000,
});
```

**SwipeToConfirm:** gesture-driven with track-fill animation, threshold 80%, theme-aware color. See Appendix P for the recipe.

---

## Appendix G — Multi-step checkout (subscriptions, vouchers, etc.)

Three-step pattern: `summary` → `paying` → `done`. State machine in the parent sheet.

```tsx
const [step, setStep] = useState<'summary'|'paying'|'done'>('summary');
const [receipt, setReceipt] = useState<Receipt | null>(null);

const handlePay = async () => {
  setStep('paying');
  await new Promise((r) => setTimeout(r, 1200));  // mock latency
  setReceipt({ reference: …, amountCharged: …, paidAt: … });
  setStep('done');
  toast.success(`Welcome to ${planName}`);
};

useEffect(() => {
  if (visible) {
    setStep('summary');
    setReceipt(null);
  }
}, [visible]);
```

**Render branches:**
- `summary` — picker(s), order total, Confirm CTA
- `paying` — spinner / branded loader
- `done` — receipt-style confirmation, Done button auto-closes sheet

---

## Appendix H — Camera flows (KYC, scan)

Two patterns: **scan** (one-shot) and **liveness** (multi-frame).

### Scan (QR, MRZ)
```tsx
import { CameraView, useCameraPermissions } from 'expo-camera';
// or react-native-vision-camera for advanced cases

<CameraView
  style={StyleSheet.absoluteFill}
  facing="back"
  onBarcodeScanned={({ data }) => onScan(data)}
  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
>
  <QROverlay />
</CameraView>
```

### Liveness (selfie + blink detection)
Use `react-native-vision-camera` + face-detector plugin. Track frames for:
- `leftEyeOpenProbability` / `rightEyeOpenProbability` — open→closed→open = blink
- `yawAngle` / `pitchAngle` — reject extreme profile
- Stability gate: 4-frame debounce before capture
- Stuck-tip rotation: after 12s, show contextual hint ("Try better lighting")
- Light haptic on lock + capture

### Emulator skip
```ts
import * as Device from 'expo-device';
if (!Device.isDevice) {
  // Route past camera stages on simulator
}
```

---

## Appendix I — Dashboard architecture

Common pattern for the home tab:

1. **Greeting + avatar** — personalised header
2. **Hero balance card** — primary account, eye toggle for hide/show
3. **Quick-action row** — Send / Request / Top-up / Pay-bill chips
4. **Favourite payees carousel** — horizontal scroll of avatars, tap to pre-fill send
5. **Spend chart** — 7 vertical bars, active bar uses 3 theme tones (gradient)
6. **Recent activity** — last 5 transactions, "See all" → `/transactions`
7. **Promotional / upsell strip** — subscriptions banner

**Hero hide-amounts:** read `usePrivacyStore.hideAmounts`. When true, render `•••••` instead of the amount.

**Spend chart with theme awareness:** subscribe to `themeVersion`, build SVG gradient ids with version baked in to defeat the cache:
```tsx
const ver = useThemeStore((s) => s.themeVersion);
<LinearGradient id={`bar-${ver}`} colors={[Colors.primary100, Colors.primary, Colors.primary700]} />
```

---

## Appendix J — Settings architecture

Three building blocks: `Section`, `SettingsRow`, `ToggleRow`. All in `src/features/settings/components/`.

### `Section.tsx`
```tsx
export default function Section({ title, children }: Props) {
  return (
    <View className="mb-4">
      <Text className="text-ink-muted text-xs font-semibold uppercase tracking-wide px-5 mb-2">{title}</Text>
      <View className="mx-4 rounded-2xl bg-bg-card border border-border overflow-hidden">{children}</View>
    </View>
  );
}
```

### `SettingsRow.tsx` — critical Switch-tap fix
```tsx
export default function SettingsRow({ icon, bg, fg, label, sub, right, onPress, last }: RowProps) {
  const rowStyle = [styles.row, !last && styles.rowDivider];
  const body = (
    <>
      <View style={[styles.iconTile, { backgroundColor: bg }]}>
        <Icon name={icon} size={18} color={fg} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        {sub && <Text style={styles.sub}>{sub}</Text>}
      </View>
      {right ?? <Icon name="chev-r" size={18} color={Colors.textMuted} />}
    </>
  );
  // Toggle rows (Switch in `right`, no onPress) render as a plain View
  // so the Switch's tap isn't swallowed by a parent Pressable.
  if (!onPress) return <View style={rowStyle}>{body}</View>;
  return <Pressable onPress={onPress} style={rowStyle}>{body}</Pressable>;
}
```

### `ToggleRow.tsx`
Convenience wrapper: `<SettingsRow right={<Switch value={…} onValueChange={…} />} />`.

### Persistence
Toggle values come from `useSettingsStore` (AsyncStorage), not local `useState`. Otherwise they reset on app restart.

```tsx
const txAlerts = useSettingsStore((s) => s.txAlerts);
const setTxAlerts = useSettingsStore((s) => s.setTxAlerts);

<ToggleRow
  label={t('transaction_alerts')}
  value={txAlerts}
  onValueChange={(next) => {
    setTxAlerts(next);
    toast.show(t(next ? 'toast_on' : 'toast_off', { label: t('transaction_alerts') }));
  }}
/>
```

---

## Appendix K — Card 3D flip + scale-dip + frozen overlay

```tsx
const rotate = useSharedValue(0); // 0 = front, 1 = back

const frontStyle = useAnimatedStyle(() => {
  const rotateY = interpolate(rotate.value, [0, 1], [0, 180]);
  const scale = interpolate(rotate.value, [0, 0.5, 1], [1, 0.92, 1]); // dip mid-flip
  return {
    transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }, { scale }],
    backfaceVisibility: 'hidden',
  };
});

const backStyle = useAnimatedStyle(() => {
  const rotateY = interpolate(rotate.value, [0, 1], [180, 360]);
  const scale = interpolate(rotate.value, [0, 0.5, 1], [1, 0.92, 1]);
  return {
    transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }, { scale }],
    backfaceVisibility: 'hidden',
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  };
});

const flip = () => {
  rotate.value = withTiming(rotate.value === 0 ? 1 : 0, { duration: 1600 });
};
```

### Frozen overlay
Keep the overlay always mounted; animate `opacity` + scale. Otherwise unfreeze doesn't animate (only freeze does).

```tsx
const wash = useSharedValue(card.frozen ? 1 : 0);
useEffect(() => {
  wash.value = withTiming(card.frozen ? 1 : 0, { duration: 360, easing: Easing.out(Easing.ease) });
}, [card.frozen]);

const washStyle = useAnimatedStyle(() => ({ opacity: wash.value }));
const badgeStyle = useAnimatedStyle(() => ({
  opacity: wash.value,
  transform: [{ scale: interpolate(wash.value, [0, 1], [0.8, 1]) }],
}));

return (
  <View>
    <CardArtwork />
    <Animated.View style={[StyleSheet.absoluteFill, washStyle, { backgroundColor: 'rgba(239,68,68,0.45)' }]} />
    <Animated.View style={[styles.frozenBadge, badgeStyle]}><Text>FROZEN</Text></Animated.View>
  </View>
);
```

---

## Appendix L — Bottom tab navigator

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import Icon from '@/shared/components/Icon';
import { Colors } from '@/shared/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 6 },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home',
        tabBarIcon: ({ focused, color }) => <Icon name={focused ? 'home-solid' : 'home'} size={22} color={color} />,
      }} />
      <Tabs.Screen name="payments" options={{
        title: 'Payments',
        tabBarIcon: ({ color }) => <Icon name="send" size={22} color={color} />,
      }} />
      {/* … */}
    </Tabs>
  );
}
```

**Tab-bar height:** read exact height via `useBottomTabBarHeight()` so screen content has correct bottom padding.

---

## Appendix M — Date grouping + SectionList

```ts
function groupByDate<T extends { date: string }>(items: T[]) {
  const groups = new Map<string, T[]>();
  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);

  for (const it of items) {
    const d = new Date(it.date);
    let label: string;
    if (isSameDay(d, today)) label = 'Today';
    else if (isSameDay(d, yesterday)) label = 'Yesterday';
    else label = format(d, 'd MMM yyyy');

    const arr = groups.get(label) ?? [];
    arr.push(it);
    groups.set(label, arr);
  }
  return Array.from(groups.entries()).map(([title, data]) => ({ title, data }));
}
```

```tsx
<SectionList
  sections={grouped}
  renderSectionHeader={({ section }) => <DateGroupHeader label={section.title} />}
  renderItem={({ item }) => <Row item={item} />}
  keyExtractor={(item) => item.id}
  ItemSeparatorComponent={() => <View className="h-px bg-border ms-16" />}
/>
```

---

## Appendix N — Infinite scroll + pull-to-refresh

```ts
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } = useInfiniteQuery({
  queryKey: ['transactions', { accountId, filter }],
  queryFn: ({ pageParam = 1 }) => api.getTransactions({ page: pageParam, limit: 20, accountId, filter }),
  getNextPageParam: (last) => (last.meta.hasMore ? last.meta.page + 1 : undefined),
});
```

```tsx
<SectionList
  sections={grouped}
  onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
  onEndReachedThreshold={0.5}
  refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />}
  ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={Colors.primary} /> : null}
/>
```

---

## Appendix O — Pressable patterns

### State-based press feedback (always works)
```tsx
const [pressed, setPressed] = useState(false);
<Pressable
  onPressIn={() => setPressed(true)}
  onPressOut={() => setPressed(false)}
  onPress={handle}
  style={[styles.btn, pressed && styles.btnPressed]}
>
  <Text>Tap me</Text>
</Pressable>
```

### Function-form (broken in some RN versions — don't use)
```tsx
// AVOID — silent bugs in some versions
<Pressable>{({ pressed }) => (<View style={[styles.btn, pressed && styles.btnPressed]}>…</View>)}</Pressable>
```

### Pressable wrapping a Switch
**Don't.** The Pressable swallows the Switch's tap. Render the row as a `View` when there's no `onPress`:
```tsx
if (!onPress) return <View style={rowStyle}>{body}</View>;
return <Pressable onPress={onPress} style={rowStyle}>{body}</Pressable>;
```

---

## Appendix P — Reanimated recipes

### Pulsing badge
```tsx
const pulse = useSharedValue(1);
useEffect(() => {
  pulse.value = withRepeat(
    withSequence(withTiming(1.06, { duration: 700 }), withTiming(1, { duration: 700 })),
    -1, false
  );
}, []);
const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
```

### Drawn-in checkmark (SVG)
```tsx
const progress = useSharedValue(0);
useEffect(() => { progress.value = withTiming(1, { duration: 600 }); }, []);
const animProps = useAnimatedProps(() => ({
  strokeDashoffset: PATH_LENGTH * (1 - progress.value),
}));
return <AnimatedPath d={CHECK_PATH} strokeDasharray={PATH_LENGTH} animatedProps={animProps} />;
```

### Swipe-to-confirm with track-fill
```tsx
const tx = useSharedValue(0);
const trackWidth = useSharedValue(0);

const pan = Gesture.Pan()
  .onUpdate((e) => {
    tx.value = Math.max(0, Math.min(e.translationX, trackWidth.value - THUMB));
  })
  .onEnd(() => {
    const progress = tx.value / (trackWidth.value - THUMB);
    if (progress >= 0.8) {
      tx.value = withSpring(trackWidth.value - THUMB);
      runOnJS(onConfirm)();
    } else {
      tx.value = withSpring(0);
    }
  });

const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));
const fillStyle = useAnimatedStyle(() => ({ width: tx.value + THUMB }));
```

### Equalizer bars (loading)
```tsx
const a = useSharedValue(0.4);
// … same for b, c
useEffect(() => {
  const loop = (sv, delay) => {
    sv.value = withDelay(delay, withRepeat(
      withSequence(withTiming(1, { duration: 380 }), withTiming(0.35, { duration: 380 })),
      -1, false
    ));
  };
  loop(a, 0); loop(b, 130); loop(c, 260);
}, []);
```

---

## Appendix Q — Worklet pitfalls

- `useAnimatedStyle` / `useAnimatedProps` callbacks **run on UI thread**. They can't access JS state directly — read shared values.
- Bridge back to JS via `runOnJS(fn)(args)`.
- `console.log` from a worklet works but goes to a separate logger.
- Don't allocate objects on the UI thread if you can help it — reuse shared values.
- If you need a JS value inside a worklet, capture it via `useDerivedValue` or pass it as a shared value.

---

## Appendix R — Error handling at API boundary

Single `call<T>` helper per feature API:

```ts
async function call<T>(path: string, init?: RequestInit & { bearer?: string }): Promise<T> {
  const { bearer, headers, ...rest } = init ?? {};
  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...headers,
    },
  });
  if (!res.ok) {
    let body: any = {};
    try { body = await res.json(); } catch {}
    const err: ApiError = {
      code: body.code ?? body.reasonCode ?? `HTTP_${res.status}`,
      status: res.status,
      detail: body.detail,
    };
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
```

Catch at the mutation level and toast a friendly message — never let raw API errors hit the UI.

---

## Appendix S — Refresh token interceptor

```ts
// src/features/login/lib/ensureFreshAccessToken.ts
let refreshing: Promise<void> | null = null;

export async function ensureFreshAccessToken() {
  const s = useAuthStore.getState();
  if (!s.isTokenExpired()) return;
  if (!refreshing) {
    refreshing = (async () => {
      const refresh = await SecureStore.getItemAsync('app-refresh-token');
      if (!refresh) {
        s.setSessionUnlocked(false);
        throw new Error('NO_REFRESH_TOKEN');
      }
      const tokens = await refreshTokens(refresh);
      s.setTokens(tokens);
    })().finally(() => { refreshing = null; });
  }
  await refreshing;
}
```

Call before every authenticated request. Concurrent calls share the same refresh promise.

---

## Appendix T — Backend integration notes

If you have architecture docs (services, contracts), link them from the feature `CLAUDE.md`. Treat them as the source of truth for endpoints and error codes.

For OAuth/OpenIddict-style flows:
- Refresh-token grant: `grant_type=refresh_token` + `client_id`
- Custom grants (e.g. `pin_verified`): document the contract in the feature `CLAUDE.md`
- Mobile is a **public client** — no client secret
- Don't bake API keys into the bundle

---

## Appendix U — Theme palette registry

```ts
// src/shared/theme/themes.ts
export type ThemeId = 'default' | 'sapphire' | 'onyx' | 'cobalt' | 'ember' | 'horizon' | 'aurora' | 'pearl';

export interface AppTheme {
  id: ThemeId;
  name: string;
  description: string;
  preview: [string, string, string];  // 3 hex chips for the picker swatch
  tokens: Partial<typeof Colors>;
  cardTones: [string, string, string];  // gradient stops for spend-chart active bar
}

export const THEMES: AppTheme[] = [
  {
    id: 'default',
    name: 'Nova',
    description: 'The original — calm and clean.',
    preview: ['#0066FF', '#5B8DEF', '#A8C5FF'],
    tokens: { primary: '#0066FF', primary50: '#EAF1FF', primary700: '#0044CC', /*…*/ },
    cardTones: ['#A8C5FF', '#5B8DEF', '#0066FF'],
  },
  // … 7 more
];

export function resolveThemeTokens(theme: AppTheme): Partial<typeof Colors> {
  return theme.tokens;
}
```

Document every theme in the settings feature `CLAUDE.md`.

---

## Appendix V — Hooks naming

| Pattern | Example | What it does |
|---|---|---|
| `useFoo` | `useAccounts` | List query (TanStack) |
| `useFoo(id)` | `useAccount(id)` | Single-item query |
| `useFooByX` | `useAccountByIban` | Filtered query |
| `useAddFoo` | `useAddPayee` | Mutation (POST) |
| `useUpdateFoo` | `useUpdatePayee` | Mutation (PATCH) |
| `useDeleteFoo` | `useDeletePayee` | Mutation (DELETE) |
| `useFooStore` | `useAuthStore` | Zustand store hook |
| `useFooSheet` | `useThemeSheet` | UI-state hook for a sheet (open/close) |
| `useDoXOnY` | `useDismissKeyboardOnBlur` | Lifecycle helper |

Group hooks under `src/features/<feature>/hooks/`.

---

## Appendix W — Payments / Transactions / Accounts triangle

These three features are tightly coupled. Spec them together at project kickoff.

- **Accounts** owns balance + transactions-for-this-account query.
- **Transactions** owns the global transaction list + detail screen.
- **Payments** owns send flow, fee estimate, payee rails.

Cross-feature touches:
- Dashboard reads accounts + transactions
- Send-Success invalidates accounts + transactions
- Transaction-Detail "Repeat" pushes Payments draft + sets origin
- Payee-Detail activity tab reads transactions filtered by payee

Document all shared keys in each feature's `CLAUDE.md`.

---

## Appendix X — iOS-specific gotchas

- **Native stack** (`react-native-screens`) covers JS siblings. Floating overlays must use `Modal`.
- **Keyboard sticks across stack transitions.** Use `useDismissKeyboardOnBlur` hook.
- **SafeAreaView vs SafeAreaProvider:** wrap root in `<SafeAreaProvider>`, use `useSafeAreaInsets()` for custom calculations, `<SafeAreaView>` for simple cases.
- **iOS 16+ device integrity check.** Internal builds need device UDID in provisioning profile. See §19.
- **TextContentType auto-fill:** `oneTimeCode` for OTP, `password` for PIN inputs (gives the "from keychain" prompt).

---

## Appendix Y — Android-specific gotchas

- **Hardware back button:** wired into Expo Router automatically. Override per-screen with `BackHandler`.
- **Status bar:** translucent by default. Set explicitly per screen via `<StatusBar barStyle={…} backgroundColor={…} />`.
- **SMS OTP auto-fill:** `autoComplete="sms-otp"` + register the app hash. Falls back to manual entry.
- **Edge-to-edge:** Android 15+ enforces. Use `react-native-edge-to-edge` and `useSafeAreaInsets()`.

---

## Appendix Z — Final checklist for the new project

Day-one setup, in order:

- [ ] `npx create-expo-app` (or fork this project)
- [ ] Set up `tailwind.config.js` with brand tokens
- [ ] Set up `src/shared/constants/colors.ts` mirroring tokens
- [ ] Set up `src/i18n/` with EN + your second language
- [ ] Set up `src/shared/store/themeStore.ts` with persist + bootstrap
- [ ] Set up `src/shared/store/authStore.ts` with SecureStore
- [ ] Build `src/shared/components/{Icon, Button, Card, BottomSheet, LoadingOverlay, Toast}.tsx`
- [ ] Set up `app/_layout.tsx` with the bootstrap order from Appendix D
- [ ] Set up `app/index.tsx` boot redirect (Appendix § §9)
- [ ] Add `.env.example` + `app.config.js` `extra.useMocks` wiring
- [ ] Write the root `CLAUDE.md` referencing this playbook
- [ ] First feature: pick a small one (Settings) to validate the conventions
- [ ] Set up EAS Build profiles in `eas.json` (preview + production)
- [ ] Push first build → register devices (§19)

After this, every new feature follows §20 step by step. Update `TRACKING.md` after every commit. That's the rhythm.

---

*End of playbook.*

