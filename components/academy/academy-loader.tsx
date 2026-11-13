"use client";

import dynamic from "next/dynamic";

// The course resumes from progress saved in localStorage, which only exists in
// the browser. Rendering it client-side avoids a server/client mismatch when
// the saved stage differs from the default.
const AcademyApp = dynamic(
  () => import("./academy-app").then((academyModule) => academyModule.AcademyApp),
  { ssr: false }
);

type AcademyLoaderProps = {
  courseSlug: string;
};

export function AcademyLoader({ courseSlug }: AcademyLoaderProps) {
  // Keyed by course so moving between courses starts with that course's own
  // saved progress instead of keeping the previous course's state.
  return <AcademyApp key={courseSlug} courseSlug={courseSlug} />;
}
