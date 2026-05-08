# LAKSHMAN — Phased Development Plan
> **Status Tracker** | Last updated: manually update after each phase

---

## 📌 About This Document

This is the **living master plan** for LAKSHMAN. Every time you start a new session or begin a new phase, **read this file first**. Check the status of each task, update the progress stats at the top of each phase, and continue from where you left off.

> **UI/UX Reference:** All visual design decisions, screen layouts, component references, color systems, and Google Stitch references live in → **`ui.md`**
> Do not make any UI decisions without consulting `ui.md` first. That file is the single source of truth for every pixel.

### Execution Rules (Mandatory)

1. **Phase Gate Rule:** Before starting any next phase, the current phase must pass a quick quality gate:
   - project builds without errors
   - no newly introduced lint errors
   - planned phase tasks are completed and checked
2. **Progress Update Rule:** After every completed task and phase, immediately update:
   - phase status (`⬜` / `🔄` / `✅`)
   - phase progress numbers
   - overall progress table and total completion %
3. **Git Rule:** At the end of each phase, prepare a milestone commit using the planned message style (`feat:`, `fix:`, etc.).
4. **Push Confirmation Rule:** **Never push automatically.** Push to GitHub only after explicit user confirmation.
5. **Repo Link Rule:** Primary GitHub remote for this project is `https://github.com/Ghost5400/lakshman`.
6. **Phase Verification Rule:** After every completed phase, provide a short tester-facing note: what UI/behavior should now be visible, how key flows should work, and 3+ manual verification steps with expected outcomes (including Vercel checks when deployed).

---

## 🏥 About LAKSHMAN

**LAKSHMAN** (tagline: *"Offline Smart Symptom Checker & Emergency First Aid Assistant"*) is a fully offline, zero-backend healthcare awareness web app built for students and young adults who lack quick access to medical guidance.

It is **not** a diagnostic tool. It is an awareness, triage, and first-response assistant that works without any internet connection.

**The core problem it solves:** Students in hostels, remote campuses, or travel situations often face health uncertainty with no doctor nearby and no reliable internet. LAKSHMAN gives them a trustworthy first checkpoint — telling them whether to rest, be cautious, or call emergency services immediately.

**Tech Stack:** React + Vite · TailwindCSS · React Router v6 · Local JSON datasets · No backend · No APIs · Deployable on Vercel (free tier)

---

## ✨ Feature Overview (Complete)

### Module 1 — Smart Symptom Checker
The primary module. Users select or type symptoms from a curated list of ~30. The app runs a **weighted scoring engine** (`matcher.js`) that compares symptoms against 16 diseases across 4 categories (Infectious, Chronic, Localized, Emergency).

- **Tag-style symptom input** — searchable, tap to add/remove
- **Weighted overlap scoring** — each symptom has a per-disease weight; coverage ratio applied
- **Top 3 results** — illness name, confidence %, severity level (Low / Medium / High)
- **Precautions list** — actionable steps per illness
- **"See a Doctor" nudge** — shown on High severity results
- **Emergency override** — if any emergency symptom is present (chest pain, unconsciousness, seizure, breathing difficulty, severe bleeding), scoring is bypassed entirely and the Emergency Modal fires immediately

### Module 2 — Emergency First Aid Guide
A quick-reference offline guide for 12 emergency types. Accessible via the bottom nav at any time.

**Categories:**
Heart Attack · Drowning · Vomiting · Dehydration · Burns · Snake Bite · Frostbite · Sprain · Muscle Cramp · Cuts & Bruises · Fractures · Dislocation

**Special handling:**
- **Burns** — Three sub-types: First Degree, Second Degree, Third Degree. Each has treatment steps, danger warnings, and strict do/don't lists
- **Fractures** — Five sub-types: Greenstick, Spiral, Comminuted, Compound, Dislocation. Each has immobilization guidance, movement warnings, and temporary stabilization steps
- All guides follow a consistent **Do / Don't / Warning** structure
- Third Degree Burns and Compound Fractures explicitly flag as **LIFE THREATENING**

### Module 3 — Calming & Breathing Assistant
A panic/stress relief tool built around guided breathing cycles.

- **Animated breathing circle** — scales up on inhale, holds, scales down on exhale (CSS keyframes)
- **Phase labels** — "Inhale", "Hold", "Exhale" synced to animation
- **Default cycle:** 4s inhale · 4s hold · 6s exhale
- **Cycle counter** — tracks how many full cycles completed
- **Panic mode note** — brief text explaining why breathing helps anxiety

### Cross-Cutting Features
- **Emergency Modal** — full-screen red overlay triggered by emergency symptoms. Shows immediate action list + "CALL 108" button
- **Bottom navigation** — three tabs always accessible (Symptom Checker | First Aid | Breathe)
- **Mobile-first responsive layout** — designed for 375px viewports
- **Zero network dependency** — all data is bundled JSON, no fetch calls at runtime
- **Optional PWA** — stretch goal: service worker + manifest for "Add to Home Screen"

---

## 📊 Overall Progress

| Phase | Name | Status | Tasks Done | Tasks Total |
|-------|------|--------|------------|-------------|
| 1 | Foundation & Data Layer | ✅ Done | 8 | 8 |
| 2 | Matching Engine & Logic | ✅ Done | 6 | 6 |
| 3 | Symptom Checker UI | ✅ Done | 7 | 7 |
| 4 | First Aid Module | ⬜ Not Started | 0 | 6 |
| 5 | Breathing Module & Nav | ⬜ Not Started | 0 | 5 |
| 6 | Polish, PWA & Deploy | ⬜ Not Started | 0 | 7 |

**Total:** 21 / 39 tasks complete · 54% done

> **How to update:** Change `⬜ Not Started` → `🔄 In Progress` → `✅ Done`. Update the numbers in Tasks Done column. Recalculate the total at the bottom.

---

---

## Phase 1 — Foundation & Data Layer

**Goal:** Project scaffold is running, all three JSON datasets are complete, folder structure is in place.
**Estimated time:** 45–60 min
**Status:** ✅ Done
**Progress:** 8 / 8 tasks

### Stats
- Tasks complete: **8 / 8**
- Blockers: none
- Notes: Phase 1 milestone committed and pushed.

### Tasks

- [x] **1.1** Scaffold project: `npm create vite@latest lakshman -- --template react`
- [x] **1.2** Install dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `react-router-dom`
- [x] **1.3** Configure Tailwind (`tailwind.config.js`, `index.css` with directives)
- [x] **1.4** Create folder structure as defined (`src/data`, `src/engine`, `src/components/ui`, `src/components/symptom`, `src/components/firstaid`, `src/components/breathe`, `src/pages`)
- [x] **1.5** Build `symptoms.json` — flat array of ~30 symptom strings
- [x] **1.6** Build `diseases.json` — 16 diseases with symptom arrays, weight maps, severity, precautions, seekHelp flag
- [x] **1.7** Build `firstaid.json` — 12 categories, with full subtypes for burns (3) and fractures (5)
- [x] **1.8** Commit: `init: scaffold + tailwind + data layer`

### diseases.json Schema (reference)
```json
{
  "id": "influenza",
  "name": "Influenza (Flu)",
  "category": "infectious",
  "symptoms": ["fever", "headache", "cough", "fatigue", "body-ache", "chills"],
  "weights": { "fever": 3, "headache": 2, "cough": 2, "fatigue": 2, "body-ache": 3, "chills": 3 },
  "severity": "medium",
  "precautions": ["Rest for 24–48 hours", "Drink fluids every 2 hours", "Monitor temperature"],
  "seekHelp": false
}
```

### Diseases to include
**Infectious:** Influenza, Common Cold, COVID-19, Chickenpox, Strep Throat
**Chronic:** Asthma, Diabetes Type 2, Hypertension, COPD, Gout
**Localized:** Migraine, Allergies, Ringworm, Athlete's Foot
**Emergency-adjacent:** (handled via emergency override, not disease cards)

---

---

## Phase 2 — Matching Engine & Core Logic

**Goal:** `matcher.js` is complete, tested in browser console, returns correct results for known inputs.
**Estimated time:** 30–45 min
**Status:** ✅ Done
**Progress:** 6 / 6 tasks

### Stats
- Tasks complete: **6 / 6**
- Blockers: none
- Notes: `matcher.js` implemented and validated with emergency + disease scoring test cases.

### Tasks

- [x] **2.1** Create `src/engine/matcher.js`
- [x] **2.2** Implement `checkEmergency(symptoms[])` — returns `true` if any of the 5 emergency symptoms present
- [x] **2.3** Implement `scoreDisease(inputSymptoms, disease)` — weighted score × coverage ratio
- [x] **2.4** Implement `runMatcher(inputSymptoms)` — returns `{ emergency: bool, results: [] }` with top 3, each with `confidence` %
- [x] **2.5** Manually test in browser console with 3+ known inputs (fever+headache+cough → flu, chest-pain → emergency)
- [x] **2.6** Commit: `feat: symptom matching engine`

### Engine Logic (reference)
```js
// Emergency symptoms — checked before any scoring
const EMERGENCY = ["chest-pain", "unconsciousness", "seizure", "breathing-difficulty", "severe-bleeding"];

function scoreDisease(input, disease) {
  let score = 0, matched = [];
  for (const s of input) {
    if (disease.weights[s]) { score += disease.weights[s]; matched.push(s); }
  }
  const coverage = matched.length / disease.symptoms.length;
  return { score: score * coverage, matched };
}

export function runMatcher(input) {
  if (input.some(s => EMERGENCY.includes(s))) return { emergency: true, results: [] };
  const scored = diseases
    .map(d => ({ ...d, ...scoreDisease(input, d) }))
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score);
  const max = scored[0]?.score || 1;
  return {
    emergency: false,
    results: scored.slice(0, 3).map(d => ({ ...d, confidence: Math.round((d.score / max) * 100) }))
  };
}
```

---

---

## Phase 3 — Symptom Checker UI

**Goal:** The symptom checker page is fully functional — input, results, and emergency modal all working end-to-end.
**Estimated time:** 60–75 min
**Status:** ✅ Done
**Progress:** 7 / 7 tasks

### Stats
- Tasks complete: **7 / 7**
- Blockers: none
- Notes: Symptom input, result cards, emergency modal, check/clear actions, and matcher integration completed per `ui.md`.

### Tasks

- [x] **3.1** Build `SymptomInput.jsx` — searchable text input, renders filtered suggestion list, adds symptom as a removable tag on select
- [x] **3.2** Build `ResultCard.jsx` — illness name, confidence bar, severity badge (color-coded), precautions list, conditional "See a Doctor" nudge
- [x] **3.3** Build `EmergencyModal.jsx` — full-screen red overlay, bold emergency headline, immediate action steps list, "CALL 108" CTA button, dismiss button
- [x] **3.4** Build `Home.jsx` — wire SymptomInput → runMatcher → conditional render (EmergencyModal or ResultCard list)
- [x] **3.5** Add "Check Symptoms" button — disabled until at least 1 symptom selected
- [x] **3.6** Add "Clear All" reset functionality
- [x] **3.7** Commit: `feat: symptom checker UI complete`

### Component Notes
- `SymptomInput`: filter `symptoms.json` against current input string, exclude already-added symptoms from suggestions
- `ResultCard`: severity badge — green for Low, amber for Medium, red for High
- `EmergencyModal`: rendered via React portal or conditional absolute positioning; z-index highest; pulsing red border animation
- `Home.jsx` state: `symptoms[]`, `results{}`, `showEmergency: bool`

---

---

## Phase 4 — First Aid Module

**Goal:** First Aid page shows all 12 category cards. Tapping any card navigates to its detail view with full dos/don'ts/warnings. Burns and fractures show sub-type selection.
**Estimated time:** 45–60 min
**Status:** ⬜ Not Started
**Progress:** 0 / 6 tasks

### Stats
- Tasks complete: **0 / 6**
- Blockers: Phase 1 must be complete (needs firstaid.json)
- Notes: Refer to `ui.md` for card grid layout and detail page structure

### Tasks

- [ ] **4.1** Build `CategoryGrid.jsx` — 2-column card grid, each card shows icon + name, tappable
- [ ] **4.2** Build `GuideDetail.jsx` — renders a first aid category's content: description, dos list (green), donts list (red), warning banner (if present)
- [ ] **4.3** Add sub-type selector for Burns — tab or pill selector for First / Second / Third Degree, content swaps on selection
- [ ] **4.4** Add sub-type selector for Fractures — same pattern, 5 types
- [ ] **4.5** Build `FirstAid.jsx` page — manages selected category state, toggles between grid view and detail view
- [ ] **4.6** Commit: `feat: first aid module complete`

### firstaid.json Schema (reference)
```json
{
  "id": "burns",
  "name": "Burns",
  "icon": "🔥",
  "subtypes": [
    {
      "id": "burns-1", "label": "First Degree",
      "description": "Redness, minor pain, no blisters",
      "dos": ["Cool under running water 10+ min", "Cover loosely with sterile gauze"],
      "donts": ["Do NOT use ice or butter", "Do NOT pop blisters"],
      "warning": null
    },
    {
      "id": "burns-3", "label": "Third Degree",
      "description": "Charred or white skin, no pain (nerve damage)",
      "dos": ["Call 108 immediately", "Cover loosely, do not remove stuck clothing"],
      "donts": ["Do NOT apply water", "Do NOT apply any cream"],
      "warning": "LIFE THREATENING — Emergency services required immediately"
    }
  ]
}
```

---

---

## Phase 5 — Breathing Module & Navigation

**Goal:** Breathing timer works with animated circle, phase labels, and cycle counter. Bottom navigation is functional across all three pages.
**Estimated time:** 30–45 min
**Status:** ⬜ Not Started
**Progress:** 0 / 5 tasks

### Stats
- Tasks complete: **0 / 5**
- Blockers: Phase 3 and 4 should be done (nav needs all pages to exist)
- Notes: Refer to `ui.md` for breathing animation specs and nav bar design

### Tasks

- [ ] **5.1** Build `BreathCircle.jsx` — animated SVG or div circle; CSS keyframes scale 0.6→1.0 (inhale), hold 1.0, scale 1.0→0.6 (exhale); animation-duration driven by phase timings
- [ ] **5.2** Build `BreathingTimer.jsx` — manages phase state machine (inhale → hold → exhale → inhale), countdown within each phase, cycle counter increments on exhale completion
- [ ] **5.3** Build `Breathe.jsx` page — assembles BreathCircle + BreathingTimer, start/pause control, short explanation text
- [ ] **5.4** Build bottom navigation component — three tabs (Symptom Checker / First Aid / Breathe), active tab highlighted, fixed to bottom on mobile
- [ ] **5.5** Commit: `feat: breathing module + navigation complete`

### Breathing Phase Timings (default)
| Phase | Duration | Animation |
|-------|----------|-----------|
| Inhale | 4s | Scale 0.6 → 1.0 |
| Hold | 4s | Hold at 1.0 |
| Exhale | 6s | Scale 1.0 → 0.6 |
| Total cycle | 14s | — |

---

---

## Phase 6 — Polish, PWA & Deploy

**Goal:** App looks polished, feels fast, passes mobile viewport check, is deployed to Vercel with a public URL ready for judges.
**Estimated time:** 30–45 min
**Status:** ⬜ Not Started
**Progress:** 0 / 7 tasks

### Stats
- Tasks complete: **0 / 7**
- Blockers: Phases 1–5 must be complete
- Notes: Deploy early (at start of this phase) to catch Vercel config issues before the deadline

### Tasks

- [ ] **6.1** **Deploy first** — `vercel --prod` from project root, confirm public URL works on mobile browser
- [ ] **6.2** Tailwind styling pass — enforce design system colors, spacing, badge colors, emergency modal red, bottom nav active state
- [ ] **6.3** Test all flows on 375px mobile viewport (DevTools), fix any overflow or touch target issues
- [ ] **6.4** Add smooth page transitions (Tailwind `transition` classes or simple CSS fade)
- [ ] **6.5** *(Stretch)* Add `vite-plugin-pwa` — manifest.json + service worker for "Add to Home Screen" — ~20 min
- [ ] **6.6** *(Stretch)* Add confidence bar CSS fill animation (transition width on load)
- [ ] **6.7** Final commit: `deploy: production build v1.0` · tag as `v1.0`

### Vercel Deploy Commands
```bash
npm install -g vercel   # first time only
vercel login
vercel --prod
```

### Pre-demo Checklist
- [ ] Public URL opens on phone browser
- [ ] Symptom checker: fever + headache + cough → Influenza result visible
- [ ] Emergency trigger: add chest-pain → red modal fires
- [ ] First Aid: Burns → Third Degree → LIFE THREATENING warning visible
- [ ] Breathe: circle animates through at least 2 full cycles
- [ ] Bottom nav switches pages correctly

---

---

## 🗂 Commit Log

Track every commit here for quick reference.

| # | Hash (short) | Message | Phase |
|---|-------------|---------|-------|
| 1 | `56ee396` | `init: scaffold + tailwind + data layer` | 1 |
| 2 | `5ac3ef9` | `feat: symptom matching engine` | 2 |
| 3 | — | `feat: symptom checker UI complete` | 3 |
| 4 | — | `feat: first aid module complete` | 4 |
| 5 | — | `feat: breathing module + navigation complete` | 5 |
| 6 | — | `deploy: production build v1.0` | 6 |

> Fill in the short hash after each commit using `git log --oneline -1`

---

## ⚠️ Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| JSON data entry takes too long | Medium | High | Pre-generate diseases.json using this doc's schema as template, fill in bulk |
| Breathing animation timing off | Low | Low | Use `setInterval` + state machine, not CSS-only |
| Vercel deploy fails | Low | High | Deploy at Phase 6 start, not end |
| Mobile layout breaks | Medium | Medium | Test at 375px after every phase, not just at end |
| Symptom matcher returns wrong results | Low | High | Console-test 5 known inputs before building UI |

---

## 📎 File Reference

| File | Purpose |
|------|---------|
| `LAKSHMAN_PLAN.md` | This file — master execution plan |
| `ui.md` | All UI/UX specs, screen layouts, component designs, Google Stitch references |
| `src/data/diseases.json` | 16 diseases with weights and metadata |
| `src/data/symptoms.json` | Master symptom list for autocomplete |
| `src/data/firstaid.json` | 12 emergency categories with sub-types |
| `src/engine/matcher.js` | Weighted symptom scoring engine |

---

*This plan is designed to be read by a developer (or AI assistant) at the start of each work session. Check statuses, update progress numbers, and execute the next incomplete task in sequence.*
