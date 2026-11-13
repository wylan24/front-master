"use client";

import dynamic from "next/dynamic";

// The overview needs the full course content (to score each stage) and saved
// progress from localStorage, so it only renders in the browser. Loading it
// separately keeps the lesson content out of this page's first download.
const ProgressOverview = dynamic(
  () => import("./progress-overview").then((overviewModule) => overviewModule.ProgressOverview),
  { ssr: false, loading: () => <ProgressSkeleton /> }
);

export function ProgressLoader() {
  return <ProgressOverview />;
}

function ProgressSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading your progress" className="mt-6 grid gap-4">
      <div className="h-[132px] animate-pulse rounded-2xl bg-line/50" />
      <div className="h-[96px] animate-pulse rounded-2xl bg-line/50" />
      <div className="h-[220px] animate-pulse rounded-2xl bg-line/50" />
    </div>
  );
}
