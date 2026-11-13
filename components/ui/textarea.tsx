import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const textareaVariants = cva("w-full outline-none", {
  variants: {
    variant: {
      default:
        "min-h-16 rounded-[10px] border-[1.5px] border-input bg-surface px-[10px] py-2 text-[14px] focus:border-ring",
      // The dark code editor from docs/Academy.html (`.editor`).
      code: "min-h-[200px] resize-y rounded-xl border-none bg-code px-4 py-[14px] font-mono text-[14px] leading-[1.6] text-code-ink caret-highlight [tab-size:2] focus:shadow-[0_0_0_3px_var(--highlight)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Textarea({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Textarea }
