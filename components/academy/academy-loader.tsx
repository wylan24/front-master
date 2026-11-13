"use client";

import dynamic from "next/dynamic";

// The course resumes from progress saved in localStorage, which only exists in
// the browser. Rendering it client-side avoids a server/client mismatch when
// the saved stage differs from the default.
const AcademyApp = dynamic(
  () => import("./academy-app").then((academyModule) => academyModule.AcademyApp),
  { ssr: false }
);

export function AcademyLoader() {
  return <AcademyApp />;
}
