import type { Level } from "@/lib/academy/types";
import type { CourseLevelCopy } from "./courses";

/** Array Academy's own wording for the shared stage, results and grade screens. */
export const ARRAY_ACADEMY_LEVEL_COPY: Partial<Record<Level, CourseLevelCopy>> = {
  basic: {
    finishedMessage: "You've finished the beginner course. You know arrays now. 🎉",
    topGrade: {
      title: "Array Master",
      emoji: "🏆",
      message:
        "Excellent. You clearly understand arrays and can use them on your own.",
    },
    nextSteps: (
      <p>
        The <b>advanced section</b> covers find/some/every, slice vs splice,
        sorting, copies vs references, arrays of objects, 2D grids and method
        chaining, ending with a leaderboard challenge.
      </p>
    ),
  },
  adv: {
    finishedMessage: "You've finished the advanced section. Serious array skills. 🚀",
    topGrade: {
      title: "Array Wizard",
      emoji: "🧙",
      message: "Outstanding. You can handle real-world array data confidently.",
    },
    nextSteps: (
      <p>
        Next, try <code>reduce</code> (folding an array into one value),{" "}
        <code>flat</code>/<code>flatMap</code>, <code>Array.from</code>, and the
        non-mutating <code>toSorted</code>/<code>toSpliced</code>. Then practise
        on real API data.
      </p>
    ),
  },
};
