import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/academy/content";
import { getLevelCopy, type Course } from "@/components/academy/course/courses";
import { LEVELS } from "@/components/academy/course/levels";
import { getGrade } from "@/lib/academy/scoring";
import type { CourseSummary, LevelSummary } from "@/lib/academy/progress-summary";

/** One course: a row per section with its progress, average score and grade. */
export function CourseBreakdown({ course, summary }: { course: Course; summary: CourseSummary }) {
  return (
    <Panel>
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="grid h-8 w-10 flex-none place-items-center rounded-md bg-code font-mono text-[13px] font-semibold text-highlight">
          {course.logo}
        </span>
        <h2 className="m-0 min-w-0 flex-1 text-[21px] font-bold tracking-[-.02em]">{course.title}</h2>
        <div className="flex w-full items-center justify-between gap-3 min-[641px]:w-auto min-[641px]:justify-start">
          <span className="text-[14px] text-muted-foreground">
            {summary.doneCount} of {summary.stageCount} stages
          </span>
          <Link
            href={`/course/${course.slug}`}
            className="text-[14px] font-semibold underline underline-offset-2 hover:text-brand"
          >
            Open course
          </Link>
        </div>
      </div>
      <div>
        {summary.levels.map((levelSummary) => (
          <LevelRow key={levelSummary.level} course={course} levelSummary={levelSummary} />
        ))}
      </div>
    </Panel>
  );
}

function describeStatus(levelSummary: LevelSummary): string {
  if (!levelSummary.isUnlocked) {
    return "🔒 Locked";
  }
  if (levelSummary.doneCount === levelSummary.stageCount) {
    return "✓ Complete";
  }
  if (levelSummary.doneCount === 0) {
    return "Not started";
  }
  return "In progress";
}

function LevelRow({ course, levelSummary }: { course: Course; levelSummary: LevelSummary }) {
  const { doneCount, stageCount, averageScore } = levelSummary;
  const percentDone = (doneCount / stageCount) * 100;
  const isComplete = doneCount === stageCount;

  // A grade only makes sense once the section's final is passed, like the results page.
  let gradeText: string | null = null;
  let gradeVariant: "good" | "info" = "info";
  if (levelSummary.isResultsUnlocked && averageScore !== null) {
    const grade = getGrade(averageScore, getLevelCopy(course, levelSummary.level).topGrade);
    gradeText = `${grade.emoji} ${grade.title}`;
    if (averageScore >= 75) {
      gradeVariant = "good";
    }
  }

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-t border-border py-3 first:border-t-0 min-[641px]:grid-cols-[150px_1fr_auto]">
      <div className="col-start-1 row-start-1">
        <div className="text-[14.5px] font-semibold">{LEVELS[levelSummary.level].name}</div>
        <div className={isComplete ? "text-[12.5px] font-medium text-difficulty-easy-ink" : "text-[12.5px] text-muted-foreground"}>
          {describeStatus(levelSummary)}
        </div>
      </div>

      <div className="col-span-2 col-start-1 row-start-2 flex items-center gap-3 min-[641px]:col-span-1 min-[641px]:col-start-2 min-[641px]:row-start-1">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full rounded-full bg-good" style={{ width: `${percentDone}%` }} />
        </div>
        <span className="font-mono text-[13px] text-muted-foreground">
          {doneCount}/{stageCount}
        </span>
      </div>

      <div className="col-start-2 row-start-1 text-right min-[641px]:col-start-3">
        {gradeText !== null && <Badge variant={gradeVariant}>{gradeText}</Badge>}
        {gradeText === null && averageScore !== null && (
          <span className="text-[13px] text-muted-foreground">
            avg score <b className="font-mono text-ink">{averageScore}</b>
          </span>
        )}
      </div>
    </div>
  );
}
