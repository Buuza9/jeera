# Admin Prototype

HTML clickable mockups for the Jeera admin dashboard. Built **before** each
feature's implementation so the feature's `CLAUDE.md` "Prototype reference"
section has something concrete to point at.

Unlike the mobile prototypes (iPhone viewport), admin mockups are styled to
match a **desktop browser viewport** (1280×800 minimum) with light/dark
variants. RTL/LTR support depends on whether the admin dashboard ships with
Arabic — likely English-only for v1.

## Layout (planned)

```
admin-prototype/
├── _shared/                       ← Shared design tokens + components (CSS, JS)
├── index.html                     ← Navigation hub linking to each feature mockup
├── auth/                          ← Admin login
├── drivers/                       ← List, detail, approve/suspend, doc review
├── trips/                         ← Live + history
├── revenue/                       ← Revenue dashboard
├── pricing/                       ← Opening fare, per-km, commission rate
├── commission-settlement/         ← Track balances, mark settled, suspend
└── reports/                       ← Daily / weekly / monthly + export
```

## How it links to the admin app

Each `<feature>/index.html` is linked from the matching admin feature's
`../admin-dashboard/src/features/<feature>/CLAUDE.md` §6 (Prototype reference).
