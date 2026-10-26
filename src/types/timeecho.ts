/**
 * ⏳ TimeEcho — Domain Types Definition
 *
 * Centralized TypeScript data models and interfaces for the TimeEcho domain:
 * physical postal materiality, encrypted time-capsules, emotional snapshots,
 * milestone predictions, reality ledgers, and retrospective analytics.
 */

// ============================================================================
// Core Statuses, Enums & Literal Unions
// ============================================================================

export type LetterStatus =
  "pending" | "queued" | "delivered" | "opened" | "archived";

export type PredictionCategory =
  | "city"
  | "salary"
  | "relationship"
  | "career"
  | "achievement"
  | "happiness"
  | (string & {});

export type PredictionOutcome =
  "fulfilled" | "unfulfilled" | "diverged" | "pending";

export type SupportedLanguage = "en" | "es";

export type AppearanceMode = "light" | "dark" | "system";

export type ThemeOption =
  "timeecho" | "cupcake" | "pastel" | "autumn" | "luxury" | (string & {});

export type ReflectionStyle = "reflective" | "motivational" | "nostalgic";

export type MemoryFrequency = "low" | "normal" | "frequent";

// ============================================================================
// Domain Entities
// ============================================================================

/**
 * Baseline emotional state recorded when the letter is written (1 - 10 scale).
 */
export interface EmotionalSnapshot {
  id?: string;
  letterId?: string;
  happinessLevel: number;
  anxietyLevel: number;
  motivationLevel: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * A milestone prediction about the author's future self or world,
 * evaluated retrospectively when the letter is unlocked.
 */
export interface Prediction {
  id: string;
  letterId?: string;
  category: PredictionCategory;
  prediction: string;
  reality?: string | null;
  matched?: boolean | null;
  outcome?: PredictionOutcome;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Central digital time-capsule letter.
 * Incorporates physical postal attributes (docket folio, wax seal state)
 * along with lifecycle timestamps and retrospective reality fields.
 */
export interface Letter {
  id: string;
  /** Postal folio docket number (e.g., "TE-00421", "FOLIO № TE-00912") */
  docketNumber: string;
  title: string;
  content: string;
  email: string;
  scheduledAt: string;
  deliveredAt?: string | null;
  openedAt?: string | null;
  queuedAt?: string | null;
  status: LetterStatus;
  language: SupportedLanguage;
  timezone: string;
  /** Retrospective emotional rating upon unsealing (1 - 10 scale) */
  revealHappiness?: number | null;
  revealAnxiety?: number | null;
  revealMotivation?: number | null;
  /** Tactile wax seal fracture state in the client */
  isWaxBroken?: boolean;
  createdAt: string;
  updatedAt: string;
  /** Initial emotional snapshot at composition time */
  emotionalSnapshot?: EmotionalSnapshot | null;
  /** Associated milestone predictions */
  predictions: Prediction[];
  stampId?: string | null;
}

/**
 * Archival and privacy preferences configured by the user.
 */
export interface UserPreferences {
  email: string;
  appearanceMode: AppearanceMode;
  theme: ThemeOption;
  reflectionStyle: ReflectionStyle;
  memoryFrequency: MemoryFrequency;
  allLettersPrivate: boolean;
  anonymousAnalytics: boolean;
  automaticMemories: boolean;
  futureLetterReminders: boolean;
  monthlyCheckpoints: boolean;
  surpriseMemories: boolean;
  emotionalSummaryEmails: boolean;
  locale: SupportedLanguage;
}

// ============================================================================
// Data Transfer & Mutation Inputs
// ============================================================================

export interface CreateLetterInput {
  title: string;
  content: string;
  email: string;
  scheduledAt: string;
  timezone?: string;
  language?: SupportedLanguage;
  stampId?: string | null;
  emotionalSnapshot: {
    happinessLevel: number;
    anxietyLevel: number;
    motivationLevel: number;
  };
  predictions: Array<{
    category: PredictionCategory;
    prediction: string;
  }>;
}

export interface UpdateRealityPredictionInput {
  id: string;
  reality: string;
  matched?: boolean | null;
  outcome?: PredictionOutcome;
}

export interface UpdateRealityInput {
  id: string;
  revealHappiness?: number;
  revealAnxiety?: number;
  revealMotivation?: number;
  predictions?: UpdateRealityPredictionInput[];
  openedAt?: string;
  isWaxBroken?: boolean;
}

// ============================================================================
// Retrospective Growth & Analytics Metrics
// ============================================================================

export interface EmotionalMetricSet {
  happiness: number;
  anxiety: number;
  motivation: number;
}

export interface AnalyticsMetrics {
  totalLetters: number;
  inTransitCount: number;
  deliveredCount: number;
  openedCount: number;
  archivedCount: number;
  predictionsAccuracyRate: number; // 0 - 100 percentage
  totalPredictionsCount: number;
  evaluatedPredictionsCount: number;
  matchedPredictionsCount: number;
  unmatchedPredictionsCount: number;
  emotionalAverages: {
    baseline: EmotionalMetricSet;
    reveal: EmotionalMetricSet;
    delta: EmotionalMetricSet;
  };
}

export type StampCollectionCategory =
  "small-things" | "places-i-inhabit" | "stored-thoughts" | "passage-of-time";

export interface CollectibleStamp {
  id: string;
  name: string;
  category: StampCollectionCategory;
  denomination: string;
  primaryColor: string;
  accentColor: string;
  description: string;
  storyPrompt?: string;
  isUnlocked?: boolean;
  unlockedAt?: string;
}
