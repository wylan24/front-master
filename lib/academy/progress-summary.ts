import {
  getCourseLevels,
  getStageProgress,
  getStagesForLevel,
  hasStartedStage,
  isLevelUnlocked,
  isResultsUnlocked,
  isStageDone,
  type Progress,
} from "./progress";
import { scoreStage } from "./scoring";
import type { Level, Stage } from "./types";

export type LevelSummary = {
  level: Level;
  doneCount: number;
  stageCount: number;
  /** Average score (0–100) of the finished stages, or null if none are finished. */
  averageScore: number | null;
  isUnlocked: boolean;
  /** True once the section's final stage is passed. */
  isResultsUnlocked: boolean;
};

export type CourseSummary = {
  doneCount: number;
  stageCount: number;
  hasStarted: boolean;
  /** The first unfinished stage the learner can open, or null when there's none. */
  nextStage: Stage | null;
  levels: LevelSummary[];
  /** Quiz questions answered correctly, and how many of those were right first time. */
  questionsCorrect: number;
  questionsFirstTry: number;
  challengesPassed: number;
  challengesPassedWithoutSolution: number;
  hintsUsed: number;
};

function summariseLevel(stages: Stage[], progress: Progress, level: Level): LevelSummary {
  const levelStages = getStagesForLevel(stages, level);
  let doneCount = 0;
  let scoreTotal = 0;

  for (const stage of levelStages) {
    if (isStageDone(stage, progress)) {
      doneCount++;
      scoreTotal += scoreStage(stage, progress).score;
    }
  }

  let averageScore: number | null = null;
  if (doneCount > 0) {
    averageScore = Math.round(scoreTotal / doneCount);
  }

  return {
    level,
    doneCount,
    stageCount: levelStages.length,
    averageScore,
    isUnlocked: isLevelUnlocked(stages, progress, level),
    isResultsUnlocked: isResultsUnlocked(stages, progress, level),
  };
}

function findNextStage(stages: Stage[], progress: Progress): Stage | null {
  for (const stage of stages) {
    const canOpen = isLevelUnlocked(stages, progress, stage.level);
    if (canOpen && !isStageDone(stage, progress)) {
      return stage;
    }
  }
  return null;
}

/** Everything the progress page shows about one course, worked out from saved progress. */
export function summariseCourse(stages: Stage[], progress: Progress): CourseSummary {
  const levels: LevelSummary[] = [];
  for (const level of getCourseLevels(stages)) {
    levels.push(summariseLevel(stages, progress, level));
  }

  let doneCount = 0;
  let hasStarted = false;
  let questionsCorrect = 0;
  let questionsFirstTry = 0;
  let challengesPassed = 0;
  let challengesPassedWithoutSolution = 0;
  let hintsUsed = 0;

  for (const stage of stages) {
    if (isStageDone(stage, progress)) {
      doneCount++;
    }
    if (hasStartedStage(progress, stage.id)) {
      hasStarted = true;
    }

    const stageProgress = getStageProgress(progress, stage.id);
    for (let index = 0; index < stage.quiz.length; index++) {
      if (stageProgress.quiz[index] !== true) {
        continue;
      }
      questionsCorrect++;
      const wrongAnswers = stageProgress.wrongAnswers[index] ?? 0;
      if (wrongAnswers === 0) {
        questionsFirstTry++;
      }
    }

    if (stageProgress.codePassed) {
      challengesPassed++;
      if (!stageProgress.viewedSolution) {
        challengesPassedWithoutSolution++;
      }
    }
    if (stageProgress.usedHint) {
      hintsUsed++;
    }
  }

  return {
    doneCount,
    stageCount: stages.length,
    hasStarted,
    nextStage: findNextStage(stages, progress),
    levels,
    questionsCorrect,
    questionsFirstTry,
    challengesPassed,
    challengesPassedWithoutSolution,
    hintsUsed,
  };
}
