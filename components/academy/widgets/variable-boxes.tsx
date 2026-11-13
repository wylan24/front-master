"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controls, Readout } from "../content";

type Box = {
  name: string;
  keyword: "let" | "const";
  value: string;
};

type Action = {
  code: string;
  run: (boxes: Box[]) => { boxes: Box[]; message: string; changedName: string | null };
};

function findBox(boxes: Box[], name: string): Box | undefined {
  return boxes.find((box) => box.name === name);
}

function declare(boxes: Box[], keyword: Box["keyword"], name: string, value: string) {
  if (findBox(boxes, name) !== undefined) {
    return {
      boxes,
      message: `SyntaxError: Identifier '${name}' has already been declared\n// a name can only be declared once; to change it, leave off the keyword`,
      changedName: null,
    };
  }
  return {
    boxes: [...boxes, { name, keyword, value }],
    message: `// made a new box labelled ${name}, holding ${value}`,
    changedName: name,
  };
}

function assign(boxes: Box[], name: string, value: string) {
  const box = findBox(boxes, name);
  if (box === undefined) {
    return {
      boxes,
      message: `ReferenceError: ${name} is not defined\n// there's no box with that label yet: declare it first`,
      changedName: null,
    };
  }
  if (box.keyword === "const") {
    return {
      boxes,
      message: `TypeError: Assignment to constant variable.\n// ${name} was made with const, so its box is sealed`,
      changedName: null,
    };
  }
  const nextBoxes = boxes.map((existing) =>
    existing.name === name ? { ...existing, value } : existing
  );
  return {
    boxes: nextBoxes,
    message: `// ${name} now holds ${value}; the old value is gone`,
    changedName: name,
  };
}

const ACTIONS: Action[] = [
  { code: "let score = 0;", run: (boxes) => declare(boxes, "let", "score", "0") },
  { code: "score = 10;", run: (boxes) => assign(boxes, "score", "10") },
  { code: "score = score + 5;", run: (boxes) => {
    const box = findBox(boxes, "score");
    const next = box === undefined ? "NaN" : String(Number(box.value) + 5);
    return assign(boxes, "score", next);
  } },
  { code: 'const name = "Ada";', run: (boxes) => declare(boxes, "const", "name", '"Ada"') },
  { code: 'name = "Bo";', run: (boxes) => assign(boxes, "name", '"Bo"') },
  { code: "let score = 99;", run: (boxes) => declare(boxes, "let", "score", "99") },
  { code: "lives = 3;", run: (boxes) => assign(boxes, "lives", "3") },
];

export function VariableBoxesWidget() {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [changedName, setChangedName] = useState<string | null>(null);
  const [log, setLog] = useState<string>("// run the lines in any order");

  function run(action: Action) {
    const result = action.run(boxes);
    setBoxes(result.boxes);
    setChangedName(result.changedName);
    setLog(action.code + "\n" + result.message);
  }

  return (
    <>
      <p>
        Each button runs one line. Watch which lines make a new box, which
        change what&apos;s inside, and which JavaScript refuses.
      </p>
      <Controls>
        {ACTIONS.map((action) => (
          <Button key={action.code} font="mono" variant="outline" onClick={() => run(action)}>
            {action.code}
          </Button>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            setBoxes([]);
            setLog("// cleared");
          }}
        >
          Reset
        </Button>
      </Controls>
      <div className="my-4 flex min-h-[96px] flex-wrap items-end gap-3">
        {boxes.length === 0 && (
          <span className="font-mono text-[14px] text-muted-foreground">no variables yet</span>
        )}
        {boxes.map((box) => (
          <div key={box.name} className="flex animate-pop flex-col items-center gap-1.5">
            <span className="font-mono text-[12px] text-muted-foreground">{box.keyword}</span>
            <span
              className={cn(
                "grid h-[58px] min-w-[84px] place-items-center rounded-[10px] border-[2.5px] border-ink bg-surface px-3 font-mono text-[15px] font-semibold transition-all duration-200",
                box.keyword === "const" && "border-dashed",
                changedName === box.name && "-translate-y-1 bg-highlight text-highlight-ink shadow-[0_4px_0_var(--ink)]"
              )}
            >
              {box.value}
            </span>
            <span className="rounded-md bg-code px-2 font-mono text-[12.5px] text-highlight">
              {box.name}
            </span>
          </div>
        ))}
      </div>
      <Readout>{log}</Readout>
    </>
  );
}
