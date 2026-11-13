import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/academy/page-header";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * The site-wide 404. In the static export this becomes 404.html, which GitHub
 * Pages serves for any address that doesn't exist, including mistyped course
 * links.
 */
export default function NotFound() {
  return (
    <main className="mx-auto max-w-[980px] px-[clamp(18px,4vw,56px)] pt-[clamp(40px,10vh,96px)] pb-20">
      <PageHeader
        eyebrow="404"
        title="Page not found"
        lead="There's nothing at this address. Check the link, or pick a course from the full list."
      />
      <Link href="/" className={buttonVariants({ variant: "brand" })}>
        See all courses
      </Link>
    </main>
  );
}
