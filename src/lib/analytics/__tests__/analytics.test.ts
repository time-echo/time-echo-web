import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  type AnalyticsConfig,
  captureUtmParams,
  getAnalyticsConfig,
  getAnalyticsConsent,
  getCurrentIdentifiedUser,
  grantAnalyticsConsent,
  hasAnalyticsConsent,
  identifyUser,
  initializeAnalytics,
  isPrivateRoute,
  resetAnalyticsForTests,
  resetIdentity,
  revokeAnalyticsConsent,
  sanitizeAnalyticsPath,
  sanitizeAnalyticsProperties,
  sanitizeUserId,
  setGa4AdapterForTests,
  setPostHogAdapterForTests,
  track,
  trackPageView,
} from "../index";
import type { PostHogClientAdapter } from "../posthog";

const PROD_CONFIG: AnalyticsConfig = {
  environment: "production",
  enabled: true,
  requireExplicitConsent: true,
  ga4MeasurementId: "G-TEST12345",
  posthogKey: "phc_test_key_123",
  posthogHost: "https://us.i.posthog.com",
};

interface RecordedGtagCall {
  command: string;
  target: string | Date;
  params?: Record<string, unknown>;
}

function createMockProviders() {
  const gtagCalls: RecordedGtagCall[] = [];
  const posthogCaptures: Array<{
    event: string;
    properties?: Record<string, unknown>;
  }> = [];
  const posthogIdentifies: Array<{
    distinctId: string;
    traits?: Record<string, unknown>;
  }> = [];
  let posthogInitCount = 0;
  let posthogResets = 0;
  let posthogOptedIn = false;
  let sessionRecordingStopped = 0;

  setGa4AdapterForTests((command, target, params) => {
    gtagCalls.push({ command, target, params });
  });

  const phAdapter: PostHogClientAdapter = {
    init: () => {
      posthogInitCount += 1;
    },
    capture: (event, properties) => {
      posthogCaptures.push({ event, properties });
    },
    identify: (distinctId, traits) => {
      posthogIdentifies.push({ distinctId, traits });
    },
    reset: () => {
      posthogResets += 1;
    },
    opt_in_capturing: () => {
      posthogOptedIn = true;
    },
    opt_out_capturing: () => {
      posthogOptedIn = false;
    },
    stopSessionRecording: () => {
      sessionRecordingStopped += 1;
    },
  };

  setPostHogAdapterForTests(phAdapter);

  return {
    gtagCalls,
    posthogCaptures,
    posthogIdentifies,
    getPosthogInitCount: () => posthogInitCount,
    getPosthogResets: () => posthogResets,
    isPosthogOptedIn: () => posthogOptedIn,
    getSessionRecordingStopped: () => sessionRecordingStopped,
  };
}

describe("TimeEcho Analytics Module", () => {
  beforeEach(() => {
    resetAnalyticsForTests();
  });

  it("disables analytics in development and test environments by default", () => {
    const devConfig = getAnalyticsConfig({
      NODE_ENV: "development",
      NEXT_PUBLIC_GA4_MEASUREMENT_ID: "G-DEV123",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_dev",
    });
    assert.equal(devConfig.environment, "development");
    assert.equal(devConfig.enabled, false);

    const testConfig = getAnalyticsConfig({
      NODE_ENV: "test",
      NEXT_PUBLIC_GA4_MEASUREMENT_ID: "G-TEST123",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_test",
    });
    assert.equal(testConfig.environment, "test");
    assert.equal(testConfig.enabled, false);
  });

  it("enables analytics in staging/preview and production when keys exist", () => {
    const stagingConfig = getAnalyticsConfig({
      NEXT_PUBLIC_ANALYTICS_ENV: "staging",
      NEXT_PUBLIC_GA4_MEASUREMENT_ID: "G-STAGE123",
      NEXT_PUBLIC_POSTHOG_KEY: "phc_stage",
    });
    assert.equal(stagingConfig.environment, "staging");
    assert.equal(stagingConfig.enabled, true);

    const prodNoKeys = getAnalyticsConfig({
      NEXT_PUBLIC_ANALYTICS_ENV: "production",
    });
    assert.equal(prodNoKeys.enabled, false);
  });

  it("blocks initialization and event tracking before consent is granted", () => {
    const mocks = createMockProviders();

    assert.equal(getAnalyticsConsent(), "pending");
    assert.equal(hasAnalyticsConsent(true), false);

    const initResult = initializeAnalytics(PROD_CONFIG);
    assert.equal(initResult, false);

    const trackedGa = track(
      "generate_lead",
      { lead_source: "landing_composer", language: "es" },
      { config: PROD_CONFIG },
    );
    const trackedPh = track(
      "letter_creation_started",
      { source: "landing", is_authenticated: false, locale: "es" },
      { config: PROD_CONFIG },
    );

    assert.equal(trackedGa, false);
    assert.equal(trackedPh, false);
    assert.equal(mocks.gtagCalls.length, 0);
    assert.equal(mocks.posthogCaptures.length, 0);
  });

  it("initializes once and routes GA4 and PostHog events without cross-provider duplication", () => {
    const mocks = createMockProviders();
    grantAnalyticsConsent(PROD_CONFIG);
    initializeAnalytics(PROD_CONFIG);

    assert.equal(mocks.getPosthogInitCount(), 1);
    assert.equal(mocks.isPosthogOptedIn(), true);

    track(
      "generate_lead",
      { lead_source: "magic_link_request", language: "en" },
      { config: PROD_CONFIG },
    );

    track(
      "letter_creation_started",
      {
        source: "composer",
        is_authenticated: true,
        locale: "en",
        horizon_preset: "1y",
      },
      { config: PROD_CONFIG },
    );

    track(
      "stamp_selected",
      {
        stamp_slug: "vintage-compass",
        category_slug: "travel",
        source: "composer",
      },
      { config: PROD_CONFIG },
    );

    const gaEvents = mocks.gtagCalls.filter((c) => c.command === "event");
    assert.equal(gaEvents.length, 1);
    assert.equal(gaEvents[0].target, "generate_lead");
    assert.equal(gaEvents[0].params?.lead_source, "magic_link_request");

    assert.equal(mocks.posthogCaptures.length, 2);
    assert.equal(mocks.posthogCaptures[0].event, "letter_creation_started");
    assert.equal(mocks.posthogCaptures[1].event, "stamp_selected");
  });

  it("prevents client-side emission of backend-authoritative events to avoid duplication", () => {
    const mocks = createMockProviders();
    grantAnalyticsConsent(PROD_CONFIG);

    const blockedScheduled = track(
      "letter_scheduled",
      { letter_id: "10" },
      { config: PROD_CONFIG },
    );
    const blockedSaved = track(
      "letter_saved",
      { letter_id: "10" },
      { config: PROD_CONFIG },
    );
    const blockedViewed = track(
      "letter_viewed",
      { letter_id: "10" },
      { config: PROD_CONFIG },
    );
    const blockedLogin = track(
      "user_logged_in",
      { auth_method: "magic_link" },
      { config: PROD_CONFIG },
    );
    const blockedSignup = track(
      "user_signed_up",
      { auth_method: "magic_link" },
      { config: PROD_CONFIG },
    );

    assert.equal(blockedScheduled, false);
    assert.equal(blockedSaved, false);
    assert.equal(blockedViewed, false);
    assert.equal(blockedLogin, false);
    assert.equal(blockedSignup, false);
    assert.equal(mocks.posthogCaptures.length, 0);
  });

  it("handles user identification, rejects emails as user IDs, and resets identity on logout", () => {
    const mocks = createMockProviders();
    grantAnalyticsConsent(PROD_CONFIG);

    assert.equal(sanitizeUserId("user@example.com"), null);
    assert.equal(
      identifyUser("user@example.com", { locale: "es" }, PROD_CONFIG),
      false,
    );
    assert.equal(mocks.posthogIdentifies.length, 0);

    const identified = identifyUser(
      "usr_9f8e7d6c5b4a3210",
      {
        locale: "es",
        email: "leak@example.com",
      },
      PROD_CONFIG,
    );
    assert.equal(identified, true);
    assert.equal(getCurrentIdentifiedUser(), "usr_9f8e7d6c5b4a3210");
    assert.equal(mocks.posthogIdentifies.length, 1);
    assert.equal(mocks.posthogIdentifies[0].distinctId, "usr_9f8e7d6c5b4a3210");
    assert.equal(mocks.posthogIdentifies[0].traits?.locale, "es");
    assert.equal(mocks.posthogIdentifies[0].traits?.email, undefined);

    identifyUser("usr_9f8e7d6c5b4a3210", { locale: "es" }, PROD_CONFIG);
    assert.equal(mocks.posthogIdentifies.length, 1);

    resetIdentity(PROD_CONFIG);
    assert.equal(getCurrentIdentifiedUser(), null);
    assert.equal(mocks.getPosthogResets(), 1);

    const lastGaConfig = mocks.gtagCalls
      .filter((c) => c.command === "config")
      .pop();
    assert.equal(lastGaConfig?.params?.user_id, null);
  });

  it("deduplicates pageviews, sanitizes sensitive route paths, preserves UTM parameters, and stops session replay on private routes", () => {
    const mocks = createMockProviders();
    grantAnalyticsConsent(PROD_CONFIG);

    const utms = captureUtmParams(
      "utm_source=newsletter&utm_medium=email&utm_campaign=launch_2026",
    );
    assert.equal(utms.utm_source, "newsletter");
    assert.equal(utms.utm_medium, "email");
    assert.equal(utms.utm_campaign, "launch_2026");

    const firstPv = trackPageView(
      "/",
      "utm_source=newsletter&utm_medium=email&utm_campaign=launch_2026",
      { locale: "es", config: PROD_CONFIG },
    );
    const duplicatePv = trackPageView(
      "/",
      "utm_source=newsletter&utm_medium=email&utm_campaign=launch_2026",
      { locale: "es", config: PROD_CONFIG },
    );

    assert.equal(firstPv, true);
    assert.equal(duplicatePv, false);

    trackPageView("/login/secret_magic_token_999", "", {
      locale: "es",
      config: PROD_CONFIG,
    });
    trackPageView("/letters/42/reality", "", {
      locale: "es",
      config: PROD_CONFIG,
    });

    const gaPageViews = mocks.gtagCalls.filter(
      (c) => c.command === "event" && c.target === "page_view",
    );
    assert.equal(gaPageViews.length, 3);
    assert.equal(gaPageViews[0].params?.page_path, "/");
    assert.equal(gaPageViews[0].params?.utm_source, "newsletter");
    assert.equal(gaPageViews[1].params?.page_path, "/login/[token]");
    assert.equal(gaPageViews[2].params?.page_path, "/letters/[id]/reality");

    assert.equal(isPrivateRoute("/"), false);
    assert.equal(isPrivateRoute("/about"), false);
    assert.equal(isPrivateRoute("/dashboard"), true);
    assert.equal(isPrivateRoute("/letters/42"), true);
    assert.equal(sanitizeAnalyticsPath("/letters/new"), "/letters/new");
    assert.equal(sanitizeAnalyticsPath("/letters/success"), "/letters/success");
    assert.equal(sanitizeAnalyticsPath("/letters/abc-123"), "/letters/[id]");
    assert.ok(mocks.getSessionRecordingStopped() >= 2);
  });

  it("strips all sensitive properties and redacts emails in property values", () => {
    const cleaned = sanitizeAnalyticsProperties({
      source: "composer",
      email: "private@example.com",
      title: "Secret title",
      content: "Dear future me...",
      token: "tok_123",
      prediction: "Secret prediction",
      reality: "Secret reality",
      password: "123",
      description: "Sent by someone@example.org yesterday",
    });

    assert.equal(cleaned.source, "composer");
    assert.equal(cleaned.description, "Sent by [REDACTED] yesterday");
    assert.equal(cleaned.email, undefined);
    assert.equal(cleaned.title, undefined);
    assert.equal(cleaned.content, undefined);
    assert.equal(cleaned.token, undefined);
    assert.equal(cleaned.prediction, undefined);
    assert.equal(cleaned.reality, undefined);
    assert.equal(cleaned.password, undefined);
  });

  it("revoking consent disables providers and blocks subsequent events", () => {
    const mocks = createMockProviders();
    grantAnalyticsConsent(PROD_CONFIG);

    track(
      "letter_creation_started",
      { source: "landing", is_authenticated: false, locale: "es" },
      { config: PROD_CONFIG },
    );
    assert.equal(mocks.posthogCaptures.length, 1);

    revokeAnalyticsConsent(PROD_CONFIG);
    assert.equal(hasAnalyticsConsent(true), false);
    assert.equal(mocks.isPosthogOptedIn(), false);

    const afterRevoke = track(
      "letter_creation_started",
      { source: "landing", is_authenticated: false, locale: "es" },
      { config: PROD_CONFIG },
    );
    assert.equal(afterRevoke, false);
    assert.equal(mocks.posthogCaptures.length, 1);
  });

  it("fails safely when provider adapters throw errors", () => {
    grantAnalyticsConsent(PROD_CONFIG);
    setGa4AdapterForTests(() => {
      throw new Error("GA4 script blocked by client extension");
    });
    setPostHogAdapterForTests({
      init: () => {
        throw new Error("PostHog blocked");
      },
      capture: () => {
        throw new Error("PostHog capture failed");
      },
      identify: () => {
        throw new Error("PostHog identify failed");
      },
      reset: () => {
        throw new Error("PostHog reset failed");
      },
      opt_in_capturing: () => {},
      opt_out_capturing: () => {},
    });

    assert.doesNotThrow(() => {
      track(
        "generate_lead",
        { lead_source: "landing_composer", language: "es" },
        { config: PROD_CONFIG },
      );
      track(
        "letter_creation_started",
        { source: "landing", is_authenticated: false, locale: "es" },
        { config: PROD_CONFIG },
      );
      identifyUser("usr_123456", {}, PROD_CONFIG);
      resetIdentity(PROD_CONFIG);
    });
  });
});
