import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AcademyLoader } from "@/components/academy/academy-loader";
import { COURSES, findCourseBySlug } from "@/components/academy/course/courses";

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

export default function CoursePage(props: PageProps<"/course/[slug]">) {
  // Reading the slug is URL data, so it sits inside Suspense: that lets a
  // click on a course card show the new page straight away instead of waiting.
  // The course itself renders in the browser, so there's no server UI to show
  // in the meantime.
  return (
    <Suspense fallback={null}>
      <CourseForSlug params={props.params} />
    </Suspense>
  );
}

async function CourseForSlug({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = findCourseBySlug(slug);

  if (course === undefined) {
    notFound();
  }

  return <AcademyLoader courseSlug={course.slug} />;
}
