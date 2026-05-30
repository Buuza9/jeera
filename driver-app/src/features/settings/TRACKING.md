# TRACKING — `settings` feature (D4)

Standalone settings: appearance, notifications, security, privacy. Reached from Profile.

## Status: ✅ built (mock-first), translated 1:1 from the prototype

Mirrors [`../../../../driver-prototype/settings/`](../../../../driver-prototype/settings/) (`index.html`).

## Files

- `SettingsScreen.tsx` (`/settings`, root stack over the tabs): Appearance (Language EN/عربي + Theme Light/Dark — **functional**), Notifications (3 toggles), Security (PIN + biometric toggles + §5 TODO chip), Privacy (privacy & terms · help & support · Sign out), version footer.
- `store.ts`: `useSettingsStore` — notification/security toggles persisted via AsyncStorage.
- i18n: `stg.*` block (NOT `set.*` — that namespace is owned by commission's Settle screen).

## Behaviour

- **Language** → `useLang().setLang` (persisted; AR flips RTL on reload). **Theme** → `useTheme().setPreference` (persisted). Both segmented controls reflect the live value.
- Notification/security toggles persist to AsyncStorage. Security toggles store intent only — no real PIN/biometric wiring yet (§5).
- Sign out → `authStore.signOut()` → `/auth`. Privacy & terms / Help & support are inert until those features land.
- Uses the inline `<Pressable>` + inner-`<View>` segmented pattern (no `shadow-sm` toggle) to avoid the NativeWind component-swap crash.

## Future enhancements

- Wire `expo-local-authentication` + a real PIN flow for the security toggles (§5).
- Point Privacy & terms / Help & support at real screens (support feature) once built.
- Persist notification prefs to the backend (push topic subscriptions).
