# Rider Prototype

HTML clickable mockups for the Jeera rider app. Built **before** each feature's
RN implementation so the feature's `CLAUDE.md` "Prototype reference" section has
something concrete to point at.

Each mockup is a clickable HTML page styled to match an iPhone viewport with
RTL/LTR and light/dark variants.

## Layout (planned)

```
rider-prototype/
├── _shared/                 ← Shared design tokens + components (CSS, JS)
├── index.html               ← Navigation hub linking to each feature mockup
├── auth/                    ← Email/phone signup + OTP screens
├── pickup-destination/      ← Map + address search
├── fare-estimate/           ← Fare preview before requesting
├── request/                 ← Submit + waiting
├── driver-tracking/         ← Live driver position
├── trip-progress/           ← To-pickup → on-trip → at-destination
├── payment-confirm/         ← Cash confirmation
├── rating/                  ← Rate the driver
├── trip-history/            ← Past trips
├── settings/                ← Theme, language, notifications
└── support/                 ← Help, FAQ, contact
```

## How it links to the RN app

Each `<feature>/index.html` is linked from the matching RN feature's
`../rider-app/src/features/<feature>/CLAUDE.md` §6 (Prototype reference). When
the RN agent builds the feature, they translate the prototype's interactions
verbatim — no design re-decisions during implementation.
