import type { ComponentType, ReactNode } from "react";

/**
 * A course section. "basic" and "adv" keep their original ids so saved progress
 * still matches; "mid" is the optional Intermediate section between them.
 */
export type Level = "basic" | "mid" | "adv";

export type QuizQuestion = {
  question: ReactNode;
  options: string[];
  answerIndex: number;
  explanation: ReactNode;
};

/**
 * Values pulled out of the learner's code after it runs.
 * A variable that was never declared comes back as the string "__missing__".
 */
export type ExtractedValues = Record<string, unknown>;

export type TestCheck = {
  passed: boolean;
  label: string;
};

export type Exercise = {
  task: ReactNode;
  starter: string;
  /** A JavaScript expression evaluated after the learner's code. */
  extract: string;
  /**
   * `code` is the learner's code with `//` comments removed.
   * `logs` is everything console.log printed, one string per call
   * (optional to use: most exercises only check `values`).
   */
  tests: (values: ExtractedValues, code: string, logs: string[]) => TestCheck[];
  hint: ReactNode;
  solution: string;
};

export type Stage = {
  id: string;
  level: Level;
  part?: string;
  title: string;
  short: string;
  lead: ReactNode;
  lesson: ReactNode;
  widget?: {
    title: string;
    Component: ComponentType;
  };
  quiz: QuizQuestion[];
  exercise: Exercise;
};
