# CLAUDE.md — Jeera Admin (`admin-dashboard/`)

This file governs the **admin-dashboard workspace**. The repo root is one level up
(`jeera/`), with cross-cutting docs (`../DEVELOPMENT_PLAYBOOK.md`,
`../INSTRUCTIONS.MD`, `../ROADMAP.md`, `../CLAUDE.md`) shared across all six
workspaces.

> **Read [`../DEVELOPMENT_PLAYBOOK.md`](../DEVELOPMENT_PLAYBOOK.md) end-to-end before starting any feature.**
> Most of the playbook is mobile-specific (Expo, Reanimated, NativeWind), but
> the methodology pieces apply universally: three-tier docs, mock-first
> development, state management discipline, RTL rules, commit conventions,
> verification. Read those sections first and adapt the rest.

> **Also read [`REQUIREMENTS.md`](./REQUIREMENTS.md) before scoping any feature.**
> It is the extracted client requirements (from the proposal deck) — the five
> admin responsibilities, commission-settlement management, pricing config,
> and out-of-scope items. CLAUDE.md is *how*; REQUIREMENTS.md is *what*. If
> the two disagree, REQUIREMENTS.md wins on scope.

---

## 1. Project overview

The **admin dashboard** for Jeera. Internal staff use this to approve/suspend
drivers, monitor live + completed trips, view revenue, configure pricing
(opening fare, per-km rate, commission rate), generate reports, and manage
driver commission settlement.

Built **mock-first** so it runs end-to-end with no backend.

## 2. Tech stack — TBD

The admin dashboard is a **web app**, not a mobile app. Framework choice is
deferred until design starts. Candidates:

| Option | Pros | Cons |
|---|---|---|
| **Next.js (App Router)** | Mature, SSR for charts, easy hosting (Vercel) | Heavier for an internal tool |
| **Vite + React SPA** | Lightest setup, fastest dev loop | No SSR, host yourself |
| **Expo Web** | Share code with mobile workspaces | Web-on-Expo has rough edges for a desktop dashboard |

**Decision needed before scaffolding.** The rest of the stack (Tailwind for
styling, Zustand for state, TanStack Query for server state, react-i18next for
i18n) carries over from the mobile playbook.

## 3. Planned features

| Feature | Purpose | Phase |
|---|---|---|
| `auth` | Admin login (separate identity from rider/driver) | A1 |
| `drivers` | Driver list, profile detail, approve/suspend, document review | A2 |
| `trips` | Trip monitoring (live + history) | A3 |
| `revenue` | Revenue dashboard | A3 |
| `pricing` | Configure opening fare, per-km rate, commission rate | A3 |
| `commission-settlement` | Track driver commission balances, mark as settled, trigger suspensions | A3 |
| `reports` | Statistical reports (daily / weekly / monthly), export | A4 |

## 4. Folder structure — TBD

Once the framework is chosen, this section gets filled in. The shape should
still feel familiar to anyone coming from the mobile workspaces:

- routes / pages — thin, compose feature components
- `src/features/<feature>/` — per-feature CLAUDE.md + TRACKING.md + components, hooks, data, store
- `src/shared/` — cross-feature components, stores, types
- `src/i18n/` — EN + AR (admin is internal; AR support may be deferred)

## 5. Status

⏳ **Not scaffolded yet.** Framework decision blocks Phase 0.
