"use client";

import { useRef, useState } from "react";
import { getCourseBySlug, getLevelCopy, type Course } from "./course/courses";
import { Sidebar, type SidebarLevelGroup } from "./sidebar";
import { StageView } from "./stage-view";
import { LockedView } from "./locked-view";
import { ResultsView } from "./results-view";
import {
  Confetti,
  CONFETTI_LIFETIME_MILLISECONDS,
  createConfettiPieces,
  type ConfettiBurst,
} from "./confetti";
import {
  EMPTY_PROGRESS,
  getCourseLevels,
  getNextLevel,
  getPreviousLevel,
  getStageProgress,
  getStagesForLevel,
  hasStartedStage,
  isLevelUnlocked,
  isResultsUnlocked,
  isStageDone,
  isStageLocked,
  loadProgress,
  openLevelsUpTo,
  removeLevelProgress,
  saveProgress,
  withStageProgress,
  type Progress,
  type StageProgress,
} from "@/lib/academy/progress";
import type { Level, Stage } from "@/lib/academy/types";

type View =
  | { kind: "stage"; stageIndex: number }
  | { kind: "results"; level: Level };

function findFirstUnfinishedStageIndex(
  stages: Stage[],
  progress: Progress,
  level: Level
): number {
  return stages.findIndex(
    (stage) => stage.level === level && !isStageDone(stage, progress)
  );
}

function hasStartedLevel(stages: Stage[], progress: Progress, level: Level): boolean {
  const levelStages = getStagesForLevel(stages, level);
  return levelStages.some((stage) => hasStartedStage(progress, stage.id));
}

/**
 * Picks up where the learner left off on their last visit: the furthest
 * section they have started and can open, at its first unfinished stage.
 */
function getResumeView(stages: Stage[], progress: Progress): View {
  const courseLevels = getCourseLevels(stages);
  let resumeLevel = courseLevels[0];

  for (const level of courseLevels) {
    const canOpen = isLevelUnlocked(stages, progress, level);
    if (canOpen && hasStartedLevel(stages, progress, level)) {
      resumeLevel = level;
    }
  }

  const unfinishedIndex = findFirstUnfinishedStageIndex(stages, progress, resumeLevel);
  if (unfinishedIndex >= 0) {
    return { kind: "stage", stageIndex: unfinishedIndex };
  }
  return { kind: "results", level: resumeLevel };
}

/**
 * Retaking a section clears its progress. Sections after it that are open now
 * stay open, so a retake never re-locks work the learner has moved on to.
 */
function keepLaterLevelsOpen(stages: Stage[], progress: Progress, retakenLevel: Level): Progress {
  let nextProgress = progress;
  let laterLevel = getNextLevel(stages, retakenLevel);

  while (laterLevel !== undefined) {
    if (isLevelUnlocked(stages, nextProgress, laterLevel)) {
      nextProgress = openLevelsUpTo(stages, nextProgress, laterLevel);
    }
    laterLevel = getNextLevel(stages, laterLevel);
  }

  return nextProgress;
}

type AcademyAppProps = {
  courseSlug: string;
};

export function AcademyApp({ courseSlug }: AcademyAppProps) {
  // The route has already checked the slug, so the course exists.
  const course = getCourseBySlug(courseSlug);
  const stages = course.stages;
  const storageKey = course.progressStorageKey;

  const [progress, setProgress] = useState<Progress>(() => loadProgress(storageKey));
  const [view, setView] = useState<View>(() => getResumeView(stages, progress));
  // Bumped on every navigation so the page remounts fresh, even for the same stage.
  const [visitCount, setVisitCount] = useState(0);
  const [confettiBursts, setConfettiBursts] = useState<ConfettiBurst[]>([]);

  // Async handlers (like a code run) call back after awaiting, so they read
  // the latest progress from this ref instead of a stale render's value.
  const progressRef = useRef(progress);

  function commitProgress(nextProgress: Progress) {
    progressRef.current = nextProgress;
    setProgress(nextProgress);
    saveProgress(storageKey, nextProgress);
  }

  function celebrate() {
    const burst: ConfettiBurst = { id: Date.now(), pieces: createConfettiPieces() };
    setConfettiBursts((current) => [...current, burst]);
    setTimeout(() => {
      setConfettiBursts((current) => current.filter((b) => b.id !== burst.id));
    }, CONFETTI_LIFETIME_MILLISECONDS);
  }

  function updateStageProgress(
    stage: Stage,
    update: (current: StageProgress) => StageProgress
  ) {
    const before = progressRef.current;
    const after = withStageProgress(before, stage.id, update);
    commitProgress(after);

    const justFinished = !isStageDone(stage, before) && isStageDone(stage, after);
    if (justFinished) {
      celebrate();
    }
  }

  function goTo(nextView: View) {
    setView(nextView);
    setVisitCount((count) => count + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStage(stageIndex: number) {
    goTo({ kind: "stage", stageIndex });
  }

  function resetAllProgress() {
    commitProgress(EMPTY_PROGRESS);
    goToStage(0);
  }

  // Results for a level only open once its final stage is passed.
  let currentView = view;
  if (view.kind === "results" && !isResultsUnlocked(stages, progress, view.level)) {
    currentView = { kind: "stage", stageIndex: 0 };
  }

  const sidebarGroups = buildSidebarGroups(stages, progress, currentView);
  const doneCount = stages.filter((stage) => isStageDone(stage, progress)).length;

  return (
    <div className="grid min-h-screen grid-cols-1 min-[821px]:grid-cols-[270px_1fr]">
      <Sidebar
        course={course}
        groups={sidebarGroups}
        doneCount={doneCount}
        stageCount={stages.length}
        onSelectStage={goToStage}
        onSelectResults={(level) => goTo({ kind: "results", level })}
        onResetProgress={resetAllProgress}
      />
      <main className="max-w-[980px] min-w-0 px-[clamp(18px,4vw,56px)] pt-[34px] pb-20">
        <MainContent
          key={`${visitCount}`}
          course={course}
          view={currentView}
          progress={progress}
          onGoToStage={goToStage}
          onGoToResults={(level) => goTo({ kind: "results", level })}
          onUpdateStageProgress={updateStageProgress}
          onSkipAhead={(stageIndex) => {
            const lockedLevel = stages[stageIndex].level;
            commitProgress(openLevelsUpTo(stages, progressRef.current, lockedLevel));
            goToStage(stageIndex);
          }}
          onRetakeLevel={(level) => {
            let nextProgress = keepLaterLevelsOpen(stages, progressRef.current, level);
            nextProgress = removeLevelProgress(nextProgress, stages, level);
            commitProgress(nextProgress);
            const firstStage = getStagesForLevel(stages, level)[0];
            goToStage(stages.indexOf(firstStage));
          }}
        />
      </main>
      <Confetti bursts={confettiBursts} />
    </div>
  );
}

type MainContentProps = {
  course: Course;
  view: View;
  progress: Progress;
  onGoToStage: (stageIndex: number) => void;
  onGoToResults: (level: Level) => void;
  onUpdateStageProgress: (
    stage: Stage,
    update: (current: StageProgress) => StageProgress
  ) => void;
  onSkipAhead: (stageIndex: number) => void;
  onRetakeLevel: (level: Level) => void;
};

function MainContent({
  course,
  view,
  progress,
  onGoToStage,
  onGoToResults,
  onUpdateStageProgress,
  onSkipAhead,
  onRetakeLevel,
}: MainContentProps) {
  const stages = course.stages;

  if (view.kind === "results") {
    const nextLevel = getNextLevel(stages, view.level);
    let nextLevelFirstStageIndex = -1;
    if (nextLevel !== undefined) {
      nextLevelFirstStageIndex = stages.findIndex((stage) => stage.level === nextLevel);
    }

    return (
      <ResultsView
        level={view.level}
        levelStages={getStagesForLevel(stages, view.level)}
        progress={progress}
        levelCopy={getLevelCopy(course, view.level)}
        nextLevel={nextLevel}
        nextLevelFirstStageIndex={nextLevelFirstStageIndex}
        getStageIndex={(stage) => stages.indexOf(stage)}
        onGoToStage={onGoToStage}
        onRetake={() => onRetakeLevel(view.level)}
      />
    );
  }

  const stageIndex = view.stageIndex;
  const stage = stages[stageIndex];

  if (isStageLocked(stage, stages, progress)) {
    // A locked section always has a section before it: the first one is never locked.
    const requiredLevel = getPreviousLevel(stages, stage.level) ?? stage.level;
    const requiredStages = getStagesForLevel(stages, requiredLevel);
    const requiredDoneCount = requiredStages.filter((s) =>
      isStageDone(s, progress)
    ).length;

    return (
      <LockedView
        lockedLevel={stage.level}
        requiredLevel={requiredLevel}
        requiredDoneCount={requiredDoneCount}
        requiredStageCount={requiredStages.length}
        onContinueRequired={() => {
          const firstUnfinished = findFirstUnfinishedStageIndex(
            stages,
            progress,
            requiredLevel
          );
          const firstRequiredIndex = stages.indexOf(requiredStages[0]);
          onGoToStage(firstUnfinished < 0 ? firstRequiredIndex : firstUnfinished);
        }}
        onSkipAhead={() => onSkipAhead(stageIndex)}
      />
    );
  }

  const levelStages = getStagesForLevel(stages, stage.level);
  const numberInLevel = levelStages.indexOf(stage) + 1;
  const isLastInLevel = numberInLevel === levelStages.length;

  return (
    <StageView
      stage={stage}
      stageNumber={numberInLevel}
      stageCountInLevel={levelStages.length}
      previousStage={stages[stageIndex - 1]}
      nextStage={stages[stageIndex + 1]}
      stageProgress={getStageProgress(progress, stage.id)}
      levelFinishedMessage={getLevelCopy(course, stage.level).finishedMessage}
      onStageProgressChange={(update) => onUpdateStageProgress(stage, update)}
      onGoPrevious={() => onGoToStage(stageIndex - 1)}
      onGoNext={() => onGoToStage(stageIndex + 1)}
      onFinishStage={() => {
        if (isLastInLevel) {
          onGoToResults(stage.level);
        } else {
          onGoToStage(stageIndex + 1);
        }
      }}
    />
  );
}

function buildSidebarGroups(
  stages: Stage[],
  progress: Progress,
  view: View
): SidebarLevelGroup[] {
  const groups: SidebarLevelGroup[] = [];

  for (const level of getCourseLevels(stages)) {
    const levelStages = getStagesForLevel(stages, level);
    const items = levelStages.map((stage, indexInLevel) => {
      const stageIndex = stages.indexOf(stage);
      return {
        stage,
        stageIndex,
        numberInLevel: indexInLevel + 1,
        isActive: view.kind === "stage" && view.stageIndex === stageIndex,
        isDone: isStageDone(stage, progress),
        isLocked: isStageLocked(stage, stages, progress),
      };
    });

    groups.push({
      level,
      isLocked: !isLevelUnlocked(stages, progress, level),
      items,
      showResultsLink: isResultsUnlocked(stages, progress, level),
      isResultsActive: view.kind === "results" && view.level === level,
    });
  }

  return groups;
}
