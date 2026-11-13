import type { Level, Stage } from "./types";

export type StageProgress = {
  /** Question index → answered correctly. */
  quiz: Record<number, boolean>;
  /** Question index → wrong answers given before the right one. */
  wrongAnswers: Record<number, number>;
  codePassed: boolean;
  /** Unsaved editor contents, or null to show the starter code. */
  draft: string | null;
  runs: number;
  usedHint: boolean;
  viewedSolution: boolean;
};

export type Progress = {
  stages: Record<string, StageProgress>;
  /** Set when the learner chose to skip ahead to the advanced section. */
  skippedToAdvanced: boolean;
};

// Progress is a per-browser convenience, so localStorage is enough.
const STORAGE_KEY = "arrayAcademy:v1";

export const EMPTY_PROGRESS: Progress = {
  stages: {},
  skippedToAdvanced: false,
};

export const EMPTY_STAGE_PROGRESS: StageProgress = {
  quiz: {},
  wrongAnswers: {},
  codePassed: false,
  draft: null,
  runs: 0,
  usedHint: false,
  viewedSolution: false,
};

export function loadProgress(): Progress {
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage can be blocked (private mode, disabled site data).
    return EMPTY_PROGRESS;
  }

  if (stored === null) {
    return EMPTY_PROGRESS;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<Progress>;
    return {
      stages: parsed.stages ?? {},
      skippedToAdvanced: parsed.skippedToAdvanced === true,
    };
  } catch {
    // Corrupt data: start fresh rather than crash the course.
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(progress: Progress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or blocked; progress just won't persist.
  }
}

export function getStageProgress(
  progress: Progress,
  stageId: string
): StageProgress {
  const stored = progress.stages[stageId];
  if (stored === undefined) {
    return EMPTY_STAGE_PROGRESS;
  }
  return { ...EMPTY_STAGE_PROGRESS, ...stored };
}

export function withStageProgress(
  progress: Progress,
  stageId: string,
  update: (current: StageProgress) => StageProgress
): Progress {
  const current = getStageProgress(progress, stageId);
  return {
    ...progress,
    stages: { ...progress.stages, [stageId]: update(current) },
  };
}

export function isQuizComplete(stage: Stage, stageProgress: StageProgress) {
  for (let index = 0; index < stage.quiz.length; index++) {
    if (stageProgress.quiz[index] !== true) {
      return false;
    }
  }
  return true;
}

export function isStageDone(stage: Stage, progress: Progress): boolean {
  const stageProgress = getStageProgress(progress, stage.id);
  return isQuizComplete(stage, stageProgress) && stageProgress.codePassed;
}

/** True once the learner has done anything at all in a stage. */
export function hasStartedStage(progress: Progress, stageId: string): boolean {
  const stored = progress.stages[stageId];
  if (stored === undefined) {
    return false;
  }
  const answeredAnyQuestion = Object.keys(stored.quiz ?? {}).length > 0;
  return stored.codePassed || answeredAnyQuestion || stored.runs > 0;
}

export function getStagesForLevel(stages: Stage[], level: Level): Stage[] {
  const result: Stage[] = [];
  for (const stage of stages) {
    if (stage.level === level) {
      result.push(stage);
    }
  }
  return result;
}

export function getLastStageOfLevel(stages: Stage[], level: Level): Stage {
  const levelStages = getStagesForLevel(stages, level);
  return levelStages[levelStages.length - 1];
}

export function isAdvancedUnlocked(stages: Stage[], progress: Progress) {
  const finishedBeginner = isStageDone(
    getLastStageOfLevel(stages, "basic"),
    progress
  );
  return finishedBeginner || progress.skippedToAdvanced;
}

export function isStageLocked(
  stage: Stage,
  stages: Stage[],
  progress: Progress
): boolean {
  return stage.level === "adv" && !isAdvancedUnlocked(stages, progress);
}

/** Results unlock once the final stage of that level is passed. */
export function isResultsUnlocked(
  stages: Stage[],
  progress: Progress,
  level: Level
): boolean {
  return isStageDone(getLastStageOfLevel(stages, level), progress);
}

export function removeLevelProgress(
  progress: Progress,
  stages: Stage[],
  level: Level
): Progress {
  const remainingStages = { ...progress.stages };
  for (const stage of getStagesForLevel(stages, level)) {
    delete remainingStages[stage.id];
  }
  return { ...progress, stages: remainingStages };
}
