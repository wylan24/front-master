"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controls, Readout } from "../content";
import { formatValue, sleep } from "@/lib/academy/format";
import { useIsMounted } from "@/lib/academy/use-is-mounted";

const GRID = [
  [7, 2, 9, 4],
  [5, 8, 1, 6],
  [3, 0, 11, 10],
];
const STEP_DELAY_MILLISECONDS = 380;

function cellKey(row: number, column: number): string {
  return `${row},${column}`;
}

export function GridExplorerWidget() {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [visitedCells, setVisitedCells] = useState<string[]>([]);
  const [output, setOutput] = useState<ReactNode>("// click a cell");
  const isBusyRef = useRef(false);
  const isMountedRef = useIsMounted();

  function selectCell(row: number, column: number) {
    if (isBusyRef.current) {
      return;
    }
    setSelectedCell(cellKey(row, column));
    setSelectedRow(null);
    setVisitedCells([]);
    setOutput(
      <>
        {`grid[${row}][${column}]  →  `}
        <b>{GRID[row][column]}</b>
        {`   // row ${row}, then column ${column}`}
      </>
    );
  }

  function showRow(row: number) {
    if (isBusyRef.current) {
      return;
    }
    setSelectedRow(row);
    setSelectedCell(null);
    setVisitedCells([]);
    setOutput(
      <>
        {`grid[${row}]  →  `}
        <b>{formatValue(GRID[row])}</b>
        {`   // a row is an array\ngrid[${row}].length → ${GRID[row].length}`}
      </>
    );
  }

  async function runNestedLoop() {
    if (isBusyRef.current) {
      return;
    }
    isBusyRef.current = true;
    setSelectedRow(null);

    const visited: string[] = [];
    let visitCount = 0;

    for (let row = 0; row < GRID.length; row++) {
      for (let column = 0; column < GRID[row].length; column++) {
        const key = cellKey(row, column);
        visitCount++;
        setSelectedCell(key);
        // The current cell is drawn as "on"; it joins the visited list after.
        setVisitedCells([...visited]);
        visited.push(key);
        setOutput(
          <>
            {"outer r = "}
            <b>{row}</b>
            {"   inner c = "}
            <b>{column}</b>
            {`\ngrid[${row}][${column}] → ${GRID[row][column]}     // visit #${visitCount}`}
          </>
        );

        await sleep(STEP_DELAY_MILLISECONDS);
        if (!isMountedRef.current) {
          return;
        }
      }
    }

    setSelectedCell(null);
    setVisitedCells([...visited]);
    setOutput(
      <>
        {`// done: ${GRID.length} rows × ${GRID[0].length} columns = `}
        <b>{visitCount}</b>
        {" visits"}
      </>
    );
    isBusyRef.current = false;
  }

  const columnCount = GRID[0].length;

  return (
    <>
      <p>
        Click a cell to see how you&apos;d access it, show a whole row, or watch
        a nested loop visit every cell.
      </p>
      <Controls>
        {GRID.map((_, row) => (
          <Button
            key={row}
            variant="outline"
            font="mono"
            onClick={() => showRow(row)}
          >
            grid[{row}]
          </Button>
        ))}
        <Button onClick={runNestedLoop}>Nested loop ▶</Button>
      </Controls>

      <div
        className="my-3 grid items-center gap-1.5"
        style={{ gridTemplateColumns: `40px repeat(${columnCount}, 64px)` }}
      >
        <div />
        {GRID[0].map((_, column) => (
          <div
            key={column}
            className="text-center font-mono text-[11.5px] text-muted-foreground"
          >
            col {column}
          </div>
        ))}

        {GRID.map((rowValues, row) => (
          <GridRow
            key={row}
            row={row}
            rowValues={rowValues}
            isRowSelected={selectedRow === row}
            selectedCell={selectedCell}
            visitedCells={visitedCells}
            onSelectCell={selectCell}
          />
        ))}
      </div>
      <Readout>{output}</Readout>
    </>
  );
}

function GridRow({
  row,
  rowValues,
  isRowSelected,
  selectedCell,
  visitedCells,
  onSelectCell,
}: {
  row: number;
  rowValues: number[];
  isRowSelected: boolean;
  selectedCell: string | null;
  visitedCells: string[];
  onSelectCell: (row: number, column: number) => void;
}) {
  return (
    <>
      <div className="text-center font-mono text-[11.5px] text-muted-foreground">
        row {row}
      </div>
      {rowValues.map((value, column) => {
        const key = cellKey(row, column);
        const isOn = selectedCell === key;
        const isSeen = visitedCells.includes(key) && !isOn;

        return (
          <button
            key={column}
            type="button"
            onClick={() => onSelectCell(row, column)}
            className={cn(
              "grid h-14 place-items-center rounded-[10px] border-[2.5px] border-ink bg-surface font-mono font-semibold transition-all duration-150 hover:-translate-y-0.5",
              isRowSelected && "border-info bg-info-soft",
              isSeen && "bg-good-soft",
              isOn &&
                "-translate-y-[3px] bg-highlight text-highlight-ink shadow-[0_4px_0_var(--ink)] hover:-translate-y-[3px]"
            )}
          >
            {value}
          </button>
        );
      })}
    </>
  );
}
