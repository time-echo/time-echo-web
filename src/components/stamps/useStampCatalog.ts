"use client";

import { useEffect, useCallback, useSyncExternalStore } from "react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { ICapsuleRepository } from "@/lib/repositories/ICapsuleRepository";
import {
  StampItemResponse,
  StampCategoryResponse,
  StampDetailResponse,
} from "@/types/timeecho";
import { STAMP_CATEGORIES } from "./stamps.data";

interface CatalogStore {
  locale: string;
  stamps: StampItemResponse[];
  categories: StampCategoryResponse[];
  isLoading: boolean;
  error: Error | null;
  fetchedAt: number;
}

const initialStore: CatalogStore = {
  locale: "",
  stamps: [],
  categories: [],
  isLoading: true,
  error: null,
  fetchedAt: 0,
};

let currentStore: CatalogStore = initialStore;
const listeners = new Set<() => void>();
const globalDetailCache = new Map<string, StampDetailResponse>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CatalogStore {
  return currentStore;
}

function getServerSnapshot(): CatalogStore {
  return initialStore;
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getFallbackCategories(): StampCategoryResponse[] {
  return STAMP_CATEGORIES.map((cat, index) => ({
    slug: cat.id,
    name: cat.label,
    position: index + 1,
  }));
}

let activeFetchPromise: Promise<void> | null = null;

async function fetchCatalog(
  repository: ICapsuleRepository | undefined,
  locale: string,
  forceRefresh = false,
) {
  const isFresh =
    !forceRefresh &&
    currentStore.locale === locale &&
    currentStore.stamps.length > 0 &&
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
    isLoading: currentStore.stamps.length === 0,
    error: null,
  };
  emitChange();

  activeFetchPromise = (async () => {
    try {
      let fetchedCategories: StampCategoryResponse[] = [];
      let fetchedStamps: StampItemResponse[] = [];

      if (repository && typeof repository.getStampCategories === "function") {
        fetchedCategories = await repository.getStampCategories(locale);
      }

      if (repository && typeof repository.getStamps === "function") {
        fetchedStamps = await repository.getStamps(locale);
      }

      if (fetchedCategories.length === 0) {
        fetchedCategories = getFallbackCategories();
      }

      currentStore = {
        locale,
        stamps: fetchedStamps,
        categories: fetchedCategories,
        isLoading: false,
        error: null,
        fetchedAt: Date.now(),
      };
      emitChange();
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Failed to load stamps catalog");

      currentStore = {
        locale,
        stamps: [],
        categories: getFallbackCategories(),
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

export interface UseStampCatalogResult {
  stamps: StampItemResponse[];
  categories: StampCategoryResponse[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  getStampBySlug: (slug: string) => Promise<StampDetailResponse | null>;
  findStamp: (slugOrId: string) => StampItemResponse | undefined;
  fetchFilteredStamps: (
    filters: import("@/types/timeecho").StampFilters,
  ) => Promise<StampItemResponse[]>;
}

/**
 * Hook to retrieve and cache the dynamic stamps catalog and categories
 * with HTTP ETag support and offline/mock fallbacks.
 */
export function useStampCatalog(): UseStampCatalogResult {
  const { repository, locale } = useTimeEcho();
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    fetchCatalog(repository, locale);
  }, [repository, locale]);

  const refresh = useCallback(async () => {
    await fetchCatalog(repository, locale, true);
  }, [repository, locale]);

  const findStamp = useCallback(
    (slugOrId: string): StampItemResponse | undefined => {
      return store.stamps.find((s) => s.slug === slugOrId);
    },
    [store.stamps],
  );

  const getStampBySlug = useCallback(
    async (slug: string): Promise<StampDetailResponse | null> => {
      if (!slug) return null;

      const cacheKey = `${locale}:${slug}`;
      if (globalDetailCache.has(cacheKey)) {
        return globalDetailCache.get(cacheKey)!;
      }

      // Check active catalog first
      const catalogMatch = store.stamps.find((s) => s.slug === slug);
      if (
        catalogMatch &&
        (catalogMatch.svg_content || catalogMatch.svgContent)
      ) {
        const detail: StampDetailResponse = {
          slug: catalogMatch.slug,
          name: catalogMatch.name,
          category_slug: catalogMatch.category_slug,
          categorySlug: catalogMatch.categorySlug || catalogMatch.category_slug,
          svg_content:
            catalogMatch.svg_content || catalogMatch.svgContent || "",
          svgContent: catalogMatch.svgContent || catalogMatch.svg_content || "",
          position: catalogMatch.position,
          active: catalogMatch.active ?? true,
        };
        globalDetailCache.set(cacheKey, detail);
        return detail;
      }

      // Fetch from API (handles historical/inactive stamps)
      if (repository && typeof repository.getStampBySlug === "function") {
        try {
          const detail = await repository.getStampBySlug(slug, locale);
          if (detail) {
            globalDetailCache.set(cacheKey, detail);
            return detail;
          }
        } catch {
          // Ignore and return null
        }
      }

      return null;
    },
    [locale, store.stamps, repository],
  );

  const fetchFilteredStamps = useCallback(
    async (
      filters: import("@/types/timeecho").StampFilters,
    ): Promise<StampItemResponse[]> => {
      if (repository && typeof repository.getStamps === "function") {
        return repository.getStamps(locale, filters);
      }
      return [];
    },
    [repository, locale],
  );

  return {
    stamps: store.stamps,
    categories:
      store.categories.length > 0 ? store.categories : getFallbackCategories(),
    isLoading: store.isLoading && store.stamps.length === 0,
    error: store.error,
    refresh,
    getStampBySlug,
    findStamp,
    fetchFilteredStamps,
  };
}
