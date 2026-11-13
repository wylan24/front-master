"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ObjectBoxes, type PropertyState } from "../object-boxes";
import { Controls, Readout } from "../content";
import { formatValue } from "@/lib/academy/format";

type PropertyValue = string | number | boolean;

type PropertyPlaygroundProps = {
  intro: ReactNode;
  variableName: string;
  initial: Record<string, PropertyValue>;
  /** Show the bracket-notation row (reading with a key stored in a variable). */
  showBrackets?: boolean;
  /** Show the "delete" button. */
  showDelete?: boolean;
};

const VALID_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** Typed text becomes a number or boolean when it looks like one, like JavaScript literals. */
function parseTypedValue(text: string): PropertyValue {
  const trimmed = text.trim();
  if (trimmed === "true") {
    return true;
  }
  if (trimmed === "false") {
    return false;
  }
  const asNumber = Number(trimmed);
  if (trimmed !== "" && !Number.isNaN(asNumber)) {
    return asNumber;
  }
  return trimmed;
}

/** Hands-on reading, adding, changing and deleting properties on one object. */
export function PropertyPlayground({
  intro,
  variableName,
  initial,
  showBrackets = false,
  showDelete = false,
}: PropertyPlaygroundProps) {
  const [properties, setProperties] = useState<Record<string, PropertyValue>>(initial);
  const [keyText, setKeyText] = useState(Object.keys(initial)[0] ?? "name");
  const [valueText, setValueText] = useState("");
  const [bracketKeyText, setBracketKeyText] = useState(Object.keys(initial)[1] ?? "");
  const [highlight, setHighlight] = useState<{ key: string; state: PropertyState } | null>(null);
  const [output, setOutput] = useState<ReactNode>("// pick a key and press a button");

  const key = keyText.trim();
  const isDotFriendly = VALID_IDENTIFIER.test(key);

  function describeAccess(propertyKey: string): string {
    if (VALID_IDENTIFIER.test(propertyKey)) {
      return `${variableName}.${propertyKey}`;
    }
    return `${variableName}["${propertyKey}"]`;
  }

  function readProperty(propertyKey: string, line: string) {
    const exists = Object.hasOwn(properties, propertyKey);
    if (!exists) {
      setHighlight(null);
      setOutput(
        <>
          {line}
          {"\n// → "}
          <b>undefined</b>
          {"  (no property with that key, and no error either)"}
        </>
      );
      return;
    }
    setHighlight({ key: propertyKey, state: "current" });
    setOutput(
      <>
        {line}
        {"\n// → "}
        <b>{formatValue(properties[propertyKey])}</b>
      </>
    );
  }

  function readWithDot() {
    if (key === "") {
      setOutput("// type a key first");
      return;
    }
    if (!isDotFriendly) {
      setOutput(
        `// ${variableName}.${key} is a syntax error: dots only work with simple names.\n// Use brackets instead: ${variableName}["${key}"]`
      );
      setHighlight(null);
      return;
    }
    readProperty(key, `${variableName}.${key}`);
  }

  function readWithBrackets() {
    const bracketKey = bracketKeyText.trim();
    readProperty(
      bracketKey,
      `const key = "${bracketKey}";\n${variableName}[key]   // same as ${describeAccess(bracketKey)}`
    );
  }

  function setProperty() {
    if (key === "") {
      setOutput("// type a key first");
      return;
    }
    const value = parseTypedValue(valueText);
    const existed = Object.hasOwn(properties, key);
    setProperties({ ...properties, [key]: value });
    setHighlight({ key, state: existed ? "current" : "added" });

    const what = existed ? "changed an existing property" : "added a brand-new property";
    setOutput(`${describeAccess(key)} = ${formatValue(value)};\n// ${what}`);
  }

  function deleteProperty() {
    if (!Object.hasOwn(properties, key)) {
      setOutput(
        `delete ${describeAccess(key)};\n// nothing to delete, but no error: delete still returns true`
      );
      return;
    }
    const remaining = { ...properties };
    delete remaining[key];
    setProperties(remaining);
    setHighlight(null);
    setOutput(`delete ${describeAccess(key)};\n// the key and its value are both gone`);
  }

  return (
    <>
      <p>{intro}</p>
      <Controls>
        <span className="font-mono text-[14px]">{variableName}.</span>
        <Input
          type="text"
          aria-label="Property key"
          className="w-[130px]"
          value={keyText}
          onChange={(event) => setKeyText(event.target.value)}
        />
        <Button font="mono" variant="outline" onClick={readWithDot}>
          read
        </Button>
        <span className="font-mono text-[14px]">=</span>
        <Input
          type="text"
          aria-label="New value"
          placeholder="value"
          className="w-[120px]"
          value={valueText}
          onChange={(event) => setValueText(event.target.value)}
        />
        <Button font="mono" onClick={setProperty}>
          set
        </Button>
        {showDelete && (
          <Button font="mono" variant="outline" onClick={deleteProperty}>
            delete
          </Button>
        )}
      </Controls>
      {showBrackets && (
        <Controls>
          <span className="font-mono text-[14px]">const key = &quot;</span>
          <Input
            type="text"
            aria-label="Key stored in a variable"
            className="w-[130px]"
            value={bracketKeyText}
            onChange={(event) => setBracketKeyText(event.target.value)}
          />
          <span className="font-mono text-[14px]">&quot;; {variableName}[key]</span>
          <Button font="mono" variant="brand" onClick={readWithBrackets}>
            read with [ ]
          </Button>
        </Controls>
      )}
      <ObjectBoxes
        name={variableName}
        entries={Object.entries(properties)}
        getPropertyState={(propertyKey) =>
          highlight !== null && highlight.key === propertyKey ? highlight.state : undefined
        }
      />
      <Readout>{output}</Readout>
    </>
  );
}
