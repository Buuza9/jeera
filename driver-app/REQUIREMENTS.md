# REQUIREMENTS.md — Jeera Driver

Authoritative requirements for the **driver-app workspace**, extracted from
the client proposal deck (`عرض جيرا.pdf`). Use this as the source of truth
for *what to build*; `CLAUDE.md` covers *how*.

---

## 1. Product summary

The driver side of Jeera. A motorbike driver onboards with documents, goes
online to receive ride requests, accepts a request, navigates to the rider,
runs the trip, **collects cash** at the end, and **settles a platform
commission weekly** (or when hitting a cap).

Key product invariants:

- **Vehicle:** motorcycle (دراجة نارية) only.
- **Payment in:** 100% cash from the rider at trip end.
- **Payment out (commission):** driver owes the platform a configurable
  commission on every completed trip; settled weekly or at a threshold; via
  company-approved methods. Late settlement → admin suspends the account
  until cleared.
- **Language:** English default, Arabic toggleable; RTL-safe from day one.

## 2. Feature requirements

### 2.1 Sign-in (returning driver)

- Splash with brand mark "سائقي جيرا" and subtitle "ابدأ رحلتك معنا".
- Phone-number field, primary CTA **"تسجيل الدخول"**.
- Secondary CTA "سائق جديد؟" → **"التسجيل كسائق"** (new driver registration).

### 2.2 Driver registration (KYC)

Screen titled "التسجيل كسائق" with subtitle "أكمل البيانات للبدء".
Required fields:

- **Full name** (الاسم الكامل) — text.
- **National ID number** (رقم الهوية) — text/number.
- **Driver's license number** (رقم رخصة القيادة) — text/number.
- **Motorbike plate number** (رقم لوحة الدراجة) — text.
- **ID photo upload** (صورة الهوية) — image picker, "اضغط لرفع الصورة".
- **License photo upload** (صورة رخصة القيادة) — image picker.

Submission goes into a *pending-approval* state until admin approves
(see admin REQUIREMENTS §2.1). Driver cannot go online before approval.

### 2.3 Home / dashboard

Header:

- Avatar + name (e.g. "أحمد محمد") + subtitle "سائق جيرا".
- Hamburger menu → settings, profile, support, sign-out.

Online toggle:

- Big switch row labelled "متاح للرحلات" (Available for trips). OFF by default.
- Flipping ON starts listening for incoming requests; OFF stops.

"Today's summary" card ("ملخص اليوم") with tiles:

- **Today's earnings** (الأرباح اليوم) — e.g. 320 ريال.
- **Trips** (الرحلات) — e.g. 15.
- **Cash collected** (النقود المحصلة) — e.g. 320 ريال.
- **Work hours** (ساعات العمل) — e.g. 6 ساعات.

CTAs:

- Primary: **"بدء استقبال الطلبات"** (Start receiving requests). Mirrors the
  online toggle.
- Secondary: **"سجل الرحلات"** → trip history.

### 2.4 Incoming trip request

Modal/sheet titled "طلب رحلة جديد" with:

- **Pickup point** (نقطة الانطلاق) — address (e.g. "شارع الملك فهد، الرياض").
- **Destination** (الوجهة) — address (e.g. "مركز الملك عبدالله المالي").
- **Distance to rider** (المسافة إلى الراكب) — e.g. 1.5 كم.
- **Trip distance** (مسافة الرحلة) — e.g. 8.5 كم.
- **Fare** (الأجرة) — e.g. 25 ريال.
- Two actions side-by-side: **"رفض"** (Reject) and **"قبول"** (Accept, primary).
- Auto-decline countdown (TBD seconds — confirm with client).

### 2.5 Navigate to pickup ("on the way to rider")

- Top metrics row: **remaining distance** (المسافة المتبقية — e.g. 800 متر)
  and **expected time** (الوقت المتوقع — e.g. 2 دقيقة).
- Map: "خريطة التنقل إلى الراكب" with the live route.
- Rider card: avatar, name ("الراكب: خالد أحمد"), pickup address.
- Actions: **"اتصل"** (Call rider) and **"وصلت"** (Arrived — primary, becomes
  enabled at/near pickup).

### 2.6 Trip in progress ("on the way to destination")

- Top metrics row: remaining distance (e.g. 5.2 كم) and expected time
  (e.g. 12 دقيقة).
- Map: "خريطة التنقل إلى الوجهة".
- Destination + fare card: destination label (الوجهة) and fare (الأجرة).
- Primary CTA: **"إنهاء الرحلة"** (End trip).

### 2.7 Trip complete — collect cash

- Success state with check icon, title "تم إنهاء الرحلة", subtitle "رحلة موفقة!".
- **Fare due** card ("الأجرة المستحقة") prominently showing total (e.g.
  25 ريال) with "نقدًا" label, plus distance (المسافة) and duration (المدة).
- Primary CTA: **"تأكيد استلام النقود"** (Confirm cash received). Marks the
  trip settled on the rider side and accrues commission on the driver side.
- Secondary CTA: **"العودة للرئيسية"** (Back to home).

### 2.8 Trip history / earnings

Screen titled "سجل الرحلات" with a back arrow. Top stats strip:

- **Trips today** (رحلات اليوم) — e.g. 15.
- **Earnings (currency)** (ريال) — e.g. 320.
- **Hours** (ساعات) — e.g. 6.

List of trip cards, each showing:

- Destination name (e.g. "مركز الملك عبدالله المالي").
- Origin (e.g. "من: شارع الملك فهد").
- Date + time (e.g. "15 يناير 2025 • 14:30").
- Distance (e.g. 8.5 كم), fare (e.g. 25 ريال).
- Rider chip (avatar + name, e.g. "خالد أحمد").

### 2.9 Pricing model (consumption)

Fare per trip is computed from admin-configured constants:

```
fare = opening_fare + (per_km_rate × distance_km)
```

The app must read those constants from the platform config (mocked in
`USE_MOCKS` mode) and never hard-code them.

### 2.10 Commission settlement

This is the platform's revenue mechanism — first-class feature, not a
"wallet" add-on.

- **Accrual:** every completed trip adds `fare × commission_rate` to the
  driver's outstanding balance. Commission rate is admin-configured.
- **Visibility:** the driver's outstanding commission is always clearly
  visible in the app (dedicated screen + dashboard indicator).
- **Settlement cadence:** weekly, OR upon reaching a configurable max
  threshold — whichever comes first.
- **Settlement channels:** company-approved methods (bank transfer, in-person
  drop-off, etc. — exact list TBD with client).
- **Late payment:** if outstanding commission isn't settled by the due date
  (or exceeds the cap), admin can suspend the account. Suspended drivers
  cannot go online or accept requests until they clear the balance and admin
  reactivates them.
- **History:** driver can view past settlements with date, amount, channel,
  receipt reference.

## 3. Out of scope (driver app)

- Rider-facing flows (rider app).
- Driver approval/suspension by admin, pricing configuration, revenue
  reporting (admin dashboard).
- In-app rider→driver payment (cash only).
- Multi-stop trips, scheduled rides (not in deck).
- Vehicle marketplace, fleet management (not in deck).

## 4. Implementation plan (from the deck)

Total project duration: **11 weeks** across all surfaces.

| Phase | Duration |
|---|---|
| Documentation | 1 week |
| Design | 2 weeks |
| Development | 8 weeks |

Workspace-level feature ordering is in `CLAUDE.md` §3 and root `ROADMAP.md`.

## 5. Open questions / TBD

- **Currency:** deck shows ريال (SAR placeholder). Libya = LYD (د.ل).
- **Commission rate default:** not specified. Confirm before mock data ships.
- **Settlement cap:** not specified.
- **Approved settlement channels:** confirm full list.
- **Auto-decline timer** on incoming request: confirm value (10s? 15s?).
- **Document re-upload / expiry:** what happens when a license expires?
- **PIN / biometric session lock** (mentioned in CLAUDE.md) — not in deck.
  Confirm scope with client.
- **Offline behavior:** what does the driver app do without connectivity
  mid-trip? Not specified.
