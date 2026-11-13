"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Panel, PanelHeading } from "@/components/academy/content";
import { COURSES, type Course } from "@/components/academy/course/courses";
import { LEVELS } from "@/components/academy/course/levels";
import { useStoredProgressForCourses } from "@/lib/academy/use-stored-progress";
import { summariseCourse, type CourseSummary } from "@/lib/academy/progress-summary";
import { CourseBreakdown } from "./course-breakdown";

type CourseWithSummary = { course: Course; summary: CourseSummary };

const STORAGE_KEYS = COURSES.map((course) => course.progressStorageKey);

export function ProgressOverview() {
  const progressList = useStoredProgressForCourses(STORAGE_KEYS);
  if (progressList === null) {
    return null;
  }

  const entries: CourseWithSummary[] = [];
  COURSES.forEach((course, index) => {
    entries.push({ course, summary: summariseCourse(course.stages, progressList[index]) });
  });

  const anyStarted = entries.some((entry) => entry.summary.hasStarted);
  if (!anyStarted) {
    return <EmptyState firstCourse={COURSES[0]} />;
  }

  return (
    <>
      <Summary entries={entries} />
      <ContinueLearning entries={entries} />
      {entries.map((entry) => (
        <CourseBreakdown key={entry.course.slug} course={entry.course} summary={entry.summary} />
      ))}
    </>
  );
}

function Summary({ entries }: { entries: CourseWithSummary[] }) {
  let doneCount = 0;
  let stageCount = 0;
  let questionsCorrect = 0;
  let questionsFirstTry = 0;
  let challengesPassed = 0;
  let withoutSolution = 0;
  let hintsUsed = 0;
  for (const { summary } of entries) {
    doneCount += summary.doneCount;
    stageCount += summary.stageCount;
    questionsCorrect += summary.questionsCorrect;
    questionsFirstTry += summary.questionsFirstTry;
    challengesPassed += summary.challengesPassed;
    withoutSolution += summary.challengesPassedWithoutSolution;
    hintsUsed += summary.hintsUsed;
  }

  let firstTryText = "–";
  if (questionsCorrect > 0) {
    firstTryText = Math.round((questionsFirstTry / questionsCorrect) * 100) + "%";
  }

  return (
    <Panel>
      <p className="mb-1 text-[15px] text-muted-foreground">Stages finished</p>
      <p className="m-0 text-[15px]">
        <span className="font-mono text-[40px] leading-none font-bold tracking-[-.03em]">{doneCount}</span>{" "}
        <span className="text-muted-foreground">of {stageCount} across {entries.length} courses</span>
      </p>

      {/* One track for everything, split by course: each part's width is its share of all stages. */}
      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {entries.map(({ course, summary }) => (
          <div key={course.slug} className="min-w-0" style={{ flexGrow: summary.stageCount, flexBasis: 0 }}>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-good"
                style={{ width: `${(summary.doneCount / summary.stageCount) * 100}%` }}
              />
            </div>
            <div className="mt-1.5 truncate text-[12.5px] text-muted-foreground">
              <span className="font-mono min-[641px]:hidden">{course.logo}</span>
              <span className="hidden min-[641px]:inline">{course.title}</span> · {summary.doneCount}/
              {summary.stageCount}
            </div>
          </div>
        ))}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 min-[641px]:grid-cols-4">
        <Stat value={firstTryText} label="quiz answers right first time" />
        <Stat value={String(challengesPassed)} label="code challenges solved" />
        <Stat value={String(withoutSolution)} label="solved without the solution" />
        <Stat value={String(hintsUsed)} label="hints used" />
      </dl>
    </Panel>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-3.5 py-3">
      <dd className="m-0 font-mono text-[24px] font-bold tracking-[-.03em]">{value}</dd>
      <dt className="text-[13px] text-muted-foreground">{label}</dt>
    </div>
  );
}

function ContinueLearning({ entries }: { entries: CourseWithSummary[] }) {
  const inProgress = entries.filter((entry) => entry.summary.hasStarted && entry.summary.nextStage !== null);
  const notStarted = entries.filter((entry) => !entry.summary.hasStarted);

  return (
    <Panel>
      <PanelHeading tag="NEXT">Pick up where you left off</PanelHeading>
      {inProgress.length === 0 && <p>You&apos;ve finished every stage you can open. 🎉</p>}
      <ul className="grid gap-2">
        {inProgress.map(({ course, summary }) => {
          const nextStage = summary.nextStage;
          if (nextStage === null) {
            return null;
          }
          return (
            <li
              key={course.slug}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <span className="grid h-8 w-10 flex-none place-items-center rounded-md bg-code font-mono text-[13px] font-semibold text-highlight">
                {course.logo}
              </span>
              <span className="min-w-0 flex-1 basis-[180px]">
                <span className="block font-semibold">{course.title}</span>
                <span className="block text-[14px] text-muted-foreground">
                  Next: {nextStage.short} · {LEVELS[nextStage.level].name}
                </span>
              </span>
              <Link
                href={`/course/${course.slug}`}
                className={cn(buttonVariants({ variant: "brand" }), "w-full min-[480px]:w-auto")}
              >
                Continue
              </Link>
            </li>
          );
        })}
      </ul>
      {notStarted.length > 0 && (
        <p className="mt-4 mb-0 text-[14px] text-muted-foreground">
          Not started yet:{" "}
          {notStarted.map(({ course }, index) => (
            <span key={course.slug}>
              {index > 0 && ", "}
              <Link href={`/course/${course.slug}`} className="text-ink underline underline-offset-2">
                {course.title}
              </Link>
            </span>
          ))}
        </p>
      )}
    </Panel>
  );
}

function EmptyState({ firstCourse }: { firstCourse: Course }) {
  return (
    <Panel>
      <PanelHeading>Nothing here yet</PanelHeading>
      <p>
        Finish your first quiz question or code challenge and it shows up here.
        New to coding? {firstCourse.title} starts from your very first line.
      </p>
      <Link href={`/course/${firstCourse.slug}`} className={buttonVariants({ variant: "brand" })}>
        Start {firstCourse.title}
      </Link>
    </Panel>
  );
}
