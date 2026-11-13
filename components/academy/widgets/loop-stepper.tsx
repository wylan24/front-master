"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout, VariableChip } from "../content";

const PRICES = [4, 10, 6, 20];
const AUTO_PLAY_DELAY_MILLISECONDS = 850;

const CODE_LINES = [
  "let total = 0;",
  "for (let i = 0; i < prices.length; i++) {",
  "  total = total + prices[i];",
  "}",
  "// done! total = ?",
];

type LoopState = {
  /** Which line of CODE_LINES is highlighted; -1 before the first step. */
  line: number;
  i: number | null;
  total: number | null;
  done: boolean;
  message: ReactNode;
};

const INITIAL_STATE: LoopState = {
  line: -1,
  i: null,
  total: null,
  done: false,
  message: "// press Step to start",
};

/** Advances the simulated loop by one action. */
function getNextState(state: LoopState): LoopState {
  const count = PRICES.length;

  if (state.line === -1) {
    return { ...state, line: 0, total: 0, message: "// total starts at 0" };
  }

  if (state.line === 0) {
    return {
      ...state,
      line: 1,
      i: 0,
      message: (
        <>
          {`// i = 0. Is 0 < ${count}? `}
          <b>yes</b>
          {" → go inside"}
        </>
      ),
    };
  }

  if (state.line === 1) {
    const i = state.i ?? 0;
    const oldTotal = state.total ?? 0;
    const newTotal = oldTotal + PRICES[i];
    return {
      ...state,
      line: 2,
      total: newTotal,
      message: (
        <>
          {`// total = ${oldTotal} + prices[${i}]  →  ${oldTotal} + ${PRICES[i]} = `}
          <b>{newTotal}</b>
        </>
      ),
    };
  }

  if (state.line === 2) {
    const nextI = (state.i ?? 0) + 1;
    const stillInside = nextI < count;
    return {
      ...state,
      line: stillInside ? 1 : 3,
      i: nextI,
      message: (
        <>
          {`// i++ → i = ${nextI}. Is ${nextI} < ${count}? `}
          <b>{stillInside ? "yes" : "no"}</b>
          {stillInside ? " → go inside" : " → leave the loop"}
        </>
      ),
    };
  }

  if (state.line === 3) {
    return {
      ...state,
      line: 4,
      done: true,
      message: (
        <>
          {"// finished. Visited every index. total = "}
          <b>{state.total}</b>
        </>
      ),
    };
  }

  return state;
}

export function LoopStepperWidget() {
  const [state, setState] = useState<LoopState>(INITIAL_STATE);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // While auto-playing, take one step every 850ms until the loop finishes.
  useEffect(() => {
    if (!isAutoPlaying || state.done) {
      return;
    }
    const timeoutId = setTimeout(() => {
      setState((current) => getNextState(current));
    }, AUTO_PLAY_DELAY_MILLISECONDS);
    return () => clearTimeout(timeoutId);
  }, [isAutoPlaying, state]);

  function step() {
    setState(getNextState(state));
  }

  function startAutoPlay() {
    const alreadyPlaying = isAutoPlaying && !state.done;
    if (alreadyPlaying) {
      return;
    }
    const startingState = state.done ? INITIAL_STATE : state;
    setState(getNextState(startingState));
    setIsAutoPlaying(true);
  }

  function reset() {
    setIsAutoPlaying(false);
    setState(INITIAL_STATE);
  }

  function getCellState(index: number) {
    if (state.i === index && !state.done) {
      return "current" as const;
    }
    if (state.i !== null && index < state.i) {
      return "match" as const;
    }
    return undefined;
  }

  return (
    <>
      <p>
        Step through the loop one action at a time and watch <code>i</code>{" "}
        and <code>total</code> change.
      </p>
      <div className="my-[10px] rounded-xl bg-code py-3 font-mono text-[14px] text-code-ink">
        {CODE_LINES.map((codeLine, lineIndex) => (
          <div
            key={lineIndex}
            className={cn(
              "border-l-4 border-transparent px-4 py-px",
              lineIndex === state.line && "border-highlight bg-[#3a352c]"
            )}
          >
            {codeLine}
          </div>
        ))}
      </div>
      <ArrayBoxes values={PRICES} getCellState={getCellState} />
      <div className="my-2 flex flex-wrap gap-[10px]">
        <VariableChip>
          i = <b>{state.i === null ? "–" : state.i}</b>
        </VariableChip>
        <VariableChip>
          total = <b>{state.total === null ? "–" : state.total}</b>
        </VariableChip>
        <VariableChip>
          prices.length = <b>{PRICES.length}</b>
        </VariableChip>
      </div>
      <Controls>
        <Button onClick={step} disabled={state.done}>
          Step ▶
        </Button>
        <Button variant="outline" onClick={startAutoPlay}>
          Auto-play
        </Button>
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </Controls>
      <Readout>{state.message}</Readout>
    </>
  );
}
