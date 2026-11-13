"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout, RowLabel } from "../content";
import { formatValue, isSameValue } from "@/lib/academy/format";

const STARTING_NUMS = [10, 1, 5, 40, 3];

// Each operation works on (and may change) the array it is given, like the real methods.
const OPERATIONS: { label: string; run: (nums: number[]) => number[] }[] = [
  { label: "slice(1, 3)", run: (nums) => nums.slice(1, 3) },
  { label: "slice(-2)", run: (nums) => nums.slice(-2) },
  { label: "splice(1, 2)", run: (nums) => nums.splice(1, 2) },
  { label: "splice(1, 0, 99)", run: (nums) => nums.splice(1, 0, 99) },
  { label: "sort()", run: (nums) => nums.sort() },
  { label: "sort((a, b) => a - b)", run: (nums) => nums.sort((x, y) => x - y) },
  { label: "sort((a, b) => b - a)", run: (nums) => nums.sort((x, y) => y - x) },
];

type LastRun = {
  before: number[];
  returned: number[];
  changed: boolean;
};

export function MutationDetectorWidget() {
  const [nums, setNums] = useState(STARTING_NUMS);
  const [lastRun, setLastRun] = useState<LastRun | null>(null);
  const [output, setOutput] = useState<ReactNode>(
    "// nums = " + formatValue(STARTING_NUMS)
  );

  function runOperation(operation: (typeof OPERATIONS)[number]) {
    const before = [...nums];
    const working = [...nums];
    const returned = operation.run(working);
    const changed = !isSameValue(before, working);
    const returnedTheSameArray = returned === working;

    setNums(working);
    setLastRun({ before, returned: [...returned], changed });
    setOutput(
      <>
        {`nums.${operation.label}\n// returned `}
        <b>{formatValue(returned)}</b>
        {returnedTheSameArray ? "  (the same array, not a copy)" : ""}
        {"\n// nums is now "}
        <b>{formatValue(working)}</b>
      </>
    );
  }

  function reset() {
    setNums(STARTING_NUMS);
    setLastRun(null);
    setOutput("// nums = " + formatValue(STARTING_NUMS));
  }

  return (
    <>
      <p>
        Run a method and see whether the original array changed. Use Reset to
        start over.
      </p>
      <Controls>
        {OPERATIONS.map((operation) => (
          <Button
            key={operation.label}
            font="mono"
            variant={operation.label.startsWith("slice") ? "outline" : "default"}
            onClick={() => runOperation(operation)}
          >
            {operation.label}
          </Button>
        ))}
        <Button variant="brand" onClick={reset}>
          Reset
        </Button>
      </Controls>

      <RowLabel>nums before</RowLabel>
      {lastRun && (
        <ArrayBoxes values={lastRun.before} getCellState={() => "dim"} />
      )}

      <RowLabel>
        nums after{" "}
        {lastRun &&
          (lastRun.changed ? (
            <Badge variant="bad">CHANGED</Badge>
          ) : (
            <Badge variant="good">UNCHANGED</Badge>
          ))}
      </RowLabel>
      <ArrayBoxes
        values={nums}
        getCellState={() => (lastRun?.changed ? "current" : undefined)}
      />

      <RowLabel>returned value</RowLabel>
      {lastRun ? (
        <ArrayBoxes values={lastRun.returned} getCellState={() => "output"} />
      ) : (
        <div className="py-[18px] font-mono text-muted-foreground">–</div>
      )}

      <Readout>{output}</Readout>
    </>
  );
}
