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
  /** Sections the learner opened early, before passing the final of the section before. */
  skippedToLevels: Level[];
};

/** Every possible section, in teaching order. A course uses some or all of them. */
export const LEVEL_ORDER: Level[] = ["basic", "mid", "adv"];

// Progress is a per-browser convenience, so localStorage is enough.
// Each course stores its progress under its own key (see Course.progressStorageKey).

export const EMPTY_PROGRESS: Progress = {
  stages: {},
  skippedToLevels: [],
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

/** The raw saved text for a course, or null when nothing is saved or storage is blocked. */
export function readStoredProgressText(storageKey: string): string | null {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    // Storage can be blocked (private mode, disabled site data).
    return null;
  }
}

export function loadProgress(storageKey: string): Progress {
  return parseProgress(readStoredProgressText(storageKey));
}

/** What may be in storage, including the shape saved before courses had three sections. */
type StoredProgress = {
  stages?: Record<string, StageProgress>;
  skippedToLevels?: unknown;
  /** Older saves: true meant "skipped ahead to the advanced section". */
  skippedToAdvanced?: boolean;
};

function readSkippedLevels(parsed: StoredProgress): Level[] {
  const skippedLevels: Level[] = [];

  if (Array.isArray(parsed.skippedToLevels)) {
    for (const level of LEVEL_ORDER) {
      if (parsed.skippedToLevels.includes(level)) {
        skippedLevels.push(level);
      }
    }
  }

  const hasOldAdvancedSkip = parsed.skippedToAdvanced === true;
  if (hasOldAdvancedSkip && !skippedLevels.includes("adv")) {
    skippedLevels.push("adv");
  }

  return skippedLevels;
}

export function parseProgress(stored: string | null): Progress {
  if (stored === null) {
    return EMPTY_PROGRESS;
  }

  try {
    const parsed = JSON.parse(stored) as StoredProgress;
    return {
      stages: parsed.stages ?? {},
      skippedToLevels: readSkippedLevels(parsed),
    };
  } catch {
    // Corrupt data: start fresh rather than crash the course.
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(storageKey: string, progress: Progress): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
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

function areAllQuestionsCorrect(
  stageProgress: StageProgress,
  quizQuestionCount: number
): boolean {
  for (let index = 0; index < quizQuestionCount; index++) {
    if (stageProgress.quiz[index] !== true) {
      return false;
    }
  }
  return true;
}

export function isQuizComplete(stage: Stage, stageProgress: StageProgress) {
  return areAllQuestionsCorrect(stageProgress, stage.quiz.length);
}

/**
 * The single rule for "this stage is done": every quiz question answered
 * correctly and the code exercise passed. Takes only the question count so the
 * homepage can check completion without loading the full course content.
 */
export function isStageCompleteFor(
  progress: Progress,
  stageId: string,
  quizQuestionCount: number
): boolean {
  const stageProgress = getStageProgress(progress, stageId);
  return (
    areAllQuestionsCorrect(stageProgress, quizQuestionCount) &&
    stageProgress.codePassed
  );
}

export function isStageDone(stage: Stage, progress: Progress): boolean {
  return isStageCompleteFor(progress, stage.id, stage.quiz.length);
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

/** The sections this course actually has, in teaching order. */
export function getCourseLevels(stages: Stage[]): Level[] {
  const courseLevels: Level[] = [];
  for (const level of LEVEL_ORDER) {
    const hasStages = stages.some((stage) => stage.level === level);
    if (hasStages) {
      courseLevels.push(level);
    }
  }
  return courseLevels;
}

/** The section just before `level` in this course, or undefined for the first one. */
export function getPreviousLevel(stages: Stage[], level: Level): Level | undefined {
  const courseLevels = getCourseLevels(stages);
  const position = courseLevels.indexOf(level);
  if (position <= 0) {
    return undefined;
  }
  return courseLevels[position - 1];
}

/** The section just after `level` in this course, or undefined for the last one. */
export function getNextLevel(stages: Stage[], level: Level): Level | undefined {
  const courseLevels = getCourseLevels(stages);
  const position = courseLevels.indexOf(level);
  if (position < 0 || position === courseLevels.length - 1) {
    return undefined;
  }
  return courseLevels[position + 1];
}

/**
 * The first section is always open. Each later section opens when the learner
 * passes the final stage of the section before it, or chooses to skip ahead.
 */
export function isLevelUnlocked(
  stages: Stage[],
  progress: Progress,
  level: Level
): boolean {
  const previousLevel = getPreviousLevel(stages, level);
  if (previousLevel === undefined) {
    return true;
  }
  if (progress.skippedToLevels.includes(level)) {
    return true;
  }
  return isStageDone(getLastStageOfLevel(stages, previousLevel), progress);
}

export function isStageLocked(
  stage: Stage,
  stages: Stage[],
  progress: Progress
): boolean {
  return !isLevelUnlocked(stages, progress, stage.level);
}

/**
 * Skipping ahead opens the chosen section and every section before it, so the
 * learner never ends up in a section whose earlier sections are still locked.
 */
export function openLevelsUpTo(
  stages: Stage[],
  progress: Progress,
  targetLevel: Level
): Progress {
  const skippedLevels = [...progress.skippedToLevels];

  for (const level of getCourseLevels(stages)) {
    const isFirstLevel = getPreviousLevel(stages, level) === undefined;
    const alreadyListed = skippedLevels.includes(level);
    if (!isFirstLevel && !alreadyListed) {
      skippedLevels.push(level);
    }
    if (level === targetLevel) {
      break;
    }
  }

  return { ...progress, skippedToLevels: skippedLevels };
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
