"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controls, Readout } from "../content";

const PROGRAM = [
  "function shout(text) {",
  '  return text.toUpperCase() + "!";',
  "}",
  "",
  "function makeGreeting(name) {",
  '  return "Hello, " + shout(name);',
  "}",
  "",
  "function greet(name) {",
  "  const message = makeGreeting(name);",
  "  console.log(message);",
  "}",
  "",
  'greet("ada");',
  'console.log("done");',
];

type Step = {
  /** 0-based line in PROGRAM that is running. */
  line: number;
  /** Bottom of the stack first. Each frame shows its local variables. */
  stack: string[];
  note: string;
  output: string[];
};

// Written out by hand so each step can explain itself. It follows the
// program above exactly: JavaScript only ever runs the frame on top.
const STEPS: Step[] = [
  { line: 13, stack: ["global"], note: "The script starts in the global context. It reaches greet(\"ada\") and calls it.", output: [] },
  { line: 9, stack: ["global", 'greet  name = "ada"'], note: "Calling greet pushes a new frame. greet has its own name variable.", output: [] },
  { line: 5, stack: ["global", 'greet  name = "ada"', 'makeGreeting  name = "ada"'], note: "greet needs makeGreeting, so another frame goes on top. greet waits, paused mid-line.", output: [] },
  { line: 1, stack: ["global", 'greet  name = "ada"', 'makeGreeting  name = "ada"', 'shout  text = "ada"'], note: "makeGreeting calls shout. Three functions are now waiting on the one at the top.", output: [] },
  { line: 5, stack: ["global", 'greet  name = "ada"', 'makeGreeting  name = "ada"'], note: 'shout returns "ADA!" and its frame is popped off. makeGreeting carries on with that value.', output: [] },
  { line: 9, stack: ["global", 'greet  name = "ada", message = "Hello, ADA!"'], note: "makeGreeting returns and is popped. greet stores the result in message.", output: [] },
  { line: 10, stack: ["global", 'greet  name = "ada", message = "Hello, ADA!"'], note: "greet logs the message. (console.log briefly gets its own frame too.)", output: ["Hello, ADA!"] },
  { line: 14, stack: ["global"], note: "greet reaches its end and is popped. Back in global, the next line runs.", output: ["Hello, ADA!", "done"] },
  { line: -1, stack: [], note: "The script is finished and the stack is empty.", output: ["Hello, ADA!", "done"] },
];

export function CallStackWidget() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <>
      <p>
        Step through the program. Each function call adds a frame to the top of
        the stack; each return removes it. Only the top frame ever runs.
      </p>
      <div className="grid gap-3 min-[700px]:grid-cols-[1.3fr_1fr]">
        <pre className="m-0 overflow-auto rounded-xl bg-code px-4 py-[14px] font-mono text-[13.5px] leading-[1.6] text-code-ink">
          {PROGRAM.map((text, index) => (
            <div
              key={index}
              className={cn("rounded px-1", index === step.line && "bg-highlight text-highlight-ink")}
            >
              {text === "" ? " " : text}
            </div>
          ))}
        </pre>
        <div>
          <div className="mb-1 font-mono text-[12.5px] text-muted-foreground">call stack (top is running)</div>
          <div className="flex min-h-[180px] flex-col-reverse justify-start gap-1.5 rounded-xl border-[1.5px] border-dashed border-line p-2">
            {step.stack.length === 0 && (
              <div className="py-6 text-center font-mono text-[13px] text-muted-foreground">empty</div>
            )}
            {step.stack.map((frame, index) => {
              const isTop = index === step.stack.length - 1;
              return (
                <div
                  key={frame.split(" ")[0] + index}
                  className={cn(
                    "animate-pop rounded-[10px] border-[2px] border-ink bg-surface px-3 py-1.5 font-mono text-[13px]",
                    isTop && "bg-highlight text-highlight-ink"
                  )}
                >
                  {frame}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[14.5px]">{step.note}</p>
      <Controls>
        <Button variant="outline" disabled={stepIndex === 0} onClick={() => setStepIndex(stepIndex - 1)}>
          ← Back
        </Button>
        <Button variant="brand" disabled={isLast} onClick={() => setStepIndex(stepIndex + 1)}>
          Step →
        </Button>
        <Button variant="outline" onClick={() => setStepIndex(0)}>
          Restart
        </Button>
        <span className="text-[13px] text-muted-foreground">
          step {stepIndex + 1} of {STEPS.length}
        </span>
      </Controls>
      <Readout>{step.output.length === 0 ? "// console output appears here" : step.output.join("\n")}</Readout>
    </>
  );
}
