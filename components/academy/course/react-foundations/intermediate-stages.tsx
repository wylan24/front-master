import type { Stage } from "@/lib/academy/types";
import { isSameValue } from "@/lib/academy/format";
import { CodeBlock, StepHeading, Tip } from "../../content";
import { check } from "../check";
import { MODULE_4_STAGES } from "./module-4-props";
import { MODULE_5_STAGES } from "./module-5-dynamic-ui";
import { MODULE_6_STAGES } from "./module-6-events";
import { checkNoReactWarnings, countMatches, readNumber, readText } from "./checks";
import { SHOPFRONT_PRODUCTS_CODE } from "./shopfront-data";

const intermediateFinal: Stage = {
  id: "mid-final",
  level: "mid",
  part: "Module 6 · Making UI Interactive",
  title: "Intermediate final: the product catalogue",
  short: "Final: catalogue",
  lead: (
    <>
      Put Modules 4 to 6 together: components that take props and children,
      a list rendered from data, conditions for stock, and clicks reported to
      the parent.
    </>
  ),
  lesson: (
    <>
      <StepHeading>What you&apos;ll use</StepHeading>
      <ul className="my-3 list-disc pl-8">
        <li>
          <b>Props and children</b>: <code>ProductCard</code> gets its product;{" "}
          <code>Layout</code> wraps whatever it&apos;s given (Module 4)
        </li>
        <li>
          <b>Lists and conditions</b>: <code>map</code> with keys, stock
          messages, a disabled button and an empty state (Module 5)
        </li>
        <li>
          <b>Events through props</b>: the card calls <code>onAdd</code>; the
          app decides what adding means (Module 6)
        </li>
      </ul>

      <StepHeading>Plan it</StepHeading>
      <CodeBlock
        code={`App                        defines handleAdd
└─ Layout                  props: title, children
   └─ Catalogue            props: products, onAdd
      └─ ProductCard (× n) props: product, onAdd`}
      />
      <Tip>
        💡 The checks also render <code>Catalogue</code> on its own with
        different products, so make it use its props, not the{" "}
        <code>products</code> variable directly.
      </Tip>
    </>
  ),
  quiz: [
    {
      question: "Catalogue is given products as a prop. Why not just read the products variable inside it?",
      options: [
        "Variables can't be read inside components",
        "With a prop, the parent decides what to show, so the same Catalogue works for any list (a search result, a category, an empty list)",
        "Props are faster",
        "It makes no difference",
      ],
      answerIndex: 1,
      explanation: "Props make a component reusable: it shows whatever data it's handed.",
    },
    {
      question: "How does ProductCard report that Add to cart was clicked?",
      options: [
        "It changes the products array",
        "It calls the onAdd function it received, passing its product",
        "It logs a message the app reads",
        "It returns the product from render",
      ],
      answerIndex: 1,
      explanation: "Data comes down as props; events go up through function props.",
    },
    {
      question: "A product has stock: 0. Which JSX shows the warning without risking a stray 0?",
      options: [
        "{product.stock && <span>Out of stock</span>}",
        "{product.stock === 0 && <span>Out of stock</span>}",
        "{!product.stock || <span>Out of stock</span>}",
        "{product.stock ? null : 0}",
      ],
      answerIndex: 1,
      explanation: "Put a real true/false comparison on the left of &&.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <ol>
          <li>
            <code>ProductCard</code> (props <code>product</code>,{" "}
            <code>onAdd</code>): an <code>&lt;article&gt;</code> with the name
            in an <code>&lt;h2&gt;</code>, the price like <code>£49.99</code>,
            and an <code>Add to cart</code> button that calls{" "}
            <code>onAdd(product)</code>. Stock 1 to 3 shows{" "}
            <code>Only 2 left!</code>; stock 0 shows <code>Out of stock</code>{" "}
            and disables the button.
          </li>
          <li>
            <code>Catalogue</code> (props <code>products</code>,{" "}
            <code>onAdd</code>): one <code>ProductCard</code> per product, with
            a key, or <code>No products to show.</code> when the list is empty.
          </li>
          <li>
            <code>Layout</code> (props <code>title</code>,{" "}
            <code>children</code>): a <code>&lt;header&gt;</code> with the
            title in an <code>&lt;h1&gt;</code>, then the children in a{" "}
            <code>&lt;main&gt;</code>.
          </li>
          <li>
            <code>App</code>: the catalogue of every product inside{" "}
            <code>{'<Layout title="Shopfront">'}</code>; adding logs{" "}
            <code>Added Laptop Stand</code>.
          </li>
        </ol>
      </>
    ),
    starter: `${SHOPFRONT_PRODUCTS_CODE}

function ProductCard({ product, onAdd }) {
  return <article>{product.name}</article>;
}

function Catalogue({ products, onAdd }) {
  return <section></section>;
}

function Layout({ title, children }) {
  return <div></div>;
}

function App() {
  return <Catalogue products={products} />;
}

render(<App />);
`,
    extract: `(() => {
  let added = "nothing";
  const testProducts = [
    { id: 10, name: "Test Lamp", price: 5, category: "Lighting", stock: 1 },
    { id: 11, name: "Test Mug", price: 8.5, category: "Kitchen", stock: 0 },
  ];
  render(<Catalogue products={testProducts} onAdd={(product) => { added = product.name; }} />);
  const testText = screen.text();
  const testHtml = screen.html();
  const testCards = screen.countComponents("ProductCard");
  screen.click("Add to cart", 0);

  render(<Catalogue products={[]} onAdd={() => {}} />);
  const emptyText = screen.text();
  const emptyCards = screen.countComponents("ProductCard");

  render(<App />);
  const appHtml = screen.html();
  const appCards = screen.countComponents("ProductCard");
  const appLogs = __logsDuring(() => screen.click("Add to cart", 3));
  return { added, testText, testHtml, testCards, emptyText, emptyCards, appHtml, appCards, appLogs };
})()`,
    tests: (values, _code, logs) => {
      const testText = readText(values, "testText");
      const testHtml = readText(values, "testHtml");
      const appHtml = readText(values, "appHtml");
      return [
        check(readNumber(values, "testCards") === 2, "Catalogue shows one ProductCard per product it is given"),
        check(
          testText.includes("Test Lamp") && testText.includes("£5.00") && testText.includes("£8.50"),
          "each card shows its name and price like £8.50"
        ),
        check(testText.includes("Only 1 left!"), "stock 1 shows Only 1 left!"),
        check(
          testText.includes("Out of stock") && countMatches(testHtml, /<button[^>]*\bdisabled\b/) === 1,
          "stock 0 shows Out of stock and disables only that button"
        ),
        check(values.added === "Test Lamp", "clicking Add to cart calls onAdd with that product"),
        check(
          readNumber(values, "emptyCards") === 0 && readText(values, "emptyText").includes("No products to show."),
          "an empty list shows No products to show."
        ),
        check(
          appHtml.startsWith("<header><h1>Shopfront</h1></header><main>") && readNumber(values, "appCards") === 6,
          "App shows all six products inside the Shopfront Layout"
        ),
        check(isSameValue(values.appLogs, ["Added Laptop Stand"]), "in the app, adding the Laptop Stand logs Added Laptop Stand"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        In Catalogue, return the empty message first when{" "}
        <code>products.length === 0</code>, then{" "}
        <code>{"products.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)"}</code>
        . In ProductCard:{" "}
        <code>{"<button disabled={product.stock === 0} onClick={() => onAdd(product)}>"}</code>
        .
      </>
    ),
    solution: `${SHOPFRONT_PRODUCTS_CODE}

function ProductCard({ product, onAdd }) {
  const isSoldOut = product.stock === 0;
  const isRunningLow = product.stock > 0 && product.stock <= 3;

  return (
    <article>
      <h2>{product.name}</h2>
      <p>£{product.price.toFixed(2)}</p>
      {isRunningLow && <small>Only {product.stock} left!</small>}
      {isSoldOut && <small>Out of stock</small>}
      <button disabled={isSoldOut} onClick={() => onAdd(product)}>
        Add to cart
      </button>
    </article>
  );
}

function Catalogue({ products, onAdd }) {
  if (products.length === 0) {
    return <p>No products to show.</p>;
  }

  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </section>
  );
}

function Layout({ title, children }) {
  return (
    <>
      <header>
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
    </>
  );
}

function App() {
  function handleAdd(product) {
    console.log("Added " + product.name);
  }

  return (
    <Layout title="Shopfront">
      <Catalogue products={products} onAdd={handleAdd} />
    </Layout>
  );
}

render(<App />);`,
  },
};

/** React Foundations' intermediate section: Modules 4 to 6, then the intermediate final. */
export const REACT_INTERMEDIATE_STAGES: Stage[] = [
  ...MODULE_4_STAGES,
  ...MODULE_5_STAGES,
  ...MODULE_6_STAGES,
  intermediateFinal,
];
