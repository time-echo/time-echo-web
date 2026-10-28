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

function getStoredEmail(): string | null {
  if (typeof window !== "undefined") {
    try {
      return window.localStorage.getItem(USER_EMAIL_KEY);
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
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [user, setUser] = useState<User | null>(() => {
    const email = getStoredEmail();
    return email ? { email } : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(() =>
    Boolean(getStoredToken()),
  );
  const [error, setError] = useState<string | null>(null);

  const baseUrl = getBaseUrl();

  /**
   * Validates active session on mount by checking GET /sessions/me
   */
  const fetchCurrentUser = useCallback(async () => {
    const currentToken = token || getStoredToken();
    if (!currentToken) {
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
        setUser({ email: userData.email });
        if (typeof window !== "undefined") {
          window.localStorage.setItem(USER_EMAIL_KEY, userData.email);
        }
      }
    } catch (err) {
      console.warn("[AuthContext] fetchCurrentUser error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    const currentToken = token || getStoredToken();
    if (!currentToken) {
      return;
    }

    let isMounted = true;

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
          setUser({ email: userData.email });
          if (typeof window !== "undefined") {
            window.localStorage.setItem(USER_EMAIL_KEY, userData.email);
          }
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
        const errorMsg =
          json?.error?.message ||
          json?.message ||
          (res.status === 429
            ? "Límite de solicitudes excedido. Por favor intenta más tarde."
            : "No fue posible enviar el enlace mágico.");
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
   * GET /api/v1/sessions/:token
   */
  const authenticateWithToken = useCallback(
    async (tokenParam: string) => {
      setError(null);
      setIsLoading(true);

      try {
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
            "El enlace mágico es inválido o ha expirado.";
          const apiErr = new ApiError(
            res.status,
            json?.error?.code || "invalid_token",
            errorMsg,
            json?.error?.details,
            json?.error?.requestId,
          );
          setError(errorMsg);
          throw apiErr;
        }

        const sessionData = json?.data || json;
        const activeToken = sessionData.token || tokenParam;
        const userEmail = sessionData.email;

        persistSession(activeToken, userEmail);
        setToken(activeToken);
        setUser({ email: userEmail });

        return { email: userEmail, token: activeToken };
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
      setToken(null);
      setUser(null);
    }
  }, [baseUrl, token]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
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
