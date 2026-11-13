"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Readout } from "../content";
import { formatValue } from "@/lib/academy/format";

type ObjectTreeExplorerProps = {
  intro: ReactNode;
  variableName: string;
  value: unknown;
  /** Also show the optional-chaining form of each path. */
  showOptionalChaining?: boolean;
};

const VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

type PathStep = { kind: "key"; key: string } | { kind: "index"; index: number };

function pathToCode(variableName: string, path: PathStep[], optional: boolean): string {
  let code = variableName;
  for (const step of path) {
    if (step.kind === "index") {
      code += optional ? `?.[${step.index}]` : `[${step.index}]`;
    } else if (VALID_IDENTIFIER.test(step.key)) {
      code += optional ? `?.${step.key}` : `.${step.key}`;
    } else {
      code += optional ? `?.["${step.key}"]` : `["${step.key}"]`;
    }
  }
  return code;
}

function isBranch(value: unknown): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === "object";
}

type Selection = { path: PathStep[]; value: unknown };

/**
 * Nested data drawn as an indented tree. Clicking any part shows the exact
 * chain of dots and brackets that reaches it.
 */
export function ObjectTreeExplorer({
  intro,
  variableName,
  value,
  showOptionalChaining = false,
}: ObjectTreeExplorerProps) {
  const [selection, setSelection] = useState<Selection | null>(null);

  let output: ReactNode = "// click any key or item in the tree";
  if (selection !== null) {
    const plainPath = pathToCode(variableName, selection.path, false);
    output = (
      <>
        {plainPath}
        {"\n// → "}
        <b>{formatValue(selection.value)}</b>
        {showOptionalChaining && selection.path.length > 0 && (
          <>
            {"\n// safe version: "}
            {pathToCode(variableName, selection.path, true)}
          </>
        )}
      </>
    );
  }

  const selectedCode = selection === null ? null : pathToCode(variableName, selection.path, false);

  return (
    <>
      <p>{intro}</p>
      <div className="my-3 overflow-x-auto rounded-xl border-[1.5px] border-border bg-surface px-4 py-3 font-mono text-[14px] leading-[1.9]">
        <TreeNode
          label={variableName}
          value={value}
          path={[]}
          variableName={variableName}
          selectedCode={selectedCode}
          onSelect={setSelection}
        />
      </div>
      <Readout>{output}</Readout>
    </>
  );
}

function TreeNode({
  label,
  value,
  path,
  variableName,
  selectedCode,
  onSelect,
}: {
  label: string;
  value: unknown;
  path: PathStep[];
  variableName: string;
  selectedCode: string | null;
  onSelect: (selection: Selection) => void;
}) {
  const isSelected = selectedCode === pathToCode(variableName, path, false);
  const labelButton = (
    <button
      type="button"
      onClick={() => onSelect({ path, value })}
      className={cn(
        "cursor-pointer rounded-md px-1.5 font-semibold text-brand-ink hover:bg-brand-soft",
        isSelected && "bg-highlight text-highlight-ink hover:bg-highlight"
      )}
    >
      {label}
    </button>
  );

  if (!isBranch(value)) {
    return (
      <div>
        {labelButton}: <span className="text-ink">{formatValue(value)}</span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const children: { label: string; value: unknown; step: PathStep }[] = [];
  if (isArray) {
    value.forEach((item, index) => {
      children.push({ label: `[${index}]`, value: item, step: { kind: "index", index } });
    });
  } else {
    for (const [key, childValue] of Object.entries(value)) {
      children.push({ label: key, value: childValue, step: { kind: "key", key } });
    }
  }

  return (
    <div>
      {labelButton}
      <span className="text-muted-foreground">
        {isArray ? `: [ ${children.length} items ]` : ": { }"}
      </span>
      <div className="ml-3 border-l-2 border-line pl-4">
        {children.map((child) => (
          <TreeNode
            key={child.label}
            label={child.label}
            value={child.value}
            path={[...path, child.step]}
            variableName={variableName}
            selectedCode={selectedCode}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
