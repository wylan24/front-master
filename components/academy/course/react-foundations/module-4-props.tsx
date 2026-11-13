import type { Stage } from "@/lib/academy/types";
import { Analogy, CodeBlock, StepHeading, Tip } from "../../content";
import { check } from "../check";
import { ReactPlayground } from "../../widgets/react-playground";
import { checkNoReactWarnings, readNumber, readText } from "./checks";

const PART = "Module 4 · Data, Props and Composition";

// ---------------------------------------------------------------------------
// Widgets for this module
// ---------------------------------------------------------------------------

function PropsWidget() {
  return (
    <ReactPlayground
      intro="Props are how a parent hands data to a child. Predict each preview before you run it."
      examples={[
        {
          label: "Passing props",
          code: `function ProductCard({ name, price }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>£{price.toFixed(2)}</p>
    </article>
  );
}

function App() {
  return (
    <main>
      <ProductCard name="Desk Lamp" price={22} />
      <ProductCard name="Laptop Stand" price={34.5} />
    </main>
  );
}

render(<App />);`,
          lookFor: "Same blueprint, different data. Add a third card with your own product.",
        },
        {
          label: "Text vs number",
          code: `function ProductCard({ name, price }) {
  console.log(name, "price is a", typeof price);
  return <p>{name}: £{price}</p>;
}

function App() {
  return (
    <main>
      <ProductCard name="Desk Lamp" price={22} />
      <ProductCard name="Laptop Stand" price="34.50" />
    </main>
  );
}

render(<App />);`,
          lookFor: 'Quotes pass text. Braces pass a JavaScript value. Try price.toFixed(2) and see which card breaks.',
        },
        {
          label: "A missing prop",
          code: `function Greeting({ name }) {
  return <p>Hello, {name}!</p>;
}

render(<Greeting />);`,
          lookFor: "A prop nobody passed is undefined, and React shows nothing for undefined.",
        },
      ]}
    />
  );
}

function PropRulesWidget() {
  return (
    <ReactPlayground
      intro="Props flow one way, from parent to child, and the child must not change them."
      examples={[
        {
          label: "Changing a prop",
          code: `function PriceTag(props) {
  props.price = props.price * 0.9;
  return <p>£{props.price.toFixed(2)}</p>;
}

render(<PriceTag price={50} />);`,
          lookFor: "Props are read-only. Calculate a new variable instead: const salePrice = props.price * 0.9;",
        },
        {
          label: "Default values",
          code: `function PriceTag({ price, currency = "£" }) {
  return <p>{currency}{price.toFixed(2)}</p>;
}

function App() {
  return (
    <>
      <PriceTag price={50} />
      <PriceTag price={50} currency="€" />
    </>
  );
}

render(<App />);`,
          lookFor: "currency = \"£\" is used only when the parent doesn't pass a currency.",
        },
        {
          label: "Passing an object",
          code: `const lamp = { id: 6, name: "Desk Lamp", price: 22 };

function ProductCard({ product }) {
  return (
    <article>
      <h2>{product.name}</h2>
      <p>£{product.price.toFixed(2)}</p>
    </article>
  );
}

render(<ProductCard product={lamp} />);`,
          lookFor: "One prop can carry a whole object. Handy when the data already comes as objects.",
        },
      ]}
    />
  );
}

function ChildrenWidget() {
  return (
    <ReactPlayground
      intro="children is whatever you put between a component's opening and closing tags."
      examples={[
        {
          label: "A Card wrapper",
          code: `function Card({ children }) {
  return <section>{children}</section>;
}

function App() {
  return (
    <>
      <Card>
        <h2>Desk Lamp</h2>
        <p>£22.00</p>
      </Card>
      <Card>
        <p>Free returns on everything.</p>
      </Card>
    </>
  );
}

render(<App />);`,
          lookFor: "Card doesn't know or care what's inside it. It just provides the frame.",
        },
        {
          label: "Layout with a title",
          code: `function Layout({ title, children }) {
  return (
    <>
      <header>
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
      <footer>© Shopfront</footer>
    </>
  );
}

render(
  <Layout title="Shopfront">
    <p>Products go here.</p>
  </Layout>
);`,
          lookFor: "Props and children together: the title is data, the children are content.",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const passingProps: Stage = {
  id: "mid-props",
  level: "mid",
  part: PART,
  title: "Props: giving components data",
  short: "Props",
  lead: (
    <>
      Every card showed the same product. <b>Props</b> let a parent hand each
      child its own data, the way arguments give a function its inputs.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        At the end of Module 3, <code>ProductList</code> showed three
        identical keyboards. The blueprint is right; it just needs different
        data each time it&apos;s used.
      </p>

      <StepHeading>The mental model</StepHeading>
      <p>
        A component is a function, and <b>props are its arguments</b>. The
        parent passes them as attributes; React collects them into one object
        and hands it to the function.
      </p>
      <Analogy icon="📝">
        A form letter: &quot;Dear ____, your order of ____ has shipped.&quot;
        The letter is the component; the blanks are props; each customer gets
        the same letter with their own details.
      </Analogy>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`// The child declares what it needs (destructuring the props object)
function ProductCard({ name, price }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>£{price.toFixed(2)}</p>
    </article>
  );
}

// The parent decides what to give it
<ProductCard name="Desk Lamp" price={22} />

// React calls: ProductCard({ name: "Desk Lamp", price: 22 })`}
      />
      <ul className="my-3 list-disc pl-8">
        <li>
          <code>name=&quot;Desk Lamp&quot;</code> passes text.{" "}
          <code>{"price={22}"}</code> passes a number. Use braces for anything
          that isn&apos;t plain text: numbers, booleans, arrays, objects,
          variables.
        </li>
        <li>
          <code>{"{ name, price }"}</code> is ordinary destructuring. Writing{" "}
          <code>function ProductCard(props)</code> and then{" "}
          <code>props.name</code> works too.
        </li>
      </ul>
      <Tip>
        💡 <b>Common mistake:</b> <code>price=&quot;22&quot;</code> passes the
        string <code>&quot;22&quot;</code>, so <code>price.toFixed</code>{" "}
        fails with &quot;toFixed is not a function&quot;.
      </Tip>
    </>
  ),
  widget: { title: "Pass props", Component: PropsWidget },
  quiz: [
    {
      question: "What are props?",
      options: [
        "Global variables every component can read",
        "The inputs a parent passes to a child component, like a function's arguments",
        "CSS properties",
        "Values a component stores for itself",
      ],
      answerIndex: 1,
      explanation: "Props are how data gets from a parent into a child.",
    },
    {
      question: (
        <>
          In <code>&lt;ProductCard price=&quot;49.99&quot; /&gt;</code>, what is{" "}
          <code>typeof price</code> inside ProductCard?
        </>
      ),
      options: ["number", "string", "undefined", "object"],
      answerIndex: 1,
      explanation: "Quotes always mean text. For a number, write price={49.99}.",
    },
    {
      question: (
        <>
          <code>{"function Greeting({ name }) { return <p>Hi {name}</p>; }"}</code>{" "}
          is used as <code>&lt;Greeting /&gt;</code>. What appears?
        </>
      ),
      options: ["Hi undefined", "Hi ", "An error", "Hi name"],
      answerIndex: 1,
      explanation: "name is undefined because nobody passed it, and React draws nothing for undefined.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <ol>
          <li>
            Change <code>ProductCard</code> to take <code>name</code> and{" "}
            <code>price</code> props, showing the name in the{" "}
            <code>&lt;h2&gt;</code> and the price as <code>£34.50</code> (use{" "}
            <code>toFixed(2)</code>)
          </li>
          <li>
            In <code>App</code>, show three different products: Wireless
            Keyboard (49.99), Ergonomic Mouse (29.99) and Laptop Stand (34.5).
            Pass the prices as numbers.
          </li>
        </ol>
      </>
    ),
    starter: `function ProductCard() {
  return (
    <article>
      <h2>Wireless Keyboard</h2>
      <p>£49.99</p>
      <button>Add to cart</button>
    </article>
  );
}

function App() {
  return (
    <main>
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </main>
  );
}

render(<App />);
`,
    extract: `(() => {
  render(<ProductCard name="Test Lamp" price={5} />);
  const single = screen.text();
  render(<App />);
  return { single, text: screen.text(), cards: screen.countComponents("ProductCard") };
})()`,
    tests: (values, _code, logs) => {
      const single = readText(values, "single");
      const text = readText(values, "text");
      return [
        check(
          single.includes("Test Lamp") && single.includes("£5.00"),
          "ProductCard shows whatever name and price it is given"
        ),
        check(readNumber(values, "cards") === 3, "App shows three ProductCards"),
        check(
          text.includes("Wireless Keyboard") && text.includes("Ergonomic Mouse") && text.includes("Laptop Stand"),
          "each card shows a different product"
        ),
        check(
          text.includes("£49.99") && text.includes("£29.99") && text.includes("£34.50"),
          "prices are shown with two decimal places"
        ),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        <code>{"function ProductCard({ name, price })"}</code>, then{" "}
        <code>{"<h2>{name}</h2>"}</code> and{" "}
        <code>{"<p>£{price.toFixed(2)}</p>"}</code>. In App:{" "}
        <code>{'<ProductCard name="Laptop Stand" price={34.5} />'}</code>.
      </>
    ),
    solution: `function ProductCard({ name, price }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>£{price.toFixed(2)}</p>
      <button>Add to cart</button>
    </article>
  );
}

function App() {
  return (
    <main>
      <ProductCard name="Wireless Keyboard" price={49.99} />
      <ProductCard name="Ergonomic Mouse" price={29.99} />
      <ProductCard name="Laptop Stand" price={34.5} />
    </main>
  );
}

render(<App />);`,
  },
};

const propRules: Stage = {
  id: "mid-props-rules",
  level: "mid",
  part: PART,
  title: "Props flow down and are read-only",
  short: "Rules of props",
  lead: (
    <>
      Data flows <b>one way</b>: from parent to child. A child can read its
      props and calculate new values from them, but never change them.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        If any component could change the data it was given, a price shown in
        three places could be changed by one of them, and the other two would
        be wrong. That is Module 1&apos;s drift, coming back through the side
        door.
      </p>

      <StepHeading>The mental model</StepHeading>
      <Analogy icon="🌊">
        Props are a <b>river</b>: they flow downhill, from parent to child to
        grandchild. Water doesn&apos;t flow back up. If you want to know where
        a value came from, walk up the tree.
      </Analogy>
      <p>
        The owner of a piece of data is the component that created it. Only
        the owner changes it (you&apos;ll see how in Module 7). Everyone below
        just reads.
      </p>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`// ❌ Changing a prop: React freezes props, so this throws an error
function PriceTag(props) {
  props.price = props.price * 0.9;
}

// ✅ Calculate a new value from the prop
function PriceTag({ price, discount = 0, currency = "£" }) {
  const finalPrice = price - (price * discount) / 100;
  return <p>{currency}{finalPrice.toFixed(2)}</p>;
}`}
      />
      <ul className="my-3 list-disc pl-8">
        <li>
          <b>Default values</b> (<code>currency = &quot;£&quot;</code>) apply
          when the parent doesn&apos;t pass that prop.
        </li>
        <li>
          Passing a whole object (<code>{"product={product}"}</code>) is
          common when the data already comes as objects.
        </li>
      </ul>
      <Tip>
        💡 A component that gives the same output for the same props, and
        changes nothing outside itself, is called <b>pure</b>. React expects
        components to be pure. It&apos;s what makes <code>UI = f(data)</code>{" "}
        true.
      </Tip>
    </>
  ),
  widget: { title: "Read-only, one-way, with defaults", Component: PropRulesWidget },
  quiz: [
    {
      question: "Which direction do props flow?",
      options: [
        "From child to parent",
        "From parent to child",
        "Both ways",
        "Sideways, between siblings",
      ],
      answerIndex: 1,
      explanation: "Parents pass props down. Data never flows up through props.",
    },
    {
      question: "A child needs a price with 10% off. What should it do?",
      options: [
        "props.price = props.price * 0.9",
        "Calculate a new variable: const salePrice = price * 0.9",
        "Ask React to unfreeze the props",
        "Store the price in a global variable",
      ],
      answerIndex: 1,
      explanation: "Leave the prop alone; derive what you need from it.",
    },
    {
      question: (
        <>
          With <code>{'function Tag({ currency = "£" })'}</code>, which uses the default?
        </>
      ),
      options: [
        '<Tag currency="€" />',
        "<Tag />",
        '<Tag currency="" />',
        "All of them",
      ],
      answerIndex: 1,
      explanation: 'A default applies only when the prop is missing (undefined). An empty string "" is still a value.',
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          <code>PriceTag</code> crashes because it changes its props. Rewrite
          it so it:
        </p>
        <ol>
          <li>
            takes <code>price</code>, <code>currency</code> (default{" "}
            <code>&quot;£&quot;</code>) and <code>discount</code> (a percentage,
            default <code>0</code>)
          </li>
          <li>
            shows the price after the discount, like <code>£75.00</code>
          </li>
          <li>
            shows <code>Save 25%</code> only when there is a discount
          </li>
          <li>never assigns to a prop</li>
        </ol>
      </>
    ),
    starter: `function PriceTag(props) {
  props.price = props.price - (props.price * props.discount) / 100;
  return (
    <p>
      {props.currency}{props.price.toFixed(2)}
    </p>
  );
}

render(<PriceTag price={49.99} discount={10} />);
`,
    extract: `(() => {
  render(<PriceTag price={100} />);
  const plain = screen.text();
  render(<PriceTag price={100} discount={25} />);
  const discounted = screen.text();
  render(<PriceTag price={10} currency="€" />);
  const euros = screen.text();
  return { plain, discounted, euros };
})()`,
    tests: (values, code, logs) => {
      const plain = readText(values, "plain");
      const discounted = readText(values, "discounted");
      const euros = readText(values, "euros");
      return [
        check(plain.includes("£100.00"), "<PriceTag price={100} /> shows £100.00 (default currency)"),
        check(!plain.includes("Save"), "with no discount, there's no Save message"),
        check(discounted.includes("£75.00"), "a 25% discount on 100 shows £75.00"),
        check(discounted.includes("Save 25%"), "a 25% discount shows Save 25%"),
        check(euros.includes("€10.00"), 'currency="€" shows €10.00'),
        check(!/props\.\w+\s*=(?!=)/.test(code), "no prop is assigned to"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        <code>{'function PriceTag({ price, currency = "£", discount = 0 })'}</code>
        , then <code>const finalPrice = price - (price * discount) / 100;</code>
        . For the message: <code>{"{discount > 0 ? <span> Save {discount}%</span> : null}"}</code>.
      </>
    ),
    solution: `function PriceTag({ price, currency = "£", discount = 0 }) {
  const finalPrice = price - (price * discount) / 100;

  return (
    <p>
      {currency}{finalPrice.toFixed(2)}
      {discount > 0 ? <strong> Save {discount}%</strong> : null}
    </p>
  );
}

render(<PriceTag price={49.99} discount={10} />);`,
  },
};

const childrenAndComposition: Stage = {
  id: "mid-children",
  level: "mid",
  part: PART,
  title: "Composition with children",
  short: "Children",
  lead: (
    <>
      Some components are frames: a layout, a card, a modal. They wrap{" "}
      <b>other content</b> without knowing what it is, using the special{" "}
      <code>children</code> prop.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        Every Shopfront page needs the same header and footer around different
        content. Copying them into each page brings back the duplication
        problem. Making a prop for every possible piece of content doesn&apos;t
        scale either.
      </p>

      <StepHeading>The mental model</StepHeading>
      <Analogy icon="🖼️">
        A picture frame doesn&apos;t care which painting goes in it. It
        provides the border; you provide the picture.
      </Analogy>
      <p>
        Whatever you put <b>between</b> a component&apos;s opening and closing
        tags arrives as a prop called <code>children</code>. The component
        decides where to place it.
      </p>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`function Layout({ title, children }) {
  return (
    <>
      <header><h1>{title}</h1></header>
      <main>{children}</main>
      <footer>© Shopfront</footer>
    </>
  );
}

function App() {
  return (
    <Layout title="Shopfront">
      <ProductCard name="Desk Lamp" price={22} />   {/* ← these are children */}
      <ProductCard name="Laptop Stand" price={34.5} />
    </Layout>
  );
}`}
      />
      <p>
        This is <b>composition</b>: building bigger components by nesting
        smaller ones, instead of making one component that knows about
        everything.
      </p>
      <Tip>
        💡 Use a normal prop for <b>data</b> (a title, a price). Use{" "}
        <code>children</code> for <b>content</b> (a chunk of JSX).
      </Tip>
    </>
  ),
  widget: { title: "Wrap content with children", Component: ChildrenWidget },
  quiz: [
    {
      question: "What is the children prop?",
      options: [
        "A list of a component's child components, created automatically",
        "Whatever JSX is placed between the component's opening and closing tags",
        "An array of the props a parent passes",
        "A reserved word you can't use",
      ],
      answerIndex: 1,
      explanation: "<Card>this part</Card>: \"this part\" arrives as children.",
    },
    {
      question: (
        <>
          <code>{"function Card({ children }) { return <section>{children}</section>; }"}</code>
          . What does <code>&lt;Card&gt;&lt;p&gt;Hi&lt;/p&gt;&lt;/Card&gt;</code> render?
        </>
      ),
      options: [
        "<section></section>",
        "<section><p>Hi</p></section>",
        "<p>Hi</p> only",
        "<Card><p>Hi</p></Card>",
      ],
      answerIndex: 1,
      explanation: "The <p> is passed as children, and Card places it inside the section.",
    },
    {
      question: "Why is a Layout with children better than copying the header and footer into each page?",
      options: [
        "It loads faster",
        "The frame is defined once, and each page only supplies its own content",
        "Browsers require it",
        "It isn't better",
      ],
      answerIndex: 1,
      explanation: "One definition of the frame; content passed in. Change the footer once and every page updates.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <ol>
          <li>
            Create <code>Layout</code>, taking <code>title</code> and{" "}
            <code>children</code>. It renders a <code>&lt;header&gt;</code>{" "}
            containing an <code>&lt;h1&gt;</code> with the title, a{" "}
            <code>&lt;main&gt;</code> containing the children, and a{" "}
            <code>&lt;footer&gt;</code> saying <code>© Shopfront</code>.
          </li>
          <li>
            Change <code>App</code> to use{" "}
            <code>{'<Layout title="Shopfront">'}</code> around the product
            cards, instead of writing the header and footer itself.
          </li>
        </ol>
      </>
    ),
    starter: `function ProductCard({ name, price }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>£{price.toFixed(2)}</p>
    </article>
  );
}

// Layout goes here

function App() {
  return (
    <>
      <header>
        <h1>Shopfront</h1>
      </header>
      <main>
        <ProductCard name="Desk Lamp" price={22} />
        <ProductCard name="Laptop Stand" price={34.5} />
      </main>
      <footer>© Shopfront</footer>
    </>
  );
}

render(<App />);
`,
    extract: `(() => {
  render(<Layout title="Test page"><p>Inside</p></Layout>);
  const layoutHtml = screen.html();
  render(<App />);
  return {
    layoutHtml,
    appHtml: screen.html(),
    layouts: screen.countComponents("Layout"),
    cards: screen.countComponents("ProductCard"),
  };
})()`,
    tests: (values, code, logs) => {
      const layoutHtml = readText(values, "layoutHtml");
      const appHtml = readText(values, "appHtml");
      return [
        check(layoutHtml.includes("<header><h1>Test page</h1></header>"), "Layout shows its title in <header><h1>"),
        check(layoutHtml.includes("<main><p>Inside</p></main>"), "Layout places its children inside <main>"),
        check(layoutHtml.includes("<footer>© Shopfront</footer>"), "Layout ends with the footer"),
        check(readNumber(values, "layouts") === 1 && appHtml.includes("<h1>Shopfront</h1>"), "App uses one Layout with the title Shopfront"),
        check(readNumber(values, "cards") === 2 && appHtml.includes("<main><article>"), "the product cards are passed as children"),
        check((code.match(/<footer/g) ?? []).length === 1, "the footer is written once, in Layout"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        <code>{"function Layout({ title, children })"}</code> returns a fragment
        with the header, <code>{"<main>{children}</main>"}</code> and the
        footer. Then App returns{" "}
        <code>{'<Layout title="Shopfront"> ...cards... </Layout>'}</code>.
      </>
    ),
    solution: `function ProductCard({ name, price }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>£{price.toFixed(2)}</p>
    </article>
  );
}

function Layout({ title, children }) {
  return (
    <>
      <header>
        <h1>{title}</h1>
      </header>
      <main>{children}</main>
      <footer>© Shopfront</footer>
    </>
  );
}

function App() {
  return (
    <Layout title="Shopfront">
      <ProductCard name="Desk Lamp" price={22} />
      <ProductCard name="Laptop Stand" price={34.5} />
    </Layout>
  );
}

render(<App />);`,
  },
};

export const MODULE_4_STAGES: Stage[] = [passingProps, propRules, childrenAndComposition];
