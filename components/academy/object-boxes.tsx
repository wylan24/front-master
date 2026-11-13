import { cn } from "@/lib/utils";
import { formatValue } from "@/lib/academy/format";

/**
 * How a property is highlighted:
 * - current: the property being read or changed (yellow, lifted)
 * - added:   just created (green)
 * - shared:  the same data seen through another variable (blue)
 */
export type PropertyState = "current" | "added" | "shared";

type ObjectBoxesProps = {
  /** Shown before the braces, e.g. "pet". */
  name?: string;
  entries: [string, unknown][];
  getPropertyState?: (key: string) => PropertyState | undefined;
};

const PROPERTY_STATE_CLASS: Record<PropertyState, string> = {
  current: "-translate-y-1 bg-highlight text-highlight-ink shadow-[0_4px_0_var(--ink)]",
  added: "border-good bg-good text-white",
  shared: "border-info bg-info-soft",
};

function formatPropertyValue(value: unknown): string {
  if (typeof value === "function") {
    return "ƒ()";
  }
  return formatValue(value);
}

/**
 * The object version of ArrayBoxes: each property is a labelled box, with the
 * key on the label where an array would show its index.
 */
export function ObjectBoxes({ name, entries, getPropertyState }: ObjectBoxesProps) {
  return (
    <div className="mt-[14px] mb-[6px] flex flex-wrap items-end gap-2 font-mono">
      {name && <span className="pb-[22px] text-[15px] font-semibold">{name} =</span>}
      <span className="pb-[18px] text-[28px] leading-none text-muted-foreground">{"{"}</span>

      {entries.length === 0 && (
        <span className="pb-[22px] text-[14px] text-muted-foreground">
          empty object, no properties yet
        </span>
      )}

      {entries.map(([key, value]) => {
        const state = getPropertyState ? getPropertyState(key) : undefined;
        return (
          <div key={key} className="flex animate-pop flex-col items-center gap-1">
            <span className="text-[12.5px] font-semibold text-brand-ink">{key}</span>
            <span
              className={cn(
                "grid h-[52px] min-w-[72px] place-items-center rounded-[10px] border-[2.5px] border-ink bg-surface px-[10px] text-[14.5px] font-semibold transition-all duration-200",
                state && PROPERTY_STATE_CLASS[state]
              )}
            >
              {formatPropertyValue(value)}
            </span>
          </div>
        );
      })}

      <span className="pb-[18px] text-[28px] leading-none text-muted-foreground">{"}"}</span>
    </div>
  );
}
