"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Controls, Readout } from "../content";
import { ReactPreview } from "../react-preview";
import { compileJsx } from "@/lib/academy/jsx";
import { explainError } from "@/lib/academy/format";
import { replayReactCode, runReactCode } from "@/lib/academy/run-code";
import type { PreviewAction, PreviewNode } from "@/lib/academy/react-runtime";

export type ReactExample = {
  label: string;
  code: string;
  /** One line explaining what to look for, or what to try changing. */
  lookFor?: ReactNode;
};

type ReactPlaygroundProps = {
  intro: ReactNode;
  examples: ReactExample[];
  /** Adds a button that shows the plain JavaScript the JSX turns into. */
  canShowCompiled?: boolean;
};

type RunState = {
  /** The code as it was when Run was pressed; preview interactions replay against it. */
  code: string;
  actions: PreviewAction[];
  tree: PreviewNode[] | null;
  logs: string[];
  error: string | null;
};

const EDITOR_LINE_HEIGHT_PX = 22.4;

function getEditorHeight(code: string): number {
  const lineCount = code.split("\n").length;
  return Math.max(140, (lineCount + 2) * EDITOR_LINE_HEIGHT_PX);
}

function compileForDisplay(code: string): string {
  try {
    return compileJsx(code).trim();
  } catch (error) {
    return error instanceof Error ? error.name + ": " + error.message : String(error);
  }
}

/** An editor with ready-made React examples: run one, use the preview, change the code. */
export function ReactPlayground({ intro, examples, canShowCompiled = false }: ReactPlaygroundProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [code, setCode] = useState(examples[0].code);
  const [runState, setRunState] = useState<RunState | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [compiledCode, setCompiledCode] = useState<string | null>(null);

  function loadExample(index: number) {
    setSelectedIndex(index);
    setCode(examples[index].code);
    setRunState(null);
    setCompiledCode(null);
  }

  async function run() {
    setIsBusy(true);
    const result = await runReactCode(code, "null");
    setIsBusy(false);

    if (result.ok) {
      setRunState({ code, actions: [], tree: result.preview, logs: result.logs, error: null });
    } else {
      setRunState({ code, actions: [], tree: null, logs: result.logs, error: explainError(result.error) });
    }
  }

  async function handlePreviewAction(action: PreviewAction) {
    if (runState === null || isBusy) {
      return;
    }
    const actions = [...runState.actions, action];
    setIsBusy(true);
    const result = await replayReactCode(runState.code, actions);
    setIsBusy(false);

    if (result.ok) {
      const tree = result.values as PreviewNode[] | null;
      setRunState({ code: runState.code, actions, tree, logs: result.logs, error: null });
    } else {
      setRunState({ ...runState, logs: result.logs, error: explainError(result.error) });
    }
  }

  function toggleCompiled() {
    if (compiledCode === null) {
      setCompiledCode(compileForDisplay(code));
    } else {
      setCompiledCode(null);
    }
  }

  const lookFor = examples[selectedIndex].lookFor;
  const hasRunWithoutError = runState !== null && runState.error === null;

  let consoleBody: ReactNode = "// press Run to see the preview and console";
  if (isBusy && runState === null) {
    consoleBody = "running…";
  } else if (runState !== null) {
    const logText = runState.logs.length > 0 ? runState.logs.join("\n") : "(nothing logged)";
    consoleBody = (
      <>
        {logText}
        {runState.error && (
          <>
            {"\n"}
            <b>⚠ {runState.error}</b>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p>{intro}</p>
      {examples.length > 1 && (
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
      )}
      {lookFor && <p className="text-[14.5px] text-muted-foreground">👀 {lookFor}</p>}
      <Textarea
        key={selectedIndex}
        variant="code"
        spellCheck={false}
        aria-label="React playground editor"
        style={{ height: getEditorHeight(examples[selectedIndex].code) }}
        className="min-h-0"
        value={code}
        onChange={(event) => setCode(event.target.value)}
      />
      <Controls>
        <Button variant="brand" onClick={run} disabled={isBusy}>
          ▶ Run
        </Button>
        <Button variant="outline" onClick={() => loadExample(selectedIndex)}>
          Reset example
        </Button>
        {canShowCompiled && (
          <Button variant="outline" onClick={toggleCompiled} aria-pressed={compiledCode !== null}>
            {compiledCode === null ? "Show the JavaScript" : "Hide the JavaScript"}
          </Button>
        )}
      </Controls>
      {compiledCode !== null && (
        <>
          <p className="mb-1 text-[14px] text-muted-foreground">
            What your JSX becomes before it runs:
          </p>
          <Readout>{compiledCode}</Readout>
        </>
      )}
      {hasRunWithoutError && (
        <ReactPreview tree={runState.tree} onAction={handlePreviewAction} isBusy={isBusy} />
      )}
      <div className="mt-[10px]">
        <Readout>{consoleBody}</Readout>
      </div>
    </>
  );
}
