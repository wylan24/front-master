import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { LEVELS } from "@/components/academy/course/levels";
import type { Course, CourseDifficulty } from "@/components/academy/course/courses";
import { getCourseLevels, getStagesForLevel } from "@/lib/academy/progress";
import {
  CourseProgress,
  type Difficulty,
  type SyllabusLevel,
  type SyllabusStage,
} from "./course-progress";
import type { Level } from "@/lib/academy/types";

const DIFFICULTY_BADGE_VARIANT: Record<CourseDifficulty, "good" | "info" | "brand"> = {
  Beginner: "good",
  Intermediate: "info",
  Advanced: "brand",
  "Beginner to Advanced": "info",
};

const LEVEL_DIFFICULTY: Record<Level, Difficulty> = {
  basic: 1,
  mid: 2,
  adv: 3,
};

/**
 * Only plain data crosses to the client progress component, so the homepage
 * never ships the lessons, quizzes and widgets themselves.
 */
function buildSyllabus(course: Course): SyllabusLevel[] {
  const syllabus: SyllabusLevel[] = [];

  for (const level of getCourseLevels(course.stages)) {
    const levelStages = getStagesForLevel(course.stages, level);
    const stages: SyllabusStage[] = [];
    for (const stage of levelStages) {
      stages.push({
        id: stage.id,
        short: stage.short,
        quizQuestionCount: stage.quiz.length,
      });
    }

    syllabus.push({ name: LEVELS[level].name, difficulty: LEVEL_DIFFICULTY[level], stages });
  }

  return syllabus;
}

function countQuizQuestions(course: Course): number {
  let questionCount = 0;
  for (const stage of course.stages) {
    questionCount += stage.quiz.length;
  }
  return questionCount;
}

export function CourseCard({ course }: { course: Course }) {
  const stageCount = course.stages.length;
  // Every stage ends with one coding exercise.
  const exerciseCount = stageCount;
  const questionCount = countQuizQuestions(course);

  return (
    <Link
      href={`/course/${course.slug}`}
      className="flex h-full flex-col rounded-2xl border-[1.5px] border-border bg-card px-6 py-[22px] transition-[transform,box-shadow,border-color] duration-200 outline-none hover:border-ink hover:shadow-[0_4px_0_var(--ink)] focus-visible:border-ink focus-visible:ring-3 focus-visible:ring-ring/40 motion-safe:hover:-translate-y-[3px]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-lg bg-code px-[9px] py-1 font-mono text-[17px] font-semibold text-highlight">
          {course.logo}
        </span>
        <Badge variant={DIFFICULTY_BADGE_VARIANT[course.difficulty]}>
          {course.difficulty}
        </Badge>
      </div>

      <h3 className="mt-4 text-[24px] leading-[1.15] font-bold tracking-[-.02em]">
        {course.title}
      </h3>
      <p className="mt-1 text-[15px] text-muted-foreground">{course.tagline}</p>
      <p className="mt-3 text-[15.5px] text-body-ink">{course.description}</p>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[14px]">
        <li>
          <b>{stageCount}</b> stages
        </li>
        <li>
          <b>{exerciseCount}</b> coding exercises
        </li>
        <li>
          <b>{questionCount}</b> quiz questions
        </li>
      </ul>

      <CourseProgress
        storageKey={course.progressStorageKey}
        levels={buildSyllabus(course)}
      />
    </Link>
  );
}
