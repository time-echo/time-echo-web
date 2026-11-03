import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { CapsuleCardSkeleton } from "./CapsuleCardSkeleton";
import { cn } from "@/lib/utils";

export interface DashboardSkeletonProps {
  className?: string;
  cardCount?: number;
}

/**
 * Skeleton placeholder for the Dashboard view.
 * Matches the layout of header, 3 stat overview cards, and active letter list.
 */
export function DashboardSkeleton({
  className,
  cardCount = 3,
}: DashboardSkeletonProps) {
  return (
    <div
      aria-label="Loading dashboard"
      className={cn(
        "space-y-8 max-w-6xl mx-auto py-4 font-ui animate-fade-in text-foreground",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-crease pb-6">
        <div className="space-y-2">
          <Skeleton className="w-48 h-8 rounded-xs" />
          <Skeleton className="w-72 h-4 rounded-xs" />
        </div>
        <div className="flex gap-3 shrink-0 items-center">
          <Skeleton className="w-36 h-11 rounded-xs" />
          <Skeleton className="w-36 h-11 rounded-xs" />
        </div>
      </div>

      {/* 3 Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className="paper-sheet rounded-xs p-5 space-y-2.5 border border-crease"
          >
            <Skeleton className="w-28 h-3 rounded-xs" />
            <Skeleton className="w-16 h-8 rounded-xs" />
            <Skeleton className="w-36 h-3 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Letters List / Cards */}
      <div className="space-y-5">
        {Array.from({ length: cardCount }).map((_, idx) => (
          <CapsuleCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
