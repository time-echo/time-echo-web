export type AnalyticsEnvironment =
  "development" | "preview" | "staging" | "production" | "test";

export interface AnalyticsConfig {
  environment: AnalyticsEnvironment;
  enabled: boolean;
  requireExplicitConsent: boolean;
  ga4MeasurementId: string;
  posthogKey: string;
  posthogHost: string;
}

function resolveEnvironment(
  envSource: Record<string, string | undefined>,
): AnalyticsEnvironment {
  const raw = (
    envSource.NEXT_PUBLIC_ANALYTICS_ENV ||
    envSource.NEXT_PUBLIC_VERCEL_ENV ||
    envSource.NODE_ENV ||
    "development"
  )
    .trim()
    .toLowerCase();

  if (raw === "production" || raw === "prod") return "production";
  if (raw === "preview") return "preview";
  if (raw === "staging" || raw === "stage") return "staging";
  if (raw === "test") return "test";
  return "development";
}

export function getAnalyticsConfig(
  overrides?: Record<string, string | undefined>,
): AnalyticsConfig {
  const envSource: Record<string, string | undefined> = overrides ?? {
    NEXT_PUBLIC_ANALYTICS_ENV: process.env.NEXT_PUBLIC_ANALYTICS_ENV,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED,
    NEXT_PUBLIC_ANALYTICS_FORCE_DEV:
      process.env.NEXT_PUBLIC_ANALYTICS_FORCE_DEV,
    NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT:
      process.env.NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT,
    NEXT_PUBLIC_GA4_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  };

  const environment = resolveEnvironment(envSource);
  const explicitEnabled =
    envSource.NEXT_PUBLIC_ANALYTICS_ENABLED?.trim().toLowerCase();
  const forceDev =
    envSource.NEXT_PUBLIC_ANALYTICS_FORCE_DEV?.trim().toLowerCase() === "true";

  const isNonTrackedEnv =
    environment === "development" || environment === "test";
  const isEnvAllowed = isNonTrackedEnv ? forceDev : explicitEnabled !== "false";

  const ga4MeasurementId = (
    envSource.NEXT_PUBLIC_GA4_MEASUREMENT_ID || ""
  ).trim();
  const posthogKey = (envSource.NEXT_PUBLIC_POSTHOG_KEY || "").trim();
  const posthogHost = (
    envSource.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
  ).trim();

  const requireExplicitConsent =
    envSource.NEXT_PUBLIC_ANALYTICS_REQUIRE_CONSENT?.trim().toLowerCase() !==
    "false";

  const hasAnyProviderKey = Boolean(ga4MeasurementId || posthogKey);

  return {
    environment,
    enabled: Boolean(isEnvAllowed && hasAnyProviderKey),
    requireExplicitConsent,
    ga4MeasurementId,
    posthogKey,
    posthogHost,
  };
}

export function isGa4Configured(config = getAnalyticsConfig()): boolean {
  return Boolean(config.enabled && config.ga4MeasurementId);
}

export function isPostHogConfigured(config = getAnalyticsConfig()): boolean {
  return Boolean(config.enabled && config.posthogKey);
}
