"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Readout } from "../content";

function Column({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border-[1.5px] border-border bg-surface px-3 py-3">
      <b className="text-[15px]">{title}</b>
      <pre className="m-0 overflow-auto rounded-lg bg-code px-2.5 py-2 font-mono text-[12px] leading-[1.5] text-code-ink">
        {code}
      </pre>
      {children}
    </div>
  );
}

/** Changes the page directly, the way the vanilla cart did. */
function ManualDomColumn() {
  const countRef = useRef<HTMLSpanElement>(null);
  const clickCountRef = useRef(0);

  function handleClick() {
    clickCountRef.current = clickCountRef.current + 1;
    if (countRef.current !== null) {
      countRef.current.textContent = String(clickCountRef.current);
    }
  }

  return (
    <Column
      title="1. Change the page yourself"
      code={`count = count + 1;\ncountEl.textContent = count;`}
    >
      <Button variant="brand" onClick={handleClick}>
        Add to cart
      </Button>
      <div className="text-[14.5px]">
        Header: Cart (<span ref={countRef}>0</span>)
        <br />
        Summary: Cart (0) <span className="text-bad">← forgotten</span>
      </div>
      <p className="m-0 text-[13.5px] text-muted-foreground">
        Works, but only for the places you remembered to update.
      </p>
    </Column>
  );
}

/** Shows what a plain `let` inside a component does: the value changes, the screen doesn't. */
function OrdinaryVariableColumn() {
  // A ref stands in for the component's `let count` so the widget can show its value.
  const variableRef = useRef(0);
  const [logLines, setLogLines] = useState<string[]>([]);

  function handleClick() {
    variableRef.current = variableRef.current + 1;
    setLogLines([...logLines, `count is now ${variableRef.current}`]);
  }

  function renderAgain() {
    // When the component runs again, `let count = 0` runs again too.
    variableRef.current = 0;
    setLogLines([...logLines, "(component ran again: let count = 0)"]);
  }

  return (
    <Column
      title="2. An ordinary variable"
      code={`let count = 0;\nfunction handleClick() {\n  count = count + 1;\n}`}
    >
      <Button variant="brand" onClick={handleClick}>
        Add to cart
      </Button>
      <div className="text-[14.5px]">
        Screen: Cart (<b>0</b>)
      </div>
      <Readout>{logLines.length === 0 ? "console" : logLines.slice(-4).join("\n")}</Readout>
      <Button variant="outline" onClick={renderAgain}>
        Something else re-renders it
      </Button>
      <p className="m-0 text-[13.5px] text-muted-foreground">
        The variable changes, but nothing tells React to draw again. When it
        does draw again, the variable starts from 0.
      </p>
    </Column>
  );
}

function StateColumn() {
  const [count, setCount] = useState(0);

  return (
    <Column
      title="3. React state"
      code={`const [count, setCount] =\n  useState(0);\nsetCount(count + 1);`}
    >
      <Button variant="brand" onClick={() => setCount(count + 1)}>
        Add to cart
      </Button>
      <div className="text-[14.5px]">
        Header: Cart (<b>{count}</b>)
        <br />
        Summary: Cart ({count})
      </div>
      <p className="m-0 text-[13.5px] text-muted-foreground">
        React remembers the value between renders and draws every place that
        uses it again.
      </p>
    </Column>
  );
}

export function VariableVsStateWidget() {
  return (
    <>
      <p>
        Three ways to make a cart counter. Click <b>Add to cart</b> three times
        in each, and predict what the screen shows before you click.
      </p>
      <div className="grid gap-3 min-[820px]:grid-cols-3">
        <ManualDomColumn />
        <OrdinaryVariableColumn />
        <StateColumn />
      </div>
    </>
  );
}
