"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Controls, Panel, PanelHeading, Tip } from "./content";
import { PageHeader } from "./page-header";
import { LEVELS } from "./course/levels";
import type { CourseLevelCopy } from "./course/courses";
import {
  getGrade,
  getOverallScoreColor,
  getStageScoreColor,
  scoreStage,
  type StageScore,
} from "@/lib/academy/scoring";
import type { Progress } from "@/lib/academy/progress";
import type { Level, Stage } from "@/lib/academy/types";

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const WEAK_SCORE = 70;
const STRONG_SCORE = 90;

type ResultsViewProps = {
  level: Level;
  levelStages: Stage[];
  progress: Progress;
  /** The course's grade wording and next-steps text for this section. */
  levelCopy: CourseLevelCopy;
  /** The section after this one, or undefined when this is the course's last section. */
  nextLevel: Level | undefined;
  /** Index into the full stage list of the next section's first stage (-1 if none). */
  nextLevelFirstStageIndex: number;
  getStageIndex: (stage: Stage) => number;
  onGoToStage: (stageIndex: number) => void;
  onRetake: () => void;
};

function sumOf(scores: StageScore[], pick: (score: StageScore) => number): number {
  let total = 0;
  for (const score of scores) {
    total += pick(score);
  }
  return total;
}

export function ResultsView({
  level,
  levelStages,
  progress,
  levelCopy,
  nextLevel,
  nextLevelFirstStageIndex,
  getStageIndex,
  onGoToStage,
  onRetake,
}: ResultsViewProps) {
  const [isConfirmingRetake, setIsConfirmingRetake] = useState(false);

  const levelInfo = LEVELS[level];
  const levelNameLower = levelInfo.name.toLowerCase();
  const levelTitleLower = levelInfo.title.toLowerCase();

  const scores: StageScore[] = [];
  for (const stage of levelStages) {
    scores.push(scoreStage(stage, progress));
  }

  const overallPercent = Math.round(
    sumOf(scores, (s) => s.score) / scores.length
  );
  const grade = getGrade(overallPercent, levelCopy.topGrade);

  const questionTotal = sumOf(scores, (s) => s.questionCount);
  const firstTryTotal = sumOf(scores, (s) => s.firstTryCount);
  const solvedWithoutSolution = scores.filter(
    (s) => s.stageProgress.codePassed && !s.stageProgress.viewedSolution
  ).length;
  const hintsUsed = scores.filter((s) => s.stageProgress.usedHint).length;
  const totalRuns = sumOf(scores, (s) => s.stageProgress.runs);
  const weakScores = scores.filter((s) => s.score < WEAK_SCORE);
  const strongStageNames = scores
    .filter((s) => s.score >= STRONG_SCORE)
    .map((s) => s.stage.short);
  const skippedCount = scores.filter((s) => !s.done).length;

  function handleRetakeClick() {
    if (isConfirmingRetake) {
      onRetake();
      return;
    }
    setIsConfirmingRetake(true);
  }

  return (
    <>
      <PageHeader
        eyebrow={`${levelInfo.title} complete`}
        title={`Your ${levelNameLower} results`}
        lead={`How you did across the ${levelStages.length} ${levelNameLower} stages. You score higher for answering quizzes right first time and for solving challenges without hints or the solution.`}
      />

      {skippedCount > 0 && (
        <Tip>
          You finished the final challenge but skipped {skippedCount} stage
          {skippedCount > 1 ? "s" : ""}. Those count as 0 until you complete
          them.
        </Tip>
      )}

      <Panel className="flex flex-wrap items-center gap-[26px]">
        <ScoreRing percent={overallPercent} />
        <div>
          <div className="text-[26px] font-bold tracking-[-.02em]">
            {grade.emoji} {grade.title}
          </div>
          <p className="mt-1.5 mb-0 text-body-ink">{grade.message}</p>
          {strongStageNames.length > 0 && (
            <p className="mt-[10px] mb-0 text-[14.5px]">
              <b>Strongest:</b> {strongStageNames.join(", ")}
            </p>
          )}
        </div>
      </Panel>

      <div className="my-5 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3">
        <Stat value={`${firstTryTotal}/${questionTotal}`} label="quiz questions right first try" />
        <Stat
          value={`${solvedWithoutSolution}/${levelStages.length}`}
          label="challenges solved without the solution"
        />
        <Stat value={String(hintsUsed)} label="hints used" />
        <Stat value={String(totalRuns)} label="code runs in total" />
      </div>

      <Panel>
        <PanelHeading tag="BREAKDOWN">Stage by stage</PanelHeading>
        <div className="grid gap-0.5 text-[14.5px]">
          <div className="hidden grid-cols-[1.3fr_1fr_1.6fr_1fr] items-center gap-3 border-b border-border px-1.5 py-[9px] text-[12px] font-semibold tracking-[.06em] text-muted-foreground uppercase min-[641px]:grid">
            <span>Stage</span>
            <span>Quiz</span>
            <span>Code challenge</span>
            <span>Score</span>
          </div>
          {scores.map((score, index) => (
            <div
              key={score.stage.id}
              className="grid grid-cols-2 items-center gap-3 border-b border-border px-1.5 py-[9px] min-[641px]:grid-cols-[1.3fr_1fr_1.6fr_1fr]"
            >
              <span>
                <b>{index + 1}.</b> {score.stage.short}
              </span>
              <span>
                {score.firstTryCount}/{score.questionCount} first try
              </span>
              <span className="text-muted-foreground">{score.codeNote}</span>
              <span className="flex items-center gap-2 font-mono">
                <span className="h-2 min-w-10 flex-1 overflow-hidden rounded-full bg-line">
                  <i
                    className="block h-full"
                    style={{
                      width: `${score.score}%`,
                      background: getStageScoreColor(score.score),
                    }}
                  />
                </span>
                <b>{score.score}</b>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 mb-0 text-[13px] text-muted-foreground">
          Each stage is worth 100: 50 for the quiz (full marks for right first
          time, half after one wrong answer) and 50 for the code challenge (−10
          for a hint, −5 per extra run, capped at −20; 10 if you viewed the
          solution first).
        </p>
      </Panel>

      {weakScores.length > 0 && (
        <Panel>
          <PanelHeading tag="REVIEW">Worth another look</PanelHeading>
          <p>
            You scored under 70 on these stages. Reopen them and try the
            challenge again from scratch (use “Reset code”).
          </p>
          <Controls>
            {weakScores.map((score) => (
              <Button
                key={score.stage.id}
                variant="outline"
                onClick={() => onGoToStage(getStageIndex(score.stage))}
              >
                {levelStages.indexOf(score.stage) + 1}. {score.stage.short} (
                {score.score})
              </Button>
            ))}
          </Controls>
        </Panel>
      )}

      {nextLevel === undefined ? (
        <Panel>
          <PanelHeading tag="NEXT">Where to go from here</PanelHeading>
          {levelCopy.nextSteps}
        </Panel>
      ) : (
        <Panel>
          <PanelHeading tag="NEXT">Ready for more?</PanelHeading>
          {levelCopy.nextSteps}
          <Controls>
            <Button
              variant="brand"
              onClick={() => onGoToStage(nextLevelFirstStageIndex)}
            >
              Start the {LEVELS[nextLevel].title.toLowerCase()} →
            </Button>
          </Controls>
        </Panel>
      )}

      <Controls>
        <Button variant="brand" onClick={handleRetakeClick}>
          {isConfirmingRetake
            ? `Click again to clear ${levelNameLower} progress and retake`
            : `Retake the ${levelTitleLower}`}
        </Button>
        <Button
          variant="outline"
          onClick={() => onGoToStage(getStageIndex(levelStages[0]))}
        >
          Back to stage 1
        </Button>
      </Controls>
    </>
  );
}

function ScoreRing({ percent }: { percent: number }) {
  const dashOffset = RING_CIRCUMFERENCE * (1 - percent / 100);

  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      role="img"
      aria-label={`Overall score ${percent}%`}
    >
      <circle
        cx="70"
        cy="70"
        r={RING_RADIUS}
        fill="none"
        stroke="var(--line)"
        strokeWidth="14"
      />
      <circle
        cx="70"
        cy="70"
        r={RING_RADIUS}
        fill="none"
        stroke={getOverallScoreColor(percent)}
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        transform="rotate(-90 70 70)"
      />
      <text
        x="70"
        y="78"
        textAnchor="middle"
        className="font-sans"
        fontWeight="700"
        fontSize="32"
        fill="var(--ink)"
      >
        {percent}%
      </text>
    </svg>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[14px] border border-border bg-card px-4 py-[14px]">
      <div className="font-mono text-[26px] font-bold tracking-[-.03em]">
        {value}
      </div>
      <div className="text-[13px] text-muted-foreground">{label}</div>
    </div>
  );
}
