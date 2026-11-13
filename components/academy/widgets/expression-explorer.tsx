"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CodeBlock, Controls, Readout } from "../content";
import { runCode } from "@/lib/academy/run-code";

export type ExplorerExpression = {
  code: string;
  /** Shown after the result is revealed: why it comes out that way. */
  note?: ReactNode;
};

type ExpressionExplorerProps = {
  intro: ReactNode;
  /** Code that runs before every expression, e.g. a variable the expressions use. */
  setup?: string;
  expressions: ExplorerExpression[];
  /** Pre-filled text for the "try your own" box. */
  ownExpressionStart?: string;
};

type Outcome = {
  text: string;
  isError: boolean;
};

// Turns any value into the text a developer would expect to see, inside the
// worker, so values like NaN, undefined and functions survive the trip back.
const SHOW_VALUE_HELPER = `
function __show(value) {
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "function") return "ƒ " + (value.name || "anonymous") + "()";
  if (typeof value === "bigint") return value + "n";
  if (typeof value === "symbol") return value.toString();
  if (value instanceof Promise) return "Promise { … }";
  if (value !== null && typeof value === "object") {
    try { return JSON.stringify(value); } catch (error) { return String(value); }
  }
  if (Object.is(value, -0)) return "-0";
  return String(value);
}`;

async function evaluate(setup: string, expression: string): Promise<Outcome> {
  const code = setup + "\n" + SHOW_VALUE_HELPER;
  const result = await runCode(code, `__show(${expression})`);
  if (!result.ok) {
    return { text: "⚠ " + result.error, isError: true };
  }
  return { text: String(result.values), isError: false };
}

/**
 * A list of expressions to predict, then reveal. Every result comes from
 * really running the code, so it can never disagree with JavaScript.
 */
export function ExpressionExplorer({
  intro,
  setup = "",
  expressions,
  ownExpressionStart = "",
}: ExpressionExplorerProps) {
  const [outcomes, setOutcomes] = useState<Record<number, Outcome>>({});
  const [ownExpression, setOwnExpression] = useState(ownExpressionStart);
  const [ownOutcome, setOwnOutcome] = useState<Outcome | null>(null);

  async function reveal(index: number) {
    const outcome = await evaluate(setup, expressions[index].code);
    setOutcomes((current) => ({ ...current, [index]: outcome }));
  }

  async function evaluateOwn() {
    if (ownExpression.trim() === "") {
      return;
    }
    setOwnOutcome(await evaluate(setup, ownExpression));
  }

  return (
    <>
      <p>{intro}</p>
      {setup.trim() !== "" && <CodeBlock code={setup.trim()} />}
      <div className="grid gap-2">
        {expressions.map((expression, index) => {
          const outcome = outcomes[index];
          return (
            <div
              key={expression.code}
              className="rounded-[10px] border-[1.5px] border-border bg-surface px-3 py-2"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <code className="bg-transparent p-0 text-[14px] text-ink">
                  {expression.code}
                </code>
                {outcome === undefined ? (
                  <Button
                    variant="outline"
                    font="mono"
                    className="ml-auto px-2 py-1"
                    onClick={() => reveal(index)}
                  >
                    reveal
                  </Button>
                ) : (
                  <span
                    className={cn(
                      "ml-auto animate-pop font-mono text-[14px] font-semibold",
                      outcome.isError ? "text-bad" : "text-good"
                    )}
                  >
                    → {outcome.text}
                  </span>
                )}
              </div>
              {outcome !== undefined && expression.note && (
                <div className="mt-1.5 text-[14px] text-muted-foreground">
                  {expression.note}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Controls className="mt-4">
        <span className="text-[14px]">Try your own:</span>
        <Input
          type="text"
          aria-label="Your own expression"
          className="min-w-0 flex-1 basis-[220px]"
          value={ownExpression}
          onChange={(event) => setOwnExpression(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              evaluateOwn();
            }
          }}
        />
        <Button font="mono" variant="brand" onClick={evaluateOwn}>
          evaluate
        </Button>
      </Controls>
      {ownOutcome !== null && (
        <Readout>
          {ownOutcome.isError ? ownOutcome.text : <b>{ownOutcome.text}</b>}
        </Readout>
      )}
    </>
  );
}
