# CLAUDE.md — `auth` feature

Returning-user sign-in: identifier → OTP → signed-in. Ported from `driver-prototype/auth`.

## Flow

`/auth` (sign-in) → `/auth/otp` (verify) → `/auth/success` → `/dashboard`.

- **Sign-in** — Phone/Email method tabs, validation, "Send code". Per the locked
  stack, **email OTP is the real path** (Supabase); SMS/phone is deferred. In
  mock mode both methods proceed so the flow is demoable.
- **OTP** — 6-box code entry (auto-advance, backspace, paste, always LTR),
  resend 30s countdown, change-method link, verifying overlay. Mock code `123456`.
- **Success** — animated check ring, verified identifier, 3s auto-redirect + CTA.

## Files

- `SignInScreen.tsx` · `OtpScreen.tsx` (+ `OtpInput.tsx`) · `SuccessScreen.tsx`
- `store.ts` — `useAuthStore` (Zustand + `persist` via secure-store, key `djera.auth`). Holds `session`, `hydrated`; `signIn`/`signOut`.
- `data.ts` — `requestOtp` / `verifyOtp`. Mock-gated by `USE_MOCKS`; real path = Supabase email OTP (TODO).
- Routes in `src/app/auth/`. Copy in `src/i18n/locales/*` under `auth.*`, `otp.*`, `ok.*`.

## Prototype reference

[`../../../../driver-prototype/auth/`](../../../../driver-prototype/auth/) — `index.html`, `otp.html`, `success.html`.

## TODO (client-blocked)

- §5 PIN / biometric session-lock scope (chip on sign-in).
- §2.2 post-verify approval-status branch: approved → dashboard, pending → enrollment/pending, suspended → commission/suspended (chip on OTP). Currently always → dashboard.
- Wire Supabase email OTP + flip `EXPO_PUBLIC_USE_MOCKS=false`.
