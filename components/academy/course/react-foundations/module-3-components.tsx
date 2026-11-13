import type { Stage } from "@/lib/academy/types";
import { Analogy, CodeBlock, StepHeading, Tip } from "../../content";
import { check } from "../check";
import { ReactPlayground } from "../../widgets/react-playground";
import { ComponentMapWidget } from "../../widgets/component-map";
import { checkNoReactWarnings, countMatches, readNumber, readText } from "./checks";

const PART = "Module 3 · Thinking in Components";

// ---------------------------------------------------------------------------
// Widgets for this module
// ---------------------------------------------------------------------------

function FirstComponentsWidget() {
  return (
    <ReactPlayground
      intro="A component is a function that returns JSX. Use it like a tag. Run each example, then change it."
      examples={[
        {
          label: "One component",
          code: `function ProductCard() {
  return (
    <article>
      <h2>Desk Lamp</h2>
      <p>£22.00</p>
      <button>Add to cart</button>
    </article>
  );
}

function App() {
  return <ProductCard />;
}

render(<App />);`,
          lookFor: "App uses ProductCard like an HTML tag. ProductCard's JSX appears where the tag is.",
        },
        {
          label: "Reuse it",
          code: `function ProductCard() {
  return (
    <article>
      <h2>Desk Lamp</h2>
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

render(<App />);`,
          lookFor: "Change the button text once in ProductCard, and all three cards change. (All three show the same lamp: Module 4 fixes that.)",
        },
        {
          label: "Lowercase name",
          code: `function productCard() {
  return <article>Desk Lamp</article>;
}

function App() {
  return <productCard />;
}

render(<App />);`,
          lookFor: "Nothing appears. Lowercase tags are treated as HTML tags, so your function is never called. Read the warning.",
        },
      ]}
    />
  );
}

function DebuggingComponentsWidget() {
  return (
    <ReactPlayground
      intro="Each example has one classic component bug. Run it, read what React says, and fix it."
      examples={[
        {
          label: "Shows nothing",
          code: `function Header() {
  <header>
    <h1>Shopfront</h1>
  </header>;
}

render(<Header />);`,
          lookFor: "No error, just an empty screen. What is the function missing?",
        },
        {
          label: "Not defined",
          code: `function CartSummary() {
  return <p>Cart: 0 items</p>;
}

function App() {
  return <Cartsummary />;
}

render(<App />);`,
          lookFor: "Names are case-sensitive. The error tells you exactly which name it couldn't find.",
        },
        {
          label: "return on its own line",
          code: `function Footer() {
  return
    <footer>© Shopfront</footer>;
}

render(<Footer />);`,
          lookFor: "JavaScript ends the statement after a bare return. Put ( on the same line as return.",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const whatIsAComponent: Stage = {
  id: "components",
  level: "basic",
  part: PART,
  title: "What is a component?",
  short: "Components",
  lead: (
    <>
      A component is a <b>reusable blueprint</b> for a section of the
      interface: a JavaScript function that returns JSX.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        Shopfront will show dozens of product cards. Copying the same
        <code> &lt;article&gt;</code> markup thirty times means that changing
        the button later means thirty edits, and one will be missed: the
        Module 1 problem again, this time in the markup.
      </p>

      <StepHeading>The mental model</StepHeading>
      <Analogy icon="🍪">
        A component is a <b>cookie cutter</b>. You design the shape once, then
        stamp out as many cookies as you need. Change the cutter, and every
        new cookie changes.
      </Analogy>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`function ProductCard() {          // 1. a function, name starts with a capital
  return (                          // 2. it returns JSX
    <article>
      <h2>Desk Lamp</h2>
      <button>Add to cart</button>
    </article>
  );
}

function App() {
  return (
    <main>
      <ProductCard />               {/* 3. used like a tag */}
      <ProductCard />
    </main>
  );
}`}
      />
      <ul className="my-3 list-disc pl-8">
        <li>
          <b>Capital letter.</b> <code>&lt;ProductCard /&gt;</code> means
          &quot;call my function&quot;; <code>&lt;productCard /&gt;</code>{" "}
          means &quot;an HTML tag called productCard&quot;.
        </li>
        <li>
          <b>Components use components.</b> <code>App</code> is a component
          made of other components. Every React app is built this way.
        </li>
        <li>
          <b>Why bother?</b> Reuse (write the card once), and separation (the
          card&apos;s markup lives in one place you can find and change).
        </li>
      </ul>
      <Tip>
        💡 In a real project each component usually lives in its own file and
        is shared with <code>export</code> and <code>import</code>. In this
        course everything is in one editor, so no imports are needed.
      </Tip>
    </>
  ),
  widget: { title: "Make and reuse a component", Component: FirstComponentsWidget },
  quiz: [
    {
      question: "What is a React component?",
      options: [
        "An HTML file",
        "A JavaScript function that returns JSX, describing a piece of the UI",
        "A CSS class for buttons",
        "A special kind of variable that stores HTML",
      ],
      answerIndex: 1,
      explanation: "A function whose return value describes part of the interface.",
    },
    {
      question: "You write function productCard() and use it as <productCard />. What happens?",
      options: [
        "It works the same as ProductCard",
        "React treats it as an unknown HTML tag and never calls your function",
        "It throws a syntax error",
        "It renders twice",
      ],
      answerIndex: 1,
      explanation: "Lowercase tags are HTML. Component names must start with a capital letter.",
    },
    {
      question:
        "The Add to cart button's text must change on all 30 product cards. With a ProductCard component, how many places do you edit?",
      options: ["30", "One: the ProductCard function", "Two: ProductCard and App", "None: React updates it automatically"],
      answerIndex: 1,
      explanation: "That's the point of a blueprint: one definition, used everywhere.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>Build the first two Shopfront components:</p>
        <ol>
          <li>
            <code>Header</code>: an <code>&lt;h1&gt;</code> saying{" "}
            <code>Shopfront</code> and a <code>&lt;p&gt;</code> with any tagline
          </li>
          <li>
            <code>ProductCard</code>: an <code>&lt;article&gt;</code> with an{" "}
            <code>&lt;h2&gt;</code> (any product name), a price paragraph and a
            button saying <code>Add to cart</code>
          </li>
          <li>
            <code>App</code>: the <code>Header</code>, then two{" "}
            <code>ProductCard</code>s
          </li>
        </ol>
        <p>Write the card&apos;s markup only once.</p>
      </>
    ),
    starter: `// Header goes here

// ProductCard goes here

function App() {
  return (
    <main>
      {/* use your components here */}
    </main>
  );
}

render(<App />);
`,
    extract: `(() => {
  render(<App />);
  return {
    html: screen.html(),
    text: screen.text(),
    headers: screen.countComponents("Header"),
    cards: screen.countComponents("ProductCard"),
    articles: screen.count("article"),
    buttons: screen.count("button"),
  };
})()`,
    tests: (values, code, logs) => {
      const html = readText(values, "html");
      const headerPosition = html.indexOf("<h1>Shopfront</h1>");
      const firstCardPosition = html.indexOf("<article");
      return [
        check(readNumber(values, "headers") === 1 && headerPosition !== -1, "App shows the Header, with <h1>Shopfront</h1>"),
        check(readNumber(values, "cards") === 2, "App shows two ProductCards"),
        check(readNumber(values, "articles") === 2 && readNumber(values, "buttons") === 2, "each card is an <article> with a button"),
        check(readText(values, "text").includes("Add to cart"), "the buttons say Add to cart"),
        check(headerPosition !== -1 && headerPosition < firstCardPosition, "the header comes before the cards"),
        check(countMatches(code, /<article/) === 1, "the card's markup is written once, in ProductCard"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        <code>{"function Header() { return (<header>...</header>); }"}</code>.
        Then in App: <code>&lt;Header /&gt;</code>,{" "}
        <code>&lt;ProductCard /&gt;</code>, <code>&lt;ProductCard /&gt;</code>.
        Components must be defined with a capital letter.
      </>
    ),
    solution: `function Header() {
  return (
    <header>
      <h1>Shopfront</h1>
      <p>Good things for your desk</p>
    </header>
  );
}

function ProductCard() {
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
      <Header />
      <ProductCard />
      <ProductCard />
    </main>
  );
}

render(<App />);`,
  },
};

const breakingDownTheUi: Stage = {
  id: "breaking-down",
  level: "basic",
  part: PART,
  title: "Breaking a page into components",
  short: "Breaking it down",
  lead: (
    <>
      A component is a <b>meaningful unit with a clear responsibility</b>,
      not necessarily a small visual element. Choosing the boundaries is a
      design skill.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        Given a design, where do the component lines go? Too few and one
        function does everything. Too many and you jump between a dozen tiny
        files to follow one card.
      </p>

      <StepHeading>The mental model</StepHeading>
      <p>
        Draw boxes around the design. A box deserves to be its own component
        when you can describe its job in <b>one sentence</b>, and at least one
        of these is true:
      </p>
      <ul className="my-3 list-disc pl-8">
        <li>
          <b>It repeats</b>: a product card, a row in a table.
        </li>
        <li>
          <b>It has its own job</b>: the search bar searches, the cart summary
          summarises the cart.
        </li>
        <li>
          <b>It is big enough to hide detail</b>: <code>App</code> should read
          like a table of contents, not like the whole book.
        </li>
      </ul>
      <Analogy icon="📚">
        A good component tree reads like a book&apos;s contents page: chapters
        (Header, ProductList, CartSummary), then sections inside them
        (ProductCard). You don&apos;t list every sentence.
      </Analogy>

      <StepHeading>Understand the code</StepHeading>
      <p>Components nest, forming a tree. Each one only knows about its direct children:</p>
      <CodeBlock
        code={`function ProductList() {
  return (
    <section>
      <ProductCard />
      <ProductCard />
    </section>
  );
}

function App() {
  return (
    <main>
      <Header />
      <ProductList />
      <CartSummary />
    </main>
  );
}`}
      />
      <Tip>
        💡 A component that only wraps a single <code>&lt;h3&gt;</code> and
        has no job of its own is usually one component too many.
      </Tip>
    </>
  ),
  widget: { title: "Where do the boundaries go?", Component: ComponentMapWidget },
  quiz: [
    {
      question: "What makes a good component boundary?",
      options: [
        "Every HTML element should be its own component",
        "A piece with one clear responsibility you can describe in a sentence, especially if it repeats",
        "Anything over 10 lines",
        "One component per colour on the page",
      ],
      answerIndex: 1,
      explanation: "Components are units of meaning, not units of markup.",
    },
    {
      question: "In App → ProductList → ProductCard, which component is ProductCard's parent?",
      options: ["App", "ProductList", "ProductCard has no parent", "Header"],
      answerIndex: 1,
      explanation: "ProductList renders the cards, so it's their parent. App is their grandparent.",
    },
    {
      question: "Why is one giant App component a problem even if the page looks right?",
      options: [
        "React refuses to render big components",
        "Nothing can be reused, and every change means reading through unrelated code",
        "It makes the page load slower",
        "It isn't a problem",
      ],
      answerIndex: 1,
      explanation: "The screen is the same; the cost is in finding, changing and reusing code.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          This <code>App</code> does everything. Split it into components so
          that <code>App</code> reads like a contents page:
        </p>
        <ol>
          <li>
            <code>Header</code>: the <code>&lt;header&gt;</code>
          </li>
          <li>
            <code>ProductCard</code>: one <code>&lt;article&gt;</code>
          </li>
          <li>
            <code>ProductList</code>: a <code>&lt;section&gt;</code> showing
            three <code>ProductCard</code>s
          </li>
          <li>
            <code>CartSummary</code>: the <code>Cart: 0 items</code> paragraph
          </li>
          <li>
            <code>App</code>: just <code>Header</code>,{" "}
            <code>ProductList</code> and <code>CartSummary</code> inside{" "}
            <code>&lt;main&gt;</code>
          </li>
        </ol>
        <p>
          All three cards will show the same product for now. That&apos;s the
          problem Module 4 solves.
        </p>
      </>
    ),
    starter: `function App() {
  return (
    <main>
      <header>
        <h1>Shopfront</h1>
        <p>Good things for your desk</p>
      </header>
      <section>
        <article>
          <h2>Wireless Keyboard</h2>
          <p>£49.99</p>
          <button>Add to cart</button>
        </article>
        <article>
          <h2>Wireless Keyboard</h2>
          <p>£49.99</p>
          <button>Add to cart</button>
        </article>
        <article>
          <h2>Wireless Keyboard</h2>
          <p>£49.99</p>
          <button>Add to cart</button>
        </article>
      </section>
      <p>Cart: 0 items</p>
    </main>
  );
}

render(<App />);
`,
    extract: `(() => {
  render(<ProductList />);
  const cardsInList = screen.countComponents("ProductCard");
  render(<App />);
  return {
    cardsInList,
    headers: screen.countComponents("Header"),
    lists: screen.countComponents("ProductList"),
    cards: screen.countComponents("ProductCard"),
    summaries: screen.countComponents("CartSummary"),
    articles: screen.count("article"),
    text: screen.text(),
  };
})()`,
    tests: (values, code, logs) => [
      check(readNumber(values, "headers") === 1, "App shows a Header"),
      check(readNumber(values, "lists") === 1, "App shows a ProductList"),
      check(readNumber(values, "cardsInList") === 3, "ProductList shows three ProductCards"),
      check(readNumber(values, "summaries") === 1 && readText(values, "text").includes("Cart: 0 items"), "App shows a CartSummary saying Cart: 0 items"),
      check(readNumber(values, "articles") === 3 && countMatches(code, /<article/) === 1, "the card markup is written once"),
      checkNoReactWarnings(logs),
    ],
    hint: (
      <>
        Cut each block out of App into its own function that returns it. Then
        replace the block in App with the tag, e.g.{" "}
        <code>&lt;Header /&gt;</code>. ProductList returns a{" "}
        <code>&lt;section&gt;</code> containing{" "}
        <code>&lt;ProductCard /&gt;</code> three times.
      </>
    ),
    solution: `function Header() {
  return (
    <header>
      <h1>Shopfront</h1>
      <p>Good things for your desk</p>
    </header>
  );
}

function ProductCard() {
  return (
    <article>
      <h2>Wireless Keyboard</h2>
      <p>£49.99</p>
      <button>Add to cart</button>
    </article>
  );
}

function ProductList() {
  return (
    <section>
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </section>
  );
}

function CartSummary() {
  return <p>Cart: 0 items</p>;
}

function App() {
  return (
    <main>
      <Header />
      <ProductList />
      <CartSummary />
    </main>
  );
}

render(<App />);`,
  },
};

const componentMistakes: Stage = {
  id: "component-mistakes",
  level: "basic",
  part: PART,
  title: "Debugging components",
  short: "Debugging components",
  lead: (
    <>
      Most component bugs are one of a handful of mistakes. Learn to
      recognise them from the symptom and the message React gives you.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The mental model</StepHeading>
      <p>
        When something is wrong, ask two questions: <b>what do I see</b>{" "}
        (an error, a warning, or just a wrong screen), and <b>what does the
        message say</b>? React&apos;s messages usually name the exact problem.
      </p>

      <StepHeading>The usual suspects</StepHeading>
      <div className="my-3 overflow-x-auto">
        <table className="w-full border-collapse text-[14.5px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-1.5 pr-3">Symptom</th>
              <th className="py-1.5 pr-3">Likely cause</th>
              <th className="py-1.5">Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-1.5 pr-3">Component shows nothing, no error</td>
              <td className="py-1.5 pr-3">
                missing <code>return</code>
              </td>
              <td className="py-1.5">
                <code>return ( ... );</code>
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-1.5 pr-3">&quot;treated as an HTML tag&quot; warning</td>
              <td className="py-1.5 pr-3">lowercase component name</td>
              <td className="py-1.5">start the name with a capital</td>
            </tr>
            <tr className="border-b border-border">
              <td className="py-1.5 pr-3">
                <code>ReferenceError: X is not defined</code>
              </td>
              <td className="py-1.5 pr-3">spelling or capitalisation differs</td>
              <td className="py-1.5">make the tag match the function name exactly</td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3">Syntax error about side-by-side elements</td>
              <td className="py-1.5 pr-3">two parents returned</td>
              <td className="py-1.5">
                wrap in <code>&lt;&gt;…&lt;/&gt;</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Tip>
        💡 Fix <b>errors</b> first (they stop everything), then{" "}
        <b>warnings</b> (it runs, but something is wrong), then anything that
        still looks wrong on screen. Change one thing at a time and run again.
      </Tip>
    </>
  ),
  widget: { title: "Spot the bug", Component: DebuggingComponentsWidget },
  quiz: [
    {
      question: "A component shows nothing and there's no error. What should you check first?",
      options: [
        "That the CSS file is loaded",
        "That the function actually returns its JSX",
        "That React is installed",
        "That the browser supports JSX",
      ],
      answerIndex: 1,
      explanation: "Without return, the function returns undefined and React draws nothing.",
    },
    {
      question: '"ReferenceError: Productcard is not defined" means…',
      options: [
        "ProductCard has a bug inside it",
        "The tag's name doesn't match any function: here the capital C is missing",
        "React needs to be imported",
        "The component is defined twice",
      ],
      answerIndex: 1,
      explanation: "JavaScript names are case-sensitive. The tag must match the function exactly.",
    },
    {
      question: "You see one error and two warnings. Where do you start?",
      options: [
        "The warnings, because there are more of them",
        "The error: it stops the code, so the warnings might change once it's fixed",
        "Delete the code and start again",
        "Ignore them all if anything shows on screen",
      ],
      answerIndex: 1,
      explanation: "Errors stop the program. Fix them first, then rerun and read what's left.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        This Shopfront page has <b>three</b> component bugs. Run it, read the
        message, fix one bug, and run again until the page shows the header,
        two product cards and the cart summary with no warnings. Keep the
        component names <code>Header</code>, <code>ProductCard</code> and{" "}
        <code>CartSummary</code>.
      </>
    ),
    starter: `function Header() {
  return <h1>Shopfront</h1>;
}

function ProductCard() {
  <article>
    <h2>Desk Lamp</h2>
    <button>Add to cart</button>
  </article>;
}

function cartSummary() {
  return <p>Cart: 0 items</p>;
}

function App() {
  return (
    <main>
      <Header />
      <Productcard />
      <ProductCard />
      <cartSummary />
    </main>
  );
}

render(<App />);
`,
    extract: `(() => {
  render(<App />);
  return {
    text: screen.text(),
    cards: screen.countComponents("ProductCard"),
    articles: screen.count("article"),
    summaries: screen.countComponents("CartSummary"),
  };
})()`,
    tests: (values, _code, logs) => [
      check(readNumber(values, "cards") === 2, "App shows two ProductCards"),
      check(readNumber(values, "articles") === 2, "each ProductCard returns its <article>"),
      check(readNumber(values, "summaries") === 1, "the cart summary is a CartSummary component"),
      check(readText(values, "text").includes("Cart: 0 items"), "the summary is on screen"),
      checkNoReactWarnings(logs),
    ],
    hint: (
      <>
        Bug 1: <code>Productcard</code> needs a capital C. Bug 2:{" "}
        <code>ProductCard</code> never returns its JSX. Bug 3: rename{" "}
        <code>cartSummary</code> to <code>CartSummary</code>, in both places.
      </>
    ),
    solution: `function Header() {
  return <h1>Shopfront</h1>;
}

function ProductCard() {
  return (
    <article>
      <h2>Desk Lamp</h2>
      <button>Add to cart</button>
    </article>
  );
}

function CartSummary() {
  return <p>Cart: 0 items</p>;
}

function App() {
  return (
    <main>
      <Header />
      <ProductCard />
      <ProductCard />
      <CartSummary />
    </main>
  );
}

render(<App />);`,
  },
};

export const MODULE_3_STAGES: Stage[] = [whatIsAComponent, breakingDownTheUi, componentMistakes];
