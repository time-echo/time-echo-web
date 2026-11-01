import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export interface TimelineSkeletonProps {
  className?: string;
  itemCount?: number;
}

/**
 * Skeleton placeholder for the Timeline view (/dashboard?timeline=true).
 * Mirrors the vertical timeline track with nodes, timeline cards, and no stat summary boxes.
 */
export function TimelineSkeleton({
  className,
  itemCount = 3,
}: TimelineSkeletonProps) {
  return (
    <div
      aria-label="Loading timeline"
      className={cn(
        "space-y-8 max-w-4xl mx-auto py-4 font-ui animate-fade-in text-foreground",
        className,
      )}
    >
      {/* Timeline Header */}
      <div className="border-b border-crease pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="w-48 h-8 rounded-xs" />
          <Skeleton className="w-72 h-4 rounded-xs" />
        </div>
        <div className="flex gap-3 shrink-0 items-center">
          <Skeleton className="w-36 h-11 rounded-xs" />
          <Skeleton className="w-36 h-11 rounded-xs" />
        </div>
      </div>

      {/* Vertical Timeline Track */}
      <div className="relative border-l-2 border-crease pl-6 sm:pl-8 ml-3 sm:ml-5 space-y-8 select-none">
        {Array.from({ length: itemCount }).map((_, idx) => (
          <div key={idx} className="relative">
            {/* Timeline Node Circle */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full border-2 border-parchment shadow-xs bg-crease/60 dark:bg-crease/40 animate-pulse" />

            {/* Timeline Card */}
            <div className="paper-sheet rounded-xs p-5 sm:p-7 space-y-4 border border-crease">
              {/* Card Header: Docket tag, status stamp, date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crease pb-3">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="w-24 h-4 rounded-xs" />
                  <Skeleton className="w-28 h-5 rounded-xs" />
                </div>
                <Skeleton className="w-36 h-3.5 rounded-xs" />
              </div>

              {/* Title & Delivery Date */}
              <div className="space-y-2">
                <Skeleton className="w-3/5 h-6 rounded-xs" />
                <Skeleton className="w-2/5 h-3.5 rounded-xs" />
              </div>

              {/* Card Body: Archival folder preview */}
              <div className="archival-folder rounded-xs p-4 border border-manila-border space-y-2">
                <div className="space-y-1">
                  <Skeleton className="w-32 h-3.5 rounded-xs" />
                  <Skeleton className="w-48 h-3 rounded-xs" />
                </div>
                <div className="pt-2 flex items-center justify-between gap-2">
                  <Skeleton className="w-28 h-8 rounded-xs" />
                  <Skeleton className="w-20 h-8 rounded-xs" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
