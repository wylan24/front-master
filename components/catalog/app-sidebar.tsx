"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { ChartNoAxesColumn, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { isStageCompleteFor } from "@/lib/academy/progress";
import { useStoredProgress } from "@/lib/academy/use-stored-progress";

/** Plain data about a course, built on the server so the sidebar stays light. */
export type SidebarCourse = {
  slug: string;
  title: string;
  logo: string;
  storageKey: string;
  stages: { id: string; quizQuestionCount: number }[];
};

type NavLink = {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Courses", Icon: LayoutGrid },
  { href: "/progress", label: "My progress", Icon: ChartNoAxesColumn },
];

/**
 * App navigation for the catalogue pages. A full sidebar on wide screens; on
 * phones it becomes a compact top bar (the course list is left out there,
 * because the course cards on the homepage already show it).
 */
export function AppSidebar({ courses }: { courses: SidebarCourse[] }) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-border bg-card px-4 py-3 min-[821px]:sticky min-[821px]:top-0 min-[821px]:flex min-[821px]:h-screen min-[821px]:flex-col min-[821px]:overflow-auto min-[821px]:border-r min-[821px]:border-b-0 min-[821px]:py-[22px]">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md text-[20px] font-bold tracking-[-.02em] outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <span className="rounded-lg bg-code px-[7px] py-0.5 font-mono text-[15px] text-highlight">
            {"</>"}
          </span>
          Academy
        </Link>
        <ThemeToggle className="min-[821px]:hidden" />
      </div>

      <nav aria-label="Main" className="mt-3 flex gap-1 min-[821px]:mt-6 min-[821px]:flex-col">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 items-center justify-center gap-2.5 rounded-[10px] px-[10px] py-[9px] text-[14.5px] outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/40 min-[821px]:flex-none min-[821px]:justify-start",
                isActive && "bg-ink text-paper hover:bg-ink"
              )}
            >
              <link.Icon aria-hidden className="size-[18px]" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 hidden min-[821px]:block">
        <h2 className="mx-[10px] mb-2 text-[11.5px] font-bold tracking-[.1em] text-muted-foreground uppercase">
          Your courses
        </h2>
        <ul className="grid gap-0.5">
          {courses.map((course) => (
            <li key={course.slug}>
              <SidebarCourseLink course={course} isActive={pathname === `/course/${course.slug}`} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto hidden items-center justify-between gap-3 border-t border-border pt-4 min-[821px]:flex">
        <span className="text-[13px] text-muted-foreground">Appearance</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}

function SidebarCourseLink({ course, isActive }: { course: SidebarCourse; isActive: boolean }) {
  const progress = useStoredProgress(course.storageKey);

  let doneCount = 0;
  if (progress !== null) {
    for (const stage of course.stages) {
      if (isStageCompleteFor(progress, stage.id, stage.quizQuestionCount)) {
        doneCount++;
      }
    }
  }
  const stageCount = course.stages.length;
  const percentDone = (doneCount / stageCount) * 100;

  return (
    <Link
      href={`/course/${course.slug}`}
      aria-current={isActive ? "page" : undefined}
      className="flex items-center gap-3 rounded-[10px] px-[10px] py-2 outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/40"
    >
      <span className="grid h-7 w-9 flex-none place-items-center rounded-md bg-code font-mono text-[12.5px] font-semibold text-highlight">
        {course.logo}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px]">{course.title}</span>
        <span className="mt-1 flex items-center gap-2">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-line">
            <span className="block h-full rounded-full bg-good" style={{ width: `${percentDone}%` }} />
          </span>
          {/* Kept invisible until saved progress is read, so no wrong number flashes up. */}
          <span className={cn("font-mono text-[11.5px] text-muted-foreground", progress === null && "invisible")}>
            {doneCount}/{stageCount}
          </span>
        </span>
      </span>
    </Link>
  );
}
