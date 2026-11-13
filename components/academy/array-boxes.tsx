import { cn } from "@/lib/utils";
import { formatValue } from "@/lib/academy/format";

/**
 * How a single box is highlighted:
 * - current: the item being looked at (yellow, lifted)
 * - match:   passed a test / found (green)
 * - miss:    failed a test (red)
 * - dim:     already checked, faded
 * - output:  part of a result array (blue)
 */
export type CellState = "current" | "match" | "miss" | "dim" | "output";

type ArrayBoxesProps = {
  values: unknown[];
  getCellState?: (index: number) => CellState | undefined;
  onCellClick?: (index: number) => void;
  hideIndexes?: boolean;
};

const BOX_STATE_CLASS: Record<CellState, string> = {
  current: "-translate-y-1 bg-highlight shadow-[0_4px_0_var(--ink)]",
  match: "border-good bg-good text-white",
  miss: "border-bad bg-bad text-white",
  dim: "opacity-35",
  output: "border-info bg-info-soft",
};

export function ArrayBoxes({
  values,
  getCellState,
  onCellClick,
  hideIndexes = false,
}: ArrayBoxesProps) {
  const isClickable = onCellClick !== undefined;

  return (
    <div className="mt-[14px] mb-[6px] flex min-h-[92px] flex-wrap items-start gap-2">
      {values.length === 0 && (
        <div className="py-[18px] font-mono text-muted-foreground">
          [ ] ← empty array, length 0
        </div>
      )}

      {values.map((value, index) => {
        const state = getCellState ? getCellState(index) : undefined;
        const boxClassName = cn(
          "grid h-[58px] min-w-[72px] place-items-center rounded-[10px] border-[2.5px] border-ink bg-white px-[10px] font-mono text-[15px] font-semibold transition-all duration-200",
          isClickable &&
            "cursor-pointer hover:-translate-y-[3px] hover:shadow-[0_4px_0_var(--ink)]",
          state && BOX_STATE_CLASS[state]
        );

        return (
          <div
            key={index}
            className="flex animate-pop flex-col items-center gap-1.5"
          >
            {isClickable ? (
              <button
                type="button"
                className={boxClassName}
                onClick={() => onCellClick(index)}
              >
                {formatValue(value)}
              </button>
            ) : (
              <div className={boxClassName}>{formatValue(value)}</div>
            )}
            <div
              className={cn(
                "font-mono text-[12.5px] text-muted-foreground",
                state === "current" && "font-semibold text-ink"
              )}
            >
              {hideIndexes ? "" : index}
            </div>
          </div>
        );
      })}
    </div>
  );
}
