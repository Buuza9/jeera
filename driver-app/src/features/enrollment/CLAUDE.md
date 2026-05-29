# CLAUDE.md — `enrollment` feature

First-time driver KYC registration. Ported from `driver-prototype/enrollment`.

## Flow

Welcome → "Get started" → `/enrollment` (form) → submit → `/enrollment/pending`.

- **Form** — full name, phone (+218 prefix, `9X XXX XXXX`), national ID, license number,
  vehicle plate, then two document upload tiles (ID photo, license photo). Submit
  enables only when all five fields are filled and both docs are "uploaded".
- **Pending** — confirmation state: clock icon, "Application submitted", ETA badge,
  a read-back summary card (national ID masked), Back to home.

## Files

- `EnrollmentScreen.tsx` · `PendingScreen.tsx` · `UploadTile.tsx`
- `store.ts` — `useEnrollmentStore` (Zustand + persist via AsyncStorage, key `djera.enrollment`): `application`, `status` (`none`/`pending`/`approved`/`suspended`), `setSubmitted`, `reset`.
- `data.ts` — `submitEnrollment` (mock-gated by `USE_MOCKS`) + `maskId`.
- Routes in `src/app/enrollment/`. Copy in `src/i18n/locales/*` under `enr.*` (+ `prof.docs`).

## Prototype reference

[`../../../../driver-prototype/enrollment/`](../../../../driver-prototype/enrollment/) — `index.html`, `pending.html`.

## Notes / TODO

- **Document upload is mocked** — tapping a tile toggles a "done" state. Real impl
  wires `expo-image-picker` + Supabase Storage upload.
- `status` feeds the §2.2 approval-status branch (auth post-verify): pending →
  this pending screen, approved → dashboard, suspended → commission/suspended.
- Document expiry / re-upload UX is client-blocked (§5).
- Live submit (Supabase) stubbed — flip `EXPO_PUBLIC_USE_MOCKS=false` once wired.
