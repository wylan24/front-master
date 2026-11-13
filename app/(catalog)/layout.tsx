import { COURSES } from "@/components/academy/course/courses";
import { AppSidebar, type SidebarCourse } from "@/components/catalog/app-sidebar";

/** Only plain data crosses to the client sidebar, never the lesson content itself. */
function buildSidebarCourses(): SidebarCourse[] {
  const sidebarCourses: SidebarCourse[] = [];
  for (const course of COURSES) {
    const stages: SidebarCourse["stages"] = [];
    for (const stage of course.stages) {
      stages.push({ id: stage.id, quizQuestionCount: stage.quiz.length });
    }
    sidebarCourses.push({
      slug: course.slug,
      title: course.title,
      logo: course.logo,
      storageKey: course.progressStorageKey,
      stages,
    });
  }
  return sidebarCourses;
}

/** The catalogue pages (courses and progress) share the app sidebar. */
export default function CatalogLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen grid-cols-1 min-[821px]:grid-cols-[256px_1fr]">
      <AppSidebar courses={buildSidebarCourses()} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
