import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export interface AppShellSkeletonProps {
  children?: React.ReactNode;
}

/**
 * Skeleton placeholder for the AppShell layout (desktop sidebar + mobile top bar + main content).
 * Displays when authentication status is resolving or during route transitions.
 */
export function AppShellSkeleton({ children }: AppShellSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex flex-col md:flex-row min-h-screen w-full bg-parchment text-foreground font-ui"
    >
      {/* Desktop Sidebar Skeleton */}
      <aside className="hidden md:flex w-72 h-screen sticky top-0 bg-manila/50 border-r border-crease p-8 flex-col justify-between shrink-0 font-ui select-none">
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-serif-editorial italic text-foreground tracking-tight font-semibold">
              TimeEcho
            </span>
            <Skeleton className="w-16 h-8 rounded-xs" />
          </div>

          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 px-4 py-3 rounded-lg min-h-[44px]"
              >
                <Skeleton className="w-5 h-5 rounded-xs" />
                <Skeleton className="w-24 h-4 rounded-xs" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-crease pt-4 flex items-center justify-between">
          <Skeleton className="w-36 h-4 rounded-xs" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </aside>

      {/* Mobile Header Skeleton */}
      <header className="md:hidden sticky top-0 z-50 bg-parchment/90 backdrop-blur-md border-b border-crease px-4 py-3 flex items-center justify-between font-ui select-none">
        <span className="text-xl font-serif-editorial italic text-foreground tracking-tight font-semibold">
          TimeEcho
        </span>
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-14 h-7 rounded-xs" />
          <Skeleton className="w-8 h-8 rounded-xs" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main
        id="main-content"
        className="flex-1 min-w-0 px-4 md:px-8 py-8 w-full max-w-6xl mx-auto font-ui"
      >
        {children}
      </main>
    </div>
  );
}
