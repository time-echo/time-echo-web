# TimeEcho Architecture Documentation

## Overview

TimeEcho is a Next.js 15 (App Router) application for writing time-capsule letters to one's future self. The architecture follows a feature-based modular structure with clear separation between UI components, business logic, data access, and domain types.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                       │
├─────────────────────────────────────────────────────────────────┤
│  Pages (app/)          │  API Routes (app/api/)                 │
│  - Dashboard           │  - /letters (CRUD)                     │
│  - Letter Detail       │  - /letters/[id] (get/update)          │
│  - New Letter          │  - /letters/[id]/predictions           │
│  - Analytics           │  - /letters/[id]/archive|restore       │
│  - Settings            │  - /letters/reset (dev)                │
└────────────────────────┴────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Context Layer                        │
│  TimeEchoContext (src/lib/context/TimeEchoContext.tsx)         │
│  - Global state: capsules, preferences, locale                 │
│  - Actions: createCapsule, updateReality, archive, etc.        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Repository Layer                           │
│  ICapsuleRepository (interface)                                 │
│  HttpApiRepository (implementation)                             │
│  MockApiStore (development fallback)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Domain Types (src/types/timeecho.ts)       │
│  Letter, Prediction, EmotionalSnapshot, UserPreferences,       │
│  AnalyticsMetrics, CreateLetterInput, UpdateRealityInput       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature Modules

### 1. Capsules (`src/features/capsules/`)

**Purpose**: Letter composition, listing, and detail views.

```
capsules/
├── components/
│   ├── CapsuleCard.tsx           # Dashboard list item
│   ├── LetterComposerForm.tsx    # Full composer (new letter page)
│   ├── LinedPaperCanvas.tsx      # Ruled paper textarea
│   ├── PredictionFields.tsx      # 5 prediction inputs
│   ├── EmotionalSliders.tsx      # 3-range sliders (happiness/anxiety/motivation)
│   ├── CountdownClock.tsx        # Time until delivery
│   └── CountdownBadge.tsx        # Compact countdown display
├── hooks/
│   ├── useCapsules.ts            # List/fetch capsules
│   └── useLetterComposer.ts      # Form state & validation
└── index.ts                      # Public exports
```

**Data Flow**:
```
User Input → useLetterComposer → createCapsule (Context) → HttpApiRepository → API Route → MockApiStore
```

### 2. Reality Ledger (`src/features/reality-ledger/`)

**Purpose**: Compare predictions vs. reality when letter is opened.

```
reality-ledger/
├── components/
│   ├── RealityLedger.tsx              # Main comparison view
│   └── PredictionComparisonRow.tsx    # Single prediction row
├── hooks/
│   └── useRealityLedger.ts            # Fetch + update reality
└── index.ts
```

**Prediction Outcomes**:
- `fulfilled` — Prediction matches reality
- `exceeded` — Reality surpasses prediction
- `partially` — Partial match
- `diverged` — Prediction incorrect
- `pending` — Not yet evaluated

### 3. Analytics (`src/features/analytics/`)

**Purpose**: Retrospective metrics across all capsules.

```
analytics/
├── components/
│   ├── AccuracyMeter.tsx         # Radial progress (prediction accuracy)
│   └── EmotionalShiftGauge.tsx   # Baseline vs. reveal deltas
├── utils/
│   └── metricsCalculator.ts      # Pure functions for metrics
└── index.ts
```

**Computed Metrics**:
- Total letters, in-transit, delivered, opened, archived counts
- Prediction accuracy rate (%)
- Emotional averages: baseline, reveal, delta (happiness/anxiety/motivation)

---

## State Management

### TimeEchoContext (`src/lib/context/TimeEchoContext.tsx`)

Single global context providing:

```typescript
interface TimeEchoContextValue {
  // State
  capsules: Letter[];
  preferences: UserPreferences | null;
  locale: SupportedLanguage;
  isLoading: boolean;

  // Capsule Actions
  createCapsule: (input: CreateLetterInput) => Promise<Letter>;
  getCapsule: (id: string) => Promise<Letter | null>;
  updateReality: (id: string, input: UpdateRealityInput) => Promise<Letter>;
  archiveCapsule: (id: string) => Promise<void>;
  restoreCapsule: (id: string) => Promise<void>;
  deleteCapsule: (id: string) => Promise<void>;

  // Preferences
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;

  // i18n
  setLocale: (locale: SupportedLanguage) => void;
  t: (key: string, params?: Record<string, string>) => string;
}
```

**Provider Hierarchy** (in `app/layout.tsx`):
```
<TimeEchoProvider>
  <AppShell>
    {children}
  </AppShell>
</TimeEchoProvider>
```

---

## Data Layer

### Repository Pattern

```typescript
// Interface (src/lib/repositories/ICapsuleRepository.ts)
interface ICapsuleRepository {
  create(input: CreateLetterInput): Promise<Letter>;
  getAll(): Promise<Letter[]>;
  getById(id: string): Promise<Letter | null>;
  updateReality(id: string, input: UpdateRealityInput): Promise<Letter>;
  archive(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  reset(): Promise<void>;
}

// HTTP Implementation (src/lib/repositories/HttpApiRepository.ts)
class HttpApiRepository implements ICapsuleRepository {
  async create(input) { return fetch('/api/letters', { method: 'POST', body: JSON.stringify(input) }); }
  // ... other methods call corresponding API routes
}

// Mock Store (src/lib/mockApiStore.ts) — Development only
// In-memory array with localStorage persistence
```

**Dependency Injection**: Context instantiates `HttpApiRepository` (or mock in dev) and exposes methods.

---

## API Routes (App Router)

| Route | Method | Handler | Description |
|-------|--------|---------|-------------|
| `/api/letters` | GET | `list` | All capsules |
| `/api/letters` | POST | `create` | New capsule |
| `/api/letters/[id]` | GET | `get` | Single capsule |
| `/api/letters/[id]` | PATCH | `updateReality` | Update predictions + emotions |
| `/api/letters/[id]/archive` | POST | `archive` | Move to archived |
| `/api/letters/[id]/restore` | POST | `restore` | Un-archive |
| `/api/letters/[id]/predictions` | POST | `updatePredictions` | Batch prediction updates |
| `/api/letters/reset` | POST | `reset` | Clear all (dev) |

Each route delegates to the repository instance.

---

## Routing Structure

```
app/
├── layout.tsx              # Root: providers, fonts, global styles
├── page.tsx                # Landing / Home (letter composer)
├── globals.css             # Design tokens, base styles
├── login/
│   └── page.tsx            # Email-based auth (mock)
├── dashboard/
│   └── page.tsx            # Capsule list + stats
├── letters/
│   ├── new/
│   │   └── page.tsx        # Full composer (alternative to home)
│   ├── success/
│   │   └── page.tsx        # Confirmation + docket number
│   ├── [id]/
│   │   ├── page.tsx        # Letter detail (sealed/opened)
│   │   └── reality/
│   │       └── page.tsx    # Reality ledger comparison
├── analytics/
│   └── page.tsx            # Metrics dashboard
├── settings/
│   └── page.tsx            # Preferences (theme, locale, privacy)
├── about/
│   └── page.tsx            # About page
├── terms/
│   └── page.tsx            # Terms of service
└── privacy/
    └── page.tsx            # Privacy policy
```

---

## Type System (`src/types/timeecho.ts`)

### Core Entities

```typescript
Letter {
  id, docketNumber, title, content, email,
  scheduledAt, deliveredAt, openedAt, queuedAt,
  status: 'pending'|'queued'|'delivered'|'opened'|'archived',
  language, timezone,
  revealHappiness, revealAnxiety, revealMotivation,
  isWaxBroken,
  emotionalSnapshot: EmotionalSnapshot,
  predictions: Prediction[]
}

Prediction {
  id, category, prediction, reality, matched, outcome
}

EmotionalSnapshot {
  happinessLevel, anxietyLevel, motivationLevel (1-10)
}

UserPreferences {
  email, appearanceMode, theme, reflectionStyle,
  memoryFrequency, privacy flags, locale
}
```

### Input Types

```typescript
CreateLetterInput {
  title, content, email, scheduledAt, timezone,
  language, emotionalSnapshot, predictions[]
}

UpdateRealityInput {
  revealHappiness, revealAnxiety, revealMotivation,
  predictions: UpdateRealityPredictionInput[],
  openedAt, isWaxBroken
}
```

---

## Styling Architecture

### Tailwind CSS v4 (CSS-first)

**Configuration**: `src/app/globals.css` using `@theme inline`

```css
@theme inline {
  --color-wax: var(--wax);
  --color-ink: var(--ink);
  --color-manila: var(--manila);
  --color-parchment: var(--parchment);
  --color-crease: var(--crease);

  --font-serif-editorial: var(--font-fraunces);
  --font-letter: var(--font-courier-prime);
  --font-ui: var(--font-plex-sans);
}
```

**CSS Custom Properties** (light/dark):
```css
:root {
  --wax: #8e2818;
  --ink: #2c485e;
  --manila: #efece3;
  --parchment: #faf9f5;
  --crease: #d8d2c2;
  --foreground: #1c1f26;
  --foreground-muted: #5a606b;
}

.dark {
  --wax: #d14930;
  --ink: #77a3c4;
  --manila: #1c2028;
  --parchment: #16181d;
  --crease: #2d3340;
  --foreground: #e5e7eb;
  --foreground-muted: #9ca3af;
}
```

**Utility Classes**:
- `.paper-sheet` — Parchment card
- `.archival-folder` — Manila folder
- `.postmark-stamp` — Dashed border stamp
- `.wax-seal` — Radial gradient seal
- `.lined-paper-canvas` — Ruled paper background
- `.radial-progress` — Circular progress (CSS vars)

---

## Internationalization

**Structure**: `src/lib/i18n/`
- `en.json` — English translations
- `es.json` — Spanish translations
- `index.ts` — `getTranslations(locale)` helper

**Usage**:
```typescript
const { t, locale } = useTimeEcho();
t('letter.write_your_letter'); // "Write your letter to your future"
```

**Locale Detection**: Browser `Accept-Language` header → fallback to `en`. Persisted in `UserPreferences.locale`.

---

## Fonts (`src/lib/fonts.ts`)

Loaded via `next/font` with CSS variable registration:

```typescript
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'] });
const courierPrime = Courier_Prime({ variable: '--font-courier-prime', subsets: ['latin'] });
const plexSans = IBM_Plex_Sans({ variable: '--font-plex-sans', subsets: ['latin'] });
```

Applied in `globals.css`:
```css
@theme inline {
  --font-serif-editorial: var(--font-fraunces), Georgia, serif;
  --font-letter: var(--font-courier-prime), "Courier New", monospace;
  --font-ui: var(--font-plex-sans), system-ui, sans-serif;
}
```

---

## Development Workflow

### Mock API
- `src/lib/mockApiStore.ts` — In-memory store with `localStorage` persistence
- Seeded with `src/lib/initialSeeds.ts` on first load
- Reset via `POST /api/letters/reset`

### Environment
- No `.env` required for development (mock API)
- Production: Set `NEXT_PUBLIC_API_URL` for real backend

### Commands
```bash
pnpm dev      # Turbopack dev server
pnpm build    # Production build
pnpm lint     # ESLint (flat config)
```

---

## Deployment

**Vercel** (recommended):
- Zero-config deployment
- Automatic preview deployments
- Edge functions for API routes

**Docker** (alternative):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
```

---

## Security Considerations

- **Client-side encryption**: Letters encrypted before API submission (planned)
- **Email-only auth**: No passwords, magic links planned
- **CSP headers**: Configured in `next.config.ts`
- **No sensitive data in logs**: Structured logging with redaction
- **Rate limiting**: API routes protected (planned)

---

## Future Extensibility

| Area | Planned Enhancement |
|------|---------------------|
| Backend | Replace mock with PostgreSQL + Prisma |
| Auth | Magic links, passkeys, OAuth |
| Encryption | Client-side AES-GCM before upload |
| Notifications | Email/scheduled delivery via Resend/Cron |
| Sharing | Public/private capsule sharing |
| Mobile | React Native companion app |
| AI | Reflection prompts, prediction suggestions |