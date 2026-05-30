# TRACKING.md — `auth`

**Status legend:** ✅ Live · 🟡 Partial / WIP · ⏳ Pending · 🔌 Blocked on backend

| Item | Status | Notes |
|---|---|---|
| Sign-in screen | ✅ | Brand header, Phone/Email tabs, validation, Send code, register link, TODO chip. Verified on iOS sim. |
| Field primitive | ✅ | `src/shared/components/Field.tsx` — label, error, prefix, true vertical centering (fixed-height row + justify-center wrapper). |
| Phone input | ✅ | +218 prefix with Libya flag, `9X XXX XXXX` auto-format, 9-digit validation. |
| Email input | ✅ | Email validation. The functional OTP path per locked stack. |
| OTP screen | ✅ | 6-box entry (auto-advance, backspace, paste, LTR), demo hint, Verify, resend 30s countdown, change-method, verifying overlay. Boxes 12px radius. Verified on sim. |
| Loading screen | ✅ | Post-verify loading page (ported from prototype `ScreenLoading`): spinning route-arc + pulsing dart (SVG + Reanimated), label/sub, shimmer dots; auto-advances → dashboard (~1.7s). Shown in place of the success screen before the dashboard. |
| Success screen | ✅ | Animated check ring (Reanimated), verified identifier, 3s auto-redirect + CTA → dashboard. Kept but no longer in the flow (OTP → loading → dashboard); route `/auth/success` retained. |
| `authStore` | ✅ | Zustand + persist via expo-secure-store (`djera.auth`). `session`, `hydrated`, `signIn`, `signOut`. |
| Mock OTP (`data.ts`) | ✅ | `requestOtp`/`verifyOtp` gated by `USE_MOCKS`; code `123456`. |
| Live OTP (Supabase email) | 🔌 | Stubbed — throws until backend wired. Flip `EXPO_PUBLIC_USE_MOCKS=false`. |
| SMS / phone OTP | ⏳ | Deferred per locked stack. |
| Approval-status branch (§2.2) | ⏳ | Always → dashboard for now. TODO chip surfaces it. |
| PIN / biometric lock (§5) | ⏳ | Client-blocked. TODO chip surfaces it. |
| AR/RTL + dark visual pass | ⏳ | Strings translated; OTP boxes forced LTR. Needs a screenshot pass. |

## Native deps added

`expo-secure-store` (session persistence), `zustand` (store). Required a native rebuild to link secure-store.
