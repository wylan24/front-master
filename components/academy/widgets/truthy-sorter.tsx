"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Candidate = {
  code: string;
  isTruthy: boolean;
  why: string;
};

// Every value here is checked by Boolean(value) in the lesson's terms.
const CANDIDATES: Candidate[] = [
  { code: "0", isTruthy: false, why: "Zero is one of the falsy values." },
  { code: '"0"', isTruthy: true, why: "A non-empty string is truthy, even if it says 0." },
  { code: '""', isTruthy: false, why: "The empty string is falsy." },
  { code: '" "', isTruthy: true, why: "A space is a character, so the string isn't empty." },
  { code: "[]", isTruthy: true, why: "Every array is truthy, even an empty one." },
  { code: "{}", isTruthy: true, why: "Every object is truthy, even an empty one." },
  { code: "null", isTruthy: false, why: "null means 'no value', so it's falsy." },
  { code: "undefined", isTruthy: false, why: "undefined is falsy." },
  { code: "NaN", isTruthy: false, why: "NaN ('not a number') is falsy." },
  { code: "-1", isTruthy: true, why: "Only 0 is falsy; every other number, negative included, is truthy." },
  { code: '"false"', isTruthy: true, why: "It's a non-empty string that happens to spell false." },
  { code: "false", isTruthy: false, why: "The boolean false is, of course, falsy." },
];

type Guess = "truthy" | "falsy";

export function TruthySorterWidget() {
  const [guesses, setGuesses] = useState<Record<string, Guess>>({});

  const answeredCount = Object.keys(guesses).length;
  let correctCount = 0;
  for (const candidate of CANDIDATES) {
    const guess = guesses[candidate.code];
    const expected: Guess = candidate.isTruthy ? "truthy" : "falsy";
    if (guess === expected) {
      correctCount++;
    }
  }

  return (
    <>
      <p>
        Sort each value: would <code>if (value)</code> run? Guess first; the
        card tells you why.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-2">
        {CANDIDATES.map((candidate) => {
          const guess = guesses[candidate.code];
          const expected: Guess = candidate.isTruthy ? "truthy" : "falsy";
          const hasGuessed = guess !== undefined;
          const isRight = guess === expected;
          return (
            <div
              key={candidate.code}
              className={cn(
                "rounded-[10px] border-[1.5px] border-border bg-surface px-3 py-2",
                hasGuessed && isRight && "border-good bg-good-soft",
                hasGuessed && !isRight && "border-bad bg-bad-soft"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <code className="bg-transparent p-0 text-[15px] font-semibold text-ink">
                  {candidate.code}
                </code>
                <span className="flex gap-1">
                  <Button
                    variant="outline"
                    className="px-2 py-1 text-[12.5px]"
                    onClick={() => setGuesses({ ...guesses, [candidate.code]: "truthy" })}
                  >
                    truthy
                  </Button>
                  <Button
                    variant="outline"
                    className="px-2 py-1 text-[12.5px]"
                    onClick={() => setGuesses({ ...guesses, [candidate.code]: "falsy" })}
                  >
                    falsy
                  </Button>
                </span>
              </div>
              {hasGuessed && (
                <div className="mt-1.5 text-[13.5px]">
                  <b>{isRight ? "Yes, " : "No, "}it&apos;s {expected}.</b> {candidate.why}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 mb-0 text-[14.5px]">
        {correctCount} of {answeredCount} guesses right · {CANDIDATES.length - answeredCount} left
      </p>
    </>
  );
}
