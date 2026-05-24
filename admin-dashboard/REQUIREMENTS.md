# REQUIREMENTS.md — Jeera Admin Dashboard

Authoritative requirements for the **admin-dashboard workspace**, extracted
from the client proposal deck (`عرض جيرا.pdf`). Use this as the source of
truth for *what to build*; `CLAUDE.md` covers *how*.

---

## 1. Product summary

Internal web dashboard used by Jeera operations staff to run the platform.
Five responsibilities, all called out explicitly in the deck:

1. **Driver management** — approve / suspend.
2. **Trip monitoring** — watch live + completed trips.
3. **Revenue display** — what the platform has earned.
4. **Pricing configuration** — opening fare, per-km rate, commission rate.
5. **Statistical reports** — operational analytics.

Plus the operational mechanism the deck spends a whole slide on:

6. **Commission settlement management** — track what each driver owes,
   record settlements, suspend on overdue.

## 2. Feature requirements

### 2.1 Driver management

- **Pending approvals queue:** new driver registrations from the driver app
  awaiting review. For each pending driver, show submitted KYC:
  - Full name, national ID number, license number, plate number.
  - ID photo, license photo (clickable/zoomable).
  - Submission date.
- **Actions per driver:** **Approve** (driver can now go online) and
  **Reject** (with reason — TBD).
- **Active drivers list** with filters (status, rating, area, registration
  date) and per-row actions:
  - **Suspend** (manual or commission-triggered — see §2.6) and **Reactivate**.
  - View driver profile: documents, vehicle, lifetime trips, rating, current
    commission balance, last settlement.

### 2.2 Trip monitoring

- **Live trips view:** trips currently in progress with status (searching,
  en-route to pickup, on trip), rider name, driver name, route, fare,
  elapsed time. Map view optional but desirable.
- **Completed trips log** with filters (date range, driver, rider, status).
  Per row: date/time, rider, driver, origin → destination, distance,
  duration, fare, rating, commission accrued. Tap → trip detail.
- **Cancelled / failed trips** visible separately or via a status filter.

### 2.3 Revenue display

- Platform revenue = sum of commissions earned across completed trips,
  shown for selectable periods (today / week / month / custom range / all-time).
- Breakdown by:
  - **Settled** vs **outstanding** commission.
  - **Per-driver** contribution (top contributors).
  - **Trend** chart (daily/weekly).

### 2.4 Pricing configuration

Admin-configurable constants used by both apps. Single config panel with:

- **Opening fare** (سعر افتتاحي ثابت) — fixed amount per trip.
- **Per-kilometer rate** (سعر لكل كيلومتر) — multiplier × distance.
- **Commission rate** (نسبة عمولة المنصة) — percentage of fare owed by
  driver to platform.
- **Commission settlement cap** — max outstanding balance before driver is
  forced to settle (or is auto-suspended).
- **Settlement cadence** — default weekly; configurable.
- **Currency** — single platform currency (Libyan Dinar for production;
  ريال shown as placeholder in the deck).

Edits should be versioned/audited (who changed what, when) and take effect
on new trips only — never recompute historical fares.

### 2.5 Reports

Generatable / exportable (CSV/PDF — confirm) reports:

- Trips per period (count, total revenue, avg fare, avg distance).
- Drivers per period (active drivers, new approvals, suspensions).
- Commission outstanding by driver.
- Settlement log (who paid what, when, via which channel).
- Trip ratings distribution.

### 2.6 Commission settlement management

The flow the deck dedicates a slide to. Admin-side responsibilities:

- **Outstanding balance per driver** view, sortable by amount and days
  overdue. Highlight drivers at/over the cap or past the weekly due date.
- **Record a settlement:** pick driver → enter amount, channel, reference →
  save. This reduces the driver's outstanding balance and appears in their
  settlement history.
- **Suspend overdue drivers:** automatic flag (or manual confirmation) on
  drivers whose balance is overdue. Suspension persists until the balance
  clears and admin reactivates them.
- **Notifications / reminders** to drivers (TBD — push? SMS? email?) when
  they approach the cap or pass the due date.

## 3. Out of scope (admin dashboard)

- Rider-facing or driver-facing mobile flows.
- In-app rider→driver payments (cash only across the platform).
- Marketing site, blog, public landing pages.
- Bookkeeping / accounting integrations (the deck only requires
  in-dashboard tracking, not exports to external accounting systems —
  confirm if CSV export is enough).

## 4. Pricing packages (commercial — for admin UI context only)

The deck advertises four subscription tiers the *operator* pays Brandify
for running the platform. The admin dashboard itself does **not** sell or
manage these subscriptions, but caps below shape what the system may need
to enforce per deployment:

| Tier | Monthly | Drivers cap | Trips/month cap |
|---|---|---|---|
| Starter (البدائية) | $80 | 20 | 500 |
| Growth (النمو) | $120 | 50 | 2,000 |
| Pro (الاحترافية) | $150 | Unlimited | Unlimited |
| Enterprise (المؤسسات) | $220 | Unlimited | Unlimited |

If caps need to be enforced in-app, that's a future config item — flag with
the client. For v1, treat as informational.

## 5. Implementation plan (from the deck)

Total project duration: **11 weeks** across all surfaces.

| Phase | Duration |
|---|---|
| Documentation | 1 week |
| Design | 2 weeks |
| Development | 8 weeks |

Delivery (Option 1 in deck): full source via GitHub + apps published to
Apple App Store + Google Play. Admin dashboard is a web app; hosting target
not specified — confirm with client.

## 6. Open questions / TBD

- **Auth:** how do admin staff sign in? Email+password? SSO? 2FA required?
- **Roles:** is there a single "admin" role or do we need super-admin /
  operator / finance / support tiers?
- **Currency:** confirm LYD (د.ل) as the production currency; deck mocks
  use ريال.
- **Settlement channels:** the actual approved list (bank transfer, cash
  drop-off, mobile wallet?).
- **Reject reason** for driver applications: free-text or fixed list?
- **Live map** of in-progress trips: required for v1 or v2?
- **Subscription-tier caps enforcement:** are the deck's Starter/Growth
  caps soft (alerts) or hard (block new drivers/trips)?
- **Notifications to drivers:** which channels (push via driver app, SMS,
  email)?
- **Audit log** scope: just pricing edits, or every admin action?
