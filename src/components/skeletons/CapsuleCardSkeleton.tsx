import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export interface CapsuleCardSkeletonProps {
  className?: string;
}

/**
 * Skeleton placeholder for a single capsule card (grid or list view).
 * Mirrors the structure of CapsuleCard with archival styling.
 */
export function CapsuleCardSkeleton({ className }: CapsuleCardSkeletonProps) {
  return (
    <article
      aria-hidden="true"
      className={cn(
        "paper-sheet rounded-xs border border-crease p-6 sm:p-7 shadow-xs flex flex-col justify-between overflow-hidden gap-5",
        className,
      )}
    >
      <div className="space-y-4">
        {/* Top Header: Docket tag + Stamp placeholder */}
        <div className="flex items-center justify-between gap-3 border-b border-crease/70 pb-3">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-2.5 h-2.5 rounded-full" />
            <Skeleton className="w-24 h-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-6 rounded-xs" />
            <Skeleton className="w-7 h-4 rounded-xs" />
          </div>
        </div>

        {/* Status badge pill */}
        <div className="pt-1">
          <Skeleton className="w-32 h-6 rounded-full" />
        </div>

        {/* Title and date */}
        <div className="space-y-2 pt-1">
          <Skeleton className="w-3/4 h-6 rounded-xs" />
          <Skeleton className="w-1/2 h-3.5 rounded-xs" />
        </div>

        {/* Preview content folder */}
        <div className="archival-folder rounded-xs p-4 border border-manila-border space-y-2">
          <Skeleton className="w-full h-3 rounded-xs" />
          <Skeleton className="w-4/5 h-3 rounded-xs" />
        </div>
      </div>

      {/* Action buttons row */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-crease/60">
        <Skeleton className="w-24 h-9 rounded-xs" />
        <Skeleton className="w-32 h-9 rounded-xs" />
      </div>
    </article>
  );
}
