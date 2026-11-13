"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Controls } from "../content";

type Product = { id: number; name: string };

const STARTING_PRODUCTS: Product[] = [
  { id: 1, name: "Wireless Keyboard" },
  { id: 2, name: "Ergonomic Mouse" },
  { id: 3, name: "Desk Lamp" },
];

const NEW_PRODUCT: Product = { id: 4, name: "Laptop Stand" };

type KeyChoice = "id" | "index";

/**
 * A real React list (this page is React too). Each row has a note field that
 * React keeps for that row. Keys decide which row is which after the list changes.
 */
export function ListKeysWidget() {
  const [keyChoice, setKeyChoice] = useState<KeyChoice>("index");
  const [products, setProducts] = useState<Product[]>(STARTING_PRODUCTS);
  // Changing this number gives the list a fresh start (new rows, empty notes).
  const [listVersion, setListVersion] = useState(0);

  function chooseKeys(choice: KeyChoice) {
    setKeyChoice(choice);
    startAgain();
  }

  function startAgain() {
    setProducts(STARTING_PRODUCTS);
    setListVersion(listVersion + 1);
  }

  function removeFirst() {
    setProducts(products.slice(1));
  }

  function addToTop() {
    const alreadyAdded = products.some((product) => product.id === NEW_PRODUCT.id);
    if (alreadyAdded) {
      return;
    }
    setProducts([NEW_PRODUCT, ...products]);
  }

  return (
    <>
      <p>
        Type a note next to <b>each</b> product (for example its name). Then
        remove the first product, or add one to the top. Do the notes stay with
        the right product?
      </p>
      <Controls>
        <span className="text-[14px]">Use as the key:</span>
        <Button
          variant="outline"
          className={cn(keyChoice === "index" && "bg-ink text-paper")}
          aria-pressed={keyChoice === "index"}
          onClick={() => chooseKeys("index")}
        >
          key=&#123;index&#125;
        </Button>
        <Button
          variant="outline"
          className={cn(keyChoice === "id" && "bg-ink text-paper")}
          aria-pressed={keyChoice === "id"}
          onClick={() => chooseKeys("id")}
        >
          key=&#123;product.id&#125;
        </Button>
      </Controls>

      <ul key={listVersion} className="my-2 grid list-none gap-1.5 pl-0">
        {products.map((product, index) => {
          const key = keyChoice === "index" ? index : product.id;
          return (
            <li
              key={key}
              className="flex flex-wrap items-center gap-2 rounded-[10px] border-[1.5px] border-border bg-surface px-3 py-1.5 text-[14.5px]"
            >
              <span className="rounded bg-background px-1.5 font-mono text-[12px]">key {key}</span>
              <span className="w-44">{product.name}</span>
              <Input aria-label={`Note for ${product.name}`} placeholder="note…" className="flex-1" />
            </li>
          );
        })}
      </ul>

      <Controls>
        <Button variant="brand" onClick={removeFirst} disabled={products.length === 0}>
          Remove first product
        </Button>
        <Button variant="brand" onClick={addToTop}>
          Add Laptop Stand to the top
        </Button>
        <Button variant="outline" onClick={startAgain}>
          Start again
        </Button>
      </Controls>
      <p className="text-[14.5px] text-muted-foreground">
        With <code>key=&#123;index&#125;</code>, the row that <i>was</i> key 1
        is still key 1 after a removal, so React keeps its note there, now next
        to a different product.
      </p>
    </>
  );
}
