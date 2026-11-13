"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Controls, Readout, VariableChip } from "../content";
import { formatValue } from "@/lib/academy/format";

/**
 * How `copy` was made from `original`:
 * - "none":      copy doesn't exist yet
 * - "reference": const copy = original                 (one object, two names)
 * - "shallow":   const copy = { ...original }          (new outer object, shared address)
 * - "deep":      const copy = structuredClone(original) (nothing shared)
 */
type CopyMode = "none" | "reference" | "shallow" | "deep";

type Person = { name: string; address: { city: string } };

type DemoState = {
  mode: CopyMode;
  original: Person;
  /** Copy's own data. Ignored for whichever parts are shared with original. */
  copy: Person;
  log: string[];
};

const STARTING_PERSON: Person = { name: "Ana", address: { city: "Oslo" } };

const INITIAL_STATE: DemoState = {
  mode: "none",
  original: STARTING_PERSON,
  copy: STARTING_PERSON,
  log: ['const original = { name: "Ana", address: { city: "Oslo" } };'],
};

const COPY_LINES: Record<Exclude<CopyMode, "none">, string> = {
  reference: "const copy = original;",
  shallow: "const copy = { ...original };",
  deep: "const copy = structuredClone(original);",
};

const NEW_NAMES = ["Bo", "Cy", "Dee", "Eli"];
const NEW_CITIES = ["Lima", "Rome", "Kyiv", "Pune"];

function sharesOuterObject(mode: CopyMode): boolean {
  return mode === "reference";
}

function sharesAddress(mode: CopyMode): boolean {
  return mode === "reference" || mode === "shallow";
}

export function ReferenceCopyWidget({ intro }: { intro: ReactNode }) {
  const [state, setState] = useState<DemoState>(INITIAL_STATE);
  const [changeCount, setChangeCount] = useState(0);

  const hasCopy = state.mode !== "none";
  const outerShared = sharesOuterObject(state.mode);
  const addressShared = sharesAddress(state.mode);

  // What each variable shows, following what is shared.
  const copyName = outerShared ? state.original.name : state.copy.name;
  const copyCity = addressShared ? state.original.address.city : state.copy.address.city;

  function makeCopy(mode: Exclude<CopyMode, "none">) {
    const freshCopy: Person = {
      name: state.original.name,
      address: { city: state.original.address.city },
    };
    setState({
      mode,
      original: state.original,
      copy: freshCopy,
      log: [INITIAL_STATE.log[0], COPY_LINES[mode]],
    });
  }

  function changeCopyName() {
    const newName = NEW_NAMES[changeCount % NEW_NAMES.length];
    setChangeCount(changeCount + 1);
    const line = `copy.name = "${newName}";`;

    if (outerShared) {
      setState({
        ...state,
        original: { ...state.original, name: newName },
        log: [...state.log, line + "   // original changed too!"],
      });
      return;
    }
    setState({
      ...state,
      copy: { ...state.copy, name: newName },
      log: [...state.log, line + "   // only copy changed"],
    });
  }

  function changeCopyCity() {
    const newCity = NEW_CITIES[changeCount % NEW_CITIES.length];
    setChangeCount(changeCount + 1);
    const line = `copy.address.city = "${newCity}";`;

    if (addressShared) {
      setState({
        ...state,
        original: { ...state.original, address: { city: newCity } },
        log: [...state.log, line + "   // original changed too!"],
      });
      return;
    }
    setState({
      ...state,
      copy: { ...state.copy, address: { city: newCity } },
      log: [...state.log, line + "   // only copy changed"],
    });
  }

  return (
    <>
      <p>{intro}</p>
      <Controls>
        <Button font="mono" onClick={() => makeCopy("reference")}>
          copy = original
        </Button>
        <Button font="mono" onClick={() => makeCopy("shallow")}>
          {"copy = { ...original }"}
        </Button>
        <Button font="mono" onClick={() => makeCopy("deep")}>
          copy = structuredClone(original)
        </Button>
      </Controls>
      <Controls>
        <Button font="mono" variant="outline" disabled={!hasCopy} onClick={changeCopyName}>
          change copy.name
        </Button>
        <Button font="mono" variant="outline" disabled={!hasCopy} onClick={changeCopyCity}>
          change copy.address.city
        </Button>
        <Button variant="outline" onClick={() => setState(INITIAL_STATE)}>
          Reset
        </Button>
      </Controls>

      <PersonRow
        label="original"
        outerBadge={1}
        addressBadge={1}
        name={state.original.name}
        city={state.original.address.city}
      />
      {hasCopy && (
        <PersonRow
          label="copy"
          outerBadge={outerShared ? 1 : 2}
          addressBadge={addressShared ? 1 : 2}
          name={copyName}
          city={copyCity}
        />
      )}

      <Readout>{state.log.join("\n")}</Readout>
      {hasCopy && (
        <p className="mt-3 mb-0 text-[14.5px]">
          {outerShared && "Both names point at one object, so every change shows up in both."}
          {state.mode === "shallow" &&
            "Spread made a new outer object, but address is still the same inner object. Changing name is safe; changing the city is not."}
          {state.mode === "deep" && "structuredClone copied every level, so the two are fully independent."}
        </p>
      )}
    </>
  );
}

function PersonRow({
  label,
  outerBadge,
  addressBadge,
  name,
  city,
}: {
  label: string;
  outerBadge: number;
  addressBadge: number;
  name: string;
  city: string;
}) {
  return (
    <div className="my-2 flex flex-wrap items-center gap-3 font-mono text-[14px]">
      <span className="min-w-[110px]">
        <VariableChip>
          <b>{label}</b>
        </VariableChip>
      </span>
      →
      <Badge variant={outerBadge === 1 ? "good" : "info"}>object #{outerBadge}</Badge>
      <span>
        {"{ name: "}
        <b>{formatValue(name)}</b>
        {", address: "}
      </span>
      <Badge variant={addressBadge === 1 ? "good" : "info"}>address #{addressBadge}</Badge>
      <span>
        {"{ city: "}
        <b>{formatValue(city)}</b>
        {" } }"}
      </span>
    </div>
  );
}
