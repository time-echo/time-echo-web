"use client";

import { useEffect, useCallback, useSyncExternalStore } from "react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { ICapsuleRepository } from "@/lib/repositories/ICapsuleRepository";
import { InspirationItemResponse } from "@/types/timeecho";

interface InspirationCatalogStore {
  locale: string;
  inspirations: InspirationItemResponse[];
  isLoading: boolean;
  error: Error | null;
  fetchedAt: number;
}

const initialStore: InspirationCatalogStore = {
  locale: "",
  inspirations: [],
  isLoading: true,
  error: null,
  fetchedAt: 0,
};

let currentStore: InspirationCatalogStore = initialStore;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): InspirationCatalogStore {
  return currentStore;
}

function getServerSnapshot(): InspirationCatalogStore {
  return initialStore;
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

const CACHE_TTL_MS = 5 * 60 * 1000;

let activeFetchPromise: Promise<void> | null = null;

async function fetchCatalog(
  repository: ICapsuleRepository | undefined,
  locale: string,
  forceRefresh = false,
) {
  const isFresh =
    !forceRefresh &&
    currentStore.locale === locale &&
    currentStore.inspirations.length > 0 &&
    Date.now() - currentStore.fetchedAt < CACHE_TTL_MS;

  if (isFresh) {
    return;
  }

  if (activeFetchPromise && !forceRefresh) {
    return activeFetchPromise;
  }

  currentStore = {
    ...currentStore,
    locale,
    isLoading: currentStore.inspirations.length === 0,
    error: null,
  };
  emitChange();

  activeFetchPromise = (async () => {
    try {
      const fetchedInspirations =
        repository && typeof repository.getInspirations === "function"
          ? await repository.getInspirations(locale, { per_page: 100 })
          : [];

      currentStore = {
        locale,
        inspirations: fetchedInspirations,
        isLoading: false,
        error: null,
        fetchedAt: Date.now(),
      };
      emitChange();
    } catch (err) {
      const errorObj =
        err instanceof Error
          ? err
          : new Error("Failed to load inspirations catalog");

      currentStore = {
        locale,
        inspirations: [],
        isLoading: false,
        error: errorObj,
        fetchedAt: Date.now(),
      };
      emitChange();
    } finally {
      activeFetchPromise = null;
    }
  })();

  return activeFetchPromise;
}

export interface UseInspirationCatalogResult {
  inspirations: InspirationItemResponse[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  findInspiration: (
    slug: string | null | undefined,
  ) => InspirationItemResponse | undefined;
  getRandomInspiration: (
    excludeSlug?: string | null,
  ) => InspirationItemResponse | undefined;
}

export function useInspirationCatalog(): UseInspirationCatalogResult {
  const { repository, locale } = useTimeEcho();
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    fetchCatalog(repository, locale);
  }, [repository, locale]);

  const refresh = useCallback(async () => {
    await fetchCatalog(repository, locale, true);
  }, [repository, locale]);

  const findInspiration = useCallback(
    (slug: string | null | undefined): InspirationItemResponse | undefined => {
      if (!slug) return undefined;
      return store.inspirations.find((item) => item.slug === slug);
    },
    [store.inspirations],
  );

  const getRandomInspiration = useCallback(
    (excludeSlug?: string | null): InspirationItemResponse | undefined => {
      if (store.inspirations.length === 0) return undefined;
      const pool =
        excludeSlug && store.inspirations.length > 1
          ? store.inspirations.filter((item) => item.slug !== excludeSlug)
          : store.inspirations;
      const index = Math.floor(Math.random() * pool.length);
      return pool[index];
    },
    [store.inspirations],
  );

  return {
    inspirations: store.inspirations,
    isLoading: store.isLoading && store.inspirations.length === 0,
    error: store.error,
    refresh,
    findInspiration,
    getRandomInspiration,
  };
}
