# SCHEMA.md — Jeera (Djera) database design

**Status: DRAFT design doc — not migrations.** This is the shared data contract
across all three surfaces (driver app, rider app, admin dashboard). Migrations
are written per-feature when integrating Supabase (flipping `USE_MOCKS=false`),
starting with the already-built D1 slices (`drivers`, `driver_applications`,
`documents`).

Platform: **Supabase (managed Postgres, Frankfurt)** — Auth + Postgres +
Storage + Realtime. See each app's `TRACKING.md` → Tech stack.

---

## Where this lives (one database, not per-app)

There is **one** Postgres database shared by all three surfaces, so there is
**one** `supabase/` directory — at the monorepo root. The schema, migrations,
RLS, enums, seed data, and edge functions are owned here; apps never define
their own tables.

```
jeera/
├── supabase/                 ← THE database (root-owned, shared)
│   ├── SCHEMA.md             ← this contract
│   ├── migrations/           ← versioned SQL, added per feature
│   ├── seed.sql              ← dev/mock data
│   └── config.toml           ← Supabase CLI project (one remote DB)
├── driver-app/src/shared/supabase/   ← client + generated types only
├── rider-app/src/shared/supabase/    ← client + generated types only
└── admin-dashboard/src/shared/supabase/  ← client (elevated policies)
```

Each app gets only a Supabase **client** (`createClient(url, anonKey)`) plus
**generated types** (`supabase gen types typescript` run against this schema —
all three apps import the same `database.types.ts`). Surface-specific behaviour
is expressed through **RLS policies** (see matrix below), not separate schemas.

---

## Conventions

- **Keys:** `uuid` primary keys (`default gen_random_uuid()`), except identity
  tables that key off `auth.users.id`.
- **Identity:** Supabase Auth owns `auth.users` (email OTP). Each role gets a
  profile row keyed by `auth.users.id` — `drivers`, `riders`, `admins`.
- **Timestamps:** every table has `created_at timestamptz default now()`;
  mutable tables add `updated_at` (trigger-maintained).
- **Money:** `numeric(12,2)`, currency **LYD** (`د.ل`). One currency only — no
  per-row currency column. Never store fare/commission as float.
- **Geo:** `lat numeric(9,6)`, `lng numeric(9,6)` for now (PostGIS optional
  later if we need radius queries for dispatch).
- **Enums:** Postgres `enum` types (listed at the bottom).
- **Soft state, not hard config:** admin-tunable values (commission rate, cap,
  pricing) live in `pricing_config` **rows**, never as columns or constants, so
  the admin dashboard can change them without a migration. This directly covers
  the client-blocked §5 items (rate / cap / channels).
- **RLS:** on for every table. Drivers see only their own rows; admins (service
  role / `admins` membership) see all. Sketches per table below.

---

## Entity overview

```
auth.users ──1:1── drivers ──1:1── driver_applications ──*── documents
                      │  │
                      │  └──1:* ── vehicles
                      │
                      ├──1:* ── trips ──1:1── ratings (driver↔rider)
                      │           │
                      │           └── derives ── commission_entries (accrual)
                      │
                      └──1:* ── settlements ── commission_entries (settlement)

riders ──1:* ── trips
admins ──reviews── driver_applications / settlements / suspensions
pricing_config (versioned, admin-owned) ── referenced by trips at fare time
```

---

## Tables

### `drivers` — driver identity + lifecycle (D1 auth/enrollment)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `full_name` | text | |
| `phone` | text | E.164 (`+218…`); SMS deferred, email is the auth channel |
| `email` | text | mirror of auth email |
| `status` | `driver_status` | `pending` → `approved` → `suspended`; default `pending` |
| `rating_avg` | numeric(3,2) | denormalized from `ratings`; default null |
| `trips_count` | int | denormalized counter |
| `created_at` / `updated_at` | timestamptz | |

> Maps to driver-app `auth/store.ts Session` + `enrollment` application. A driver
> can't go online until `status = 'approved'` (§2.2). RLS: a driver reads/updates
> only `id = auth.uid()`; status transitions are admin-only.

### `driver_applications` — KYC submission (D1 enrollment)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `driver_id` | uuid FK→drivers | |
| `national_id` | text | masked in UI |
| `license_number` | text | |
| `plate` | text | motorcycle plate |
| `status` | `application_status` | `pending` / `approved` / `rejected` |
| `submitted_at` | timestamptz | |
| `reviewed_by` | uuid FK→admins | nullable |
| `reviewed_at` | timestamptz | nullable |
| `reject_reason` | text | nullable |

> Maps to driver-app `enrollment/store.ts Application`. Admin approves here
> (admin REQUIREMENTS §2.1), which flips `drivers.status`.

### `documents` — uploaded KYC files
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `driver_id` | uuid FK→drivers | |
| `type` | `document_type` | `national_id` / `license` / `vehicle_reg` |
| `storage_path` | text | Supabase Storage object path (private bucket) |
| `status` | `document_status` | `pending` / `verified` / `expired` |
| `expires_at` | date | nullable — drives §5 expiry/re-upload UX |
| `uploaded_at` | timestamptz | |

> Files live in a **private Storage bucket** (`driver-docs/{driver_id}/…`);
> rows hold the path + verification state. RLS: driver sees own; admin sees all.

### `vehicles` — motorcycle details
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `driver_id` | uuid FK→drivers | |
| `plate` | text | |
| `model` | text | nullable |
| `type` | text | always `motorcycle` per product invariant |

### `riders` — rider identity (rider app; minimal here)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | = `auth.users.id` |
| `full_name` | text | |
| `phone` | text | |
| `rating_avg` | numeric(3,2) | from `ratings` |

### `pricing_config` — admin-tuned constants (versioned)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `opening_fare` | numeric(12,2) | §2.9 |
| `per_km_rate` | numeric(12,2) | §2.9 |
| `commission_rate` | numeric(5,4) | e.g. 0.1500 = 15% (§2.10) — **client-blocked default** |
| `settlement_cap` | numeric(12,2) | max outstanding before forced settle (§2.10) — **client-blocked** |
| `auto_decline_seconds` | int | incoming-request timer (§2.4) — **client-blocked** |
| `effective_from` | timestamptz | newest row wins; keep history |
| `created_by` | uuid FK→admins | |

> `fare = opening_fare + per_km_rate × trip_distance_km`. The app reads the
> active row; never hard-codes (§2.9). All the §5 "TBD" knobs live here as data.

### `trips` — the core loop (D2 dashboard/requests/active-trip)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `rider_id` | uuid FK→riders | |
| `driver_id` | uuid FK→drivers | nullable until accepted |
| `status` | `trip_status` | `requested`/`accepted`/`arrived`/`in_progress`/`completed`/`cancelled` |
| `pickup_address` | text | + `pickup_lat`, `pickup_lng` |
| `dropoff_address` | text | + `dropoff_lat`, `dropoff_lng` |
| `distance_to_rider_km` | numeric(6,2) | §2.4 |
| `trip_distance_km` | numeric(6,2) | §2.4 |
| `fare` | numeric(12,2) | computed from `pricing_config` at request time |
| `pricing_config_id` | uuid FK | snapshot of which config priced it |
| `commission_amount` | numeric(12,2) | `fare × commission_rate`, set on completion |
| `cash_collected` | boolean | set true on "Confirm cash received" (§2.7) |
| `cancel_reason` | text | nullable (e.g. rider no-show) |
| `requested_at`/`accepted_at`/`arrived_at`/`started_at`/`ended_at` | timestamptz | lifecycle timeline (trip-history detail §2.8) |

> On `completed` + `cash_collected`, a trigger writes a `commission_entries`
> accrual row. RLS: driver sees trips where `driver_id = auth.uid()`; rider sees
> own; admin sees all.

### `commission_entries` — the ledger (D3 commission)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `driver_id` | uuid FK→drivers | |
| `type` | `ledger_type` | `accrual` (+owed) / `settlement` (−owed) |
| `amount` | numeric(12,2) | always positive; `type` gives sign |
| `trip_id` | uuid FK→trips | set for accruals |
| `settlement_id` | uuid FK→settlements | set for settlements |
| `created_at` | timestamptz | |

> **Outstanding balance = Σ accruals − Σ settlements** for a driver (a view
> `driver_commission_balance`). This append-only ledger is the source of truth
> for the revenue mechanism (§2.10) — no mutable "balance" column to drift.

### `settlements` — commission payments (D3 commission)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `driver_id` | uuid FK→drivers | |
| `amount` | numeric(12,2) | full or partial |
| `channel` | `settlement_channel` | `bank_transfer`/`in_person`/`mobile_money` — **client-blocked list** |
| `reference` | text | `JRA-…` receipt ref |
| `status` | `settlement_status` | `pending`/`confirmed` |
| `settled_at` | timestamptz | |
| `confirmed_by` | uuid FK→admins | nullable |

> Confirming a settlement writes the matching `commission_entries` settlement row.

### `suspensions` — overdue-commission account holds (D3 commission)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `driver_id` | uuid FK→drivers | |
| `reason` | text | e.g. "commission overdue / exceeds cap" |
| `suspended_at` | timestamptz | |
| `suspended_by` | uuid FK→admins | |
| `cleared_at` | timestamptz | nullable; set on reactivation |

> Mirrors `drivers.status = 'suspended'` with an audit trail (§2.10).

### `ratings` — driver↔rider (D4 ratings)
| column | type | notes |
|---|---|---|
| `id` | uuid PK | |
| `trip_id` | uuid FK→trips | |
| `rater_role` | `party` | `driver` / `rider` |
| `ratee_id` | uuid | the other party |
| `stars` | int | 1–5 |
| `comment` | text | nullable |
| `tags` | text[] | e.g. {polite, on_time} |
| `created_at` | timestamptz | |

---

## Enum types

```sql
create type driver_status      as enum ('pending','approved','suspended');
create type application_status as enum ('pending','approved','rejected');
create type document_type      as enum ('national_id','license','vehicle_reg');
create type document_status    as enum ('pending','verified','expired');
create type trip_status        as enum ('requested','accepted','arrived','in_progress','completed','cancelled');
create type ledger_type        as enum ('accrual','settlement');
create type settlement_channel as enum ('bank_transfer','in_person','mobile_money'); -- TBD with client
create type settlement_status  as enum ('pending','confirmed');
create type party              as enum ('driver','rider');
```

---

## Derived views

- `driver_commission_balance(driver_id, outstanding)` — `Σ accrual − Σ settlement`.
- `driver_today_summary(driver_id, earnings, trips, cash, hours)` — powers the
  dashboard "today" card (§2.3) and earnings (§2.8).

---

## RLS sketch

| table | driver | rider | admin |
|---|---|---|---|
| drivers | r/u own | — | all |
| driver_applications | r/c own | — | r/u all |
| documents | r/c own | — | r/u all |
| trips | r own (+ realtime new `requested`) | r own | all |
| commission_entries | r own | — | all |
| settlements | r/c own | — | r/u all |
| pricing_config | r active | r active | r/c/u |
| ratings | r own + c after trip | r own + c | all |

Status transitions (`drivers.status`, `applications.status`, `settlements.status`)
are **admin-only** — enforced via RLS + a `SECURITY DEFINER` function, not direct
client updates.

---

## Mapping from current mock types

| App mock | Table |
|---|---|
| `driver-app/src/features/auth/store.ts` `Session` | `auth.users` + `drivers` |
| `driver-app/src/features/enrollment/store.ts` `Application` | `driver_applications` + `documents` + `vehicles` |
| `driver-app/src/shared/phone.ts` `COUNTRY` | n/a (client constant) |
| commission mock (D3, TODO) | `commission_entries` + `settlements` + `pricing_config` |

When a feature flips to live, its `data.ts` swaps the mock body for Supabase
calls against these tables — the function signatures stay the same.

---

## Open questions (client-blocked — block real data, not schema shape)

These are **rows/values**, not structural unknowns, so the schema is safe to
build now:

- `pricing_config.commission_rate` default (§2.10)
- `pricing_config.settlement_cap` (§2.10)
- `settlement_channel` enum members — confirm full approved list (§2.10)
- `pricing_config.auto_decline_seconds` (§2.4)
- `documents.expires_at` re-upload UX (§5)
- PIN / biometric session lock (§5) — client-side only, no schema impact
