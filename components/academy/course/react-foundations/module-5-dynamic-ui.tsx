import type { Stage } from "@/lib/academy/types";
import { Analogy, CodeBlock, StepHeading, Tip } from "../../content";
import { check } from "../check";
import { ReactPlayground } from "../../widgets/react-playground";
import { ListKeysWidget } from "../../widgets/list-keys";
import { checkNoReactWarnings, getReactWarnings, readNumber, readText } from "./checks";
import { SHOPFRONT_PRODUCTS_CODE } from "./shopfront-data";

const PART = "Module 5 · Rendering Dynamic UI";

// ---------------------------------------------------------------------------
// Widgets for this module
// ---------------------------------------------------------------------------

function ConditionalWidget() {
  return (
    <ReactPlayground
      intro="Three ways to choose what to show. Predict each preview first, especially the third."
      examples={[
        {
          label: "Ternary",
          code: `function StockLabel({ stock }) {
  return <p>{stock > 0 ? "In stock" : "Out of stock"}</p>;
}

render(
  <>
    <StockLabel stock={4} />
    <StockLabel stock={0} />
  </>
);`,
          lookFor: "condition ? this : that: choose between two things.",
        },
        {
          label: "&& (show or nothing)",
          code: `function SaleBadge({ onSale }) {
  return <p>Desk Lamp {onSale && <strong>Sale!</strong>}</p>;
}

render(
  <>
    <SaleBadge onSale={true} />
    <SaleBadge onSale={false} />
  </>
);`,
          lookFor: "condition && thing: show it, or show nothing. false draws nothing.",
        },
        {
          label: "The 0 trap",
          code: `function CartBadge({ count }) {
  return <p>Cart {count && <b>({count})</b>}</p>;
}

render(
  <>
    <CartBadge count={3} />
    <CartBadge count={0} />
  </>
);`,
          lookFor: "0 && anything is 0, and React draws numbers. Fix it with count > 0 && ...",
        },
        {
          label: "return null",
          code: `function Banner({ total }) {
  if (total < 50) {
    return null;
  }
  return <p>🚚 Free shipping unlocked!</p>;
}

render(
  <>
    <Banner total={20} />
    <Banner total={80} />
  </>
);`,
          lookFor: "An if before the return is normal JavaScript. Returning null draws nothing.",
        },
      ]}
    />
  );
}

function FilteringWidget() {
  return (
    <ReactPlayground
      intro="Filter first, then map. Change maxPrice in the render() call and rerun. Try 5."
      examples={[
        {
          label: "Under a price",
          code: `${SHOPFRONT_PRODUCTS_CODE}

function ProductList({ maxPrice }) {
  const affordable = products.filter((product) => product.price <= maxPrice);

  if (affordable.length === 0) {
    return <p>Nothing under £{maxPrice}. Try a higher price.</p>;
  }

  return (
    <ul>
      {affordable.map((product) => (
        <li key={product.id}>
          {product.name}: £{product.price.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}

render(<ProductList maxPrice={50} />);`,
          lookFor: "The visible list is calculated from products and maxPrice every time. Nothing is stored.",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const renderingLists: Stage = {
  id: "mid-lists",
  level: "mid",
  part: PART,
  title: "Rendering lists with map",
  short: "Lists and keys",
  lead: (
    <>
      Shopfront has an <b>array</b> of products, not three hand-written cards.
      <code> map</code> turns an array of data into an array of JSX, and{" "}
      <code>key</code> tells React which item is which.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        Writing <code>&lt;ProductCard /&gt;</code> once per product works for
        three. With thirty products, or a list that comes from a server and
        changes every day, the JSX can&apos;t be written by hand. The list
        must come from the data.
      </p>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`const products = [
  { id: 1, name: "Wireless Keyboard", price: 49.99 },
  { id: 6, name: "Desk Lamp", price: 22 },
];

function ProductList() {
  return (
    <section>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
        />
      ))}
    </section>
  );
}`}
      />
      <p>
        <code>map</code> calls the arrow function once per product and returns
        a new array of <code>&lt;ProductCard&gt;</code> elements. React draws
        an array of JSX as a list. Add a product to the array and a card
        appears: <code>UI = f(data)</code> again.
      </p>

      <StepHeading>Why key?</StepHeading>
      <Analogy icon="🏷️">
        Name badges at a party. If people swap seats, badges tell you who is
        who. Without badges you could only say &quot;the person in seat
        2&quot;, and you&apos;d give seat 2&apos;s coat to whoever sits there
        now.
      </Analogy>
      <p>
        When a list changes, React compares the old and new lists. The{" "}
        <code>key</code> is the badge: it must be <b>unique among
        siblings</b> and <b>stay the same for the same item</b>. An id from
        your data is ideal. The array index is not, if items can be removed,
        added or reordered: try it in the widget.
      </p>
      <Tip>
        💡 The key goes on the outermost element returned from{" "}
        <code>map</code>, here <code>&lt;ProductCard key=...&gt;</code>. It is
        for React; the component doesn&apos;t receive it as a prop.
      </Tip>
    </>
  ),
  widget: { title: "What keys are for", Component: ListKeysWidget },
  quiz: [
    {
      question: "What does products.map(p => <ProductCard key={p.id} name={p.name} />) give React?",
      options: [
        "One ProductCard showing every product",
        "An array of ProductCard elements, one per product",
        "A string of HTML",
        "The products array, unchanged",
      ],
      answerIndex: 1,
      explanation: "map returns a new array with one JSX element per item, and React draws arrays as lists.",
    },
    {
      question: "What is the key for?",
      options: [
        "Styling each item",
        "Telling React which item is which, so it can match items between renders",
        "Sorting the list",
        "Making items clickable",
      ],
      answerIndex: 1,
      explanation: "Keys give each item a stable identity across changes.",
    },
    {
      question: "Products can be removed from the cart. Is the array index a good key?",
      options: [
        "Yes, indexes are always unique",
        "No: after a removal, a different item gets that index, so React mixes them up",
        "Yes, as long as the list is short",
        "Keys don't matter for removals",
      ],
      answerIndex: 1,
      explanation: "Use something that belongs to the item itself, like its id.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          <code>ProductList</code> shows three hand-written cards. Make it
          show <b>every</b> product in <code>products</code> using{" "}
          <code>map</code>, with each product&apos;s <code>id</code> as the{" "}
          <code>key</code>.
        </p>
        <p>
          The checks will add a seventh product to the array and expect a
          seventh card.
        </p>
      </>
    ),
    starter: `${SHOPFRONT_PRODUCTS_CODE}

function ProductCard({ name, price }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>£{price.toFixed(2)}</p>
    </article>
  );
}

function ProductList() {
  return (
    <section>
      <ProductCard name="Wireless Keyboard" price={49.99} />
      <ProductCard name="Ergonomic Mouse" price={29.99} />
      <ProductCard name="27-inch Monitor" price={189} />
    </section>
  );
}

render(<ProductList />);
`,
    extract: `(() => {
  render(<ProductList />);
  const cardsBefore = screen.countComponents("ProductCard");
  products.push({ id: 7, name: "HD Webcam", price: 59, category: "Accessories", stock: 5 });
  render(<ProductList />);
  return { cardsBefore, cardsAfter: screen.countComponents("ProductCard"), text: screen.text() };
})()`,
    tests: (values, code, logs) => {
      const hasKeyWarning = getReactWarnings(logs).some((warning) => warning.includes('"key"'));
      return [
        check(readNumber(values, "cardsBefore") === 6, "all six products are shown"),
        check(
          readNumber(values, "cardsAfter") === 7 && readText(values, "text").includes("HD Webcam"),
          "adding a product to the array adds a card"
        ),
        check(/products\.map\(/.test(code), "the cards are made with products.map"),
        check(!hasKeyWarning && /key=\{\s*\w+\.id\s*\}/.test(code), "each card has the product's id as its key"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        Replace the three cards with{" "}
        <code>{"{products.map((product) => ( <ProductCard key={product.id} name={product.name} price={product.price} /> ))}"}</code>
        .
      </>
    ),
    solution: `${SHOPFRONT_PRODUCTS_CODE}

function ProductCard({ name, price }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>£{price.toFixed(2)}</p>
    </article>
  );
}

function ProductList() {
  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} name={product.name} price={product.price} />
      ))}
    </section>
  );
}

render(<ProductList />);`,
  },
};

const conditionalRendering: Stage = {
  id: "mid-conditional",
  level: "mid",
  part: PART,
  title: "Showing different UI for different data",
  short: "Conditions",
  lead: (
    <>
      One component, different screens: &quot;Out of stock&quot; for one
      product, &quot;Only 2 left!&quot; for another. The data decides.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        The Ergonomic Mouse has <code>stock: 0</code>, but its card still
        offers <b>Add to cart</b>. The card needs to look different depending
        on its data.
      </p>

      <StepHeading>Three tools</StepHeading>
      <CodeBlock
        code={`// 1. Ternary: choose between two things
{stock > 0 ? <button>Add to cart</button> : <span>Out of stock</span>}

// 2. &&: show something, or nothing
{stock > 0 && stock <= 3 && <small>Only {stock} left!</small>}

// 3. if before the return, for bigger decisions
if (product === undefined) {
  return null;              // null draws nothing
}`}
      />
      <p>
        Attributes can depend on data too:{" "}
        <code>{"<button disabled={stock === 0}>"}</code>.
      </p>

      <StepHeading>Common mistake: the 0 trap</StepHeading>
      <CodeBlock
        code={`{stock && <small>{stock} in stock</small>}
// stock is 0 → 0 && ... is 0 → React draws "0" on the page!

{stock > 0 && <small>{stock} in stock</small>}
// stock > 0 is false → React draws nothing ✅`}
      />
      <Analogy icon="🚦">
        <code>&amp;&amp;</code> stops at the first &quot;falsy&quot; value and
        hands it back. <code>false</code>, <code>null</code> and{" "}
        <code>undefined</code> draw nothing, but <code>0</code> is a number,
        and numbers get drawn. Always put a real true/false comparison on the
        left.
      </Analogy>
    </>
  ),
  widget: { title: "Ternary, &&, and return null", Component: ConditionalWidget },
  quiz: [
    {
      question: (
        <>
          <code>count</code> is <code>0</code>. What does{" "}
          <code>{"<p>{count && <b>{count} items</b>}</p>"}</code> show?
        </>
      ),
      options: ["Nothing", "0", "0 items", "false"],
      answerIndex: 1,
      explanation: "0 && ... evaluates to 0, and React draws numbers. Use count > 0 && ...",
    },
    {
      question: "You want 'In stock' or 'Out of stock'. Which fits best?",
      options: [
        "A ternary: stock > 0 ? \"In stock\" : \"Out of stock\"",
        "Two && expressions",
        "An if statement inside the braces",
        "A for loop",
      ],
      answerIndex: 0,
      explanation: "Two possible outcomes is exactly what a ternary is for.",
    },
    {
      question: "What does a component that returns null show?",
      options: ["The text null", "Nothing", "An error", "An empty <div>"],
      answerIndex: 1,
      explanation: "null is React's way of saying 'draw nothing here'.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          The preview shows a stray <b>0</b> on the mouse&apos;s card. Fix it,
          and make <code>ProductCard</code> show the right thing for its
          stock:
        </p>
        <ol>
          <li>
            stock is 0: <code>Out of stock</code>, and the button is{" "}
            <code>disabled</code>
          </li>
          <li>
            stock is 1 to 3: <code>Only 2 left!</code> (with the real number)
          </li>
          <li>
            stock above 3: <code>12 in stock</code> (with the real number)
          </li>
        </ol>
        <p>Keep the Add to cart button on every card.</p>
      </>
    ),
    starter: `${SHOPFRONT_PRODUCTS_CODE}

function ProductCard({ name, price, stock }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>£{price.toFixed(2)}</p>
      {stock && <small>{stock} in stock</small>}
      <button>Add to cart</button>
    </article>
  );
}

function ProductList() {
  return (
    <section>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          stock={product.stock}
        />
      ))}
    </section>
  );
}

render(<ProductList />);
`,
    extract: `(() => {
  render(<ProductCard name="Sold Out Thing" price={10} stock={0} />);
  const soldOutText = screen.text();
  const soldOutHtml = screen.html();
  render(<ProductCard name="Low Thing" price={10} stock={2} />);
  const lowText = screen.text();
  const lowHtml = screen.html();
  render(<ProductCard name="Plenty Thing" price={10} stock={12} />);
  const plentyText = screen.text();
  const plentyHtml = screen.html();
  return { soldOutText, soldOutHtml, lowText, lowHtml, plentyText, plentyHtml };
})()`,
    tests: (values, _code, logs) => {
      const soldOutText = readText(values, "soldOutText");
      const soldOutHtml = readText(values, "soldOutHtml");
      const lowText = readText(values, "lowText");
      const lowHtml = readText(values, "lowHtml");
      const plentyText = readText(values, "plentyText");
      const plentyHtml = readText(values, "plentyHtml");
      const disabledButton = /<button[^>]*\bdisabled\b/;
      return [
        check(soldOutText.includes("Out of stock"), "stock 0 shows Out of stock"),
        check(disabledButton.test(soldOutHtml), "stock 0 disables the button"),
        check(!soldOutHtml.includes(">0<") && !soldOutHtml.includes(">0 "), "no stray 0 is drawn"),
        check(lowText.includes("Only 2 left!") && !lowText.includes("Out of stock"), "stock 2 shows Only 2 left!"),
        check(!disabledButton.test(lowHtml), "stock 2 keeps the button enabled"),
        check(plentyText.includes("12 in stock") && !plentyText.includes("left"), "stock 12 shows 12 in stock"),
        check(plentyHtml.includes("Add to cart"), "the Add to cart button is still there"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        <code>{"{stock === 0 && <span>Out of stock</span>}"}</code>,{" "}
        <code>{"{stock > 0 && stock <= 3 && <small>Only {stock} left!</small>}"}</code>,{" "}
        <code>{"{stock > 3 && <small>{stock} in stock</small>}"}</code>, and{" "}
        <code>{"<button disabled={stock === 0}>"}</code>.
      </>
    ),
    solution: `${SHOPFRONT_PRODUCTS_CODE}

function ProductCard({ name, price, stock }) {
  const isSoldOut = stock === 0;
  const isRunningLow = stock > 0 && stock <= 3;

  return (
    <article>
      <h2>{name}</h2>
      <p>£{price.toFixed(2)}</p>
      {isSoldOut && <span>Out of stock</span>}
      {isRunningLow && <small>Only {stock} left!</small>}
      {stock > 3 && <small>{stock} in stock</small>}
      <button disabled={isSoldOut}>Add to cart</button>
    </article>
  );
}

function ProductList() {
  return (
    <section>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          price={product.price}
          stock={product.stock}
        />
      ))}
    </section>
  );
}

render(<ProductList />);`,
  },
};

const filteringAndEmptyStates: Stage = {
  id: "mid-filtering",
  level: "mid",
  part: PART,
  title: "Filtered lists and empty states",
  short: "Filtering",
  lead: (
    <>
      Show only what matches, and say so clearly when nothing does. The
      visible list is <b>calculated</b> from the data, never stored separately.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        A shopper wants products under £30. And if nothing is under £5, a
        blank page looks broken. An <b>empty state</b> tells them what
        happened and what to do.
      </p>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`function ProductList({ products, maxPrice }) {
  // 1. Calculate what to show from the data you were given
  const affordable = products.filter((product) => product.price <= maxPrice);

  // 2. Handle the empty case first
  if (affordable.length === 0) {
    return <p>No products under £{maxPrice.toFixed(2)}</p>;
  }

  // 3. Then the normal case
  return (
    <ul>
      {affordable.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}`}
      />
      <p>
        <code>affordable</code> is an ordinary variable, recalculated every
        time the component runs. Nothing can get out of step, because nothing
        is copied. You&apos;ll lean on this idea a lot in Module 7.
      </p>
      <Tip>
        💡 Design every list for three cases: <b>some</b> items,{" "}
        <b>no</b> items, and (later, with servers) <b>still loading</b>.
      </Tip>
    </>
  ),
  widget: { title: "Filter, then map", Component: FilteringWidget },
  quiz: [
    {
      question: "Where should the filtered list come from?",
      options: [
        "A second array you keep up to date by hand",
        "Calculated from the full list and the filter, each time the component runs",
        "A global variable",
        "The DOM",
      ],
      answerIndex: 1,
      explanation: "Calculate it from the data. A second copy is a second thing to keep in sync.",
    },
    {
      question: "products.filter(...) matches nothing. What does .map(...) on the result render?",
      options: ["An error", "Nothing: map on an empty array gives an empty array", "The word undefined", "All products"],
      answerIndex: 1,
      explanation: "Which is exactly why you need an empty state message.",
    },
    {
      question: "Why show an empty state instead of a blank space?",
      options: [
        "React requires it",
        "A blank area looks broken; a message explains what happened and what to try",
        "It makes the page faster",
        "It isn't needed",
      ],
      answerIndex: 1,
      explanation: "Empty, loading and error states are part of the design, not an afterthought.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          Make <code>ProductList</code> (which receives <code>products</code>{" "}
          and <code>maxPrice</code>) show:
        </p>
        <ol>
          <li>
            a <code>&lt;li&gt;</code> (with a key) for each product priced at
            or under <code>maxPrice</code>, showing its name
          </li>
          <li>
            a line like <code>Showing 2 of 6 products</code>
          </li>
          <li>
            when nothing matches: <code>No products under £5.00</code> (use{" "}
            <code>maxPrice.toFixed(2)</code>) and no list items
          </li>
        </ol>
      </>
    ),
    starter: `${SHOPFRONT_PRODUCTS_CODE}

function ProductList({ products, maxPrice }) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

render(<ProductList products={products} maxPrice={30} />);
`,
    extract: `(() => {
  render(<ProductList products={products} maxPrice={30} />);
  const cheapText = screen.text();
  const cheapItems = screen.count("li");
  render(<ProductList products={products} maxPrice={22} />);
  const exactItems = screen.count("li");
  render(<ProductList products={products} maxPrice={5} />);
  const noneText = screen.text();
  const noneItems = screen.count("li");
  return { cheapText, cheapItems, exactItems, noneText, noneItems };
})()`,
    tests: (values, code, logs) => {
      const cheapText = readText(values, "cheapText");
      return [
        check(
          readNumber(values, "cheapItems") === 2 && cheapText.includes("Ergonomic Mouse") && cheapText.includes("Desk Lamp"),
          "maxPrice 30 lists the two products under £30"
        ),
        check(!cheapText.includes("Laptop Stand"), "more expensive products are left out"),
        check(readNumber(values, "exactItems") === 1, "a product priced exactly at maxPrice is included"),
        check(cheapText.includes("Showing 2 of 6 products"), "it says Showing 2 of 6 products"),
        check(
          readNumber(values, "noneItems") === 0 && readText(values, "noneText").includes("No products under £5.00"),
          "maxPrice 5 shows No products under £5.00 and no items"
        ),
        check(/\.filter\(/.test(code), "the list is calculated with filter"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        Start with{" "}
        <code>const affordable = products.filter((product) =&gt; product.price &lt;= maxPrice);</code>
        . If <code>affordable.length === 0</code>, return the message. Otherwise
        show <code>Showing {"{affordable.length}"} of {"{products.length}"} products</code>{" "}
        and map over <code>affordable</code>.
      </>
    ),
    solution: `${SHOPFRONT_PRODUCTS_CODE}

function ProductList({ products, maxPrice }) {
  const affordable = products.filter((product) => product.price <= maxPrice);

  if (affordable.length === 0) {
    return <p>No products under £{maxPrice.toFixed(2)}</p>;
  }

  return (
    <>
      <p>
        Showing {affordable.length} of {products.length} products
      </p>
      <ul>
        {affordable.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </>
  );
}

render(<ProductList products={products} maxPrice={30} />);`,
  },
};

export const MODULE_5_STAGES: Stage[] = [renderingLists, conditionalRendering, filteringAndEmptyStates];
