import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/academy/page-header";

export default function CourseNotFound() {
  return (
    <main className="mx-auto max-w-[980px] px-[clamp(18px,4vw,56px)] pt-[clamp(40px,10vh,96px)] pb-20">
      {/* Only the root not-found file can export metadata, so React places this title in <head>. */}
      <title>Course not found</title>
      <PageHeader
        eyebrow="404"
        title="Course not found"
        lead="There's no course at this address. Check the link, or pick a course from the full list."
      />
      <Link href="/" className={buttonVariants({ variant: "brand" })}>
        See all courses
      </Link>
    </main>
  );
}
