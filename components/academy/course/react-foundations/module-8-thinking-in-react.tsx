import type { Stage } from "@/lib/academy/types";
import { CodeBlock, StepHeading, Tip } from "../../content";
import { check } from "../check";
import { ClassifySorter } from "../../widgets/classify-sorter";
import { checkNoReactWarnings, countMatches, readNumber, readText } from "./checks";
import { SHOPFRONT_PRODUCTS_CODE } from "./shopfront-data";

const PART = "Module 8 · Thinking in React";

// ---------------------------------------------------------------------------
// Widgets for this module
// ---------------------------------------------------------------------------

function StatePropOrDerivedWidget() {
  return (
    <ClassifySorter
      intro="For the finished Shopfront, is each piece of information state, a prop, or calculated from something else?"
      categories={[
        { id: "state", label: "State" },
        { id: "prop", label: "Prop" },
        { id: "derived", label: "Calculated" },
      ]}
      items={[
        {
          text: "The text typed in the search box",
          answer: "state",
          why: "It changes as the user types, and can't be worked out from anything else.",
        },
        {
          text: "The products that match the search",
          answer: "derived",
          why: "Filter the catalogue by the search text on each render.",
        },
        {
          text: "The product a ProductCard shows",
          answer: "prop",
          why: "The card is handed it by ProductList. It never changes it.",
        },
        {
          text: "Which products are in the cart",
          answer: "state",
          why: "It changes when the user clicks Add, and must be remembered.",
        },
        {
          text: "The cart's total price",
          answer: "derived",
          why: "Add up the cart items. Storing it would be a second copy that can drift.",
        },
        {
          text: "Whether to show 'No products match'",
          answer: "derived",
          why: "It's true exactly when the filtered list is empty.",
        },
        {
          text: "The selected category",
          answer: "state",
          why: "The user changes it, and the app must remember it.",
        },
        {
          text: "The cart count shown in Header",
          answer: "prop",
          why: "From Header's point of view it's a prop. App calculates it from the cart and passes it down.",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const thinkingInReact: Stage = {
  id: "adv-thinking",
  level: "adv",
  part: PART,
  title: "From design to components and state",
  short: "Thinking in React",
  lead: (
    <>
      Everything so far adds up to one method for turning a design into an
      app. Learn the questions, and a blank file stops being scary.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The method</StepHeading>
      <p>Look at a design and answer these, in order, before writing code:</p>
      <ol className="my-3 list-decimal pl-8">
        <li>
          <b>What are the components?</b> Draw boxes; each has one job.
          (Module 3)
        </li>
        <li>
          <b>What data does each component need?</b> (Module 4)
        </li>
        <li>
          <b>Which components should receive props?</b> Anything shown but not
          owned. (Module 4)
        </li>
        <li>
          <b>What changes when the user interacts?</b> List the events. (Module 6)
        </li>
        <li>
          <b>What information needs to be state?</b> Only what changes and
          can&apos;t be calculated. (Module 7)
        </li>
        <li>
          <b>Where should that state live?</b> The closest common parent of
          everything that uses it. (Module 7)
        </li>
        <li>
          <b>What can be calculated instead of stored?</b> Totals, counts,
          filtered lists, flags. (Modules 5 and 7)
        </li>
        <li>
          <b>How do the components communicate?</b> Values down as props,
          events up as function props. (Modules 4 and 6)
        </li>
      </ol>

      <StepHeading>Worked example: a product search</StepHeading>
      <CodeBlock
        code={`// 1-3. One component, ProductSearch: an input, a count, and a list.
// 4.   The user types in the input.
// 5.   State: the search text. That's all.
// 6.   It lives in ProductSearch: nothing else needs it.
// 7.   Calculated: the matching products, the count, the empty message.

function ProductSearch() {
  const [query, setQuery] = useState("");

  const matches = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section>
      <input
        placeholder="Search products"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      ...
    </section>
  );
}`}
      />
      <p>
        Notice <code>value={"{query}"}</code> <b>and</b>{" "}
        <code>onChange</code>. That makes it a <b>controlled input</b>: the
        state is the single source of truth for what the box shows, so
        anything else (a Clear button, say) can change it too.
      </p>
      <Tip>
        💡 Start with a version that shows the right thing for fixed data, with
        no state at all. Then add the smallest state that makes it
        interactive.
      </Tip>
    </>
  ),
  widget: { title: "State, prop, or calculated?", Component: StatePropOrDerivedWidget },
  quiz: [
    {
      question: "Why wouldn't you store the filtered products in state?",
      options: [
        "React can't store arrays",
        "They can be calculated from the products and the search text, so storing them creates a copy that can go stale",
        "Filtering is too slow to do in state",
        "You would; that's the right approach",
      ],
      answerIndex: 1,
      explanation: "The fewer copies of the truth, the fewer ways for them to disagree.",
    },
    {
      question: "What makes an input 'controlled'?",
      options: [
        "It has a placeholder",
        "Its value comes from state, and onChange updates that state",
        "It's inside a form",
        "It uses useRef",
      ],
      answerIndex: 1,
      explanation: "value={query} plus onChange: React state decides what the box shows.",
    },
    {
      question: "Where should the search text state live, if only ProductSearch uses it?",
      options: [
        "In App, always",
        "In ProductSearch: the closest component that uses it",
        "In a global variable",
        "In every ProductCard",
      ],
      answerIndex: 1,
      explanation: "Lift state only as high as needed. Here, nothing else needs it.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          Build <code>ProductSearch</code> using the method above. It needs:
        </p>
        <ol>
          <li>
            a <b>controlled</b> input with the placeholder{" "}
            <code>Search products</code>
          </li>
          <li>
            a <code>&lt;li&gt;</code> (with a key) for each product whose name
            contains the search text, ignoring upper/lower case
          </li>
          <li>
            a line <code>Results: 6</code> with the number of matches
          </li>
          <li>
            when nothing matches:{" "}
            <code>No products match &quot;zzz&quot;</code> (with the search
            text) and no list items
          </li>
        </ol>
        <p>Use exactly one piece of state.</p>
      </>
    ),
    starter: `${SHOPFRONT_PRODUCTS_CODE}

// 1. Components?   2. Data?   3. Props?   4. What changes?
// 5. State?        6. Where?  7. Calculated?  8. Communication?

function ProductSearch() {
  return (
    <section>
      <input placeholder="Search products" />
    </section>
  );
}

render(<ProductSearch />);
`,
    extract: `(() => {
  render(<ProductSearch />);
  const startItems = screen.count("li");
  const startText = screen.text();
  screen.type("Search products", "desk");
  const deskItems = screen.count("li");
  const deskText = screen.text();
  const deskHtml = screen.html();
  screen.type("Search products", "KEY");
  const keyText = screen.text();
  const keyItems = screen.count("li");
  screen.type("Search products", "zzz");
  const noneItems = screen.count("li");
  const noneText = screen.text();
  screen.type("Search products", "");
  const clearedItems = screen.count("li");
  return { startItems, startText, deskItems, deskText, deskHtml, keyText, keyItems, noneItems, noneText, clearedItems };
})()`,
    tests: (values, code, logs) => [
      check(
        readNumber(values, "startItems") === 6 && readText(values, "startText").includes("Results: 6"),
        "with no search, all six products are listed with Results: 6"
      ),
      check(
        readNumber(values, "deskItems") === 1 && readText(values, "deskText").includes("Desk Lamp") && readText(values, "deskText").includes("Results: 1"),
        'typing "desk" lists only the Desk Lamp, with Results: 1'
      ),
      check(readText(values, "deskHtml").includes('value="desk"'), "the input is controlled: its value comes from state"),
      check(
        readNumber(values, "keyItems") === 1 && readText(values, "keyText").includes("Wireless Keyboard"),
        'typing "KEY" finds the Wireless Keyboard (case is ignored)'
      ),
      check(
        readNumber(values, "noneItems") === 0 && readText(values, "noneText").includes('No products match "zzz"'),
        'typing "zzz" shows No products match "zzz" and no items'
      ),
      check(readNumber(values, "clearedItems") === 6, "clearing the box shows everything again"),
      check(countMatches(code, /useState\(/) === 1, "there is exactly one piece of state"),
      checkNoReactWarnings(logs),
    ],
    hint: (
      <>
        <code>const [query, setQuery] = useState(&quot;&quot;);</code>, then{" "}
        <code>const matches = products.filter(...)</code> using{" "}
        <code>toLowerCase()</code> on both sides of <code>includes</code>. Give
        the input <code>{"value={query}"}</code> and{" "}
        <code>{"onChange={(event) => setQuery(event.target.value)}"}</code>.
      </>
    ),
    solution: `${SHOPFRONT_PRODUCTS_CODE}

function ProductSearch() {
  const [query, setQuery] = useState("");

  const searchText = query.toLowerCase();
  const matches = products.filter((product) =>
    product.name.toLowerCase().includes(searchText)
  );

  return (
    <section>
      <input
        placeholder="Search products"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p>Results: {matches.length}</p>
      {matches.length === 0 && <p>No products match "{query}"</p>}
      <ul>
        {matches.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </section>
  );
}

render(<ProductSearch />);`,
  },
};

const finalShopfront: Stage = {
  id: "adv-final",
  level: "adv",
  part: PART,
  title: "Advanced final: build Shopfront",
  short: "Final: Shopfront",
  lead: (
    <>
      The whole course in one app: a searchable, filterable catalogue with a
      working cart. This time you design it yourself.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The brief</StepHeading>
      <p>
        Shopfront sells six products. A shopper can search by name, filter by
        category, and add things to their cart. The header always shows how
        many items are in the cart and what they cost. Sold-out products
        can&apos;t be added.
      </p>

      <StepHeading>Plan before you code</StepHeading>
      <p>Answer the eight questions from the last stage. One good answer:</p>
      <CodeBlock
        code={`App                       state: query, category, cart
├─ Header                 props: itemCount, total        (calculated in App)
├─ Filters                props: query, category, onQueryChange, onCategoryChange
└─ ProductList            props: products (calculated: filtered), onAdd
   └─ ProductCard (× n)   props: product, onAdd`}
      />
      <ul className="my-3 list-disc pl-8">
        <li>
          <b>State</b> (three things): the search text, the category, and the
          cart&apos;s contents.
        </li>
        <li>
          <b>Calculated</b>: the visible products, the item count, the total,
          and whether to show the empty message.
        </li>
        <li>
          <b>Communication</b>: values down as props; <code>onAdd</code>,{" "}
          <code>onQueryChange</code> and <code>onCategoryChange</code> up.
        </li>
      </ul>

      <StepHeading>Build it in slices</StepHeading>
      <ol className="my-3 list-decimal pl-8">
        <li>Render every product as a card, with no state at all.</li>
        <li>Add the search box and its state, then the filter calculation.</li>
        <li>Add the category select the same way.</li>
        <li>Add the cart state, the Add button handler, and the header totals.</li>
        <li>Handle sold-out products and the empty state.</li>
      </ol>
      <Tip>
        💡 Run after every slice. The checks list tells you exactly which
        parts already work.
      </Tip>
    </>
  ),
  quiz: [
    {
      question: "How many pieces of state does Shopfront need?",
      options: [
        "One per product",
        "Three: the search text, the category, and the cart",
        "Six: also the total, the count and the filtered list",
        "None: props are enough",
      ],
      answerIndex: 1,
      explanation: "Everything else can be calculated from those three on each render.",
    },
    {
      question: "Header and ProductList both depend on the cart. Where does the cart state live?",
      options: ["Header", "ProductList", "App, their closest common parent", "ProductCard"],
      answerIndex: 2,
      explanation: "App passes the totals down to Header and onAdd down to the list.",
    },
    {
      question: "The shopper picks 'Audio' and types 'lamp'. What should the list show?",
      options: [
        "The Desk Lamp, ignoring the category",
        "Everything in Audio",
        "No products: both filters apply, and nothing matches both, so show the empty message",
        "An error",
      ],
      answerIndex: 2,
      explanation: "The visible list is products that match the search AND the category.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>Build Shopfront. Organise it however you like; it must have:</p>
        <ol>
          <li>
            a header showing <code>Cart (2) · £99.98</code>: the number of
            items and their total
          </li>
          <li>
            a controlled search input with the placeholder{" "}
            <code>Search products</code>, matching names (case ignored)
          </li>
          <li>
            a <code>{'<select aria-label="Category">'}</code> with the options{" "}
            <code>All</code>, <code>Accessories</code>, <code>Displays</code>,{" "}
            <code>Audio</code> and <code>Lighting</code>
          </li>
          <li>
            each visible product in an <code>&lt;article&gt;</code> with its
            name, its price (<code>£49.99</code>) and an{" "}
            <code>Add to cart</code> button
          </li>
          <li>
            for sold-out products: <code>Out of stock</code> and a disabled
            button
          </li>
          <li>
            when nothing matches: <code>No products match your search.</code>
          </li>
        </ol>
        <p>Use at most three pieces of state, and calculate everything else.</p>
      </>
    ),
    starter: `${SHOPFRONT_PRODUCTS_CODE}

// Plan first:
// 1. Components?  2. Data?  3. Props?  4. What changes?
// 5. State?  6. Where does it live?  7. What's calculated?  8. Communication?

function App() {
  return (
    <main>
      <h1>Shopfront</h1>
    </main>
  );
}

render(<App />);
`,
    extract: `(() => {
  render(<App />);
  const startArticles = screen.count("article");
  const startText = screen.text();
  const startHtml = screen.html();

  screen.type("Search products", "LAMP");
  const lampArticles = screen.count("article");
  const lampText = screen.text();
  screen.type("Search products", "");

  screen.type("Category", "Audio");
  const audioArticles = screen.count("article");
  const audioText = screen.text();

  screen.type("Search products", "lamp");
  const bothArticles = screen.count("article");
  const bothText = screen.text();
  screen.type("Search products", "");
  screen.type("Category", "All");
  const resetArticles = screen.count("article");

  screen.click("Add to cart", 0);
  screen.click("Add to cart", 0);
  const afterAddsText = screen.text();
  screen.click("Add to cart", 1);
  const afterSoldOutText = screen.text();

  return {
    startArticles, startText, startHtml,
    lampArticles, lampText,
    audioArticles, audioText,
    bothArticles, bothText,
    resetArticles, afterAddsText, afterSoldOutText,
  };
})()`,
    tests: (values, code, logs) => {
      const startText = readText(values, "startText");
      const startHtml = readText(values, "startHtml");
      return [
        check(readNumber(values, "startArticles") === 6, "all six products start on screen, each in an <article>"),
        check(startText.includes("£49.99") && startText.includes("£189.00"), "prices are shown like £49.99"),
        check(startText.includes("Cart (0) · £0.00"), "the header starts at Cart (0) · £0.00"),
        check(
          readNumber(values, "lampArticles") === 1 && readText(values, "lampText").includes("Desk Lamp"),
          'searching "LAMP" shows only the Desk Lamp'
        ),
        check(
          readNumber(values, "audioArticles") === 1 && readText(values, "audioText").includes("Noise-Cancelling Headphones"),
          "choosing Audio shows only the headphones"
        ),
        check(
          readNumber(values, "bothArticles") === 0 && readText(values, "bothText").includes("No products match your search."),
          "Audio + lamp matches nothing and shows the empty message"
        ),
        check(readNumber(values, "resetArticles") === 6, "clearing the search and choosing All shows everything again"),
        check(readText(values, "afterAddsText").includes("Cart (2) · £99.98"), "adding the keyboard twice shows Cart (2) · £99.98"),
        check(
          startText.includes("Out of stock") && /<button[^>]*\bdisabled\b[^>]*>Add to cart/.test(startHtml),
          "the sold-out mouse shows Out of stock and a disabled button"
        ),
        check(readText(values, "afterSoldOutText").includes("Cart (2) · £99.98"), "clicking the sold-out button changes nothing"),
        check(countMatches(code, /useState\(/) <= 3, "three pieces of state or fewer"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        In App: <code>useState(&quot;&quot;)</code> for the query,{" "}
        <code>useState(&quot;All&quot;)</code> for the category,{" "}
        <code>useState([])</code> for the cart (an array of products). Then
        calculate <code>visibleProducts</code> with one <code>filter</code>{" "}
        that checks both, and the total with a loop over the cart. Adding is{" "}
        <code>setCart([...cart, product])</code>.
      </>
    ),
    solution: `${SHOPFRONT_PRODUCTS_CODE}

const categories = ["All", "Accessories", "Displays", "Audio", "Lighting"];

function Header({ itemCount, total }) {
  return (
    <header>
      <h1>Shopfront</h1>
      <p>
        Cart ({itemCount}) · £{total.toFixed(2)}
      </p>
    </header>
  );
}

function Filters({ query, category, onQueryChange, onCategoryChange }) {
  return (
    <div>
      <input
        placeholder="Search products"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <select
        aria-label="Category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        {categories.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ProductCard({ product, onAdd }) {
  const isSoldOut = product.stock === 0;

  return (
    <article>
      <h2>{product.name}</h2>
      <p>£{product.price.toFixed(2)}</p>
      {isSoldOut && <p>Out of stock</p>}
      <button disabled={isSoldOut} onClick={() => onAdd(product)}>
        Add to cart
      </button>
    </article>
  );
}

function ProductList({ products, onAdd }) {
  if (products.length === 0) {
    return <p>No products match your search.</p>;
  }

  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </section>
  );
}

function matchesFilters(product, query, category) {
  const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
  const matchesCategory = category === "All" || product.category === category;
  return matchesQuery && matchesCategory;
}

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const visibleProducts = products.filter((product) =>
    matchesFilters(product, query, category)
  );

  let total = 0;
  for (const product of cart) {
    total = total + product.price;
  }

  function handleAdd(product) {
    setCart([...cart, product]);
  }

  return (
    <main>
      <Header itemCount={cart.length} total={total} />
      <Filters
        query={query}
        category={category}
        onQueryChange={setQuery}
        onCategoryChange={setCategory}
      />
      <ProductList products={visibleProducts} onAdd={handleAdd} />
    </main>
  );
}

render(<App />);`,
  },
};

export const MODULE_8_STAGES: Stage[] = [thinkingInReact, finalShopfront];
