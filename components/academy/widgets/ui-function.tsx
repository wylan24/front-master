"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Readout } from "../content";

type Product = { id: number; name: string; price: number };

const PRODUCTS: Product[] = [
  { id: 1, name: "Wireless Keyboard", price: 49.99 },
  { id: 2, name: "Ergonomic Mouse", price: 29.99 },
  { id: 3, name: "Desk Lamp", price: 22 },
];

const FREE_SHIPPING_FROM = 50;

type CartData = {
  userName: string;
  /** Product id → quantity. */
  quantities: Record<number, number>;
};

function formatData(data: CartData): string {
  const lines: string[] = [];
  lines.push("{");
  lines.push(`  userName: "${data.userName}",`);
  lines.push("  cart: [");
  for (const product of PRODUCTS) {
    const quantity = data.quantities[product.id] ?? 0;
    if (quantity > 0) {
      lines.push(`    { name: "${product.name}", price: ${product.price}, qty: ${quantity} },`);
    }
  }
  lines.push("  ]");
  lines.push("}");
  return lines.join("\n");
}

/** The "f" in UI = f(data): the same data always produces the same screen. */
function CartView({ data }: { data: CartData }) {
  let itemCount = 0;
  let total = 0;
  for (const product of PRODUCTS) {
    const quantity = data.quantities[product.id] ?? 0;
    itemCount += quantity;
    total += quantity * product.price;
  }
  const amountToFreeShipping = FREE_SHIPPING_FROM - total;
  const trimmedName = data.userName.trim();

  return (
    <div className="rounded-xl border-[1.5px] border-border bg-surface px-4 py-3 text-[14.5px]">
      <div className="mb-2 flex justify-between">
        <b>Shopfront</b>
        <span>{trimmedName === "" ? "Sign in" : `Hi, ${trimmedName}`}</span>
      </div>
      {itemCount === 0 ? (
        <p className="text-muted-foreground">Your cart is empty</p>
      ) : (
        <ul className="mb-2 list-none pl-0">
          {PRODUCTS.map((product) => {
            const quantity = data.quantities[product.id] ?? 0;
            if (quantity === 0) {
              return null;
            }
            return (
              <li key={product.id} className="flex justify-between">
                <span>
                  {product.name} × {quantity}
                </span>
                <span>£{(quantity * product.price).toFixed(2)}</span>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
        <span>
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span>£{total.toFixed(2)}</span>
      </div>
      {itemCount > 0 && (
        <p className="mt-2 mb-0 rounded-md bg-good-soft px-2 py-1">
          {amountToFreeShipping <= 0
            ? "🚚 Free shipping unlocked!"
            : `Spend £${amountToFreeShipping.toFixed(2)} more for free shipping`}
        </p>
      )}
    </div>
  );
}

export function UiFunctionWidget() {
  const [data, setData] = useState<CartData>({ userName: "Sam", quantities: { 1: 1 } });

  function changeQuantity(productId: number, change: number) {
    const current = data.quantities[productId] ?? 0;
    const next = Math.max(0, current + change);
    setData({ ...data, quantities: { ...data.quantities, [productId]: next } });
  }

  return (
    <>
      <p>
        You only change <b>the data</b>. The screen on the right is worked out
        from it every time, so there is nothing to forget.
      </p>
      <div className="grid gap-3 min-[700px]:grid-cols-[1fr_auto_1fr] min-[700px]:items-start">
        <div>
          <div className="mb-2 text-[11px] tracking-[.1em] text-muted-foreground uppercase">
            data
          </div>
          <label className="mb-2 flex items-center gap-2 text-[14px]">
            userName
            <Input
              aria-label="User name"
              value={data.userName}
              onChange={(event) => setData({ ...data, userName: event.target.value })}
            />
          </label>
          {PRODUCTS.map((product) => (
            <div key={product.id} className="mb-1.5 flex items-center gap-2 text-[14px]">
              <Button
                variant="outline"
                className="h-7 w-7 p-0"
                aria-label={`One fewer ${product.name}`}
                onClick={() => changeQuantity(product.id, -1)}
              >
                −
              </Button>
              <span className="w-5 text-center font-mono">{data.quantities[product.id] ?? 0}</span>
              <Button
                variant="outline"
                className="h-7 w-7 p-0"
                aria-label={`One more ${product.name}`}
                onClick={() => changeQuantity(product.id, 1)}
              >
                +
              </Button>
              {product.name}
            </div>
          ))}
          <div className="mt-2">
            <Readout>{formatData(data)}</Readout>
          </div>
        </div>
        <div className="self-center text-center font-mono text-[15px] text-brand">
          → f(data) →
        </div>
        <div>
          <div className="mb-2 text-[11px] tracking-[.1em] text-muted-foreground uppercase">
            UI
          </div>
          <CartView data={data} />
        </div>
      </div>
    </>
  );
}
