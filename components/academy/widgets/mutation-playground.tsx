"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrayBoxes } from "../array-boxes";
import { Controls, Readout } from "../content";
import { formatValue } from "@/lib/academy/format";

const NEW_PET_POOL = ["owl", "frog", "yak", "emu", "bee", "ant", "koi", "elk"];
const NO_HIGHLIGHT = -1;

type Operation = "push" | "pop" | "unshift" | "shift";

export function MutationPlaygroundWidget() {
  const [pets, setPets] = useState(["cat", "dog", "fish"]);
  const [poolPosition, setPoolPosition] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(NO_HIGHLIGHT);
  const [assignIndexText, setAssignIndexText] = useState("0");
  const [assignValue, setAssignValue] = useState("lion");
  const [output, setOutput] = useState<ReactNode>("// press a button");

  function takeNextPet(): string {
    const pet = NEW_PET_POOL[poolPosition % NEW_PET_POOL.length];
    setPoolPosition(poolPosition + 1);
    return pet;
  }

  function showResult(line: string, nextPets: string[], returnNote: string) {
    setOutput(
      <>
        {line}
        {"\n// pets is now "}
        <b>{formatValue(nextPets)}</b>
        {returnNote}
      </>
    );
  }

  function runOperation(operation: Operation) {
    const nextPets = [...pets];
    let line = "";
    let returnedValue: unknown;
    let returnMeaning = "";

    if (operation === "push") {
      const pet = takeNextPet();
      nextPets.push(pet);
      setHighlightedIndex(nextPets.length - 1);
      line = `pets.push("${pet}")`;
      returnedValue = nextPets.length;
      returnMeaning = "  (the new length)";
    }

    if (operation === "pop") {
      returnedValue = nextPets.pop();
      setHighlightedIndex(NO_HIGHLIGHT);
      line = "pets.pop()";
      returnMeaning = "  (the removed item)";
    }

    if (operation === "unshift") {
      const pet = takeNextPet();
      nextPets.unshift(pet);
      setHighlightedIndex(0);
      line = `pets.unshift("${pet}")`;
      returnedValue = nextPets.length;
      returnMeaning = "  (the new length)";
    }

    if (operation === "shift") {
      returnedValue = nextPets.shift();
      setHighlightedIndex(NO_HIGHLIGHT);
      line = "pets.shift()";
      returnMeaning = "  (the removed item)";
    }

    const returnedText =
      returnedValue === undefined ? "undefined" : formatValue(returnedValue);
    setPets(nextPets);
    showResult(line, nextPets, `\n// returned: ${returnedText}${returnMeaning}`);
  }

  function assignAtIndex() {
    const index = parseInt(assignIndexText, 10);
    const isValidIndex = !Number.isNaN(index) && index >= 0 && index <= 9;
    if (!isValidIndex) {
      setOutput("// pick an index from 0 to 9 for this demo");
      return;
    }

    const nextPets = [...pets];
    nextPets[index] = assignValue;
    // Assigning past the end leaves gaps; show them as "(empty)".
    for (let position = 0; position < nextPets.length; position++) {
      if (nextPets[position] === undefined) {
        nextPets[position] = "(empty)";
      }
    }

    setPets(nextPets);
    setHighlightedIndex(index);
    showResult(`pets[${index}] = "${assignValue}"`, nextPets, "");
  }

  return (
    <>
      <p>
        Press the buttons and read the line of code each one runs. Watch the
        index numbers move with shift/unshift.
      </p>
      <Controls>
        <Button font="mono" onClick={() => runOperation("push")}>
          push()
        </Button>
        <Button font="mono" variant="outline" onClick={() => runOperation("pop")}>
          pop()
        </Button>
        <Button font="mono" onClick={() => runOperation("unshift")}>
          unshift()
        </Button>
        <Button
          font="mono"
          variant="outline"
          onClick={() => runOperation("shift")}
        >
          shift()
        </Button>
      </Controls>
      <Controls>
        {"pets["}
        <Input
          type="number"
          value={assignIndexText}
          onChange={(event) => setAssignIndexText(event.target.value)}
        />
        {'] = "'}
        <Input
          type="text"
          className="w-[110px]"
          value={assignValue}
          onChange={(event) => setAssignValue(event.target.value)}
        />
        {'"'}
        <Button font="mono" variant="brand" onClick={assignAtIndex}>
          assign
        </Button>
      </Controls>
      <ArrayBoxes
        values={pets}
        getCellState={(index) =>
          index === highlightedIndex ? "current" : undefined
        }
      />
      <Readout>{output}</Readout>
    </>
  );
}
