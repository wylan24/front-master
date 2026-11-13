import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcademyLoader } from "@/components/academy/academy-loader";
import { COURSES, findCourseBySlug } from "@/components/academy/course/courses";

// A static site can only contain pages built ahead of time, so only the slugs
// from generateStaticParams exist. Any other address gets the site's 404 page.
export const dynamicParams = false;

/** Prerender every known course at build time. */
export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const course of COURSES) {
    params.push({ slug: course.slug });
  }
  return params;
}

export async function generateMetadata(
  props: PageProps<"/course/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const course = findCourseBySlug(slug);

  if (course === undefined) {
    return { title: "Course not found" };
  }

  return {
    title: `${course.title}: ${course.tagline}`,
    description: course.description,
  };
}

export default async function CoursePage(props: PageProps<"/course/[slug]">) {
  const { slug } = await props.params;
  const course = findCourseBySlug(slug);

  if (course === undefined) {
    notFound();
  }

  return <AcademyLoader courseSlug={course.slug} />;
}
