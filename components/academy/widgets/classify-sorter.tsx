"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SorterCategory = {
  id: string;
  label: string;
};

export type SorterItem = {
  text: string;
  /** Shows the item in a code font. */
  isCode?: boolean;
  /** The id of the category this item belongs in. */
  answer: string;
  why: string;
};

type ClassifySorterProps = {
  intro: ReactNode;
  categories: SorterCategory[];
  items: SorterItem[];
};

/** "Guess first" cards: pick a category for each item, then see whether you were right and why. */
export function ClassifySorter({ intro, categories, items }: ClassifySorterProps) {
  // Item index → the category id the learner chose.
  const [guesses, setGuesses] = useState<Record<number, string>>({});

  let answeredCount = 0;
  let correctCount = 0;
  for (let index = 0; index < items.length; index++) {
    const guess = guesses[index];
    if (guess === undefined) {
      continue;
    }
    answeredCount++;
    if (guess === items[index].answer) {
      correctCount++;
    }
  }

  function choose(itemIndex: number, categoryId: string) {
    setGuesses({ ...guesses, [itemIndex]: categoryId });
  }

  function getCategoryLabel(categoryId: string): string {
    for (const category of categories) {
      if (category.id === categoryId) {
        return category.label;
      }
    }
    return categoryId;
  }

  return (
    <>
      <p>{intro}</p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2">
        {items.map((item, itemIndex) => {
          const guess = guesses[itemIndex];
          const hasGuessed = guess !== undefined;
          const isRight = guess === item.answer;

          return (
            <div
              key={item.text}
              className={cn(
                "rounded-[10px] border-[1.5px] border-border bg-surface px-3 py-2",
                hasGuessed && isRight && "border-good bg-good-soft",
                hasGuessed && !isRight && "border-bad bg-bad-soft"
              )}
            >
              <div className={cn("mb-2 text-[14.5px]", item.isCode && "font-mono text-[13.5px]")}>
                {item.text}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className={cn(
                      "h-auto px-2.5 py-1 text-[13px]",
                      guess === category.id && "bg-ink text-paper"
                    )}
                    aria-pressed={guess === category.id}
                    onClick={() => choose(itemIndex, category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
              {hasGuessed && (
                <div className="mt-2 text-[13.5px]">
                  <b>{isRight ? "✓ Right." : `✗ It's ${getCategoryLabel(item.answer)}.`}</b>{" "}
                  {item.why}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[14px] text-muted-foreground">
        {correctCount} of {items.length} right
        {answeredCount < items.length ? ` · ${items.length - answeredCount} still to sort` : ""}
        {answeredCount > 0 && (
          <>
            {" · "}
            <button
              type="button"
              className="cursor-pointer underline"
              onClick={() => setGuesses({})}
            >
              start again
            </button>
          </>
        )}
      </p>
    </>
  );
}
