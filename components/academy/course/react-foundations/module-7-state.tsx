import type { Stage } from "@/lib/academy/types";
import { Analogy, CodeBlock, StepHeading, Tip } from "../../content";
import { check } from "../check";
import { ReactPlayground } from "../../widgets/react-playground";
import { VariableVsStateWidget } from "../../widgets/variable-vs-state";
import { checkNoReactWarnings, countMatches, readNumber, readText } from "./checks";
import { SHOPFRONT_PRODUCTS_CODE } from "./shopfront-data";

const PART = "Module 7 · Understanding State";

// ---------------------------------------------------------------------------
// Widgets for this module
// ---------------------------------------------------------------------------

function RenderCycleWidget() {
  return (
    <ReactPlayground
      intro="Predict the number after one click, then click in the preview. The console shows each render."
      examples={[
        {
          label: "Three sets, one click",
          code: `function Counter() {
  const [count, setCount] = useState(0);
  console.log("render, count =", count);

  function addThree() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={addThree}>Count: {count}</button>;
}

render(<Counter />);`,
          lookFor: "count is 0 for this whole render, so all three calls say 'set it to 1'.",
        },
        {
          label: "Updater function",
          code: `function Counter() {
  const [count, setCount] = useState(0);
  console.log("render, count =", count);

  function addThree() {
    setCount((current) => current + 1);
    setCount((current) => current + 1);
    setCount((current) => current + 1);
  }

  return <button onClick={addThree}>Count: {count}</button>;
}

render(<Counter />);`,
          lookFor: "An updater gets the latest value each time, so these stack up to 3.",
        },
        {
          label: "Log after setting",
          code: `function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log("right after setCount, count is", count);
  }

  return <button onClick={handleClick}>Count: {count}</button>;
}

render(<Counter />);`,
          lookFor: "setCount doesn't change the count variable you already have. It asks for a new render with a new count.",
        },
      ]}
    />
  );
}

function ArrayStateWidget() {
  return (
    <ReactPlayground
      intro="Click Add in each example. One updates the screen and one doesn't. Why?"
      examples={[
        {
          label: "push (broken)",
          code: `function Wishlist() {
  const [items, setItems] = useState(["Desk Lamp"]);

  function addItem() {
    items.push("Laptop Stand");
    setItems(items);
    console.log("items is now", items);
  }

  return (
    <>
      <button onClick={addItem}>Add</button>
      <ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>
    </>
  );
}

render(<Wishlist />);`,
          lookFor: "The array changed, but it's the same array, so React sees no change and doesn't redraw.",
        },
        {
          label: "spread (works)",
          code: `function Wishlist() {
  const [items, setItems] = useState(["Desk Lamp"]);

  function addItem() {
    setItems([...items, "Laptop Stand"]);
  }

  return (
    <>
      <button onClick={addItem}>Add</button>
      <ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>
    </>
  );
}

render(<Wishlist />);`,
          lookFor: "A new array, so React knows something changed.",
        },
        {
          label: "update one object",
          code: `function Cart() {
  const [items, setItems] = useState([
    { id: 1, name: "Desk Lamp", qty: 1 },
    { id: 2, name: "Laptop Stand", qty: 1 },
  ]);

  function addOne(id) {
    setItems(
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }
        return { ...item, qty: item.qty + 1 };
      })
    );
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.name} × {item.qty} <button onClick={() => addOne(item.id)}>+</button>
        </li>
      ))}
    </ul>
  );
}

render(<Cart />);`,
          lookFor: "map makes a new array; the changed item becomes a new object; the others are reused.",
        },
      ]}
    />
  );
}

function DerivedStateWidget() {
  return (
    <ReactPlayground
      intro="This cart stores its total in state as well as its items. Add a lamp, then remove the stand."
      examples={[
        {
          label: "Two sources of truth",
          code: `function Cart() {
  const [items, setItems] = useState([
    { id: 4, name: "Laptop Stand", price: 34.5 },
  ]);
  const [total, setTotal] = useState(34.5);

  function addLamp() {
    setItems([...items, { id: 6, name: "Desk Lamp", price: 22 }]);
    setTotal(total + 22);
  }

  function removeStand() {
    setItems(items.filter((item) => item.id !== 4));
    // forgot setTotal here...
  }

  return (
    <>
      <button onClick={addLamp}>Add lamp</button>
      <button onClick={removeStand}>Remove stand</button>
      <p>{items.length} items, total £{total.toFixed(2)}</p>
    </>
  );
}

render(<Cart />);`,
          lookFor: "Module 1's bug is back: the total and the items disagree. Calculate the total from items instead.",
        },
        {
          label: "Derived (fixed)",
          code: `function Cart() {
  const [items, setItems] = useState([
    { id: 4, name: "Laptop Stand", price: 34.5 },
  ]);

  let total = 0;
  for (const item of items) {
    total = total + item.price;
  }

  return (
    <>
      <button onClick={() => setItems([...items, { id: 6, name: "Desk Lamp", price: 22 }])}>
        Add lamp
      </button>
      <button onClick={() => setItems(items.filter((item) => item.id !== 4))}>
        Remove stand
      </button>
      <p>{items.length} items, total £{total.toFixed(2)}</p>
    </>
  );
}

render(<Cart />);`,
          lookFor: "One piece of state; everything else is worked out from it on every render.",
        },
      ]}
    />
  );
}

function LiftingStateWidget() {
  return (
    <ReactPlayground
      intro="The count lives in App, the closest parent of both components that need it."
      examples={[
        {
          label: "Lifted state",
          code: `function CartBadge({ count }) {
  return <p>🛒 Cart ({count})</p>;
}

function AddButton({ onAdd }) {
  return <button onClick={onAdd}>Add to cart</button>;
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  function handleAdd() {
    setCartCount(cartCount + 1);
  }

  return (
    <>
      <CartBadge count={cartCount} />
      <AddButton onAdd={handleAdd} />
      <AddButton onAdd={handleAdd} />
    </>
  );
}

render(<App />);`,
          lookFor: "State goes down as a prop (count), changes come up as a function (onAdd).",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const whyState: Stage = {
  id: "adv-why-state",
  level: "adv",
  part: PART,
  title: "Why components need state",
  short: "Why state?",
  lead: (
    <>
      The click works, but the cart count never changes. A component needs a
      way to <b>remember</b> a value and to <b>tell React to draw again</b>{" "}
      when it changes. That is <b>state</b>.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <CodeBlock
        code={`function CartButton() {
  let count = 0;

  function handleClick() {
    count = count + 1;   // the variable changes...
  }

  return <button onClick={handleClick}>Cart ({count})</button>;  // ...the screen doesn't
}`}
      />
      <p>Two things go wrong:</p>
      <ol className="my-3 list-decimal pl-8">
        <li>
          Changing a variable doesn&apos;t tell React anything, so it never
          draws the component again.
        </li>
        <li>
          Even if it did, drawing again means <b>calling the function
          again</b>, and <code>let count = 0</code> runs again. Ordinary
          variables are forgotten between renders.
        </li>
      </ol>

      <StepHeading>The mental model</StepHeading>
      <Analogy icon="🧠">
        A component is like someone who wakes up with no memory each time
        it&apos;s called. <b>State is the notebook React keeps for it</b>.
        Each time the component runs, React hands it the notebook with the
        latest values. Writing in the notebook (calling the setter) tells
        React to wake the component up again.
      </Analogy>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`function CartButton() {
  const [count, setCount] = useState(0);
  //     ↑ value  ↑ setter            ↑ starting value (first render only)

  function handleClick() {
    setCount(count + 1);   // store the new value AND ask React to render again
  }

  return <button onClick={handleClick}>Cart ({count})</button>;
}`}
      />
      <ul className="my-3 list-disc pl-8">
        <li>
          <code>useState</code> returns a pair, which we unpack with array
          destructuring. Name them <code>thing</code> and{" "}
          <code>setThing</code>.
        </li>
        <li>
          Call <code>useState</code> at the top of the component, never inside
          a loop, an <code>if</code>, or an event handler.
        </li>
        <li>
          In a real project you&apos;d write{" "}
          <code>{'import { useState } from "react";'}</code>. Here it&apos;s
          already available.
        </li>
      </ul>
    </>
  ),
  widget: { title: "Manual DOM vs variable vs state", Component: VariableVsStateWidget },
  quiz: [
    {
      question: "Why doesn't changing a let variable update the screen?",
      options: [
        "let variables are read-only in components",
        "Nothing tells React to render again, and when it does, the variable starts from scratch",
        "The browser caches the old value",
        "You need to use var instead",
      ],
      answerIndex: 1,
      explanation: "State solves both: React remembers the value and re-renders when it's set.",
    },
    {
      question: "What does useState(0) return?",
      options: [
        "The number 0",
        "A pair: the current value and a function to change it",
        "An object with get and set methods",
        "A promise",
      ],
      answerIndex: 1,
      explanation: "const [count, setCount] = useState(0) unpacks the pair.",
    },
    {
      question: "When is the 0 in useState(0) used?",
      options: [
        "On every render",
        "Only on the first render; after that React uses the remembered value",
        "Whenever the setter is called",
        "Never: it's just documentation",
      ],
      answerIndex: 1,
      explanation: "It's the starting value. React keeps the latest value from then on.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <code>CartButton</code> counts clicks in an ordinary variable, so the
        screen never changes. Use <code>useState</code> so that three clicks
        show <code>Cart (3)</code>.
      </>
    ),
    starter: `function CartButton() {
  let count = 0;

  function handleClick() {
    count = count + 1;
    console.log("count is now", count);
  }

  return <button onClick={handleClick}>Cart ({count})</button>;
}

render(<CartButton />);
`,
    extract: `(() => {
  render(<CartButton />);
  const before = screen.text();
  screen.click("Cart");
  screen.click("Cart");
  screen.click("Cart");
  return { before, after: screen.text() };
})()`,
    tests: (values, code, logs) => [
      check(readText(values, "before") === "Cart (0)", "it starts at Cart (0)"),
      check(readText(values, "after") === "Cart (3)", "after three clicks it shows Cart (3)"),
      check(/useState\(\s*0\s*\)/.test(code), "the count is state, starting at 0"),
      checkNoReactWarnings(logs),
    ],
    hint: (
      <>
        Replace <code>let count = 0;</code> with{" "}
        <code>const [count, setCount] = useState(0);</code>, and in the handler
        call <code>setCount(count + 1);</code> instead of changing{" "}
        <code>count</code>.
      </>
    ),
    solution: `function CartButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return <button onClick={handleClick}>Cart ({count})</button>;
}

render(<CartButton />);`,
  },
};

const theRenderCycle: Stage = {
  id: "adv-render-cycle",
  level: "adv",
  part: PART,
  title: "Rendering and state snapshots",
  short: "Render cycle",
  lead: (
    <>
      Setting state doesn&apos;t change a variable. It asks React to{" "}
      <b>call your component again</b>, and that new call sees the new value.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The mental model</StepHeading>
      <p>The render cycle, every time:</p>
      <ol className="my-3 list-decimal pl-8">
        <li>
          <b>Trigger:</b> the first render, or a state setter is called.
        </li>
        <li>
          <b>Render:</b> React calls your component. It returns JSX describing
          the screen for <i>this</i> state.
        </li>
        <li>
          <b>Commit:</b> React compares with the last description and changes
          only the DOM that differs.
        </li>
      </ol>
      <Analogy icon="📸">
        Each render is a <b>photograph</b>. Inside it, <code>count</code> is
        frozen at the value it had when the photo was taken. Calling{" "}
        <code>setCount</code> doesn&apos;t edit the photo; it asks for a new
        one.
      </Analogy>

      <StepHeading>Predict</StepHeading>
      <CodeBlock
        code={`const [count, setCount] = useState(0);

function addThree() {
  setCount(count + 1);   // "set it to 0 + 1"
  setCount(count + 1);   // "set it to 0 + 1"
  setCount(count + 1);   // "set it to 0 + 1"
}
// After one click: 1, not 3`}
      />
      <p>
        <code>count</code> is <code>0</code> for the whole of that render. To
        build on the latest value, pass an <b>updater function</b>:
      </p>
      <CodeBlock
        code={`setCount((current) => current + 1);   // React passes in the latest value`}
      />
      <Tip>
        💡 Use <code>setX(newValue)</code> when the new value doesn&apos;t
        depend on the old one. Use <code>setX(old =&gt; ...)</code> when it
        does and you set it more than once, or aren&apos;t sure.
      </Tip>
    </>
  ),
  widget: { title: "Snapshots and updaters", Component: RenderCycleWidget },
  quiz: [
    {
      question: "count is 0. A click runs setCount(count + 1) three times. What does the screen show?",
      options: ["3", "1", "0", "An error"],
      answerIndex: 1,
      explanation: "Each call uses the same snapshot value 0, so each says 'set it to 1'.",
    },
    {
      question: "count is 0. A handler calls setCount(5) then console.log(count). What's logged?",
      options: ["5", "0", "undefined", "Nothing"],
      answerIndex: 1,
      explanation: "count is a constant in this render. The next render will see 5.",
    },
    {
      question: 'What does "rendering" mean in React?',
      options: [
        "The browser painting pixels",
        "React calling your component function to get a fresh description of the UI",
        "Downloading the page",
        "Writing HTML to a file",
      ],
      answerIndex: 1,
      explanation: "Render = call the component. Commit = update the DOM to match.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <ol>
          <li>
            The <code>+5</code> button only adds 1. Fix it so it adds 5,{" "}
            <b>keeping the five separate calls</b> (use an updater function).
          </li>
          <li>
            The quantity must never go below 1: pressing <code>−</code> at 1
            leaves it at 1.
          </li>
        </ol>
      </>
    ),
    starter: `function QuantityPicker() {
  const [quantity, setQuantity] = useState(1);

  function addFive() {
    setQuantity(quantity + 1);
    setQuantity(quantity + 1);
    setQuantity(quantity + 1);
    setQuantity(quantity + 1);
    setQuantity(quantity + 1);
  }

  function removeOne() {
    setQuantity(quantity - 1);
  }

  return (
    <div>
      <button onClick={removeOne}>−</button>
      <span> Quantity: {quantity} </span>
      <button onClick={() => setQuantity(quantity + 1)}>+</button>
      <button onClick={addFive}>+5</button>
    </div>
  );
}

render(<QuantityPicker />);
`,
    extract: `(() => {
  render(<QuantityPicker />);
  screen.click("+5");
  const afterFive = screen.text();
  screen.click("+");
  const afterPlus = screen.text();
  for (let press = 0; press < 10; press++) {
    screen.click("−");
  }
  const afterMinus = screen.text();
  return { afterFive, afterPlus, afterMinus };
})()`,
    tests: (values, code, logs) => [
      check(readText(values, "afterFive").includes("Quantity: 6"), "+5 from 1 shows Quantity: 6"),
      check(readText(values, "afterPlus").includes("Quantity: 7"), "+ then shows Quantity: 7"),
      check(readText(values, "afterMinus").includes("Quantity: 1 "), "pressing − ten times stops at Quantity: 1"),
      check(countMatches(code, /setQuantity\(\s*\(?\s*\w+\s*\)?\s*=>/) >= 5, "addFive uses an updater function in each call"),
      checkNoReactWarnings(logs),
    ],
    hint: (
      <>
        In addFive, write <code>setQuantity((current) =&gt; current + 1);</code>{" "}
        five times. In removeOne, only subtract when{" "}
        <code>quantity &gt; 1</code>.
      </>
    ),
    solution: `function QuantityPicker() {
  const [quantity, setQuantity] = useState(1);

  function addFive() {
    setQuantity((current) => current + 1);
    setQuantity((current) => current + 1);
    setQuantity((current) => current + 1);
    setQuantity((current) => current + 1);
    setQuantity((current) => current + 1);
  }

  function removeOne() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }

  return (
    <div>
      <button onClick={removeOne}>−</button>
      <span> Quantity: {quantity} </span>
      <button onClick={() => setQuantity(quantity + 1)}>+</button>
      <button onClick={addFive}>+5</button>
    </div>
  );
}

render(<QuantityPicker />);`,
  },
};

const arraysAndObjectsInState: Stage = {
  id: "adv-state-updates",
  level: "adv",
  part: PART,
  title: "Updating arrays and objects in state",
  short: "Arrays in state",
  lead: (
    <>
      Never change an array or object in state. <b>Make a new one</b> with
      the change, and set that. React notices new values, not edits.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <CodeBlock
        code={`items.push(newItem);
setItems(items);    // ❌ nothing happens`}
      />
      <p>
        React decides whether to re-render by asking &quot;is this the same
        value as before?&quot; For arrays and objects, &quot;the same&quot;
        means <b>the same one</b>. You changed what&apos;s inside, but handed
        back the same array, so React skips the update.
      </p>

      <StepHeading>The mental model</StepHeading>
      <Analogy icon="📄">
        Treat state like a printed document. To change it, you don&apos;t
        scribble on the page: you print a new version with the change. React
        sees a new page and knows to look at it.
      </Analogy>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`// Add: a new array with everything, plus the new item
setItems([...items, { id: 6, name: "Desk Lamp", qty: 1 }]);

// Remove: filter makes a new array without it
setItems(items.filter((item) => item.id !== idToRemove));

// Change one: map makes a new array; the changed item is a new object
setItems(
  items.map((item) => {
    if (item.id !== idToChange) {
      return item;
    }
    return { ...item, qty: item.qty + 1 };
  })
);`}
      />
      <Tip>
        💡 <code>push</code>, <code>splice</code>, <code>sort</code> and{" "}
        <code>item.qty++</code> all change things in place. In state, reach
        for spread, <code>map</code> and <code>filter</code> instead.
      </Tip>
    </>
  ),
  widget: { title: "push vs a new array", Component: ArrayStateWidget },
  quiz: [
    {
      question: "Why does items.push(x); setItems(items) not update the screen?",
      options: [
        "push is not allowed in React",
        "It's the same array as before, so React thinks nothing changed",
        "setItems only accepts strings",
        "It does update, just slowly",
      ],
      answerIndex: 1,
      explanation: "React compares by identity. Give it a new array.",
    },
    {
      question: "Which creates a new array with lamp added?",
      options: ["items.push(lamp)", "[...items, lamp]", "items[items.length] = lamp", "items.concat"],
      answerIndex: 1,
      explanation: "Spread copies every item into a new array, then lamp is added.",
    },
    {
      question: "How do you increase the qty of one item in an array in state?",
      options: [
        "item.qty++ then setItems(items)",
        "items.map(...) returning { ...item, qty: item.qty + 1 } for that item",
        "items.filter(...)",
        "delete the item and push a new one",
      ],
      answerIndex: 1,
      explanation: "A new array, with a new object for the changed item.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          The cart&apos;s buttons do nothing, because the functions change the
          state array instead of replacing it. Rewrite them without{" "}
          <code>push</code> or changing <code>qty</code> in place:
        </p>
        <ol>
          <li>
            <code>addToCart(product)</code>: if the product is already in the
            cart, increase its <code>qty</code> by 1; otherwise add{" "}
            <code>{"{ id, name, qty: 1 }"}</code>
          </li>
          <li>
            <code>removeFromCart(id)</code>: remove that item
          </li>
        </ol>
      </>
    ),
    starter: `const products = [
  { id: 1, name: "Wireless Keyboard" },
  { id: 2, name: "Ergonomic Mouse" },
];

function Cart() {
  const [items, setItems] = useState([]);

  function addToCart(product) {
    const existing = items.find((item) => item.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      items.push({ id: product.id, name: product.name, qty: 1 });
    }
    setItems(items);
  }

  function removeFromCart(id) {
    const index = items.findIndex((item) => item.id === id);
    items.splice(index, 1);
    setItems(items);
  }

  return (
    <>
      {products.map((product) => (
        <button key={product.id} onClick={() => addToCart(product)}>
          Add {product.name}
        </button>
      ))}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.qty} <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </>
  );
}

render(<Cart />);
`,
    extract: `(() => {
  render(<Cart />);
  screen.click("Add Wireless Keyboard");
  const one = { text: screen.text(), items: screen.count("li") };
  screen.click("Add Wireless Keyboard");
  const two = { text: screen.text(), items: screen.count("li") };
  screen.click("Add Ergonomic Mouse");
  const three = { text: screen.text(), items: screen.count("li") };
  screen.click("Remove", 0);
  const four = { text: screen.text(), items: screen.count("li") };
  return {
    oneText: one.text, oneItems: one.items,
    twoText: two.text, twoItems: two.items,
    threeText: three.text, threeItems: three.items,
    fourText: four.text, fourItems: four.items,
  };
})()`,
    tests: (values, code, logs) => {
      const fourText = readText(values, "fourText");
      return [
        check(
          readNumber(values, "oneItems") === 1 && readText(values, "oneText").includes("Wireless Keyboard × 1"),
          "adding the keyboard shows Wireless Keyboard × 1"
        ),
        check(
          readNumber(values, "twoItems") === 1 && readText(values, "twoText").includes("Wireless Keyboard × 2"),
          "adding it again shows × 2, still one row"
        ),
        check(
          readNumber(values, "threeItems") === 2 && readText(values, "threeText").includes("Ergonomic Mouse × 1"),
          "adding the mouse adds a second row"
        ),
        check(
          readNumber(values, "fourItems") === 1 && !fourText.includes("Wireless Keyboard ×") && fourText.includes("Ergonomic Mouse × 1"),
          "removing the keyboard leaves only the mouse"
        ),
        check(!/\.push\(|\.splice\(/.test(code), "no push or splice"),
        check(!/\.qty\s*(\+\+|\+=|-=|=(?!=))/.test(code), "qty is never changed in place"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        If <code>existing</code>:{" "}
        <code>{"setItems(items.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item))"}</code>
        . Otherwise:{" "}
        <code>{"setItems([...items, { id: product.id, name: product.name, qty: 1 }])"}</code>
        . Remove with <code>{"items.filter((item) => item.id !== id)"}</code>.
      </>
    ),
    solution: `const products = [
  { id: 1, name: "Wireless Keyboard" },
  { id: 2, name: "Ergonomic Mouse" },
];

function Cart() {
  const [items, setItems] = useState([]);

  function addToCart(product) {
    const existing = items.find((item) => item.id === product.id);

    if (existing === undefined) {
      setItems([...items, { id: product.id, name: product.name, qty: 1 }]);
      return;
    }

    setItems(
      items.map((item) => {
        if (item.id !== product.id) {
          return item;
        }
        return { ...item, qty: item.qty + 1 };
      })
    );
  }

  function removeFromCart(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  return (
    <>
      {products.map((product) => (
        <button key={product.id} onClick={() => addToCart(product)}>
          Add {product.name}
        </button>
      ))}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} × {item.qty} <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </>
  );
}

render(<Cart />);`,
  },
};

const derivedValues: Stage = {
  id: "adv-derived",
  level: "adv",
  part: PART,
  title: "Calculate it, don't store it",
  short: "Derived values",
  lead: (
    <>
      Keep the <b>least</b> state you can. Anything you can work out from
      existing state or props (a total, a count, a filtered list) should be
      calculated during render, not stored.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        It&apos;s tempting to keep the cart total in its own state. But then
        every change to the items must also remember to update the total, and
        one day one won&apos;t. That&apos;s exactly the drift from Module 1,
        now inside React.
      </p>

      <StepHeading>The mental model</StepHeading>
      <Analogy icon="🧮">
        You don&apos;t write a receipt&apos;s total on a separate card and
        update it by hand. You add up the lines whenever you need it. The
        lines are the truth; the total follows from them.
      </Analogy>
      <p>Before adding state, ask: <b>can I calculate this from what I already have?</b> If yes, it isn&apos;t state.</p>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`function CartSummary() {
  const [items, setItems] = useState(initialItems);   // the only state

  // Derived: recalculated on every render, so always right
  let itemCount = 0;
  let total = 0;
  for (const item of items) {
    itemCount = itemCount + item.qty;
    total = total + item.price * item.qty;
  }
  const hasFreeShipping = total >= 50;

  return <p>{itemCount} items · £{total.toFixed(2)}</p>;
}`}
      />
      <Tip>
        💡 &quot;Should I store the filtered products in state?&quot; No: the
        products and the search text are state; the filtered list is
        calculated from them.
      </Tip>
    </>
  ),
  widget: { title: "Two sources of truth", Component: DerivedStateWidget },
  quiz: [
    {
      question: "A cart keeps items in state. Should its total also be in state?",
      options: [
        "Yes, so it doesn't need recalculating",
        "No: calculate it from items during render, so it can never disagree with them",
        "Yes, in a separate component",
        "Only if there are more than 10 items",
      ],
      answerIndex: 1,
      explanation: "A stored total is a second copy of the truth that can drift.",
    },
    {
      question: "Which of these should be state in a searchable product list?",
      options: [
        "The filtered list of products",
        "The text typed in the search box",
        "The number of results",
        "Whether the 'no results' message shows",
      ],
      answerIndex: 1,
      explanation: "The search text can't be worked out from anything else. The rest can be calculated from it.",
    },
    {
      question: "Why doesn't recalculating on every render cause bugs?",
      options: [
        "React caches it",
        "The calculation always starts from the current state, so the result always matches it",
        "It only runs once",
        "It does cause bugs",
      ],
      answerIndex: 1,
      explanation: "That's UI = f(data) again: derived values are part of f.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          The total is stored in its own state and goes wrong as soon as you
          click. Remove the <code>total</code> state and calculate everything
          from <code>items</code>:
        </p>
        <ol>
          <li>
            <code>Items: 2</code>: the sum of every item&apos;s{" "}
            <code>qty</code>
          </li>
          <li>
            <code>Total: £44.00</code>
          </li>
          <li>
            <code>Free shipping unlocked!</code> at £50 or more, otherwise{" "}
            <code>Spend £6.00 more for free shipping</code>
          </li>
        </ol>
        <p>
          When you&apos;re done, the component should have exactly one{" "}
          <code>useState</code>.
        </p>
      </>
    ),
    starter: `const initialItems = [
  { id: 4, name: "Laptop Stand", price: 34.5, qty: 0 },
  { id: 6, name: "Desk Lamp", price: 22, qty: 1 },
];

function CartSummary() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(22);

  function addOne(id) {
    setItems(
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }
        return { ...item, qty: item.qty + 1 };
      })
    );
  }

  return (
    <section>
      {items.map((item) => (
        <p key={item.id}>
          {item.name} × {item.qty} <button onClick={() => addOne(item.id)}>Add one {item.name}</button>
        </p>
      ))}
      <p>Total: £{total.toFixed(2)}</p>
    </section>
  );
}

render(<CartSummary />);
`,
    extract: `(() => {
  render(<CartSummary />);
  const start = screen.text();
  screen.click("Add one Desk Lamp");
  const afterLamp = screen.text();
  screen.click("Add one Laptop Stand");
  const afterStand = screen.text();
  return { start, afterLamp, afterStand };
})()`,
    tests: (values, code, logs) => {
      const start = readText(values, "start");
      const afterLamp = readText(values, "afterLamp");
      const afterStand = readText(values, "afterStand");
      return [
        check(
          start.includes("Items: 1") && start.includes("Total: £22.00") && start.includes("Spend £28.00 more for free shipping"),
          "at the start: Items: 1, Total: £22.00, Spend £28.00 more"
        ),
        check(
          afterLamp.includes("Items: 2") && afterLamp.includes("Total: £44.00") && afterLamp.includes("Spend £6.00 more for free shipping"),
          "after another lamp: Items: 2, Total: £44.00, Spend £6.00 more"
        ),
        check(
          afterStand.includes("Items: 3") && afterStand.includes("Total: £78.50") && afterStand.includes("Free shipping unlocked!"),
          "after a stand: Items: 3, Total: £78.50, Free shipping unlocked!"
        ),
        check(!afterStand.includes("Spend £"), "the Spend message goes once shipping is free"),
        check(countMatches(code, /useState\(/) === 1, "there is exactly one useState: items"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        Delete the <code>total</code> state. Below the <code>useState</code>,
        loop over <code>items</code> adding up <code>item.qty</code> and{" "}
        <code>item.price * item.qty</code>. Then{" "}
        <code>const amountLeft = 50 - total;</code> and use a ternary for the
        shipping message.
      </>
    ),
    solution: `const initialItems = [
  { id: 4, name: "Laptop Stand", price: 34.5, qty: 0 },
  { id: 6, name: "Desk Lamp", price: 22, qty: 1 },
];

function CartSummary() {
  const [items, setItems] = useState(initialItems);

  let itemCount = 0;
  let total = 0;
  for (const item of items) {
    itemCount = itemCount + item.qty;
    total = total + item.price * item.qty;
  }
  const amountLeft = 50 - total;

  function addOne(id) {
    setItems(
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }
        return { ...item, qty: item.qty + 1 };
      })
    );
  }

  return (
    <section>
      {items.map((item) => (
        <p key={item.id}>
          {item.name} × {item.qty} <button onClick={() => addOne(item.id)}>Add one {item.name}</button>
        </p>
      ))}
      <p>Items: {itemCount}</p>
      <p>Total: £{total.toFixed(2)}</p>
      <p>
        {amountLeft <= 0
          ? "Free shipping unlocked!"
          : "Spend £" + amountLeft.toFixed(2) + " more for free shipping"}
      </p>
    </section>
  );
}

render(<CartSummary />);`,
  },
};

const liftingState: Stage = {
  id: "adv-lifting",
  level: "adv",
  part: PART,
  title: "Lifting state up",
  short: "Lifting state",
  lead: (
    <>
      When two components need the same state, move it to their{" "}
      <b>closest common parent</b>. Pass the value down as props, and pass a
      function down to change it.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        The Add buttons live in <code>ProductList</code>. The cart count is
        shown in <code>Header</code>. If the count is state inside{" "}
        <code>ProductList</code>, <code>Header</code> can&apos;t see it:
        props only flow down, and the two are siblings.
      </p>

      <StepHeading>The mental model</StepHeading>
      <p>
        Every piece of state has <b>one owner</b>. Find every component that
        uses it, walk up the tree to the first component above all of them,
        and put the state there.
      </p>
      <CodeBlock
        code={`App                ← owns cartCount (closest parent of both)
├─ Header          ← reads it:     cartCount={cartCount}
└─ ProductList     ← changes it:   onAdd={handleAdd}
   └─ ProductCard  ← calls onAdd(product)`}
      />
      <Analogy icon="🏠">
        The family calendar hangs in the kitchen, not in one child&apos;s
        bedroom, because everyone needs it. Anyone can read it, and anyone who
        wants to change it asks a parent.
      </Analogy>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`function App() {
  const [cartCount, setCartCount] = useState(0);

  function handleAdd(product) {
    setCartCount(cartCount + 1);
  }

  return (
    <>
      <Header cartCount={cartCount} />
      <ProductList products={products} onAdd={handleAdd} />
    </>
  );
}`}
      />
      <Tip>
        💡 This is everything from Modules 4, 6 and 7 working together: state
        in the owner, values down as props, events up through function props.
      </Tip>
    </>
  ),
  widget: { title: "Shared state in the parent", Component: LiftingStateWidget },
  quiz: [
    {
      question: "Header and ProductList both need the cart count. Where should the state live?",
      options: [
        "In Header",
        "In ProductList",
        "In their closest common parent, App",
        "In both, kept in sync",
      ],
      answerIndex: 2,
      explanation: "The closest common parent can pass it down to both.",
    },
    {
      question: "How does ProductCard increase a count that App owns?",
      options: [
        "It calls setCartCount directly",
        "It calls a function App passed down, and App sets its own state",
        "It changes the cartCount prop",
        "It can't",
      ],
      answerIndex: 1,
      explanation: "Only the owner sets its state. Children ask through function props.",
    },
    {
      question: "App's state changes. Which components render again?",
      options: [
        "Only App",
        "App and the components below it",
        "Only the component that was clicked",
        "Every component on the page, including App's parent",
      ],
      answerIndex: 1,
      explanation: "A component and its children render again, so the new props flow down.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          The count lives in <code>ProductList</code>, so the header can&apos;t
          show it. Lift it up:
        </p>
        <ol>
          <li>
            <code>App</code> owns the count with <code>useState</code>
          </li>
          <li>
            <code>Header</code> takes a <code>cartCount</code> prop and shows{" "}
            <code>Cart (2)</code>
          </li>
          <li>
            <code>ProductList</code> takes <code>products</code> and{" "}
            <code>onAdd</code>, and has no state of its own: each button calls{" "}
            <code>onAdd(product)</code>
          </li>
        </ol>
      </>
    ),
    starter: `${SHOPFRONT_PRODUCTS_CODE}

function Header() {
  return (
    <header>
      <h1>Shopfront</h1>
      <p>Cart (?)</p>
    </header>
  );
}

function ProductList({ products }) {
  const [cartCount, setCartCount] = useState(0);

  return (
    <section>
      <p>Added so far: {cartCount}</p>
      {products.map((product) => (
        <article key={product.id}>
          <h2>{product.name}</h2>
          <button onClick={() => setCartCount(cartCount + 1)}>Add to cart</button>
        </article>
      ))}
    </section>
  );
}

function App() {
  return (
    <main>
      <Header />
      <ProductList products={products} />
    </main>
  );
}

render(<App />);
`,
    extract: `(() => {
  render(<Header cartCount={5} />);
  const headerText = screen.text();

  let addedName = "nothing";
  render(<ProductList products={products} onAdd={(product) => { addedName = product.name; }} />);
  screen.click("Add to cart", 5);

  render(<App />);
  screen.click("Add to cart", 0);
  screen.click("Add to cart", 2);
  return { headerText, addedName, appText: screen.text() };
})()`,
    tests: (values, _code, logs) => [
      check(readText(values, "headerText").includes("Cart (5)"), "Header shows the cartCount it is given"),
      check(values.addedName === "Desk Lamp", "ProductList calls onAdd with the clicked product"),
      check(readText(values, "appText").includes("Cart (2)"), "in the app, two clicks show Cart (2) in the header"),
      checkNoReactWarnings(logs),
    ],
    hint: (
      <>
        Move the <code>useState</code> line into App, add{" "}
        <code>{"function handleAdd(product) { setCartCount(cartCount + 1); }"}</code>
        , and render{" "}
        <code>{"<Header cartCount={cartCount} />"}</code> and{" "}
        <code>{"<ProductList products={products} onAdd={handleAdd} />"}</code>.
      </>
    ),
    solution: `${SHOPFRONT_PRODUCTS_CODE}

function Header({ cartCount }) {
  return (
    <header>
      <h1>Shopfront</h1>
      <p>Cart ({cartCount})</p>
    </header>
  );
}

function ProductList({ products, onAdd }) {
  return (
    <section>
      {products.map((product) => (
        <article key={product.id}>
          <h2>{product.name}</h2>
          <button onClick={() => onAdd(product)}>Add to cart</button>
        </article>
      ))}
    </section>
  );
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  function handleAdd(product) {
    setCartCount(cartCount + 1);
  }

  return (
    <main>
      <Header cartCount={cartCount} />
      <ProductList products={products} onAdd={handleAdd} />
    </main>
  );
}

render(<App />);`,
  },
};

export const MODULE_7_STAGES: Stage[] = [
  whyState,
  theRenderCycle,
  arraysAndObjectsInState,
  derivedValues,
  liftingState,
];
