import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export interface ComposerSkeletonProps {
  className?: string;
}

/**
 * Skeleton placeholder for the Letter Composer view (/letters/new).
 * Mirrors the lined paper sheet, metadata sidebar, and seal button.
 */
export function ComposerSkeleton({ className }: ComposerSkeletonProps) {
  return (
    <div
      aria-label="Loading composer"
      className={cn(
        "max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground space-y-6",
        className,
      )}
    >
      {/* Top Header / Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-crease">
        <Skeleton className="w-32 h-9 rounded-xs" />
        <Skeleton className="w-24 h-9 rounded-xs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Letter Paper */}
        <div className="lg:col-span-8 paper-sheet rounded-xs p-6 sm:p-10 space-y-6 border border-crease">
          {/* Header line: Title input placeholder */}
          <div className="space-y-2 border-b border-crease/60 pb-4">
            <Skeleton className="w-24 h-3 rounded-xs" />
            <Skeleton className="w-3/4 h-8 rounded-xs" />
          </div>

          {/* Lined body area */}
          <div className="space-y-4 py-4 min-h-[320px]">
            <Skeleton className="w-full h-4 rounded-xs" />
            <Skeleton className="w-11/12 h-4 rounded-xs" />
            <Skeleton className="w-full h-4 rounded-xs" />
            <Skeleton className="w-4/5 h-4 rounded-xs" />
            <Skeleton className="w-10/12 h-4 rounded-xs" />
            <Skeleton className="w-3/4 h-4 rounded-xs" />
          </div>

          {/* Footer toolbar: Stamp selection */}
          <div className="pt-4 border-t border-crease flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-14 rounded-xs" />
              <Skeleton className="w-28 h-4 rounded-xs" />
            </div>
            <Skeleton className="w-20 h-4 rounded-xs" />
          </div>
        </div>

        {/* Right Column: Parameters & Sealing Action */}
        <div className="lg:col-span-4 space-y-6">
          {/* Delivery Date Card */}
          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-4">
            <div className="space-y-1">
              <Skeleton className="w-32 h-5 rounded-xs" />
              <Skeleton className="w-48 h-3 rounded-xs" />
            </div>
            <Skeleton className="w-full h-11 rounded-xs" />
          </div>

          {/* Emotional baseline sliders card */}
          <div className="paper-sheet rounded-xs p-6 border border-crease space-y-4">
            <div className="space-y-1">
              <Skeleton className="w-36 h-5 rounded-xs" />
              <Skeleton className="w-40 h-3 rounded-xs" />
            </div>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Skeleton className="w-24 h-3 rounded-xs" />
                <Skeleton className="w-full h-3 rounded-xs" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-24 h-3 rounded-xs" />
                <Skeleton className="w-full h-3 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Seal button placeholder */}
          <Skeleton className="w-full h-14 rounded-xs" />
        </div>
      </div>
    </div>
  );
}
