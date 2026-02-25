# PawMatch 🐾

A Singapore-specific pet adoption and owner companion app. PawMatch uses personality-based matching to help prospective owners find their ideal dog or cat, then supports them through adoption with health tracking, compliance checklists, climate guides, and community features.

Built with React + Vite, Firebase Auth + Firestore, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS |
| Auth & Database | Firebase (Auth + Firestore) |
| Charts | Recharts |
| Hosting | Vite build → static deploy |
| State | React `useState` / `useEffect` |
| Persistence | Firestore (source of truth) + `localStorage` (instant cache) |

---

## Features

### 1. Authentication
- Email / password sign-up and login via Firebase Auth
- Persistent sessions across page reloads
- Per-user scoped data in Firestore (`users/{uid}`)

---

### 2. Personality-Based Onboarding Quiz
- New users complete a short profile quiz before seeing any animals
- Captures: MBTI personality type, living situation (HDB / condo / landed), lifestyle, activity level, and pet preferences
- HDB users are automatically filtered to AVS-approved breeds only
- Profile stored in Firestore and cached in localStorage

---

### 3. Discover — Tinder-Style Pet Matching
- Swipe-card stack with touch + mouse drag gesture support
- Animals sorted by **compatibility score** computed from MBTI match, energy level, living space, and lifestyle
- **Species filter**: All · Dogs · Cats
- **HDB filter**: automatically hides non-approved breeds for HDB residents
- Swipe right → liked, swipe left → passed
- Match modal on every right-swipe showing compatibility score breakdown

---

### 4. My Matches
- Grid of all liked animals sorted by match score (highest first)
- Score badge on each card
- Empty state with prompt to discover more animals

---

### 5. Breed Guide
- Comprehensive guide to Singapore-relevant dog breeds
- Each breed card shows: temperament, energy level, grooming needs, exercise requirements, suitability for HDB
- **HDB Approved** / **Not HDB Approved** badges
- Full detail modal with personality traits and care notes

---

### 6. Community
- Join and leave community groups
- Create text posts within groups
- Reply threads on each post
- Groups include MBTI-themed spaces (e.g. INTJ Owners) and Singapore-specific groups (Singapore Specials, HDB Dog Owners)
- Joined communities persist in Firestore

---

### 7. Nearby Pet-Friendly Places (Map)
- Curated list of pet-friendly spots in Singapore
- Categories: dog runs, parks, cafés, vets, grooming, boarding
- Map view with location markers
- Singapore-specific data (West Coast Park, East Coast Park, MacRitchie, etc.)

---

### 8. 30-Day New Owner Guide

A full-screen guided checklist overlay accessible from the Profile tab. Persists progress in Firestore.

#### Weekly Checklists (30+ tasks across 4 weeks)

**Week 1 — Settling In**
- Know the public leash law — **$200 fine** (legal badge, upfront in Week 1)
- Register AVS dog licence (legal badge, costs: $15/yr sterilised · $90/yr unsterilised)
- Verify microchip registration and ownership transfer
- Buy the essentials (leash, collar, bowls, crate)
- Introduce dog to HDB neighbours
- Set up home base / safe zone
- Establish toilet training spot
- Dog-proof the flat (cables, toxic plants, balconies)
- Set consistent feeding schedule

**Week 2 — Health & Hygiene**
- Schedule and attend first vet visit
- Confirm and plan vaccination schedule
- Start flea & tick prevention
- Discuss heartworm prevention
- Complete deworming protocol
- Continue toilet training
- Introduce bath and grooming routine

**Week 3 — Training & Socialisation**
- Begin basic obedience: sit, stay, come, leave it
- Practice leash manners in HDB corridor
- First outdoor walk (cool hours: before 9am / after 7pm)
- Book professional grooming appointment
- Join local dog owner community
- Begin structured socialisation (people, sounds, surfaces)

**Week 4 — Into Routine**
- Establish consistent daily walk schedule
- Continue advanced socialisation (dog parks, cafés)
- Book group obedience class
- Practice leash manners in public (void decks, hawker centres)
- Master HDB common area etiquette (legal badge)
- Review and consolidate toilet training
- Schedule next vet visit, consider pet insurance

#### Task Features
- Tap any task to expand full detail
- Checkbox to mark complete — syncs to Firestore in real time
- **Legal badge** on legally required tasks
- **Cost estimate** badge (SGD) on applicable tasks
- Week summary card with live progress bar
- Overall progress bar and percentage counter

#### Special Guides (accordion, always accessible)

| Guide | Contents |
|---|---|
| 🏥 First Vet Visit Guide | What to bring, what happens at the visit, core vaccination schedule (C5/Lepto/Rabies), estimated costs in SGD |
| 🏠 Project ADORE Guide | 6-step workflow: eligibility check, AVS application, home assessment, temperament check criteria (pass/fail), trial period rules, final approval conditions |
| ❓ Week 1 FAQ | Hiding behaviour, not eating, whining at night, toilet accidents, fear response, exploring the flat, washing timing |
| 🏢 HDB Dog Etiquette | Corridor leashing, lift etiquette, waste pick-up ($1,000 fine), barking management, approved breeds, stray feeding |
| ⚖️ Singapore Dog Laws | AVS licence, microchipping, leash in public, waste pick-up, rabies, HDB breed rules, dangerous dogs |

#### Climate & Wellness Guides (accordion)

| Guide | Contents |
|---|---|
| ☀️ Walk Timing & Heat Safety | Safe walk hours, 60°C pavement test, cooling at home, never leave dog in car |
| 🌡️ Heatstroke: Symptoms & Emergency | Recognition checklist, 4-step immediate response, 5 named 24-hour Singapore vet clinics with phone numbers |
| 🦟 Monthly Tick & Flea Prevention | Year-round SG risk, product guide (NexGard, Bravecto, Frontline, Seresto), post-walk tick check protocol |
| 🧫 Leptospirosis Risk in Singapore | Rat urine transmission, flooding risk, symptom checklist, Lepto-4 vaccine schedule, note that standard C5 does NOT cover Lepto |
| 🪮 Skin & Coat Health in Humidity | Grooming frequency by coat type (6 coat categories), hot spot prevention, ear care, red flag signs |
| 🐕 Breed Heat Tolerance Guide | Heat-adapted breeds (SG Special, Basenji, Thai Ridgeback) vs heat-sensitive (brachycephalics, arctic double-coats) with specific care tips |
| 🌧️ Wet Season Dog Care | Monsoon calendar (Oct–Jan, Apr–May), paw drying protocol, inter-paw fungal infection prevention, lightning safety |

#### Seasonal Alert Banners
- **Heat banner** (shown year-round): walk before 9am or after 7pm reminder
- **Wet season banner** (Oct, Nov, Dec, Jan, Apr, May): Leptospirosis and paw-drying reminder

---

### 9. Health Passport & Vet Tracker

A dedicated 🏥 Health tab providing a digital health record for the owner's pet. Data stored in Firestore under `users/{uid}.healthPassport` with localStorage cache.

#### Pet Profile Setup
- Pet name, species (dog / cat / rabbit), breed, date of birth, gender, colour
- AVS licence number, microchip ID, AVS licence renewal date
- Sterilised toggle, annual booster up-to-date toggle
- Photo upload placeholder (coming soon)

#### Singapore Compliance Checklist (Overview tab)
- AVS Dog Licence (tick if licence number entered)
- Microchip Implanted (tick if microchip ID entered)
- Sterilised (toggleable)
- Annual Booster Up to Date (toggleable)
- HDB Window Mesh Fitted (shown only for HDB residents — awareness item)

#### Health Reminders Panel (Overview tab)
Automatically computed reminder pills:
- 🔴 Vaccine booster overdue
- 🟡 Vaccine due within 30 days (shows days remaining)
- 🔴 / 🟡 AVS licence renewal within 60 days
- ℹ️ Active medications count
- 🟡 No heartworm prevention logged (dogs only)
- 🟡 No tick & flea prevention logged

#### HDB Alert
Amber banner shown for HDB residents reminding them of the mandatory window mesh requirement.

#### Sections

**Vaccines**
- Log vaccinations: vaccine type (DHPP, Rabies, Bordetella, Lepto, Canine Influenza, etc.), date given, next due date, clinic, notes
- Status badge per entry: 🟢 Up to date / 🟡 Due soon / 🔴 Overdue
- Sorted newest-first
- Delete entries

**Vet Visits**
- Log visits: date, clinic, vet name, diagnosis, treatment, notes
- Expandable cards (tap to reveal full detail)
- Sorted newest-first
- Delete entries

**Medications**
- Log medications: name, dosage, frequency (daily / twice daily / weekly / monthly / as needed), start date, end date
- Active / Past split view
- Inline toggle to mark as inactive (moves to Past)
- Delete entries

**Weight**
- Log weight entries: kg + date
- **Recharts AreaChart** with orange gradient (renders when 2+ entries present)
- Latest weight stat displayed prominently
- Full history list
- Inline form (no sheet overlay)

**Symptoms**
- Multi-select symptom chips (14 predefined options: lethargy, vomiting, diarrhoea, coughing, limping, etc.)
- Severity picker: Mild / Moderate / Severe
- Date and notes fields
- **"Share with Vet"** button — copies formatted health log to clipboard (works per log card and in the sheet)
- Delete entries

---

### 10. User Profile
- Displays MBTI type, living situation, preferences from onboarding
- User avatar (initials)
- **Retake matching quiz** — clears all swipe history and restarts onboarding
- **Open 30-Day Guide** — launches the OwnerOnboarding overlay
- Onboarding progress indicator

---

## Data Architecture

### Firestore Document (`users/{uid}`)
```
{
  profile:             { mbti, livingSpace, activityLevel, … },
  likedAnimals:        [{ id, name, species, score, … }],
  passedIds:           [id, …],
  onboardingProgress:  { completedTasks: [taskId, …], startedAt: ISO },
  joinedCommunities:   [communityId, …],
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

### localStorage Cache Keys (per user)
| Key | Contents |
|---|---|
| `pawmatch_{uid}_profile` | User onboarding profile |
| `pawmatch_{uid}_liked` | Liked animals array |
| `pawmatch_{uid}_passed` | Passed animal IDs |
| `pawmatch_{uid}_health` | Health passport object |

---

## Singapore-Specific Compliance Features

| Feature | Detail |
|---|---|
| AVS licence | Required within 30 days of ownership; $15/yr (sterilised) · $90/yr (unsterilised) |
| Leash law | Required in all public areas; **from $200 fine** — displayed upfront in Week 1 |
| HDB breed filter | Only 35 AVS-approved small breeds shown to HDB residents in Discover |
| Microchip tracking | Logged in Health Passport, checked in compliance list |
| Waste pick-up | $1,000 fine — noted in HDB etiquette and legal guides |
| Project ADORE | Full 6-step workflow for existing HDB owners with non-approved breeds |
| Leptospirosis | Dedicated guide + vaccine schedule given SG's rat/flood risk |
| Heat safety | Walk timing reminders, heatstroke guide, 24hr vet clinic list |
| Wet season | Seasonal alert banner + dedicated paw-care guide |

---

## Running Locally

```bash
npm install
npm run dev
```

Requires a `.env` file with Firebase config:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

```bash
npm run build   # production build to /dist
```
