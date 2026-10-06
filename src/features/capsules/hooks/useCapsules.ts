"use client";

import { useState, useMemo, useCallback } from "react";
import { useTimeEcho } from "@/lib/context/TimeEchoContext";
import { Letter, LetterStatus } from "@/types/timeecho";

export type CapsuleFilterStatus = "all" | LetterStatus;

export function useCapsules() {
  const {
    capsules,
    isLoading,
    error,
    refreshCapsules,
    getCapsuleById,
    archiveCapsule,
    restoreCapsule,
    deleteCapsule,
    breakWaxSeal,
  } = useTimeEcho();

  const [filter, setFilter] = useState<CapsuleFilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const inTransitCapsules = useMemo(
    () => capsules.filter((c) => c.status === "pending"),
    [capsules],
  );

  const deliveredCapsules = useMemo(
    () => capsules.filter((c) => c.status === "delivered"),
    [capsules],
  );

  const openedCapsules = useMemo(
    () => capsules.filter((c) => c.status === "opened"),
    [capsules],
  );

  const archivedCapsules = useMemo(
    () => capsules.filter((c) => c.status === "archived"),
    [capsules],
  );

  const filteredCapsules = useMemo(() => {
    let result = capsules;

    if (filter !== "all") {
      result = result.filter((c) => c.status === filter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.docketNumber.toLowerCase().includes(q) ||
          c.predictions.some((p) => p.prediction.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [capsules, filter, searchQuery]);

  const counts = useMemo(
    () => ({
      total: capsules.length,
      inTransit: inTransitCapsules.length,
      delivered: deliveredCapsules.length,
      opened: openedCapsules.length,
      archived: archivedCapsules.length,
    }),
    [
      capsules.length,
      inTransitCapsules.length,
      deliveredCapsules.length,
      openedCapsules.length,
      archivedCapsules.length,
    ],
  );

  const handleArchive = useCallback(
    async (id: string): Promise<Letter> => {
      return archiveCapsule(id);
    },
    [archiveCapsule],
  );

  const handleRestore = useCallback(
    async (id: string): Promise<Letter> => {
      return restoreCapsule(id);
    },
    [restoreCapsule],
  );

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      return deleteCapsule(id);
    },
    [deleteCapsule],
  );

  return {
    capsules,
    filteredCapsules,
    inTransitCapsules,
    deliveredCapsules,
    openedCapsules,
    archivedCapsules,
    counts,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    refreshCapsules,
    getCapsuleById,
    archiveCapsule: handleArchive,
    restoreCapsule: handleRestore,
    deleteCapsule: handleDelete,
    breakWaxSeal,
  };
}
