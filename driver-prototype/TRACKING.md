# TRACKING.md — Driver Prototype

Single source of truth for what's built in `driver-prototype/`. Update on every
commit that touches the prototype. Per `INSTRUCTIONS.MD` §7.

**Status legend:** ✅ Live · 🟡 Partial / WIP · ⏳ Pending · 📌 Stub · ❌ Dead

---

## Foundations

| Item | Status | Notes |
|---|---|---|
| `_shared/tokens.css` | ✅ | Brand (green/amber placeholders), neutrals, dark theme, radii, shadows. Swap palette here when client confirms. |
| Currency | ✅ | **LYD (د.ل)** — confirmed as the only supported currency. Every page uses the shared i18n key `unit.currency` (`LYD` in EN, `د.ل` in AR). |
| `_shared/app.css` | ✅ | iPhone 17 Pro Max frame (440 × 956), Dynamic Island, status-bar layout, home indicator, buttons, fields, upload, cards, badges. Logical properties → RTL-safe. |
| `_shared/i18n.js` | ✅ | `I18N.register` / `setLang` / `setTheme` / `apply`. EN/AR + light/dark, persisted to localStorage. |
| `_shared/frame.js` | ✅ | Injects status bar (9:41 + signal/wifi/battery SVGs) and home indicator into every `.phone`. |
| `_shared/toolbar.html` | 📌 | Reference snippet only — toolbar markup is currently inlined per page. |
| Root `index.html` | ✅ | Redirects to `welcome/`. No dev hub — navigation happens inside the phone. |

## Feature mockups

Order mirrors `driver-app/CLAUDE.md` §3 phases (D1 → D4). Spec source column
points to `driver-app/REQUIREMENTS.md` sections.

### Phase D1
| Folder | Screens | Status | Spec | Notes |
|---|---|---|---|---|
| `welcome/` | `index.html` | ✅ | (entry) | Brand mark, tagline, 3 feature rows, Get started → enrollment, secondary "I already have an account". |
| `enrollment/` | `index.html` (form), `pending.html` (post-submit) | ✅ | §2.2 | KYC form: full name, phone, national ID, license #, plate #, ID photo, license photo. Submit → pending-approval state with submitted checklist. |
| `auth/` | `index.html` (sign-in), `otp.html` (verify), `success.html` (signed-in) | ✅ | §2.1 | Sign-in: Phone\|Email method toggle, +218 phone field (LTR, auto-format `9X XXX XXXX`) or email, "Send code → otp.html". OTP: six LTR boxes with auto-advance + paste, mock code `123456`, shake-on-error, 30s resend countdown, change-method link, brief "Verifying…" overlay → success.html. Success: animated check ring, "You're signed in", masked identifier, "Continue to dashboard" CTA + 3s auto-redirect. Visible TODO chips: §5 PIN/biometric scope, §2.2 approval-status branching (approved → dashboard, pending → enrollment/pending.html, suspended → commission/suspended.html). |

### Phase D2
| Folder | Screens | Status | Spec | Notes |
|---|---|---|---|---|
| `dashboard/` | `index.html` | ✅ | §2.3 | **Map-first layout** (per Uber/Careem driver pattern). Compact header (avatar `AM` + name + "Jeera driver" + hamburger). Large `.map-placeholder` with faux street grid, driver pin (pulses when online), overlaid status pill (top-start) and today's-earnings chip (top-end, tap → trip-history). Online toggle row with iOS-style switch syncs the pill + pin + primary CTA + status line. Outstanding-commission card per §2.10 → links to `commission/`. Primary CTA mirrors the toggle (`Start ↔ Stop receiving requests`); secondary → `trip-history/`. Going online mocks an incoming request 3.5s later and routes to `ride-requests/`. Currency = `LYD / د.ل` via shared `unit.currency` i18n key. |
| `ride-requests/` | `index.html` (modal over dashboard) | ⏳ | §2.4 | Pickup/destination addresses, distances, fare, accept/reject, auto-decline countdown (timer value TBD §5). |
| `active-trip/` | `to-pickup.html`, `in-trip.html`, `complete.html` | ⏳ | §2.5 – §2.7 | Map placeholder div + metrics row + rider/destination card + primary CTA per step. Final step = "تأكيد استلام النقود". |

### Phase D3
| Folder | Screens | Status | Spec | Notes |
|---|---|---|---|---|
| `trip-history/` | `index.html` | ⏳ | §2.8 | Top stats strip (trips / earnings / hours) + scrollable trip cards. |
| `earnings/` | `index.html` | ⏳ | §3 | Daily / weekly / monthly tabs, totals, per-trip rows. |
| `commission/` | `index.html` (balance), `settle.html` (channel picker), `history.html` (past settlements), `suspended.html` (overdue state) | ⏳ | §2.10 | First-class revenue feature. Settlement channels list TBD §5. |

### Phase D4
| Folder | Screens | Status | Spec | Notes |
|---|---|---|---|---|
| `ratings/` | `index.html` (own rating), `rate-rider.html` (post-trip modal) | ⏳ | §3 | |
| `profile/` | `index.html` | ⏳ | §3 | Driver info, vehicle details, document status badges. |
| `settings/` | `index.html` | ⏳ | §3 | Theme, language (AR/EN), notifications, security, privacy. |
| `support/` | `index.html` | ⏳ | §3 | Help, FAQ accordion, contact, SOS button. |

## Open questions (from REQUIREMENTS §5)

These should appear as visible TODOs in the relevant mockup until the client confirms.

- ~~Currency display~~ — **resolved: LYD (د.ل) only.** Use shared `unit.currency` i18n key.
- Commission rate default. → affects `commission/index.html`.
- Settlement cap value. → affects `commission/index.html`.
- Approved settlement channels list. → affects `commission/settle.html`.
- Auto-decline timer on incoming request. → affects `ride-requests/index.html`.
- Document expiry / re-upload UX. → affects `enrollment/`, `profile/`.
- PIN / biometric session lock scope. → affects `enrollment/`, `auth/`, `settings/`.
- Offline-mid-trip behavior. → affects `active-trip/`.

## Conventions for the next agent

1. Copy the `welcome/` template: `<head>` includes `app.css` + `i18n.js` + `frame.js`; body wraps content in `.stage > .phone > .screen`; every string goes through `data-i18n` + `I18N.register`.
2. Never use `ml-/mr-/pl-/pr-` or `margin-left/right` — use logical properties (`margin-inline-start/end`, `padding-inline`).
3. Use inline SVGs for icons (no emoji). Heroicons paths are fine; match line-weight to existing icons.
4. No real maps — use a `.map-placeholder` div with a label.
5. Update this file on every commit. Mark a feature ✅ only when its screens match the REQUIREMENTS section and render correctly in EN + AR + light + dark.
