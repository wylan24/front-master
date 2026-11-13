import type { ComponentType, ReactNode } from "react";

export type Level = "basic" | "adv";

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
  /** `code` is the learner's code with `//` comments removed. */
  tests: (values: ExtractedValues, code: string) => TestCheck[];
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
