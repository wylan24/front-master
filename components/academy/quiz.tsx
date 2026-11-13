"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { QuizQuestion as QuizQuestionData } from "@/lib/academy/types";

const OPTION_LETTERS = ["A", "B", "C", "D"];

type QuizProps = {
  questions: QuizQuestionData[];
  /** Question index → already answered correctly in a previous visit. */
  answeredCorrectly: Record<number, boolean>;
  onAnswer: (questionIndex: number, isCorrect: boolean) => void;
};

export function Quiz({ questions, answeredCorrectly, onAnswer }: QuizProps) {
  return (
    <div>
      {questions.map((question, questionIndex) => (
        <QuizQuestion
          key={questionIndex}
          number={questionIndex + 1}
          question={question}
          wasAnsweredCorrectly={answeredCorrectly[questionIndex] === true}
          onAnswer={(isCorrect) => onAnswer(questionIndex, isCorrect)}
        />
      ))}
    </div>
  );
}

function QuizQuestion({
  number,
  question,
  wasAnsweredCorrectly,
  onAnswer,
}: {
  number: number;
  question: QuizQuestionData;
  wasAnsweredCorrectly: boolean;
  onAnswer: (isCorrect: boolean) => void;
}) {
  // A question answered correctly before shows its right answer straight away.
  const [chosenIndex, setChosenIndex] = useState<number | null>(
    wasAnsweredCorrectly ? question.answerIndex : null
  );

  const hasChosen = chosenIndex !== null;
  const isCorrect = chosenIndex === question.answerIndex;

  function choose(optionIndex: number) {
    setChosenIndex(optionIndex);
    onAnswer(optionIndex === question.answerIndex);
  }

  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 font-semibold">
        {number}. {question.question}
      </div>
      <div className="grid gap-2">
        {question.options.map((option, optionIndex) => {
          const isChosen = optionIndex === chosenIndex;
          return (
            <button
              key={optionIndex}
              type="button"
              onClick={() => choose(optionIndex)}
              className={cn(
                "flex cursor-pointer items-center gap-[10px] rounded-[10px] border-[1.5px] border-border bg-white px-[14px] py-[10px] text-left text-[15px] hover:border-ink",
                isChosen && isCorrect && "border-good bg-good-soft hover:border-good",
                isChosen && !isCorrect && "border-bad bg-bad-soft hover:border-bad"
              )}
            >
              <span className="grid size-[22px] flex-none place-items-center rounded-md bg-background font-mono text-[12px]">
                {OPTION_LETTERS[optionIndex]}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
      {hasChosen && (
        <div
          className={cn(
            "mt-2 rounded-lg px-3 py-2 text-[14.5px]",
            isCorrect ? "bg-good-soft" : "bg-bad-soft"
          )}
        >
          {isCorrect ? (
            <>
              <b>Correct.</b> {question.explanation}
            </>
          ) : (
            <b>Not quite. Try again.</b>
          )}
        </div>
      )}
    </div>
  );
}
