"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { cn } from "@/lib/utils";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout, RowLabel } from "../content";
import { formatValue } from "@/lib/academy/format";

type Student = { name: string; grade: number; city: string };

const STUDENTS: Student[] = [
  { name: "Ana", grade: 88, city: "Paris" },
  { name: "Ben", grade: 72, city: "Lagos" },
  { name: "Chen", grade: 95, city: "Toronto" },
  { name: "Dara", grade: 64, city: "Lagos" },
  { name: "Eli", grade: 81, city: "Paris" },
];

const QUERIES: { label: string; run: () => unknown }[] = [
  { label: "students[2].grade", run: () => STUDENTS[2].grade },
  { label: "students.map(s => s.name)", run: () => STUDENTS.map((s) => s.name) },
  {
    label: "students.map(s => s.grade + 5)",
    run: () => STUDENTS.map((s) => s.grade + 5),
  },
  {
    label: "students.filter(s => s.grade >= 80)",
    run: () => STUDENTS.filter((s) => s.grade >= 80),
  },
  {
    label: 'students.filter(s => s.city === "Paris")',
    run: () => STUDENTS.filter((s) => s.city === "Paris"),
  },
  {
    label: 'students.find(s => s.city === "Lagos")',
    run: () => STUDENTS.find((s) => s.city === "Lagos"),
  },
  {
    label: "[...students].sort((a, b) => b.grade - a.grade)",
    run: () => [...STUDENTS].sort((a, b) => b.grade - a.grade),
  },
];

function RecordsTable({
  rows,
  highlightedRows,
  highlightGradeOf,
}: {
  rows: Student[];
  highlightedRows?: Set<Student>;
  highlightGradeOf?: Student;
}) {
  const cellClassName = "border-b border-border px-[14px] py-1.5 text-left";

  return (
    <table className="my-1.5 mb-[10px] border-collapse overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-white font-mono text-[13.5px]">
      <thead>
        <tr>
          {["#", "name", "grade", "city"].map((heading) => (
            <th
              key={heading}
              className={cn(cellClassName, "bg-ink font-semibold text-white")}
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((student, index) => {
          const isRowOn = highlightedRows?.has(student) ?? false;
          const rowClassName = cn(cellClassName, isRowOn && "bg-[#fdf0bf]");
          const isGradeOn = highlightGradeOf === student;

          return (
            <tr key={student.name}>
              <td className={cn(rowClassName, "text-muted-foreground")}>
                {index}
              </td>
              <td className={rowClassName}>{student.name}</td>
              <td
                className={cn(rowClassName, isGradeOn && "bg-highlight font-bold")}
              >
                {student.grade}
              </td>
              <td className={rowClassName}>{student.city}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Formats an object like `{name: "Ben", grade: 72, city: "Lagos"}`. */
function formatRecord(record: object): string {
  return JSON.stringify(record)
    .replace(/"(\w+)":/g, "$1: ")
    .replace(/,/g, ", ");
}

function isStudentArray(value: unknown): value is Student[] {
  return Array.isArray(value) && value.length > 0 && typeof value[0] === "object";
}

export function QueryRecordsWidget() {
  const [selectedLabel, setSelectedLabel] = useState(QUERIES[0].label);
  const [activeLabel, setActiveLabel] = useState(QUERIES[0].label);

  const query = QUERIES.find((q) => q.label === activeLabel) ?? QUERIES[0];
  const result = query.run();

  const highlightedRows = new Set<Student>();
  let highlightGradeOf: Student | undefined;
  let kind: ReactNode;
  let resultView: ReactNode;

  if (isStudentArray(result)) {
    for (const student of result) {
      highlightedRows.add(student);
    }
    const plural = result.length === 1 ? "" : "s";
    kind = (
      <Badge variant="info">
        array of {result.length} object{plural}
      </Badge>
    );
    resultView = <RecordsTable rows={result} />;
  } else if (Array.isArray(result)) {
    kind = <Badge variant="info">array of {typeof result[0]}s</Badge>;
    resultView = <ArrayBoxes values={result} getCellState={() => "output"} />;
  } else if (result !== null && typeof result === "object") {
    highlightedRows.add(result as Student);
    kind = <Badge variant="good">one object (not an array!)</Badge>;
    resultView = <Readout>{formatRecord(result)}</Readout>;
  } else {
    // A single value: students[2].grade.
    highlightGradeOf = STUDENTS[2];
    highlightedRows.add(STUDENTS[2]);
    kind = <Badge variant="good">a {typeof result}</Badge>;
    resultView = (
      <Readout>
        <b>{formatValue(result)}</b>
      </Readout>
    );
  }

  // map() reads every row, so highlighting rows there would add nothing.
  const isMapQuery = activeLabel.startsWith("students.map");

  function runQuery(label: string) {
    setSelectedLabel(label);
    setActiveLabel(label);
  }

  return (
    <>
      <p>
        Pick a query to run against the <code>students</code> array.
      </p>
      <Controls>
        <NativeSelect
          value={selectedLabel}
          onChange={(event) => runQuery(event.target.value)}
        >
          {QUERIES.map((q) => (
            <NativeSelectOption key={q.label}>{q.label}</NativeSelectOption>
          ))}
        </NativeSelect>
        <Button onClick={() => runQuery(selectedLabel)}>Run ▶</Button>
      </Controls>
      <RowLabel>students</RowLabel>
      <div className="max-w-full overflow-x-auto">
        <RecordsTable
          rows={STUDENTS}
          highlightedRows={isMapQuery ? undefined : highlightedRows}
          highlightGradeOf={highlightGradeOf}
        />
      </div>
      <RowLabel>result {kind}</RowLabel>
      <div className="max-w-full overflow-x-auto">{resultView}</div>
    </>
  );
}
