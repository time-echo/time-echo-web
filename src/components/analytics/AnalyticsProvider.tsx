"use client";

import React, { Suspense, useEffect, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  hasAnalyticsConsent,
  initializeAnalytics,
  subscribeAnalyticsConsent,
  trackPageView,
} from "@/lib/analytics";
import { updatePostHogRoutePrivacy } from "@/lib/analytics/posthog";
import { GoogleAnalyticsScript } from "./GoogleAnalyticsScript";

function RouteAnalyticsTracker({ hasConsent }: { hasConsent: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchString = searchParams ? searchParams.toString() : "";

  useEffect(() => {
    updatePostHogRoutePrivacy(pathname);
    if (!hasConsent) return;

    initializeAnalytics();
    trackPageView(pathname, searchString);
  }, [pathname, searchString, hasConsent]);

  return null;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const hasConsent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    () => hasAnalyticsConsent(),
    () => false,
  );

  useEffect(() => {
    if (hasConsent) {
      initializeAnalytics();
    }
  }, [hasConsent]);

  return (
    <>
      <GoogleAnalyticsScript hasConsent={hasConsent} />
      <Suspense fallback={null}>
        <RouteAnalyticsTracker hasConsent={hasConsent} />
      </Suspense>
      {children}
    </>
  );
}
