"use client";

import { useRef, useState } from "react";
import { STAGES } from "./course/stages";
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
  getStageProgress,
  getStagesForLevel,
  hasStartedStage,
  isAdvancedUnlocked,
  isResultsUnlocked,
  isStageDone,
  isStageLocked,
  loadProgress,
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

const LEVEL_ORDER: Level[] = ["basic", "adv"];

function findFirstUnfinishedStageIndex(progress: Progress, level: Level): number {
  return STAGES.findIndex(
    (stage) => stage.level === level && !isStageDone(stage, progress)
  );
}

/** Picks up where the learner left off on their last visit. */
function getResumeView(progress: Progress): View {
  const beginnerIndex = findFirstUnfinishedStageIndex(progress, "basic");
  const advancedIndex = findFirstUnfinishedStageIndex(progress, "adv");

  const advancedStages = getStagesForLevel(STAGES, "adv");
  const hasStartedAdvanced = advancedStages.some((stage) =>
    hasStartedStage(progress, stage.id)
  );

  if (hasStartedAdvanced && isAdvancedUnlocked(STAGES, progress)) {
    if (advancedIndex >= 0) {
      return { kind: "stage", stageIndex: advancedIndex };
    }
    return { kind: "results", level: "adv" };
  }

  if (beginnerIndex >= 0) {
    return { kind: "stage", stageIndex: beginnerIndex };
  }
  return { kind: "results", level: "basic" };
}

export function AcademyApp() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [view, setView] = useState<View>(() => getResumeView(progress));
  // Bumped on every navigation so the page remounts fresh, even for the same stage.
  const [visitCount, setVisitCount] = useState(0);
  const [confettiBursts, setConfettiBursts] = useState<ConfettiBurst[]>([]);

  // Async handlers (like a code run) call back after awaiting, so they read
  // the latest progress from this ref instead of a stale render's value.
  const progressRef = useRef(progress);

  function commitProgress(nextProgress: Progress) {
    progressRef.current = nextProgress;
    setProgress(nextProgress);
    saveProgress(nextProgress);
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
  if (view.kind === "results" && !isResultsUnlocked(STAGES, progress, view.level)) {
    currentView = { kind: "stage", stageIndex: 0 };
  }

  const sidebarGroups = buildSidebarGroups(progress, currentView);
  const doneCount = STAGES.filter((stage) => isStageDone(stage, progress)).length;

  return (
    <div className="grid min-h-screen grid-cols-1 min-[821px]:grid-cols-[270px_1fr]">
      <Sidebar
        groups={sidebarGroups}
        doneCount={doneCount}
        stageCount={STAGES.length}
        onSelectStage={goToStage}
        onSelectResults={(level) => goTo({ kind: "results", level })}
        onResetProgress={resetAllProgress}
      />
      <main className="max-w-[980px] px-[clamp(18px,4vw,56px)] pt-[34px] pb-20">
        <MainContent
          key={`${visitCount}`}
          view={currentView}
          progress={progress}
          onGoToStage={goToStage}
          onGoToResults={(level) => goTo({ kind: "results", level })}
          onUpdateStageProgress={updateStageProgress}
          onSkipToAdvanced={(stageIndex) => {
            commitProgress({ ...progressRef.current, skippedToAdvanced: true });
            goToStage(stageIndex);
          }}
          onRetakeLevel={(level) => {
            let nextProgress = progressRef.current;
            // Retaking the beginner course shouldn't re-lock an advanced section already open.
            if (level === "basic" && isAdvancedUnlocked(STAGES, nextProgress)) {
              nextProgress = { ...nextProgress, skippedToAdvanced: true };
            }
            nextProgress = removeLevelProgress(nextProgress, STAGES, level);
            commitProgress(nextProgress);
            const firstStage = getStagesForLevel(STAGES, level)[0];
            goToStage(STAGES.indexOf(firstStage));
          }}
        />
      </main>
      <Confetti bursts={confettiBursts} />
    </div>
  );
}

type MainContentProps = {
  view: View;
  progress: Progress;
  onGoToStage: (stageIndex: number) => void;
  onGoToResults: (level: Level) => void;
  onUpdateStageProgress: (
    stage: Stage,
    update: (current: StageProgress) => StageProgress
  ) => void;
  onSkipToAdvanced: (stageIndex: number) => void;
  onRetakeLevel: (level: Level) => void;
};

function MainContent({
  view,
  progress,
  onGoToStage,
  onGoToResults,
  onUpdateStageProgress,
  onSkipToAdvanced,
  onRetakeLevel,
}: MainContentProps) {
  if (view.kind === "results") {
    return (
      <ResultsView
        level={view.level}
        levelStages={getStagesForLevel(STAGES, view.level)}
        progress={progress}
        firstAdvancedStageIndex={STAGES.findIndex((stage) => stage.level === "adv")}
        getStageIndex={(stage) => STAGES.indexOf(stage)}
        onGoToStage={onGoToStage}
        onRetake={() => onRetakeLevel(view.level)}
      />
    );
  }

  const stageIndex = view.stageIndex;
  const stage = STAGES[stageIndex];

  if (isStageLocked(stage, STAGES, progress)) {
    const beginnerStages = getStagesForLevel(STAGES, "basic");
    const beginnerDoneCount = beginnerStages.filter((s) =>
      isStageDone(s, progress)
    ).length;

    return (
      <LockedView
        beginnerDoneCount={beginnerDoneCount}
        beginnerStageCount={beginnerStages.length}
        onContinueBeginner={() => {
          const firstUnfinished = findFirstUnfinishedStageIndex(progress, "basic");
          onGoToStage(firstUnfinished < 0 ? 0 : firstUnfinished);
        }}
        onSkipAhead={() => onSkipToAdvanced(stageIndex)}
      />
    );
  }

  const levelStages = getStagesForLevel(STAGES, stage.level);
  const numberInLevel = levelStages.indexOf(stage) + 1;
  const isLastInLevel = numberInLevel === levelStages.length;

  return (
    <StageView
      stage={stage}
      stageNumber={numberInLevel}
      stageCountInLevel={levelStages.length}
      previousStage={STAGES[stageIndex - 1]}
      nextStage={STAGES[stageIndex + 1]}
      stageProgress={getStageProgress(progress, stage.id)}
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

function buildSidebarGroups(progress: Progress, view: View): SidebarLevelGroup[] {
  const advancedUnlocked = isAdvancedUnlocked(STAGES, progress);
  const groups: SidebarLevelGroup[] = [];

  for (const level of LEVEL_ORDER) {
    const levelStages = getStagesForLevel(STAGES, level);
    const items = levelStages.map((stage, indexInLevel) => {
      const stageIndex = STAGES.indexOf(stage);
      return {
        stage,
        stageIndex,
        numberInLevel: indexInLevel + 1,
        isActive: view.kind === "stage" && view.stageIndex === stageIndex,
        isDone: isStageDone(stage, progress),
        isLocked: isStageLocked(stage, STAGES, progress),
      };
    });

    groups.push({
      level,
      isLocked: level === "adv" && !advancedUnlocked,
      items,
      showResultsLink: isResultsUnlocked(STAGES, progress, level),
      isResultsActive: view.kind === "results" && view.level === level,
    });
  }

  return groups;
}
