"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Panel, PanelHeading } from "./content";
import { PageHeader } from "./page-header";
import { Quiz } from "./quiz";
import { CodeExercise } from "./code-exercise";
import { LEVELS } from "./course/levels";
import { isQuizComplete, type StageProgress } from "@/lib/academy/progress";
import type { Stage } from "@/lib/academy/types";

type StageViewProps = {
  stage: Stage;
  stageNumber: number;
  stageCountInLevel: number;
  previousStage: Stage | undefined;
  nextStage: Stage | undefined;
  stageProgress: StageProgress;
  /** The course's message for finishing this section, shown on its final stage. */
  levelFinishedMessage: string;
  onStageProgressChange: (update: (current: StageProgress) => StageProgress) => void;
  onGoPrevious: () => void;
  onGoNext: () => void;
  onFinishStage: () => void;
};

function getCompletionMessage(isLastInLevel: boolean, levelFinishedMessage: string): string {
  if (!isLastInLevel) {
    return "Ready for the next one?";
  }
  return levelFinishedMessage;
}

export function StageView({
  stage,
  stageNumber,
  stageCountInLevel,
  previousStage,
  nextStage,
  stageProgress,
  levelFinishedMessage,
  onStageProgressChange,
  onGoPrevious,
  onGoNext,
  onFinishStage,
}: StageViewProps) {
  const isLastInLevel = stageNumber === stageCountInLevel;
  const quizDone = isQuizComplete(stage, stageProgress);
  const codeDone = stageProgress.codePassed;
  const stageDone = quizDone && codeDone;
  const widget = stage.widget;

  let eyebrow = LEVELS[stage.level].name;
  if (stage.part) {
    eyebrow += " · " + stage.part;
  }
  eyebrow += ` · Stage ${stageNumber} of ${stageCountInLevel}`;

  function handleQuizAnswer(questionIndex: number, isCorrect: boolean) {
    onStageProgressChange((current) => {
      if (isCorrect) {
        return { ...current, quiz: { ...current.quiz, [questionIndex]: true } };
      }
      // Wrong answers only count until the question has been answered correctly.
      if (current.quiz[questionIndex] === true) {
        return current;
      }
      const wrongSoFar = current.wrongAnswers[questionIndex] ?? 0;
      return {
        ...current,
        wrongAnswers: { ...current.wrongAnswers, [questionIndex]: wrongSoFar + 1 },
      };
    });
  }

  // Hints, solutions and extra runs only affect the score before the challenge is passed.
  function markHintUsed() {
    onStageProgressChange((current) => {
      if (current.codePassed) {
        return current;
      }
      return { ...current, usedHint: true };
    });
  }

  function markSolutionShown(solution: string) {
    onStageProgressChange((current) => {
      if (current.codePassed) {
        return { ...current, draft: solution };
      }
      return { ...current, draft: solution, viewedSolution: true };
    });
  }

  function countRun() {
    onStageProgressChange((current) => {
      if (current.codePassed) {
        return current;
      }
      return { ...current, runs: current.runs + 1 };
    });
  }

  let nextLabel = "";
  if (nextStage) {
    const crossesIntoNextSection = nextStage.level !== stage.level;
    if (crossesIntoNextSection) {
      nextLabel = LEVELS[nextStage.level].name + ": ";
    }
    nextLabel += nextStage.short + " →";
  }

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={stage.title} lead={stage.lead} />

      <div className="mt-1 flex flex-wrap gap-4 text-[14px] text-muted-foreground">
        <span className={cn(quizDone && "font-semibold text-good")}>
          {quizDone ? "✓" : "○"} Quiz
        </span>
        <span className={cn(codeDone && "font-semibold text-good")}>
          {codeDone ? "✓" : "○"} Code challenge
        </span>
      </div>

      <Panel>
        <PanelHeading tag="LEARN">The idea</PanelHeading>
        {stage.lesson}
      </Panel>

      {widget && (
        <Panel>
          <PanelHeading tag="PLAY">{widget.title}</PanelHeading>
          <widget.Component />
        </Panel>
      )}

      <Panel>
        <PanelHeading tag="CHECK">Quick quiz</PanelHeading>
        <Quiz
          questions={stage.quiz}
          answeredCorrectly={stageProgress.quiz}
          onAnswer={handleQuizAnswer}
        />
      </Panel>

      <Panel>
        <PanelHeading tag="CODE">Your turn</PanelHeading>
        <CodeExercise
          exercise={stage.exercise}
          stageProgress={stageProgress}
          onDraftChange={(draft) =>
            onStageProgressChange((current) => ({ ...current, draft }))
          }
          onHintOpened={markHintUsed}
          onSolutionShown={markSolutionShown}
          onRunStarted={countRun}
          onPassed={() =>
            onStageProgressChange((current) => ({ ...current, codePassed: true }))
          }
        />
      </Panel>

      {stageDone && (
        <div className="my-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-good px-[22px] py-[18px] text-white">
          <div>
            <b className="text-[18px]">Stage complete!</b>
            <br />
            {getCompletionMessage(isLastInLevel, levelFinishedMessage)}
          </div>
          <Button variant="inverse" onClick={onFinishStage}>
            {isLastInLevel ? "See my results →" : "Next stage →"}
          </Button>
        </div>
      )}

      <div className="mt-[30px] flex justify-between">
        {previousStage ? (
          <Button variant="outline" onClick={onGoPrevious}>
            ← {previousStage.short}
          </Button>
        ) : (
          <span />
        )}
        {nextStage ? (
          <Button variant="outline" onClick={onGoNext}>
            {nextLabel}
          </Button>
        ) : (
          <span />
        )}
      </div>
    </>
  );
}
