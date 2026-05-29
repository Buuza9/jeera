# TRACKING.md — `enrollment`

**Status legend:** ✅ Live · 🟡 Partial / WIP · ⏳ Pending · 🔌 Blocked on backend

| Item | Status | Notes |
|---|---|---|
| Form screen | ✅ | Appbar, 5 fields (name, +218 phone, national ID, license, plate), Documents divider, 2 upload tiles, sticky Submit (enabled when complete). Verified on iOS sim. |
| Upload tiles | 🟡 | `UploadTile.tsx` — dashed→solid brand on "done". Mock toggle; real picker (expo-image-picker + Supabase Storage) is TODO. |
| Pending screen | ✅ | Clock icon, title, sub, amber ETA badge, summary card (masked ID), Back to home. Verified on sim. |
| `enrollmentStore` | ✅ | Zustand + persist via AsyncStorage (`djera.enrollment`): `application`, `status`, `setSubmitted`, `reset`. |
| Mock submit (`data.ts`) | ✅ | `submitEnrollment` gated by `USE_MOCKS`; `maskId` helper. |
| Live submit (Supabase) | 🔌 | Stubbed — throws until backend wired. |
| Approval-status branch (§2.2) | 🟡 | `status` set to `pending` on submit. Consumed by auth/boot gate later (approved→dashboard, suspended→commission/suspended). |
| Document expiry / re-upload UX | ⏳ | Client-blocked (§5). |
| AR/RTL + dark visual pass | ⏳ | Strings translated; needs a screenshot pass. |

## Shared primitive introduced

`Appbar` (`src/shared/components/Appbar.tsx`) — round back button + display title, RTL chevron flip. Reused across D2–D4. Plus `asyncStorage` Zustand adapter (`src/shared/store/asyncStorage.ts`).
