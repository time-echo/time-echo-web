import { getAnalyticsConfig, isGa4Configured } from "./config";
import { hasAnalyticsConsent } from "./consent";
import type { Ga4EventMap, Ga4EventName } from "./events";
import {
  getStoredUtmParams,
  sanitizeAnalyticsProperties,
  sanitizeUserId,
} from "./privacy";

export type GtagFunction = (
  command: "js" | "config" | "event" | "consent" | "set",
  targetIdOrAction: string | Date,
  params?: Record<string, unknown>,
) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let isGa4Initialized = false;
let currentGa4UserId: string | null = null;
let customGtagAdapter: GtagFunction | null = null;

function getGtag(): GtagFunction | null {
  if (customGtagAdapter) return customGtagAdapter;

  if (typeof window === "undefined") return null;

  if (typeof window.gtag === "function") {
    return window.gtag;
  }

  window.dataLayer = window.dataLayer || [];
  const fallbackGtag: GtagFunction = function (...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag = fallbackGtag;
  return fallbackGtag;
}

export function setGa4AdapterForTests(adapter: GtagFunction | null): void {
  customGtagAdapter = adapter;
}

export function resetGa4StateForTests(): void {
  isGa4Initialized = false;
  currentGa4UserId = null;
  customGtagAdapter = null;
}

export function isGa4Ready(): boolean {
  return isGa4Initialized;
}

export function initializeGa4(config = getAnalyticsConfig()): boolean {
  if (!isGa4Configured(config)) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;
  if (isGa4Initialized) return true;

  try {
    const gtag = getGtag();
    if (!gtag) return false;

    if (typeof window !== "undefined") {
      window[`ga-disable-${config.ga4MeasurementId}`] = false;
    }

    gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    gtag("js", new Date());
    gtag("config", config.ga4MeasurementId, {
      send_page_view: false,
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      ...(currentGa4UserId ? { user_id: currentGa4UserId } : {}),
    });

    isGa4Initialized = true;
    return true;
  } catch {
    return false;
  }
}

export function disableGa4(config = getAnalyticsConfig()): void {
  try {
    if (typeof window !== "undefined" && config.ga4MeasurementId) {
      window[`ga-disable-${config.ga4MeasurementId}`] = true;
    }
    const gtag = getGtag();
    if (gtag) {
      gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  } catch {}
  isGa4Initialized = false;
  currentGa4UserId = null;
}

export function trackGa4Event<E extends Ga4EventName>(
  event: E,
  properties: Ga4EventMap[E],
  config = getAnalyticsConfig(),
): boolean {
  if (!isGa4Configured(config)) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  if (!isGa4Initialized) {
    initializeGa4(config);
  }

  try {
    const gtag = getGtag();
    if (!gtag) return false;

    const utmParams = getStoredUtmParams();
    const sanitized = sanitizeAnalyticsProperties({
      ...utmParams,
      ...properties,
    });

    if (currentGa4UserId) {
      sanitized.user_id = currentGa4UserId;
    }

    gtag("event", event, sanitized);
    return true;
  } catch {
    return false;
  }
}

export function identifyGa4User(
  userId: string,
  config = getAnalyticsConfig(),
): boolean {
  const safeId = sanitizeUserId(userId);
  if (!safeId) return false;

  currentGa4UserId = safeId;

  if (!isGa4Configured(config)) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  if (!isGa4Initialized) {
    initializeGa4(config);
  }

  try {
    const gtag = getGtag();
    if (!gtag) return false;

    gtag("config", config.ga4MeasurementId, {
      user_id: safeId,
      send_page_view: false,
    });
    return true;
  } catch {
    return false;
  }
}

export function resetGa4Identity(config = getAnalyticsConfig()): void {
  currentGa4UserId = null;

  if (!isGa4Configured(config) || !isGa4Initialized) return;

  try {
    const gtag = getGtag();
    if (!gtag) return;

    gtag("config", config.ga4MeasurementId, {
      user_id: null,
      send_page_view: false,
    });
  } catch {}
}
