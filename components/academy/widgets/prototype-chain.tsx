"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controls, Readout } from "../content";
import { sleep } from "@/lib/academy/format";
import { useIsMounted } from "@/lib/academy/use-is-mounted";

type ChainLink = {
  name: string;
  /** How this object was made, shown as code. */
  madeWith: string;
  ownKeys: string[];
};

// Mirrors the lesson's code exactly:
//   const animal = { alive: true, eat() {...} };
//   const dog = Object.create(animal); dog.bark = function () {...};
//   const rex = Object.create(dog); rex.name = "Rex";
const CHAIN: ChainLink[] = [
  { name: "rex", madeWith: "Object.create(dog)", ownKeys: ["name"] },
  { name: "dog", madeWith: "Object.create(animal)", ownKeys: ["bark"] },
  { name: "animal", madeWith: "{ … }", ownKeys: ["alive", "eat"] },
  {
    name: "Object.prototype",
    madeWith: "built in",
    ownKeys: ["toString", "hasOwnProperty"],
  },
];

const LOOKUPS = ["name", "bark", "eat", "alive", "toString", "fly"];
const STEP_MILLISECONDS = 650;

type LookupState = {
  key: string;
  /** Index of the link being checked; CHAIN.length means "reached null". */
  checkingIndex: number;
  foundIndex: number | null;
  isDone: boolean;
};

export function PrototypeChainWidget() {
  const [lookup, setLookup] = useState<LookupState | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const isMountedRef = useIsMounted();

  async function lookUp(key: string) {
    setIsRunning(true);
    for (let index = 0; index <= CHAIN.length; index++) {
      const reachedNull = index === CHAIN.length;
      const isFoundHere = !reachedNull && CHAIN[index].ownKeys.includes(key);

      setLookup({
        key,
        checkingIndex: index,
        foundIndex: isFoundHere ? index : null,
        isDone: isFoundHere || reachedNull,
      });

      if (isFoundHere || reachedNull) {
        break;
      }
      await sleep(STEP_MILLISECONDS);
      if (!isMountedRef.current) {
        return;
      }
    }
    setIsRunning(false);
  }

  let output: ReactNode = "// pick a property to look up on rex";
  if (lookup !== null) {
    const checkedNames = CHAIN.slice(0, Math.min(lookup.checkingIndex + 1, CHAIN.length)).map(
      (link) => link.name
    );
    if (!lookup.isDone) {
      output = `rex.${lookup.key}\n// checking ${checkedNames[checkedNames.length - 1]}…`;
    } else if (lookup.foundIndex !== null) {
      const owner = CHAIN[lookup.foundIndex].name;
      const hops = lookup.foundIndex;
      output = (
        <>
          {`rex.${lookup.key}\n// checked: ${checkedNames.join(" → ")}\n// found on `}
          <b>{owner}</b>
          {hops === 0 ? " (rex's own property)" : ` after ${hops} hop${hops > 1 ? "s" : ""} up the chain`}
        </>
      );
    } else {
      output = (
        <>
          {`rex.${lookup.key}\n// checked: ${checkedNames.join(" → ")} → null\n// → `}
          <b>undefined</b>
          {" (the chain ended without finding it)"}
        </>
      );
    }
  }

  return (
    <>
      <p>
        Look up a property on <code>rex</code>. JavaScript checks rex first,
        then follows the prototype link upwards until it finds the key or runs
        out of chain.
      </p>
      <Controls>
        {LOOKUPS.map((key) => (
          <Button
            key={key}
            font="mono"
            variant="outline"
            disabled={isRunning}
            onClick={() => lookUp(key)}
          >
            rex.{key}
          </Button>
        ))}
      </Controls>
      <div className="my-3 flex flex-wrap items-stretch gap-2">
        {CHAIN.map((link, index) => {
          const isChecking = lookup !== null && lookup.checkingIndex === index;
          const isFound = lookup !== null && lookup.foundIndex === index;
          const wasPassed = lookup !== null && lookup.checkingIndex > index;
          return (
            <div key={link.name} className="flex items-center gap-2">
              <div
                className={cn(
                  "min-w-[140px] rounded-xl border-[2.5px] border-ink bg-surface px-3 py-2 transition-all duration-200",
                  isChecking && !isFound && "-translate-y-1 bg-highlight text-highlight-ink shadow-[0_4px_0_var(--ink)]",
                  isFound && "border-good bg-good-soft",
                  wasPassed && "opacity-45"
                )}
              >
                <div className="font-mono text-[14px] font-bold">{link.name}</div>
                <div className="font-mono text-[11.5px] text-muted-foreground">{link.madeWith}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {link.ownKeys.map((key) => (
                    <span
                      key={key}
                      className={cn(
                        "rounded-md bg-background px-1.5 font-mono text-[12.5px]",
                        isFound && lookup?.key === key && "bg-good text-white"
                      )}
                    >
                      {key}
                    </span>
                  ))}
                </div>
              </div>
              <span className="font-mono text-muted-foreground">→</span>
            </div>
          );
        })}
        <div
          className={cn(
            "grid place-items-center rounded-xl border-[2.5px] border-dashed border-line px-3 font-mono text-[14px] text-muted-foreground",
            lookup !== null && lookup.checkingIndex === CHAIN.length && "border-bad text-bad"
          )}
        >
          null
        </div>
      </div>
      <Readout>{output}</Readout>
    </>
  );
}
