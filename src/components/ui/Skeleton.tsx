import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Additional custom class names.
   */
  className?: string;
}

/**
 * Archival-themed Skeleton loader primitive.
 * Uses TimeEcho's tactile crease tones and soft pulsing animation.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn(
        "animate-pulse rounded-xs bg-crease/50 dark:bg-crease/30",
        className,
      )}
      {...props}
    />
  );
}
