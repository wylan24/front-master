import type { Level } from "@/lib/academy/types";
import type { CourseLevelCopy } from "../courses";

/** JavaScript Foundations' own wording for the shared stage, results and grade screens. */
export const JAVASCRIPT_FOUNDATIONS_LEVEL_COPY: Partial<Record<Level, CourseLevelCopy>> = {
  basic: {
    finishedMessage: "You've finished the beginner course. You can write real JavaScript now. 🎉",
    topGrade: {
      title: "Solid Starter",
      emoji: "🧱",
      message: "Excellent. Values, variables, operators and decisions are firmly in place.",
    },
    nextSteps: (
      <p>
        The <b>intermediate section</b> is about controlling your code: loops,
        functions, parameters and return values, scope, arrow functions,
        callbacks and error handling, ending with a retry helper of your own.
      </p>
    ),
  },
  mid: {
    finishedMessage: "You've finished the intermediate section. You can organise real programs now. 💪",
    topGrade: {
      title: "Function Fluent",
      emoji: "🛠️",
      message: "Excellent. You can break problems into functions and keep them under control.",
    },
    nextSteps: (
      <p>
        The <b>advanced section</b> explains how JavaScript really behaves:
        truthy and falsy values, <code>null</code> vs <code>undefined</code>,{" "}
        <code>==</code> vs <code>===</code>, hoisting, the call stack, closures,
        the event loop, and promises with <code>async</code>/<code>await</code>.
      </p>
    ),
  },
  adv: {
    finishedMessage: "You've finished the advanced section. You know how JavaScript works under the hood. 🚀",
    topGrade: {
      title: "Under-the-Hood Expert",
      emoji: "🧠",
      message: "Outstanding. Closures, the call stack and async code are the parts most learners find hardest.",
    },
    nextSteps: (
      <p>
        You have the foundations. Next, take <b>Array Academy</b> to master
        lists of data, then <b>Object Academy</b> for objects, copying and
        prototypes. After that, try calling a real API with{" "}
        <code>fetch</code> and <code>await</code>.
      </p>
    ),
  },
};
