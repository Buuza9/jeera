# CLAUDE.md — Jeera (monorepo root)

This is the **repo root** for the Jeera monorepo. Six workspaces live in
sibling folders — three product apps, each paired with its HTML prototype:

- **[`rider-app/`](./rider-app/)** — rider iOS/Android app (Expo + RN)
- **[`rider-prototype/`](./rider-prototype/)** — HTML clickable mockups for rider features
- **[`driver-app/`](./driver-app/)** — driver iOS/Android app (Expo + RN)
- **[`driver-prototype/`](./driver-prototype/)** — HTML clickable mockups for driver features
- **[`admin-dashboard/`](./admin-dashboard/)** — admin dashboard (web)
- **[`admin-prototype/`](./admin-prototype/)** — HTML clickable mockups for admin features

Each app workspace has its own `CLAUDE.md` for stack-specific rules.

## Read first

Before touching any workspace, read:

- [`DEVELOPMENT_PLAYBOOK.md`](./DEVELOPMENT_PLAYBOOK.md) — authoritative methodology. Folder structure conventions, three-tier doc system (root CLAUDE.md → workspace CLAUDE.md → per-feature CLAUDE.md → per-feature TRACKING.md), mock-first development (`USE_MOCKS`), theme system, RTL rules (apply day one — retrofit is painful), state management, auth/navigation, shared components, commit conventions, verification.
- [`INSTRUCTIONS.MD`](./INSTRUCTIONS.MD) — working-process rules (commit message format, local git config, TRACKING.md updates).
- [`ROADMAP.md`](./ROADMAP.md) — phased build plan + status per surface.

## Product overview

Jeera (جيرا) is a motorcycle ride-hailing app for Libya. Three surfaces:

1. **Rider app** — register (email/phone), set pickup + destination, see fare estimate, watch driver in real-time, pay cash, rate driver.
2. **Driver app** — onboard with documents, toggle online/offline, accept incoming requests, navigate trip, view daily earnings, settle commission weekly.
3. **Admin dashboard** — approve/suspend drivers, monitor trips, view revenue, configure pricing (opening fare + per-km), generate reports, manage commission settlement.

**Payment:** 100% cash at end of trip — no in-app payment methods, no digital
rails for rider→driver. The "wallet" concept applies to **driver→platform
commission settlement**, not rider payments.

## When working on a specific workspace

```bash
cd rider-app/    # or driver-app/, admin-dashboard/, *-prototype/
```

All `npm` / `expo` / `tsc` commands run from inside the workspace. Each app
workspace has its own `CLAUDE.md` with stack-specific rules — read it before
touching that workspace's `src/`.

## Commit conventions

- Subject: `<scope>: <verb> <what>` — lowercase, no period (e.g. `rider/auth: wire signin screen`, `driver/enrollment: add license upload`, `chore: bootstrap monorepo`). Scope optionally namespaces the surface (`rider/`, `driver/`, `admin/`) or is just the feature for cross-cutting changes.
- Body: bullet points describing the changes — not prose paragraphs.
- **No `Co-Authored-By:` trailer.** Local git identity (`user.name`, `user.email`) is set per-repo, not global.
- Update each feature's `TRACKING.md` on every commit that touches it.

## Brand

Colors **TBD** — to be set when the design phase begins. Defaults until then:
green primary, amber accent (placeholder, will be replaced once the client
confirms the palette).
Default language **English (LTR)**, Arabic (RTL) toggleable. The codebase stays
RTL-safe regardless of the boot default — use `ms-/me-/start-/end-` classes,
never `ml-/mr-/pl-/pr-`.

## Playbook ↔ this monorepo

The playbook (§2) describes a single-app layout (`my-app/{app,src,…}`). In this
monorepo each app workspace **mirrors that layout internally** (`rider-app/app/`,
`rider-app/src/`, etc.). Playbook references to "the root" mean **the workspace
root**, not the monorepo root. Cross-cutting docs (this file, playbook,
roadmap, instructions) live at the monorepo root and are shared by all
workspaces.
