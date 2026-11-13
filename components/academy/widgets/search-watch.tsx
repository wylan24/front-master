"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout } from "../content";
import { sleep } from "@/lib/academy/format";
import { useIsMounted } from "@/lib/academy/use-is-mounted";

const GUESTS = ["Ana", "Ben", "Cy", "Dee", "Eli", "Fay"];
const STEP_DELAY_MILLISECONDS = 520;
const NONE = -1;

export function SearchWatchWidget() {
  const [searchText, setSearchText] = useState("Dee");
  const [checkingIndex, setCheckingIndex] = useState(NONE);
  const [foundIndex, setFoundIndex] = useState(NONE);
  const [output, setOutput] = useState<ReactNode>("// press Search");
  const isBusyRef = useRef(false);
  const isMountedRef = useIsMounted();

  async function search() {
    if (isBusyRef.current) {
      return;
    }
    isBusyRef.current = true;
    setFoundIndex(NONE);
    const target = searchText;

    for (let index = 0; index < GUESTS.length; index++) {
      const isMatch = GUESTS[index] === target;
      setCheckingIndex(index);
      setOutput(
        <>
          {`// checking index ${index}: is "${GUESTS[index]}" === "${target}"? `}
          {isMatch ? <b>yes!</b> : "no"}
        </>
      );

      await sleep(STEP_DELAY_MILLISECONDS);
      if (!isMountedRef.current) {
        return;
      }

      if (isMatch) {
        setFoundIndex(index);
        setOutput(
          <>
            {`guests.indexOf("${target}")  →  `}
            <b>{index}</b>
            {`\nguests.includes("${target}") →  `}
            <b>true</b>
          </>
        );
        isBusyRef.current = false;
        return;
      }
    }

    setCheckingIndex(GUESTS.length);
    setOutput(
      <>
        {`guests.indexOf("${target}")  →  `}
        <b>-1</b>
        {"   // checked every item, no match"}
        {`\nguests.includes("${target}") →  `}
        <b>false</b>
      </>
    );
    isBusyRef.current = false;
  }

  function getCellState(index: number) {
    if (index === foundIndex) {
      return "match" as const;
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
        Type a name and watch indexOf check each box in turn. Try a name that
        isn&apos;t there, or &quot;ben&quot; in lowercase.
      </p>
      <Controls>
        {'guests.indexOf("'}
        <Input
          type="text"
          className="w-[110px]"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        {'")'}
        <Button onClick={search}>Search</Button>
      </Controls>
      <ArrayBoxes values={GUESTS} getCellState={getCellState} />
      <Readout>{output}</Readout>
    </>
  );
}
