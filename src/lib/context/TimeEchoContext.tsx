"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Letter,
  CreateLetterInput,
  UpdateRealityInput,
  SupportedLanguage,
} from "@/types/timeecho";
import { ICapsuleRepository } from "@/lib/repositories/ICapsuleRepository";
import { HttpApiRepository } from "@/lib/repositories/HttpApiRepository";
import { getTranslation } from "@/lib/i18n";
import { INITIAL_UNLOCKED_STAMP_IDS } from "@/components/stamps";

const localeListeners = new Set<() => void>();

function subscribeLocale(callback: () => void) {
  localeListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    localeListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

function getLocaleSnapshot(): SupportedLanguage {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("timeecho_locale");
    if (saved === "es" || saved === "en") {
      return saved;
    }
    const cookieMatch = document.cookie.match(
      /(?:^|;\s*)(?:timeecho_locale|NEXT_LOCALE)=([^;]+)/,
    );
    if (cookieMatch && (cookieMatch[1] === "es" || cookieMatch[1] === "en")) {
      return cookieMatch[1] as SupportedLanguage;
    }
    const htmlLang = document.documentElement.lang;
    if (htmlLang === "es" || htmlLang === "en") {
      return htmlLang;
    }
  }
  return "es";
}

interface TimeEchoContextValue {
  capsules: Letter[];
  isLoading: boolean;
  error: string | null;
  locale: SupportedLanguage;
  setLocale: (locale: SupportedLanguage) => void;
  toggleLocale: () => void;
  repository: ICapsuleRepository;
  refreshCapsules: () => Promise<void>;
  getCapsuleById: (id: string) => Letter | undefined;
  createCapsule: (input: CreateLetterInput) => Promise<Letter>;
  updateReality: (input: UpdateRealityInput) => Promise<Letter>;
  archiveCapsule: (id: string) => Promise<Letter>;
  restoreCapsule: (id: string) => Promise<Letter>;
  deleteCapsule: (id: string) => Promise<void>;
  breakWaxSeal: (id: string) => Promise<Letter>;
  resetVault: () => Promise<void>;
  unlockedStampIds: string[];
  unlockStamp: (id: string) => void;
  isStampUnlocked: (id: string) => boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const TimeEchoContext = createContext<TimeEchoContextValue | undefined>(
  undefined,
);

interface TimeEchoProviderProps {
  children: ReactNode;
  repository?: ICapsuleRepository;
  defaultLocale?: SupportedLanguage;
}

export function TimeEchoProvider({
  children,
  repository: customRepo,
  defaultLocale = "es",
}: TimeEchoProviderProps) {
  const router = useRouter();
  const repository = useMemo<ICapsuleRepository>(
    () => customRepo || new HttpApiRepository(),
    [customRepo],
  );

  const [capsules, setCapsules] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    () => defaultLocale,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    if (typeof document !== "undefined") {
      document.cookie = `timeecho_locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, [locale]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("timeecho_appearance");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setLocale = useCallback(
    (newLocale: SupportedLanguage) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("timeecho_locale", newLocale);
        document.cookie = `timeecho_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = newLocale;
        localeListeners.forEach((listener) => listener());
        router.refresh();
      }
    },
    [router],
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === "es" ? "en" : "es");
  }, [locale, setLocale]);

  const [unlockedStampIds, setUnlockedStampIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem("timeecho_unlocked_stamps");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        return INITIAL_UNLOCKED_STAMP_IDS;
      }
    }
    return INITIAL_UNLOCKED_STAMP_IDS;
  });

  const unlockStamp = useCallback((id: string) => {
    setUnlockedStampIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            "timeecho_unlocked_stamps",
            JSON.stringify(next),
          );
        } catch {
          return next;
        }
      }
      return next;
    });
  }, []);

  const isStampUnlocked = useCallback((id: string) => Boolean(id), []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return getTranslation(locale, key, params);
    },
    [locale],
  );

  // Load capsules from active repository on demand
  const refreshCapsules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await repository.getAll();
      setCapsules(items);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al cargar las cápsulas del tiempo";
      setError(msg);
      console.error("[TimeEchoContext] refreshCapsules error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [repository]);

  // Initial asynchronous load
  useEffect(() => {
    let isMounted = true;

    repository
      .getAll()
      .then((items) => {
        if (isMounted) {
          setCapsules(items);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Error al cargar las cápsulas del tiempo";
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [repository]);

  const getCapsuleById = useCallback(
    (id: string): Letter | undefined => {
      return capsules.find((c) => c.id === id);
    },
    [capsules],
  );

  const createCapsule = useCallback(
    async (input: CreateLetterInput): Promise<Letter> => {
      setError(null);
      try {
        const created = await repository.create(input);
        if (input.stampId) {
          unlockStamp(input.stampId);
        }
        setCapsules((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al crear la cápsula";
        setError(msg);
        throw err;
      }
    },
    [repository, unlockStamp],
  );

  const updateReality = useCallback(
    async (input: UpdateRealityInput): Promise<Letter> => {
      setError(null);
      try {
        const updated = await repository.updateReality(input);
        setCapsules((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
        return updated;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error al actualizar el expediente de realidad";
        setError(msg);
        throw err;
      }
    },
    [repository],
  );

  const archiveCapsule = useCallback(
    async (id: string): Promise<Letter> => {
      setError(null);
      try {
        const updated = await repository.archive(id);
        setCapsules((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
        return updated;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al archivar la cápsula";
        setError(msg);
        throw err;
      }
    },
    [repository],
  );

  const restoreCapsule = useCallback(
    async (id: string): Promise<Letter> => {
      setError(null);
      try {
        const updated = await repository.restore(id);
        setCapsules((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
        return updated;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al restaurar la cápsula";
        setError(msg);
        throw err;
      }
    },
    [repository],
  );

  const deleteCapsule = useCallback(
    async (id: string): Promise<void> => {
      setError(null);
      try {
        await repository.delete(id);
        setCapsules((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al eliminar la cápsula";
        setError(msg);
        throw err;
      }
    },
    [repository],
  );

  /**
   * Convenience action to break the wax seal and unseal the letter.
   */
  const breakWaxSeal = useCallback(
    async (id: string): Promise<Letter> => {
      return updateReality({
        id,
        isWaxBroken: true,
        openedAt: new Date().toISOString(),
      });
    },
    [updateReality],
  );

  /**
   * Resets the vault back to initial demo seeds.
   */
  const resetVault = useCallback(async () => {
    setIsLoading(true);
    try {
      if (typeof window !== "undefined") {
        await fetch("/api/letters/reset", { method: "POST" }).catch(() => {});
      }
      await refreshCapsules();
    } finally {
      setIsLoading(false);
    }
  }, [refreshCapsules]);

  const value = useMemo<TimeEchoContextValue>(
    () => ({
      capsules,
      isLoading,
      error,
      locale,
      setLocale,
      toggleLocale,
      repository,
      refreshCapsules,
      getCapsuleById,
      createCapsule,
      updateReality,
      archiveCapsule,
      restoreCapsule,
      deleteCapsule,
      breakWaxSeal,
      resetVault,
      unlockedStampIds,
      unlockStamp,
      isStampUnlocked,
      t,
    }),
    [
      capsules,
      isLoading,
      error,
      locale,
      setLocale,
      toggleLocale,
      repository,
      refreshCapsules,
      getCapsuleById,
      createCapsule,
      updateReality,
      archiveCapsule,
      restoreCapsule,
      deleteCapsule,
      breakWaxSeal,
      resetVault,
      unlockedStampIds,
      unlockStamp,
      isStampUnlocked,
      t,
    ],
  );

  return (
    <TimeEchoContext.Provider value={value}>
      {children}
    </TimeEchoContext.Provider>
  );
}

/**
 * Hook to consume TimeEcho vault state, locale, and repository operations.
 */
export function useTimeEcho(): TimeEchoContextValue {
  const context = useContext(TimeEchoContext);
  if (!context) {
    throw new Error("useTimeEcho must be used within a <TimeEchoProvider>");
  }
  return context;
}
