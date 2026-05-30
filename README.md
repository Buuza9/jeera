# Jeera (جيرا)

A motorcycle ride-hailing platform — rider books, nearest driver accepts, cash
payment at end of trip. Built Arabic-first with full English support, mock-first
so each app ships ahead of the backend.

This repo is a **multi-workspace monorepo** containing three product surfaces,
each paired with its own HTML clickable prototype.

## Layout

| Folder | Purpose | Status |
|---|---|---|
| [`rider-app/`](./rider-app/) | Rider iOS/Android app — book trips, track driver, rate, pay cash | ⏳ Scaffolding |
| [`rider-prototype/`](./rider-prototype/) | HTML mockups for the rider app, built **before** each feature's RN implementation | ⏳ Scaffolding |
| [`driver-app/`](./driver-app/) | Driver iOS/Android app — go online, accept trips, navigate, collect commission | ⏳ Scaffolding |
| [`driver-prototype/`](./driver-prototype/) | HTML mockups for the driver app | ⏳ Scaffolding |
| [`admin-dashboard/`](./admin-dashboard/) | Admin dashboard (web) — driver approval, trip monitoring, pricing controls, revenue, commission settlement | ⏳ Scaffolding |
| [`admin-prototype/`](./admin-prototype/) | HTML mockups for the admin dashboard | ⏳ Scaffolding |

## How we work

- [`DEVELOPMENT_PLAYBOOK.md`](./DEVELOPMENT_PLAYBOOK.md) — authoritative methodology (folder structure, three-tier docs, mock-first dev, theme system, RTL rules, state management, navigation, security, animation patterns, etc.). **Read end-to-end before starting any feature.**
- [`INSTRUCTIONS.MD`](./INSTRUCTIONS.MD) — working-process rules (commits, git config, tracking docs).
- [`ROADMAP.md`](./ROADMAP.md) — phased build plan per surface.
- [`CLAUDE.md`](./CLAUDE.md) — project-level instructions for AI agents (each workspace has its own).

## Architecture & planning

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — system context, container view, data-flow diagrams, repo topology.
- [`docs/`](./docs/) — cross-cutting planning & operations docs: [build plan](./docs/build-plan.md), [infrastructure](./docs/infrastructure.md), [database & storage](./docs/database-storage.md), [monitoring](./docs/monitoring.md), [error handling](./docs/error-handling.md), [security](./docs/security.md), [testing & QA](./docs/testing-qa.md).
- [`supabase/SCHEMA.md`](./supabase/SCHEMA.md) — the shared database contract.

## Pricing & commission (per client spec)

- 100% **cash** payment at end of trip
- Fixed opening fare + per-km rate (configurable from the admin dashboard)
- Platform commission auto-calculated per trip, visible in driver account
- Driver settles commission **weekly** (or when hitting a configurable cap)
- Overdue commission → temporary account suspension by admin

## Brand

Colors **TBD** — to be set when the design phase begins. Defaults until then:
green primary, amber accent (placeholder, will be replaced).
Default language **English (LTR)**, Arabic (RTL) as a toggle — codebase is
RTL-safe from day one regardless of the boot default.
