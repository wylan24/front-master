import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Variants mirror the `.btn` family in docs/Academy.html:
// .btn (default), .btn.ghost (outline), .btn.accent (brand), .btn.mono (font="mono").
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[10px] text-[14px] font-semibold whitespace-nowrap transition-transform duration-100 outline-none select-none hover:-translate-y-px active:translate-y-px focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-primary px-[14px] py-[9px] text-primary-foreground",
        outline:
          "border-[1.5px] border-primary bg-transparent px-[12.5px] py-[7.5px] text-primary",
        brand: "bg-brand px-[14px] py-[9px] text-white",
        // White button that sits on the green "Stage complete" banner.
        inverse: "bg-white px-[14px] py-[9px] text-good",
      },
      font: {
        sans: "font-sans",
        mono: "font-mono text-[13px]",
      },
    },
    defaultVariants: {
      variant: "default",
      font: "sans",
    },
  }
)

function Button({
  className,
  variant = "default",
  font = "sans",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, font, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
