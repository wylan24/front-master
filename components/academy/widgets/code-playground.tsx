"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Controls, Readout } from "../content";
import { runCode } from "@/lib/academy/run-code";

export type PlaygroundExample = {
  label: string;
  code: string;
  /** One line explaining what to look for in the output. */
  lookFor?: ReactNode;
};

type CodePlaygroundProps = {
  intro: ReactNode;
  examples: PlaygroundExample[];
  /**
   * How long to keep listening for console.log calls after the code finishes,
   * so timers and promises get to log too. Leave at 0 for ordinary code.
   */
  waitForTimersMilliseconds?: number;
};

type Output = {
  lines: string[];
  error: string | null;
};

const EDITOR_LINE_HEIGHT_PX = 22.4;

function getEditorHeight(code: string): number {
  const lineCount = code.split("\n").length;
  return Math.max(140, (lineCount + 2) * EDITOR_LINE_HEIGHT_PX);
}

/** A small editor with ready-made examples: load one, change it, run it. */
export function CodePlayground({
  intro,
  examples,
  waitForTimersMilliseconds = 0,
}: CodePlaygroundProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [code, setCode] = useState(examples[0].code);
  const [output, setOutput] = useState<Output | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  function loadExample(index: number) {
    setSelectedIndex(index);
    setCode(examples[index].code);
    setOutput(null);
  }

  async function run() {
    setIsRunning(true);
    let waitUntilTimersFinish = "null";
    if (waitForTimersMilliseconds > 0) {
      waitUntilTimersFinish = `new Promise((resolve) => setTimeout(resolve, ${waitForTimersMilliseconds}))`;
    }
    const result = await runCode(code, waitUntilTimersFinish);
    setIsRunning(false);

    if (result.ok) {
      setOutput({ lines: result.logs, error: null });
    } else {
      setOutput({ lines: result.logs, error: result.error });
    }
  }

  const lookFor = examples[selectedIndex].lookFor;

  let outputBody: ReactNode = "// press Run to see the console output";
  if (isRunning) {
    outputBody = "running…";
  } else if (output !== null) {
    const logText = output.lines.length > 0 ? output.lines.join("\n") : "(nothing logged)";
    outputBody = (
      <>
        {logText}
        {output.error && (
          <>
            {"\n"}
            <b>⚠ {output.error}</b>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p>{intro}</p>
      <Controls>
        {examples.map((example, index) => (
          <Button
            key={example.label}
            variant="outline"
            className={cn(index === selectedIndex && "bg-ink text-paper")}
            aria-pressed={index === selectedIndex}
            onClick={() => loadExample(index)}
          >
            {example.label}
          </Button>
        ))}
      </Controls>
      {lookFor && <p className="text-[14.5px] text-muted-foreground">👀 {lookFor}</p>}
      <Textarea
        key={selectedIndex}
        variant="code"
        spellCheck={false}
        aria-label="Playground editor"
        style={{ height: getEditorHeight(examples[selectedIndex].code) }}
        className="min-h-0"
        value={code}
        onChange={(event) => setCode(event.target.value)}
      />
      <Controls>
        <Button variant="brand" onClick={run} disabled={isRunning}>
          ▶ Run
        </Button>
        <Button variant="outline" onClick={() => loadExample(selectedIndex)}>
          Reset example
        </Button>
      </Controls>
      <Readout>{outputBody}</Readout>
    </>
  );
}
