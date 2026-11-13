import type { Level, Stage } from "@/lib/academy/types";
import { BEGINNER_STAGES } from "./beginner-stages";
import { ADVANCED_STAGES } from "./advanced-stages";

/** Every stage in course order: the beginner course, then the advanced section. */
export const STAGES: Stage[] = [...BEGINNER_STAGES, ...ADVANCED_STAGES];

export const LEVELS: Record<Level, { name: string; title: string }> = {
  basic: { name: "Beginner", title: "Beginner course" },
  adv: { name: "Advanced", title: "Advanced section" },
};
