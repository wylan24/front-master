import type { TestCheck } from "@/lib/academy/types";
import { check } from "../check";

/** The React-style warnings the course runtime printed (see lib/academy/react-runtime.ts). */
export function getReactWarnings(logs: string[]): string[] {
  const warnings: string[] = [];
  for (const line of logs) {
    if (line.startsWith("Warning:")) {
      warnings.push(line);
    }
  }
  return warnings;
}

export function checkNoReactWarnings(logs: string[]): TestCheck {
  const warnings = getReactWarnings(logs);
  if (warnings.length === 0) {
    return check(true, "React printed no warnings");
  }
  return check(false, "React printed a warning: read it in the console and fix it");
}

/** How many times a pattern appears in the learner's code. */
export function countMatches(code: string, pattern: RegExp): number {
  const globalPattern = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  const matches = code.match(globalPattern);
  if (matches === null) {
    return 0;
  }
  return matches.length;
}

/** Reads a string field from extracted values, or "" when it is missing or not a string. */
export function readText(values: Record<string, unknown>, name: string): string {
  const value = values[name];
  if (typeof value === "string") {
    return value;
  }
  return "";
}

/** Reads a number field from extracted values, or NaN when it is missing or not a number. */
export function readNumber(values: Record<string, unknown>, name: string): number {
  const value = values[name];
  if (typeof value === "number") {
    return value;
  }
  return Number.NaN;
}
