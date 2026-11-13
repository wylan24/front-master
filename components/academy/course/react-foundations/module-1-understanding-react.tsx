import Link from "next/link";
import type { Stage } from "@/lib/academy/types";
import { isSameValue } from "@/lib/academy/format";
import { Analogy, CodeBlock, StepHeading, Tip } from "../../content";
import { check, isPlainObject } from "../check";
import { VanillaCartWidget } from "../../widgets/vanilla-cart";
import { UiFunctionWidget } from "../../widgets/ui-function";
import { ClassifySorter } from "../../widgets/classify-sorter";

const PART = "Module 1 · Understanding React";

// ---------------------------------------------------------------------------
// Widgets for this module
// ---------------------------------------------------------------------------

function ImperativeOrDeclarativeWidget() {
  return (
    <ClassifySorter
      intro="Is each one a list of steps (imperative) or a description of the result (declarative)? Guess first."
      categories={[
        { id: "imperative", label: "Imperative" },
        { id: "declarative", label: "Declarative" },
      ]}
      items={[
        {
          text: 'heading.textContent = "Cart (3)";',
          isCode: true,
          answer: "imperative",
          why: "It tells the browser to change one element right now.",
        },
        {
          text: "<h1>Cart ({count})</h1>",
          isCode: true,
          answer: "declarative",
          why: "It says what the heading should look like for any count. React does the updating.",
        },
        {
          text: 'const li = document.createElement("li"); list.appendChild(li);',
          isCode: true,
          answer: "imperative",
          why: "Create this, then attach it there: step-by-step instructions.",
        },
        {
          text: ".error { color: red; }",
          isCode: true,
          answer: "declarative",
          why: "CSS is declarative: you say what errors look like, not how to paint them.",
        },
        {
          text: "SELECT name FROM products WHERE price < 20",
          isCode: true,
          answer: "declarative",
          why: "SQL describes the result you want; the database decides how to find it.",
        },
        {
          text: "for each product: if cheap, create a row and add it to the table",
          answer: "imperative",
          why: "A loop of instructions, in order.",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

type CartPage = {
  count: string;
  total: string;
  summary: string;
  banner: string;
};

const EXPECTED_PAGE_AFTER_EACH_STEP: CartPage[] = [
  { count: "1", total: "£45.50", summary: "1 item", banner: "" },
  { count: "2", total: "£57.75", summary: "2 items", banner: "Free shipping unlocked!" },
  { count: "1", total: "£12.25", summary: "1 item", banner: "" },
  { count: "0", total: "£0.00", summary: "Your cart is empty", banner: "" },
];

function readPageAtStep(values: Record<string, unknown>, stepIndex: number): CartPage | null {
  const steps = values.steps;
  if (!Array.isArray(steps)) {
    return null;
  }
  const page = steps[stepIndex];
  if (!isPlainObject(page)) {
    return null;
  }
  return page as CartPage;
}

const whyReact: Stage = {
  id: "why-react",
  level: "basic",
  part: PART,
  title: "The problem React solves",
  short: "Why React?",
  lead: (
    <>
      Before learning any React, feel the problem it fixes: keeping{" "}
      <b>what the page shows</b> in step with <b>the data behind it</b>.
    </>
  ),
  lesson: (
    <>
      <Tip>
        💡 This course assumes you know JavaScript functions, objects, arrays
        and <code>map</code>/<code>filter</code>. If those feel shaky, take{" "}
        <Link href="/course/javascript-foundations" className="underline">
          JavaScript Foundations
        </Link>{" "}
        and{" "}
        <Link href="/course/array-academy" className="underline">
          Array Academy
        </Link>{" "}
        first.
      </Tip>

      <StepHeading>How websites work</StepHeading>
      <p>
        <b>HTML</b> says what is on the page, <b>CSS</b> says how it looks and{" "}
        <b>JavaScript</b> makes it change. When the browser loads HTML, it
        builds the <b>DOM</b>: a live model of the page that JavaScript can
        read and change. Change the DOM and the screen changes.
      </p>

      <StepHeading>The problem</StepHeading>
      <p>
        Here is a shop&apos;s cart written in plain JavaScript. Every time
        something is added, the developer has to remember every piece of the
        page that depends on the cart:
      </p>
      <CodeBlock
        code={`function addToCart(product) {
  cartCount = cartCount + 1;
  cartTotal = cartTotal + product.price;

  document.querySelector("#cart-count").textContent = cartCount;
  document.querySelector("#cart-total").textContent = "£" + cartTotal.toFixed(2);
  document.querySelector("#cart-summary").textContent = cartCount + " items";
}`}
      />
      <p>
        Then a new requirement arrives: <i>show a free-shipping banner once
        the cart reaches £50.</i> Now <code>addToCart</code>,{" "}
        <code>removeFromCart</code>, <code>clearCart</code> and{" "}
        <code>applyCoupon</code> all need a new line. Miss one and the page
        quietly shows the wrong thing.
      </p>
      <Analogy icon="📋">
        It is like a shop with a price written on the shelf, on the sign in the
        window and on the website. Change the price and someone has to walk
        round and fix all three. Sooner or later one gets missed.
      </Analogy>
      <p>
        The data (what&apos;s in the cart) and the screen (what the page says)
        are two separate copies of the truth, and <b>you</b> are responsible
        for keeping them in step. That gets harder with every feature.
      </p>
    </>
  ),
  widget: { title: "A cart that drifts out of sync", Component: VanillaCartWidget },
  quiz: [
    {
      question: "What is the DOM?",
      options: [
        "A JavaScript library for building pages",
        "The browser's live model of the page, which JavaScript can change",
        "The HTML file on the server",
        "A list of CSS rules",
      ],
      answerIndex: 1,
      explanation: "The browser builds the DOM from the HTML. Changing it changes what's on screen.",
    },
    {
      question:
        "In the widget, removing an item left the free-shipping banner showing on a £29.99 cart. Why?",
      options: [
        "The total was calculated wrongly",
        "The browser didn't refresh",
        "removeItem never updated the banner: one manual step was forgotten",
        "JavaScript can't hide elements",
      ],
      answerIndex: 2,
      explanation:
        "The data was right. The screen was wrong because one of the many manual updates was missed.",
    },
    {
      question: "Why does updating the DOM by hand get harder as an app grows?",
      options: [
        "Browsers get slower with bigger pages",
        "Each new piece of the screen adds updates to every function that changes the data",
        "JavaScript has a limit on how many elements it can change",
        "It doesn't: it gets easier with practice",
      ],
      answerIndex: 1,
      explanation:
        "Every feature multiplies the places you must remember. That's the problem React exists to remove.",
    },
  ],
  exercise: {
    task: (
      <>
        <p>
          <code>page</code> stands in for the DOM: each property is one piece
          of text on screen. Finish <code>addToCart</code> and{" "}
          <code>removeFromCart</code> so the page <b>always</b> matches the
          data:
        </p>
        <ol>
          <li>
            <code>count</code>: the number of items, as text, e.g.{" "}
            <code>&quot;2&quot;</code>
          </li>
          <li>
            <code>total</code>: like <code>&quot;£57.75&quot;</code>
          </li>
          <li>
            <code>summary</code>: <code>&quot;Your cart is empty&quot;</code>,{" "}
            <code>&quot;1 item&quot;</code> or <code>&quot;2 items&quot;</code>
          </li>
          <li>
            <code>banner</code>: <code>&quot;Free shipping unlocked!&quot;</code>{" "}
            when the total is £50 or more, otherwise <code>&quot;&quot;</code>
          </li>
        </ol>
        <p>Count how many updates you had to write. That number is the problem.</p>
      </>
    ),
    starter: `// A pretend page: each property is one piece of text on the screen.
const page = { count: "0", total: "£0.00", summary: "Your cart is empty", banner: "" };

let cartCount = 0;
let cartTotal = 0;

function addToCart(price) {
  cartCount = cartCount + 1;
  cartTotal = cartTotal + price;
  page.count = String(cartCount);
  page.total = "£" + cartTotal.toFixed(2);
  // The summary and the banner are never updated...
}

function removeFromCart(price) {
  // Nothing here yet
}
`,
    extract: `(() => {
  const steps = [];
  addToCart(45.5);
  steps.push(Object.assign({}, page));
  addToCart(12.25);
  steps.push(Object.assign({}, page));
  removeFromCart(45.5);
  steps.push(Object.assign({}, page));
  removeFromCart(12.25);
  steps.push(Object.assign({}, page));
  return { steps };
})()`,
    tests: (values) => {
      const stepNames = [
        "after adding £45.50",
        "after adding £12.25 (banner appears)",
        "after removing £45.50 (banner must go)",
        "after removing £12.25 (empty)",
      ];
      const checks = [];
      for (let stepIndex = 0; stepIndex < stepNames.length; stepIndex++) {
        const page = readPageAtStep(values, stepIndex);
        const expected = EXPECTED_PAGE_AFTER_EACH_STEP[stepIndex];
        checks.push(check(isSameValue(page, expected), `the page matches the data ${stepNames[stepIndex]}`));
      }
      return checks;
    },
    hint: (
      <>
        Instead of repeating the updates in both functions, write one{" "}
        <code>updatePage()</code> function that sets all four properties from{" "}
        <code>cartCount</code> and <code>cartTotal</code>, and call it at the
        end of both. Notice that you just invented the core idea of React.
      </>
    ),
    solution: `const page = { count: "0", total: "£0.00", summary: "Your cart is empty", banner: "" };

let cartCount = 0;
let cartTotal = 0;

// One function rewrites the whole page from the data.
function updatePage() {
  page.count = String(cartCount);
  page.total = "£" + cartTotal.toFixed(2);

  if (cartCount === 0) {
    page.summary = "Your cart is empty";
  } else if (cartCount === 1) {
    page.summary = "1 item";
  } else {
    page.summary = cartCount + " items";
  }

  if (cartTotal >= 50) {
    page.banner = "Free shipping unlocked!";
  } else {
    page.banner = "";
  }
}

function addToCart(price) {
  cartCount = cartCount + 1;
  cartTotal = cartTotal + price;
  updatePage();
}

function removeFromCart(price) {
  cartCount = cartCount - 1;
  cartTotal = cartTotal - price;
  updatePage();
}`,
  },
};

const declarativeThinking: Stage = {
  id: "declarative",
  level: "basic",
  part: PART,
  title: "Imperative vs declarative",
  short: "Declarative thinking",
  lead: (
    <>
      React asks you to <b>describe the result</b> you want for the current
      data, not to list the steps that get the page there.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        In the last stage every change needed a list of instructions: find this
        element, set its text, find that one, hide it. Those instructions are
        called <b>imperative</b> code. Each one depends on what the page
        looked like before, which is why it is so easy to get wrong.
      </p>

      <StepHeading>The mental model</StepHeading>
      <Analogy icon="🚕">
        <b>Imperative:</b> &quot;Turn left at the lights, take the second
        right, stop by the red door.&quot; <br />
        <b>Declarative:</b> &quot;Take me to 12 Station Road.&quot; The driver
        works out the steps.
      </Analogy>
      <p>
        <b>Declarative</b> code describes the destination. You have already
        written some: CSS says <i>what errors look like</i>, not how to paint
        them. React brings the same idea to the whole interface.
      </p>
      <CodeBlock
        code={`// Imperative: you change the page, step by step
heading.textContent = "Cart (" + count + ")";
if (count === 0) { emptyMessage.style.display = "block"; }

// Declarative (React): you describe the page for any count
<h1>Cart ({count})</h1>
{count === 0 && <p>Your cart is empty</p>}`}
      />
      <p>
        You don&apos;t need to read that JSX yet. The point is the split of
        responsibilities:
      </p>
      <ul className="my-3 list-disc pl-8">
        <li>
          <b>You</b> describe what the UI should look like for some data, and
          you change the data.
        </li>
        <li>
          <b>React</b> works out what changed and updates the DOM for you.
        </li>
      </ul>
      <Tip>
        💡 React is not &quot;a faster way to write HTML&quot;. It is a way to
        organise interfaces that change over time.
      </Tip>
    </>
  ),
  widget: { title: "Imperative or declarative?", Component: ImperativeOrDeclarativeWidget },
  quiz: [
    {
      question: "In a React app, what are you responsible for, and what does React do?",
      options: [
        "You update the DOM; React stores the data",
        "You describe the UI for the current data and change the data; React updates the DOM",
        "You write HTML files; React turns them into CSS",
        "React writes the UI; you only write CSS",
      ],
      answerIndex: 1,
      explanation: "You describe and you change data. React does the step-by-step DOM work.",
    },
    {
      question: "Which instruction is declarative?",
      options: [
        "Walk to the shelf, pick up a cup, fill it, bring it here",
        "A glass of water, please",
        "Open the tap, wait two seconds, close the tap",
        "Find the cup element and set its text to Water",
      ],
      answerIndex: 1,
      explanation: "It describes the result and leaves the steps to someone else.",
    },
    {
      question: "Why is imperative UI code fragile?",
      options: [
        "Each step assumes what the page looked like before it, so one missed step leaves it wrong",
        "It runs too slowly",
        "Browsers are removing support for it",
        "It can't use variables",
      ],
      answerIndex: 0,
      explanation:
        "Declarative code describes the whole result each time, so there's no earlier state to get out of step with.",
    },
  ],
  exercise: {
    task: (
      <>
        Label each instruction in <code>answers</code> as{" "}
        <code>&quot;imperative&quot;</code> (a list of steps) or{" "}
        <code>&quot;declarative&quot;</code> (a description of the result).
      </>
    ),
    starter: `const answers = {
  "Turn left at the lights, then take the second right": "",
  "Take me to the station": "",
  "A table for four by the window, please": "",
  "Walk to the shelf, pick up a cup, fill it with water, bring it here": "",
  "The heading should say Cart (3)": "",
  "Find the heading element and change its text to Cart (3)": "",
};
`,
    extract: "{ answers }",
    tests: (values) => {
      const answers = isPlainObject(values.answers) ? values.answers : {};
      const expected: Record<string, string> = {
        "Turn left at the lights, then take the second right": "imperative",
        "Take me to the station": "declarative",
        "A table for four by the window, please": "declarative",
        "Walk to the shelf, pick up a cup, fill it with water, bring it here": "imperative",
        "The heading should say Cart (3)": "declarative",
        "Find the heading element and change its text to Cart (3)": "imperative",
      };
      const checks = [];
      for (const instruction of Object.keys(expected)) {
        const answer = answers[instruction];
        checks.push(check(answer === expected[instruction], `"${instruction}"`));
      }
      return checks;
    },
    hint: (
      <>
        Ask: does it say <i>how</i> to get there, step by step (imperative), or{" "}
        <i>what</i> the end result should be (declarative)?
      </>
    ),
    solution: `const answers = {
  "Turn left at the lights, then take the second right": "imperative",
  "Take me to the station": "declarative",
  "A table for four by the window, please": "declarative",
  "Walk to the shelf, pick up a cup, fill it with water, bring it here": "imperative",
  "The heading should say Cart (3)": "declarative",
  "Find the heading element and change its text to Cart (3)": "imperative",
};`,
  },
};

type CartDescription = {
  count: string;
  total: string;
  summary: string;
  banner: string;
};

function readDescription(values: Record<string, unknown>, name: string): CartDescription | null {
  const value = values[name];
  if (!isPlainObject(value)) {
    return null;
  }
  return value as CartDescription;
}

const uiAsAFunction: Stage = {
  id: "ui-function",
  level: "basic",
  part: PART,
  title: "UI as a function of data",
  short: "UI = f(data)",
  lead: (
    <>
      The big idea behind React: <b>UI = f(data)</b>. Give the same data,
      get the same screen. Change the data, get a new screen.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The mental model</StepHeading>
      <p>
        In stage 1 you fixed the cart by writing one function that rewrites the
        whole page from the data. That is the idea React is built on. Think of
        the interface as the <b>result of a function</b>:
      </p>
      <CodeBlock code={`UI = f(data)`} />
      <Analogy icon="🧾">
        A till receipt. You don&apos;t edit yesterday&apos;s receipt when
        someone buys one more thing: the till prints a fresh one from the
        current basket. The receipt is always right because it is always
        worked out from the basket.
      </Analogy>
      <p>
        When the data changes, you don&apos;t patch the old screen. You ask
        for the screen that matches the new data. React then compares the old
        and new descriptions and changes only the parts of the DOM that are
        different, so this is fast.
      </p>

      <StepHeading>Understand the code</StepHeading>
      <p>Here is the cart as a function: data in, description of the screen out.</p>
      <CodeBlock
        code={`function describeCart(items) {
  let total = 0;
  for (const item of items) {
    total = total + item.price;
  }
  return {
    count: String(items.length),
    total: "£" + total.toFixed(2),
  };
}

describeCart([{ name: "Lamp", price: 22 }]);
// { count: "1", total: "£22.00" }`}
      />
      <p>
        There is no &quot;before&quot; to get out of step with, and no list of
        updates to forget. A React component works the same way, except it
        returns a description of HTML instead of an object.
      </p>
      <Tip>
        💡 <b>Exit check for Module 1:</b> can you explain the problem React
        solves without using any React words? Try: &quot;When the data
        changes, I shouldn&apos;t have to remember every place on the page that
        shows it.&quot;
      </Tip>
    </>
  ),
  widget: { title: "Change the data, watch the UI", Component: UiFunctionWidget },
  quiz: [
    {
      question: 'What does "UI = f(data)" mean?',
      options: [
        "The UI is a function you call from HTML",
        "The screen is worked out from the current data, so the same data always gives the same screen",
        "Every UI needs a database",
        "React stores the UI in a variable called data",
      ],
      answerIndex: 1,
      explanation: "The interface is a result, calculated from the data, not something you edit by hand.",
    },
    {
      question:
        "describeCart is called twice with exactly the same items. What do you expect?",
      options: [
        "The second result shows double the items",
        "The same description both times",
        "An error, because it was already called",
        "It depends on what the page showed before",
      ],
      answerIndex: 1,
      explanation:
        "It only looks at the data it's given. It doesn't remember or depend on what was shown before.",
    },
    {
      question: "In the widget, how did the free-shipping message stay correct?",
      options: [
        "Every button remembered to update it",
        "It was recalculated from the cart data each time the data changed",
        "It was stored separately and synced every second",
        "It was hard-coded",
      ],
      answerIndex: 1,
      explanation: "Nothing updated it by hand. It is part of f(data), so it is always worked out fresh.",
    },
  ],
  exercise: {
    task: (
      <>
        <p>
          Rewrite the stage-1 cart the declarative way. Write{" "}
          <code>describeCart(items)</code> that takes an array of{" "}
          <code>{"{ name, price }"}</code> and <b>returns</b> an object with
          the same four pieces of text:
        </p>
        <ol>
          <li>
            <code>count</code>, e.g. <code>&quot;2&quot;</code>
          </li>
          <li>
            <code>total</code>, e.g. <code>&quot;£79.98&quot;</code>
          </li>
          <li>
            <code>summary</code>: <code>&quot;Your cart is empty&quot;</code>,{" "}
            <code>&quot;1 item&quot;</code> or <code>&quot;N items&quot;</code>
          </li>
          <li>
            <code>banner</code>: <code>&quot;Free shipping unlocked!&quot;</code>{" "}
            at £50 or more, otherwise <code>&quot;&quot;</code>
          </li>
        </ol>
        <p>No variables outside the function, no updates: data in, screen out.</p>
      </>
    ),
    starter: `function describeCart(items) {
  // Work everything out from items, then return { count, total, summary, banner }
}

console.log(describeCart([{ name: "Wireless Keyboard", price: 49.99 }]));
`,
    extract: `({
  empty: describeCart([]),
  one: describeCart([{ name: "Desk Lamp", price: 22 }]),
  two: describeCart([{ name: "Wireless Keyboard", price: 49.99 }, { name: "Ergonomic Mouse", price: 29.99 }]),
  again: describeCart([{ name: "Desk Lamp", price: 22 }]),
})`,
    tests: (values) => {
      const empty = readDescription(values, "empty");
      const one = readDescription(values, "one");
      const two = readDescription(values, "two");
      const again = readDescription(values, "again");
      return [
        check(
          isSameValue(empty, { count: "0", total: "£0.00", summary: "Your cart is empty", banner: "" }),
          "an empty cart is described correctly"
        ),
        check(
          isSameValue(one, { count: "1", total: "£22.00", summary: "1 item", banner: "" }),
          "a one-item cart is described correctly"
        ),
        check(
          isSameValue(two, {
            count: "2",
            total: "£79.98",
            summary: "2 items",
            banner: "Free shipping unlocked!",
          }),
          "a £79.98 cart shows the free-shipping banner"
        ),
        check(
          one !== null && isSameValue(one, again),
          "the same data gives the same result every time (nothing is remembered between calls)"
        ),
      ];
    },
    hint: (
      <>
        Start with <code>let total = 0;</code> and a <code>for...of</code> loop
        to add up the prices. Then build each piece of text with{" "}
        <code>if</code>/<code>else</code> and return them together:{" "}
        <code>return {"{ count, total: ..., summary, banner }"};</code>
      </>
    ),
    solution: `function describeCart(items) {
  let total = 0;
  for (const item of items) {
    total = total + item.price;
  }

  let summary = items.length + " items";
  if (items.length === 0) {
    summary = "Your cart is empty";
  } else if (items.length === 1) {
    summary = "1 item";
  }

  let banner = "";
  if (total >= 50) {
    banner = "Free shipping unlocked!";
  }

  return {
    count: String(items.length),
    total: "£" + total.toFixed(2),
    summary: summary,
    banner: banner,
  };
}

console.log(describeCart([{ name: "Wireless Keyboard", price: 49.99 }]));`,
  },
};

export const MODULE_1_STAGES: Stage[] = [whyReact, declarativeThinking, uiAsAFunction];
