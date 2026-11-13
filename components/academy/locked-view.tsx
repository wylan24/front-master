import { Button } from "@/components/ui/button";
import { Controls, Panel } from "./content";
import { PageHeader } from "./page-header";
import { LEVELS } from "./course/levels";
import type { Level } from "@/lib/academy/types";

type LockedViewProps = {
  /** The section the learner tried to open. */
  lockedLevel: Level;
  /** The section whose final challenge unlocks it. */
  requiredLevel: Level;
  requiredDoneCount: number;
  requiredStageCount: number;
  onContinueRequired: () => void;
  onSkipAhead: () => void;
};

/** Shown instead of a stage until the section before it is finished. */
export function LockedView({
  lockedLevel,
  requiredLevel,
  requiredDoneCount,
  requiredStageCount,
  onContinueRequired,
  onSkipAhead,
}: LockedViewProps) {
  const locked = LEVELS[lockedLevel];
  const required = LEVELS[requiredLevel];
  const requiredNameLower = required.name.toLowerCase();
  const requiredTitleLower = required.title.toLowerCase();

  let alreadyKnown = "this material";
  if (requiredLevel === "basic") {
    alreadyKnown = "the basics";
  }

  return (
    <>
      <PageHeader
        eyebrow={locked.title}
        title={`🔒 Finish the ${requiredTitleLower} first`}
        lead={`The ${locked.title.toLowerCase()} builds on everything from the ${requiredNameLower} stages. It unlocks when you pass the ${requiredNameLower} final challenge.`}
      />
      <Panel>
        <p>
          You&apos;re at{" "}
          <b>
            {requiredDoneCount} of {requiredStageCount}
          </b>{" "}
          {requiredNameLower} stages. If you already know {alreadyKnown}, you
          can skip ahead. Your {requiredNameLower} progress won&apos;t be
          affected.
        </p>
        <Controls>
          <Button variant="brand" onClick={onContinueRequired}>
            Continue the {requiredTitleLower}
          </Button>
          <Button variant="outline" onClick={onSkipAhead}>
            Skip ahead anyway
          </Button>
        </Controls>
      </Panel>
    </>
  );
}
