## Working-process rules

These are the binding process rules for this repo. They sit alongside the
[`DEVELOPMENT_PLAYBOOK.md`](./DEVELOPMENT_PLAYBOOK.md) (which covers the *how*
of the code) — these cover the *how* of the workflow.

### 1. Read the documentation first

Before touching any workspace:
- Root [`CLAUDE.md`](./CLAUDE.md) — project-level context.
- [`DEVELOPMENT_PLAYBOOK.md`](./DEVELOPMENT_PLAYBOOK.md) — methodology.
- [`ROADMAP.md`](./ROADMAP.md) — what's done, what's next.
- Workspace-level `CLAUDE.md` (`rider-app/CLAUDE.md`, etc.) — stack-specific rules.
- Feature-level `CLAUDE.md` + `TRACKING.md` — when touching a specific feature.

### 2. Set up your environment

Each app workspace pins its own toolchain (Expo SDK, RN version, Node version).
First time in a workspace:

```bash
cd <workspace>/
npm install
npx expo install --fix      # mobile workspaces only — aligns native module versions
cp .env.example .env
```

Native iOS dev builds (`npx expo run:ios`) are required for the mobile
workspaces — Expo Go cannot run Reanimated v4 worklets.

### 3. Coding standards

- Follow the playbook end-to-end. It is not optional.
- Atomic, single-purpose components in `src/features/<feature>/components/`.
- Promote to `src/shared/` only when a second feature uses it.
- No business logic in `app/<screen>.tsx` route files — they should be thin.
- Every user-facing string goes through `t('...')` with matching keys in `en.ts` **and** `ar.ts`.
- Use `ms-/me-/start-/end-` spacing classes. Never `ml-/mr-/pl-/pr-`.
- Comments explain **why**, never **what** — only when non-obvious.

### 4. Alignment & spacing

Prettier config lives per workspace. Run it before commits if your editor
doesn't format on save.

### 5. Testing

- Type-check: `npx tsc --noEmit`
- Lint: `npx eslint .` (per workspace)
- Manual smoke: both LTR (English) and RTL (Arabic), both light + dark theme, both mock + real API branches.
- For UI changes, launch the simulator and exercise the feature before declaring done.

### 6. Version control

- **Local git identity** (per-repo, not global):
  ```bash
  git config user.name  "Mohammed Salah"
  git config user.email "buuza.salah99@gmail.com"
  ```
- Subject: `<scope>: <verb> <what>` — lowercase, no period.
- Body: bullet points, not prose. Focused on *why*, not file inventory.
- **No `Co-Authored-By:` trailer.**
- Stage specific files (`git add path/to/file.ts`), not `git add .`.
- Never commit `.env` or generated artifacts.

### 7. Documentation

Every feature has a `TRACKING.md` next to its `CLAUDE.md`. **Update it on every
commit that touches the feature.** This is the single biggest lever for
agent-session continuity — don't skip it.

Status emojis:
- ✅ Live · ⏳ Pending · 🟡 Partial / WIP · 📌 Stub · ❌ Dead · 🔌 Blocked on backend
