"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Controls, Tip } from "./content";
import { replayReactCode, runCode, runReactCode, type RunResult } from "@/lib/academy/run-code";
import type { PreviewAction, PreviewNode } from "@/lib/academy/react-runtime";
import { ReactPreview } from "./react-preview";
import { explainError } from "@/lib/academy/format";
import type { StageProgress } from "@/lib/academy/progress";
import type { Exercise, ExtractedValues, TestCheck } from "@/lib/academy/types";

const EDITOR_LINE_HEIGHT_PX = 22.4;
const EDITOR_MIN_HEIGHT_PX = 200;

type ConsoleOutput = {
  lines: string[];
  error: string | null;
};

/** The React preview of the last run, which the learner can click and type in. */
type PreviewSession = {
  /** The code as it was when Run was pressed; interactions replay against it. */
  code: string;
  actions: PreviewAction[];
  tree: PreviewNode[] | null;
};

type CodeExerciseProps = {
  exercise: Exercise;
  stageProgress: StageProgress;
  onDraftChange: (draft: string | null) => void;
  onHintOpened: () => void;
  onSolutionShown: (solution: string) => void;
  onRunStarted: () => void;
  onPassed: () => void;
};

function removeLineComments(code: string): string {
  return code.replace(/\/\/.*$/gm, "");
}

export function CodeExercise({
  exercise,
  stageProgress,
  onDraftChange,
  onHintOpened,
  onSolutionShown,
  onRunStarted,
  onPassed,
}: CodeExerciseProps) {
  const [code, setCode] = useState(stageProgress.draft ?? exercise.starter);
  // Sized once on open so the starter code fits; the learner can drag to resize after.
  const [initialHeight] = useState(() => {
    const lineCount = code.split("\n").length;
    return Math.max(EDITOR_MIN_HEIGHT_PX, (lineCount + 2) * EDITOR_LINE_HEIGHT_PX);
  });
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput | null>(null);
  const [checks, setChecks] = useState<TestCheck[] | null>(null);
  const [failedToRun, setFailedToRun] = useState(false);
  const [previewSession, setPreviewSession] = useState<PreviewSession | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const isReactExercise = exercise.runtime === "react";

  function updateCode(nextCode: string) {
    setCode(nextCode);
    onDraftChange(nextCode);
  }

  function insertTwoSpacesAtCursor(editor: HTMLTextAreaElement) {
    const selectionStart = editor.selectionStart;
    const selectionEnd = editor.selectionEnd;
    const nextCode = code.slice(0, selectionStart) + "  " + code.slice(selectionEnd);
    updateCode(nextCode);

    // Put the cursor after the inserted spaces once React has updated the value.
    requestAnimationFrame(() => {
      editor.selectionStart = selectionStart + 2;
      editor.selectionEnd = selectionStart + 2;
    });
  }

  function handleEditorKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      insertTwoSpacesAtCursor(event.currentTarget);
      return;
    }

    const isRunShortcut = event.key === "Enter" && (event.ctrlKey || event.metaKey);
    if (isRunShortcut) {
      event.preventDefault();
      runAndCheck();
    }
  }

  function toggleHint() {
    setIsHintVisible(!isHintVisible);
    onHintOpened();
  }

  function showSolution() {
    setCode(exercise.solution);
    onSolutionShown(exercise.solution);
  }

  function resetCode() {
    setCode(exercise.starter);
    onDraftChange(null);
    setChecks(null);
    setFailedToRun(false);
    setConsoleOutput(null);
    setPreviewSession(null);
  }

  async function runExerciseCode(): Promise<RunResult> {
    if (!isReactExercise) {
      return runCode(code, exercise.extract);
    }

    const reactResult = await runReactCode(code, exercise.extract);
    if (reactResult.ok) {
      setPreviewSession({ code, actions: [], tree: reactResult.preview });
    } else {
      setPreviewSession(null);
    }
    return reactResult;
  }

  /** Re-runs the last run's code with every preview interaction so far, plus this one. */
  async function handlePreviewAction(action: PreviewAction) {
    if (previewSession === null || isReplaying) {
      return;
    }
    const actions = [...previewSession.actions, action];
    setIsReplaying(true);
    const result = await replayReactCode(previewSession.code, actions);
    setIsReplaying(false);

    if (!result.ok) {
      setConsoleOutput({ lines: result.logs, error: explainError(result.error) });
      return;
    }
    setConsoleOutput({ lines: result.logs, error: null });
    setPreviewSession({
      code: previewSession.code,
      actions,
      tree: result.values as PreviewNode[] | null,
    });
  }

  async function runAndCheck() {
    if (isRunning) {
      return;
    }
    onRunStarted();
    setIsRunning(true);
    setChecks(null);
    setFailedToRun(false);

    const result = await runExerciseCode();
    setIsRunning(false);

    if (!result.ok) {
      setConsoleOutput({ lines: result.logs, error: explainError(result.error) });
      setFailedToRun(true);
      return;
    }
    setConsoleOutput({ lines: result.logs, error: null });

    let values: ExtractedValues = {};
    if (result.values !== null && typeof result.values === "object") {
      values = result.values as ExtractedValues;
    }

    const testResults = exercise.tests(values, removeLineComments(code), result.logs);
    setChecks(testResults);

    const allPassed = testResults.every((testResult) => testResult.passed);
    if (allPassed) {
      onPassed();
    }
  }

  return (
    <>
      <div className="task-box mb-3 rounded-xl bg-brand-soft px-4 py-3">
        {exercise.task}
      </div>
      <Textarea
        variant="code"
        spellCheck={false}
        aria-label="Code editor"
        style={{ height: initialHeight }}
        value={code}
        onChange={(event) => updateCode(event.target.value)}
        onKeyDown={handleEditorKeyDown}
      />
      <Controls>
        <Button variant="brand" onClick={runAndCheck} disabled={isRunning}>
          ▶ Run &amp; check
        </Button>
        <Button variant="outline" onClick={toggleHint}>
          Hint
        </Button>
        <Button variant="outline" onClick={showSolution}>
          Show solution
        </Button>
        <Button variant="outline" onClick={resetCode}>
          Reset code
        </Button>
      </Controls>

      {isHintVisible && <Tip className="mt-[10px] text-[14.5px]">{exercise.hint}</Tip>}

      <ConsolePanel isRunning={isRunning} output={consoleOutput} />

      {isReactExercise && previewSession !== null && (
        <ReactPreview
          tree={previewSession.tree}
          onAction={handlePreviewAction}
          isBusy={isReplaying}
        />
      )}

      <div className="mt-[10px] grid gap-1.5">
        {failedToRun && (
          <CheckRow passed={false} label="Fix the error above, then run again." />
        )}
        {checks &&
          checks.map((testResult, index) => (
            <CheckRow
              key={index}
              passed={testResult.passed}
              label={testResult.label}
            />
          ))}
      </div>
    </>
  );
}

function ConsolePanel({
  isRunning,
  output,
}: {
  isRunning: boolean;
  output: ConsoleOutput | null;
}) {
  let body: ReactNode = "(run your code to see output)";
  if (isRunning) {
    body = "running…";
  } else if (output !== null) {
    const logText = output.lines.length > 0 ? output.lines.join("\n") : "(nothing logged)";
    body = (
      <>
        {logText}
        {output.error && (
          <>
            {"\n"}
            <span className="text-[#ff8f8f]">⚠ {output.error}</span>
          </>
        )}
      </>
    );
  }

  return (
    <div className="mt-[10px] min-h-11 rounded-xl bg-[#2a2723] px-4 py-3 font-mono text-[13.5px] whitespace-pre-wrap text-[#d9d3c5]">
      <span className="mb-1 block text-[11px] tracking-[.1em] text-[#8f897b] uppercase">
        Console
      </span>
      {body}
    </div>
  );
}

function CheckRow({ passed, label }: { passed: boolean; label: string }) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-lg px-3 py-2 text-[14.5px]",
        passed ? "bg-good-soft" : "bg-bad-soft"
      )}
    >
      {passed ? "✓ " : "✗ "}
      {label}
    </div>
  );
}
