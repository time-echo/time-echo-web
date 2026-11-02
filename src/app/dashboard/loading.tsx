"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardSkeleton, TimelineSkeleton } from "@/components/skeletons";

function DashboardLoadingContent() {
  const searchParams = useSearchParams();
  const isTimeline = searchParams?.get("timeline") === "true";

  return isTimeline ? <TimelineSkeleton /> : <DashboardSkeleton />;
}

export default function DashboardLoading() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardLoadingContent />
    </Suspense>
  );
}
