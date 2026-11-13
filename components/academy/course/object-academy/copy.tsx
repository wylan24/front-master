import type { Level } from "@/lib/academy/types";
import type { CourseLevelCopy } from "../courses";

/** Object Academy's own wording for the shared stage, results and grade screens. */
export const OBJECT_ACADEMY_LEVEL_COPY: Partial<Record<Level, CourseLevelCopy>> = {
  basic: {
    finishedMessage: "You've finished the beginner course. Objects make sense now. 🎉",
    topGrade: {
      title: "Object Master",
      emoji: "🏆",
      message: "Excellent. You can model real things as objects and work with their properties confidently.",
    },
    nextSteps: (
      <p>
        The <b>intermediate section</b> adds behaviour and modern syntax:
        methods and <code>this</code>, <code>Object.keys</code>/
        <code>entries</code>, shorthand and computed keys, destructuring,
        optional chaining, spread, <code>Object.assign</code> and checking
        properties, ending with a profile-updater challenge.
      </p>
    ),
  },
  mid: {
    finishedMessage: "You've finished the intermediate section. That's modern, everyday object code. 💪",
    topGrade: {
      title: "Object Pro",
      emoji: "💼",
      message: "Excellent. You write object code the way modern JavaScript projects do.",
    },
    nextSteps: (
      <p>
        The <b>advanced section</b> goes under the hood: references and
        mutation, shallow vs deep copies, <code>structuredClone</code>,
        property descriptors and getters, <code>freeze</code>/
        <code>seal</code>, and prototypes, ending with a tamper-proof snapshot
        store.
      </p>
    ),
  },
  adv: {
    finishedMessage: "You've finished the advanced section. You understand how objects really work. 🚀",
    topGrade: {
      title: "Object Wizard",
      emoji: "🧙",
      message: "Outstanding. You understand references, copying and inheritance, the parts most developers find tricky.",
    },
    nextSteps: (
      <p>
        Next, explore <code>Map</code> and <code>Set</code> (when keys
        aren&apos;t strings), <code>class</code> syntax with private{" "}
        <code>#fields</code>, and immutable update patterns in a UI library
        such as React. Then practise reshaping real JSON from a public API.
      </p>
    ),
  },
};
