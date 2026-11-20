"use client";

import React from "react";
import Script from "next/script";
import { getAnalyticsConfig, isGa4Configured } from "@/lib/analytics/config";

export interface GoogleAnalyticsScriptProps {
  hasConsent: boolean;
}

export function GoogleAnalyticsScript({
  hasConsent,
}: GoogleAnalyticsScriptProps) {
  const config = getAnalyticsConfig();

  if (!hasConsent || !isGa4Configured(config)) {
    return null;
  }

  const measurementId = config.ga4MeasurementId;

  return (
    <>
      <Script
        id="timeecho-ga4-loader"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script
        id="timeecho-ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('consent', 'default', {
              analytics_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });
            gtag('js', new Date());
            gtag('config', ${JSON.stringify(measurementId)}, {
              send_page_view: false,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  );
}
