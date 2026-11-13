# TimeEcho Architecture Documentation

## Overview

TimeEcho is a Next.js 16 (App Router) application for writing time-capsule letters to one's future self. The architecture follows a feature-based modular structure with clear separation between UI components, business logic, data access, and domain types.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                       │
├─────────────────────────────────────────────────────────────────┤
│  Pages (app/)                                                   │
│  - Dashboard (/dashboard)                                       │
│  - Letter Detail & Reality Ledger (/letters/[id])               │
│  - New Letter Composer (/letters/new, /)                        │
│  - Analytics (/analytics)                                       │
│  - Settings & Preferences (/settings)                           │
│  - Magic Link Auth (/login, /login/[token])                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      React Context Layer                        │
│  TimeEchoContext (src/lib/context/TimeEchoContext.tsx)         │
│  - Global state: capsules, preferences, locale                 │
│  - Actions: createCapsule, updateReality, archive, etc.        │
│  AuthContext (src/lib/context/AuthContext.tsx)                 │
│  - Authentication session, magic link login, logout            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Repository Layer                           │
│  ICapsuleRepository (src/lib/repositories/ICapsuleRepository)   │
│  HttpApiRepository (calls Rails 8 API backend: /api/v1/*)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Domain Types (src/types/timeecho.ts)       │
│  Letter, Prediction, EmotionalSnapshot, UserPreferences,       │
│  Stamp, StampCategory, AnalyticsMetrics, CreateLetterInput      │
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
User Input → useLetterComposer → createCapsule (Context) → HttpApiRepository → Rails 8 API (/api/v1/letters)
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

### 4. Postage Stamps (`src/components/stamps/`)

**Purpose**: Stamp selection, categorization, and vector rendering.

```
stamps/
├── Stamp.tsx                   # Individual stamp with size/theme variants
├── LetterStamp.tsx             # Affixed postage stamp representation
├── StampPickerModal.tsx        # Modal for catalog browsing and search
├── StampRenderer.tsx           # DOMPurify-sanitized SVG renderer
├── useStampCatalog.ts          # Catalog hook with API integration and offline fallback
└── stamps.data.ts              # Category definitions and static fallbacks
```

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
  getAll(params?: { status?: string; page?: number }): Promise<Letter[]>;
  getById(id: string): Promise<Letter | null>;
  updateReality(input: UpdateRealityInput): Promise<Letter>;
  archive(id: string): Promise<Letter>;
  restore(id: string): Promise<Letter>;
  delete(id: string): Promise<void>;
  getStamps?(
    locale?: string,
    filters?: StampFilters,
  ): Promise<StampItemResponse[]>;
  getStampCategories?(locale?: string): Promise<StampCategoryResponse[]>;
  getStampBySlug?(
    slug: string,
    locale?: string,
  ): Promise<StampDetailResponse | null>;
}

// HTTP Implementation (src/lib/repositories/HttpApiRepository.ts)
// Directly communicates with Rails 8 API backend (/api/v1/*)
class HttpApiRepository implements ICapsuleRepository {
  // Dispatches requests with Bearer token, Accept-Language, and X-Locale headers
}
```

---

## Backend REST API Integration (`/api/v1`)

The frontend interacts directly with the Rails 8 API backend on port `3000`:

| Endpoint                          | Method   | Frontend Repository Method     | Description                               |
| :-------------------------------- | :------- | :----------------------------- | :---------------------------------------- |
| `/api/v1/letters`                 | `GET`    | `getAll(params)`               | Paginated letters timeline                |
| `/api/v1/letters`                 | `POST`   | `create(input)`                | Create future capsule letter              |
| `/api/v1/letters/:id`             | `GET`    | `getById(id)`                  | Single capsule details                    |
| `/api/v1/letters/:id`             | `DELETE` | `delete(id)`                   | Delete unqueued letter                    |
| `/api/v1/letters/:id/archive`     | `POST`   | `archive(id)`                  | Archive delivered letter                  |
| `/api/v1/letters/:id/restore`     | `POST`   | `restore(id)`                  | Restore letter from archive               |
| `/api/v1/letters/:id/predictions` | `POST`   | `updateReality(input)`         | Submit reality outcomes                   |
| `/api/v1/stamps`                  | `GET`    | `getStamps(locale, filters)`   | Stamp catalog with filters and pagination |
| `/api/v1/stamps/:slug`            | `GET`    | `getStampBySlug(slug, locale)` | Single stamp with vector SVG              |
| `/api/v1/stamp_categories`        | `GET`    | `getStampCategories(locale)`   | Active stamp categories                   |
| `/api/v1/sessions`                | `POST`   | `requestMagicLink(email)`      | Request magic login email                 |
| `/api/v1/sessions/:token`         | `GET`    | `verifySessionToken(token)`    | Exchange login token for session          |

### Stamps Catalog Filtering (cURL)

The postage stamps catalog endpoint supports query parameter filtering:

```bash
curl --location 'http://localhost:3000/api/v1/stamps?category=small-things&q=coffee&page=1&per_page=20' \
    --header 'Accept: application/json' \
    --header 'Accept-Language: en' \
    --header 'Authorization: Bearer b9187a1102f00429ed165330d90997cc716c4c2bda1f240e'
```

- Filter parameters: `category` (slug or ID), `q` (search name in English/Spanish), `page` (pagination), `per_page` (page size).
- Headers: `Accept: application/json`, `Accept-Language: en` / `X-Locale`, and `Authorization: Bearer <token>`.
- Implemented in `HttpApiRepository.ts` via `getStamps(locale, filters)` and `StampFilters`. See [`curl.md`](curl.md) for full cURL specifications.

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
t("letter.write_your_letter"); // "Write your letter to your future"
```

**Locale Detection**: Browser `Accept-Language` header → fallback to `en`. Persisted in `UserPreferences.locale`.

---

## Fonts (`src/lib/fonts.ts`)

Loaded via `next/font` with CSS variable registration:

```typescript
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
});
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
});
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

### Backend Connection

- Connects to Rails 8 API server (`http://localhost:3000/api/v1`) via `HttpApiRepository`.
- Seed data and demo capsules are initialized in the backend with `bin/rails db:seed`.

### Environment

- Development: `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1` (configured in `.env.local`)
- Production: Set `NEXT_PUBLIC_API_URL` to production API domain

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

- **Server-side encryption**: Letters are encrypted at rest via Rails Active Record Encryption (`encrypts :title`, `encrypts :content`).
- **SVG Sanitization**: Dynamic stamp SVGs are sanitized with DOMPurify before rendering to prevent XSS.
- **Passwordless Authentication**: Single-use cryptographic magic links with automatic expiration.
- **CSP headers**: Configured in `next.config.ts`.
- **No sensitive data in logs**: Redacted fields and structured logging.

---

## Future Extensibility

| Area              | Planned Enhancement                                  |
| ----------------- | ---------------------------------------------------- |
| Client Encryption | Client-side AES-GCM before upload                    |
| Authentication    | Passkeys / WebAuthn support                          |
| Sharing           | Public/private capsule sharing                       |
| Mobile            | React Native companion app                           |
| AI                | Reflection prompts, milestone prediction suggestions |
