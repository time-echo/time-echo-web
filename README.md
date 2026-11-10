# TimeEcho Web Frontend

> Write today. Discover tomorrow.

TimeEcho is a digital time-capsule web application that lets you write letters to your future self, calibrate your emotional baseline, choose digital postage stamps, and forecast life milestones. When the delivery date arrives, you receive your sealed letter and can compare your past predictions with reality — revealing how much you've grown.

This repository (`frontend`) is the Next.js frontend application, built with React 19, Next.js 16 (App Router), and Tailwind CSS v4. It integrates with the Rails 8 API backend (`time_echo/`) and references living components in Storybook (`mockups/`).

---

## ✨ Features

### 📨 Time-Capsule Letters

Write private letters to your future self. Choose scheduled delivery periods or specify custom dates. Letters are safely stored and encrypted at rest by the backend.

### 📮 Digital Postage Stamps

Select from an authentic postal collection of postage stamps organized into categories (`small-things`, `places-i-inhabit`, `stored-thoughts`, `passage-of-time`):

- Dynamic stamp catalog fetched from the Rails API (`/api/v1/stamps`) with search, category filtering, and pagination.
- Interactive `StampPickerModal` with tactile perforation frames and postmark overlays.
- Safe SVG rendering sanitized with DOMPurify (`StampRenderer`).
- Offline fallback to static catalog when backend is unavailable.

### 🎭 Emotional Baseline

Record your happiness, anxiety, and motivation levels (1–10) when writing. Upon opening, rate yourself again to visualize your emotional evolution.

### 🔮 Milestone Predictions

Make predictions across key categories: where you'll live, what work you'll do, income, relationships, and greatest achievements. When the letter unlocks, evaluate each prediction against reality — tagged as **Fulfilled**, **Exceeded**, **Partially**, or **Diverged**.

### 📊 Retrospective Analytics

Track your prediction accuracy rate, emotional deltas (baseline vs. reveal), and growth trends across all capsules. Radial progress indicators and emotional evolution charts make reflection tangible.

### 🌐 Bilingual Support

Full English/Spanish localization with locale-aware date formatting and UI copy following natural language guidelines (`.agents/rules/natural-copy.md`).

### 🎨 Archival Design System

- **Typography**: Fraunces (editorial serif), Courier Prime (monospace letter), IBM Plex Sans (UI).
- **Colors**: Wax carmine (`#8E2818`), indigo ink (`#2C485E`), manila folder (`#EFECE3`), parchment (`#FAF9F5`).
- **Components**: Wax seals, postmark stamps, paper sheets, archival folders, lined-paper canvas.
- **Motion**: Wax seal fracture animation, smooth page transitions, strict `prefers-reduced-motion` compliance.
- **Mockups & Design Catalog**: Living Storybook mockups reside in the [`time-echo/mockups`](https://github.com/time-echo/mockups) repository (`Tier 1` Primitives through `Tier 5` Full-Page Figma Frames).

---

## 🛠 Tech Stack

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| Framework       | Next.js 16 (App Router)                      |
| Runtime         | React 19                                     |
| Styling         | Tailwind CSS v4 (CSS-first, `@theme inline`) |
| Language        | TypeScript (strict)                          |
| State           | React Context + custom hooks                 |
| Animation       | Framer Motion, CSS animations                |
| Sanitization    | DOMPurify                                    |
| Icons           | Lucide React                                 |
| Utils           | clsx, tailwind-merge                         |
| Package Manager | pnpm                                         |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+ (or pnpm 12)

### Installation

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install

# Start development server (runs on port 3001)
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Available Scripts

```bash
pnpm dev       # Start dev server on port 3001
pnpm build     # Production build
pnpm start     # Run production server
pnpm lint      # Run ESLint
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/letters/        # Internal API proxy / fallback routes
│   ├── letters/            # Letter pages (new, detail, success, reality)
│   ├── dashboard/          # User dashboard timeline
│   ├── analytics/          # Retrospective analytics view
│   ├── settings/           # User preferences & account controls
│   ├── login/              # Passwordless authentication
│   ├── about/              # About page
│   ├── terms/              # Terms of service
│   ├── privacy/            # Privacy policy
│   ├── globals.css         # Global styles & design tokens
│   └── layout.tsx          # Root layout with providers & fonts
├── components/
│   ├── layout/             # AppShell, ArchivalHeader, ArchivalFooter
│   ├── stamps/             # Digital postage stamps suite
│   │   ├── Stamp.tsx              # Stamp component with sizes & themes
│   │   ├── LetterStamp.tsx        # Affixed stamp on envelope/letter
│   │   ├── StampPickerModal.tsx   # Interactive catalog browser modal
│   │   ├── StampRenderer.tsx      # DOMPurify-sanitized SVG renderer
│   │   ├── useStampCatalog.ts     # Dynamic catalog hook (API + fallback)
│   │   └── stamps.data.ts         # Static definitions & category tokens
│   └── ui/                 # Design system primitives
│       ├── WaxSeal.tsx
│       ├── PostmarkStamp.tsx
│       ├── PaperSheet.tsx
│       ├── ArchivalFolder.tsx
│       ├── CountdownBadge.tsx
│       └── Slider.tsx
├── features/
│   ├── capsules/           # Letter composition & management
│   │   ├── components/     # CapsuleCard, LetterComposerForm, LinedPaperCanvas, etc.
│   │   └── hooks/          # useCapsules, useLetterComposer
│   ├── analytics/          # AccuracyMeter, EmotionalShiftGauge, metricsCalculator
│   └── reality-ledger/     # RealityLedger, PredictionComparisonRow, useRealityLedger
├── lib/
│   ├── context/            # TimeEchoContext (global application state)
│   ├── repositories/       # ICapsuleRepository, HttpApiRepository
│   ├── fonts.ts            # Font configuration (Fraunces, Courier Prime, IBM Plex Sans)
│   ├── i18n/               # English/Spanish dictionary files (en.json, es.json)
│   └── utils.ts            # cn() utility, formatting helpers
└── types/
    └── timeecho.ts         # Domain types (Letter, Prediction, Stamp, EmotionalSnapshot)
```

---

## 🎨 Design Tokens (CSS Custom Properties)

Defined in `src/app/globals.css` via `@theme inline`:

```css
/* Colors */
--color-wax: #8e2818;           /* Primary brand (carmine) */
--color-wax-hover: #6a1e12;     /* Hover state */
--color-ink: #2c485e;           /* Secondary (indigo) */
--color-manila: #efece3;        /* Folder background */
--color-manila-border: #d5cebd; /* Folder border */
--color-parchment: #faf9f5;     /* Paper background */
--color-crease: #d8d2c2;        /* Paper border / crease lines */
--color-foreground: #1c1f26;    /* Primary text */
--color-foreground-muted: #5a606b; /* Muted text */

/* Typography */
--font-serif-editorial: var(--font-fraunces), Georgia, serif;
--font-letter: var(--font-courier-prime), "Courier New", monospace;
--font-ui: var(--font-plex-sans), system-ui, sans-serif;

/* Postal Metaphor Utility Classes */
.paper-sheet          /* Parchment card with tactile perimeter */
.archival-folder      /* Manila folder styling */
.postmark-stamp       /* Dashed border cancellation stamp */
.wax-seal             /* 3D embossed wax seal with split animation */
.lined-paper-canvas   /* Ruled paper writing guide */
.radial-progress      /* Circular progress indicator */
```

---

## 🔗 Backend Integration

The frontend connects directly to the Rails 8 API backend (`time_echo`):

- **API Base URL**: Configured via `NEXT_PUBLIC_API_URL` (default: `http://localhost:3000/api/v1`).
- **Repository Pattern**: `HttpApiRepository` implements `ICapsuleRepository`, dispatching requests for letters, predictions, archive/restore, authentication, and stamp catalogs.
- **Authentication**: Bearer tokens and session cookies via `Authorization: Bearer <token>` and `credentials: "include"`.
- **Localization**: Propagates `Accept-Language` and `X-Locale` headers to match user interface preferences.

### Stamps Catalog API & Filtering (cURL)

The postage stamps catalog endpoint supports category filtering, text query search (`q`), activation status filtering, and pagination:

```bash
curl --location 'http://localhost:3000/api/v1/stamps?category=small-things&q=coffee&page=1&per_page=20' \
    --header 'Accept: application/json' \
    --header 'Accept-Language: en' \
    --header 'Authorization: Bearer b9187a1102f00429ed165330d90997cc716c4c2bda1f240e'
```

- **Filter parameters**:
  - `category`: Category slug (e.g. `small-things`, `places-i-inhabit`, `stored-thoughts`, `passage-of-time`).
  - `q`: Search term matching localized names (English/Spanish) or slug.
  - `page`: Result page number (1-indexed).
  - `per_page`: Number of stamps returned per page (default: 20, max: 100).
- Handled programmatically via `HttpApiRepository#getStamps(locale, filters)` and `useStampCatalog#fetchFilteredStamps(filters)`. For full documentation, see [`curl.md`](curl.md).

---

## 🌍 Internationalization (i18n)

Translations live in `src/lib/i18n/`:

- `en.json` — English (Plain, direct copy)
- `es.json` — Spanish (Native Latin American Spanish, informal "tú")

Both files are kept strictly in sync, adhering to `.agents/rules/natural-copy.md`.

---

## 🧪 UI Mockups & Storybook Catalog ([`time-echo/mockups`](https://github.com/time-echo/mockups))

TimeEcho maintains a standalone Storybook catalog in the `mockups/` folder (`pnpm storybook` on port `6006`). Whenever UI or visual component changes are made, keep tokens, fonts, and primitives aligned between `frontend/` and `mockups/`.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.
