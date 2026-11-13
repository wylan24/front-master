import { useSyncExternalStore } from "react";
import { parseProgress, readStoredProgressText, type Progress } from "./progress";

// Marks "not read yet": the server and the first hydration render can't see localStorage.
const NOT_READ_YET = undefined;

function subscribeToOtherTabs(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * A course's saved progress, kept current, or null before it can be read.
 *
 * React re-reads it whenever a page is shown again (Next keeps visited pages
 * alive while hidden), so finishing a stage and coming back updates the
 * display. The "storage" event covers progress made in another tab.
 */
export function useStoredProgress(storageKey: string): Progress | null {
  const storedText = useSyncExternalStore(
    subscribeToOtherTabs,
    () => readStoredProgressText(storageKey),
    () => NOT_READ_YET
  );

  if (storedText === NOT_READ_YET) {
    return null;
  }
  return parseProgress(storedText);
}

/**
 * Saved progress for several courses at once, in the same order as the keys,
 * or null before it can be read. The snapshot is one string, so React can
 * tell cheaply whether anything changed.
 */
export function useStoredProgressForCourses(storageKeys: string[]): Progress[] | null {
  const storedTexts = useSyncExternalStore(
    subscribeToOtherTabs,
    () => JSON.stringify(storageKeys.map((key) => readStoredProgressText(key))),
    () => NOT_READ_YET
  );

  if (storedTexts === NOT_READ_YET) {
    return null;
  }

  const texts = JSON.parse(storedTexts) as (string | null)[];
  const progressList: Progress[] = [];
  for (const text of texts) {
    progressList.push(parseProgress(text));
  }
  return progressList;
}
