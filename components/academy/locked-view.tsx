import { Button } from "@/components/ui/button";
import { Controls, Panel } from "./content";
import { PageHeader } from "./page-header";

type LockedViewProps = {
  beginnerDoneCount: number;
  beginnerStageCount: number;
  onContinueBeginner: () => void;
  onSkipAhead: () => void;
};

/** Shown instead of an advanced stage until the beginner course is finished. */
export function LockedView({
  beginnerDoneCount,
  beginnerStageCount,
  onContinueBeginner,
  onSkipAhead,
}: LockedViewProps) {
  return (
    <>
      <PageHeader
        eyebrow="Advanced section"
        title="🔒 Finish the beginner course first"
        lead="The advanced section builds on everything from the beginner stages. It unlocks when you pass the beginner final challenge."
      />
      <Panel>
        <p>
          You&apos;re at{" "}
          <b>
            {beginnerDoneCount} of {beginnerStageCount}
          </b>{" "}
          beginner stages. If you already know the basics, you can skip ahead.
          Your beginner progress won&apos;t be affected.
        </p>
        <Controls>
          <Button variant="brand" onClick={onContinueBeginner}>
            Continue the beginner course
          </Button>
          <Button variant="outline" onClick={onSkipAhead}>
            Skip ahead anyway
          </Button>
        </Controls>
      </Panel>
    </>
  );
}
