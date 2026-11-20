import { getAnalyticsConfig } from "./config";

export type AnalyticsConsentStatus = "granted" | "denied" | "pending";

export const CONSENT_STORAGE_KEY = "timeecho_analytics_consent";

const consentListeners = new Set<(status: AnalyticsConsentStatus) => void>();

let inMemoryConsent: AnalyticsConsentStatus = "pending";

function isDoNotTrackEnabled(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
    msDoNotTrack?: string;
  };
  const win = window as Window & { doNotTrack?: string };

  return (
    nav.doNotTrack === "1" ||
    nav.doNotTrack === "yes" ||
    nav.msDoNotTrack === "1" ||
    win.doNotTrack === "1" ||
    nav.globalPrivacyControl === true
  );
}

function readPersistedConsent(): AnalyticsConsentStatus | null {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored === "granted" || stored === "denied") {
        return stored;
      }
    } catch {}
  }

  if (typeof document !== "undefined" && typeof document.cookie === "string") {
    const match = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${CONSENT_STORAGE_KEY}=([^;]+)`),
    );
    if (match && (match[1] === "granted" || match[1] === "denied")) {
      return match[1] as AnalyticsConsentStatus;
    }
  }

  return null;
}

export function getAnalyticsConsent(): AnalyticsConsentStatus {
  if (isDoNotTrackEnabled()) {
    return "denied";
  }

  const persisted = readPersistedConsent();
  if (persisted) {
    inMemoryConsent = persisted;
    return persisted;
  }

  return inMemoryConsent;
}

export function hasAnalyticsConsent(
  requireExplicitConsent = getAnalyticsConfig().requireExplicitConsent,
): boolean {
  if (isDoNotTrackEnabled()) {
    return false;
  }

  const status = getAnalyticsConsent();
  if (status === "granted") return true;
  if (status === "denied") return false;

  return !requireExplicitConsent;
}

export function setAnalyticsConsent(status: AnalyticsConsentStatus): void {
  inMemoryConsent = status;

  if (typeof window !== "undefined") {
    try {
      if (status === "pending") {
        window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      } else {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
      }
    } catch {}
  }

  if (typeof document !== "undefined") {
    try {
      if (status === "pending") {
        document.cookie = `${CONSENT_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
      } else {
        document.cookie = `${CONSENT_STORAGE_KEY}=${status}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {}
  }

  consentListeners.forEach((listener) => {
    try {
      listener(status);
    } catch {}
  });
}

export function grantAnalyticsConsent(): void {
  setAnalyticsConsent("granted");
}

export function revokeAnalyticsConsent(): void {
  setAnalyticsConsent("denied");
}

export function resetAnalyticsConsentForTests(): void {
  inMemoryConsent = "pending";
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {}
  }
  if (typeof document !== "undefined") {
    try {
      document.cookie = `${CONSENT_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    } catch {}
  }
}

export function subscribeAnalyticsConsent(
  listener: (status: AnalyticsConsentStatus) => void,
): () => void {
  consentListeners.add(listener);
  return () => {
    consentListeners.delete(listener);
  };
}
