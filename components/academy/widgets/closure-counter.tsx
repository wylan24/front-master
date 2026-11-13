"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeBlock, Controls, Readout } from "../content";

type Counter = {
  name: string;
  /** The private `count` this counter's closure remembers. */
  count: number;
};

const COUNTER_NAMES = ["counterA", "counterB", "counterC"];

export function ClosureCounterWidget() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [log, setLog] = useState<string[]>(["// make a counter to start"]);

  function makeCounter() {
    if (counters.length === COUNTER_NAMES.length) {
      return;
    }
    const name = COUNTER_NAMES[counters.length];
    setCounters([...counters, { name, count: 0 }]);
    setLog([`const ${name} = makeCounter();   // a new, separate count = 0`]);
  }

  function increment(name: string) {
    let newCount = 0;
    const nextCounters = counters.map((counter) => {
      if (counter.name !== name) {
        return counter;
      }
      newCount = counter.count + 1;
      return { ...counter, count: newCount };
    });
    setCounters(nextCounters);
    setLog([`${name}();   // → ${newCount}`]);
  }

  return (
    <>
      <CodeBlock
        code={`function makeCounter() {
  let count = 0;            // private to each call of makeCounter
  return function () {
    count = count + 1;      // still reachable: the inner function closes over it
    return count;
  };
}`}
      />
      <p>
        makeCounter has finished running each time, yet every counter it
        returned still remembers its <b>own</b> <code>count</code>. Make two
        and click them in different amounts.
      </p>
      <Controls>
        <Button variant="brand" onClick={makeCounter} disabled={counters.length === COUNTER_NAMES.length}>
          const {COUNTER_NAMES[Math.min(counters.length, COUNTER_NAMES.length - 1)]} = makeCounter()
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setCounters([]);
            setLog(["// make a counter to start"]);
          }}
        >
          Reset
        </Button>
      </Controls>
      <div className="my-3 flex flex-wrap gap-3">
        {counters.map((counter) => (
          <div key={counter.name} className="animate-pop rounded-xl border-[2.5px] border-ink bg-surface px-4 py-3">
            <div className="font-mono text-[14px] font-bold">{counter.name}</div>
            <div className="mt-2 rounded-lg border-2 border-dashed border-brand bg-brand-soft px-3 py-2 font-mono text-[13px]">
              backpack: count = <b className="text-[16px]">{counter.count}</b>
            </div>
            <Button font="mono" className="mt-2 w-full" onClick={() => increment(counter.name)}>
              {counter.name}()
            </Button>
          </div>
        ))}
      </div>
      <Readout>{log.join("\n")}</Readout>
    </>
  );
}
