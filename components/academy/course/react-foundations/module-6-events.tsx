import type { Stage } from "@/lib/academy/types";
import { isSameValue } from "@/lib/academy/format";
import { Analogy, CodeBlock, StepHeading, Tip } from "../../content";
import { check } from "../check";
import { ReactPlayground } from "../../widgets/react-playground";
import { checkNoReactWarnings } from "./checks";
import { SHOPFRONT_PRODUCTS_CODE } from "./shopfront-data";

const PART = "Module 6 · Making UI Interactive";

function readStringList(values: Record<string, unknown>, name: string): string[] {
  const value = values[name];
  if (!Array.isArray(value)) {
    return [];
  }
  const strings: string[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      strings.push(item);
    }
  }
  return strings;
}

// ---------------------------------------------------------------------------
// Widgets for this module
// ---------------------------------------------------------------------------

function ClickEventsWidget() {
  return (
    <ReactPlayground
      intro="Run each example, then click the buttons in the preview and watch the console."
      examples={[
        {
          label: "A click handler",
          code: `function AddButton() {
  function handleClick() {
    console.log("Added to cart");
  }

  return <button onClick={handleClick}>Add to cart</button>;
}

render(<AddButton />);`,
          lookFor: "Nothing is logged until you click. React calls handleClick for you, later.",
        },
        {
          label: "handleClick() trap",
          code: `function AddButton() {
  function handleClick() {
    console.log("Added to cart");
  }

  return <button onClick={handleClick()}>Add to cart</button>;
}

render(<AddButton />);`,
          lookFor: "It logs straight away, and clicking does nothing. The brackets called the function during render.",
        },
        {
          label: "Passing a value",
          code: `function SizePicker() {
  function chooseSize(size) {
    console.log("You chose", size);
  }

  return (
    <>
      <button onClick={() => chooseSize("S")}>S</button>
      <button onClick={() => chooseSize("M")}>M</button>
      <button onClick={() => chooseSize("L")}>L</button>
    </>
  );
}

render(<SizePicker />);`,
          lookFor: "Wrap the call in an arrow function: a new function that calls chooseSize(...) when clicked.",
        },
      ]}
    />
  );
}

function FormEventsWidget() {
  return (
    <ReactPlayground
      intro="Type in the preview's field, then submit. The event object tells you what happened."
      examples={[
        {
          label: "onChange",
          code: `function SearchBox() {
  function handleChange(event) {
    console.log("The box now says:", event.target.value);
  }

  return <input placeholder="Search products" onChange={handleChange} />;
}

render(<SearchBox />);`,
          lookFor: "onChange runs on every keystroke. event.target is the input; .value is its text.",
        },
        {
          label: "Submit, no preventDefault",
          code: `function Newsletter() {
  function handleSubmit(event) {
    console.log("Signed up!");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" />
      <button>Sign up</button>
    </form>
  );
}

render(<Newsletter />);`,
          lookFor: "Read the warning. A real browser would reload the whole page here.",
        },
        {
          label: "Submit, fixed",
          code: `function Newsletter() {
  function handleSubmit(event) {
    event.preventDefault();
    console.log("Signed up!");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Email" />
      <button>Sign up</button>
    </form>
  );
}

render(<Newsletter />);`,
          lookFor: "preventDefault() stops the browser's default action (reloading), so your code is in charge.",
        },
      ]}
    />
  );
}

function HandlerPropsWidget() {
  return (
    <ReactPlayground
      intro="The child reports the click; the parent decides what it means. Then try the counter."
      examples={[
        {
          label: "Handler as a prop",
          code: `function AddButton({ onAdd }) {
  return <button onClick={onAdd}>Add to cart</button>;
}

function App() {
  function handleAdd() {
    console.log("App heard about the click");
  }

  return <AddButton onAdd={handleAdd} />;
}

render(<App />);`,
          lookFor: "AddButton doesn't know what adding means. It just calls the function it was given.",
        },
        {
          label: "The count never changes",
          code: `function App() {
  let cartCount = 0;

  function handleAdd() {
    cartCount = cartCount + 1;
    console.log("cartCount is now", cartCount);
  }

  return (
    <>
      <p>Cart ({cartCount})</p>
      <button onClick={handleAdd}>Add to cart</button>
    </>
  );
}

render(<App />);`,
          lookFor: "The console says 1, 2, 3… but the screen stays at 0. Module 7 explains why, and fixes it.",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const handlingEvents: Stage = {
  id: "mid-events",
  level: "mid",
  part: PART,
  title: "Responding to clicks",
  short: "Click events",
  lead: (
    <>
      An event handler is a function you give to React, saying &quot;call this
      when the user clicks&quot;. You hand it over; you don&apos;t call it.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        Shopfront shows products, but clicking <b>Add to cart</b> does
        nothing. The interface needs to respond to the user.
      </p>

      <StepHeading>The mental model</StepHeading>
      <Analogy icon="🔔">
        Leaving your number at a shop: &quot;call me when it&apos;s in
        stock.&quot; You give them the number now; they ring it later. You
        don&apos;t ring yourself while you&apos;re standing at the counter.
      </Analogy>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`function ProductCard({ name }) {
  function handleAddClick() {               // 1. define the function
    console.log("Added " + name + " to cart");
  }

  return (
    <button onClick={handleAddClick}>       {/* 2. hand it over: no () */}
      Add to cart
    </button>
  );
}`}
      />
      <ul className="my-3 list-disc pl-8">
        <li>
          Event props are camelCase: <code>onClick</code>,{" "}
          <code>onChange</code>, <code>onSubmit</code>.
        </li>
        <li>
          Handlers are usually defined <b>inside</b> the component, so they can
          use its props (<code>name</code> above).
        </li>
        <li>
          By convention, the function is called <code>handleSomething</code>.
        </li>
      </ul>

      <StepHeading>Common mistake</StepHeading>
      <CodeBlock
        code={`<button onClick={handleAddClick()}>   // ❌ calls it now, during render
<button onClick={handleAddClick}>     // ✅ React calls it on click
<button onClick={() => addToCart(product)}>  // ✅ an arrow, to pass a value`}
      />
    </>
  ),
  widget: { title: "Handle a click", Component: ClickEventsWidget },
  quiz: [
    {
      question: "What's the difference between onClick={save} and onClick={save()}?",
      options: [
        "None",
        "onClick={save} passes the function for React to call later; save() calls it immediately, during render",
        "save() is faster",
        "onClick={save} only works in forms",
      ],
      answerIndex: 1,
      explanation: "Brackets mean 'call it now'. React wants the function itself, to call on click.",
    },
    {
      question: "You need to pass the product to addToCart when clicked. Which works?",
      options: [
        "onClick={addToCart(product)}",
        "onClick={() => addToCart(product)}",
        "onClick=\"addToCart(product)\"",
        "onclick={addToCart}",
      ],
      answerIndex: 1,
      explanation: "The arrow function is what React calls on click; it then calls addToCart with the product.",
    },
    {
      question: "Why define handleClick inside the component?",
      options: [
        "React requires all functions to be inside components",
        "So it can use the component's props and data, like the product's name",
        "It runs faster there",
        "So it runs on every render",
      ],
      answerIndex: 1,
      explanation: "Defined inside, it can see everything the component can see.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <ol>
          <li>
            The console logs before anyone clicks. Fix the <b>Add to cart</b>{" "}
            button so it logs <code>Added Ergonomic Mouse to cart</code> (with
            the card&apos;s name) only when clicked.
          </li>
          <li>
            Add a second button, <code>Save</code>, whose{" "}
            <code>onClick</code> is an inline arrow function that logs{" "}
            <code>Saved Wireless Keyboard</code> (with the card&apos;s name).
          </li>
        </ol>
      </>
    ),
    starter: `function ProductCard({ name }) {
  function handleAddClick() {
    console.log("Added " + name + " to cart");
  }

  return (
    <article>
      <h2>{name}</h2>
      <button onClick={handleAddClick()}>Add to cart</button>
    </article>
  );
}

function App() {
  return (
    <main>
      <ProductCard name="Wireless Keyboard" />
      <ProductCard name="Ergonomic Mouse" />
    </main>
  );
}

render(<App />);
`,
    extract: `(() => {
  const duringRender = __logsDuring(() => render(<App />));
  const afterAddClick = __logsDuring(() => screen.click("Add to cart", 1));
  const afterSaveClick = __logsDuring(() => screen.click("Save", 0));
  return { duringRender, afterAddClick, afterSaveClick };
})()`,
    tests: (values, code, logs) => [
      check(readStringList(values, "duringRender").length === 0, "nothing is logged while the page renders"),
      check(
        isSameValue(readStringList(values, "afterAddClick"), ["Added Ergonomic Mouse to cart"]),
        "clicking the second card's Add to cart logs Added Ergonomic Mouse to cart"
      ),
      check(
        isSameValue(readStringList(values, "afterSaveClick"), ["Saved Wireless Keyboard"]),
        "clicking the first card's Save logs Saved Wireless Keyboard"
      ),
      check(/onClick=\{\s*\(\s*\)\s*=>/.test(code), "Save uses an inline arrow function"),
      checkNoReactWarnings(logs),
    ],
    hint: (
      <>
        Remove the brackets: <code>{"onClick={handleAddClick}"}</code>. For
        Save:{" "}
        <code>{'<button onClick={() => console.log("Saved " + name)}>Save</button>'}</code>.
      </>
    ),
    solution: `function ProductCard({ name }) {
  function handleAddClick() {
    console.log("Added " + name + " to cart");
  }

  return (
    <article>
      <h2>{name}</h2>
      <button onClick={handleAddClick}>Add to cart</button>
      <button onClick={() => console.log("Saved " + name)}>Save</button>
    </article>
  );
}

function App() {
  return (
    <main>
      <ProductCard name="Wireless Keyboard" />
      <ProductCard name="Ergonomic Mouse" />
    </main>
  );
}

render(<App />);`,
  },
};

const inputsAndForms: Stage = {
  id: "mid-inputs",
  level: "mid",
  part: PART,
  title: "Inputs, forms and the event object",
  short: "Inputs and forms",
  lead: (
    <>
      React passes every handler an <b>event object</b> describing what
      happened. For inputs, <code>event.target.value</code> is what the user
      typed.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        Shopfront needs a search box. A click handler only tells you that
        something was clicked; for typing you need to know <i>what</i> was
        typed.
      </p>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`function SearchBox() {
  function handleChange(event) {
    console.log("Typing:", event.target.value);   // the input's current text
  }

  function handleSubmit(event) {
    event.preventDefault();                       // stop the page reloading
    console.log("Search submitted");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Search products" onChange={handleChange} />
      <button>Search</button>
    </form>
  );
}`}
      />
      <ul className="my-3 list-disc pl-8">
        <li>
          <code>onChange</code> runs on <b>every keystroke</b> (in React,
          unlike plain HTML where change waits until you leave the field).
        </li>
        <li>
          <code>event.target</code> is the element the event happened on.
        </li>
        <li>
          A button inside a form submits it. Put <code>onSubmit</code> on the{" "}
          <code>&lt;form&gt;</code>, not <code>onClick</code> on the button,
          so pressing Enter works too.
        </li>
      </ul>
      <Analogy icon="📮">
        A form&apos;s default job is to post itself to a server and load a new
        page. <code>event.preventDefault()</code> says: &quot;thanks, I&apos;ll
        handle this one myself.&quot;
      </Analogy>
      <Tip>
        💡 You can log what was typed, but you can&apos;t yet <i>show</i> it
        elsewhere on the page, or use it when the form is submitted. That
        needs the component to remember it, which is Module 7.
      </Tip>
    </>
  ),
  widget: { title: "Typing and submitting", Component: FormEventsWidget },
  quiz: [
    {
      question: "Inside an input's onChange handler, what is event.target.value?",
      options: [
        "The key that was just pressed",
        "The input's whole current text",
        "The input's placeholder",
        "true or false",
      ],
      answerIndex: 1,
      explanation: "It's the full text in the box right now, as a string.",
    },
    {
      question: "Why call event.preventDefault() in a form's onSubmit?",
      options: [
        "To stop the event reaching other components",
        "To stop the browser's default action: submitting and reloading the page",
        "To clear the form",
        "React requires it for every event",
      ],
      answerIndex: 1,
      explanation: "Without it, the browser reloads the page and everything on it starts again.",
    },
    {
      question: "The user types 'lamp'. How many times does onChange run?",
      options: ["Once, when they finish", "4 times, once per keystroke", "Once, on submit", "Never: you need onInput"],
      answerIndex: 1,
      explanation: "React's onChange fires on every change to the value.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <ol>
          <li>
            Connect the input so that typing logs <code>Typing: key</code>{" "}
            (with the input&apos;s current text).
          </li>
          <li>
            Make the form&apos;s submit handler stop the page reloading, and
            still log <code>Search submitted</code>.
          </li>
        </ol>
      </>
    ),
    starter: `function SearchBox() {
  function handleChange(event) {
    // log "Typing: " followed by what's in the box
  }

  function handleSubmit(event) {
    console.log("Search submitted");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Search products" />
      <button>Search</button>
    </form>
  );
}

render(<SearchBox />);
`,
    extract: `(() => {
  render(<SearchBox />);
  const afterTyping = __logsDuring(() => screen.type("Search products", "key"));
  const afterSubmit = __logsDuring(() => screen.click("Search"));
  return { afterTyping, afterSubmit };
})()`,
    tests: (values, code, logs) => [
      check(
        isSameValue(readStringList(values, "afterTyping"), ["Typing: key"]),
        "typing key logs Typing: key"
      ),
      check(readStringList(values, "afterSubmit").includes("Search submitted"), "submitting logs Search submitted"),
      check(/preventDefault\(\)/.test(code), "the submit handler calls event.preventDefault()"),
      checkNoReactWarnings(logs),
    ],
    hint: (
      <>
        Add <code>{"onChange={handleChange}"}</code> to the input, and in
        handleChange: <code>console.log(&quot;Typing: &quot; + event.target.value);</code>
        . In handleSubmit, call <code>event.preventDefault();</code> first.
      </>
    ),
    solution: `function SearchBox() {
  function handleChange(event) {
    console.log("Typing: " + event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Search submitted");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Search products" onChange={handleChange} />
      <button>Search</button>
    </form>
  );
}

render(<SearchBox />);`,
  },
};

const handlersThroughProps: Stage = {
  id: "mid-handler-props",
  level: "mid",
  part: PART,
  title: "Passing handlers through props",
  short: "Handlers as props",
  lead: (
    <>
      Data flows down, so how does a child tell its parent something happened?
      The parent passes down a <b>function</b>, and the child calls it.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        The <b>Add to cart</b> button lives in <code>ProductCard</code>, but the
        cart belongs to the whole app. The card shouldn&apos;t decide what
        &quot;adding to the cart&quot; means; it should just report that it
        was clicked, and which product it was.
      </p>

      <StepHeading>The mental model</StepHeading>
      <Analogy icon="📞">
        Props flow down like instructions from a manager. A function prop is
        the manager&apos;s phone number: the team member doesn&apos;t make the
        decision, they call it in. &quot;Someone wants the Laptop
        Stand.&quot;
      </Analogy>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`function ProductCard({ product, onAdd }) {
  return (
    <button onClick={() => onAdd(product)}>Add to cart</button>
  );
}

function App() {
  function handleAdd(product) {
    console.log("Cart: added " + product.name);
  }

  return <ProductCard product={lamp} onAdd={handleAdd} />;
}`}
      />
      <ul className="my-3 list-disc pl-8">
        <li>
          Name the prop <code>onSomething</code> and the parent&apos;s function{" "}
          <code>handleSomething</code>, like the built-in{" "}
          <code>onClick</code>.
        </li>
        <li>
          A component in the middle (like <code>ProductList</code>) just passes
          the function along.
        </li>
      </ul>

      <StepHeading>The cliffhanger</StepHeading>
      <p>
        Try the second widget example. The click reaches <code>App</code>,
        and a variable counts up in the console, but the screen never changes.
        Making the UI <i>remember</i> and <i>redraw</i> is the subject of
        the next module.
      </p>
    </>
  ),
  widget: { title: "Children report, parents decide", Component: HandlerPropsWidget },
  quiz: [
    {
      question: "How does a child component tell its parent that something happened?",
      options: [
        "It changes the parent's props",
        "It calls a function the parent passed to it as a prop",
        "It returns a value from render",
        "It can't",
      ],
      answerIndex: 1,
      explanation: "Data goes down as props; events come back up through function props.",
    },
    {
      question: "ProductList sits between App and ProductCard. What does it do with onAdd?",
      options: [
        "Calls it once for every product",
        "Passes it on to each ProductCard",
        "Nothing; ProductCard can reach App directly",
        "Copies it into its own variable",
      ],
      answerIndex: 1,
      explanation: "It only passes the function along, so the card can call it.",
    },
    {
      question: (
        <>
          App has <code>let cartCount = 0</code>, and a click runs{" "}
          <code>cartCount = cartCount + 1</code>. After three clicks, what does{" "}
          <code>{"<p>Cart ({cartCount})</p>"}</code> show?
        </>
      ),
      options: ["Cart (3)", "Cart (0)", "Cart (1)", "An error"],
      answerIndex: 1,
      explanation: "Changing a variable doesn't make React draw again. That's the problem state solves.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <ol>
          <li>
            <code>ProductCard</code> takes a <code>product</code> and an{" "}
            <code>onAdd</code> prop. Clicking its button calls{" "}
            <code>onAdd(product)</code>; the card itself logs nothing.
          </li>
          <li>
            <code>ProductList</code> takes <code>onAdd</code> and passes it to
            every card.
          </li>
          <li>
            <code>App</code> defines <code>handleAdd(product)</code>, which
            logs <code>Cart: added Laptop Stand</code>, and passes it down.
          </li>
        </ol>
      </>
    ),
    starter: `${SHOPFRONT_PRODUCTS_CODE}

function ProductCard({ product }) {
  return (
    <article>
      <h2>{product.name}</h2>
      <button onClick={() => console.log("clicked " + product.name)}>Add to cart</button>
    </article>
  );
}

function ProductList() {
  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}

function App() {
  return (
    <main>
      <h1>Shopfront</h1>
      <ProductList />
    </main>
  );
}

render(<App />);
`,
    extract: `(() => {
  let received = "nothing";
  const testProduct = { id: 99, name: "Test Product", price: 1, stock: 1 };
  render(<ProductCard product={testProduct} onAdd={(product) => { received = product.name; }} />);
  const cardLogs = __logsDuring(() => screen.click("Add to cart"));
  render(<App />);
  const appLogs = __logsDuring(() => screen.click("Add to cart", 3));
  return { received, cardLogs, appLogs };
})()`,
    tests: (values, _code, logs) => [
      check(values.received === "Test Product", "clicking a card calls onAdd with that card's product"),
      check(readStringList(values, "cardLogs").length === 0, "ProductCard doesn't log anything itself"),
      check(
        isSameValue(readStringList(values, "appLogs"), ["Cart: added Laptop Stand"]),
        "in the app, clicking the Laptop Stand logs Cart: added Laptop Stand"
      ),
      checkNoReactWarnings(logs),
    ],
    hint: (
      <>
        Card: <code>{"function ProductCard({ product, onAdd })"}</code> and{" "}
        <code>{"onClick={() => onAdd(product)}"}</code>. List:{" "}
        <code>{"function ProductList({ onAdd })"}</code> and{" "}
        <code>{"<ProductCard ... onAdd={onAdd} />"}</code>. App:{" "}
        <code>{"<ProductList onAdd={handleAdd} />"}</code>.
      </>
    ),
    solution: `${SHOPFRONT_PRODUCTS_CODE}

function ProductCard({ product, onAdd }) {
  return (
    <article>
      <h2>{product.name}</h2>
      <button onClick={() => onAdd(product)}>Add to cart</button>
    </article>
  );
}

function ProductList({ onAdd }) {
  return (
    <section>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </section>
  );
}

function App() {
  function handleAdd(product) {
    console.log("Cart: added " + product.name);
  }

  return (
    <main>
      <h1>Shopfront</h1>
      <ProductList onAdd={handleAdd} />
    </main>
  );
}

render(<App />);`,
  },
};

export const MODULE_6_STAGES: Stage[] = [handlingEvents, inputsAndForms, handlersThroughProps];
