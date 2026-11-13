"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controls, Readout } from "../content";

type Split = "one" | "meaningful" | "every";

type Region =
  | "app"
  | "header"
  | "logo"
  | "search"
  | "cartBadge"
  | "list"
  | "card"
  | "image"
  | "name"
  | "price"
  | "button"
  | "summary";

// Which regions are their own component in each way of splitting the page.
const COMPONENT_NAMES: Record<Split, Partial<Record<Region, string>>> = {
  one: {
    app: "App",
  },
  meaningful: {
    app: "App",
    header: "Header",
    search: "SearchBar",
    cartBadge: "CartBadge",
    list: "ProductList",
    card: "ProductCard",
    summary: "CartSummary",
  },
  every: {
    app: "App",
    header: "Header",
    logo: "Logo",
    search: "SearchInput",
    cartBadge: "CartIcon",
    list: "ProductGrid",
    card: "Card",
    image: "ProductImage",
    name: "ProductName",
    price: "ProductPrice",
    button: "AddButton",
    summary: "CartSummaryBox",
  },
};

const TREES: Record<Split, string> = {
  one: "App   (300 lines: header, search, products, cart… all in one place)",
  meaningful: [
    "App",
    "├─ Header",
    "│  ├─ SearchBar",
    "│  └─ CartBadge",
    "├─ ProductList",
    "│  └─ ProductCard  (× 3, one blueprint)",
    "└─ CartSummary",
  ].join("\n"),
  every: [
    "App",
    "├─ Header",
    "│  ├─ Logo",
    "│  ├─ SearchInput",
    "│  └─ CartIcon",
    "├─ ProductGrid",
    "│  └─ Card (× 3)",
    "│     ├─ ProductImage",
    "│     ├─ ProductName",
    "│     ├─ ProductPrice",
    "│     └─ AddButton",
    "└─ CartSummaryBox",
  ].join("\n"),
};

const VERDICTS: Record<Split, ReactNode> = {
  one: (
    <>
      <b>Too few.</b> Everything lives in one function. To change the product
      card you scroll past the search and cart code, and nothing can be reused.
    </>
  ),
  meaningful: (
    <>
      <b>Just right.</b> Each component has one clear job you can say in a
      sentence: &quot;ProductCard shows one product and its Add button.&quot;
      The card is written once and reused three times.
    </>
  ),
  every: (
    <>
      <b>Too many.</b> A ProductName that only wraps an &lt;h3&gt; has no job
      of its own. You now jump between twelve files to follow one card.
    </>
  ),
};

const SPLIT_LABELS: Record<Split, string> = {
  one: "One big component",
  meaningful: "Meaningful pieces",
  every: "Every element",
};

const CARD_PRODUCTS = [
  { name: "Wireless Keyboard", price: "£49.99" },
  { name: "Ergonomic Mouse", price: "£29.99" },
  { name: "Desk Lamp", price: "£22.00" },
];

/** One region of the mock page, outlined and labelled when it is its own component. */
function Box({
  componentName,
  className,
  children,
}: {
  componentName: string | undefined;
  className?: string;
  children: ReactNode;
}) {
  const isComponent = componentName !== undefined;
  return (
    <div
      className={cn(
        "relative rounded-lg",
        isComponent && "border-2 border-dashed border-brand px-2 pt-4 pb-2",
        className
      )}
    >
      {isComponent && (
        <span className="absolute -top-2.5 left-2 rounded bg-brand px-1.5 font-mono text-[11px] leading-[18px] text-white">
          {componentName}
        </span>
      )}
      {children}
    </div>
  );
}

export function ComponentMapWidget() {
  const [split, setSplit] = useState<Split>("one");
  const names = COMPONENT_NAMES[split];

  return (
    <>
      <p>
        Here is the Shopfront page. Try three ways of splitting it into
        components and decide which one you would want to work in.
      </p>
      <Controls>
        {(Object.keys(SPLIT_LABELS) as Split[]).map((option) => (
          <Button
            key={option}
            variant="outline"
            className={cn(option === split && "bg-ink text-paper")}
            aria-pressed={option === split}
            onClick={() => setSplit(option)}
          >
            {SPLIT_LABELS[option]}
          </Button>
        ))}
      </Controls>

      <div className="grid gap-3 min-[760px]:grid-cols-[1.6fr_1fr]">
        <Box componentName={names.app} className="mt-2 bg-surface">
          <Box componentName={names.header} className="mb-3 bg-background">
            <div className="flex flex-wrap items-center gap-2 p-1">
              <Box componentName={names.logo}>
                <b>Shopfront</b>
              </Box>
              <Box componentName={names.search} className="flex-1">
                <div className="rounded-md border border-border bg-surface px-2 py-1 text-[13px] text-muted-foreground">
                  Search products…
                </div>
              </Box>
              <Box componentName={names.cartBadge}>
                <span className="text-[13px]">🛒 2</span>
              </Box>
            </div>
          </Box>
          <Box componentName={names.list} className="mb-3">
            <div className="grid grid-cols-3 gap-3 pt-1">
              {CARD_PRODUCTS.map((product) => (
                <Box key={product.name} componentName={names.card} className="bg-background">
                  <div className="grid gap-1.5 p-1 text-[12.5px]">
                    <Box componentName={names.image}>
                      <div className="h-8 rounded bg-line" />
                    </Box>
                    <Box componentName={names.name}>
                      <b>{product.name}</b>
                    </Box>
                    <Box componentName={names.price}>{product.price}</Box>
                    <Box componentName={names.button}>
                      <div className="rounded border border-ink px-1 text-center">Add</div>
                    </Box>
                  </div>
                </Box>
              ))}
            </div>
          </Box>
          <Box componentName={names.summary} className="bg-background">
            <div className="p-1 text-[13px]">Cart: 2 items · £79.98</div>
          </Box>
        </Box>
        <div>
          <Readout>{TREES[split]}</Readout>
          <p className="mt-3 text-[14.5px]">{VERDICTS[split]}</p>
        </div>
      </div>
    </>
  );
}
