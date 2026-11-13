"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout } from "../content";
import { formatValue } from "@/lib/academy/format";

/** Turns "42" into the number 42, and leaves other text as a string. */
function parseItem(rawText: string): string | number {
  const asNumber = Number(rawText);
  if (Number.isNaN(asNumber)) {
    return rawText;
  }
  return asNumber;
}

export function BuildArrayWidget() {
  const [items, setItems] = useState<(string | number)[]>([
    "Aisha",
    "Ben",
    "Chen",
  ]);
  const [newItemText, setNewItemText] = useState("");

  function addItem() {
    const trimmed = newItemText.trim();
    if (trimmed === "") {
      return;
    }
    setItems([...items, parseItem(trimmed)]);
    setNewItemText("");
  }

  return (
    <>
      <p>
        Type a value and add it. Watch the boxes <em>and</em> the code update
        together.
      </p>
      <Controls>
        <Input
          type="text"
          placeholder="e.g. Dana or 42"
          maxLength={12}
          value={newItemText}
          onChange={(event) => setNewItemText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addItem();
            }
          }}
        />
        <Button onClick={addItem}>Add item</Button>
        <Button variant="outline" onClick={() => setItems([])}>
          Clear
        </Button>
      </Controls>
      <ArrayBoxes values={items} hideIndexes />
      <Readout>
        const myArray = <b>{formatValue(items)}</b>;
      </Readout>
    </>
  );
}
