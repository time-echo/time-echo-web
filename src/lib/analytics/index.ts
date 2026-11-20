import { type AnalyticsConfig, getAnalyticsConfig } from "./config";
import {
  getAnalyticsConsent,
  grantAnalyticsConsent as setConsentGranted,
  hasAnalyticsConsent,
  resetAnalyticsConsentForTests,
  revokeAnalyticsConsent as setConsentDenied,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
} from "./consent";
import {
  type AnalyticsEventMap,
  type AnalyticsEventName,
  type Ga4EventMap,
  type Ga4EventName,
  isBackendAuthoritativeEvent,
  isGa4Event,
  isPostHogEvent,
  type PostHogEventMap,
  type PostHogEventName,
} from "./events";
import {
  disableGa4,
  identifyGa4User,
  initializeGa4,
  resetGa4Identity,
  resetGa4StateForTests,
  setGa4AdapterForTests,
  trackGa4Event,
} from "./ga4";
import {
  capturePostHogPageview,
  disablePostHog,
  identifyPostHogUser,
  initializePostHog,
  resetPostHogIdentity,
  resetPostHogStateForTests,
  setPostHogAdapterForTests,
  trackPostHogEvent,
  updatePostHogRoutePrivacy,
} from "./posthog";
import {
  captureUtmParams,
  clearStoredUtmParamsForTests,
  getStoredUtmParams,
  isPrivateRoute,
  sanitizeAnalyticsPath,
  sanitizeAnalyticsProperties,
  sanitizeUserId,
} from "./privacy";

export interface TrackOptions {
  allowBackendEventOnClient?: boolean;
  config?: AnalyticsConfig;
}

let lastTrackedPageKey: string | null = null;
let currentIdentifiedUserId: string | null = null;

export function initializeAnalytics(config = getAnalyticsConfig()): boolean {
  if (!config.enabled) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  const gaReady = initializeGa4(config);
  const phReady = initializePostHog(config);

  return gaReady || phReady;
}

export function track<E extends AnalyticsEventName>(
  event: E,
  properties: AnalyticsEventMap[E],
  options?: TrackOptions,
): boolean {
  const config = options?.config ?? getAnalyticsConfig();
  if (!config.enabled) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  if (
    isBackendAuthoritativeEvent(event) &&
    !options?.allowBackendEventOnClient
  ) {
    return false;
  }

  if (isGa4Event(event)) {
    return trackGa4Event<Ga4EventName>(
      event,
      properties as Ga4EventMap[Ga4EventName],
      config,
    );
  }

  if (isPostHogEvent(event)) {
    return trackPostHogEvent<PostHogEventName>(
      event,
      properties as PostHogEventMap[PostHogEventName],
      config,
    );
  }

  return false;
}

export function trackPageView(
  pathname: string,
  searchParams?: URLSearchParams | string | null,
  options?: { locale?: string; config?: AnalyticsConfig },
): boolean {
  const config = options?.config ?? getAnalyticsConfig();
  if (!config.enabled) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  const sanitizedPath = sanitizeAnalyticsPath(pathname);
  const utmParams = captureUtmParams(searchParams);
  const utmSignature = JSON.stringify(utmParams);
  const dedupeKey = `${sanitizedPath}?${utmSignature}`;

  if (lastTrackedPageKey === dedupeKey) {
    return false;
  }

  lastTrackedPageKey = dedupeKey;
  updatePostHogRoutePrivacy(pathname);

  const pageTitle =
    typeof document !== "undefined" ? document.title : undefined;
  const language =
    options?.locale ||
    (typeof document !== "undefined"
      ? document.documentElement.lang || undefined
      : undefined);

  const gaTracked = trackGa4Event(
    "page_view",
    {
      page_path: sanitizedPath,
      page_title: pageTitle,
      language,
      ...utmParams,
    },
    config,
  );

  const phTracked = capturePostHogPageview(
    sanitizedPath,
    {
      page_title: pageTitle,
      locale: language,
      ...utmParams,
    },
    config,
  );

  return gaTracked || phTracked;
}

export function identifyUser(
  userId: string | null | undefined,
  traits: Record<string, unknown> = {},
  config = getAnalyticsConfig(),
): boolean {
  const safeId = sanitizeUserId(userId);
  if (!safeId) return false;

  if (!config.enabled) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  if (currentIdentifiedUserId === safeId) {
    return true;
  }

  const gaIdentified = identifyGa4User(safeId, config);
  const phIdentified = identifyPostHogUser(safeId, traits, config);

  if (gaIdentified || phIdentified) {
    currentIdentifiedUserId = safeId;
    return true;
  }

  return false;
}

export function resetIdentity(config = getAnalyticsConfig()): void {
  currentIdentifiedUserId = null;
  lastTrackedPageKey = null;
  resetGa4Identity(config);
  resetPostHogIdentity(config);
}

export function grantAnalyticsConsent(config = getAnalyticsConfig()): void {
  setConsentGranted();
  initializeAnalytics(config);
}

export function revokeAnalyticsConsent(config = getAnalyticsConfig()): void {
  setConsentDenied();
  currentIdentifiedUserId = null;
  lastTrackedPageKey = null;
  disableGa4(config);
  disablePostHog();
}

export function getCurrentIdentifiedUser(): string | null {
  return currentIdentifiedUserId;
}

export function resetAnalyticsForTests(): void {
  lastTrackedPageKey = null;
  currentIdentifiedUserId = null;
  resetAnalyticsConsentForTests();
  clearStoredUtmParamsForTests();
  resetGa4StateForTests();
  resetPostHogStateForTests();
}

export {
  getAnalyticsConfig,
  getAnalyticsConsent,
  hasAnalyticsConsent,
  setAnalyticsConsent,
  subscribeAnalyticsConsent,
  sanitizeAnalyticsProperties,
  sanitizeAnalyticsPath,
  sanitizeUserId,
  isPrivateRoute,
  captureUtmParams,
  getStoredUtmParams,
  setGa4AdapterForTests,
  setPostHogAdapterForTests,
};

export type {
  AnalyticsConfig,
  AnalyticsEventMap,
  AnalyticsEventName,
  Ga4EventMap,
  Ga4EventName,
  PostHogEventMap,
  PostHogEventName,
};
