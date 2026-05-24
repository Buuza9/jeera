# ROADMAP — Jeera

Phased build plan across three product surfaces. Each surface follows the
playbook's documentation-first cycle: every feature is **specced** (`CLAUDE.md`)
and given a **tracking skeleton** (`TRACKING.md`) before any implementation.
Per-feature docs are the source of truth for scope; this file is the
sequencing plan.

Status legend: ✅ done · 🟡 in progress · ⏳ planned · 🔌 blocked on backend

> Path note: this file lives at the monorepo root. Each workspace mirrors the
> playbook's app layout internally. HTML prototypes for each surface live in
> their paired `*-prototype/` folder.

---

## Phase 0 — Documentation skeleton

| Item | Where | Status |
|---|---|---|
| Monorepo skeleton (6 folders) | repo root | ✅ |
| Root docs (README, CLAUDE.md, INSTRUCTIONS.MD, playbook, this file) | repo root | ✅ |
| Workspace CLAUDE.md stubs | `*-app/CLAUDE.md` | ✅ |
| Prototype READMEs | `*-prototype/README.md` | ✅ |

## Phase 1 — Foundation (per workspace)

Each app workspace builds its own Phase 0 (playbook §0–§6): Expo scaffold,
theme system, i18n + RTL, shared stores, atomic components, brand assets,
boot flow. Build before any feature work.

| Workspace | Status |
|---|---|
| Rider app foundation | ⏳ |
| Driver app foundation | ⏳ |
| Admin dashboard foundation | ⏳ |

**Open decisions before starting:**
- **Brand palette** — colors not specified in client spec; needs a design call.
- **Admin framework** — Next.js (App Router) vs plain React SPA vs Expo Web. Defer until design is ready.
- **Default boot language** — EN or AR. Spec is Arabic, but EN-default with AR-toggle is the safer dev path.

## Phase 1.5 — HTML prototypes

Built **before** the corresponding RN/web feature lands so each feature's
`CLAUDE.md` "Prototype reference" section has something concrete to point at.

| Surface | Folder | Status |
|---|---|---|
| Rider prototype | [`rider-prototype/`](./rider-prototype/) | ⏳ |
| Driver prototype | [`driver-prototype/`](./driver-prototype/) | ⏳ |
| Admin prototype | [`admin-prototype/`](./admin-prototype/) | ⏳ |

---

## Rider app

| Phase | Features |
|---|---|
| R1 — Onboard | `auth` (email/phone + OTP), `profile` (basic) |
| R2 — Book a trip | `pickup-destination` (map + search), `fare-estimate`, `request` |
| R3 — Live trip | `driver-tracking` (live position), `trip-progress` (pickup → drop-off) |
| R4 — Complete | `payment-confirm` (cash), `rating` |
| R5 — Retention | `trip-history`, `settings` (theme, language, notifications), `support` |

**R2 exit criteria:** rider sets pickup + destination → sees estimated fare → submits a mock request → mock driver assigned.

## Driver app

| Phase | Features |
|---|---|
| D1 — Onboard | `enrollment` (phone, OTP, ID, license, vehicle docs, PIN, biometric), `auth` |
| D2 — Core loop | `dashboard` (online/offline + map + today summary), `ride-requests` (incoming modal, accept/decline), `active-trip` (to-pickup → start → to-dropoff → complete) |
| D3 — Money | `earnings` (daily/weekly/monthly), `trip-history`, **`commission`** (auto-calc per trip, weekly settlement, suspension logic) |
| D4 — Retention | `ratings`, `profile`, `settings`, `support` |

**D2 exit criteria:** driver goes online → receives a mock request → accepts → completes mock trip → fare + commission recorded.

**Note on commission:** this is the platform's revenue mechanism per the client
spec — auto-calculated per trip, visible in the driver account, settled weekly
(or at a configurable cap), suspension on overdue. **Not just a wallet feature
— it's a billing system.**

## Admin dashboard

| Phase | Features |
|---|---|
| A1 — Auth | admin login (separate identity from rider/driver) |
| A2 — Drivers | driver list, profile detail, approve/suspend, document review |
| A3 — Operations | trip monitoring (live + history), revenue dashboard, pricing controls (opening fare, per-km, commission rate) |
| A4 — Reports | statistical reports (daily/weekly/monthly), commission settlement reports, export |

**A2 exit criteria:** admin approves a pending driver application → that driver can sign into the driver app and go online.

---

## Cross-cutting (later)

- Real backend + dispatch/matching engine — replaces all mock branches.
- Real maps key + turn-by-turn navigation.
- Push notifications (request alerts when backgrounded).
- App Store + Google Play submissions.

---

## How to pick up the next piece

1. Identify the surface you're working in (rider / driver / admin).
2. Open that workspace's `CLAUDE.md` for stack rules.
3. Open the feature's `src/features/<feature>/CLAUDE.md` (if it exists).
4. If a prototype exists, open `<surface>-prototype/<feature>/index.html`.
5. Follow playbook §20 (Adding a new feature) step by step.
6. Update that feature's `TRACKING.md` after each commit.
7. Tick the phase status here when a feature's acceptance criteria are met.
