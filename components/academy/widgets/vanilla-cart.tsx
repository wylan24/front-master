"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controls } from "../content";

type CartItem = { name: string; price: number };

/** The four pieces of text on the pretend page. */
type CartScreen = {
  count: string;
  total: string;
  summary: string;
  banner: string;
};

type Approach = "imperative" | "declarative";

type UpdateStep = { label: string; done: boolean };

const PRODUCTS: CartItem[] = [
  { name: "Wireless Keyboard", price: 49.99 },
  { name: "Ergonomic Mouse", price: 29.99 },
  { name: "Desk Lamp", price: 22 },
];

const FREE_SHIPPING_FROM = 50;

const SCREEN_LABELS: Record<keyof CartScreen, string> = {
  count: "#cart-count",
  total: "#cart-total",
  summary: "#cart-summary",
  banner: "#shipping-banner",
};

function sumPrices(items: CartItem[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  return total;
}

function describeSummary(itemCount: number): string {
  if (itemCount === 0) {
    return "Your cart is empty";
  }
  if (itemCount === 1) {
    return "1 item";
  }
  return `${itemCount} items`;
}

function describeBanner(total: number): string {
  if (total >= FREE_SHIPPING_FROM) {
    return "🚚 Free shipping unlocked!";
  }
  return "";
}

/** The declarative way: the whole screen is worked out from the data. */
function describeScreen(items: CartItem[]): CartScreen {
  const total = sumPrices(items);
  return {
    count: String(items.length),
    total: "£" + total.toFixed(2),
    summary: describeSummary(items.length),
    banner: describeBanner(total),
  };
}

const EMPTY_SCREEN = describeScreen([]);

export function VanillaCartWidget() {
  const [approach, setApproach] = useState<Approach>("imperative");
  const [items, setItems] = useState<CartItem[]>([]);
  const [screen, setScreen] = useState<CartScreen>(EMPTY_SCREEN);
  const [lastSteps, setLastSteps] = useState<UpdateStep[]>([]);

  const correctScreen = describeScreen(items);

  function switchApproach(nextApproach: Approach) {
    setApproach(nextApproach);
    setItems([]);
    setScreen(EMPTY_SCREEN);
    setLastSteps([]);
  }

  function addItem(product: CartItem) {
    const nextItems = [...items, product];
    setItems(nextItems);

    if (approach === "declarative") {
      setScreen(describeScreen(nextItems));
      setLastSteps([{ label: "describe the whole cart from the data", done: true }]);
      return;
    }

    // Imperative: the developer remembered every update in addItem...
    const total = sumPrices(nextItems);
    setScreen({
      count: String(nextItems.length),
      total: "£" + total.toFixed(2),
      summary: describeSummary(nextItems.length),
      banner: describeBanner(total),
    });
    setLastSteps([
      { label: "find #cart-count, set its text", done: true },
      { label: "recalculate the total", done: true },
      { label: "find #cart-total, set its text", done: true },
      { label: "find #cart-summary, set its text", done: true },
      { label: "find #shipping-banner, show or hide it", done: true },
    ]);
  }

  function removeLastItem() {
    if (items.length === 0) {
      return;
    }
    const nextItems = items.slice(0, items.length - 1);
    setItems(nextItems);

    if (approach === "declarative") {
      setScreen(describeScreen(nextItems));
      setLastSteps([{ label: "describe the whole cart from the data", done: true }]);
      return;
    }

    // ...but removeItem was written before the summary and banner existed.
    const total = sumPrices(nextItems);
    setScreen({
      ...screen,
      count: String(nextItems.length),
      total: "£" + total.toFixed(2),
    });
    setLastSteps([
      { label: "find #cart-count, set its text", done: true },
      { label: "recalculate the total", done: true },
      { label: "find #cart-total, set its text", done: true },
      { label: "update #cart-summary (forgotten)", done: false },
      { label: "update #shipping-banner (forgotten)", done: false },
    ]);
  }

  const screenKeys = Object.keys(SCREEN_LABELS) as (keyof CartScreen)[];
  let outOfSyncCount = 0;
  for (const key of screenKeys) {
    if (screen[key] !== correctScreen[key]) {
      outOfSyncCount++;
    }
  }

  return (
    <>
      <p>
        Add two items, then remove one. Watch whether <b>the screen</b> still
        matches <b>the data</b>. Then switch approach and try again.
      </p>
      <Controls>
        <Button
          variant="outline"
          className={cn(approach === "imperative" && "bg-ink text-paper")}
          aria-pressed={approach === "imperative"}
          onClick={() => switchApproach("imperative")}
        >
          Update each element by hand
        </Button>
        <Button
          variant="outline"
          className={cn(approach === "declarative" && "bg-ink text-paper")}
          aria-pressed={approach === "declarative"}
          onClick={() => switchApproach("declarative")}
        >
          Describe the screen from the data
        </Button>
      </Controls>
      <Controls>
        {PRODUCTS.map((product) => (
          <Button key={product.name} variant="brand" onClick={() => addItem(product)}>
            + {product.name} (£{product.price.toFixed(2)})
          </Button>
        ))}
        <Button variant="outline" onClick={removeLastItem} disabled={items.length === 0}>
          − Remove last item
        </Button>
      </Controls>

      <div className="grid gap-3 min-[640px]:grid-cols-2">
        <div className="rounded-xl border-[1.5px] border-border bg-surface px-4 py-3">
          <div className="mb-2 text-[11px] tracking-[.1em] text-muted-foreground uppercase">
            The data
          </div>
          <div className="font-mono text-[13.5px]">
            items: [{items.map((item) => item.name).join(", ")}]
            <br />
            total: {sumPrices(items).toFixed(2)}
          </div>
        </div>
        <div className="rounded-xl border-[1.5px] border-border bg-surface px-4 py-3">
          <div className="mb-2 text-[11px] tracking-[.1em] text-muted-foreground uppercase">
            The screen
          </div>
          {screenKeys.map((key) => {
            const isOutOfSync = screen[key] !== correctScreen[key];
            return (
              <div
                key={key}
                className={cn(
                  "mb-1 flex justify-between gap-3 rounded-md px-2 py-0.5 text-[14px]",
                  isOutOfSync && "bg-bad-soft"
                )}
              >
                <span className="font-mono text-[12.5px] text-muted-foreground">
                  {SCREEN_LABELS[key]}
                </span>
                <span>
                  {screen[key] === "" ? <i className="text-muted-foreground">(hidden)</i> : screen[key]}
                  {isOutOfSync && <b className="ml-1.5 text-bad">✗ out of sync</b>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {lastSteps.length > 0 && (
        <div className="mt-3 text-[14px]">
          <b>What the code did on that click:</b>
          <ul className="mt-1 list-none pl-0">
            {lastSteps.map((step) => (
              <li key={step.label} className={cn(!step.done && "font-semibold text-bad")}>
                {step.done ? "✓" : "✗"} {step.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      {outOfSyncCount > 0 && (
        <p className="mt-2 text-[14.5px]">
          The data says one thing and the screen says another. Nothing crashed,
          so this kind of bug is easy to ship without noticing.
        </p>
      )}
    </>
  );
}
