import type { TestCheck } from "@/lib/academy/types";

/** One line in an exercise's checklist. */
export function check(passed: boolean, label: string): TestCheck {
  return { passed, label };
}

/** True for `{ ... }` objects, false for arrays, null and everything else. */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
