import type { Level } from "@/lib/academy/types";
import type { CourseLevelCopy } from "../courses";

/** React Foundations' own wording for the shared stage, results and grade screens. */
export const REACT_FOUNDATIONS_LEVEL_COPY: Partial<Record<Level, CourseLevelCopy>> = {
  basic: {
    finishedMessage: "You've finished the beginner section. You can describe a page in React now. 🎉",
    topGrade: {
      title: "UI Describer",
      emoji: "🧩",
      message: "Excellent. UI = f(data), JSX and components are firmly in place.",
    },
    nextSteps: (
      <p>
        The <b>intermediate section</b> makes components reusable and
        responsive: props and children, rendering lists with keys, showing
        different UI for different data, and handling clicks, typing and form
        submits. It ends with a product catalogue of your own.
      </p>
    ),
  },
  mid: {
    finishedMessage: "You've finished the intermediate section. Your components take data and respond to users. 💪",
    topGrade: {
      title: "Component Composer",
      emoji: "🛠️",
      message: "Excellent. Props, lists, conditions and events all work together in your hands.",
    },
    nextSteps: (
      <p>
        The <b>advanced section</b> is about state: why components need it,
        how rendering and state snapshots work, updating arrays and objects,
        calculating instead of storing, and lifting state up. It ends with you
        designing and building the whole Shopfront app.
      </p>
    ),
  },
  adv: {
    finishedMessage: "You built Shopfront from a blank file. You think in React now. ⚛️",
    topGrade: {
      title: "React Thinker",
      emoji: "⚛️",
      message:
        "Outstanding. You can turn a design into components, props and the smallest possible state.",
    },
    nextSteps: (
      <p>
        Next is <b>Course 02: React in Practice</b>, which builds on Shopfront:
        effects and fetching real data, forms, sharing state with context, and
        structuring a larger app. Until then, try adding a{" "}
        <b>Remove from cart</b> button and a <b>sort by price</b> option to
        your Shopfront.
      </p>
    ),
  },
};
