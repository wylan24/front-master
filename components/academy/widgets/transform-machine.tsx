"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout, RowLabel } from "../content";
import { formatValue, sleep } from "@/lib/academy/format";
import { useIsMounted } from "@/lib/academy/use-is-mounted";

const NUMS = [3, 8, 12, 5, 20, 1];
const STEP_DELAY_MILLISECONDS = 500;

type Operation =
  | { label: string; kind: "map"; apply: (n: number) => number }
  | { label: string; kind: "filter"; test: (n: number) => boolean };

const OPERATIONS: Operation[] = [
  { label: "map(n => n * 2)", kind: "map", apply: (n) => n * 2 },
  { label: "map(n => n + 100)", kind: "map", apply: (n) => n + 100 },
  { label: "map(n => n * n)", kind: "map", apply: (n) => n * n },
  { label: "filter(n => n > 7)", kind: "filter", test: (n) => n > 7 },
  { label: "filter(n => n % 2 === 0)", kind: "filter", test: (n) => n % 2 === 0 },
  { label: "filter(n => n < 5)", kind: "filter", test: (n) => n < 5 },
];

export function TransformMachineWidget() {
  const [selectedLabel, setSelectedLabel] = useState(OPERATIONS[0].label);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [keptIndexes, setKeptIndexes] = useState<number[]>([]);
  const [results, setResults] = useState<number[]>([]);
  const [runningKind, setRunningKind] = useState<"map" | "filter" | null>(null);
  const [output, setOutput] = useState<ReactNode>(
    "// choose an operation and press Run"
  );
  const isBusyRef = useRef(false);
  const isMountedRef = useIsMounted();

  async function run() {
    if (isBusyRef.current) {
      return;
    }
    isBusyRef.current = true;

    const operation = OPERATIONS.find((op) => op.label === selectedLabel);
    if (operation === undefined) {
      isBusyRef.current = false;
      return;
    }

    const nextResults: number[] = [];
    const nextKept: number[] = [];
    setRunningKind(operation.kind);

    for (let index = 0; index < NUMS.length; index++) {
      const item = NUMS[index];
      setActiveIndex(index);

      if (operation.kind === "map") {
        const mapped = operation.apply(item);
        nextResults.push(mapped);
        setOutput(`// item ${item} → ${mapped}`);
      } else {
        const passes = operation.test(item);
        if (passes) {
          nextKept.push(index);
          nextResults.push(item);
        }
        setOutput(
          <>
            {`// test ${item} → `}
            {passes ? (
              <>
                <b>true</b> (keep)
              </>
            ) : (
              "false (skip)"
            )}
          </>
        );
      }

      setResults([...nextResults]);
      setKeptIndexes([...nextKept]);
      await sleep(STEP_DELAY_MILLISECONDS);
      if (!isMountedRef.current) {
        return;
      }
    }

    setActiveIndex(NUMS.length);
    setOutput(
      <>
        {`nums.${operation.label}\n→ `}
        <b>{formatValue(nextResults)}</b>
        {`   // length ${nextResults.length} (original still has ${NUMS.length})`}
      </>
    );
    isBusyRef.current = false;
  }

  function getInputCellState(index: number) {
    if (index === activeIndex) {
      return "current" as const;
    }
    const alreadyTested = runningKind === "filter" && activeIndex > index;
    if (alreadyTested) {
      return keptIndexes.includes(index) ? ("match" as const) : ("dim" as const);
    }
    return undefined;
  }

  return (
    <>
      <p>
        Pick an operation and run it. Notice map keeps the length, while filter
        can shrink it.
      </p>
      <Controls>
        {"nums."}
        <NativeSelect
          value={selectedLabel}
          onChange={(event) => setSelectedLabel(event.target.value)}
        >
          {OPERATIONS.map((operation) => (
            <NativeSelectOption key={operation.label}>
              {operation.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        <Button onClick={run}>Run ▶</Button>
      </Controls>
      <RowLabel>nums (original)</RowLabel>
      <ArrayBoxes values={NUMS} getCellState={getInputCellState} />
      <RowLabel>result</RowLabel>
      <ArrayBoxes values={results} getCellState={() => "output"} />
      <Readout>{output}</Readout>
    </>
  );
}
