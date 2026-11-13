"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock, Controls, Readout } from "../content";

type PromiseState = "pending" | "fulfilled" | "rejected";

const STATE_BADGE: Record<PromiseState, "info" | "good" | "bad"> = {
  pending: "info",
  fulfilled: "good",
  rejected: "bad",
};

export function PromiseStatesWidget() {
  const [state, setState] = useState<PromiseState>("pending");
  const [log, setLog] = useState<string[]>(["// the kitchen is cooking… the order is pending"]);

  function settle(outcome: "fulfilled" | "rejected") {
    if (state !== "pending") {
      setLog([
        ...log,
        `// ✗ ignored: this promise is already ${state}. A promise settles exactly once.`,
      ]);
      return;
    }
    setState(outcome);
    if (outcome === "fulfilled") {
      setLog([
        ...log,
        'resolve("🍕 pizza")',
        "// .then runs →  Enjoy your 🍕 pizza",
        "// .finally runs →  Order closed",
      ]);
      return;
    }
    setLog([
      ...log,
      'reject(new Error("Out of dough"))',
      "// .catch runs →  Sorry: Out of dough",
      "// .finally runs →  Order closed",
    ]);
  }

  function newOrder() {
    setState("pending");
    setLog(["// a new order: pending again"]);
  }

  return (
    <>
      <CodeBlock
        code={`const order = new Promise((resolve, reject) => {
  // the kitchen decides later…
});

order
  .then((food) => console.log("Enjoy your " + food))
  .catch((error) => console.log("Sorry: " + error.message))
  .finally(() => console.log("Order closed"));`}
      />
      <p>
        You are the kitchen. Decide how the order turns out, then try deciding
        again.
      </p>
      <Controls>
        <span className="text-[14px]">State:</span>
        <Badge variant={STATE_BADGE[state]} className="text-[13px]">
          {state}
        </Badge>
      </Controls>
      <Controls>
        <Button font="mono" onClick={() => settle("fulfilled")}>
          resolve(&quot;🍕 pizza&quot;)
        </Button>
        <Button font="mono" variant="outline" onClick={() => settle("rejected")}>
          reject(new Error(&quot;Out of dough&quot;))
        </Button>
        <Button variant="outline" onClick={newOrder}>
          New order
        </Button>
      </Controls>
      <Readout>{log.join("\n")}</Readout>
    </>
  );
}
