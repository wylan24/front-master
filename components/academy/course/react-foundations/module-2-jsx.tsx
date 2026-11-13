import type { Stage } from "@/lib/academy/types";
import { Analogy, Cheat, CheatSheet, CodeBlock, StepHeading, Tip } from "../../content";
import { check } from "../check";
import { ReactPlayground } from "../../widgets/react-playground";
import { ClassifySorter } from "../../widgets/classify-sorter";
import { checkNoReactWarnings, countMatches, readNumber, readText } from "./checks";

const PART = "Module 2 · Thinking in UI: JSX";

// ---------------------------------------------------------------------------
// Widgets for this module
// ---------------------------------------------------------------------------

function FirstJsxWidget() {
  return (
    <ReactPlayground
      intro="Run each example, then change it. The preview is drawn from the JSX; the console shows React's warnings."
      examples={[
        {
          label: "A product",
          code: `function App() {
  return (
    <article>
      <h2>Wireless Keyboard</h2>
      <p>Quiet keys, two-year battery.</p>
      <button>Add to cart</button>
    </article>
  );
}

render(<App />);`,
          lookFor: "Looks like HTML, but it lives inside a JavaScript function. Change the text and run it again.",
        },
        {
          label: "class vs className",
          code: `function App() {
  return (
    <div class="card">
      <label for="qty">Quantity</label>
      <input id="qty" type="number" />
    </div>
  );
}

render(<App />);`,
          lookFor: "It still draws, but React warns twice. Fix both attributes and the warnings go away.",
        },
        {
          label: "The style object",
          code: `function App() {
  return (
    <p style={{ color: "white", backgroundColor: "green", padding: "8px" }}>
      Free shipping unlocked!
    </p>
  );
}

render(<App />);`,
          lookFor: 'style takes an object with camelCase names. Try style="color: red" to see the error.',
        },
        {
          label: "Unclosed <img>",
          code: `function App() {
  return (
    <div>
      <img src="keyboard.jpg" alt="Wireless Keyboard">
      <p>£49.99</p>
    </div>
  );
}

render(<App />);`,
          lookFor: "HTML forgives an unclosed <img>. JSX doesn't. Read the error, then add the />.",
        },
      ]}
    />
  );
}

function ExpressionOrStatementWidget() {
  return (
    <ClassifySorter
      intro="Could each one go inside JSX curly braces, like <p>{ ... }</p>? Values are allowed; statements are not."
      categories={[
        { id: "allowed", label: "Allowed in {}" },
        { id: "not", label: "Not allowed" },
      ]}
      items={[
        { text: "price * 2", isCode: true, answer: "allowed", why: "A calculation produces a value." },
        {
          text: "product.name.toUpperCase()",
          isCode: true,
          answer: "allowed",
          why: "A method call returns a value.",
        },
        {
          text: 'isSale ? "Sale!" : "Full price"',
          isCode: true,
          answer: "allowed",
          why: "A ternary is an expression: it always produces one of two values.",
        },
        {
          text: 'if (isSale) { "Sale!" }',
          isCode: true,
          answer: "not",
          why: "if is a statement: it decides what runs, it doesn't produce a value. Use a ternary or &&.",
        },
        {
          text: "for (const p of products) { ... }",
          isCode: true,
          answer: "not",
          why: "A loop is a statement. In JSX you use products.map(...), which returns an array.",
        },
        {
          text: "formatPrice(price)",
          isCode: true,
          answer: "allowed",
          why: "Calling a function gives you its return value.",
        },
        {
          text: "const total = 5",
          isCode: true,
          answer: "not",
          why: "Declaring a variable is a statement. Do it above the return, then use {total}.",
        },
        {
          text: "`£${price.toFixed(2)}`",
          isCode: true,
          answer: "allowed",
          why: "A template literal is a string value.",
        },
        {
          text: "items.length",
          isCode: true,
          answer: "allowed",
          why: "Reading a property is an expression.",
        },
        {
          text: 'products.map(p => <li key={p.id}>{p.name}</li>)',
          isCode: true,
          answer: "allowed",
          why: "map returns an array of JSX, which React draws. You'll use this in Module 5.",
        },
      ]}
    />
  );
}

function WhatJsxBecomesWidget() {
  return (
    <ReactPlayground
      intro='Press "Show the JavaScript" to see what each piece of JSX turns into before it runs.'
      canShowCompiled
      examples={[
        {
          label: "One element",
          code: `const heading = <h1>Shopfront</h1>;

render(heading);`,
          lookFor: "A tag becomes one function call: the tag name, the attributes, then the children.",
        },
        {
          label: "Nested",
          code: `const card = (
  <article className="card">
    <h2>Desk Lamp</h2>
    <p>£{(22).toFixed(2)}</p>
  </article>
);

render(card);`,
          lookFor: "Children become extra arguments. {expressions} are passed through as plain JavaScript.",
        },
        {
          label: "Fragment",
          code: `function ProductHeading() {
  return (
    <>
      <h1>Wireless Keyboard</h1>
      <p>Type quietly, anywhere.</p>
    </>
  );
}

render(<ProductHeading />);`,
          lookFor: "<>…</> groups siblings without adding an extra element to the page.",
        },
        {
          label: "Two siblings",
          code: `function ProductHeading() {
  return (
    <h1>Wireless Keyboard</h1>
    <p>Type quietly, anywhere.</p>
  );
}

render(<ProductHeading />);`,
          lookFor: "A function can only return one value, so this can't become one function call. Wrap it in <>…</>.",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const fromHtmlToJsx: Stage = {
  id: "jsx-intro",
  level: "basic",
  part: PART,
  title: "From HTML to JSX",
  short: "From HTML to JSX",
  lead: (
    <>
      JSX lets you write the shape of the interface inside JavaScript, so the
      markup and the data that drives it live together.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        In Module 1, the cart&apos;s data lived in JavaScript but its markup
        lived in an HTML file, and you had to connect them with{" "}
        <code>querySelector</code>. If the UI is going to be{" "}
        <code>f(data)</code>, the description of the UI needs to be something
        JavaScript can produce.
      </p>

      <StepHeading>The mental model</StepHeading>
      <p>
        <b>JSX</b> is a way of writing that description that looks like HTML
        but is really JavaScript. A <b>component</b> is a function that
        returns it:
      </p>
      <CodeBlock
        code={`function App() {
  return (
    <article>
      <h2>Wireless Keyboard</h2>
      <button>Add to cart</button>
    </article>
  );
}

render(<App />);   // in this course, render() shows it in the preview`}
      />
      <Analogy icon="🏗️">
        HTML is a finished building. JSX is an architect&apos;s drawing: a
        description that something else (React) turns into the real thing,
        and can redraw when the plans change.
      </Analogy>

      <StepHeading>JSX is not HTML</StepHeading>
      <p>
        Because JSX is JavaScript, a few HTML habits need to change:
      </p>
      <CheatSheet>
        <Cheat code='className="card"'>
          <code>class</code> is a JavaScript keyword, so JSX uses{" "}
          <code>className</code>.
        </Cheat>
        <Cheat code='htmlFor="email"'>
          <code>for</code> is a keyword too (the loop), so labels use{" "}
          <code>htmlFor</code>.
        </Cheat>
        <Cheat code="<img ... />">
          Every tag must close. Self-close the ones with no children:{" "}
          <code>&lt;img /&gt;</code>, <code>&lt;input /&gt;</code>,{" "}
          <code>&lt;br /&gt;</code>.
        </Cheat>
        <Cheat code="onClick, tabIndex">
          Attributes are camelCase, like JavaScript property names.
        </Cheat>
        <Cheat code='style={{ color: "red" }}'>
          <code>style</code> takes an object, not a string. Outer braces: a
          JavaScript value. Inner braces: the object.
        </Cheat>
        <Cheat code='src="keyboard.jpg" alt="..."'>
          Plain text attributes work just like HTML. Always include{" "}
          <code>alt</code> on images.
        </Cheat>
      </CheatSheet>
      <Tip>
        💡 <b>Common mistakes:</b> <code>class</code> instead of{" "}
        <code>className</code>, an unclosed <code>&lt;img&gt;</code> or{" "}
        <code>&lt;input&gt;</code>, and <code>style=&quot;color: red&quot;</code>.
        The first gives a warning; the other two stop the code from running.
      </Tip>
    </>
  ),
  widget: { title: "Your first JSX", Component: FirstJsxWidget },
  quiz: [
    {
      question: "Why does JSX use className instead of class?",
      options: [
        "className is shorter",
        "JSX is JavaScript, and class is already a JavaScript keyword",
        "Browsers no longer support class",
        "className only works with CSS modules",
      ],
      answerIndex: 1,
      explanation: "JSX is turned into JavaScript, so it avoids JavaScript's reserved words: class and for.",
    },
    {
      question: "Which line is valid JSX?",
      options: [
        '<img src="lamp.jpg" alt="Desk lamp">',
        '<img src="lamp.jpg" alt="Desk lamp" />',
        '<img src="lamp.jpg" alt="Desk lamp"></img',
        "<img src=lamp.jpg />",
      ],
      answerIndex: 1,
      explanation: "In JSX every tag closes. Tags without children self-close with />.",
    },
    {
      question: 'In style={{ color: "red" }}, what are the two pairs of braces?',
      options: [
        "A mistake: one pair is enough",
        "The outer pair means 'a JavaScript value', the inner pair is the object itself",
        "Both mean 'a CSS rule'",
        "The inner pair is a code block",
      ],
      answerIndex: 1,
      explanation: "{ } in JSX means 'JavaScript goes here'. The value you put there happens to be an object.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          This HTML was pasted straight into a component, so it doesn&apos;t
          run. Convert it to JSX without changing what it shows:
        </p>
        <ol>
          <li>
            <code>class</code> → <code>className</code> and{" "}
            <code>for</code> → <code>htmlFor</code>
          </li>
          <li>
            close the <code>&lt;input&gt;</code> and <code>&lt;img&gt;</code>
          </li>
          <li>
            turn the button&apos;s <code>style</code> string into a style
            object (keep <code>color: white</code> and{" "}
            <code>background: green</code>)
          </li>
        </ol>
      </>
    ),
    starter: `function Newsletter() {
  return (
    <div class="newsletter">
      <label for="email">Get deals by email</label>
      <input id="email" type="email" placeholder="you@example.com">
      <img src="envelope.png" alt="Envelope">
      <button style="color: white; background: green">Sign up</button>
    </div>
  );
}

render(<Newsletter />);
`,
    extract: `(() => {
  render(<Newsletter />);
  return { html: screen.html(), inputs: screen.count("input"), images: screen.count("img") };
})()`,
    tests: (values, code, logs) => {
      const html = readText(values, "html");
      return [
        check(html.includes('class="newsletter"') && /className=/.test(code), "the div uses className"),
        check(html.includes('for="email"') && /htmlFor=/.test(code), "the label uses htmlFor"),
        check(readNumber(values, "inputs") === 1 && html.includes('placeholder="you@example.com"'), "the email input is there"),
        check(readNumber(values, "images") === 1 && html.includes('alt="Envelope"'), "the image is there, with its alt text"),
        check(
          /style=\{\{/.test(code) && html.includes("color: white") && html.includes("background: green"),
          "the button's style is an object with color and background"
        ),
        check(html.includes("Sign up") && html.includes("Get deals by email"), "the text is unchanged"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        Fix the errors first, one at a time: <code>&lt;input ... /&gt;</code>,{" "}
        <code>&lt;img ... /&gt;</code>, then{" "}
        <code>style={"{{ color: \"white\", background: \"green\" }}"}</code>.
        Then fix the two warnings the console shows.
      </>
    ),
    solution: `function Newsletter() {
  return (
    <div className="newsletter">
      <label htmlFor="email">Get deals by email</label>
      <input id="email" type="email" placeholder="you@example.com" />
      <img src="envelope.png" alt="Envelope" />
      <button style={{ color: "white", background: "green" }}>Sign up</button>
    </div>
  );
}

render(<Newsletter />);`,
  },
};

const embeddingJavaScript: Stage = {
  id: "jsx-expressions",
  level: "basic",
  part: PART,
  title: "Putting data in JSX",
  short: "Curly braces",
  lead: (
    <>
      Curly braces <code>{"{ }"}</code> open a window from JSX back into
      JavaScript. Whatever value goes in appears on the page, so{" "}
      <b>the data decides what appears</b>.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <p>
        A product page with the name typed straight into the JSX only ever
        shows one product. For <code>UI = f(data)</code>, the JSX must read
        from the data.
      </p>

      <StepHeading>Understand the code</StepHeading>
      <CodeBlock
        code={`const product = { name: "Wireless Keyboard", price: 49.99, discount: 10 };

function ProductInfo() {
  const salePrice = product.price * (1 - product.discount / 100);

  return (
    <>
      <h1>{product.name}</h1>
      <p>Price: £{product.price.toFixed(2)}</p>
      <p>{product.discount > 0 ? "Sale!" : "Full price"}</p>
      <img src="keyboard.jpg" alt={product.name} />
    </>
  );
}`}
      />
      <ul className="my-3 list-disc pl-8">
        <li>
          <code>{"{product.name}"}</code> puts a value in the text.
        </li>
        <li>
          <code>{"alt={product.name}"}</code> puts a value in an attribute (no
          quotes around the braces).
        </li>
        <li>
          Work out anything complicated <b>above</b> the <code>return</code>,
          in normal JavaScript, then use the variable.
        </li>
      </ul>

      <StepHeading>Expressions vs statements</StepHeading>
      <p>
        Only <b>expressions</b> (things that produce a value) can go inside{" "}
        <code>{"{ }"}</code>. Statements like <code>if</code>,{" "}
        <code>for</code> and <code>const</code> can&apos;t, because they
        don&apos;t produce anything to show. For choices inside JSX, use the
        ternary <code>condition ? a : b</code>.
      </p>
      <Analogy icon="🖼️">
        Braces are a picture frame. You can put a picture in it (a value), but
        not a set of instructions for painting one.
      </Analogy>
      <Tip>
        💡 Predict before you run: <code>{"<p>{2 + 3}</p>"}</code> shows{" "}
        <b>5</b>, but <code>{'<p>{"2 + 3"}</p>'}</code> shows the text{" "}
        <b>2 + 3</b>, and <code>{"<p>2 + 3</p>"}</code> shows it too, because
        outside braces everything is just text.
      </Tip>
    </>
  ),
  widget: { title: "Expression or statement?", Component: ExpressionOrStatementWidget },
  quiz: [
    {
      question: "Why can you write {price * 2} in JSX but not {if (price > 10) { ... }}?",
      options: [
        "Maths is allowed but comparisons aren't",
        "Braces need an expression that produces a value; if is a statement that produces nothing",
        "if only works in class components",
        "You can, but only with semicolons",
      ],
      answerIndex: 1,
      explanation: "JSX needs a value to show. Use a ternary, or work it out above the return.",
    },
    {
      question: (
        <>
          With <code>const stock = 3;</code>, what does{" "}
          <code>{"<p>{stock > 0 ? stock + \" left\" : \"Sold out\"}</p>"}</code> show?
        </>
      ),
      options: ["Sold out", "3 left", "stock + left", "true"],
      answerIndex: 1,
      explanation: "stock > 0 is true, so the ternary produces 3 + \" left\", which is \"3 left\".",
    },
    {
      question: (
        <>
          What does <code>{"<img alt=\"{product.name}\" />"}</code> put in the alt text?
        </>
      ),
      options: [
        "The product's name",
        "The literal text {product.name}",
        "Nothing",
        "An error",
      ],
      answerIndex: 1,
      explanation: 'Quotes make it a plain string. For a value, drop the quotes: alt={product.name}.',
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <p>
          Make <code>ProductInfo</code> show the <code>product</code> data.
          Don&apos;t type the name or price into the JSX: read them from{" "}
          <code>product</code>.
        </p>
        <ol>
          <li>
            an <code>&lt;h1&gt;</code> with the name
          </li>
          <li>a paragraph with the description</li>
          <li>
            a paragraph <code>Price: £49.99</code> (use{" "}
            <code>toFixed(2)</code>), followed by <code>Sale!</code> in a{" "}
            <code>&lt;strong&gt;</code> when <code>discount</code> is above 0,
            using a ternary
          </li>
          <li>
            an image using <code>product.image</code> with the name as its{" "}
            <code>alt</code>
          </li>
        </ol>
      </>
    ),
    starter: `const product = {
  name: "Wireless Keyboard",
  description: "Quiet keys and a two-year battery.",
  price: 49.99,
  discount: 10,
  image: "keyboard.jpg",
};

function ProductInfo() {
  return (
    <>
      <h1>Product name goes here</h1>
    </>
  );
}

render(<ProductInfo />);
`,
    extract: `(() => {
  render(<ProductInfo />);
  return { html: screen.html(), text: screen.text(), images: screen.count("img") };
})()`,
    tests: (values, code, logs) => {
      const html = readText(values, "html");
      const text = readText(values, "text");
      return [
        check(html.includes("<h1>Wireless Keyboard</h1>"), "the heading shows the product's name"),
        check(text.includes("Quiet keys and a two-year battery."), "the description is shown"),
        check(text.includes("Price: £49.99"), "the price reads Price: £49.99"),
        check(html.includes("<strong>Sale!</strong>"), "Sale! appears in a <strong> (discount is 10)"),
        check(/discount\s*>\s*0\s*\?/.test(code), "Sale! is chosen with a ternary on discount > 0"),
        check(
          readNumber(values, "images") === 1 && html.includes('alt="Wireless Keyboard"'),
          "the image's alt text is the product's name"
        ),
        check(
          countMatches(code, /Wireless Keyboard/) === 1 && countMatches(code, /49\.99/) === 1,
          "the name and price are only written once, in the data"
        ),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        <code>{"<h1>{product.name}</h1>"}</code>, then{" "}
        <code>{"<p>Price: £{product.price.toFixed(2)} {product.discount > 0 ? <strong>Sale!</strong> : null}</p>"}</code>.
        For the image: <code>{"<img src={product.image} alt={product.name} />"}</code>.
      </>
    ),
    solution: `const product = {
  name: "Wireless Keyboard",
  description: "Quiet keys and a two-year battery.",
  price: 49.99,
  discount: 10,
  image: "keyboard.jpg",
};

function ProductInfo() {
  return (
    <>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>
        Price: £{product.price.toFixed(2)}{" "}
        {product.discount > 0 ? <strong>Sale!</strong> : null}
      </p>
      <img src={product.image} alt={product.name} />
    </>
  );
}

render(<ProductInfo />);`,
  },
};

const jsxStructure: Stage = {
  id: "jsx-structure",
  level: "basic",
  part: PART,
  title: "One parent, and what JSX becomes",
  short: "JSX structure",
  lead: (
    <>
      A component returns <b>one</b> piece of JSX. Knowing what JSX turns
      into explains why, and makes the rules feel obvious instead of
      arbitrary.
    </>
  ),
  lesson: (
    <>
      <StepHeading>The problem</StepHeading>
      <CodeBlock
        code={`function ProductHeading() {
  return (
    <h1>Wireless Keyboard</h1>
    <p>Type quietly, anywhere.</p>     // ❌ error
  );
}`}
      />
      <p>Two elements side by side won&apos;t run. To see why, look at what JSX becomes.</p>

      <StepHeading>What happens to JSX?</StepHeading>
      <p>
        Browsers don&apos;t understand JSX. Before your code runs, a build tool
        turns each tag into an ordinary function call:
      </p>
      <CodeBlock
        code={`<h1 className="title">Shopfront</h1>

// becomes

React.createElement("h1", { className: "title" }, "Shopfront")`}
      />
      <p>
        So JSX is just a nicer way to write function calls, and each call
        returns one value (a small object describing the element). A{" "}
        <code>return</code> can only give back one value, which is why two
        sibling tags don&apos;t work: they would be two values.
      </p>

      <StepHeading>The fix: one parent</StepHeading>
      <CodeBlock
        code={`// Wrap in a <div> when you want a real element on the page
return (
  <div className="product-heading">
    <h1>Wireless Keyboard</h1>
    <p>Type quietly, anywhere.</p>
  </div>
);

// Wrap in a fragment <>...</> when you don't want an extra element
return (
  <>
    <h1>Wireless Keyboard</h1>
    <p>Type quietly, anywhere.</p>
  </>
);`}
      />
      <Analogy icon="📦">
        A fragment is a parcel with no box: it lets you hand over several
        things as one delivery, and the box disappears when it arrives.
      </Analogy>
      <Tip>
        💡 Wrap a multi-line <code>return</code> in brackets{" "}
        <code>( ... )</code>. Without them, a <code>return</code> on its own
        line returns nothing.
      </Tip>
    </>
  ),
  widget: { title: "See what JSX turns into", Component: WhatJsxBecomesWidget },
  quiz: [
    {
      question: "Does the browser run JSX directly?",
      options: [
        "Yes, every modern browser supports JSX",
        "No: a build tool first turns it into ordinary JavaScript function calls",
        "Only Chrome does",
        "No, React converts it to HTML files on the server",
      ],
      answerIndex: 1,
      explanation: "JSX is turned into React.createElement(...) calls before it runs.",
    },
    {
      question: "Why must a component return a single parent element?",
      options: [
        "React only allows one element per page",
        "JSX becomes a function call that returns one value, and a return can only give back one value",
        "It's a style rule, not a real limit",
        "Browsers can only draw one element at a time",
      ],
      answerIndex: 1,
      explanation: "Two sibling tags would be two values. Wrapping them makes one.",
    },
    {
      question: "When would you choose a fragment <>…</> over a <div>?",
      options: [
        "When you need a CSS class on the wrapper",
        "When you want to group elements without adding an extra element to the page",
        "Fragments are always faster, so always",
        "Only inside lists",
      ],
      answerIndex: 1,
      explanation: "A fragment groups siblings and then disappears from the DOM.",
    },
  ],
  exercise: {
    runtime: "react",
    task: (
      <>
        <ol>
          <li>
            Fix <code>ProductHeading</code> so the heading and paragraph are
            returned together, <b>without</b> adding a wrapper element to the
            page (the <code>&lt;h1&gt;</code> must come first).
          </li>
          <li>
            <code>note</code> is written as the function call a build tool
            would produce. Rewrite it as JSX, then show <code>{"{note}"}</code>{" "}
            after the paragraph.
          </li>
        </ol>
      </>
    ),
    starter: `function ProductHeading() {
  return (
    <h1>Wireless Keyboard</h1>
    <p>Type quietly, anywhere.</p>
  );
}

// Rewrite this as JSX:
const note = React.createElement("small", null, "Free returns");

render(<ProductHeading />);
`,
    extract: `(() => {
  render(<ProductHeading />);
  return { html: screen.html() };
})()`,
    tests: (values, code, logs) => {
      const html = readText(values, "html");
      return [
        check(html.startsWith("<h1>Wireless Keyboard</h1>"), "the <h1> comes first, with no wrapper element"),
        check(html.includes("<p>Type quietly, anywhere.</p>"), "the paragraph is shown"),
        check(/<>/.test(code), "a fragment <>…</> groups them"),
        check(html.includes("<small>Free returns</small>"), "the note is shown"),
        check(!/createElement/.test(code), "note is written as JSX, not createElement"),
        checkNoReactWarnings(logs),
      ];
    },
    hint: (
      <>
        Put <code>&lt;&gt;</code> before the <code>&lt;h1&gt;</code> and{" "}
        <code>&lt;/&gt;</code> after the paragraph. The note becomes{" "}
        <code>{"const note = <small>Free returns</small>;"}</code>, and goes in
        the fragment as <code>{"{note}"}</code>.
      </>
    ),
    solution: `function ProductHeading() {
  return (
    <>
      <h1>Wireless Keyboard</h1>
      <p>Type quietly, anywhere.</p>
      {note}
    </>
  );
}

const note = <small>Free returns</small>;

render(<ProductHeading />);`,
  },
};

export const MODULE_2_STAGES: Stage[] = [fromHtmlToJsx, embeddingJavaScript, jsxStructure];
