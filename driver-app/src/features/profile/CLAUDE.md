# CLAUDE.md — `profile` feature (D4)

Driver profile — identity, stats, vehicle, document status, and links into settings/support. The navbar's Profile tab.

## Scope

- Identity hero: avatar, name, "Djera driver · Tripoli", rating ★ · trips.
- Quick stats: total trips · acceptance % · tenure.
- **Vehicle** card (model · plate).
- **Documents** list with Verified badges + expiry dates (license · national ID · vehicle reg) + doc-expiry TODO chip.
- Links: "Your rating" (→ ratings) · gear + "Language & theme" (→ settings) · Help & support (→ support) · Privacy & terms · Sign out (→ auth; calls `authStore.signOut()`).
- Bottom navbar (Profile active).

## Prototype reference

[`../../../../driver-prototype/profile/`](../../../../driver-prototype/profile/) — `index.html`.

## Planned files

`ProfileScreen.tsx`, `data.ts` (mock driver profile; later from `driverStore`/Supabase), route `src/app/profile.tsx`.

## Depends on

- Shared `Badge` + `Row` primitives (build as needed), `Navbar`.
- `authStore.signOut()` (exists).

## Notes / TODO

- §5 document expiry / re-upload UX is client-blocked — TODO chip.
