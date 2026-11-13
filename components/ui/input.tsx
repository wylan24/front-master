import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

// Matches the text/number inputs in docs/Academy.html.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "rounded-[10px] border-[1.5px] border-input bg-white px-[10px] py-2 font-mono text-[14px] leading-[normal] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring disabled:pointer-events-none disabled:opacity-50",
        type === "number" && "w-20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
