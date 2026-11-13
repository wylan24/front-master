import type { Stage } from "@/lib/academy/types";
import { REACT_BEGINNER_STAGES } from "./beginner-stages";
import { REACT_INTERMEDIATE_STAGES } from "./intermediate-stages";
import { REACT_ADVANCED_STAGES } from "./advanced-stages";

/**
 * React Foundations' stages in course order: beginner, intermediate, then
 * advanced. Each course module is a "part", shown as a heading in the sidebar.
 */
export const REACT_FOUNDATIONS_STAGES: Stage[] = [
  ...REACT_BEGINNER_STAGES,
  ...REACT_INTERMEDIATE_STAGES,
  ...REACT_ADVANCED_STAGES,
];
