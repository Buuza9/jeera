# TRACKING — `profile` feature (D4)

Driver profile — identity, vehicle, documents, and links into settings/support. The navbar's Profile tab.

## Status: ✅ built (mock-first), translated 1:1 from the prototype

Mirrors [`../../../../driver-prototype/profile/`](../../../../driver-prototype/profile/) (`index.html`).

## Files

- `ProfileScreen.tsx` (`/profile`, tab): identity hero (avatar · name · phone · rating ★ · trips), vehicle card, documents (Verified / Renew badges + doc-expiry TODO chip), links list (rating · language & theme · notifications · PIN · help & support), Sign out (calls `authStore.signOut()` → `/auth`). Appbar gear → `/settings`.
- `data.ts`: mock `DRIVER`, `DOCS`, `LINKS`.
- i18n: `prof.*` expanded in `en.json` / `ar.json`.

## Behaviour

- Back chevron → `/dashboard` tab; gear + "Language & theme"/Notifications/PIN links → `/settings`.
- "Your rating" and "Help & support" links are inert until the ratings / support features land.
- Sign out clears the auth session and replaces to `/auth`.

## Future enhancements

- Source profile/vehicle/docs from `driverStore` / Supabase instead of mock `DRIVER`.
- Wire "Your rating" → ratings, "Help & support" → support once built.
- §5 document expiry / re-upload UX (TODO chip).
