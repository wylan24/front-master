"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { LEVELS } from "./course/levels";
import type { Course } from "./course/courses";
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
  course: Course;
  groups: SidebarLevelGroup[];
  doneCount: number;
  stageCount: number;
  onSelectStage: (stageIndex: number) => void;
  onSelectResults: (level: Level) => void;
  onResetProgress: () => void;
};

export function Sidebar({
  course,
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
      <div className="mb-3 flex items-center justify-between gap-2">
        <Link
          href="/"
          className="rounded-sm text-[13px] text-muted-foreground underline-offset-2 hover:text-ink hover:underline focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          ← All courses
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex items-center gap-2 text-[20px] font-bold tracking-[-.02em]">
        <span className="rounded-lg bg-code px-[7px] py-0.5 font-mono text-[15px] text-highlight">
          {course.logo}
        </span>{" "}
        {course.title}
      </div>
      <div className="mt-1 mb-[18px] text-[13px] text-muted-foreground">
        {course.tagline}
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
            <SectionHeader group={group} isFirst={groupIndex === 0} />

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

type SectionStyle = {
  effort: string;
  /** How many of the five bar segments are filled. */
  filledSegments: number;
  fillClass: string;
  inkClass: string;
};

// The same wording and colours as the section rows on the course cards
// (components/catalog/course-progress.tsx), so a section looks the same
// on the homepage and inside the course.
const SECTION_STYLE: Record<Level, SectionStyle> = {
  basic: {
    effort: "Gentle start",
    filledSegments: 1,
    fillClass: "bg-difficulty-easy",
    inkClass: "text-difficulty-easy-ink",
  },
  mid: {
    effort: "Steady practice",
    filledSegments: 3,
    fillClass: "bg-difficulty-medium",
    inkClass: "text-difficulty-medium-ink",
  },
  adv: {
    effort: "Real challenge",
    filledSegments: 5,
    fillClass: "bg-difficulty-hard",
    inkClass: "text-difficulty-hard-ink",
  },
};

const SECTION_SEGMENT_COUNT = 5;

function countDoneItems(group: SidebarLevelGroup): number {
  let doneCount = 0;
  for (const item of group.items) {
    if (item.isDone) {
      doneCount++;
    }
  }
  return doneCount;
}

/** A section's name, difficulty and progress, shown above its stages. */
function SectionHeader({ group, isFirst }: { group: SidebarLevelGroup; isFirst: boolean }) {
  const style = SECTION_STYLE[group.level];
  const doneCount = countDoneItems(group);

  const segments: boolean[] = [];
  for (let index = 0; index < SECTION_SEGMENT_COUNT; index++) {
    segments.push(index < style.filledSegments);
  }

  return (
    <div
      className={cn(
        "mx-[10px] mb-2",
        isFirst ? "mt-0" : "mt-5 border-t border-border pt-4"
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[14px] font-bold">
          {LEVELS[group.level].name}
          {group.isLocked && <span aria-label="locked"> 🔒</span>}
        </span>
        <span className={cn("text-[12px] font-semibold", style.inkClass)}>{style.effort}</span>
      </div>
      <div className="mt-1.5 flex gap-1" aria-hidden="true">
        {segments.map((isFilled, index) => (
          <span
            key={index}
            className={cn("h-1 flex-1 rounded-full", isFilled ? style.fillClass : "bg-line")}
          />
        ))}
      </div>
      <div className="mt-1 text-[12px] text-muted-foreground">
        {doneCount} of {group.items.length} stages
      </div>
    </div>
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
        isActive && "bg-ink text-paper hover:bg-ink",
        isLocked && "opacity-50"
      )}
    >
      <span
        className={cn(
          "grid size-6 flex-none place-items-center rounded-full border-2 border-line font-mono text-[12px]",
          isActive && "border-paper",
          isDone && "border-good bg-good text-white"
        )}
      >
        {dot}
      </span>
      <span>{children}</span>
    </button>
  );
}
