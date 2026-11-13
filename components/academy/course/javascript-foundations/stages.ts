import type { Stage } from "@/lib/academy/types";
import { FOUNDATIONS_BEGINNER_STAGES } from "./beginner-stages";
import { FOUNDATIONS_INTERMEDIATE_STAGES } from "./intermediate-stages";
import { FOUNDATIONS_ADVANCED_STAGES } from "./advanced-stages";

/** JavaScript Foundations' stages in course order: beginner, intermediate, then advanced. */
export const JAVASCRIPT_FOUNDATIONS_STAGES: Stage[] = [
  ...FOUNDATIONS_BEGINNER_STAGES,
  ...FOUNDATIONS_INTERMEDIATE_STAGES,
  ...FOUNDATIONS_ADVANCED_STAGES,
];
