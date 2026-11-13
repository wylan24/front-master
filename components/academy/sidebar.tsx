"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { LEVELS } from "./course/stages";
import type { Level, Stage } from "@/lib/academy/types";

const RESET_CONFIRM_TIMEOUT_MILLISECONDS = 3000;

export type SidebarStageItem = {
  stage: Stage;
  stageIndex: number;
  numberInLevel: number;
  isActive: boolean;
  isDone: boolean;
  isLocked: boolean;
};

export type SidebarLevelGroup = {
  level: Level;
  isLocked: boolean;
  items: SidebarStageItem[];
  showResultsLink: boolean;
  isResultsActive: boolean;
};

type SidebarProps = {
  groups: SidebarLevelGroup[];
  doneCount: number;
  stageCount: number;
  onSelectStage: (stageIndex: number) => void;
  onSelectResults: (level: Level) => void;
  onResetProgress: () => void;
};

export function Sidebar({
  groups,
  doneCount,
  stageCount,
  onSelectStage,
  onSelectResults,
  onResetProgress,
}: SidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // The "click again to confirm" state quietly expires after 3 seconds.
  useEffect(() => {
    if (!isConfirmingReset) {
      return;
    }
    const timeoutId = setTimeout(() => {
      setIsConfirmingReset(false);
    }, RESET_CONFIRM_TIMEOUT_MILLISECONDS);
    return () => clearTimeout(timeoutId);
  }, [isConfirmingReset]);

  function handleResetClick() {
    if (isConfirmingReset) {
      setIsConfirmingReset(false);
      onResetProgress();
      return;
    }
    setIsConfirmingReset(true);
  }

  function selectStage(stageIndex: number) {
    setIsMenuOpen(false);
    onSelectStage(stageIndex);
  }

  function selectResults(level: Level) {
    setIsMenuOpen(false);
    onSelectResults(level);
  }

  const percentDone = (doneCount / stageCount) * 100;

  return (
    <aside className="relative border-b border-border bg-card px-4 py-[22px] min-[821px]:sticky min-[821px]:top-0 min-[821px]:h-screen min-[821px]:overflow-auto min-[821px]:border-r min-[821px]:border-b-0">
      <div className="flex items-center gap-2 text-[20px] font-bold tracking-[-.02em]">
        <span className="rounded-lg bg-ink px-[7px] py-0.5 font-mono text-[15px] text-highlight">
          [ ]
        </span>{" "}
        Array Academy
      </div>
      <div className="mt-1 mb-[18px] text-[13px] text-muted-foreground">
        Arrays from zero to advanced, in JavaScript
      </div>

      <Progress value={percentDone} aria-label="Course progress" className="mb-1.5" />
      <div className="mb-[18px] text-[12px] text-muted-foreground">
        {doneCount} of {stageCount} stages complete
      </div>

      <Button
        variant="outline"
        className="mb-2 min-[821px]:hidden"
        aria-expanded={isMenuOpen}
        aria-controls="stage-nav"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? "Hide stages" : "Show stages"}
      </Button>

      <nav
        id="stage-nav"
        aria-label="Stages"
        className={cn("min-[821px]:block", isMenuOpen ? "block" : "hidden")}
      >
        {groups.map((group, groupIndex) => (
          <div key={group.level}>
            <div
              className={cn(
                "mx-[10px] mb-1.5 text-[11.5px] font-bold tracking-[.1em] text-muted-foreground uppercase",
                groupIndex === 0 ? "mt-0" : "mt-4"
              )}
            >
              {LEVELS[group.level].name}
              {group.isLocked && <span> 🔒</span>}
            </div>

            {group.items.map((item, itemIndex) => {
              const previousPart = group.items[itemIndex - 1]?.stage.part;
              const startsNewPart =
                item.stage.part !== undefined && item.stage.part !== previousPart;

              return (
                <div key={item.stage.id}>
                  {startsNewPart && (
                    <div className="mx-[10px] mt-2 mb-1 font-mono text-[12px] text-brand">
                      {item.stage.part}
                    </div>
                  )}
                  <NavItem
                    isActive={item.isActive}
                    isLocked={item.isLocked}
                    dot={item.isDone ? "✓" : String(item.numberInLevel)}
                    isDone={item.isDone}
                    onClick={() => selectStage(item.stageIndex)}
                  >
                    {item.stage.short}
                  </NavItem>
                </div>
              );
            })}

            {group.showResultsLink && (
              <NavItem
                isActive={group.isResultsActive}
                isLocked={false}
                dot="★"
                isDone={false}
                onClick={() => selectResults(group.level)}
              >
                {LEVELS[group.level].name} results
              </NavItem>
            )}
          </div>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleResetClick}
        className="inline cursor-pointer text-[12px] text-muted-foreground underline"
      >
        {isConfirmingReset ? "Click again to confirm reset" : "Reset my progress"}
      </button>
    </aside>
  );
}

function NavItem({
  isActive,
  isLocked,
  isDone,
  dot,
  onClick,
  children,
}: {
  isActive: boolean;
  isLocked: boolean;
  isDone: boolean;
  dot: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "mb-0.5 flex w-full cursor-pointer items-center gap-[10px] rounded-[10px] px-[10px] py-[9px] text-left text-[14.5px] hover:bg-background",
        isActive && "bg-ink text-white hover:bg-ink",
        isLocked && "opacity-50"
      )}
    >
      <span
        className={cn(
          "grid size-6 flex-none place-items-center rounded-full border-2 border-line font-mono text-[12px]",
          isActive && "border-white",
          isDone && "border-good bg-good text-white"
        )}
      >
        {dot}
      </span>
      <span>{children}</span>
    </button>
  );
}
