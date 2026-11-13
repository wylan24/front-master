import type { Stage } from "@/lib/academy/types";
import { CodeBlock, StepHeading, Tip } from "../../content";
import { check } from "../check";
import { MODULE_1_STAGES } from "./module-1-understanding-react";
import { MODULE_2_STAGES } from "./module-2-jsx";
import { MODULE_3_STAGES } from "./module-3-components";
import { checkNoReactWarnings, countMatches, readNumber, readText } from "./checks";

const beginnerFinal: Stage = {
  id: "final",
  level: "basic",
  part: "Module 3 · Thinking in Components",
  title: "Beginner final: the Shopfront home page",
  short: "Final challenge",
  lead: (
    <>
      Put Modules 1 to 3 together: describe a page from data with JSX, and
      split it into components with one job each.
    </>
  ),
  lesson: (
    <>
      <StepHeading>What you&apos;ll use</StepHeading>
      <ul className="my-3 list-disc pl-8">
        <li>
          <b>UI = f(data)</b>: every name, price and message comes from the
          data objects, never typed into the JSX (Module 1)
        </li>
        <li>
          <b>JSX</b>: <code>{"{expressions}"}</code>, <code>className</code>,
          self-closing tags, a ternary and <code>toFixed(2)</code> (Module 2)
        </li>
        <li>
          <b>Components</b>: one clear job each, capitalised, composed by{" "}
          <code>App</code> (Module 3)
        </li>
      </ul>

      <StepHeading>Plan it</StepHeading>
      <CodeBlock
        code={`App
├─ Header           shows shop.name and shop.tagline
├─ FeaturedProduct  shows the featured product, with Sale! when discounted
└─ ShippingNote     shows the free-shipping threshold`}
      />
      <Tip>
        💡 Build one component at a time and run after each. Fix errors
        first, then warnings.
      </Tip>
    </>
  ),
  quiz: [
    {
      question: "Why read the product's name from featured.name instead of typing it into the JSX?",
      options: [
        "JSX can't contain plain text",
        "So the page follows the data: change the data and the page changes, with nothing to forget",
        "It renders faster",
        "React requires all text to come from variables",
      ],
      answerIndex: 1,
      explanation: "That's UI = f(data): one source of truth, and the screen is worked out from it.",
    },
    {
      question: "Which is the right way to show Sale! only when discount is above 0?",
      options: [
        "{if (featured.discount > 0) { <strong>Sale!</strong> }}",
        "{featured.discount > 0 ? <strong>Sale!</strong> : null}",
        "<strong if={featured.discount}>Sale!</strong>",
        "{for (featured.discount) <strong>Sale!</strong>}",
      ],
      answerIndex: 1,
      explanation: "Braces need an expression. A ternary produces a value; if and for are statements.",
    },
    {
      question: "App returns <main><Header /><FeaturedProduct /><ShippingNote /></main>. What is App's job?",
      options: [
        "To draw every element itself",
        "To arrange the page's sections, like a contents page",
        "To store the data",
        "Nothing; it could be deleted",
      ],
      answerIndex: 1,
      explanation: "Each component has one job. App's job is putting the sections in order.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>Build the Shopfront home page from the two data objects:</p>
        <ol>
          <li>
            <code>Header</code>: a <code>&lt;header&gt;</code> with an{" "}
            <code>&lt;h1&gt;</code> of <code>shop.name</code> and a{" "}
            <code>&lt;p&gt;</code> of <code>shop.tagline</code>
          </li>
          <li>
            <code>FeaturedProduct</code>: an{" "}
            <code>{'<article className="featured">'}</code> with an{" "}
            <code>&lt;h2&gt;</code> of the name, an image (the name as{" "}
            <code>alt</code>), the price as <code>£129.00</code>, and{" "}
            <code>&lt;strong&gt;Sale!&lt;/strong&gt;</code> when{" "}
            <code>discount</code> is above 0 (use a ternary)
          </li>
          <li>
            <code>ShippingNote</code>: <code>Free shipping on orders over £50</code>,
            using <code>shop.freeShippingFrom</code>
          </li>
          <li>
            <code>App</code>: the three components inside{" "}
            <code>&lt;main&gt;</code>, in that order
          </li>
        </ol>
        <p>Don&apos;t type any of the data into the JSX.</p>
      </>
    ),
    starter: `const shop = {
  name: "Shopfront",
  tagline: "Good things for your desk",
  freeShippingFrom: 50,
};

const featured = {
  name: "Noise-Cancelling Headphones",
  price: 129,
  discount: 15,
  image: "headphones.jpg",
};

// Header, FeaturedProduct and ShippingNote go here

function App() {
  return (
    <main>
    </main>
  );
}

render(<App />);
`,
    extract: `(() => {
  render(<App />);
  return {
    html: screen.html(),
    headers: screen.countComponents("Header"),
    featuredProducts: screen.countComponents("FeaturedProduct"),
    shippingNotes: screen.countComponents("ShippingNote"),
  };
})()`,
    tests: (values, code, logs) => {
      const html = readText(values, "html");
      const headerPosition = html.indexOf("<header>");
      const articlePosition = html.indexOf("<article");
      const shippingPosition = html.indexOf("Free shipping on orders over £50");
      return [
        check(
          readNumber(values, "headers") === 1 &&
            html.includes("<h1>Shopfront</h1>") &&
            html.includes("<p>Good things for your desk</p>"),
          "Header shows the shop's name and tagline"
        ),
        check(
          readNumber(values, "featuredProducts") === 1 &&
            html.includes('<article class="featured">') &&
            html.includes("<h2>Noise-Cancelling Headphones</h2>"),
          'FeaturedProduct is an <article className="featured"> with the name in an <h2>'
        ),
        check(html.includes('alt="Noise-Cancelling Headphones"'), "the image's alt text is the product's name"),
        check(html.includes("£129.00"), "the price is shown as £129.00"),
        check(
          html.includes("<strong>Sale!</strong>") && /discount\s*>\s*0\s*\?/.test(code),
          "Sale! is shown with a ternary on discount > 0"
        ),
        check(readNumber(values, "shippingNotes") === 1 && shippingPosition !== -1, "ShippingNote shows Free shipping on orders over £50"),
        check(
          headerPosition !== -1 && headerPosition < articlePosition && articlePosition < shippingPosition,
          "App shows Header, FeaturedProduct, then ShippingNote"
        ),
        check(
          countMatches(code, /Noise-Cancelling/) === 1 &&
            countMatches(code, /Good things/) === 1 &&
            countMatches(code, /129/) === 1,
          "the data is only written once, in the data objects"
        ),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        <code>{"<h1>{shop.name}</h1>"}</code>,{" "}
        <code>{"<img src={featured.image} alt={featured.name} />"}</code>,{" "}
        <code>{"<p>£{featured.price.toFixed(2)}</p>"}</code>,{" "}
        <code>{"{featured.discount > 0 ? <strong>Sale!</strong> : null}"}</code>{" "}
        and <code>{"<p>Free shipping on orders over £{shop.freeShippingFrom}</p>"}</code>.
      </>
    ),
    solution: `const shop = {
  name: "Shopfront",
  tagline: "Good things for your desk",
  freeShippingFrom: 50,
};

const featured = {
  name: "Noise-Cancelling Headphones",
  price: 129,
  discount: 15,
  image: "headphones.jpg",
};

function Header() {
  return (
    <header>
      <h1>{shop.name}</h1>
      <p>{shop.tagline}</p>
    </header>
  );
}

function FeaturedProduct() {
  return (
    <article className="featured">
      <h2>{featured.name}</h2>
      <img src={featured.image} alt={featured.name} />
      <p>£{featured.price.toFixed(2)}</p>
      {featured.discount > 0 ? <strong>Sale!</strong> : null}
    </article>
  );
}

function ShippingNote() {
  return <p>Free shipping on orders over £{shop.freeShippingFrom}</p>;
}

function App() {
  return (
    <main>
      <Header />
      <FeaturedProduct />
      <ShippingNote />
    </main>
  );
}

render(<App />);`,
  },
};

/** React Foundations' beginner section: Modules 1 to 3, then the beginner final. */
export const REACT_BEGINNER_STAGES: Stage[] = [
  ...MODULE_1_STAGES,
  ...MODULE_2_STAGES,
  ...MODULE_3_STAGES,
  beginnerFinal,
];
