# REQUIREMENTS.md — Jeera Rider

Authoritative requirements for the **rider-app workspace**, extracted from the
client proposal deck (`عرض جيرا.pdf`). Use this as the source of truth for
*what to build*; `CLAUDE.md` covers *how*. Update this file when the client
revises scope.

---

## 1. Product summary

Jeera (جيرا) is a motorcycle ride-hailing service for Libya. The rider app
lets a rider request a motorbike ride, watch the assigned driver approach,
pay **cash** at trip end, and rate the driver.

Key product invariants:

- **Vehicle type:** motorcycle only (دراجة نارية).
- **Payment:** 100% cash on completion. No in-app payment methods, no wallet,
  no card/digital rails for rider → driver.
- **Matching:** nearest available driver receives the request.
- **Pricing shown up front:** rider sees the approximate fare *before*
  confirming the request.
- **Language:** English default, Arabic toggleable. RTL-safe from day one
  (see root `CLAUDE.md`).

## 2. Feature requirements

### 2.1 Authentication

- Phone-number sign-in (the deck shows phone only on the rider splash; email
  is mentioned in the textual spec as an alternative — support both).
- **OTP verification:** 4-digit code sent to the entered phone, with a
  "Resend code" affordance.
- Splash/welcome shows brand mark "جيرا" with tagline
  "توصيل سريع وآمن" ("fast and safe delivery").
- Successful sign-in lands the rider on the home/map screen.

### 2.2 Home — set pickup and destination

- Full-screen map area with the current location pre-filled as the pickup
  ("موقعك الحالي").
- Header chip shows the current pickup address (e.g. "شارع الملك فهد، الرياض").
- "Recenter on me" control over the map.
- Bottom destination input: "إلى أين تريد الذهاب؟"
- Primary CTA: **"طلب رحلة"** (Request ride). Disabled until a destination
  is chosen.
- Menu (hamburger) opens drawer/sheet → trip history, settings, support, etc.

### 2.3 Trip details / fare estimate

Once the destination is set, show a review screen titled "تفاصيل الرحلة" with:

- **From** (pickup address) and **To** (destination address), visually
  connected (origin dot → destination pin).
- **Distance** in km (e.g. 8.5 كم).
- **Expected time** in minutes (e.g. 15 دقيقة).
- **Expected fare** in the local currency (deck shows ريال; for Libya, use
  Libyan Dinar `د.ل` once confirmed). Label as "نقدًا فقط" (cash only).
- Primary CTA: **"تأكيد الطلب"** (Confirm request).

### 2.4 Searching for a driver

- Loading state with spinner, title "جاري البحث عن سائق" and subtitle
  "يرجى الانتظار بينما نجد أقرب سائق لك".
- Visible secondary action: **"إلغاء الطلب"** (Cancel request).

### 2.5 Driver assigned — en-route to pickup

Once a driver accepts:

- Map showing driver position + route to pickup ("منطقة الخريطة - مسار السائق").
- Driver card with:
  - Avatar + name (e.g. "أحمد محمد").
  - Star rating (e.g. ★ 4.9).
  - License plate ("لوحة: ABC 1234").
  - **Call** button (tap-to-dial the driver).
- Status row: "يبعد عنك" → ETA in minutes (e.g. 3 دقائق).
- Trip summary tiles: vehicle type (دراجة نارية), fare (e.g. 25 ريال نقدًا).

### 2.6 Trip in progress

- Top status bar: "الرحلة جارية" with remaining-time text (e.g.
  "12 دقيقة متبقية") and a progress bar.
- Live map of the trip ("منطقة الخريطة - الرحلة جارية").
- Bottom safety CTA: **"طوارئ / مساعدة"** (Emergency / help) — opens an
  emergency/support sheet (call, contact, SOS).

### 2.7 Trip complete + rating

- Success state: large check icon, title "وصلت بسلامة!" subtitle
  "نتمنى لك يومًا سعيدًا".
- **Trip details card** titled "تفاصيل الرحلة" with rows:
  - Distance (المسافة) — e.g. 8.5 كم
  - Duration (المدة) — e.g. 18 دقيقة
  - Base fare (الأجرة الأساسية) — e.g. 10 ريال
  - Distance cost (تكلفة المسافة) — e.g. 15 ريال
  - Total (الإجمالي) — e.g. 25 ريال
- Payment confirmation row: "تم الدفع نقدًا" (Paid in cash).
- **Rate the driver** ("قيّم السائق"): 5-star picker.
- Optional comment textarea ("أضف تعليقًا (اختياري)").

### 2.8 Trip history

- Screen titled "سجل الرحلات" with a back arrow.
- List of past trips. Each card shows:
  - Destination name (e.g. "مركز الملك عبدالله المالي").
  - Origin label (e.g. "من: شارع الملك فهد").
  - Date (e.g. "15 يناير 2025").
  - Distance + duration (e.g. "8.5 كم • 18 دقيقة").
  - Fare (e.g. "25 ريال").
- Tap card → trip detail (re-uses the completion summary layout).

### 2.9 Pricing model (display only on rider side)

Fare = **opening fare (fixed)** + **per-km rate × distance**. The opening
fare and per-km rate are configured by admin; the rider app only consumes
them. Display fare with two breakdown lines (base + distance cost) on
completion, single estimate up front.

## 3. Out of scope (rider app)

- Any in-app payment method (cards, wallets, transfers). Cash only.
- Driver onboarding / document upload (driver app).
- Commission settlement, pricing configuration, driver approval (admin).
- Multi-stop trips, scheduled rides, ride sharing (not in the deck).
- Loyalty, promo codes, referrals (not in the deck).

## 4. Implementation plan (from the deck)

Total project duration: **11 weeks** across all surfaces.

| Phase | Duration |
|---|---|
| Documentation | 1 week |
| Design | 2 weeks |
| Development | 8 weeks |

Phase-level feature ordering for this workspace lives in `CLAUDE.md` §3 and
the root `ROADMAP.md`.

## 5. Open questions / TBD

- **Currency:** deck mockups use ريال (SAR) as placeholder. Libya uses
  Libyan Dinar (د.ل / LYD). Confirm with client and update all copy/format.
- **Email login:** spec text mentions email/phone, mockups show phone only.
  Confirm whether email is required for v1.
- **Map provider + API keys:** Google Maps vs. Mapbox vs. other. Not in deck.
- **OTP provider:** SMS gateway choice. Not in deck.
- **Emergency / SOS behavior:** what does "طوارئ / مساعدة" actually do
  (call local police? in-app support? auto-dispatch?). Not specified.
- **Cancellation policy:** is there a fee/grace window after a driver
  accepts? Not specified.
