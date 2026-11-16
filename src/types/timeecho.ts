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

export interface EmotionalSnapshot {
  id?: string;
  letterId?: string;
  happinessLevel: number;
  anxietyLevel: number;
  motivationLevel: number;
  createdAt?: string;
  updatedAt?: string;
}

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

export interface LetterStampInfo {
  slug: string;
  name: string;
  category_slug?: string;
  categorySlug?: string;
}

export interface Letter {
  id: string;
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
  revealHappiness?: number | null;
  revealAnxiety?: number | null;
  revealMotivation?: number | null;
  isWaxBroken?: boolean;
  createdAt: string;
  updatedAt: string;
  emotionalSnapshot?: EmotionalSnapshot | null;
  predictions: Prediction[];
  stampId?: string | null;
  stamp?: LetterStampInfo | null;
}

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

export interface CreateLetterInput {
  title: string;
  content: string;
  email: string;
  scheduledAt: string;
  timezone?: string;
  language?: SupportedLanguage;
  stampId?: string | null;
  stamp_slug?: string | null;
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
  predictionsAccuracyRate: number;
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

export interface StampCategoryResponse {
  slug: string;
  name: string;
  position: number;
}

export interface StampItemResponse {
  slug: string;
  name: string;
  category_slug: string;
  categorySlug?: string;
  svg_content: string;
  svgContent?: string;
  position: number;
  active?: boolean;
}

export interface StampDetailResponse {
  slug: string;
  name: string;
  category_slug: string;
  categorySlug?: string;
  svg_content: string;
  svgContent?: string;
  position: number;
  active: boolean;
}

export interface StampFilters {
  category?: string;
  category_id?: string | number;
  category_slug?: string;
  name?: string;
  q?: string;
  query?: string;
  active?: boolean | string;
  status?: string;
  page?: number;
  perPage?: number;
  per_page?: number;
}
