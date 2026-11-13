import type { Stage } from "@/lib/academy/types";
import { OBJECT_BEGINNER_STAGES } from "./beginner-stages";
import { OBJECT_INTERMEDIATE_STAGES } from "./intermediate-stages";
import { OBJECT_ADVANCED_STAGES } from "./advanced-stages";

/** Object Academy's stages in course order: beginner, intermediate, then advanced. */
export const OBJECT_ACADEMY_STAGES: Stage[] = [
  ...OBJECT_BEGINNER_STAGES,
  ...OBJECT_INTERMEDIATE_STAGES,
  ...OBJECT_ADVANCED_STAGES,
];
