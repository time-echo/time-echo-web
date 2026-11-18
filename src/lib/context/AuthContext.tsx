"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { ApiError } from "@/lib/repositories/HttpApiRepository";
import { getTranslation } from "@/lib/i18n";
import { SupportedLanguage } from "@/types/timeecho";
import { identifyUser, resetIdentity, track } from "@/lib/analytics";

function getActiveLocale(): SupportedLanguage {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem("timeecho_locale");
      if (saved === "en" || saved === "es") return saved;
    } catch {}
    const cookieMatch =
      typeof document !== "undefined" &&
      document.cookie.match(
        /(?:^|;\s*)(?:timeecho_locale|NEXT_LOCALE)=([^;]+)/,
      );
    if (cookieMatch && (cookieMatch[1] === "es" || cookieMatch[1] === "en")) {
      return cookieMatch[1] as SupportedLanguage;
    }
    const htmlLang =
      typeof document !== "undefined" && document.documentElement.lang;
    if (htmlLang === "en" || htmlLang === "es") {
      return htmlLang as SupportedLanguage;
    }
  }
  return "es";
}

export interface User {
  id?: string;
  email: string;
}

interface AuthSessionResult {
  userId?: string;
  email: string;
  token: string;
  isNewUser?: boolean;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requestMagicLink: (
    email: string,
    localeOverride?: string,
  ) => Promise<{ message: string; email: string }>;
  authenticateWithToken: (token: string) => Promise<AuthSessionResult>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "timeecho_session_token";
const USER_EMAIL_KEY = "timeecho_user_email";
const USER_ID_KEY = "timeecho_user_id";

const tokenVerificationPromises = new Map<string, Promise<AuthSessionResult>>();

function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }
  return null;
}

function getStoredUserId(): string | undefined {
  if (typeof window !== "undefined") {
    try {
      return window.localStorage.getItem(USER_ID_KEY) || undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function persistSession(token: string, email: string, userId?: string) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(USER_EMAIL_KEY, email);
      if (userId) {
        window.localStorage.setItem(USER_ID_KEY, userId);
      }
    } catch {}
  }
}

function clearSession() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_EMAIL_KEY);
      window.localStorage.removeItem(USER_ID_KEY);
      document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
    } catch {}
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          clearSession();
          resetIdentity();
          setToken(null);
          setUser(null);
        }
        return;
      }

      const json = await res.json();
      const userData = json?.data || json;
      if (userData?.email) {
        const activeToken =
          userData.token || getStoredToken() || "active_session";
        const resolvedUserId =
          userData.userId || userData.id || getStoredUserId();
        persistSession(activeToken, userData.email, resolvedUserId);
        setToken(activeToken);
        setUser({ id: resolvedUserId, email: userData.email });
        if (resolvedUserId) {
          identifyUser(resolvedUserId, {
            locale: userData.locale || getActiveLocale(),
          });
        }
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/auth/me", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (!isMounted) return;
        if (!res.ok) {
          if (res.status === 401) {
            clearSession();
            resetIdentity();
            setToken(null);
            setUser(null);
          }
          setIsLoading(false);
          return;
        }

        const json = await res.json();
        if (!isMounted) return;
        const userData = json?.data || json;
        if (userData?.email) {
          const activeToken =
            userData.token || getStoredToken() || "active_session";
          const resolvedUserId =
            userData.userId || userData.id || getStoredUserId();
          persistSession(activeToken, userData.email, resolvedUserId);
          setToken(activeToken);
          setUser({ id: resolvedUserId, email: userData.email });
          if (resolvedUserId) {
            identifyUser(resolvedUserId, {
              locale: userData.locale || getActiveLocale(),
            });
          }
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const requestMagicLink = useCallback(
    async (email: string, localeOverride?: string) => {
      setError(null);
      const activeLocale =
        localeOverride === "en" || localeOverride === "es"
          ? (localeOverride as SupportedLanguage)
          : getActiveLocale();

      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Locale": activeLocale,
          "Accept-Language": activeLocale,
        },
        credentials: "include",
        body: JSON.stringify({ email, locale: activeLocale }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg =
          json?.error?.message ||
          json?.message ||
          (res.status === 429
            ? getTranslation(activeLocale, "login.rateLimitError")
            : getTranslation(activeLocale, "login.requestError"));
        const apiErr = new ApiError(
          res.status,
          json?.error?.code || "request_failed",
          errorMsg,
          json?.error?.details,
          json?.error?.requestId,
        );
        setError(errorMsg);
        throw apiErr;
      }

      track("generate_lead", {
        lead_source: "magic_link_request",
        language: activeLocale,
      });

      const responseData = json?.data || json;
      return {
        message: responseData?.message || "Magic link dispatched",
        email: responseData?.email || email,
      };
    },
    [],
  );

  const authenticateWithToken = useCallback(async (tokenParam: string) => {
    setError(null);
    setIsLoading(true);

    let verificationPromise = tokenVerificationPromises.get(tokenParam);

    if (!verificationPromise) {
      verificationPromise = (async () => {
        const activeLocale = getActiveLocale();
        const res = await fetch("/api/auth/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Locale": activeLocale,
            "Accept-Language": activeLocale,
          },
          credentials: "include",
          body: JSON.stringify({ token: tokenParam }),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          const errorMsg =
            json?.error?.message ||
            json?.message ||
            getTranslation(getActiveLocale(), "login.invalidToken");
          throw new ApiError(
            res.status,
            json?.error?.code || "invalid_token",
            errorMsg,
            json?.error?.details,
            json?.error?.requestId,
          );
        }

        const sessionData = json?.data || json;
        const activeToken = sessionData.token || tokenParam;
        const userEmail = sessionData.email;
        const userId = sessionData.userId || sessionData.id;
        const isNewUser = Boolean(sessionData.isNewUser);

        persistSession(activeToken, userEmail, userId);

        if (userId) {
          identifyUser(userId, { locale: activeLocale });
        }

        if (isNewUser) {
          track("sign_up", {
            method: "magic_link",
            language: activeLocale,
          });
        } else {
          track("login", {
            method: "magic_link",
            language: activeLocale,
          });
        }

        return {
          userId,
          email: userEmail,
          token: activeToken,
          isNewUser,
        };
      })();

      tokenVerificationPromises.set(tokenParam, verificationPromise);
    }

    try {
      const result = await verificationPromise;
      setToken(result.token);
      setUser({ id: result.userId, email: result.email });
      return result;
    } catch (err) {
      tokenVerificationPromises.delete(tokenParam);
      const errorMsg =
        err instanceof Error
          ? err.message
          : getTranslation(getActiveLocale(), "login.invalidToken");
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        credentials: "include",
      }).catch(() => {});
    } finally {
      clearSession();
      resetIdentity();
      tokenVerificationPromises.clear();
      setToken(null);
      setUser(null);
      setError(null);
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user?.email),
    isLoading,
    error,
    requestMagicLink,
    authenticateWithToken,
    logout,
    fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
