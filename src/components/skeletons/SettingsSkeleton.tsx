import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export interface SettingsSkeletonProps {
  className?: string;
}

/**
 * Skeleton placeholder for the Settings view.
 * Mirrors account management cards, input fields, and action buttons.
 */
export function SettingsSkeleton({ className }: SettingsSkeletonProps) {
  return (
    <div
      aria-label="Loading settings"
      className={cn(
        "max-w-2xl mx-auto space-y-8 font-ui pb-16 animate-fade-in text-foreground",
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-crease pb-6">
        <div className="space-y-2">
          <Skeleton className="w-40 h-8 rounded-xs" />
          <Skeleton className="w-64 h-4 rounded-xs" />
        </div>
        <Skeleton className="w-32 h-9 rounded-xs" />
      </div>

      {/* Account Info Card */}
      <div className="paper-sheet rounded-xs border border-crease p-6 sm:p-8 space-y-6">
        <div className="space-y-2 border-b border-crease pb-4">
          <Skeleton className="w-36 h-6 rounded-xs" />
          <Skeleton className="w-3/4 h-3.5 rounded-xs" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="w-24 h-3.5 rounded-xs" />
            <Skeleton className="w-full h-11 rounded-xs" />
          </div>
          <Skeleton className="w-32 h-10 rounded-xs" />
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="paper-sheet rounded-xs border border-crease/80 p-6 sm:p-8 space-y-6">
        <div className="space-y-2 border-b border-crease pb-4">
          <Skeleton className="w-32 h-6 rounded-xs" />
          <Skeleton className="w-4/5 h-3.5 rounded-xs" />
        </div>

        <Skeleton className="w-40 h-10 rounded-xs" />
      </div>
    </div>
  );
}
