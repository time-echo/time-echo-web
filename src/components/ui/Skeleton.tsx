import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

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
