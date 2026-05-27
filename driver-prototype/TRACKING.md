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
| `_shared/frame.js` | ✅ | Injects status bar (9:41 + signal/wifi/battery SVGs) and home indicator into every `.phone`. Also computes `--phone-scale` from `innerWidth/innerHeight` so the frame auto-fits any viewport. |
| `_shared/map.js` | ✅ | **Real maps + live navigation.** Lazy-loads Leaflet 1.9.4 from CDN with a free CARTO Voyager (light) / dark_all (dark) tile layer over OSM — no API key, no billing. Exposes `JeeraMap.create(elId, {center,zoom,onReady})`, `pin(L, latlng, kind, {label,pulse})` (driver GPS-chevron · rider · dest), `route(L, waypoints)` (brand-green polyline that draws on screen via `stroke-dashoffset`), shared Tripoli coords (`andalus`, `gargaresh`, `souqJuma`, `oldCity`, `center`), and **`animateAlong(marker, waypoints, {durationMs, map})`** — drives the marker along the polyline via `requestAnimationFrame`, rotates the icon to face direction of travel using `JeeraMap.bearing(from, to)`, and gently `panTo`s the map to keep the driver in view. Theme observer reswaps tiles when the user toggles light/dark. |
| `_shared/navbar.js` | ✅ | **Bottom tab bar**, injected into every `.phone` like `frame.js`. Four tabs — Home (`dashboard/`) · Trips (`trip-history/`) · Earnings (`earnings/`) · Profile (`profile/`). Active tab read from `<body data-nav="…">`; labels via i18n (`nav.*`, EN/AR). Adds `.has-navbar` to `<html>` so `.screen` reserves bottom room (`padding-bottom:96px`). Sits at `z-index:25`, above the map but below the status bar. |
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
| `dashboard/` | `index.html` | ✅ | §2.3 | **Full-bleed map home** (real ride-hailing pattern). Leaflet+OSM map of Tripoli fills the whole phone (`map-fill`, `isolation:isolate` so Leaflet panes stay below the status bar); driver GPS-chevron pin centred, gains a pulse ring when online. Floating overlays: notifications bell top-start; **single status pill top-centre** (Offline by default; tapping animates it to Online — the label slides up and the pill morphs grey → green with a pulsing live-dot, also pulses the driver pin, and mocks an incoming request 3.5s later → `ride-requests/`). Profile is reached via the navbar (no avatar button on the map); bottom **dock** with two cells — today's earnings (→ `earnings/`) and outstanding commission §2.10 (→ `commission/`). **Bottom tab bar** via `_shared/navbar.js` (Home active). Currency = `LYD / د.ل`. |
| `ride-requests/` | `index.html` (modal over dashboard) | ✅ | §2.4 | **Real Leaflet+OSM Tripoli map** dimmed behind the sheet via a top-to-bottom dim gradient. Driver pin near pickup + rider pin (label "Pickup") at Hai al-Andalus + dest pin (label "Drop-off") at Gargaresh + animated route polyline. Animated incoming-request notice pill (top). Bottom sheet (rounded top, slide-up animation) carrying title + auto-decline countdown **ring** (15s placeholder, ring turns amber ≤7s, red ≤3s; auto-routes back to dashboard at 0). Pickup/destination route card with brand-green pickup dot + red destination dot + connecting track. Metrics row: To rider (km) · Trip distance (km) · Fare (LYD, highlighted). Reject (→ dashboard) and Accept (→ active-trip/to-pickup) actions. Visible TODO §5 chip for the actual timer value. |
| `active-trip/` | `to-pickup.html`, `in-trip.html`, `complete.html` | ✅ | §2.5 – §2.7 | **to-pickup**: real Leaflet+OSM Tripoli map; driver GPS-chevron pin (pulsing) **animates along the route** (12s, matched to the 800m→0 countdown) toward the rider at Hai al-Andalus, rotates to face direction of travel, map gently `panTo`s to follow. Top metrics strip (remaining m + ETA min), bottom sheet with brand-green stage banner ("Heading to pickup / في الطريق إلى الراكب"), rider card (avatar `KA`, name, pickup address), Call + Arrived actions. Arrived enables when remaining drops below ~120 m (§2.5 "becomes enabled at/near pickup"); on tap → `in-trip.html`. **in-trip**: same Leaflet shell, driver pin animates Hai al-Andalus → Gargaresh (13s, matched to the 5.2km→0 km countdown), map follows; destination + fare card (LYD), single primary "End trip / إنهاء الرحلة" → `complete.html`. **complete**: animated check ring (matches `auth/success.html`), title "Trip completed / تم إنهاء الرحلة" + "Safe trip! / رحلة موفقة!", prominent fare-due card (25 LYD + Cash/نقدًا pill), Distance + Duration meta row, commission accrual note (§2.10 — 15% placeholder, see TODO §5 chip), primary "Confirm cash received / تأكيد استلام النقود" + secondary "Back to home" both → `dashboard/`. |

### Phase D3
| Folder | Screens | Status | Spec | Notes |
|---|---|---|---|---|
| `trip-history/` | `index.html`, `detail.html` | ✅ | §2.8 | **List:** Back-chevron header + title "Trip history / سجل الرحلات". Stats strip (Trips today · Earnings LYD · Hours). **Search bar** filters cards live across rider name + origin + destination. **Filter chips** (All / Today / Yesterday) compose with search — both feed a single `applyView()`. Empty-state row appears when no cards match. Day-grouped sections ("Today" / "Yesterday") with per-day count + total. Trip cards (tap → `detail.html?id=N`) show route, time, distance, rider chip, fare. **Cancelled variant** with red "Cancelled / ملغاة" badge, strikethrough fare, and reason ("Rider no-show after 5 min wait"); not clickable. Realistic Tripoli mock data: Hai al-Andalus ↔ Gargaresh, Souq al-Juma, Old City, MJI airport, Dahra ↔ Janzour. **Detail:** Floating back button + "Completed" status pill over a real Leaflet map of the trip's route (pickup pin + drop-off pin + drawn polyline, framed via `fitBounds`). Bottom sheet with date/time, full route card, Distance + Duration pair, **fare breakdown** (trip fare · −15% Jeera commission · Net to you), rider row with mock rating, **vertical trip timeline** (Request accepted · Arrived at pickup · Trip started · Trip ended — timestamps computed from `time` + `min`), support link → `support/`. Data driven by `?id=` query, sourced from a `TRIPS` map. List view carries the bottom navbar (Trips tab active); `detail.html` does not (sub-page). |
| `earnings/` | `index.html` | ✅ | §2.8 / §3 | Back-chevron header → dashboard. **Segmented period tabs** (Today / This week / This month) drive a single `render(period)` that swaps every figure live. Brand-gradient **hero** = net earnings + delta-vs-previous pill. **Mini bar chart** (CSS bars, animated height) — hourly for Today, 7 daily bars (Sat→Fri Libya week) for week, 4 weekly bars for month; current bucket highlighted. **Stats grid** (2×2): Trips · Cash collected (LYD) · Online hours · Commission −15% (amber). **Breakdown list** below — per-trip rows for Today (place→place · time · km · fare), per-day rows for week, per-week rows for month. All copy via `data-i18n`; dynamic strings (delta, chart caption, breakdown title, day names, places) swap on language flip; `unit.trips` meta re-applied via wrapped `setLang`. Visible TODO §5 chip for commission rate. Carries the bottom navbar (Earnings tab active). |
| `commission/` | `index.html` (balance), `settle.html` (channel picker), `history.html` (past settlements), `suspended.html` (overdue state) | ✅ | §2.10 | **index**: amber balance hero (outstanding 48 LYD + cap progress bar 48/200), settlement-info card (rate 15% · next due "Sunday · in 4 days" · auto-suspend policy), recent-accruals list (per-trip `+fare×15%`), sticky "Settle now" + "View settlement history". **settle**: amount block with Full/Partial segmented control (partial input clamps to outstanding), channel picker (Bank transfer · In-person drop-off · Mobile money — radio select), Confirm → animated success overlay with reference number → history. **history**: summary strip (settled this month · all-time), month-grouped settlement cards (channel icon · amount · date · `JRA-` reference · green "Paid" badge). **suspended**: blocking danger state — red warning icon, "Account suspended" badge, balance-to-clear card (215 LYD, "exceeds 200 LYD cap"), 3-step reactivation guide, "Settle now to reactivate" → settle, contact-support link. Visible TODO §5 chips for commission rate / cap / channels / grace period. |

### Phase D4
| Folder | Screens | Status | Spec | Notes |
|---|---|---|---|---|
| `ratings/` | `index.html` (own rating), `rate-rider.html` (post-trip modal) | ⏳ | §3 | |
| `profile/` | `index.html` | ✅ | §3 | **Profile + settings merged** (the navbar's Profile tab). Identity hero (avatar `AM`, name, "Jeera driver · Tripoli", 4.9★ · trips). Quick stats (total trips · acceptance % · tenure). **Vehicle** card (model · plate). **Documents** list with green Verified badges + expiry dates (license · national ID · vehicle reg) + TODO §5 doc-expiry chip. **Settings** group — Language (EN/عربي segmented, drives `I18N.setLang`) · Appearance (Light/Dark segmented, drives `I18N.setTheme`) · Notifications toggle · Security & PIN. **More** group — Help & support (→ `support/`) · Privacy & terms · Sign out (→ `auth/`). Carries the bottom navbar (Profile active). |
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
