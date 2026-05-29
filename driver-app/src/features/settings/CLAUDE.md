# CLAUDE.md — `settings` feature (D4)

Standalone settings: appearance, notifications, security, privacy. Reached from Profile.

## Scope

- Appbar.
- **Appearance**: Language (EN / عربي) + Theme (Light / Dark) segmented — **functional**, wired to `useLang().setLang` and `useTheme().setPreference` (already persisted).
- **Notifications**: toggle switches (trip requests · earnings · promotions).
- **Security**: App lock (PIN) + biometric toggles + §5 TODO chip.
- **Privacy**: privacy & terms · help & support (→ support) · sign out (→ auth).

## Prototype reference

[`../../../../driver-prototype/settings/`](../../../../driver-prototype/settings/) — `index.html`.

## Planned files

`SettingsScreen.tsx`, `Switch.tsx` (or RN `Switch` styled), `settingsStore.ts` (notification prefs, persisted via AsyncStorage), route `src/app/settings.tsx`.

## Depends on

- `useTheme` + `useLang` (live). The Language/Theme controls reuse the existing providers — no new persistence needed.

## Notes / TODO

- §5 PIN / biometric session-lock scope is client-blocked — TODO chip + wire `expo-local-authentication` later.
