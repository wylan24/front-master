"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Controls, Readout } from "../content";

type Branch = {
  /** null for the final `else`, which has no condition. */
  condition: string | null;
  test: (temperature: number) => boolean;
  message: string;
};

const BRANCHES: Branch[] = [
  { condition: "temp >= 30", test: (t) => t >= 30, message: "Hot: find some shade" },
  { condition: "temp >= 18", test: (t) => t >= 18, message: "Warm: T-shirt weather" },
  { condition: "temp >= 8", test: (t) => t >= 8, message: "Cool: bring a jacket" },
  { condition: null, test: () => true, message: "Cold: wear a coat" },
];

type BranchResult = "true" | "false" | "skipped" | "runs";

/** Checks conditions top to bottom; the first true one runs and the rest are skipped. */
function evaluateBranches(temperature: number): BranchResult[] {
  const results: BranchResult[] = [];
  let alreadyMatched = false;

  for (const branch of BRANCHES) {
    if (alreadyMatched) {
      results.push("skipped");
      continue;
    }
    if (branch.condition === null) {
      results.push("runs");
      alreadyMatched = true;
      continue;
    }
    const passed = branch.test(temperature);
    results.push(passed ? "true" : "false");
    if (passed) {
      alreadyMatched = true;
    }
  }
  return results;
}

const RESULT_LABEL: Record<BranchResult, string> = {
  true: "✓ true, runs",
  false: "✗ false, keep looking",
  skipped: "skipped",
  runs: "nothing matched, so else runs",
};

export function IfElseBranchesWidget() {
  const [temperatureText, setTemperatureText] = useState("21");
  const temperature = Number(temperatureText);
  const isValid = temperatureText.trim() !== "" && !Number.isNaN(temperature);
  const results = isValid ? evaluateBranches(temperature) : [];
  const chosenIndex = results.findIndex((result) => result === "true" || result === "runs");

  return (
    <>
      <p>
        Change the temperature. JavaScript checks each condition from the top,
        runs the <b>first</b> branch that is true, and skips everything after it.
      </p>
      <Controls>
        <span className="font-mono text-[14px]">const temp =</span>
        <Input
          type="number"
          aria-label="Temperature"
          value={temperatureText}
          onChange={(event) => setTemperatureText(event.target.value)}
        />
        <input
          type="range"
          min={-10}
          max={40}
          aria-label="Temperature slider"
          value={isValid ? temperature : 0}
          onChange={(event) => setTemperatureText(event.target.value)}
          className="min-w-0 flex-1 basis-[160px] accent-[var(--brand)]"
        />
      </Controls>
      <div className="my-3 grid gap-1.5 font-mono text-[14px]">
        {BRANCHES.map((branch, index) => {
          let keyword = "} else if";
          if (index === 0) {
            keyword = "if";
          }
          if (branch.condition === null) {
            keyword = "} else";
          }
          const result = results[index];
          return (
            <div
              key={index}
              className={cn(
                "flex flex-wrap items-center justify-between gap-2 rounded-[10px] border-[1.5px] border-border bg-surface px-3 py-2",
                index === chosenIndex && "border-good bg-good-soft",
                result === "skipped" && "opacity-45"
              )}
            >
              <span>
                {keyword}
                {branch.condition !== null && ` (${branch.condition})`}
                {" { "}
                <span className="text-muted-foreground">{`"${branch.message}"`}</span>
                {" }"}
              </span>
              {result && <span className="text-[12.5px] font-semibold">{RESULT_LABEL[result]}</span>}
            </div>
          );
        })}
      </div>
      <Readout>
        {isValid && chosenIndex >= 0 ? (
          <>
            {"// temp is "}
            {temperature}
            {"\n// prints: "}
            <b>{BRANCHES[chosenIndex].message}</b>
          </>
        ) : (
          "// type a number"
        )}
      </Readout>
    </>
  );
}
