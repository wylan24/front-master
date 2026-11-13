"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout } from "../content";
import { formatValue } from "@/lib/academy/format";

const PET_POOL = ["cat", "dog", "fish", "owl", "frog", "yak", "emu", "bee"];

export function LengthVisualiserWidget() {
  const [pets, setPets] = useState(["cat", "dog", "fish", "owl"]);

  const length = pets.length;
  const lastIndex = length - 1;
  const lastItemText = length > 0 ? formatValue(pets[lastIndex]) : "undefined";

  function addPet() {
    setPets([...pets, PET_POOL[pets.length]]);
  }

  function removePet() {
    setPets(pets.slice(0, -1));
  }

  return (
    <>
      <p>
        Add and remove items. The last item stays highlighted, and the formula
        keeps working.
      </p>
      <Controls>
        <Button onClick={addPet} disabled={length >= PET_POOL.length}>
          + Add item
        </Button>
        <Button variant="outline" onClick={removePet} disabled={length === 0}>
          − Remove item
        </Button>
      </Controls>
      <ArrayBoxes
        values={pets}
        getCellState={(index) => (index === lastIndex ? "current" : undefined)}
      />
      <Readout>
        {"pets.length               → "}
        <b>{length}</b>
        {"\nlast index = length - 1    → "}
        <b>{lastIndex}</b>
        {"\npets[pets.length - 1]      → "}
        <b>{lastItemText}</b>
      </Readout>
    </>
  );
}
