import type { Metadata } from "next";
import { PageHeader } from "@/components/academy/page-header";
import { ProgressLoader } from "@/components/progress/progress-loader";

export const metadata: Metadata = {
  title: "My progress",
  description: "Your progress across every course: stages finished, quiz accuracy and what to do next.",
};

export default function ProgressPage() {
  return (
    <main className="max-w-[980px] px-[clamp(18px,4vw,56px)] pt-[clamp(32px,7vh,72px)] pb-20">
      <PageHeader
        eyebrow="My progress"
        title="How you're getting on"
        lead="Every stage you've finished, across all the courses, and where to pick up next. Progress is saved in this browser."
      />
      <ProgressLoader />
    </main>
  );
}
