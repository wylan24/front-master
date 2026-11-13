import type { Level } from "@/lib/academy/types";

/** Display names shared by every course. */
export const LEVELS: Record<Level, { name: string; title: string }> = {
  basic: { name: "Beginner", title: "Beginner course" },
  mid: { name: "Intermediate", title: "Intermediate section" },
  adv: { name: "Advanced", title: "Advanced section" },
};
