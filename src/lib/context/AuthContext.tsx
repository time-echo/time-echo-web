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

function getActiveLocale(): SupportedLanguage {
  if (typeof window !== "undefined") {
    try {
      const saved = window.localStorage.getItem("timeecho_locale");
      if (saved === "en" || saved === "es") return saved;
    } catch {
      // ignore
    }
    const htmlLang = document.documentElement.lang;
    if (htmlLang === "en" || htmlLang === "es") return htmlLang;
  }
  return "en";
}

export interface User {
  email: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requestMagicLink: (
    email: string,
  ) => Promise<{ message: string; email: string }>;
  authenticateWithToken: (
    token: string,
  ) => Promise<{ email: string; token: string }>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "timeecho_session_token";
const USER_EMAIL_KEY = "timeecho_user_email";

const tokenVerificationPromises = new Map<
  string,
  Promise<{ email: string; token: string }>
>();

function getBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://localhost:3000/api/v1";
}

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

function persistSession(token: string, email: string) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem(USER_EMAIL_KEY, email);
      document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=2592000; SameSite=Lax`;
    } catch {
      // ignore
    }
  }
}

function clearSession() {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(USER_EMAIL_KEY);
      document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
    } catch {
      // ignore
    }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = getBaseUrl();

  const fetchCurrentUser = useCallback(async () => {
    const currentToken = token || getStoredToken();
    if (!currentToken) {
      clearSession();
      setToken(null);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/sessions/me`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${currentToken}`,
          "X-Session-Token": currentToken,
        },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          clearSession();
          setToken(null);
          setUser(null);
        }
        return;
      }

      const json = await res.json();
      const userData = json?.data || json;
      if (userData?.email) {
        persistSession(currentToken, userData.email);
        setToken(currentToken);
        setUser({ email: userData.email });
      }
    } catch (err) {
      console.warn("[AuthContext] fetchCurrentUser error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    let isMounted = true;
    const currentToken = token || getStoredToken();

    if (!currentToken) {
      clearSession();
      Promise.resolve().then(() => {
        if (isMounted && !getStoredToken()) {
          setIsLoading(false);
        }
      });
      return () => {
        isMounted = false;
      };
    }

    fetch(`${baseUrl}/sessions/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${currentToken}`,
        "X-Session-Token": currentToken,
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (!isMounted) return;
        if (!res.ok) {
          if (res.status === 401) {
            clearSession();
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
          persistSession(currentToken, userData.email);
          setToken(currentToken);
          setUser({ email: userData.email });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("[AuthContext] session check error:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [baseUrl, token]);

  /**
   * Dispatches a fresh magic link to the provided email.
   * POST /api/v1/sessions
   */
  const requestMagicLink = useCallback(
    async (email: string) => {
      setError(null);
      const res = await fetch(`${baseUrl}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const activeLocale = getActiveLocale();
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

      const responseData = json?.data || json;
      return {
        message: responseData?.message || "Magic link dispatched",
        email: responseData?.email || email,
      };
    },
    [baseUrl],
  );

  /**
   * Verifies a single-use magic login token and establishes a persistent session.
   * Deduplicates concurrent/Strict-Mode calls for the same single-use token.
   * GET /api/v1/sessions/:token
   */
  const authenticateWithToken = useCallback(
    async (tokenParam: string) => {
      setError(null);
      setIsLoading(true);

      let verificationPromise = tokenVerificationPromises.get(tokenParam);

      if (!verificationPromise) {
        verificationPromise = (async () => {
          const res = await fetch(
            `${baseUrl}/sessions/${encodeURIComponent(tokenParam)}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
              credentials: "include",
            },
          );

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

          persistSession(activeToken, userEmail);
          return { email: userEmail, token: activeToken };
        })();

        tokenVerificationPromises.set(tokenParam, verificationPromise);
      }

      try {
        const result = await verificationPromise;
        setToken(result.token);
        setUser({ email: result.email });
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
    },
    [baseUrl],
  );

  /**
   * Revokes the active session token and clears client state.
   * DELETE /api/v1/sessions
   */
  const logout = useCallback(async () => {
    const currentToken = token || getStoredToken();
    try {
      if (currentToken) {
        await fetch(`${baseUrl}/sessions`, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${currentToken}`,
            "X-Session-Token": currentToken,
          },
          credentials: "include",
        }).catch(() => {});
      }
    } finally {
      clearSession();
      tokenVerificationPromises.clear();
      setToken(null);
      setUser(null);
    }
  }, [baseUrl, token]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    isLoading,
    error,
    requestMagicLink,
    authenticateWithToken,
    logout,
    fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
