import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

// Variants mirror `.pill.good / .pill.bad / .pill.blue` and the `h2 .tag`
// label in docs/Academy.html.
const badgeVariants = cva(
  "inline-block w-fit shrink-0 align-middle font-mono text-[11px] font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        good: "rounded-full bg-good-soft px-2 py-0.5 text-good",
        bad: "rounded-full bg-bad-soft px-2 py-0.5 text-bad",
        info: "rounded-full bg-info-soft px-2 py-0.5 text-info",
        brand: "rounded-full bg-brand-soft px-2 py-0.5 text-brand-ink",
        tag: "rounded-md bg-primary px-[7px] py-[3px] tracking-[.04em] text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "good",
    },
  }
)

function Badge({
  className,
  variant = "good",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
