# docs/ — Jeera planning & operations

Cross-cutting planning, architecture, and operations docs shared by all three
surfaces (rider app, driver app, admin dashboard). These complement — not
replace — the methodology in [`../DEVELOPMENT_PLAYBOOK.md`](../DEVELOPMENT_PLAYBOOK.md)
and the per-surface specs.

> **Status: design / planning docs.** The platform is built mock-first; these
> describe the target system and the plan to get there. Each becomes "live" as
> the relevant slice flips `USE_MOCKS=false`.

## Index

| Doc | Covers |
|---|---|
| [`../ARCHITECTURE.md`](../ARCHITECTURE.md) | System context, container view, data-flow diagrams, repo topology |
| [`build-plan.md`](./build-plan.md) | Execution plan for **every phase** — deliverables, milestones, exit criteria, dependencies |
| [`infrastructure.md`](./infrastructure.md) | Hosting & deployment — environments, EAS, Vercel, Supabase, CI/CD, releases, rollback |
| [`database-storage.md`](./database-storage.md) | Postgres, Storage buckets, RLS, migrations workflow, backups, seeding, generated types |
| [`monitoring.md`](./monitoring.md) | Sentry + PostHog, logging, alerting, dashboards, SLOs, on-call |
| [`error-handling.md`](./error-handling.md) | Error taxonomy, client + server patterns, retries, offline, user-facing feedback |
| [`security.md`](./security.md) | Auth, RLS strategy, secrets, PII, mobile hardening, supply chain, compliance |
| [`testing-qa.md`](./testing-qa.md) | Test pyramid, CI gates, E2E, manual smoke (LTR/RTL/theme/mocks), device matrix |
| [`../supabase/SCHEMA.md`](../supabase/SCHEMA.md) | The shared data contract (tables, enums, RLS matrix) |

## How these relate

- [`ROADMAP.md`](../ROADMAP.md) is the **sequencing index** (what phase, what
  order). [`build-plan.md`](./build-plan.md) is the **execution detail** per
  phase (deliverables, exit criteria, infra cutover steps).
- [`ARCHITECTURE.md`](../ARCHITECTURE.md) is the **what/where**; the ops docs
  here are the **how-we-run-it**.
- The **playbook** governs *how we write code*; these govern *how we ship and
  operate it*.

## Locked stack (reference)

Confirmed 2026-05-29 (see `driver-app/TRACKING.md`):

- **Backend:** Supabase (managed Postgres + Auth + Realtime + Storage + Edge
  Functions), **Frankfurt / EU-Central**, free tier to start.
- **Auth:** Supabase email OTP (6-digit / magic link). SMS deferred.
- **Email:** Supabase SMTP (dev) → **Resend** free tier (prod).
- **Maps:** OpenStreetMap tiles (MapTiler / CARTO) + **OSRM** routing.
- **Push:** Expo Push.
- **Monitoring:** **Sentry** (errors) + **PostHog** (product analytics), EU.
- **Mobile build/OTA:** EAS Build + EAS Update.
- **Admin:** **Next.js** on **Vercel**.
- **CI:** GitHub Actions.
