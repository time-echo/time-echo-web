# TimeEcho

> Write today. Discover tomorrow.

TimeEcho is a digital time-capsule application that lets you write letters to your future self, calibrate your emotional baseline, and forecast life milestones. When the delivery date arrives, you receive your sealed letter and can compare your past predictions with reality — revealing how much you've grown.

---

## ✨ Features

### 📨 Time-Capsule Letters
Write private, encrypted letters to your future self. Choose delivery from 6 months to 5 years, or pick a custom date. Letters arrive in your inbox on the exact morning you scheduled.

### 🎭 Emotional Baseline
Record your happiness, anxiety, and motivation levels (1–10) when writing. Upon opening, rate yourself again to visualize your emotional evolution.

### 🔮 Milestone Predictions
Make up to 5 predictions across categories: where you'll live, what work you'll do, income, relationships, and greatest achievement. When the letter unlocks, compare each prediction with reality — tagged as **Fulfilled**, **Exceeded**, **Partially**, or **Diverged**.

### 📊 Retrospective Analytics
Track your prediction accuracy rate, emotional deltas (baseline vs. reveal), and growth trends across all capsules. Radial progress indicators and emotional evolution charts make reflection tangible.

### 🌐 Bilingual Support
Full English/Spanish localization with locale-aware date formatting and UI.

### 🎨 Archival Design System
- **Typography**: Fraunces (editorial serif), Courier Prime (monospace letter), IBM Plex Sans (UI)
- **Colors**: Wax carmine (#8E2818), indigo ink (#2C485E), manila folder (#EFECE3), parchment (#FAF9F5)
- **Components**: Wax seals, postmark stamps, paper sheets, archival folders, lined-paper canvas
- **Motion**: Subtle seal-crack animations, fade-in transitions, reduced-motion respect

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Runtime | React 19 |
| Styling | Tailwind CSS v4 (CSS-first, `@theme inline`) |
| Language | TypeScript (strict) |
| State | React Context + custom hooks |
| Animation | Framer Motion, CSS animations |
| Icons | Lucide React |
| Utils | clsx, tailwind-merge |
| Package Manager | pnpm |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd time-echo-web

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
pnpm dev       # Start dev server with Turbopack
pnpm build     # Production build
pnpm start     # Run production server
pnpm lint      # Run ESLint
```

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/letters/        # REST endpoints for capsule CRUD
│   ├── letters/            # Letter pages (new, detail, success, reality)
│   ├── dashboard/          # User dashboard
│   ├── analytics/          # Retrospective analytics
│   ├── settings/           # Preferences
│   ├── login/              # Authentication
│   ├── about/              # About page
│   ├── terms/              # Terms of service
│   ├── privacy/            # Privacy policy
│   ├── globals.css         # Global styles & design tokens
│   └── layout.tsx          # Root layout with providers
├── components/
│   ├── layout/             # AppShell, ArchivalHeader, ArchivalFooter
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
│   ├── context/            # TimeEchoContext (global state)
│   ├── repositories/       # ICapsuleRepository, HttpApiRepository
│   ├── fonts.ts            # Font loading (Fraunces, Courier Prime, IBM Plex Sans)
│   ├── i18n/               # English/Spanish translations
│   ├── mockApiStore.ts     # In-memory mock API for development
│   ├── initialSeeds.ts     # Seed data
│   └── utils.ts            # cn() utility, helpers
└── types/
    └── timeecho.ts         # Domain types (Letter, Prediction, EmotionalSnapshot, etc.)
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

/* Utility Classes */
.paper-sheet       /* Parchment card with subtle shadow */
.archival-folder   /* Manila folder styling */
.postmark-stamp    /* Dashed border stamp */
.wax-seal          /* Radial gradient wax seal */
.lined-paper-canvas /* Ruled paper background */
.radial-progress   /* Circular progress indicator (CSS vars) */
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/letters` | Create new capsule |
| `GET` | `/api/letters` | List all capsules |
| `GET` | `/api/letters/[id]` | Get single capsule |
| `PATCH` | `/api/letters/[id]` | Update capsule (reality check) |
| `POST` | `/api/letters/[id]/archive` | Archive capsule |
| `POST` | `/api/letters/[id]/restore` | Restore archived capsule |
| `POST` | `/api/letters/[id]/predictions` | Update prediction realities |
| `POST` | `/api/letters/reset` | Reset all data (dev only) |

---

## 🌍 Internationalization

Translations live in `src/lib/i18n/`:
- `en.json` — English
- `es.json` — Spanish

Add new keys to both files. The `useTimeEcho` context provides `locale` and `t` (translate) function.

---

## 🧪 Development Notes

### Mock API
The app uses an in-memory mock store (`mockApiStore.ts`) for development. Replace `HttpApiRepository` with a real backend implementation when ready.

### Fonts
Fonts are loaded via `next/font` in `src/lib/fonts.ts` and registered as CSS variables in `globals.css`.

### Theming
Light/dark mode uses CSS custom properties on `:root` and `.dark`. Toggle via `UserPreferences.appearanceMode`.

### Accessibility
- Semantic HTML throughout
- Focus-visible outlines (wax color)
- ARIA labels on interactive elements
- `prefers-reduced-motion` respected
- Minimum 44px touch targets

---

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel
```

Or connect your Git repository to [Vercel](https://vercel.com) for automatic deployments.

### Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | Backend API base URL (defaults to mock) |

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 🙏 Acknowledgments

- **Fraunces** by Undercase Type — editorial serif
- **Courier Prime** by Alan Dague-Greene — typewriter monospace
- **IBM Plex Sans** by IBM — UI sans-serif
- **Lucide** — beautiful open-source icons
- Inspired by the art of letter writing and the psychology of future-self continuity