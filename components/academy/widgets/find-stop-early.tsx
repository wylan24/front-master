"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout } from "../content";
import { formatValue, sleep } from "@/lib/academy/format";
import { useIsMounted } from "@/lib/academy/use-is-mounted";

const TEMPS = [12, 18, 25, 31, 22, -3];
const STEP_DELAY_MILLISECONDS = 520;
const NONE = -1;

type Method = "find" | "findIndex" | "some" | "every";
const METHODS: Method[] = ["find", "findIndex", "some", "every"];

const CONDITIONS: { label: string; test: (t: number) => boolean }[] = [
  { label: "t => t > 20", test: (t) => t > 20 },
  { label: "t => t > 30", test: (t) => t > 30 },
  { label: "t => t < 0", test: (t) => t < 0 },
  { label: "t => t > 50", test: (t) => t > 50 },
  { label: "t => t > -10", test: (t) => t > -10 },
];

/** What each method returns when it stops on the item at `index`. */
function getResultWhenStopped(method: Method, index: number): unknown {
  if (method === "find") {
    return TEMPS[index];
  }
  if (method === "findIndex") {
    return index;
  }
  if (method === "some") {
    return true;
  }
  return false;
}

/** What each method returns after checking every item without stopping. */
function getResultWhenNotStopped(method: Method): unknown {
  if (method === "find") {
    return undefined;
  }
  if (method === "findIndex") {
    return -1;
  }
  if (method === "some") {
    return false;
  }
  return true;
}

export function FindStopEarlyWidget() {
  const [method, setMethod] = useState<Method>("find");
  const [conditionLabel, setConditionLabel] = useState(CONDITIONS[0].label);
  const [checkingIndex, setCheckingIndex] = useState(NONE);
  const [hitIndex, setHitIndex] = useState(NONE);
  const [missIndex, setMissIndex] = useState(NONE);
  const [output, setOutput] = useState<ReactNode>("// pick a method and a test");
  const isBusyRef = useRef(false);
  const isMountedRef = useIsMounted();

  async function run() {
    if (isBusyRef.current) {
      return;
    }
    const condition = CONDITIONS.find((c) => c.label === conditionLabel);
    if (condition === undefined) {
      return;
    }

    isBusyRef.current = true;
    setHitIndex(NONE);
    setMissIndex(NONE);

    let stoppedAt = NONE;
    for (let index = 0; index < TEMPS.length; index++) {
      const passes = condition.test(TEMPS[index]);
      setCheckingIndex(index);
      setOutput(
        <>
          {`// test ${TEMPS[index]} → `}
          {passes ? <b>true</b> : "false"}
        </>
      );

      await sleep(STEP_DELAY_MILLISECONDS);
      if (!isMountedRef.current) {
        return;
      }

      // find/findIndex/some stop at the first pass; every stops at the first fail.
      if (method !== "every" && passes) {
        setHitIndex(index);
        stoppedAt = index;
        break;
      }
      if (method === "every" && !passes) {
        setMissIndex(index);
        stoppedAt = index;
        break;
      }
    }

    let result: unknown;
    if (stoppedAt === NONE) {
      result = getResultWhenNotStopped(method);
      setCheckingIndex(TEMPS.length);
    } else {
      result = getResultWhenStopped(method, stoppedAt);
    }

    const checkedCount = stoppedAt === NONE ? TEMPS.length : stoppedAt + 1;
    const stoppedEarly = stoppedAt !== NONE && checkedCount < TEMPS.length;
    const resultText = result === undefined ? "undefined" : formatValue(result);

    setOutput(
      <>
        {`temps.${method}(${condition.label})  →  `}
        <b>{resultText}</b>
        {`\n// checked ${checkedCount} of ${TEMPS.length} items`}
        {stoppedEarly ? " (stopped early)" : ""}
      </>
    );
    isBusyRef.current = false;
  }

  function getCellState(index: number) {
    if (index === hitIndex) {
      return "match" as const;
    }
    if (index === missIndex) {
      return "miss" as const;
    }
    if (index === checkingIndex) {
      return "current" as const;
    }
    if (checkingIndex >= 0 && index < checkingIndex) {
      return "dim" as const;
    }
    return undefined;
  }

  return (
    <>
      <p>
        Pick a method and a test, then run it. Note how many items get checked
        before it stops.
      </p>
      <Controls>
        {"temps."}
        <NativeSelect
          value={method}
          onChange={(event) => setMethod(event.target.value as Method)}
        >
          {METHODS.map((name) => (
            <NativeSelectOption key={name}>{name}</NativeSelectOption>
          ))}
        </NativeSelect>
        {"("}
        <NativeSelect
          value={conditionLabel}
          onChange={(event) => setConditionLabel(event.target.value)}
        >
          {CONDITIONS.map((condition) => (
            <NativeSelectOption key={condition.label}>
              {condition.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
        {")"}
        <Button onClick={run}>Run ▶</Button>
      </Controls>
      <ArrayBoxes values={TEMPS} getCellState={getCellState} />
      <Readout>{output}</Readout>
    </>
  );
}
