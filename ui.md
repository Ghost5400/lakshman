# LAKSHMAN — UI/UX Reference Document (`ui.md`)

> **This is the single source of truth for all visual decisions in LAKSHMAN.**
> Every component, color, spacing, font, animation, and screen layout is defined here.
> Before writing any JSX, CSS, or Tailwind class — read the relevant section in this file.
> Do not invent colors, fonts, or layouts. Everything is documented below.

---

## 1. Tech & Style Foundation

### Framework
- **React + Vite**
- **TailwindCSS** with a custom config (defined in Section 3)
- **Material Symbols Outlined** icon font from Google Fonts
- **Plus Jakarta Sans** (headings/display) + **Inter** (body/UI) from Google Fonts

### Font Imports (copy into `index.html` `<head>`)
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

### Material Symbols Default Style
Add this in your global CSS or `<style>` block. All icons default to outline (FILL 0) unless explicitly overridden inline:
```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

To use a **filled** icon, add inline style on the element:
```html
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">medical_services</span>
```

---

## 2. Design Principles

1. **Calm by default, urgent when needed.** The baseline UI is airy, teal-washed, and low-stimulation. Emergency states break this deliberately with full red.
2. **Mobile-first, thumb-friendly.** The bottom navigation is always fixed and visible. Critical actions live in the bottom third of the screen.
3. **Fast to scan.** Users open this app when anxious. Avoid walls of text. Use icons + short labels everywhere.
4. **No clutter.** Generous whitespace. Cards breathe. Nothing competes for attention.
5. **Offline-ready signal.** The "Offline Ready" badge in the header reinforces trust constantly.

---

## 3. Tailwind Configuration

This is the **exact** Tailwind config used across all screens. Copy this into `tailwind.config.js`:

```js
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surfaces
        "background":                "#f5faf8",
        "surface":                   "#f5faf8",
        "surface-bright":            "#f5faf8",
        "surface-dim":               "#d6dbd9",
        "surface-variant":           "#dee4e1",
        "surface-container-lowest":  "#ffffff",
        "surface-container-low":     "#f0f5f2",
        "surface-container":         "#eaefed",
        "surface-container-high":    "#e4e9e7",
        "surface-container-highest": "#dee4e1",
        "inverse-surface":           "#2c3130",
        "inverse-on-surface":        "#edf2f0",

        // Primary (Teal)
        "primary":                   "#00685f",
        "primary-container":         "#008378",
        "primary-fixed":             "#89f5e7",
        "primary-fixed-dim":         "#6bd8cb",
        "on-primary":                "#ffffff",
        "on-primary-container":      "#f4fffc",
        "on-primary-fixed":          "#00201d",
        "on-primary-fixed-variant":  "#005049",
        "inverse-primary":           "#6bd8cb",
        "surface-tint":              "#006a61",

        // Secondary (Warm Gray)
        "secondary":                 "#645d58",
        "secondary-container":       "#eae1da",
        "secondary-fixed":           "#eae1da",
        "secondary-fixed-dim":       "#cec5bf",
        "on-secondary":              "#ffffff",
        "on-secondary-container":    "#6a635e",
        "on-secondary-fixed":        "#1f1b17",
        "on-secondary-fixed-variant":"#4b4641",

        // Tertiary (Burnt Orange)
        "tertiary":                  "#924628",
        "tertiary-container":        "#b05e3d",
        "tertiary-fixed":            "#ffdbce",
        "tertiary-fixed-dim":        "#ffb59a",
        "on-tertiary":               "#ffffff",
        "on-tertiary-container":     "#fffbff",
        "on-tertiary-fixed":         "#370e00",
        "on-tertiary-fixed-variant": "#773215",

        // Error (Red — Emergency)
        "error":                     "#ba1a1a",
        "error-container":           "#ffdad6",
        "on-error":                  "#ffffff",
        "on-error-container":        "#93000a",

        // Neutral / Text
        "on-background":             "#171d1c",
        "on-surface":                "#171d1c",
        "on-surface-variant":        "#3d4947",
        "outline":                   "#6d7a77",
        "outline-variant":           "#bcc9c6",

        // Semantic extras used in Burns detail view
        "green-50":  "#F0FDF4",
        "green-600": "#16A34A",
        "red-50":    "#FEF2F2",
        "red-600":   "#DC2626",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg:      "0.5rem",
        xl:      "0.75rem",
        full:    "9999px",
      },
      spacing: {
        margin:  "20px",
        lg:      "24px",
        base:    "4px",
        gutter:  "16px",
        xs:      "4px",
        sm:      "8px",
        md:      "16px",
        xl:      "32px",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans"],
        h1:      ["Plus Jakarta Sans"],
        h2:      ["Plus Jakarta Sans"],
        h3:      ["Plus Jakarta Sans"],
        body:    ["Inter"],
        small:   ["Inter"],
        micro:   ["Inter"],
      },
      fontSize: {
        display: ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "700"  }],
        h1:      ["22px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "700"  }],
        h2:      ["18px", { lineHeight: "24px", letterSpacing: "0em",     fontWeight: "600"  }],
        h3:      ["16px", { lineHeight: "22px", letterSpacing: "0em",     fontWeight: "600"  }],
        body:    ["15px", { lineHeight: "22px", letterSpacing: "0em",     fontWeight: "400"  }],
        small:   ["13px", { lineHeight: "18px", letterSpacing: "0.01em",  fontWeight: "400"  }],
        micro:   ["11px", { lineHeight: "14px", letterSpacing: "0.03em",  fontWeight: "500"  }],
      },
    },
  },
}
```

---

## 4. Color Usage Guide

This maps semantic intent to the token names. **Always use the token name, never hardcode hex in JSX.**

| Intent | Token | Example usage |
|--------|-------|---------------|
| App background | `bg-background` or `bg-surface` | `<body>`, page wrappers |
| Card surface | `bg-surface-container-lowest` | All white cards |
| Subtle card / hover | `bg-surface-container-low` | Hover states, nested sections |
| Section fill | `bg-surface-container` | Grouped content areas |
| Primary brand | `bg-primary` | Main buttons, active nav, CTAs |
| Primary tint | `bg-primary-container` | Selected symptom tags, active phase pill |
| Primary light bg | `bg-surface-container-low` | Page tint, teal wash backgrounds |
| Emergency / Danger | `bg-error` | Emergency modal full background |
| Danger light | `bg-error-container` | Danger badge backgrounds, warning pills |
| Success | `bg-green-600` text, `bg-green-50` bg | DO list sections in First Aid |
| Don't / Bad | `bg-red-600` text, `bg-red-50` bg | DON'T list sections in First Aid |
| Warning / Medium | `text-tertiary` | Medium severity (amber-adjacent) |
| Body text | `text-on-surface` | All primary readable text |
| Muted text | `text-on-surface-variant` | Labels, placeholders, helper text |
| Icon inactive | `text-on-secondary-fixed-variant` | Inactive bottom nav tabs |
| Border default | `border-outline-variant` | Card borders, input borders |
| Border stronger | `border-outline` | Dividers needing more contrast |

---

## 5. Typography Usage Guide

| Class pair | Where to use |
|-----------|--------------|
| `text-display font-display` | Emergency modal headline, major page headlines |
| `text-h1 font-h1 font-extrabold` | App name "LAKSHMAN" in header |
| `text-h1 font-h1` | Page titles (e.g. "Analysis Results", "What are your symptoms?") |
| `text-h2 font-h2` | Card titles, illness names, section headers |
| `text-h3 font-h3` | Sub-section labels, button labels, sub-card titles |
| `text-body font-body` | All body copy, list items, descriptions |
| `text-small font-small` | Labels, helper text, badge text, dropdown items |
| `text-micro font-micro` | Bottom nav labels, tag metadata, tiny annotations |

**Important:** Always use the `font-*` class alongside `text-*` to apply the correct font family.

---

## 6. Global Body & Layout

```html
<body class="bg-background text-on-background font-body antialiased min-h-screen flex flex-col pb-[64px] md:pb-0">
```

- `pb-[64px]` on body prevents content hiding behind the fixed bottom nav on mobile
- `md:pb-0` removes that padding on desktop (side nav is used instead)
- Page `min-height` should be `max(884px, 100dvh)` — set in global CSS:

```css
body {
  min-height: max(884px, 100dvh);
}
```

---

## 7. Component Specifications

---

### 7.1 Top App Bar (Header)

Used on all three main pages. Sticky, white surface, subtle bottom shadow.

```jsx
<header className="bg-surface shadow-sm sticky top-0 w-full flex justify-between items-center px-margin h-16 z-40">
  <div className="flex items-center gap-sm">
    <span className="material-symbols-outlined text-primary text-[24px]"
          style={{ fontVariationSettings: "'FILL' 1" }}>
      emergency_home
    </span>
    <div className="flex flex-col">
      <h1 className="text-h1 font-h1 font-extrabold text-primary tracking-tight">LAKSHMAN</h1>
      <span className="text-micro font-micro text-on-surface-variant">Offline Health Assistant</span>
    </div>
  </div>

  {/* Offline Ready Badge — always visible on Symptom Checker */}
  <div className="flex items-center bg-surface-container-low px-sm py-xs rounded-full border border-primary/20">
    <span className="material-symbols-outlined text-primary text-[14px] mr-1"
          style={{ fontVariationSettings: "'FILL' 1" }}>
      check_circle
    </span>
    <span className="text-micro font-micro text-primary font-semibold">Offline Ready</span>
  </div>
</header>
```

**Variants:**
- **Symptom Checker:** Shows wordmark + subtitle + "Offline Ready" badge
- **First Aid (grid):** Shows wordmark only, no badge
- **First Aid (detail):** Shows back arrow (left) + "Burns 🔥" centered + empty spacer div (right) for balance
- **Breathe:** Shows wordmark + hamburger/menu icon (right)

**First Aid Detail header:**
```jsx
<header className="bg-surface shadow-sm sticky top-0 z-40 w-full flex justify-between items-center px-margin h-16">
  <button className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors">
    <span className="material-symbols-outlined">arrow_back</span>
  </button>
  <h1 className="text-h1 font-h1 font-extrabold text-primary flex items-center gap-2">
    Burns <span className="text-2xl">🔥</span>
  </h1>
  <div className="w-10" /> {/* Balance spacer */}
</header>
```

---

### 7.2 Bottom Navigation Bar

Fixed to bottom on mobile (`md:hidden`). Always 64px tall. Three equal tabs.

```jsx
<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-gutter bg-surface-container-lowest border-t border-outline-variant h-[64px] md:hidden">

  {/* ACTIVE TAB example (Symptom Checker) */}
  <button className="flex flex-col items-center justify-center text-primary font-semibold w-full h-full scale-95 transition-transform hover:bg-surface-container-low group">
    <div className="bg-primary-container/20 rounded-full px-4 py-1 mb-1">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
    </div>
    <span className="text-micro font-micro">Checker</span>
  </button>

  {/* INACTIVE TAB example */}
  <button className="flex flex-col items-center justify-center text-on-secondary-fixed-variant w-full h-full hover:bg-surface-container-low transition-colors group">
    <div className="rounded-full px-4 py-1 mb-1">
      <span className="material-symbols-outlined">medical_services</span>
    </div>
    <span className="text-micro font-micro">First Aid</span>
  </button>

</nav>
```

**Tab definitions:**

| Tab | Icon (inactive) | Icon (active, FILL 1) | Label |
|-----|----------------|----------------------|-------|
| Symptom Checker | `stethoscope` | `stethoscope` filled | Checker |
| First Aid | `medical_services` | `medical_services` filled | First Aid |
| Breathe | `air` | `air` filled | Breathe |

**Active state rules:**
- `text-primary` on both icon and label
- `scale-95` on the button
- Optional: semi-transparent pill `bg-primary-container/20` wrapping the icon

**Inactive state rules:**
- `text-on-secondary-fixed-variant` on both icon and label
- Icon uses FILL 0 (default)

---

### 7.3 Desktop Side Navigation

Shown on `md:` and above. Left sidebar, 256px wide, fixed below the header.

```jsx
<div className="hidden md:flex fixed top-16 left-0 h-[calc(100vh-64px)] w-64 bg-surface-container-lowest border-r border-outline-variant flex-col py-lg z-40">
  
  {/* Active nav item */}
  <a className="flex items-center gap-md px-margin py-3 text-primary bg-primary-container/10 mx-sm rounded-lg font-semibold border-l-4 border-primary" href="#">
    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stethoscope</span>
    <span className="text-body font-body">Checker</span>
  </a>

  {/* Inactive nav item */}
  <a className="flex items-center gap-md px-margin py-3 text-on-surface-variant hover:bg-surface-container-low mx-sm rounded-lg transition-colors mt-2" href="#">
    <span className="material-symbols-outlined">medical_services</span>
    <span className="text-body font-body">First Aid</span>
  </a>

</div>
```

---

### 7.4 Symptom Tag Input

The core interactive element on the Symptom Checker page.

**Search input field:**
```jsx
<div className="relative flex items-center w-full">
  <span className="material-symbols-outlined absolute left-md text-primary">search</span>
  <input
    className="w-full pl-[48px] pr-md py-md bg-surface-container-lowest text-on-surface text-body font-body rounded-full border-2 border-primary focus:outline-none shadow-sm transition-all placeholder:text-on-surface-variant"
    placeholder="Type a symptom (e.g. fever, headache...)"
    type="text"
  />
  <button className="absolute right-md text-on-surface-variant hover:text-primary transition-colors">
    <span className="material-symbols-outlined">mic</span>
  </button>
</div>
```

**Suggestion dropdown** (shown when input has ≥1 character):
```jsx
<div className="absolute top-[calc(100%+8px)] left-0 w-full bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_8px_24px_rgba(28,25,23,0.12)] overflow-hidden flex flex-col z-20">
  <button className="flex items-center justify-between w-full px-md py-md hover:bg-surface-container-low transition-colors text-left border-b border-outline-variant last:border-0">
    <div className="flex items-center gap-sm">
      <span className="material-symbols-outlined text-on-surface-variant text-[20px]">healing</span>
      {/* Bold-match the typed characters in the suggestion label */}
      <span className="text-body font-body text-on-surface">
        <strong className="text-primary">He</strong>adache
      </span>
    </div>
    <span className="text-primary text-small font-small font-medium">Add +</span>
  </button>
  {/* Max 5 suggestions, scrollable */}
</div>
```

**Added symptom tag** (appears below or beside the input):
```jsx
<div className="flex items-center gap-xs bg-primary-container text-on-primary-container px-md py-sm rounded-full shadow-sm hover:bg-primary-fixed transition-colors">
  <span className="text-body font-body font-medium">Fever</span>
  <button aria-label="Remove Fever" className="text-on-primary-container hover:text-on-surface p-xs rounded-full flex items-center justify-center transition-colors">
    <span className="material-symbols-outlined text-[16px]">close</span>
  </button>
</div>
```

**Tags wrap** into multiple rows. Each tag: `bg-primary-container`, `text-on-primary-container`, pill shape (`rounded-full`).

---

### 7.5 "Check Symptoms" Primary CTA Button

```jsx
<button className="w-full h-[56px] bg-primary text-on-primary text-h3 font-h3 rounded-full shadow-[0px_4px_12px_rgba(0,104,95,0.2)] hover:shadow-[0px_8px_24px_rgba(0,104,95,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-sm">
  <span>Check Symptoms</span>
  <span className="material-symbols-outlined">arrow_forward</span>
</button>
```

**Disabled state** (0 symptoms added):
```jsx
<button disabled className="w-full h-[56px] bg-surface-container text-on-surface-variant text-h3 font-h3 rounded-full cursor-not-allowed flex items-center justify-center gap-sm">
  <span>Check Symptoms</span>
  <span className="material-symbols-outlined">arrow_forward</span>
</button>
```

The CTA should be **sticky to the bottom of the screen** on mobile with a gradient fade above it:
```jsx
<section className="mt-auto pt-lg pb-margin sticky bottom-0 md:static bg-gradient-to-t from-background via-background to-transparent md:bg-none z-0">
  {/* button here */}
</section>
```

---

### 7.6 Symptom Checker — Empty State

Shown when no symptoms have been added yet.

```jsx
<div className="flex-grow flex flex-col items-center justify-center text-center px-lg">
  {/* Abstract SVG illustration — two soft blobs + centered icon */}
  <div className="w-48 h-48 mb-lg relative flex items-center justify-center opacity-80">
    {/* Outer animated blob */}
    <svg className="w-full h-full absolute animate-[pulse_4s_ease-in-out_infinite]" viewBox="0 0 200 200">
      <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.3,-46.3..." fill="#e4e9e7" transform="translate(100 100)"/>
    </svg>
    {/* Inner static blob */}
    <svg className="w-40 h-40 absolute" viewBox="0 0 200 200">
      <path d="M39.9,-65.7C52.8,-60.5..." fill="#f0f5f2" transform="translate(100 100)"/>
    </svg>
    {/* Center icon */}
    <div className="relative z-10 bg-surface-container-lowest p-xl rounded-full shadow-sm border border-outline-variant/30 flex items-center justify-center">
      <span className="material-symbols-outlined text-[48px] text-primary">health_and_safety</span>
    </div>
  </div>

  <p className="text-body font-body text-on-surface-variant italic max-w-xs leading-relaxed">
    Add your symptoms above to get started
  </p>

  {/* Quick suggestion chips */}
  <div className="mt-lg flex gap-sm flex-wrap justify-center">
    {["Fever", "Cough", "Headache"].map(s => (
      <button className="bg-surface-container text-on-surface-variant px-md py-xs rounded-full text-small font-small border border-outline-variant/50 hover:bg-surface-container-highest transition-colors">
        {s}
      </button>
    ))}
  </div>
</div>
```

---

### 7.7 Result Card

Shown after matching runs. Up to 3 cards stacked. The top-ranked card has a `border-l-[4px] border-l-primary` accent.

```jsx
{/* TOP-RANKED card */}
<article className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant border-l-[4px] border-l-primary p-md flex flex-col gap-md">

  {/* Header row: name + severity badge */}
  <div className="flex justify-between items-start gap-sm">
    <div className="flex flex-col gap-xs">
      <h2 className="font-h2 text-h2 text-on-surface">Common Cold</h2>
      <p className="font-small text-small text-on-surface-variant">Viral upper respiratory tract infection.</p>
    </div>
    {/* LOW severity badge */}
    <div className="bg-surface-container-low px-sm py-xs rounded-full flex items-center gap-xs shrink-0">
      <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      <span className="font-micro text-micro text-primary font-semibold">Low Severity</span>
    </div>
  </div>

  {/* Confidence bar */}
  <div className="flex flex-col gap-xs bg-surface-bright p-sm rounded-lg border border-surface-dim">
    <div className="flex justify-between items-center">
      <span className="font-small text-small text-on-surface-variant font-medium">Match Confidence</span>
      <span className="font-h3 text-h3 text-primary">85%</span>
    </div>
    <div className="w-full bg-surface-dim rounded-full h-[8px] overflow-hidden">
      {/* Width animates from 0 to final value on render */}
      <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: "85%" }} />
    </div>
  </div>

</article>
```

**Severity badge variants:**

| Severity | Badge bg | Badge text color | Icon | Label |
|----------|----------|-----------------|------|-------|
| Low | `bg-surface-container-low` | `text-primary` | `check_circle` filled | "Low Severity" |
| Medium | `bg-secondary-container` | `text-secondary` | `info` filled | "Medium Severity" |
| High | `bg-error-container` | `text-error` | `warning` filled | "High Severity — See a Doctor" |

**Confidence bar color by severity:**
- Low → `bg-primary` fill
- Medium → `bg-secondary` fill
- High → `bg-error` fill, `opacity-80`

**Matched symptoms row** (shown on secondary cards):
```jsx
<div className="flex flex-col gap-sm mt-xs">
  <span className="font-micro text-micro text-on-surface-variant uppercase tracking-wider">Matched Symptoms</span>
  <div className="flex flex-wrap gap-sm">
    <span className="bg-surface-container text-on-surface-variant px-sm py-xs rounded-lg font-small text-small border border-surface-dim">Persistent Fever</span>
  </div>
</div>
```

**"See a Doctor" warning banner** (appended to High severity cards):
```jsx
<div className="bg-secondary-container px-md py-sm flex items-start gap-sm border-t border-outline-variant">
  <span className="material-symbols-outlined text-on-secondary-container mt-[2px]">local_hospital</span>
  <p className="font-small text-small text-on-secondary-container font-medium leading-relaxed">
    This may require medical attention. Consider consulting a healthcare professional.
  </p>
</div>
```

**"Start New Assessment" button** (below result cards):
```jsx
<button className="bg-surface-container text-primary font-h3 text-h3 px-lg py-md rounded-full shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-sm border border-outline-variant">
  <span className="material-symbols-outlined">restart_alt</span>
  Start New Assessment
</button>
```

---

### 7.8 Emergency Modal

Full-screen, red background, replaces the entire viewport. Triggered when any emergency symptom is detected.

**Emergency symptoms list:** `chest-pain`, `unconsciousness`, `seizure`, `breathing-difficulty`, `severe-bleeding`

```jsx
<div className="fixed inset-0 bg-error z-[100] flex flex-col justify-center items-center px-margin">
  <main className="w-full max-w-sm flex flex-col items-center">

    {/* Pulsing alert icon */}
    <div className="mb-xl" style={{ animation: "pulse-slow 2s cubic-bezier(0.4,0,0.6,1) infinite" }}>
      <span className="material-symbols-outlined text-[80px] text-on-error drop-shadow-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}>
        emergency
      </span>
    </div>

    {/* Headline */}
    <h1 className="font-display text-display text-on-error font-extrabold text-center mb-xl tracking-tight">
      EMERGENCY DETECTED
    </h1>

    {/* Numbered action steps */}
    <div className="flex flex-col gap-md w-full mb-xl">
      {[
        "Stay calm",
        "Call emergency services",
        "Do not move the person unless in danger",
        "Keep them comfortable until help arrives"
      ].map((step, i) => (
        <div className="flex items-center gap-md bg-on-error/10 p-md rounded-xl border border-on-error/20">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-on-error flex items-center justify-center">
            <span className="font-h1 text-h1 text-error font-bold">{i + 1}</span>
          </div>
          <p className="font-h2 text-h2 text-on-error">{step}</p>
        </div>
      ))}
    </div>

    {/* CALL 108 button */}
    <button className="w-full bg-on-error text-error py-4 px-md rounded-xl shadow-[0px_8px_24px_rgba(0,0,0,0.2)] flex items-center justify-center gap-sm mb-lg hover:bg-surface-bright transition-colors active:scale-95">
      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
      <span className="font-h2 text-h2 font-bold tracking-wide">CALL 108 — AMBULANCE</span>
    </button>

    {/* Dismiss */}
    <button className="font-small text-small text-on-error/70 underline underline-offset-4 hover:text-on-error transition-colors mt-lg pb-xl">
      I understand, go back
    </button>

  </main>
</div>
```

**Pulse animation** — add to global CSS:
```css
@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: .7; transform: scale(1.05); }
}
```

**Slide-in animation** when modal opens (add to wrapper):
```css
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.emergency-enter {
  animation: slideUp 300ms ease-out forwards;
}
```

---

### 7.9 First Aid — Category Grid

12 cards in a 2-column grid (mobile), 3-column (tablet), 4-column (desktop).

```jsx
<main className="w-full max-w-7xl mx-auto px-margin py-lg">
  <div className="mb-lg">
    <h2 className="text-h1 font-h1 text-on-surface">First Aid Guide</h2>
    <p className="text-body font-body text-on-surface-variant mt-xs">Select an emergency for step-by-step instructions.</p>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
    {categories.map(cat => (
      <button
        key={cat.id}
        className="bg-surface-container-lowest border border-[#e5e7eb] rounded-[12px] p-md flex flex-col items-center justify-center gap-sm hover:bg-surface-container-low transition-colors min-h-[120px] active:scale-[0.97]"
        style={{ boxShadow: "0px 4px 12px rgba(13,148,136,0.05)" }}
      >
        <div className="text-[32px]">{cat.icon}</div>
        <span className="text-h3 font-h3 text-on-surface text-center">{cat.name}</span>
      </button>
    ))}
  </div>
</main>
```

**Category data:**
```js
const FIRSTAID_CATEGORIES = [
  { id: "heart-attack",   name: "Heart Attack",   icon: "❤️" },
  { id: "drowning",       name: "Drowning",        icon: "🌊" },
  { id: "vomiting",       name: "Vomiting",        icon: "🤢" },
  { id: "bleeding",       name: "Bleeding",        icon: "🩸" },
  { id: "burns",          name: "Burns",           icon: "🔥" },
  { id: "fractures",      name: "Fractures",       icon: "🦴" },
  { id: "stings",         name: "Stings",          icon: "🐝" },
  { id: "snake-bite",     name: "Snake Bite",      icon: "🐍" },
  { id: "shock",          name: "Shock",           icon: "⚡" },
  { id: "fainting",       name: "Fainting",        icon: "😵" },
  { id: "allergies",      name: "Allergies",       icon: "🤧" },
  { id: "concussion",     name: "Concussion",      icon: "🧠" },
];
```

---

### 7.10 First Aid — Detail View (Standard)

For categories without sub-types (e.g. Heart Attack, Drowning).

**Structure:**
1. Sticky header with back arrow + category name + emoji
2. Description card (teal-tinted)
3. DO section (green card)
4. DON'T section (red card)
5. Warning banner (conditional, only for life-threatening categories)

```jsx
{/* Description card */}
<section className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-sm mb-lg">
  <h2 className="text-h2 font-h2 mb-sm text-primary">Superficial Burn</h2>
  <p className="text-body font-body text-on-surface-variant">Description text here...</p>
</section>

{/* DO section */}
<section className="bg-green-50 rounded-xl p-md border border-green-600/20 shadow-sm mb-lg">
  <div className="flex items-center gap-sm mb-md">
    <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
    <h3 className="text-h3 font-h3 text-green-600">What to DO</h3>
  </div>
  <ul className="space-y-sm">
    <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-green-600 text-[20px] mt-[2px]">water_drop</span>
      <span className="text-body font-body text-on-surface">Cool the burn with cool running water for 10–15 minutes.</span>
    </li>
  </ul>
</section>

{/* DON'T section */}
<section className="bg-red-50 rounded-xl p-md border border-red-600/20 shadow-sm mb-lg">
  <div className="flex items-center gap-sm mb-md">
    <span className="material-symbols-outlined text-red-600" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
    <h3 className="text-h3 font-h3 text-red-600">What NOT to Do</h3>
  </div>
  <ul className="space-y-sm">
    <li className="flex items-start gap-sm">
      <span className="material-symbols-outlined text-red-600 text-[20px] mt-[2px]">ac_unit</span>
      <span className="text-body font-body text-on-surface">Do not apply ice directly — it causes further tissue damage.</span>
    </li>
  </ul>
</section>
```

---

### 7.11 First Aid — Sub-Type Pill Selector (Burns & Fractures)

Horizontal scrollable row of pills. One active at a time.

```jsx
<div className="flex gap-sm mb-lg overflow-x-auto pb-sm scrollbar-hide">
  {/* ACTIVE pill */}
  <button className="whitespace-nowrap px-md py-sm rounded-full bg-primary text-on-primary text-small font-small font-semibold shadow-[0px_4px_12px_rgba(13,148,136,0.12)]">
    1st Degree
  </button>
  {/* INACTIVE pill */}
  <button className="whitespace-nowrap px-md py-sm rounded-full bg-surface-container-lowest border border-outline-variant text-on-surface-variant text-small font-small hover:bg-surface-container-low transition-colors">
    2nd Degree
  </button>
  {/* DANGER pill (3rd Degree) */}
  <button className="whitespace-nowrap px-md py-sm rounded-full bg-error-container text-on-error-container border border-error font-h3 text-small flex items-center gap-1 shadow-sm">
    <span className="w-2 h-2 rounded-full bg-error block" />
    3rd Degree
  </button>
</div>
```

**Sub-types for Burns:** 1st Degree · 2nd Degree · 3rd Degree
**Sub-types for Fractures:** Greenstick · Spiral · Comminuted · Compound · Dislocation

---

### 7.12 First Aid — LIFE THREATENING Banner

Shown at the top of the detail view for Third Degree Burns, Compound Fractures, and other critical sub-types.

```jsx
<div className="bg-error text-on-error rounded-xl p-md flex items-start gap-md shadow-sm border border-error-container mb-lg">
  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
  <div>
    <h2 className="text-h2 font-h2 mb-sm">LIFE THREATENING</h2>
    <p className="text-body font-body opacity-90">
      Call emergency services (112 / 108) immediately. Do not attempt to treat a 3rd degree burn at home.
    </p>
    <button className="mt-md bg-surface-container-lowest text-error font-h3 text-h3 py-2 px-4 rounded-lg w-full flex items-center justify-center gap-2 shadow-sm">
      <span className="material-symbols-outlined">call</span>
      Call Emergency Services Now
    </button>
  </div>
</div>
```

---

### 7.13 Breathing Page — Idle State

Centered layout. The circle is at rest (medium size). Play button is prominent.

```jsx
<main className="flex-1 flex flex-col px-margin pt-md pb-[100px] relative">

  {/* Page header */}
  <div className="mb-lg mt-sm">
    <h2 className="text-h2 font-h2 text-on-surface">Breathing Assistant</h2>
    <p className="text-body font-body text-on-surface-variant mt-xs">Select a routine to begin</p>
  </div>

  {/* Glass card container */}
  <div className="rounded-xl p-lg flex-1 flex flex-col items-center justify-center relative overflow-hidden"
       style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0px 4px 24px rgba(0,104,95,0.05)" }}>

    {/* Phase labels — all inactive (muted) */}
    <div className="flex gap-md mb-xl w-full justify-center">
      {["Inhale 4s", "Hold 4s", "Exhale 6s"].map(label => (
        <div key={label} className="px-sm py-xs rounded-full border border-outline-variant text-on-surface-variant text-small font-small opacity-60">
          {label}
        </div>
      ))}
    </div>

    {/* Circle — idle state (200×200) */}
    <div className="relative flex items-center justify-center w-[200px] h-[200px] mb-xl">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-primary-fixed opacity-40" />
      {/* Inner surface */}
      <div className="absolute inset-[4px] rounded-full bg-surface-container-lowest shadow-inner flex items-center justify-center">
        {/* Focal dot */}
        <div className="w-4 h-4 rounded-full bg-primary shadow-sm" />
      </div>
      {/* Ambient rings */}
      <div className="absolute inset-[-20px] rounded-full border border-primary-fixed opacity-20" />
      <div className="absolute inset-[-40px] rounded-full border border-primary-fixed opacity-10" />
    </div>

    {/* Play button */}
    <button className="w-[64px] h-[64px] rounded-full bg-primary text-on-primary flex items-center justify-center shadow-[0px_8px_24px_rgba(0,104,95,0.25)] hover:scale-105 transition-transform active:scale-95">
      <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
    </button>
    <p className="text-micro font-micro text-on-surface-variant mt-sm tracking-wider uppercase">Tap to Start</p>

  </div>

  {/* Quick settings bento cards */}
  <div className="grid grid-cols-2 gap-sm mt-md">
    <div className="bg-surface-container-lowest border border-surface-container rounded-lg p-sm flex items-center gap-sm shadow-sm">
      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
        <span className="material-symbols-outlined text-secondary" style={{ fontSize: "16px" }}>timer</span>
      </div>
      <div>
        <div className="text-micro font-micro text-on-surface-variant">Duration</div>
        <div className="text-small font-small font-medium text-on-surface">5 min</div>
      </div>
    </div>
    {/* repeat for Audio bento card */}
  </div>

</main>
```

---

### 7.14 Breathing Page — Active Inhale State

Circle enlarged to 240×240. Glow rings active. Phase label shows "Inhale". Countdown inside circle.

```jsx
<main className="flex-grow flex flex-col items-center justify-center px-margin py-xl relative overflow-hidden pb-32">

  {/* Ambient background glow */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
    <div className="w-[400px] h-[400px] bg-primary-fixed-dim rounded-full blur-3xl" />
  </div>

  {/* Phase indicator pills — pill row, one active */}
  <div className="flex items-center gap-sm mb-16 z-10 bg-surface-container-lowest p-1 rounded-full shadow-sm border border-outline-variant/30">
    {/* ACTIVE */}
    <div className="px-4 py-2 rounded-full bg-primary text-on-primary text-small font-small shadow-sm">Inhale 4s</div>
    {/* INACTIVE */}
    <div className="px-4 py-2 rounded-full text-on-surface-variant text-small font-small opacity-60">Hold 4s</div>
    <div className="px-4 py-2 rounded-full text-on-surface-variant text-small font-small opacity-60">Exhale 4s</div>
  </div>

  {/* Circle — inhale state (240×240, enlarged) */}
  <div className="relative w-[240px] h-[240px] flex items-center justify-center z-10 my-8">
    {/* Outer glow rings */}
    <div className="absolute inset-0 rounded-full bg-primary-container opacity-30 scale-[1.3] blur-md transition-transform duration-1000 ease-out" />
    <div className="absolute inset-0 rounded-full bg-primary opacity-20 scale-[1.15] blur-sm transition-transform duration-1000 ease-out" />
    {/* Main circle */}
    <div className="absolute inset-0 rounded-full bg-surface-container-lowest border-[3px] border-primary shadow-[0_8px_32px_rgba(0,104,95,0.15)] flex items-center justify-center z-20">
      <span className="text-[80px] leading-none font-display font-bold text-primary tracking-tighter">4</span>
    </div>
  </div>

  {/* Phase label + instruction */}
  <div className="mt-8 text-center z-10 flex flex-col items-center gap-2">
    <h2 className="text-display font-display text-primary">Inhale</h2>
    <p className="text-body font-body text-on-surface-variant max-w-[250px]">
      Breathe in slowly and deeply through your nose.
    </p>
  </div>

  {/* Pause button */}
  <div className="mt-16 z-10">
    <button className="w-16 h-16 rounded-full bg-surface-container-lowest shadow-sm border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors active:scale-95">
      <span className="material-symbols-outlined text-[32px]">pause</span>
    </button>
  </div>

</main>
```

---

### 7.15 Breathing Page — Active Exhale State

Circle contracted to 160×160. Phase pill shows "Exhale 6s". Cycle counter visible. Countdown shows "6".

```jsx
{/* Top bar with close + cycle counter + settings */}
<div className="w-full flex justify-between items-center mb-xl">
  <button className="w-12 h-12 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors">
    <span className="material-symbols-outlined">close</span>
  </button>
  <div className="bg-surface-container-low px-md py-sm rounded-full text-small font-small text-on-surface-variant flex items-center gap-xs">
    <span className="material-symbols-outlined text-[16px]">cycle</span>
    Cycles completed: 2
  </div>
  <button className="w-12 h-12 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-on-surface-variant">
    <span className="material-symbols-outlined">settings</span>
  </button>
</div>

{/* Phase pills — Exhale is active */}
<div className="flex gap-sm mb-xl w-full justify-center">
  <div className="px-md py-sm rounded-full bg-surface-container-lowest border border-outline-variant text-small font-small text-on-surface-variant opacity-60">Inhale 4s</div>
  <div className="px-md py-sm rounded-full bg-surface-container-lowest border border-outline-variant text-small font-small text-on-surface-variant opacity-60">Hold 4s</div>
  {/* ACTIVE */}
  <div className="px-md py-sm rounded-full bg-primary-container text-on-primary-container text-small font-small font-bold shadow-sm flex items-center gap-xs">
    <span className="material-symbols-outlined text-[16px]">air</span>
    Exhale 6s
  </div>
</div>

{/* Circle — exhale state (160×160, contracted) */}
<div className="relative w-[300px] h-[300px] flex items-center justify-center mb-xl">
  {/* Track circle */}
  <div className="absolute inset-0 rounded-full border-4 border-surface-container-low" />
  {/* Contracted circle */}
  <div className="w-[160px] h-[160px] rounded-full bg-primary-container/20 flex flex-col items-center justify-center border-2 border-primary/30 shadow-inner relative"
       style={{ transition: "width 0.5s ease-in-out, height 0.5s ease-in-out" }}>
    <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
    <span className="text-h1 font-h1 font-extrabold text-primary mb-xs z-10">6</span>
    <span className="text-small font-small text-on-surface-variant tracking-widest uppercase z-10">Exhale</span>
  </div>
</div>

{/* Pause button */}
<div className="flex gap-md mt-auto">
  <button className="w-14 h-14 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors">
    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>pause</span>
  </button>
</div>
```

---

## 8. Breathing Phase Logic Reference

| Phase | Duration | Circle size | Circle behavior | Label |
|-------|----------|-------------|-----------------|-------|
| Inhale | 4s | 240×240px | Scale up, glow rings expand | "Inhale" (display size, teal) |
| Hold | 4s | 240×240px | Stays large, gentle pulse | "Hold" |
| Exhale | 6s | 160×160px | Scale down, rings contract | "Exhale" |
| (idle) | — | 200×200px | Static, no countdown | — |

**CSS transition for circle resize:**
```css
.breathe-circle {
  transition: width 0.5s ease-in-out, height 0.5s ease-in-out, background-color 0.5s ease-in-out;
}
```

Countdown number inside the circle: `text-[80px]` for inhale/active states, `text-h1` for exhale.

---

## 9. Micro-Interaction & Animation Reference

| Interaction | CSS/JS approach |
|------------|----------------|
| Symptom tag added | `scale(0 → 1)` + `opacity(0 → 1)`, 150ms ease-out |
| Symptom tag removed | `scale(1 → 0)` + `opacity(1 → 0)`, 150ms ease-in |
| Emergency modal opens | `translateY(100% → 0)` + `opacity(0 → 1)`, 300ms ease-out |
| Result cards appear | Staggered `opacity(0 → 1)` with 100ms delay per card |
| Confidence bar fill | `width: 0% → final%`, 1000ms ease-out on component mount |
| Breathing circle scale | CSS `transition` 500ms ease-in-out on width/height |
| First Aid detail slides in | `translateX(100% → 0)`, 250ms ease-out |
| Category card tap | `scale(0.97)` on `active:` pseudo-class, 100ms |
| Bottom nav tab switch | Page `opacity(0 → 1)`, 200ms |
| Emergency pulse icon | `scale(1 → 1.05)` + `opacity(1 → 0.7)` loop, 2s cubic-bezier |

---

## 10. Icon Reference

All icons are from **Material Symbols Outlined**. Default FILL = 0.

| Usage | Icon name |
|-------|-----------|
| App logo | `emergency_home` (FILL 1) |
| Symptom Checker tab | `stethoscope` |
| First Aid tab | `medical_services` |
| Breathe tab | `air` |
| Search input | `search` |
| Microphone | `mic` |
| Remove tag | `close` |
| Emergency alert | `emergency` (FILL 1) |
| Call/phone | `call` (FILL 1) |
| Back button | `arrow_back` |
| CTA forward | `arrow_forward` |
| Restart | `restart_alt` |
| Play | `play_arrow` (FILL 1) |
| Pause | `pause` |
| Close session | `close` |
| Settings | `settings` |
| Cycle counter | `cycle` |
| Low severity | `check_circle` (FILL 1) |
| High severity | `warning` (FILL 1) |
| Doctor nudge | `local_hospital` |
| DO list items | contextual: `water_drop`, `medication`, `local_hospital` |
| DON'T list items | contextual: `ac_unit`, `restaurant`, `back_hand`, `block` |
| Empty state | `health_and_safety` |
| Offline ready | `check_circle` (FILL 1) |
| Timer | `timer` |
| Audio | `volume_up` |
| Inhale instruction | `air` |
| Visibility/identify | `visibility` |

---

## 11. Accessibility Notes

- All `<button>` elements that contain only an icon must have `aria-label`
- Bottom nav uses `<button>` (not `<a>`) for SPA navigation — add `aria-current="page"` on active tab
- `<input>` fields must have associated `<label>` or `aria-label`
- Emergency modal: add `role="alertdialog"` and `aria-modal="true"` and `aria-label="Emergency Detected"`
- Confidence bar: use `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- Color is never the sole meaning carrier — every badge has text + icon
- Touch targets: minimum 44×44px on all interactive elements

---

## 12. Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|---------|
| Default (< 768px) | Bottom nav shown. Side nav hidden. Single column layout. `pb-[64px]` on body. |
| `md:` (≥ 768px) | Bottom nav hidden. Side nav shown. Max-width container centered. |
| `lg:` (≥ 1024px) | First Aid grid becomes 4 columns. |

---

## 13. Page-Level Layout Wrapper

All three pages use this shell structure:

```jsx
<div className="min-h-screen flex flex-col bg-background text-on-background font-body antialiased pb-[64px] md:pb-0">
  <Header />                     {/* sticky top */}
  <SideNav />                    {/* hidden on mobile, fixed on md+ */}
  <main className="flex-grow px-margin py-lg max-w-2xl mx-auto w-full md:ml-64">
    {/* page content */}
  </main>
  <BottomNav />                  {/* fixed bottom, md:hidden */}
</div>
```

On `md+`, the main content area shifts right with `md:ml-64` to account for the sidebar width.

---

*End of `ui.md`. This document is referenced by `LAKSHMAN_PLAN.md` in all 6 phases. Do not build UI without reading the relevant section here first.*
