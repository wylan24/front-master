import * as React from "react"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

// Matches the <select> styling in docs/Academy.html (mono, 1.5px line border, 10px radius).
function NativeSelect({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div
      className={cn("group/native-select relative w-fit max-w-full", className)}
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        className="w-full max-w-full min-w-0 appearance-none rounded-[10px] border-[1.5px] border-input bg-surface py-2 pr-8 pl-[10px] font-mono text-[14px] leading-[normal] text-foreground outline-none focus:border-ring disabled:pointer-events-none disabled:opacity-50"
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      className={cn("bg-[Canvas] text-[CanvasText]", className)}
      {...props}
    />
  )
}

export { NativeSelect, NativeSelectOption }
