# PawMatch Pinnacle 🐾

> **NTU Pinnacle Prize 2026 — Smart Cities & AI for Good**
>
> A Singapore-specific pet adoption platform that uses personality-based AI matching to connect prospective owners with shelter animals, then supports them through adoption with post-adoption risk monitoring, health tracking, compliance tools, and community features.
>
> **Live demo:** https://9irija.github.io/PawMatch-Pinnacle/

Built with React 18 + Vite · Firebase Auth + Firestore · Tailwind CSS · Recharts · Leaflet

---

## The Problem

Singapore's animal shelters face a circular crisis: animals are adopted, returned due to mismatch or owner burnout, and cycle back into the system — driving up stray numbers and shelter costs. Most platforms stop at the moment of adoption. PawMatch doesn't.

## The Solution (3-Layer Architecture)

| Layer | What it does | Prize theme |
|---|---|---|
| **Layer 1** — Personality Matching | MBTI + lifestyle quiz → ranked swipe deck | AI for Good |
| **Layer 2** — Post-Adoption Support | Health passport, 30-day guide, compliance checklists | Smart Cities |
| **Layer 3** — Retention Risk AI | Check-in signals → 0–100 risk score → contextual interventions | AI for Good + Smart Cities |

The circular economy argument: **better matching → fewer returns → fewer strays → less shelter pressure → city spends less on stray management.**

---

## Live Demo — How to Test

**URL:** https://9irija.github.io/PawMatch-Pinnacle/

Works fully in guest mode — no account needed. All data saves to your browser's localStorage.

### Walkthrough for judges / testers

1. **Quiz** — Answer 8 questions (MBTI, lifestyle, housing, experience). Takes ~2 min. Drives all matching.
2. **Discover** — Swipe right on 1–2 animals. Cards are ranked by your compatibility score.
3. **My Pet** tab (🏠) — Confirm which animal you adopted. Log a check-in to see the AI risk score.
4. **Profile** tab → scroll down to **City Impact Dashboard** — see Singapore-level retention data.
5. **Health** tab — Explore the digital vet passport with vaccination reminders and compliance tracking.
6. **Community** tab — Join Singapore-specific owner groups.
7. **Map** tab — Browse pet-friendly spots in Singapore.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 4 |
| Styling | Tailwind CSS 3 |
| Auth & Database | Firebase 12 (Auth + Firestore) — optional, graceful offline fallback |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |
| Hosting | GitHub Pages (via gh-pages) |
| State | React `useState` / `useEffect` |
| Persistence | Firestore (source of truth) + `localStorage` (instant cache + offline guest mode) |

---

## Features

---

### 1. Personality Onboarding Quiz `[AI for Good]`

Shown on first launch. Skipped automatically if a profile already exists in localStorage or Firestore.

- **8 questions** — MBTI dimensions (E/I, S/N, T/F, J/P), activity level, living space, time available, pet experience
- MBTI type computed from quiz answers and stored alongside lifestyle profile
- **HDB note** on Q6 — explains breed filtering before they see any animals
- Animated progress bar, tap-to-select option cards, slide transitions between questions
- On completion → profile saved to Firestore + localStorage; quiz never re-shown unless "Retake Quiz" is pressed
- Retake Quiz wipes swipe history, liked animals, and post-adoption data — full fresh start

---

### 2. Discover — AI-Ranked Swipe Deck `[AI for Good]`

- Tinder-style card stack with touch and mouse drag gesture support
- Animals sorted by **compatibility score (0–100)** — highest match shown first
- **HDB filter** — non-approved breeds automatically hidden for HDB residents
- Swipe right → liked (triggers Match Modal) · Swipe left → passed
- Match Modal shows score breakdown and match reason bullets on every right-swipe

#### Matching Algorithm (`src/utils/matchingAlgorithm.js`)

| Signal | Max pts | How |
|---|---|---|
| MBTI compatibility | 50 | 12.5 per matching dimension (E/I, S/N, T/F, J/P) |
| Energy level match | 25 | Graduated by difference between owner activity and animal energy |
| Experience match | 15 | Lookup table: first-timer/beginner, experienced/experienced, etc. |
| Senior/special-needs boost | +10 | Applied when base score > 60 and animal age ≥ 7 or has special needs |

---

### 3. My Matches

- Grid of all right-swiped animals, sorted by match score (highest first)
- Score badge colour: 🟢 ≥80 · 🟠 ≥60 · ⚫ <60
- Days-in-shelter badge (amber)
- Contact Shelter button → links to real Singapore shelter URLs (SPCA, Action for Singapore Dogs, Cat Welfare Society, etc.)
- Tap any card → full animal detail modal
- Empty state with prompt to the Discover tab

---

### 4. My Pet — Adoption Journey Tracker `[AI for Good]` `[Smart Cities]`

A dedicated **🏠 My Pet** tab. Activates after the owner confirms which matched animal they adopted.

#### Adoption Confirmation
- Card picker of all liked animals with photo, breed, age, match score
- "I adopted this pet" button — records `adoptionDate` to Firestore
- "Day X of your adoption journey" counter shown from confirmation date
- "Change" link to re-select if needed

#### Retention Risk Score `[AI for Good]`
Computed from 5 check-in signals plus owner lifestyle context from the onboarding quiz:

| Signal | Max risk contribution |
|---|---|
| Pet adjustment (1–5, inverted) | 32 pts |
| Routine consistency (1–5, inverted) | 24 pts |
| Owner stress (1–5) | 24 pts |
| Behaviour concerns (1–5) | 20 pts |
| Lifestyle modifiers (time available, experience, energy mismatch) | up to +24 pts |

Risk bands: 🟢 **Low** (<35) · 🟡 **Moderate** (35–64) · 🔴 **High** (≥65)

#### High-Risk Flag Banner `[AI for Good]`
- Appears when risk score ≥ 65
- 🚨 Red banner: *"This placement may need support — consider reaching out to your shelter"*
- Labelled **Flagged for follow-up** — makes the AI intervention concrete, not just a number

#### Risk Trend Chart `[AI for Good]`
- Recharts LineChart showing risk score over up to 12 check-ins (oldest → newest)
- Reference lines at 35 (moderate) and 65 (high) thresholds
- Interactive tooltip per data point
- Appears after 2+ check-ins are logged

#### Score Breakdown Panel
- 4 signal dot indicators (🟢 / 🔴) for pet adjustment, routine, stress, behaviour
- Shows last logged value per signal

#### AI Recommendations `[AI for Good]`
Up to 3 contextual cards surfaced from the latest check-in. Each tagged `AI for Good` or `Smart Cities`:

| Trigger | Recommendation |
|---|---|
| Pet adjustment ≤ 2 | 🏠 Create a decompression zone |
| Routine consistency ≤ 2 | 🕐 Lock in a daily rhythm |
| Owner stress ≥ 4 | 👥 Connect with local owners *(Smart Cities)* |
| Behaviour concerns ≥ 3 | 🎓 Book a professional trainer |
| Energy mismatch (homebody + high-energy pet) | 🗺️ Find a nearby dog run *(Smart Cities)* |
| First-timer + risk ≥ 45 | 📋 Complete your 30-Day Guide tasks |
| Risk < 35 + no other triggers | 🌟 You're doing great — positive reinforcement |

#### Check-In Form `[AI for Good]`
- Collapsible — auto-opens for first check-in, collapsed after that
- **Tap-button 1–5 scales** (no dropdowns — optimised for mobile)
- 3-option energy demand picker (Low / Medium / High)
- Optional notes textarea
- On submit: risk score recalculated, Firestore + localStorage updated

#### Impact Footer `[Smart Cities]`
- Mini stats panel: placements tracked, 87% retention at 90 days, high-risk flags resolved
- Circular economy framing: *"Every check-in strengthens Singapore's adoption retention model"*

---

### 5. City Impact Dashboard `[Smart Cities]` `[AI for Good]`

Expandable card in the **👤 Profile tab**. Gives the sustainability argument a measurable evidence layer.

- **Headline stats** — total animals matched, 90-day retention rate, high-risk flags resolved
- **Monthly retention trend chart** — Recharts AreaChart, placements (orange) vs. retained (green), 6-month rolling window
- **Circular economy narrative** — adoption retention → fewer returns → fewer strays → less shelter pressure, with estimated returns avoided
- **Your contribution** — personal check-in progress bar, framing that user data improves future city-level matching
- Labelled: *Smart Cities · Circular Adoption Economy · NTU Pinnacle Prize 2026*

---

### 6. Breed Guide

- Comprehensive reference for Singapore-relevant dog breeds
- Each card: temperament, energy level, grooming needs, exercise requirements, HDB eligibility
- **HDB Approved** / **Not HDB Approved** badges
- Full detail modal with personality traits and care notes
- Accessible from the Guide tab and via shortcut in Profile

---

### 7. Community `[Smart Cities]`

- Join and leave community groups — persists to Firestore
- Create text posts within groups
- Reply threads on each post
- Groups: MBTI-themed spaces (e.g. INTJ Owners, ENFP Pack) + Singapore-specific (Singapore Specials, HDB Dog Owners, Cat Welfare)

---

### 8. Nearby Pet-Friendly Places (Map) `[Smart Cities]`

- Leaflet map with curated Singapore pet-friendly spots
- Categories: dog runs, parks, cafés, vets, grooming, boarding
- Real locations: West Coast Park, East Coast Park, MacRitchie, Bishan-AMK dog run, etc.

---

### 9. 30-Day New Owner Guide `[AI for Good]`

Full-screen guided checklist overlay, accessible from Profile. Persists completed tasks to Firestore.

**4 weeks · 30+ tasks** covering:
- Week 1: AVS licence, microchip transfer, leash law ($200 fine), home setup
- Week 2: First vet visit, vaccination schedule, flea/tick/heartworm prevention
- Week 3: Basic obedience, leash manners, socialisation
- Week 4: Routine, dog parks, insurance, advanced socialisation

**Task features:** expandable detail · legal badge · SGD cost badge · Firestore-synced checkboxes · progress bar

**Built-in guides:** First Vet Visit · Project ADORE (HDB compliance) · Week 1 FAQ · HDB Etiquette · Singapore Dog Laws · Heat Safety · Heatstroke Emergency · Tick & Flea Prevention · Leptospirosis · Skin & Coat Health · Breed Heat Tolerance · Wet Season Care

**Seasonal banners:** Heat reminder (year-round) · Wet season alert (Oct, Nov, Dec, Jan, Apr, May)

---

### 10. Health Passport & Vet Tracker `[Smart Cities]`

Dedicated 🏥 **Health tab** — digital health record for the owner's adopted pet.

**Pet Profile:** name, species, breed, DOB, gender, colour, AVS licence number, microchip ID, licence renewal date, sterilised toggle, booster toggle

**Singapore Compliance Checklist:** AVS licence · microchip · sterilised · annual booster · HDB window mesh (HDB residents only)

**Auto-computed reminders:** vaccine overdue 🔴 · vaccine due soon 🟡 · AVS licence renewal 🔴/🟡 · active medications count · no heartworm prevention logged · no tick/flea prevention logged

**Sections:** Vaccines · Vet Visits · Medications (active/past split) · Weight (Recharts AreaChart, 2+ entries) · Symptoms (multi-select chips + severity + "Share with Vet" clipboard copy)

---

### 11. User Profile

- MBTI type hero card with letter breakdown
- Lifestyle summary: activity level, living space, daily time, experience
- **City Impact Dashboard** (section 5 above)
- **Breed Guide** shortcut card
- **30-Day Guide** progress card with live progress bar
- Retake Quiz button (resets all data and re-runs onboarding)
- Log out (Firebase Auth, no-op in guest mode)

---

### 12. Authentication (Optional)

- Email/password signup + Google login via Firebase Auth
- Persistent sessions across reloads
- Per-user scoped data in Firestore (`users/{uid}`)
- **Graceful offline fallback** — if no Firebase config is present, app runs entirely in localStorage guest mode. No white screen, no crash.

---

## Data Architecture

### Firestore Document (`users/{uid}`)
```
{
  profile: {
    mbti, livingSpace, activityLevel, timeAvailable, experience
  },
  likedAnimals:       [{ id, name, species, breed, score, … }],
  passedIds:          [id, …],
  onboardingProgress: { completedTasks: [taskId, …] },
  joinedCommunities:  [communityId, …],
  postAdoptionData: {
    adoptedAnimalId: string,
    adoptionDate:    ISO string,
    latestRiskScore: number (0–100),
    latestRiskBand:  "Low risk" | "Moderate risk" | "High risk",
    checkIns: [{
      id, createdAt, adoptedAnimalId,
      petAdjustment (1–5), routineConsistency (1–5),
      ownerStress (1–5), behaviorConcerns (1–5),
      petEnergyDemand ("low"|"medium"|"high"), notes
    }]   // capped at 12 entries
  },
  healthPassport: {
    petName, petSpecies, petBreed, dateOfBirth, gender, colour,
    avsLicenceNumber, microchipId, avsLicenceRenewalDate,
    sterilised, annualBoosterUpToDate,
    vaccinations:  [{ id, vaccine, date, nextDueDate, clinic, notes }],
    vetVisits:     [{ id, date, clinic, vetName, diagnosis, treatment, notes }],
    medications:   [{ id, name, dosage, frequency, startDate, endDate, active }],
    weights:       [{ id, date, kg }],
    symptoms:      [{ id, date, symptoms[], severity, notes }],
  }
}
```

### localStorage Cache Keys (per user, scoped by uid or "guest")
| Key | Contents |
|---|---|
| `pawmatch_{uid}_profile` | Onboarding quiz profile |
| `pawmatch_{uid}_liked` | Liked animals array |
| `pawmatch_{uid}_passed` | Passed animal IDs |
| `pawmatch_{uid}_health` | Health passport object |
| `pawmatch_{uid}_post_adoption` | Post-adoption data + check-ins |

---

## Singapore-Specific Compliance Features

| Feature | Detail |
|---|---|
| AVS dog licence | Required within 30 days; $15/yr sterilised · $90/yr unsterilised |
| Leash law | Required in all public areas; **$200 fine** — shown upfront in Week 1 |
| HDB breed filter | Only AVS-approved small breeds shown to HDB residents in Discover |
| Microchip tracking | Logged in Health Passport, checked in compliance list |
| Waste pick-up | **$1,000 fine** — noted in HDB etiquette and legal guides |
| Project ADORE | Full 6-step workflow for existing HDB owners with non-approved breeds |
| Leptospirosis | Dedicated guide + vaccine schedule; note that standard C5 does NOT cover Lepto |
| Heat safety | Walk timing reminders (before 9am / after 7pm), heatstroke guide, 24hr vet list |
| Wet season | Seasonal alert banner + dedicated paw-care and fungal infection guide |

---

## Running Locally

```bash
git clone https://github.com/9irija/PawMatch-Pinnacle.git
cd PawMatch-Pinnacle
npm install
npm run dev
```

Open **http://localhost:5173/PawMatch-Pinnacle/** (or the port shown in your terminal).

The app runs in **guest mode** with no Firebase config — all data saved to localStorage. To enable Firebase (auth + cross-device sync), create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## Deploying to GitHub Pages

```bash
npm run build
npx gh-pages -d dist -r https://github.com/9irija/PawMatch-Pinnacle.git
```

Then on GitHub: **Settings → Pages → Branch: gh-pages → Save**

---

## Repository

- **Source (master branch):** https://github.com/9irija/PawMatch-Pinnacle
- **Live demo:** https://9irija.github.io/PawMatch-Pinnacle/
- **Original upstream:** https://github.com/Yichen930/PawMatch
