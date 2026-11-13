"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrayBoxes } from "../array-boxes";
import { Controls, PlainCode, Readout } from "../content";
import { formatValue } from "@/lib/academy/format";

const FRUITS = ["apple", "banana", "cherry", "date", "elderberry"];

export function IndexExplorerWidget() {
  const [indexText, setIndexText] = useState("0");
  // NaN when the input can't be read as a number.
  const [lookedUpIndex, setLookedUpIndex] = useState(0);

  function lookUp(text: string) {
    setLookedUpIndex(parseInt(text, 10));
  }

  const value = FRUITS[lookedUpIndex];
  const indexLabel = Number.isNaN(lookedUpIndex) ? "?" : lookedUpIndex;

  let resultText = "undefined";
  let note = `   // no item at index ${lookedUpIndex}. The last index is ${FRUITS.length - 1}`;
  if (value !== undefined) {
    resultText = formatValue(value);
    note = `   // item number ${lookedUpIndex + 1}`;
  }

  return (
    <>
      <p>
        Click any box, or type an index (try a big number or a negative one).
      </p>
      <Controls>
        <PlainCode>fruits[</PlainCode>
        <Input
          type="number"
          value={indexText}
          onChange={(event) => setIndexText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              lookUp(indexText);
            }
          }}
        />
        <PlainCode>]</PlainCode>
        <Button onClick={() => lookUp(indexText)}>Look up</Button>
      </Controls>
      <ArrayBoxes
        values={FRUITS}
        getCellState={(index) =>
          index === lookedUpIndex ? "current" : undefined
        }
        onCellClick={(index) => {
          setIndexText(String(index));
          lookUp(String(index));
        }}
      />
      <Readout>
        {`fruits[${indexLabel}]  →  `}
        <b>{resultText}</b>
        {note}
      </Readout>
    </>
  );
}
