"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EMPTY_PROGRESS, isStageCompleteFor } from "@/lib/academy/progress";
import { useStoredProgress } from "@/lib/academy/use-stored-progress";

/** Just enough about a stage to draw it and tell whether it's done. */
export type SyllabusStage = {
  id: string;
  short: string;
  quizQuestionCount: number;
};

/** 1 = beginner, 2 = intermediate, 3 = advanced. */
export type Difficulty = 1 | 2 | 3;

export type SyllabusLevel = {
  name: string;
  difficulty: Difficulty;
  stages: SyllabusStage[];
};

type CourseProgressProps = {
  storageKey: string;
  levels: SyllabusLevel[];
};

function getCallToAction(doneCount: number, stageCount: number): string {
  if (doneCount === 0) {
    return "Start course";
  }
  if (doneCount === stageCount) {
    return "Review course";
  }
  return "Continue course";
}

/**
 * The course syllabus drawn as rows of array boxes, one per stage.
 * Finished stages fill in green, so the boxes double as the progress bar.
 */
export function CourseProgress({ storageKey, levels }: CourseProgressProps) {
  const storedProgress = useStoredProgress(storageKey);
  const hasReadProgress = storedProgress !== null;
  const progress = storedProgress ?? EMPTY_PROGRESS;

  let stageCount = 0;
  let doneCount = 0;
  const doneStageIds = new Set<string>();

  for (const level of levels) {
    for (const stage of level.stages) {
      stageCount += 1;
      const isDone = isStageCompleteFor(progress, stage.id, stage.quizQuestionCount);
      if (isDone) {
        doneCount += 1;
        doneStageIds.add(stage.id);
      }
    }
  }

  return (
    <div className="mt-auto pt-6">
      {/* The footer below sums this up in words, so screen readers skip the rows. */}
      <div aria-hidden="true">
        {levels.map((level) => (
          <DifficultyRow
            key={level.name}
            level={level}
            doneStageIds={doneStageIds}
            showProgress={hasReadProgress}
          />
        ))}
      </div>

      {/* Hidden, not removed, until saved progress is read: keeps the card height steady. */}
      <div
        className={cn(
          "mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4",
          !hasReadProgress && "invisible"
        )}
      >
        <span className="text-[14px] text-muted-foreground">
          {doneCount} of {stageCount} stages complete
        </span>
        <span className={buttonVariants({ variant: "default" })}>
          {getCallToAction(doneCount, stageCount)}
        </span>
      </div>
    </div>
  );
}

type DifficultyStyle = {
  effort: string;
  note: string;
  /** How many of the five bar segments are filled. */
  filledSegments: number;
  fillClass: string;
  inkClass: string;
};

// Written out per difficulty so each row's wording and colours are easy to find.
const DIFFICULTY_STYLE: Record<Difficulty, DifficultyStyle> = {
  1: {
    effort: "Gentle start",
    note: "No experience needed",
    filledSegments: 1,
    fillClass: "bg-difficulty-easy",
    inkClass: "text-difficulty-easy-ink",
  },
  2: {
    effort: "Steady practice",
    note: "Builds on the beginner stages",
    filledSegments: 3,
    fillClass: "bg-difficulty-medium",
    inkClass: "text-difficulty-medium-ink",
  },
  3: {
    effort: "Real challenge",
    note: "For confident coders",
    filledSegments: 5,
    fillClass: "bg-difficulty-hard",
    inkClass: "text-difficulty-hard-ink",
  },
};

const SEGMENT_COUNT = 5;

function countDone(level: SyllabusLevel, doneStageIds: Set<string>): number {
  let done = 0;
  for (const stage of level.stages) {
    if (doneStageIds.has(stage.id)) {
      done++;
    }
  }
  return done;
}

/**
 * One section of the course: its name and effort level, a five-part bar that
 * fills further the harder the section is, and how far the learner has got.
 */
function DifficultyRow({
  level,
  doneStageIds,
  showProgress,
}: {
  level: SyllabusLevel;
  doneStageIds: Set<string>;
  showProgress: boolean;
}) {
  const style = DIFFICULTY_STYLE[level.difficulty];
  const doneInLevel = countDone(level, doneStageIds);
  const stageTotal = level.stages.length;
  const isLevelComplete = doneInLevel === stageTotal;

  const segments: boolean[] = [];
  for (let index = 0; index < SEGMENT_COUNT; index++) {
    segments.push(index < style.filledSegments);
  }

  let progressText = `${doneInLevel} of ${stageTotal} stages`;
  if (isLevelComplete) {
    progressText = `✓ All ${stageTotal} stages`;
  }

  return (
    <div className="border-t border-border py-3 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[14.5px] font-semibold">{level.name}</span>
        <span className={cn("text-[13px] font-medium", style.inkClass)}>{style.effort}</span>
      </div>
      <div className="my-2 flex gap-1">
        {segments.map((isFilled, index) => (
          <span
            key={index}
            className={cn("h-1.5 flex-1 rounded-full", isFilled ? style.fillClass : "bg-line")}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[12.5px]">
        <span className="text-muted-foreground">{style.note}</span>
        <span
          className={cn(
            "text-muted-foreground",
            isLevelComplete && "font-medium text-difficulty-easy-ink",
            !showProgress && "invisible"
          )}
        >
          {progressText}
        </span>
      </div>
    </div>
  );
}
