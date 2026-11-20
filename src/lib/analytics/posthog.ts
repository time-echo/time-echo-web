import posthog from "posthog-js";
import { getAnalyticsConfig, isPostHogConfigured } from "./config";
import { hasAnalyticsConsent } from "./consent";
import type { PostHogEventMap, PostHogEventName } from "./events";
import {
  isPrivateRoute,
  sanitizeAnalyticsProperties,
  sanitizeUserId,
} from "./privacy";

export interface PostHogClientAdapter {
  init: (token: string, config?: Record<string, unknown>) => void;
  capture: (eventName: string, properties?: Record<string, unknown>) => void;
  identify: (
    distinctId: string,
    userPropertiesToSet?: Record<string, unknown>,
  ) => void;
  reset: (resetDeviceId?: boolean) => void;
  opt_in_capturing: () => void;
  opt_out_capturing: () => void;
  startSessionRecording?: () => void;
  stopSessionRecording?: () => void;
}

let isPostHogInitialized = false;
let customPostHogAdapter: PostHogClientAdapter | null = null;

function getClient(): PostHogClientAdapter | null {
  if (customPostHogAdapter) return customPostHogAdapter;
  if (typeof window === "undefined") return null;
  return posthog as unknown as PostHogClientAdapter;
}

export function setPostHogAdapterForTests(
  adapter: PostHogClientAdapter | null,
): void {
  customPostHogAdapter = adapter;
}

export function resetPostHogStateForTests(): void {
  isPostHogInitialized = false;
  customPostHogAdapter = null;
}

export function isPostHogReady(): boolean {
  return isPostHogInitialized;
}

export function initializePostHog(config = getAnalyticsConfig()): boolean {
  if (!isPostHogConfigured(config)) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  try {
    const client = getClient();
    if (!client) return false;

    if (!isPostHogInitialized) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "/";

      client.init(config.posthogKey, {
        api_host: config.posthogHost,
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: false,
        respect_dnt: true,
        opt_out_capturing_by_default: true,
        opt_out_persistence_by_default: true,
        persistence: "localStorage+cookie",
        mask_all_text: true,
        mask_all_element_attributes: true,
        disable_session_recording: isPrivateRoute(currentPath),
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: "*",
          blockSelector:
            "[data-ph-no-capture], .ph-no-capture, article, textarea, input",
        },
      });
      isPostHogInitialized = true;
    }

    client.opt_in_capturing();
    return true;
  } catch {
    return false;
  }
}

export function disablePostHog(): void {
  try {
    const client = getClient();
    if (client && isPostHogInitialized) {
      client.stopSessionRecording?.();
      client.opt_out_capturing();
      client.reset();
    }
  } catch {}
}

export function updatePostHogRoutePrivacy(pathname: string): void {
  if (!isPostHogInitialized) return;

  try {
    const client = getClient();
    if (!client) return;

    if (isPrivateRoute(pathname)) {
      client.stopSessionRecording?.();
    }
  } catch {}
}

export function capturePostHogPageview(
  sanitizedPath: string,
  properties: Record<string, unknown> = {},
  config = getAnalyticsConfig(),
): boolean {
  if (!isPostHogConfigured(config)) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  if (!isPostHogInitialized) {
    initializePostHog(config);
  }

  try {
    const client = getClient();
    if (!client) return false;

    updatePostHogRoutePrivacy(sanitizedPath);

    const sanitizedProps = sanitizeAnalyticsProperties({
      ...properties,
      $current_url: sanitizedPath,
      $pathname: sanitizedPath,
      environment: config.environment,
    });

    client.capture("$pageview", sanitizedProps);
    return true;
  } catch {
    return false;
  }
}

export function trackPostHogEvent<E extends PostHogEventName>(
  event: E,
  properties: PostHogEventMap[E],
  config = getAnalyticsConfig(),
): boolean {
  if (!isPostHogConfigured(config)) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  if (!isPostHogInitialized) {
    initializePostHog(config);
  }

  try {
    const client = getClient();
    if (!client) return false;

    const sanitizedProps = sanitizeAnalyticsProperties({
      ...properties,
      environment: config.environment,
      source: "frontend",
    });

    client.capture(event, sanitizedProps);
    return true;
  } catch {
    return false;
  }
}

export function identifyPostHogUser(
  userId: string,
  traits: Record<string, unknown> = {},
  config = getAnalyticsConfig(),
): boolean {
  const safeId = sanitizeUserId(userId);
  if (!safeId) return false;

  if (!isPostHogConfigured(config)) return false;
  if (!hasAnalyticsConsent(config.requireExplicitConsent)) return false;

  if (!isPostHogInitialized) {
    initializePostHog(config);
  }

  try {
    const client = getClient();
    if (!client) return false;

    const sanitizedTraits = sanitizeAnalyticsProperties(traits);
    client.identify(safeId, sanitizedTraits);
    return true;
  } catch {
    return false;
  }
}

export function resetPostHogIdentity(config = getAnalyticsConfig()): void {
  if (!isPostHogConfigured(config) || !isPostHogInitialized) return;

  try {
    const client = getClient();
    if (!client) return;

    client.reset();
    if (hasAnalyticsConsent(config.requireExplicitConsent)) {
      client.opt_in_capturing();
    }
  } catch {}
}
