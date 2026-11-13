import {
  getStageProgress,
  isStageDone,
  type Progress,
  type StageProgress,
} from "./progress";
import type { Stage } from "./types";

export type StageScore = {
  stage: Stage;
  score: number;
  firstTryCount: number;
  questionCount: number;
  codeNote: string;
  done: boolean;
  stageProgress: StageProgress;
};

export type Grade = {
  title: string;
  emoji: string;
  message: string;
};

const QUIZ_POINTS = 50;
const CODE_POINTS = 50;

/**
 * Each stage is worth 100: 50 for the quiz and 50 for the code challenge.
 * Quiz: full marks first try, half after one wrong answer, a quarter after more.
 * Code: −10 for a hint, −5 per extra run (capped at −20), 10 if the solution was viewed.
 */
export function scoreStage(stage: Stage, progress: Progress): StageScore {
  const stageProgress = getStageProgress(progress, stage.id);
  const questionCount = stage.quiz.length;
  const pointsPerQuestion = QUIZ_POINTS / questionCount;

  let quizPoints = 0;
  let firstTryCount = 0;
  for (let index = 0; index < questionCount; index++) {
    if (stageProgress.quiz[index] !== true) {
      continue;
    }

    const wrongAnswers = stageProgress.wrongAnswers[index] ?? 0;
    if (wrongAnswers === 0) {
      firstTryCount++;
      quizPoints += pointsPerQuestion;
    } else if (wrongAnswers === 1) {
      quizPoints += pointsPerQuestion * 0.5;
    } else {
      quizPoints += pointsPerQuestion * 0.25;
    }
  }

  let codePoints = 0;
  let codeNote = "Not passed yet";
  if (stageProgress.codePassed) {
    if (stageProgress.viewedSolution) {
      codePoints = 10;
      codeNote = "Passed after viewing the solution";
    } else {
      const runs = stageProgress.runs || 1;
      const extraRuns = Math.max(0, runs - 1);
      const hintPenalty = stageProgress.usedHint ? 10 : 0;
      const runPenalty = Math.min(20, extraRuns * 5);
      codePoints = CODE_POINTS - hintPenalty - runPenalty;

      if (stageProgress.runs <= 1) {
        codeNote = "Passed on the first run";
      } else {
        codeNote = `Passed after ${stageProgress.runs} runs`;
      }
      if (stageProgress.usedHint) {
        codeNote += " · used a hint";
      }
    }
  }

  return {
    stage,
    score: Math.round(quizPoints + codePoints),
    firstTryCount,
    questionCount,
    codeNote,
    done: isStageDone(stage, progress),
    stageProgress,
  };
}

/** `topGrade` is the course's own wording for 90% and above in this section. */
export function getGrade(percent: number, topGrade: Grade): Grade {
  if (percent >= 90) {
    return topGrade;
  }

  if (percent >= 75) {
    return {
      title: "Solid Foundation",
      emoji: "💪",
      message:
        "Strong work. A quick review of the stages listed below will make it stick.",
    };
  }

  if (percent >= 60) {
    return {
      title: "Getting There",
      emoji: "🌱",
      message:
        "You have the core ideas. Revisit the weaker stages and redo their challenges.",
    };
  }

  return {
    title: "Keep Practising",
    emoji: "📚",
    message:
      "These ideas take practice. Go back through the stages listed below, and try the challenges again without hints.",
  };
}

/** Bar colour used for scores: green ≥ 90, yellow ≥ 70, orange below. */
export function getStageScoreColor(score: number): string {
  if (score >= 90) {
    return "var(--good)";
  }
  if (score >= 70) {
    return "var(--highlight)";
  }
  return "var(--brand)";
}

/** Ring colour used for the overall score: green ≥ 75, yellow ≥ 60, orange below. */
export function getOverallScoreColor(percent: number): string {
  if (percent >= 75) {
    return "var(--good)";
  }
  if (percent >= 60) {
    return "var(--highlight)";
  }
  return "var(--brand)";
}
