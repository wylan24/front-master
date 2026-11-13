"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout, VariableChip } from "../content";
import { formatValue } from "@/lib/academy/format";

/**
 * How `b` was created:
 * - "none":      b doesn't exist yet
 * - "reference": `const b = a` (one array, two names)
 * - "copy":      `const b = [...a]` (two separate arrays)
 */
type BMode = "none" | "reference" | "copy";

type DemoState = {
  mode: BMode;
  a: number[];
  /** Only meaningful when mode is "copy"; with "reference", b is a. */
  bCopy: number[];
  log: string[];
};

const INITIAL_STATE: DemoState = {
  mode: "none",
  a: [1, 2, 3],
  bCopy: [],
  log: ["const a = [1, 2, 3];"],
};

function ArrayRow({
  name,
  arrayNumber,
  values,
  isShared,
}: {
  name: string;
  arrayNumber: number;
  values: number[];
  isShared: boolean;
}) {
  return (
    <div className="my-1.5 flex flex-wrap items-center gap-4">
      <div className="min-w-[170px]">
        <VariableChip>
          <b>{name}</b>
        </VariableChip>{" "}
        →{" "}
        <Badge variant={arrayNumber === 1 ? "good" : "info"}>
          array #{arrayNumber}
        </Badge>
      </div>
      <div>
        <ArrayBoxes
          values={values}
          getCellState={() => (isShared ? "current" : undefined)}
        />
      </div>
    </div>
  );
}

export function SameOrCopyWidget() {
  const [state, setState] = useState<DemoState>(INITIAL_STATE);

  const hasB = state.mode !== "none";
  const isShared = state.mode === "reference";
  const bValues = isShared ? state.a : state.bCopy;

  function createReference() {
    setState({
      ...state,
      mode: "reference",
      log: [...state.log, "const b = a;"],
    });
  }

  function createCopy() {
    setState({
      ...state,
      mode: "copy",
      bCopy: [...state.a],
      log: [...state.log, "const b = [...a];"],
    });
  }

  /** Applies a change to b. When b is a reference, a changes too. */
  function changeB(change: (values: number[]) => number[], codeLine: string) {
    let nextA = state.a;
    let nextBCopy = state.bCopy;
    if (isShared) {
      nextA = change(state.a);
    } else {
      nextBCopy = change(state.bCopy);
    }
    setState({
      ...state,
      a: nextA,
      bCopy: nextBCopy,
      log: [...state.log, `${codeLine}   // a is now ${formatValue(nextA)}`],
    });
  }

  function pushFour() {
    changeB((values) => [...values, 4], "b.push(4);");
  }

  function setFirstTo99() {
    changeB((values) => {
      const updated = [...values];
      updated[0] = 99;
      return updated;
    }, "b[0] = 99;");
  }

  return (
    <>
      <p>
        First create <code>b</code> one of two ways, then change it and look at{" "}
        <code>a</code>.
      </p>
      <Controls>
        <Button font="mono" onClick={createReference} disabled={hasB}>
          const b = a
        </Button>
        <Button font="mono" onClick={createCopy} disabled={hasB}>
          const b = [...a]
        </Button>
        <Button variant="brand" onClick={() => setState(INITIAL_STATE)}>
          Reset
        </Button>
      </Controls>
      <Controls>
        <Button font="mono" variant="outline" onClick={pushFour} disabled={!hasB}>
          b.push(4)
        </Button>
        <Button
          font="mono"
          variant="outline"
          onClick={setFirstTo99}
          disabled={!hasB}
        >
          b[0] = 99
        </Button>
      </Controls>
      <div>
        <ArrayRow name="a" arrayNumber={1} values={state.a} isShared={isShared} />
        {hasB && (
          <ArrayRow
            name="b"
            arrayNumber={isShared ? 1 : 2}
            values={bValues}
            isShared={isShared}
          />
        )}
      </div>
      <Readout>
        {state.log.join("\n")}
        {hasB && (
          <>
            {"\n// a === b → "}
            <b>{String(isShared)}</b>
            {isShared ? "  (one array, two names)" : "  (two separate arrays)"}
          </>
        )}
      </Readout>
    </>
  );
}
