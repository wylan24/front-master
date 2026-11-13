"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Movie = { title: string; rating: number };
type PipelineItem = Movie | string;

const MOVIES: Movie[] = [
  { title: "Arrival", rating: 7.9 },
  { title: "Coco", rating: 8.4 },
  { title: "Up", rating: 8.3 },
  { title: "Cars", rating: 7.2 },
  { title: "Soul", rating: 8.0 },
  { title: "Her", rating: 8.0 },
  { title: "Jaws", rating: 8.1 },
];

// Each step receives the items from the step above it. Steps that read a
// rating skip plain strings, which only appear after the map step.
const STEPS: { code: string; apply: (items: PipelineItem[]) => PipelineItem[] }[] = [
  {
    code: ".filter(m => m.rating >= 8)",
    apply: (items) => items.filter((m) => typeof m !== "string" && m.rating >= 8),
  },
  {
    code: ".sort((a, b) => b.rating - a.rating)",
    apply: (items) =>
      [...items].sort((a, b) => getRating(b) - getRating(a)),
  },
  {
    code: ".slice(0, 3)",
    apply: (items) => items.slice(0, 3),
  },
  {
    code: ".map(m => m.title)",
    apply: (items) => items.map((m) => (typeof m === "string" ? m : m.title)),
  },
];

function getRating(item: PipelineItem): number {
  if (typeof item === "string") {
    return Number.NaN;
  }
  return item.rating;
}

function Chips({ items }: { items: PipelineItem[] }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {items.length === 0 && (
        <span className="text-muted-foreground">[] empty</span>
      )}
      {items.map((item, index) => {
        if (typeof item === "string") {
          return (
            <span
              key={index}
              className="rounded-lg border-[1.5px] border-info bg-info-soft px-[9px] py-1 font-mono text-[13px]"
            >
              &quot;{item}&quot;
            </span>
          );
        }
        return (
          <span
            key={index}
            className="rounded-lg border-[1.5px] border-ink bg-white px-[9px] py-1 font-mono text-[13px]"
          >
            {item.title}{" "}
            <small className="font-semibold text-brand">
              ★{item.rating.toFixed(1)}
            </small>
          </span>
        );
      })}
    </div>
  );
}

function pluralItems(count: number): string {
  return `${count} item${count === 1 ? "" : "s"}`;
}

export function PipelineBuilderWidget() {
  const [enabledSteps, setEnabledSteps] = useState([true, true, true, true]);

  function toggleStep(stepIndex: number, isEnabled: boolean) {
    const next = [...enabledSteps];
    next[stepIndex] = isEnabled;
    setEnabledSteps(next);
  }

  // Run the pipeline, remembering what came out of each enabled step.
  let currentItems: PipelineItem[] = MOVIES;
  const stepOutputs: PipelineItem[][] = [];
  for (let stepIndex = 0; stepIndex < STEPS.length; stepIndex++) {
    if (enabledSteps[stepIndex]) {
      currentItems = STEPS[stepIndex].apply(currentItems);
    }
    stepOutputs.push(currentItems);
  }

  const stepClassName = "my-1.5 border-l-[3px] border-brand py-1.5 pl-[14px]";
  const codeRowClassName =
    "flex cursor-pointer items-center gap-2 font-mono text-[13.5px]";

  return (
    <>
      <p>
        Toggle steps on and off, and watch what flows out of each one. Try
        turning off the sort, or the filter.
      </p>
      <div>
        <div className={stepClassName}>
          <div className={codeRowClassName}>
            movies{" "}
            <span className="text-muted-foreground">
              {`// ${MOVIES.length} items`}
            </span>
          </div>
          <Chips items={MOVIES} />
        </div>

        {STEPS.map((step, stepIndex) => {
          const isEnabled = enabledSteps[stepIndex];
          const output = stepOutputs[stepIndex];

          return (
            <div
              key={step.code}
              className={cn(
                stepClassName,
                !isEnabled && "border-line opacity-55"
              )}
            >
              <label className={codeRowClassName}>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(event) =>
                    toggleStep(stepIndex, event.target.checked)
                  }
                />{" "}
                {step.code}{" "}
                <span className="text-muted-foreground">
                  {isEnabled ? `// → ${pluralItems(output.length)}` : "// skipped"}
                </span>
              </label>
              {isEnabled && <Chips items={output} />}
            </div>
          );
        })}
      </div>
    </>
  );
}
