"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controls, Readout } from "../content";

const PROGRAM = [
  'console.log("A: start");',
  "",
  "setTimeout(() => {",
  '  console.log("D: timer");',
  "}, 0);",
  "",
  "Promise.resolve().then(() => {",
  '  console.log("C: promise");',
  "});",
  "",
  'console.log("B: end");',
];

type Step = {
  /** Highlighted lines in PROGRAM. */
  lines: number[];
  stack: string[];
  microtasks: string[];
  timers: string[];
  output: string[];
  note: string;
};

// Hand-written to match the program above, which really logs A, B, C, D.
const STEPS: Step[] = [
  { lines: [0], stack: ["script"], microtasks: [], timers: [], output: ["A: start"], note: "The script runs top to bottom. The first log happens straight away." },
  { lines: [2, 3, 4], stack: ["script"], microtasks: [], timers: ["log D"], output: ["A: start"], note: "setTimeout doesn't run its function. It hands it to the browser's timer and moves on. Even with 0 ms, the callback must wait in the task queue." },
  { lines: [6, 7, 8], stack: ["script"], microtasks: ["log C"], timers: ["log D"], output: ["A: start"], note: "The promise is already resolved, so its .then callback joins the microtask queue. It still waits for the current script to finish." },
  { lines: [10], stack: ["script"], microtasks: ["log C"], timers: ["log D"], output: ["A: start", "B: end"], note: "The last line runs. Both callbacks are still waiting; nothing interrupts running code." },
  { lines: [], stack: [], microtasks: ["log C"], timers: ["log D"], output: ["A: start", "B: end"], note: "The script is done and the call stack is empty. Now the event loop looks at the queues, and microtasks always go first." },
  { lines: [7], stack: ["promise callback"], microtasks: [], timers: ["log D"], output: ["A: start", "B: end", "C: promise"], note: "The promise callback runs. Every waiting microtask runs before any timer." },
  { lines: [3], stack: ["timer callback"], microtasks: [], timers: [], output: ["A: start", "B: end", "C: promise", "D: timer"], note: "Only now does the timer's callback get its turn, even though its delay was 0." },
  { lines: [], stack: [], microtasks: [], timers: [], output: ["A: start", "B: end", "C: promise", "D: timer"], note: "Everything has run: A, B, C, D. Synchronous code first, then microtasks, then tasks." },
];

function Lane({ title, items, tone }: { title: string; items: string[]; tone: "stack" | "micro" | "task" }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[12px] text-muted-foreground">{title}</div>
      <div className="flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-line p-1.5">
        {items.length === 0 && <span className="px-1 font-mono text-[12.5px] text-muted-foreground">empty</span>}
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              "animate-pop rounded-lg border-2 border-ink px-2 py-1 font-mono text-[12.5px]",
              tone === "stack" && "bg-highlight text-highlight-ink",
              tone === "micro" && "bg-good-soft",
              tone === "task" && "bg-info-soft"
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function EventLoopWidget() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const output = step.output;

  return (
    <>
      <p>
        Before you step, predict the order of the four logs. Then watch where
        each callback waits.
      </p>
      <div className="grid gap-3 min-[700px]:grid-cols-[1.1fr_1fr]">
        <pre className="m-0 overflow-auto rounded-xl bg-code px-4 py-[14px] font-mono text-[13.5px] leading-[1.6] text-code-ink">
          {PROGRAM.map((text, index) => (
            <div key={index} className={cn("rounded px-1", step.lines.includes(index) && "bg-highlight text-highlight-ink")}>
              {text === "" ? " " : text}
            </div>
          ))}
        </pre>
        <div className="grid content-start gap-2">
          <Lane title="call stack (running now)" items={step.stack} tone="stack" />
          <Lane title="microtask queue (promises)" items={step.microtasks} tone="micro" />
          <Lane title="task queue (timers)" items={step.timers} tone="task" />
        </div>
      </div>
      <p className="mt-3 text-[14.5px]">{step.note}</p>
      <Controls>
        <Button variant="outline" disabled={stepIndex === 0} onClick={() => setStepIndex(stepIndex - 1)}>
          ← Back
        </Button>
        <Button variant="brand" disabled={stepIndex === STEPS.length - 1} onClick={() => setStepIndex(stepIndex + 1)}>
          Step →
        </Button>
        <Button variant="outline" onClick={() => setStepIndex(0)}>
          Restart
        </Button>
        <span className="text-[13px] text-muted-foreground">
          step {stepIndex + 1} of {STEPS.length}
        </span>
      </Controls>
      <Readout>{output.join("\n")}</Readout>
    </>
  );
}
