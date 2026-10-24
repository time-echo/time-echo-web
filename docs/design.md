# TimeEcho Design & UI/UX Documentation

## Design Philosophy

**Epistolary Archival Aesthetic** — TimeEcho rejects generic SaaS patterns in favor of physical postal materiality. Every interface element evokes a letter, dossier, or archive: wax seals, parchment sheets, manila folders, postmark stamps, typewriter text.

**Core Principles**:

- **Tangibility over abstraction** — Digital interactions feel physical (seal cracking, paper texture, ink on fiber)
- **Restraint over noise** — Limited palette, generous whitespace, purposeful motion
- **Narrative over dashboard** — Each screen tells a chapter; the user is the protagonist
- **Intimacy over scale** — Private vault, not social feed; no likes, shares, or public metrics

---

## Visual Identity

### Color Palette

| Token                | Light     | Dark      | Usage                                        |
| -------------------- | --------- | --------- | -------------------------------------------- |
| `--wax`              | `#8E2818` | `#D14930` | Primary actions, seals, accents, focus rings |
| `--wax-hover`        | `#6A1E12` | `#E05A40` | Hover states                                 |
| `--ink`              | `#2C485E` | `#77A3C4` | Secondary text, borders, postmarks           |
| `--manila`           | `#EFECE3` | `#1C2028` | Folder backgrounds, secondary surfaces       |
| `--manila-border`    | `#D5CEBD` | `#2D3342` | Folder borders                               |
| `--parchment`        | `#FAF9F5` | `#16181D` | Page background, paper sheets                |
| `--crease`           | `#D8D2C2` | `#2D3340` | Paper borders, divider lines                 |
| `--foreground`       | `#1C1F26` | `#E5E7EB` | Primary text                                 |
| `--foreground-muted` | `#5A606B` | `#9CA3AF` | Muted text, placeholders                     |

**Semantic Mapping** (Tailwind `@theme inline`):

```css
--color-wax, --color-wax-hover, --color-wax-active
--color-ink
--color-manila, --color-manila-border
--color-parchment
--color-crease
--color-foreground, --color-foreground-muted
```

### Typography

| Role              | Font          | CSS Variable             | Fallback                 |
| ----------------- | ------------- | ------------------------ | ------------------------ |
| Editorial/Display | Fraunces      | `--font-serif-editorial` | Georgia, serif           |
| Letter/Monospace  | Courier Prime | `--font-letter`          | "Courier New", monospace |
| UI/System         | IBM Plex Sans | `--font-ui`              | system-ui, sans-serif    |

**Scale** (Tailwind defaults + custom):

- Headlines: `text-4xl` → `text-6xl` (Fraunces, `font-normal`, `tracking-tight`)
- UI Labels: `text-xs` `uppercase` `tracking-wider` `font-semibold` (IBM Plex Sans)
- Body/Letter: `text-sm` → `text-base` `leading-loose` (Courier Prime)
- Microcopy: `text-[10px]` `text-[11px]` (Courier Prime, `uppercase` `tracking-widest`)

**Font Loading** (`src/lib/fonts.ts`):

```typescript
Fraunces({ variable: "--font-fraunces", weight: "400 500 600 700" });
Courier_Prime({ variable: "--font-courier-prime", weight: "400 700" });
IBM_Plex_Sans({ variable: "--font-plex-sans", weight: "300 400 500 600 700" });
```

---

## Component Design System

### Primitives (`src/components/ui/`)

#### Paper Sheet (`.paper-sheet`)

```css
.paper-sheet {
  background-color: var(--parchment);
  color: var(--foreground);
  border: 1px solid var(--crease);
  box-shadow:
    0 1px 3px rgba(28, 31, 38, 0.04),
    0 4px 16px rgba(28, 31, 38, 0.02);
}
```

**Usage**: Primary card surface, modals, composer canvas.

#### Archival Folder (`.archival-folder`)

```css
.archival-folder {
  background-color: var(--manila);
  border: 1px solid var(--manila-border);
}
```

**Usage**: Sidebar panels, annex sections, dossier aside.

#### Postmark Stamp (`.postmark-stamp`)

```css
.postmark-stamp {
  font-family: var(--font-letter);
  border: 1.5px dashed rgba(44, 72, 94, 0.65);
  color: var(--ink);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.65rem;
  border-radius: 2px;
}
```

**Variants**: `.postmark-stamp-circle` (circular)
**Usage**: Dates, status badges, section labels, dossier headers.

#### Wax Seal (`.wax-seal`)

```css
.wax-seal {
  background: radial-gradient(
    circle at 35% 35%,
    #a8321d 0%,
    #8e2818 55%,
    #631b10 100%
  );
  color: #faf9f5;
  box-shadow:
    inset 0 1.5px 3px rgba(255, 255, 255, 0.25),
    inset 0 -2.5px 5px rgba(0, 0, 0, 0.45),
    0 3px 10px rgba(99, 27, 16, 0.35);
  border: 2px solid #5c190f;
  border-radius: 9999px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.wax-seal:hover {
  transform: scale(1.04);
}
.wax-seal:active {
  transform: scale(0.96);
}
```

**Usage**: Step indicators, seal/unseal actions, decorative accents.

#### Lined Paper Canvas (`.lined-paper-canvas`)

```css
.lined-paper-canvas {
  background-image: linear-gradient(
    rgba(142, 40, 24, 0.06) 1px,
    transparent 1px
  );
  background-size: 100% 2.0125rem;
  background-attachment: local;
  border-color: rgba(142, 40, 24, 0.15);
  font-family: var(--font-letter);
}
```

**Usage**: Letter composition textarea, letter reading view.

#### Radial Progress (`.radial-progress`)

```css
.radial-progress {
  --value: 0;
  --size: 4.5rem;
  --thickness: 5px;
  width: var(--size);
  height: var(--size);
  border-radius: 9999px;
  display: inline-grid;
  place-content: center;
  background:
    radial-gradient(
      closest-side,
      var(--parchment) calc(100% - var(--thickness)),
      transparent
    ),
    conic-gradient(
      currentColor calc(var(--value) * 1%),
      rgba(216, 210, 194, 0.4) 0
    );
}
```

**Usage**: Accuracy meter, completion rings. Set `--value` via inline style.

---

### Composite Components

#### WaxSeal (`src/components/ui/WaxSeal.tsx`)

Interactive seal with crack animation.

```tsx
<WaxSeal
  number="01"
  size="md" // sm | md | lg
  cracked={false} // triggers crack animation
  onClick={handleBreakSeal}
/>
```

**Animation**: `animate-seal-left` / `animate-seal-right` (0.8s cubic-bezier)

#### PostmarkStamp (`src/components/ui/PostmarkStamp.tsx`)

```tsx
<PostmarkStamp
  date={new Date()}
  variant="default" // default | circle
  text="TIMEECHO"
/>
```

#### CountdownBadge (`src/components/ui/CountdownBadge.tsx`)

Compact time-until-delivery display.

```tsx
<CountdownBadge
  targetDate="2026-12-25T08:00:00Z"
  format="compact" // compact | full
/>
```

#### Slider (`src/components/ui/Slider.tsx`)

Custom-styled range input for emotional baselines.

```tsx
<Slider
  value={happiness}
  onChange={setHappiness}
  min={1}
  max={10}
  label="Happiness"
  accentColor="wax"
/>
```

---

## Page Layouts

### Landing / Home (`app/page.tsx`)

**Structure**: Two-column hero (lg+) → Interactive dossier preview → How-it-works (3 wax seals) → Footer tag

**Left Column (5/12)**:

- Headline: "Write today. Discover tomorrow." (Fraunces, 4xl→6xl)
- Subhead: Value proposition (Courier Prime, xs→sm)
- 3 Feature cards (PaperSheet): Private, Scheduled, Predictions

**Right Column (7/12)** — Live Composer:

- Step header + postmark date
- Letter textarea (LinedPaperCanvas, 2000 char max, 80 min)
- Delivery horizon presets (6mo/1yr/3yr/5yr/Custom)
- Annex I: 5 prediction fields (grid)
- Annex II: 3 emotional sliders (Happiness/Anxiety/Motivation)
- Email + Submit (Wax-colored CTA)

**Dossier Preview** (below fold):

- Archival folder sidebar (nav: My Letters, Timeline, Analytics)
- Main: Prediction vs Reality rows (4 examples) + Emotional evolution chart + Radial accuracy

**How It Works**: 3 wax-seal cards (01 Write, 02 Seal, 03 Unlock)

---

### Dashboard (`app/dashboard/page.tsx`)

- Header: User greeting + stats chips (In Transit, Delivered, Opened, Archived)
- Capsule list: `CapsuleCard` grid
- Empty state: Illustration + CTA to write first letter

**CapsuleCard**:

- Docket number + postmark status
- Title + scheduled date
- Wax seal (intact/broken) → click to open
- Countdown badge or "Opened" stamp
- Archive/Delete actions

---

### Letter Detail (`app/letters/[id]/page.tsx`)

**Sealed State**:

- Large wax seal (centered) → "Break Seal" button
- Docket header + scheduled date
- Preview: first 200 chars of content
- Emotional baseline indicators (3 small sliders, disabled)

**Opened State**:

- LinedPaperCanvas with full content
- Emotional reveal sliders (editable)
- Prediction list with outcome badges
- "Compare with Reality" → navigates to `/reality`

---

### Reality Ledger (`app/letters/[id]/reality/page.tsx`)

**Layout**: Dossier shell (archival folder sidebar + main content)

**Prediction Rows** (`PredictionComparisonRow`):

```
┌─────────────────────────────────────────────────────┐
│ Prediction: "Living in Barcelona"        [PARTIALLY] │
│ Reality:    "Living in Medellín"                     │
└─────────────────────────────────────────────────────┘
```

**Outcome Badges**: `FULFILLED` (green), `EXCEEDED` (gold), `PARTIALLY` (amber), `DIVERGED` (muted), `PENDING` (outline)

**Emotional Evolution Chart**: SVG path comparison (dashed baseline → solid reveal)

**Radial Accuracy Meter**: `.radial-progress` with percentage

---

### Analytics (`app/analytics/page.tsx`)

- **AccuracyMeter**: Large radial progress (prediction accuracy %)
- **EmotionalShiftGauge**: Three horizontal delta bars (Happiness/Anxiety/Motivation)
- **Stats Grid**: Total letters, in transit, delivered, opened, archived
- **Prediction Breakdown**: Count by outcome category
- **Timeline**: Monthly capsule activity (planned)

---

### Settings (`app/settings/page.tsx`)

**Sections** (each in ArchivalFolder):

1. **Appearance**: Light/Dark/System toggle, Theme selector (TimeEcho, Cupcake, Pastel, Autumn, Luxury)
2. **Language**: EN/ES radio
3. **Reflection Style**: Reflective / Motivational / Nostalgic
4. **Memory Frequency**: Low / Normal / Frequent
5. **Privacy**: All letters private, Anonymous analytics
6. **Notifications**: Future letter reminders, Monthly checkpoints, Surprise memories, Emotional summary emails

---

## Interaction Patterns

### Seal Breaking

1. User clicks intact wax seal
2. `animate-seal-left` + `animate-seal-right` (0.8s)
3. Seal splits → reveals "Opened" postmark
4. Content fades in (`animate-fade-in`)
5. `isWaxBroken` persisted to API

### Form Validation

- Letter content: min 80 chars, max 2000 (live counter, wax color when under minimum)
- Email: required, valid format
- Predictions: optional, trimmed
- Submit disabled until valid

### Delivery Horizon Selection

- 5 preset buttons (toggle group)
- Custom date expands inline (archival folder wrapper)
- Min date = tomorrow
- Single source of truth: `selectedHorizonDays` + `showCustomDate` + `customDate`

### Emotional Sliders

- 3 parallel sliders (1-10)
- Labels: Happiness/Anxiety/Motivation (localized)
- Current value displayed inline
- Wax accent color (`accent-[#8E2818]`)

### Dossier Navigation

- Left aside (archival folder): sticky, scrollable
- Active item: PaperSheet + bold text
- Items: My Letters, Timeline, Analytics

---

## Motion & Animation

### Keyframes (globals.css)

```css
@keyframes seal-crack-left {
  /* translateX(-10px) rotate(-6deg) */
}
@keyframes seal-crack-right {
  /* translateX(10px) rotate(6deg) */
}
@keyframes fade-in {
  /* opacity 0→1, translateY(4px)→0 */
}
```

### Classes

- `.animate-seal-left` / `.animate-seal-right` — Seal cracking
- `.animate-fade-in` — General entrance (300ms cubic-bezier)
- `.wax-seal:hover` — Scale 1.04 (spring)
- `.wax-seal:active` — Scale 0.96

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Breakpoints

| Breakpoint | Width  | Key Changes                                      |
| ---------- | ------ | ------------------------------------------------ |
| `sm`       | 640px  | Textarea padding, button layout                  |
| `md`       | 768px  | Prediction grid 2-col, sliders 3-col             |
| `lg`       | 1024px | Hero 2-column, dossier 3/9 split, sticky sidebar |
| `xl`       | 1280px | Max-width containers (6xl/5xl)                   |

**Mobile-First**: All components stack vertically; grids collapse to 1-col.

---

## Accessibility

### Semantic HTML

- `<main>`, `<section>`, `<aside>`, `<nav>`, `<header>`, `<footer>`
- `<form>` with `<label>` + `htmlFor`
- `<button type="submit">` for actions
- `<progress role="progressbar" aria-valuenow>` for radial progress

### Focus Management

- `:focus-visible` → 2px solid wax outline + 2px offset
- Skip links (planned)
- Modal focus trap (planned)

### Color Contrast

- All text meets WCAG AA (4.5:1) in both themes
- Wax on parchment: 7.2:1
- Ink on manila: 5.8:1
- Muted text: 4.6:1

### Screen Readers

- `aria-label` on icon-only buttons
- `aria-valuenow/min/max` on sliders and radial progress
- Live regions for form errors (planned)
- `prefers-reduced-motion` respected globally

### Touch Targets

- Minimum 44×44px (buttons, inputs, interactive elements)
- `min-h-[44px]` on primary CTA and email input

---

## Internationalization (UI Impact)

### Text Expansion

- Spanish ~15-20% longer than English
- Layouts use `flex-wrap`, `min-width: 0`, fluid grids
- No fixed-width containers for text-heavy elements

### Date Formatting

```typescript
new Date().toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
// "October 5, 2026" / "5 de octubre de 2026"
```

### RTL Ready

- Logical properties (`margin-inline-start`, `padding-inline-end`)
- Flex/grid direction unaffected by locale
- No hardcoded `left`/`right` in component styles

---

## Dark Mode

**Strategy**: CSS custom properties on `:root` + `.dark` class (class-based, not media query).

**Toggle**: `UserPreferences.appearanceMode` → `document.documentElement.classList.toggle('dark')`

**Color Shifts**:

| Element   | Light               | Dark                    |
| --------- | ------------------- | ----------------------- |
| Page bg   | Parchment (#FAF9F5) | Deep charcoal (#16181D) |
| Paper     | Parchment           | Dark parchment          |
| Folders   | Manila (#EFECE3)    | Dark manila (#1C2028)   |
| Primary   | Wax carmine         | Brighter wax (#D14930)  |
| Secondary | Indigo              | Muted blue (#77A3C4)    |
| Text      | Near-black          | Near-white              |

**Images**: SVGs use `currentColor` → adapt automatically. No raster images requiring dark variants.

---

## Content Guidelines

### Voice & Tone

- **Intimate, reflective, slightly formal** — like a letter to oneself
- **Second person** ("Your letter", "You predicted")
- **Present tense for actions** ("Seal & Send", not "Sealed & Sent")
- **No marketing speak** — no "unlock your potential", "journey", "seamless"

### Microcopy Patterns

| Context             | English                             | Spanish                               |
| ------------------- | ----------------------------------- | ------------------------------------- |
| Letter placeholder  | "Dear future self..."               | "Querido yo del futuro..."            |
| Submit (idle)       | "Seal & Send to Future Self"        | "Sellar y Enviar a mi Yo Futuro"      |
| Submit (loading)    | "Sealing..."                        | "Sellando..."                         |
| Min chars warning   | "80 min (2000 max)"                 | "80 mín (2000 máx)"                   |
| Privacy reassurance | "Only you will be able to see it"   | "Solo tú podrás verla"                |
| Empty state         | "No letters yet. Write your first." | "Sin cartas aún. Escribe la primera." |

### Capitalization

- **Sentence case** for body text, labels, placeholders
- **UPPERCASE + tracking-wider** for section labels, stamps, nav items
- **Title Case** for proper nouns (TimeEcho, Fraunces, Courier Prime)

---

## Design Tokens Reference (Complete)

```css
/* globals.css — @theme inline */
--color-wax: var(--wax);
--color-wax-hover: var(--wax-hover);
--color-wax-active: var(--wax-hover);
--color-ink: var(--ink);
--color-manila: var(--manila);
--color-manila-border: var(--manila-border);
--color-parchment: var(--parchment);
--color-crease: var(--crease);
--color-foreground: var(--foreground);
--color-foreground-muted: var(--foreground-muted);

--font-serif-editorial: var(--font-fraunces), Georgia, serif;
--font-letter: var(--font-courier-prime), "Courier New", monospace;
--font-ui: var(--font-plex-sans), system-ui, sans-serif;
--font-sans-ui: var(--font-plex-sans), system-ui, sans-serif;

/* Spacing: Tailwind default (4px base) */
/* Border radius: rounded-xs (2px), rounded-sm (4px), rounded-md (6px), rounded-lg (8px), rounded-full */
/* Shadows: shadow-xs, shadow-sm, shadow, shadow-md, shadow-lg (paper-sheet uses custom) */
/* Transitions: 150-200ms ease-out default; wax-seal uses spring cubic-bezier */
```

---

## Figma / External Design Source of Truth & Design Lock

### External Mockups & Zero-Image Policy

All canonical UI/UX designs, wireframes, and prototypes reside externally in Figma. To maintain repository hygiene, avoid binary bloat, and prevent merge conflicts:

- **No Mockup Images in Repository**: Screenshots, visual mockups, exports (`.png`, `.jpg`, `.webp`), and vector design files (`.fig`, `.sketch`, `.xd`) must never be committed to git.
- **Canonical Reference**: Developers and AI agents must refer to approved Figma nodes or documented specifications in this guide.
- **Visual Verification**: Visual verification is performed against external Figma mockups and running instances in the browser (`pnpm dev`).

### Design Registry (External References)

| View / Flow                      | Canonical Figma Node / Frame              | Status   | Notes                                           |
| -------------------------------- | ----------------------------------------- | -------- | ----------------------------------------------- |
| Landing / Home (`/`)             | External Figma Frame: `Landing-V2`        | Approved | Two-column hero, live composer, manifesto       |
| Letter Composer (`/letters/new`) | External Figma Frame: `Composer-Full`     | Approved | Single-column paper canvas with wax seal        |
| Sealed Letter (`/letters/:id`)   | External Figma Frame: `Letter-Sealed`     | Approved | Carmine wax seal modal and unlock countdown     |
| Unsealed Letter (`/letters/:id`) | External Figma Frame: `Letter-Opened`     | Approved | Typewriter manuscript with reality comparison   |
| Vault Dashboard (`/dashboard`)   | External Figma Frame: `Vault-Grid`        | Approved | Manila folder dossier cards and timeline toggle |
| Analytics (`/analytics`)         | External Figma Frame: `Analytics-Summary` | Approved | Radial accuracy gauge and delta evolution       |
| Settings (`/settings`)           | External Figma Frame: `Settings-Sections` | Approved | Six archival sections with appearance switch    |

_Note: Update this registry whenever an external mockup is reviewed and formally approved by the team._

### UI/UX Design Lock & Immutability Invariants

1. **Design Lock & Materiality**:
   - Primary accents and seals must strictly use `--wax` (`#8E2818` / `#D14930`).
   - Surfaces must remain paper-textured or manila (`--parchment`, `--manila`).
   - Display headings must use Fraunces; body correspondence must use Courier Prime; interface labels must use IBM Plex Sans.
2. **Layout & Navigation Invariants**:
   - The navigation shell (`ArchivalHeader` in public layouts, `AppShell` in authenticated routes) and page grid ratios cannot be modified without prior authorization.
3. **Copy Immutability**:
   - Localized strings in `src/lib/i18n/en.json` and `src/lib/i18n/es.json` are immutable contracts. New keys must be added symmetrically across both files with non-empty translations and identical placeholder syntax.
4. **Scope Control**:
   - Agents and contributors are forbidden from redesigning, refactoring, or restyling existing UI components unless explicitly asked by the user. If design references are missing or requirements are ambiguous, prompt the user for direction before making changes.

```
TimeEcho Design System
├── Foundations
│   ├── Colors (Light/Dark)
│   ├── Typography (3 fonts, scales)
│   ├── Spacing (4px grid)
│   ├── Shadows & Elevation
│   └── Motion (easings, durations)
├── Components
│   ├── Atoms: Button, Input, Slider, Badge, Icon, Seal, Stamp
│   ├── Molecules: PredictionField, EmotionalSlider, CountdownBadge, Card
│   ├── Organisms: LetterComposer, DossierShell, CapsuleCard, AnalyticsPanel
│   └── Templates: Landing, Dashboard, LetterDetail, RealityLedger, Settings
└── Pages (all routes)
```

---

## Future Design Considerations

| Area                      | Exploration                                          |
| ------------------------- | ---------------------------------------------------- |
| **Letter Reading**        | Page-turn animation, ink bleed effect, marginalia    |
| **Seal Variants**         | Different wax colors per theme, custom seal initials |
| **Paper Textures**        | Subtle noise overlay, deckled edges, watermark       |
| **Timeline View**         | Horizontal scroll with wax-seal milestones           |
| **Shareable Artifact**    | Generate "receipt" image of opened letter            |
| **Print Stylesheet**      | @media print → physical letter format                |
| **High Contrast Mode**    | Additional theme for accessibility                   |
| **Animation Preferences** | Granular control (seals only, charts only, none)     |
