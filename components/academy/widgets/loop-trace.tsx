"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Controls, Readout, VariableChip } from "../content";

/** The four moments of a for loop, in the order JavaScript runs them. */
type Phase = "start" | "check" | "body" | "update" | "finished";

type TraceState = {
  phase: Phase;
  i: number;
  output: string[];
  /** Result of the most recent condition check. */
  lastCheck: boolean | null;
};

const MAX_ITERATIONS = 12;

const PHASE_EXPLANATION: Record<Phase, string> = {
  start: "Runs once, before anything else: create i.",
  check: "Before every lap: is the condition still true?",
  body: "The condition was true, so the body runs.",
  update: "After the body: change i, then go back to the check.",
  finished: "The condition was false, so the loop is over.",
};

function parseWholeNumber(text: string, fallback: number): number {
  const value = parseInt(text, 10);
  return Number.isNaN(value) ? fallback : value;
}

export function LoopTraceWidget() {
  const [startText, setStartText] = useState("0");
  const [endText, setEndText] = useState("3");
  const [stepText, setStepText] = useState("1");
  const [trace, setTrace] = useState<TraceState | null>(null);

  const start = parseWholeNumber(startText, 0);
  const end = parseWholeNumber(endText, 3);
  // A step below 1 would never finish, so the demo doesn't allow it.
  const step = Math.max(1, parseWholeNumber(stepText, 1));

  function restart() {
    setTrace(null);
  }

  function advance() {
    if (trace === null) {
      setTrace({ phase: "start", i: start, output: [], lastCheck: null });
      return;
    }
    if (trace.phase === "finished") {
      return;
    }
    if (trace.phase === "start" || trace.phase === "update") {
      const passes = trace.i < end && trace.output.length < MAX_ITERATIONS;
      setTrace({ ...trace, phase: passes ? "check" : "finished", lastCheck: passes });
      return;
    }
    if (trace.phase === "check") {
      setTrace({ ...trace, phase: "body", output: [...trace.output, `lap ${trace.i}`] });
      return;
    }
    // phase === "body"
    setTrace({ ...trace, phase: "update", i: trace.i + step });
  }

  const phase = trace?.phase ?? null;
  const code = [
    { part: "start" as Phase, text: `for (let i = ${start};` },
    { part: "check" as Phase, text: ` i < ${end};` },
    { part: "update" as Phase, text: ` i += ${step}) {` },
  ];

  return (
    <>
      <p>
        Set up a loop, then press <b>Step</b> to walk through it one moment at
        a time. Notice the check happens <b>before</b> every lap, including the
        last one that fails.
      </p>
      <Controls>
        <span className="font-mono text-[14px]">start</span>
        <Input type="number" aria-label="Start" value={startText} onChange={(event) => { setStartText(event.target.value); restart(); }} />
        <span className="font-mono text-[14px]">stop before</span>
        <Input type="number" aria-label="Stop before" value={endText} onChange={(event) => { setEndText(event.target.value); restart(); }} />
        <span className="font-mono text-[14px]">step</span>
        <Input type="number" aria-label="Step" min={1} value={stepText} onChange={(event) => { setStepText(event.target.value); restart(); }} />
      </Controls>
      <div className="my-3 rounded-xl bg-code px-4 py-[14px] font-mono text-[14px] leading-[1.8] text-code-ink">
        <div>
          {code.map((piece) => (
            <span
              key={piece.part}
              className={cn(
                "rounded px-0.5",
                phase === piece.part && "bg-highlight text-highlight-ink",
                phase === "finished" && piece.part === "check" && "bg-bad text-white"
              )}
            >
              {piece.text}
            </span>
          ))}
        </div>
        <div className={cn("pl-6", phase === "body" && "rounded bg-highlight text-highlight-ink")}>
          {"console.log(`lap ${i}`);"}
        </div>
        <div>{"}"}</div>
      </div>
      <Controls>
        <Button variant="brand" onClick={advance} disabled={phase === "finished"}>
          {trace === null ? "Start" : "Step"}
        </Button>
        <Button variant="outline" onClick={restart}>
          Reset
        </Button>
        {trace !== null && (
          <VariableChip>
            i = <b>{trace.i}</b>
          </VariableChip>
        )}
        {trace !== null && (trace.phase === "check" || trace.phase === "finished") && (
          <VariableChip>
            {trace.i} &lt; {end} → <b>{String(trace.lastCheck)}</b>
          </VariableChip>
        )}
      </Controls>
      <p className="text-[14.5px] text-muted-foreground">
        {phase === null ? "Press Start." : PHASE_EXPLANATION[phase]}
      </p>
      <Readout>
        {trace === null || trace.output.length === 0 ? "// console output appears here" : trace.output.join("\n")}
      </Readout>
    </>
  );
}
