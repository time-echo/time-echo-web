import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export interface AnalyticsSkeletonProps {
  className?: string;
}

/**
 * Skeleton placeholder for the Analytics dashboard view.
 * Mirrors the metrics header, summary stat boxes, and analytical comparison cards.
 */
export function AnalyticsSkeleton({ className }: AnalyticsSkeletonProps) {
  return (
    <div
      aria-label="Loading analytics"
      className={cn(
        "space-y-8 max-w-6xl mx-auto py-4 font-ui animate-fade-in text-foreground",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-crease">
        <div className="space-y-2">
          <Skeleton className="w-44 h-8 rounded-xs" />
          <Skeleton className="w-64 h-4 rounded-xs" />
        </div>
        <Skeleton className="w-32 h-10 rounded-xs" />
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className={cn(
              "paper-sheet border border-crease p-5 rounded-xs text-center shadow-xs space-y-2 flex flex-col items-center",
              idx === 2 && "col-span-2 md:col-span-1",
            )}
          >
            <Skeleton className="w-24 h-3 rounded-xs" />
            <Skeleton className="w-16 h-7 rounded-xs" />
          </div>
        ))}
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Card: Emotional Evolution */}
        <div className="paper-sheet border border-crease p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-crease pb-3.5">
            <Skeleton className="w-5 h-5 rounded-xs" />
            <Skeleton className="w-48 h-6 rounded-xs" />
          </div>
          <Skeleton className="w-3/4 h-3.5 rounded-xs" />

          <div className="space-y-6 pt-2">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="w-28 h-3 rounded-xs" />
                  <Skeleton className="w-16 h-3 rounded-xs" />
                </div>
                <Skeleton className="w-full h-2.5 rounded-xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Prediction Accuracy */}
        <div className="paper-sheet border border-crease p-6 sm:p-8 rounded-xs shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-crease pb-3.5">
            <Skeleton className="w-5 h-5 rounded-xs" />
            <Skeleton className="w-44 h-6 rounded-xs" />
          </div>
          <Skeleton className="w-3/4 h-3.5 rounded-xs" />

          <div className="flex flex-col items-center justify-center py-6 gap-4">
            <Skeleton className="w-24 h-24 rounded-full" />
            <Skeleton className="w-32 h-4 rounded-xs" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-crease">
            <div className="space-y-2 text-center flex flex-col items-center">
              <Skeleton className="w-20 h-3 rounded-xs" />
              <Skeleton className="w-10 h-6 rounded-xs" />
            </div>
            <div className="space-y-2 text-center flex flex-col items-center">
              <Skeleton className="w-20 h-3 rounded-xs" />
              <Skeleton className="w-10 h-6 rounded-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
