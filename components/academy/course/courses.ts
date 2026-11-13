import type { ReactNode } from "react";
import type { Level, Stage } from "@/lib/academy/types";
import type { Grade } from "@/lib/academy/scoring";
import { STAGES as ARRAY_ACADEMY_STAGES } from "./stages";
import { ARRAY_ACADEMY_LEVEL_COPY } from "./array-academy-copy";
import { OBJECT_ACADEMY_STAGES } from "./object-academy/stages";
import { OBJECT_ACADEMY_LEVEL_COPY } from "./object-academy/copy";
import { JAVASCRIPT_FOUNDATIONS_STAGES } from "./javascript-foundations/stages";
import { JAVASCRIPT_FOUNDATIONS_LEVEL_COPY } from "./javascript-foundations/copy";
import { REACT_FOUNDATIONS_STAGES } from "./react-foundations/stages";
import { REACT_FOUNDATIONS_LEVEL_COPY } from "./react-foundations/copy";

export type CourseDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Beginner to Advanced";

/** Course-specific wording for one section, used by the shared course screens. */
export type CourseLevelCopy = {
  /** Shown on the "Stage complete" banner of the section's final stage. */
  finishedMessage: string;
  /** The results-page grade for scoring 90% or more in this section. */
  topGrade: Grade;
  /**
   * The results-page "next" panel. For every section except the last, this
   * describes the next section (a button to start it is added automatically).
   * For the last section, it says where to go after the course.
   */
  nextSteps: ReactNode;
};

export type Course = {
  /** The URL segment: /course/{slug}. */
  slug: string;
  title: string;
  /** One line shown under the title in the sidebar and on the course card. */
  tagline: string;
  description: string;
  difficulty: CourseDifficulty;
  /** Short text shown in the dark logo chip next to the title. */
  logo: string;
  /**
   * localStorage key for this course's progress.
   * Changing it makes every learner lose their saved progress.
   */
  progressStorageKey: string;
  /** Every stage in course order: beginner, then intermediate (if any), then advanced. */
  stages: Stage[];
  /** One entry for each section the course has. */
  levelCopy: Partial<Record<Level, CourseLevelCopy>>;
};

const ARRAY_ACADEMY: Course = {
  slug: "array-academy",
  title: "Array Academy",
  tagline: "Arrays from zero to advanced, in JavaScript",
  description:
    "Start with what an array is and finish by building a leaderboard. Learn indexes, loops, searching, map and filter, then move on to slice and splice, copies, arrays of objects, 2D grids and method chains.",
  difficulty: "Beginner to Advanced",
  logo: "[ ]",
  // Kept from before courses had their own routes, so saved progress carries over.
  progressStorageKey: "arrayAcademy:v1",
  stages: ARRAY_ACADEMY_STAGES,
  levelCopy: ARRAY_ACADEMY_LEVEL_COPY,
};

const OBJECT_ACADEMY: Course = {
  slug: "object-academy",
  title: "Object Academy",
  tagline: "Objects from zero to advanced, in JavaScript",
  description:
    "Master JavaScript objects, from your first property to prototypes and advanced object manipulation.",
  difficulty: "Beginner to Advanced",
  logo: "{ }",
  progressStorageKey: "objectAcademy:v1",
  stages: OBJECT_ACADEMY_STAGES,
  levelCopy: OBJECT_ACADEMY_LEVEL_COPY,
};

const JAVASCRIPT_FOUNDATIONS: Course = {
  slug: "javascript-foundations",
  title: "JavaScript Foundations",
  tagline: "The core of JavaScript, from your first line of code",
  description:
    "Build a strong JavaScript foundation, from variables and functions to closures and asynchronous programming.",
  difficulty: "Beginner to Advanced",
  logo: "JS",
  progressStorageKey: "javascriptFoundations:v1",
  stages: JAVASCRIPT_FOUNDATIONS_STAGES,
  levelCopy: JAVASCRIPT_FOUNDATIONS_LEVEL_COPY,
};

const REACT_FOUNDATIONS: Course = {
  slug: "react-foundations",
  title: "React Foundations",
  tagline: "Learn to think in React, not just write React",
  description:
    "Go from understanding the problem React solves to building your first interactive app. JSX, components, props, lists, events and state, taught as one idea: the UI is a description of data. You finish by building Shopfront, a searchable catalogue with a cart.",
  difficulty: "Beginner to Advanced",
  logo: "</>",
  progressStorageKey: "reactFoundations:v1",
  stages: REACT_FOUNDATIONS_STAGES,
  levelCopy: REACT_FOUNDATIONS_LEVEL_COPY,
};

/**
 * Every course, in the order they appear on the homepage. JavaScript
 * Foundations comes first because the others assume its basics; React
 * Foundations comes last because it assumes arrays and objects too.
 */
export const COURSES: Course[] = [
  JAVASCRIPT_FOUNDATIONS,
  ARRAY_ACADEMY,
  OBJECT_ACADEMY,
  REACT_FOUNDATIONS,
];

export function findCourseBySlug(slug: string): Course | undefined {
  for (const course of COURSES) {
    if (course.slug === slug) {
      return course;
    }
  }
  return undefined;
}

/** For callers that already know the slug is valid, e.g. after the route checked it. */
export function getCourseBySlug(slug: string): Course {
  const course = findCourseBySlug(slug);
  if (course === undefined) {
    throw new Error(`No course has the slug "${slug}".`);
  }
  return course;
}

export function getLevelCopy(course: Course, level: Level): CourseLevelCopy {
  const copy = course.levelCopy[level];
  if (copy === undefined) {
    throw new Error(`Course "${course.slug}" has stages in "${level}" but no levelCopy for it.`);
  }
  return copy;
}
