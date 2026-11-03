import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export interface LetterDetailSkeletonProps {
  className?: string;
}

/**
 * Skeleton placeholder for the Letter Detail & Reality comparison views.
 * Mirrors the archival document docket, wax seal, and letter content layout.
 */
export function LetterDetailSkeleton({ className }: LetterDetailSkeletonProps) {
  return (
    <div
      aria-label="Loading letter"
      className={cn(
        "max-w-7xl mx-auto py-4 font-ui animate-fade-in text-foreground space-y-6",
        className,
      )}
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-crease">
        <Skeleton className="w-32 h-9 rounded-xs" />
        <Skeleton className="w-24 h-9 rounded-xs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Docket Seal & Info Card */}
        <div className="lg:col-span-4 paper-sheet rounded-xs p-6 sm:p-8 text-center space-y-6 border border-crease">
          <div className="space-y-2 flex flex-col items-center">
            <Skeleton className="w-28 h-5 rounded-xs" />
            <Skeleton className="w-48 h-7 rounded-xs" />
            <Skeleton className="w-64 h-3.5 rounded-xs" />
          </div>

          {/* Seal / Stamp illustration placeholder */}
          <div className="my-6 flex items-center justify-center gap-6 h-32">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="w-20 h-24 rounded-xs" />
          </div>

          <div className="archival-folder rounded-xs p-4 border border-manila-border space-y-2 text-left">
            <Skeleton className="w-28 h-3 rounded-xs" />
            <Skeleton className="w-full h-3 rounded-xs" />
            <Skeleton className="w-5/6 h-3 rounded-xs" />
          </div>
        </div>

        {/* Right Column: Letter Content & Predictions */}
        <div className="lg:col-span-8 paper-sheet rounded-xs p-6 sm:p-8 space-y-6 border border-crease">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-crease pb-4">
            <div className="space-y-2">
              <Skeleton className="w-32 h-4 rounded-xs" />
              <Skeleton className="w-64 h-8 rounded-xs" />
            </div>
            <Skeleton className="w-40 h-4 rounded-xs" />
          </div>

          {/* Letter Body Lines */}
          <div className="space-y-3 py-4 border-l-2 border-crease pl-4">
            <Skeleton className="w-full h-4 rounded-xs" />
            <Skeleton className="w-11/12 h-4 rounded-xs" />
            <Skeleton className="w-4/5 h-4 rounded-xs" />
            <Skeleton className="w-full h-4 rounded-xs" />
            <Skeleton className="w-3/4 h-4 rounded-xs" />
          </div>

          {/* Emotional baseline sliders placeholder */}
          <div className="pt-4 border-t border-crease space-y-4">
            <Skeleton className="w-40 h-5 rounded-xs" />
            <div className="space-y-3">
              <Skeleton className="w-full h-3 rounded-xs" />
              <Skeleton className="w-full h-3 rounded-xs" />
            </div>
          </div>

          {/* Action buttons placeholder */}
          <div className="pt-4 border-t border-crease flex items-center justify-between">
            <Skeleton className="w-28 h-10 rounded-xs" />
            <Skeleton className="w-36 h-10 rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
