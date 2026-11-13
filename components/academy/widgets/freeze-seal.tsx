"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ObjectBoxes } from "../object-boxes";
import { Controls, Readout } from "../content";

type Lock = "none" | "sealed" | "frozen";
type Attempt = "add" | "change" | "delete";

type Settings = Record<string, string | number>;

const STARTING_SETTINGS: Settings = { theme: "dark", fontSize: 14 };

const LOCK_LINES: Record<Lock, string> = {
  none: "const settings = { theme: \"dark\", fontSize: 14 };",
  sealed: "Object.seal(settings);",
  frozen: "Object.freeze(settings);",
};

const ATTEMPT_LINES: Record<Attempt, string> = {
  add: 'settings.language = "en";',
  change: "settings.fontSize = 18;",
  delete: "delete settings.theme;",
};

/** Which attempts each lock allows. The rules the lesson teaches, in one table. */
const ALLOWED: Record<Lock, Record<Attempt, boolean>> = {
  none: { add: true, change: true, delete: true },
  sealed: { add: false, change: true, delete: false },
  frozen: { add: false, change: false, delete: false },
};

function applyAttempt(settings: Settings, attempt: Attempt): Settings {
  if (attempt === "add") {
    return { ...settings, language: "en" };
  }
  if (attempt === "change") {
    return { ...settings, fontSize: 18 };
  }
  const remaining = { ...settings };
  delete remaining.theme;
  return remaining;
}

export function FreezeSealWidget() {
  const [lock, setLock] = useState<Lock>("none");
  const [settings, setSettings] = useState<Settings>(STARTING_SETTINGS);
  const [log, setLog] = useState<string[]>([LOCK_LINES.none]);

  function chooseLock(nextLock: Lock) {
    setLock(nextLock);
    setSettings(STARTING_SETTINGS);
    const lines = [LOCK_LINES.none];
    if (nextLock !== "none") {
      lines.push(LOCK_LINES[nextLock]);
    }
    setLog(lines);
  }

  function attempt(kind: Attempt) {
    const isAllowed = ALLOWED[lock][kind];
    if (isAllowed) {
      setSettings(applyAttempt(settings, kind));
      setLog([...log, ATTEMPT_LINES[kind] + "   // ✓ done"]);
      return;
    }
    setLog([
      ...log,
      ATTEMPT_LINES[kind] + `   // ✗ ignored: settings is ${lock}`,
      "// (in strict mode, e.g. inside a class or module, this throws a TypeError)",
    ]);
  }

  return (
    <>
      <p>
        Pick a lock, then try each change. The object below only shows changes
        that actually happened.
      </p>
      <Controls>
        {(["none", "sealed", "frozen"] as Lock[]).map((option) => (
          <Button
            key={option}
            font="mono"
            variant="outline"
            aria-pressed={lock === option}
            className={cn(lock === option && "bg-ink text-paper")}
            onClick={() => chooseLock(option)}
          >
            {option === "none" ? "no lock" : option === "sealed" ? "Object.seal" : "Object.freeze"}
          </Button>
        ))}
      </Controls>
      <Controls>
        <Button font="mono" onClick={() => attempt("add")}>
          add a property
        </Button>
        <Button font="mono" onClick={() => attempt("change")}>
          change a value
        </Button>
        <Button font="mono" onClick={() => attempt("delete")}>
          delete a property
        </Button>
      </Controls>
      <div className="flex flex-wrap gap-2 text-[13px]">
        <Badge variant={lock === "none" ? "info" : "bad"}>
          Object.isSealed → {String(lock !== "none")}
        </Badge>
        <Badge variant={lock === "frozen" ? "bad" : "info"}>
          Object.isFrozen → {String(lock === "frozen")}
        </Badge>
      </div>
      <ObjectBoxes name="settings" entries={Object.entries(settings)} />
      <Readout>{log.join("\n")}</Readout>
    </>
  );
}
