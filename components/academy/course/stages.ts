import type { Stage } from "@/lib/academy/types";
import { BEGINNER_STAGES } from "./beginner-stages";
import { ADVANCED_STAGES } from "./advanced-stages";

/** Array Academy's stages in course order: the beginner course, then the advanced section. */
export const STAGES: Stage[] = [...BEGINNER_STAGES, ...ADVANCED_STAGES];
