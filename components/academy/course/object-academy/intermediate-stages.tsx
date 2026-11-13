import type { Stage } from "@/lib/academy/types";
import { isSameValue } from "@/lib/academy/format";
import { Analogy, CodeBlock, Cheat, CheatSheet, PanelHeading, Tip } from "../../content";
import { check, isPlainObject } from "../check";
import { ExpressionExplorer } from "../../widgets/expression-explorer";
import { CodePlayground } from "../../widgets/code-playground";

// ---------------------------------------------------------------------------
// Widgets for this section
// ---------------------------------------------------------------------------

function MethodsWidget() {
  return (
    <ExpressionExplorer
      intro="The same speak method is shared by dog and cat. Predict what each call returns."
      setup={`function speak() {
  return this.name + " says " + this.sound;
}
const dog = { name: "Rex", sound: "Woof", speak: speak };
const cat = { name: "Tom", sound: "Meow", speak: speak };
const arrowDog = { name: "Rex", getName: () => this.name };`}
      expressions={[
        { code: "dog.speak()", note: "this is dog, the object before the dot." },
        { code: "cat.speak()", note: "Same function, different object before the dot, so a different this." },
        { code: "dog.speak", note: "Without parentheses you get the function itself; it doesn't run." },
        {
          code: "arrowDog.getName() === \"Rex\"",
          note: "Arrow functions don't get their own this, so it isn't arrowDog. Use method syntax for methods.",
        },
      ]}
      ownExpressionStart="cat.sound"
    />
  );
}

function KeysValuesEntriesWidget() {
  return (
    <ExpressionExplorer
      intro="Each helper turns the object into an array. Guess the array first."
      setup={`const scores = { ana: 82, ben: 95, cy: 67 };`}
      expressions={[
        { code: "Object.keys(scores)", note: "The labels, in the order they were added." },
        { code: "Object.values(scores)", note: "Just the contents." },
        { code: "Object.entries(scores)", note: "Pairs: each one is a small [key, value] array." },
        { code: "Object.keys(scores).length", note: "The standard way to count properties." },
        { code: "scores.length", note: "Plain objects don't have a length." },
        {
          code: "Object.keys(scores).filter((name) => scores[name] >= 80)",
          note: "Once it's an array, filter, map and friends all work.",
        },
        {
          code: "Object.fromEntries(Object.entries(scores).map(([name, s]) => [name, s + 5]))",
          note: "fromEntries turns pairs back into an object: here, everyone gets 5 bonus points.",
        },
      ]}
      ownExpressionStart="Object.values(scores).length"
    />
  );
}

function ShorthandWidget() {
  return (
    <ExpressionExplorer
      intro="These variables already exist. Predict the object each line builds."
      setup={`const name = "Ivy";
const age = 30;
const field = "email";
const lang = "fr";`}
      expressions={[
        { code: "({ name: name, age: age })", note: "The long way." },
        { code: "({ name, age })", note: "Shorthand: identical result, half the typing." },
        { code: '({ field: "ivy@example.com" })', note: "Without brackets the key is literally \"field\"." },
        { code: '({ [field]: "ivy@example.com" })', note: "Brackets use the value of field, so the key is \"email\"." },
        { code: '({ ["title_" + lang]: "Bonjour" })', note: "Any expression can build a computed key." },
      ]}
      ownExpressionStart="({ name, [field]: true })"
    />
  );
}

function DestructuringWidget() {
  return (
    <CodePlayground
      intro="Load an example, run it, then change the names on the left of the = and see what you get."
      examples={[
        {
          label: "Basic",
          code: `const film = { title: "Up", year: 2009, rating: 8.3 };

const { title, year } = film;
console.log(title, year);`,
          lookFor: "Variables are matched to keys by name, not by position.",
        },
        {
          label: "Rename",
          code: `const film = { title: "Up", year: 2009, rating: 8.3 };

const { rating: score } = film;
console.log(score);`,
          lookFor: "key: newName reads rating but calls the variable score.",
        },
        {
          label: "Defaults",
          code: `const film = { title: "Up", year: 2009 };

const { budget = "unknown", year = 2000 } = film;
console.log(budget, year);`,
          lookFor: "Defaults only kick in when the property is missing (undefined).",
        },
        {
          label: "Nested & rest",
          code: `const user = { name: "Ana", age: 31, address: { city: "Oslo", zip: "0150" } };

const { address: { city }, ...others } = user;
console.log(city);
console.log(others);`,
          lookFor: "...others collects every property you didn't unpack.",
        },
        {
          label: "In parameters",
          code: `function describe({ title, year }) {
  return title + " (" + year + ")";
}

console.log(describe({ title: "Up", year: 2009, rating: 8.3 }));`,
          lookFor: "The most common use: a function picks the fields it needs from an object argument.",
        },
      ]}
    />
  );
}

function OptionalChainingWidget() {
  return (
    <ExpressionExplorer
      intro="This data has gaps, like real data from an API. Predict which lines crash."
      setup={`const user = {
  name: "Ana",
  address: null,
  tags: ["admin"],
  greet() { return "Hi, I'm " + this.name; },
};`}
      expressions={[
        { code: "user.address.city", note: "address is null, and null has no properties: crash." },
        { code: "user.address?.city", note: "?. sees null and stops, giving undefined instead of crashing." },
        { code: "user.contact?.email?.work", note: "It stops at the first missing link." },
        { code: 'user.address?.city ?? "Unknown"', note: "?? supplies a fallback when the result is null or undefined." },
        { code: "user.greet?.()", note: "?.() calls a method only if it exists." },
        { code: "user.wave?.()", note: "No wave method, so nothing is called." },
        { code: "user.tags?.[0]", note: "?.[ ] works with brackets too." },
      ]}
      ownExpressionStart="user.tags?.[5] ?? 'no tag'"
    />
  );
}

function SpreadWidget() {
  return (
    <ExpressionExplorer
      intro="Spread copies properties left to right. When two have the same key, the later one wins."
      setup={`const defaults = { theme: "light", fontSize: 14, sound: true };
const mine = { theme: "dark" };`}
      expressions={[
        { code: "({ ...defaults })", note: "A new object with the same properties." },
        { code: "({ ...defaults, ...mine })", note: "mine comes later, so its theme wins." },
        { code: "({ ...mine, ...defaults })", note: "Flipped: now defaults overwrite mine." },
        { code: "({ ...defaults, fontSize: 18 })", note: "Copy, then change one property." },
        { code: "({ ...defaults }) === defaults", note: "A copy is a different object, even though it looks the same." },
      ]}
      ownExpressionStart="({ ...defaults, sound: false, volume: 7 })"
    />
  );
}

function AssignWidget() {
  return (
    <CodePlayground
      intro="Object.assign copies into its first argument. Watch which object changes."
      examples={[
        {
          label: "It changes the target",
          code: `const target = { a: 1 };
const result = Object.assign(target, { b: 2 }, { a: 9 });

console.log(target);
console.log(result === target);`,
          lookFor: "target itself changed, and the return value is target.",
        },
        {
          label: "Safe copy",
          code: `const original = { size: "M", colour: "blue" };
const copy = Object.assign({}, original, { size: "L" });

console.log(original);
console.log(copy);`,
          lookFor: "An empty {} as the target keeps original untouched, like { ...original, size: \"L\" }.",
        },
        {
          label: "Accidental mutation",
          code: `const DEFAULTS = { volume: 5, muted: false };

function settingsFor(userChoices) {
  return Object.assign(DEFAULTS, userChoices); // bug!
}

settingsFor({ volume: 9 });
console.log(DEFAULTS);`,
          lookFor: "The shared DEFAULTS object was overwritten. The fix is Object.assign({}, DEFAULTS, userChoices).",
        },
      ]}
    />
  );
}

function CheckingPropertiesWidget() {
  return (
    <ExpressionExplorer
      intro="Three ways to ask “is it there?”. They disagree in the tricky cases."
      setup={`const user = { name: "Ana", nickname: undefined, score: 0 };`}
      expressions={[
        { code: '"name" in user', note: "The key exists." },
        { code: '"email" in user', note: "No such key." },
        { code: "user.nickname === undefined", note: "True… but the key does exist." },
        { code: '"nickname" in user', note: "in can tell a missing key from a key set to undefined." },
        { code: "Boolean(user.score)", note: "0 is falsy, so if (user.score) would wrongly skip a real score." },
        { code: '"toString" in user', note: "in also sees properties inherited from Object.prototype." },
        { code: 'Object.hasOwn(user, "toString")', note: "hasOwn only counts the object's own keys." },
        { code: 'Object.hasOwn(user, "score")', note: "score is user's own key, even though its value is 0." },
      ]}
      ownExpressionStart='Object.hasOwn(user, "nickname")'
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const PART_BEHAVIOUR = "Part 1 · Behaviour & data";
const PART_SYNTAX = "Part 2 · Modern syntax";

const methodsAndThis: Stage = {
  id: "mid-methods",
  level: "mid",
  part: PART_BEHAVIOUR,
  title: "Object methods and this",
  short: "Methods & this",
  lead: (
    <>
      A function stored in a property is a <b>method</b>. Inside a method,{" "}
      <code>this</code> means &quot;the object the method was called on&quot;,
      the one before the dot.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🤖">
        Robots wearing name badges. Tell any robot &quot;introduce yourself&quot;
        and it reads <b>its own</b> badge. The instruction is the same; the
        badge (<code>this</code>) depends on which robot you asked.
      </Analogy>
      <p>Objects can hold behaviour as well as data:</p>
      <CodeBlock
        code={`const counter = {
  count: 0,
  increment() {               // method shorthand
    this.count = this.count + 1;
    return this.count;
  },
};

counter.increment();   // 1
counter.increment();   // 2
counter.count          // 2`}
      />
      <p>
        <b>Why <code>this</code> and not <code>counter.count</code>?</b> Because{" "}
        <code>this</code> follows whichever object makes the call. The same
        function can serve many objects:
      </p>
      <CodeBlock
        code={`function speak() {
  return this.name + " says " + this.sound;
}

const dog = { name: "Rex", sound: "Woof", speak };
const cat = { name: "Tom", sound: "Meow", speak };

dog.speak()   // "Rex says Woof"
cat.speak()   // "Tom says Meow"`}
      />
      <p>
        The rule: <code>this</code> is decided <b>when the method is called</b>
        , by what&apos;s before the dot.
      </p>
      <Tip>
        ⚠️ Two traps. <b>Arrow functions</b> don&apos;t get their own{" "}
        <code>this</code>, so <code>{"{ speak: () => this.name }"}</code> won&apos;t
        see the object. Use method syntax <code>{"speak() { … }"}</code>. And{" "}
        <b>detaching</b> a method loses <code>this</code>:{" "}
        <code>const talk = dog.speak; talk();</code> has no object before the
        dot.
      </Tip>
    </>
  ),
  widget: { title: "Who is this?", Component: MethodsWidget },
  quiz: [
    {
      question: (
        <>
          When you call <code>dog.speak()</code>, what is <code>this</code>{" "}
          inside <code>speak</code>?
        </>
      ),
      options: ["The speak function", "dog", "The global object", "Whatever object was created last"],
      answerIndex: 1,
      explanation: "this is the object before the dot at the moment of the call.",
    },
    {
      question: (
        <>
          What&apos;s wrong with{" "}
          <code>{'const ivy = { name: "Ivy", hi: () => "Hi " + this.name };'}</code>?
        </>
      ),
      options: [
        "Nothing; it returns \"Hi Ivy\"",
        "Arrow functions don't get their own this, so this isn't ivy",
        "Methods can't return strings",
        "name must be in quotes",
      ],
      answerIndex: 1,
      explanation: "An arrow function borrows this from the surrounding code. Write hi() { … } instead.",
    },
    {
      question: (
        <>
          What does <code>counter.increment</code> (no parentheses) do?
        </>
      ),
      options: [
        "Adds 1 to count",
        "Gives back the function itself without running it",
        "Throws an error",
        "Returns count",
      ],
      answerIndex: 1,
      explanation: "Parentheses run a function. Without them you just get a reference to it.",
    },
  ],
  exercise: {
    task: (
      <>
        Finish the <code>account</code> object. Both methods must use{" "}
        <code>this</code>:
        <ol>
          <li>
            <code>deposit(amount)</code>: adds to <code>balance</code> and
            returns the new balance
          </li>
          <li>
            <code>withdraw(amount)</code>: takes money out only if there&apos;s
            enough; either way, returns the balance
          </li>
        </ol>
      </>
    ),
    starter: `const account = {\n  owner: "Jo",\n  balance: 100,\n\n  deposit(amount) {\n    // add amount to this account's balance, return the new balance\n  },\n\n  withdraw(amount) {\n    // only subtract if there's enough money, then return the balance\n  },\n};\n\nconsole.log(account.deposit(50));\nconsole.log(account.withdraw(1000));`,
    // The learner's own console.log lines already deposited money, so start the balance afresh.
    extract: `(() => {
      account.balance = 100;
      const d = account.deposit(50);
      const w1 = account.withdraw(30);
      const w2 = account.withdraw(1000);
      const other = { owner: "Max", balance: 10, deposit: account.deposit, withdraw: account.withdraw };
      return { d, w1, w2, balance: account.balance, otherDeposit: other.deposit(5), otherWithdraw: other.withdraw(100) };
    })()`,
    tests: (values) => [
      check(values.d === 150, "deposit(50) on 100 → 150"),
      check(values.w1 === 120, "withdraw(30) → 120"),
      check(values.w2 === 120 && values.balance === 120, "withdraw(1000) is refused and returns 120"),
      check(
        values.otherDeposit === 15 && values.otherWithdraw === 15,
        "the methods work on any object they're attached to (they use this)"
      ),
    ],
    hint: (
      <>
        <code>this.balance = this.balance + amount; return this.balance;</code>{" "}
        and in withdraw:{" "}
        <code>{"if (amount <= this.balance) { this.balance = this.balance - amount; }"}</code>
      </>
    ),
    solution: `const account = {\n  owner: "Jo",\n  balance: 100,\n\n  deposit(amount) {\n    this.balance = this.balance + amount;\n    return this.balance;\n  },\n\n  withdraw(amount) {\n    if (amount <= this.balance) {\n      this.balance = this.balance - amount;\n    }\n    return this.balance;\n  },\n};\n\nconsole.log(account.deposit(50));\nconsole.log(account.withdraw(1000));`,
  },
};

const keysValuesEntries: Stage = {
  id: "mid-entries",
  level: "mid",
  part: PART_BEHAVIOUR,
  title: "Object.keys(), Object.values() and Object.entries()",
  short: "keys, values, entries",
  lead: (
    <>
      Three built-in helpers turn an object into an <b>array</b>: of its keys,
      its values, or <code>[key, value]</code> pairs. Then every array tool
      you know works on objects too.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📋">
        Taking an <b>inventory</b> of a cabinet. You can list just the drawer
        labels, just what&apos;s inside each drawer, or both side by side.
      </Analogy>
      <CodeBlock
        code={`const scores = { ana: 82, ben: 95, cy: 67 };

Object.keys(scores)     // ["ana", "ben", "cy"]
Object.values(scores)   // [82, 95, 67]
Object.entries(scores)  // [["ana", 82], ["ben", 95], ["cy", 67]]

Object.keys(scores).length   // 3, the way to count properties`}
      />
      <p>
        <b>Why bother when there&apos;s for...in?</b> Because once you have an
        array you can <code>filter</code>, <code>map</code>, <code>sort</code>{" "}
        and use <code>for...of</code> with destructuring:
      </p>
      <CodeBlock
        code={`for (const [name, score] of Object.entries(scores)) {
  console.log(name + " scored " + score);
}

const highScorers = Object.keys(scores).filter((name) => scores[name] >= 80);
// ["ana", "ben"]

// Object.fromEntries turns pairs back into an object
const boosted = Object.fromEntries(
  Object.entries(scores).map(([name, score]) => [name, score + 5])
);
// { ana: 87, ben: 100, cy: 72 }`}
      />
      <Tip>
        ⚠️ They&apos;re called on <code>Object</code>, with your object passed
        in: <code>Object.keys(scores)</code>, not <code>scores.keys()</code>{" "}
        (that throws <i>scores.keys is not a function</i>). And{" "}
        <code>scores.length</code> is <code>undefined</code>: only arrays have a
        length.
      </Tip>
    </>
  ),
  widget: { title: "Object to array", Component: KeysValuesEntriesWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"Object.values({ a: 1, b: 2 })"}</code> gives…
        </>
      ),
      options: ['["a", "b"]', "[1, 2]", '[["a", 1], ["b", 2]]', "3"],
      answerIndex: 1,
      explanation: "values gives the contents, in order.",
    },
    {
      question: "How do you count the properties of an object called item?",
      options: ["item.length", "item.count()", "Object.keys(item).length", "length(item)"],
      answerIndex: 2,
      explanation: "Plain objects have no length; turn the keys into an array and count that.",
    },
    {
      question: (
        <>
          In <code>{"for (const [k, v] of Object.entries(obj))"}</code>, what is{" "}
          <code>v</code>?
        </>
      ),
      options: ["The key", "The value", "The index", "The pair"],
      answerIndex: 1,
      explanation: "Each entry is a [key, value] pair; destructuring names the two parts k and v.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>summarise(scores)</code> returning{" "}
        <code>{"{ count, total, top }"}</code>: how many people, the sum of the
        scores, and the <b>name</b> with the highest score (the first one if
        there&apos;s a tie). For an empty object, return{" "}
        <code>{"{ count: 0, total: 0, top: null }"}</code>. Use{" "}
        <code>Object.keys</code>, <code>Object.values</code> or{" "}
        <code>Object.entries</code>.
      </>
    ),
    starter: `function summarise(scores) {\n  let total = 0;\n  let top = null;\n\n  // tip: Object.entries gives you each [name, score] pair\n\n  return { count: 0, total: total, top: top };\n}\n\nconsole.log(summarise({ ana: 82, ben: 95, cy: 67 }));`,
    extract: `({
      a: summarise({ ana: 82, ben: 95, cy: 67 }),
      b: summarise({}),
      c: summarise({ x: 50, y: 70, z: 70 }),
      d: summarise({ solo: 0 }),
    })`,
    tests: (values, code) => [
      check(isSameValue(values.a, { count: 3, total: 244, top: "ben" }), '{ ana: 82, ben: 95, cy: 67 } → { count: 3, total: 244, top: "ben" }'),
      check(isSameValue(values.b, { count: 0, total: 0, top: null }), "{} → { count: 0, total: 0, top: null }"),
      check(isSameValue(values.c, { count: 3, total: 190, top: "y" }), 'a tie on 70 → top is "y", the first one'),
      check(isSameValue(values.d, { count: 1, total: 0, top: "solo" }), '{ solo: 0 } → top is "solo" even with a score of 0'),
      check(/Object\s*\.\s*(keys|values|entries)/.test(code), "you used Object.keys, values or entries"),
    ],
    hint: (
      <>
        <code>count</code> is <code>Object.keys(scores).length</code>. Then loop{" "}
        <code>{"for (const [name, score] of Object.entries(scores))"}</code>, add
        to total, and replace <code>top</code> when{" "}
        <code>top === null || score {">"} scores[top]</code>.
      </>
    ),
    solution: `function summarise(scores) {\n  let total = 0;\n  let top = null;\n\n  for (const [name, score] of Object.entries(scores)) {\n    total = total + score;\n    if (top === null || score > scores[top]) {\n      top = name;\n    }\n  }\n\n  return { count: Object.keys(scores).length, total: total, top: top };\n}\n\nconsole.log(summarise({ ana: 82, ben: 95, cy: 67 }));`,
  },
};

const shorthandAndComputed: Stage = {
  id: "mid-shorthand",
  level: "mid",
  part: PART_BEHAVIOUR,
  title: "Property shorthand and computed property names",
  short: "Shorthand & computed keys",
  lead: (
    <>
      Two shortcuts for writing objects. <b>Shorthand</b>: when a variable
      already has the right name, write it once. <b>Computed keys</b>: put an
      expression in <code>[brackets]</code> when the key is only known while
      the code runs.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🏷️">
        Shorthand is a form that says &quot;Name: (same as your name)&quot;: no
        need to write it twice. A computed key is a <b>label maker</b>: you type
        whatever label you need at the time, then stick it on.
      </Analogy>
      <CodeBlock
        code={`const name = "Ivy";
const age = 30;

const long  = { name: name, age: age };
const short = { name, age };          // exactly the same object

// You've already been using method shorthand:
const greeter = { hello() { return "hi"; } };   // same as hello: function () {…}`}
      />
      <p>
        Shorthand shines when a function builds and returns an object:
      </p>
      <CodeBlock
        code={`function makeUser(name, age) {
  return { name, age, createdAt: "today" };
}`}
      />
      <p>Computed keys let a variable decide the key:</p>
      <CodeBlock
        code={`const field = "email";
const form = { [field]: "ivy@example.com" };   // { email: "ivy@example.com" }

const lang = "fr";
const labels = { ["title_" + lang]: "Bonjour" }; // { title_fr: "Bonjour" }`}
      />
      <Tip>
        ⚠️ Without the brackets, the key is the <b>word</b> you typed:{" "}
        <code>{'{ field: "x" }'}</code> makes a key called{" "}
        <code>&quot;field&quot;</code>. And shorthand needs a variable with that
        exact name to exist, otherwise you get a ReferenceError.
      </Tip>
    </>
  ),
  widget: { title: "Build it the short way", Component: ShorthandWidget },
  quiz: [
    {
      question: (
        <>
          With <code>const city = &quot;Oslo&quot;;</code>, what is{" "}
          <code>{"{ city }"}</code>?
        </>
      ),
      options: ['{ city: "city" }', '{ city: "Oslo" }', '{ Oslo: "Oslo" }', "A syntax error"],
      answerIndex: 1,
      explanation: "Shorthand uses the variable's name as the key and its value as the value.",
    },
    {
      question: (
        <>
          With <code>const k = &quot;size&quot;;</code>, which builds{" "}
          <code>{'{ size: "M" }'}</code>?
        </>
      ),
      options: ['{ k: "M" }', '{ "k": "M" }', '{ [k]: "M" }', '{ k = "M" }'],
      answerIndex: 2,
      explanation: "Square brackets around the key mean \"use the value of k\".",
    },
    {
      question: (
        <>
          What does <code>{"{ total }"}</code> do if there&apos;s no variable
          called <code>total</code>?
        </>
      ),
      options: [
        "Makes { total: undefined }",
        'Makes { total: "total" }',
        "Throws a ReferenceError",
        "Makes an empty object",
      ],
      answerIndex: 2,
      explanation: "Shorthand reads the variable, and reading a variable that doesn't exist is an error.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>makeProduct(name, price, extraKey, extraValue)</code>. It
        returns an object with <code>name</code> and <code>price</code>{" "}
        (using <b>shorthand</b>) plus one more property whose key is whatever{" "}
        <code>extraKey</code> holds (using a <b>computed key</b>).
      </>
    ),
    starter: `function makeProduct(name, price, extraKey, extraValue) {\n  // return one object: shorthand for name and price,\n  // a computed key for the extra property\n}\n\nconsole.log(makeProduct("Lamp", 25, "colour", "green"));`,
    extract: `({
      a: makeProduct("Lamp", 25, "colour", "green"),
      b: makeProduct("Desk", 120, "inStock", false),
    })`,
    tests: (values, code) => [
      check(isSameValue(values.a, { name: "Lamp", price: 25, colour: "green" }), 'makeProduct("Lamp", 25, "colour", "green") → { name: "Lamp", price: 25, colour: "green" }'),
      check(isSameValue(values.b, { name: "Desk", price: 120, inStock: false }), "works for any extra key, e.g. inStock: false"),
      check(!/name\s*:\s*name/.test(code) && !/price\s*:\s*price/.test(code), "you used shorthand (no name: name)"),
      check(/\[\s*extraKey\s*\]\s*:/.test(code), "you used a computed key: [extraKey]"),
    ],
    hint: (
      <>
        It&apos;s one line: <code>{"return { name, price, [extraKey]: extraValue };"}</code>
      </>
    ),
    solution: `function makeProduct(name, price, extraKey, extraValue) {\n  return { name, price, [extraKey]: extraValue };\n}\n\nconsole.log(makeProduct("Lamp", 25, "colour", "green"));`,
  },
};

const destructuring: Stage = {
  id: "mid-destructure",
  level: "mid",
  part: PART_SYNTAX,
  title: "Destructuring objects",
  short: "Destructuring",
  lead: (
    <>
      Destructuring unpacks properties into variables in one line, matching
      them <b>by name</b>. You can rename them, give defaults and unpack nested
      objects.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🧳">
        <b>Unpacking a suitcase.</b> You don&apos;t tip everything out; you
        reach in for the items you want by name and put each one where you need
        it.
      </Analogy>
      <CodeBlock
        code={`const film = { title: "Up", year: 2009, rating: 8.3 };

// without destructuring
const title1 = film.title;
const year1 = film.year;

// with destructuring
const { title, year } = film;          // title = "Up", year = 2009
const { rating: score } = film;        // rename: score = 8.3
const { budget = "unknown" } = film;   // default when the key is missing
const { title: t, ...rest } = film;    // rest = { year: 2009, rating: 8.3 }`}
      />
      <p>Nested objects unpack the same way, following their shape:</p>
      <CodeBlock
        code={`const user = { name: "Ana", address: { city: "Oslo" } };
const { address: { city } } = user;    // city = "Oslo"`}
      />
      <p>
        <b>Where you&apos;ll see it most:</b> function parameters. The function
        says exactly which fields it needs:
      </p>
      <CodeBlock
        code={`function describe({ title, year, rating = 0 }) {
  return title + " (" + year + "), rated " + rating;
}

describe(film);   // "Up (2009), rated 8.3"`}
      />
      <Tip>
        ⚠️ Names must match the keys exactly: <code>{"const { Title } = film"}</code>{" "}
        gives <code>undefined</code>. And destructuring <code>undefined</code>{" "}
        or <code>null</code> throws a TypeError, so give parameters a default
        when the whole object might be missing:{" "}
        <code>{"function f({ a } = {})"}</code>.
      </Tip>
    </>
  ),
  widget: { title: "Destructuring playground", Component: DestructuringWidget },
  quiz: [
    {
      question: (
        <>
          <code>{'const { b } = { a: 1, b: 2 };'}</code> What is <code>b</code>?
        </>
      ),
      options: ["1", "2", "undefined", '{ b: 2 }'],
      answerIndex: 1,
      explanation: "Object destructuring matches by name, not position.",
    },
    {
      question: (
        <>
          What does <code>{"const { name: label } = item;"}</code> do?
        </>
      ),
      options: [
        "Creates a variable called name",
        "Reads item.label into name",
        "Reads item.name into a variable called label",
        "Renames the property inside item",
      ],
      answerIndex: 2,
      explanation: "key: newName reads that key but stores it in a variable with a different name. item is unchanged.",
    },
    {
      question: (
        <>
          <code>{'const { size = "M" } = { size: "XL" };'}</code> What is{" "}
          <code>size</code>?
        </>
      ),
      options: ['"M"', '"XL"', "undefined", "An error"],
      answerIndex: 1,
      explanation: "Defaults are only used when the property is missing. Here it exists.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>formatOrder(order)</code> using <b>destructuring</b> (in the
        parameter or the first line). Orders have <code>id</code>,{" "}
        <code>item</code>, <code>qty</code> and sometimes <code>currency</code>
        ; when currency is missing, use <code>&quot;GBP&quot;</code>. Return
        text like <code>&quot;#7: 2 x Tea (GBP)&quot;</code>.
      </>
    ),
    starter: `function formatOrder(order) {\n  // destructure id, item, qty and currency (default "GBP")\n\n  return "";\n}\n\nconsole.log(formatOrder({ id: 7, item: "Tea", qty: 2 }));\nconsole.log(formatOrder({ id: 8, item: "Cake", qty: 1, currency: "EUR" }));`,
    extract: `({
      a: formatOrder({ id: 7, item: "Tea", qty: 2 }),
      b: formatOrder({ id: 8, item: "Cake", qty: 1, currency: "EUR" }),
      c: formatOrder({ qty: 3, currency: "USD", item: "Bagel", id: 12 }),
    })`,
    tests: (values, code) => [
      check(values.a === "#7: 2 x Tea (GBP)", '{ id: 7, item: "Tea", qty: 2 } → "#7: 2 x Tea (GBP)"'),
      check(values.b === "#8: 1 x Cake (EUR)", 'a given currency is used → "#8: 1 x Cake (EUR)"'),
      check(values.c === "#12: 3 x Bagel (USD)", "key order in the object doesn't matter"),
      check(/(const|let)\s*\{[^}]*\}\s*=|\(\s*\{[^}]*\}\s*\)/.test(code), "you used destructuring"),
    ],
    hint: (
      <>
        <code>{'const { id, item, qty, currency = "GBP" } = order;'}</code> then{" "}
        <code>{'return "#" + id + ": " + qty + " x " + item + " (" + currency + ")";'}</code>
      </>
    ),
    solution: `function formatOrder({ id, item, qty, currency = "GBP" }) {\n  return "#" + id + ": " + qty + " x " + item + " (" + currency + ")";\n}\n\nconsole.log(formatOrder({ id: 7, item: "Tea", qty: 2 }));\nconsole.log(formatOrder({ id: 8, item: "Cake", qty: 1, currency: "EUR" }));`,
  },
};

const optionalChaining: Stage = {
  id: "mid-optional",
  level: "mid",
  part: PART_SYNTAX,
  title: "Optional chaining",
  short: "Optional chaining ?.",
  lead: (
    <>
      <code>?.</code> reads a property only if the thing before it exists. If
      it&apos;s <code>null</code> or <code>undefined</code>, the expression
      stops and gives <code>undefined</code> instead of crashing.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📬">
        Reaching into a <b>mailbox</b>: first check there&apos;s a mailbox at
        all. If the house has none, you don&apos;t stick your hand into thin
        air; you just come back with nothing.
      </Analogy>
      <p>Remember the crash from nested objects?</p>
      <CodeBlock
        code={`const user = { name: "Ana", address: null };

user.address.city       // ❌ TypeError: Cannot read properties of null
user.address?.city      // undefined ✓ (stops safely at address)

user.profile?.avatar?.url  // undefined: stops at the first missing link
user.getAge?.()            // calls the method only if it exists
user.tags?.[0]             // brackets work too`}
      />
      <p>
        Pair it with <code>??</code> (the <b>nullish coalescing</b> operator)
        to supply a fallback when the result is <code>null</code> or{" "}
        <code>undefined</code>:
      </p>
      <CodeBlock
        code={`const city = user.address?.city ?? "Unknown";   // "Unknown"

// ?? vs ||: || also replaces 0, "" and false
const lives = 0;
lives || 3    // 3  ← probably a bug, 0 is a real value
lives ?? 3    // 0  ✓`}
      />
      <Tip>
        💡 Use <code>?.</code> where data can <b>genuinely</b> be missing (an
        optional field, an API response). Sprinkling it everywhere hides real
        bugs: if <code>user</code> should always exist, you want to hear about
        it when it doesn&apos;t. Also, <code>?.</code> only reads; you can&apos;t
        assign with it.
      </Tip>
    </>
  ),
  widget: { title: "Crash or undefined?", Component: OptionalChainingWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"const u = { address: undefined };"}</code> What is{" "}
          <code>u.address?.city</code>?
        </>
      ),
      options: ["A TypeError", "undefined", "null", '""'],
      answerIndex: 1,
      explanation: "?. sees that address is undefined and stops, giving undefined.",
    },
    {
      question: (
        <>
          What does <code>{'settings.volume ?? 5'}</code> give when{" "}
          <code>settings.volume</code> is <code>0</code>?
        </>
      ),
      options: ["5", "0", "undefined", "false"],
      answerIndex: 1,
      explanation: "?? only steps in for null or undefined. 0 is a real value, so it's kept.",
    },
    {
      question: (
        <>
          How do you call <code>user.onSave</code> only if it exists?
        </>
      ),
      options: ["user.onSave()?", "user?.onSave()", "user.onSave?.()", "user.onSave()??"],
      answerIndex: 2,
      explanation: "?.() checks the function itself before calling it. user?.onSave() only checks user.",
    },
  ],
  exercise: {
    task: (
      <>
        Write two safe readers using <code>?.</code> and <code>??</code>. They
        must never crash, even if <code>user</code> itself is{" "}
        <code>undefined</code>:
        <ol>
          <li>
            <code>getCity(user)</code>: the user&apos;s{" "}
            <code>address.city</code>, or <code>&quot;Unknown&quot;</code>
          </li>
          <li>
            <code>firstTag(user)</code>: the first item of{" "}
            <code>user.tags</code>, or <code>&quot;none&quot;</code>
          </li>
        </ol>
      </>
    ),
    starter: `function getCity(user) {\n  return user.address.city;   // crashes when parts are missing!\n}\n\nfunction firstTag(user) {\n  return user.tags[0];\n}\n\nconsole.log(getCity({ address: { city: "Oslo" } }));\nconsole.log(getCity({ name: "Bo" }));`,
    extract: `({
      c1: getCity({ address: { city: "Oslo" } }),
      c2: getCity({ name: "Bo" }),
      c3: getCity({ address: null }),
      c4: getCity(undefined),
      t1: firstTag({ tags: ["admin", "beta"] }),
      t2: firstTag({ tags: [] }),
      t3: firstTag({}),
      t4: firstTag(undefined),
    })`,
    tests: (values, code) => [
      check(values.c1 === "Oslo", 'getCity with a city → "Oslo"'),
      check(values.c2 === "Unknown" && values.c3 === "Unknown", 'no address, or address: null → "Unknown"'),
      check(values.c4 === "Unknown", 'getCity(undefined) → "Unknown"'),
      check(values.t1 === "admin", 'firstTag with tags → "admin"'),
      check(values.t2 === "none" && values.t3 === "none" && values.t4 === "none", 'empty tags, no tags or no user → "none"'),
      check(/\?\./.test(code) && /\?\?/.test(code), "you used ?. and ??"),
    ],
    hint: (
      <>
        <code>{'return user?.address?.city ?? "Unknown";'}</code> and{" "}
        <code>{'return user?.tags?.[0] ?? "none";'}</code>
      </>
    ),
    solution: `function getCity(user) {\n  return user?.address?.city ?? "Unknown";\n}\n\nfunction firstTag(user) {\n  return user?.tags?.[0] ?? "none";\n}\n\nconsole.log(getCity({ address: { city: "Oslo" } }));\nconsole.log(getCity({ name: "Bo" }));`,
  },
};

const spreadOperator: Stage = {
  id: "mid-spread",
  level: "mid",
  part: PART_SYNTAX,
  title: "The spread operator",
  short: "Spread ...",
  lead: (
    <>
      <code>...obj</code> inside <code>{"{ }"}</code> copies all of{" "}
      <code>obj</code>&apos;s properties into a <b>new</b> object. It&apos;s
      how you copy, merge and update objects without changing the original.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🗒️">
        Copying a recipe onto a <b>fresh card</b>, then adding your own tweaks.
        The original card in the book stays exactly as it was.
      </Analogy>
      <CodeBlock
        code={`const base = { size: "M", colour: "blue" };

const copy = { ...base };                 // new object, same properties
const bigger = { ...base, size: "L" };    // copy, then override size
const priced = { ...base, price: 20 };    // copy, then add

console.log(base);   // { size: "M", colour: "blue" }, untouched`}
      />
      <p>
        Properties are copied <b>left to right</b>, and a later property with
        the same key overwrites an earlier one. That makes merging settings
        easy:
      </p>
      <CodeBlock
        code={`const defaults = { theme: "light", fontSize: 14 };
const mine = { theme: "dark" };

const settings = { ...defaults, ...mine };   // { theme: "dark", fontSize: 14 }
const wrong    = { ...mine, ...defaults };   // { theme: "light", fontSize: 14 }`}
      />
      <p>
        <b>Why not just change the object?</b> Lots of code (including React)
        relies on spotting changes by checking whether it&apos;s a{" "}
        <i>new</i> object. Making an updated copy keeps the old version safe
        and the change easy to see.
      </p>
      <Tip>
        ⚠️ Spread copies only the <b>top level</b>. Nested objects inside are
        still shared between the copy and the original. You&apos;ll see why,
        and how to deal with it, in the advanced section.
      </Tip>
    </>
  ),
  widget: { title: "Merge order", Component: SpreadWidget },
  quiz: [
    {
      question: (
        <>
          <code>{'{ ...{ a: 1, b: 2 }, b: 5 }'}</code> gives…
        </>
      ),
      options: ["{ a: 1, b: 2 }", "{ a: 1, b: 5 }", "{ a: 1, b: 2, b: 5 }", "{ b: 5 }"],
      answerIndex: 1,
      explanation: "The later b overwrites the copied one.",
    },
    {
      question: (
        <>
          After <code>{"const copy = { ...original }; copy.x = 9;"}</code>, does{" "}
          <code>original.x</code> change?
        </>
      ),
      options: [
        "Yes, they're the same object",
        "No, copy is a new object",
        "Only if x already existed",
        "It throws an error",
      ],
      answerIndex: 1,
      explanation: "Spread creates a new object, so changing a top-level property of the copy leaves the original alone.",
    },
    {
      question: "Which keeps the user's choices when merging with defaults?",
      options: [
        "{ ...user, ...defaults }",
        "{ ...defaults, ...user }",
        "{ defaults, user }",
        "{ ...defaults + user }",
      ],
      answerIndex: 1,
      explanation: "Spread the defaults first, then the user's choices so they overwrite.",
    },
  ],
  exercise: {
    task: (
      <>
        Use spread to write two functions that <b>never change</b> their
        arguments:
        <ol>
          <li>
            <code>applySettings(defaults, overrides)</code>: a new object with
            the overrides winning
          </li>
          <li>
            <code>withPrice(product, newPrice)</code>: a new product with{" "}
            <code>price</code> set to <code>newPrice</code>
          </li>
        </ol>
      </>
    ),
    starter: `function applySettings(defaults, overrides) {\n\n}\n\nfunction withPrice(product, newPrice) {\n\n}\n\nconst lamp = { name: "Lamp", price: 25 };\nconsole.log(withPrice(lamp, 30), lamp);`,
    extract: `(() => {
      const defaults = { theme: "light", fontSize: 14, sound: true };
      const overrides = { theme: "dark", sound: false };
      const lamp = { name: "Lamp", price: 25, colour: "green" };
      const settings = applySettings(defaults, overrides);
      const cheaper = withPrice(lamp, 20);
      return {
        settings,
        cheaper,
        defaultsUntouched: JSON.stringify(defaults) === JSON.stringify({ theme: "light", fontSize: 14, sound: true }),
        lampUntouched: lamp.price === 25,
        newObjects: settings !== defaults && settings !== overrides && cheaper !== lamp,
      };
    })()`,
    tests: (values, code) => [
      check(isSameValue(values.settings, { theme: "dark", fontSize: 14, sound: false }), "applySettings → overrides win, other defaults kept"),
      check(isSameValue(values.cheaper, { name: "Lamp", price: 20, colour: "green" }), "withPrice(lamp, 20) → same product, price 20"),
      check(values.defaultsUntouched === true && values.lampUntouched === true, "the original objects were not changed"),
      check(values.newObjects === true, "both functions return brand-new objects"),
      check(/\.\.\./.test(code), "you used spread (...)"),
    ],
    hint: (
      <>
        <code>{"return { ...defaults, ...overrides };"}</code> and{" "}
        <code>{"return { ...product, price: newPrice };"}</code>
      </>
    ),
    solution: `function applySettings(defaults, overrides) {\n  return { ...defaults, ...overrides };\n}\n\nfunction withPrice(product, newPrice) {\n  return { ...product, price: newPrice };\n}\n\nconst lamp = { name: "Lamp", price: 25 };\nconsole.log(withPrice(lamp, 30), lamp);`,
  },
};

const objectAssign: Stage = {
  id: "mid-assign",
  level: "mid",
  part: PART_SYNTAX,
  title: "Object.assign()",
  short: "Object.assign",
  lead: (
    <>
      <code>Object.assign(target, ...sources)</code> copies properties from
      the sources <b>into</b> the target, changing the target and returning
      it. Spread&apos;s older cousin, still handy for updating an object in
      place.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📦">
        Tipping the contents of several boxes into one <b>target box</b>. The
        target box itself fills up; nothing new is made unless you start with
        an empty box.
      </Analogy>
      <CodeBlock
        code={`const target = { a: 1 };
const result = Object.assign(target, { b: 2 }, { a: 9 });

target              // { a: 9, b: 2 }   ← target itself changed
result === target   // true: it hands back the same object

// Start with an empty target to make a copy instead:
const copy = Object.assign({}, original, { size: "L" });
// same result as { ...original, size: "L" }`}
      />
      <p>
        <b>When to use which?</b> Prefer spread for making new objects: it
        reads better. Use <code>Object.assign</code> when you really do want to
        add several properties to an <b>existing</b> object, such as setting
        up an object from options:
      </p>
      <CodeBlock
        code={`const player = { name: "Kai" };
Object.assign(player, { score: 0, lives: 3 });   // player now has all three`}
      />
      <Tip>
        ⚠️ The classic bug: <code>Object.assign(DEFAULTS, choices)</code>{" "}
        overwrites your shared defaults for everyone who uses them later.
        Remember the first argument is the one that changes; pass{" "}
        <code>{"{}"}</code> first when you want a fresh object.
      </Tip>
    </>
  ),
  widget: { title: "Which object changes?", Component: AssignWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"const a = { x: 1 }; Object.assign(a, { y: 2 });"}</code> What
          is <code>a</code> now?
        </>
      ),
      options: ["{ x: 1 }", "{ x: 1, y: 2 }", "{ y: 2 }", "An error, a is const"],
      answerIndex: 1,
      explanation: "a is the target, so the y property is copied into it.",
    },
    {
      question: (
        <>
          Which is the same as <code>{"{ ...obj }"}</code>?
        </>
      ),
      options: ["Object.assign(obj)", "Object.assign(obj, {})", "Object.assign({}, obj)", "Object.copy(obj)"],
      answerIndex: 2,
      explanation: "A fresh {} as the target means obj is copied into a new object.",
    },
    {
      question: "What does Object.assign return?",
      options: ["A new copy of the target", "The target object itself", "undefined", "true or false"],
      answerIndex: 1,
      explanation: "It returns the very same target object it just changed.",
    },
  ],
  exercise: {
    task: (
      <>
        Use <code>Object.assign</code> twice:
        <ol>
          <li>
            <code>configure(options)</code>: returns a <b>new</b> object made
            from <code>DEFAULTS</code> then <code>options</code>.{" "}
            <code>DEFAULTS</code> must never change.
          </li>
          <li>
            <code>upgrade(user)</code>: adds <code>plan: &quot;pro&quot;</code>{" "}
            and <code>credits: 100</code> to the user <b>in place</b> and
            returns that same user.
          </li>
        </ol>
      </>
    ),
    starter: `const DEFAULTS = { volume: 5, muted: false, theme: "light" };\n\nfunction configure(options) {\n\n}\n\nfunction upgrade(user) {\n\n}\n\nconsole.log(configure({ volume: 9 }));\nconsole.log(DEFAULTS);`,
    extract: `(() => {
      const first = configure({ volume: 9 });
      const second = configure({ theme: "dark" });
      const user = { name: "Ivy", plan: "free" };
      const upgraded = upgrade(user);
      return {
        first, second,
        defaults: DEFAULTS,
        sameUser: upgraded === user,
        user,
      };
    })()`,
    tests: (values, code) => [
      check(isSameValue(values.first, { volume: 9, muted: false, theme: "light" }), "configure({ volume: 9 }) → volume 9, other defaults kept"),
      check(isSameValue(values.second, { volume: 5, muted: false, theme: "dark" }), "a second call isn't affected by the first"),
      check(isSameValue(values.defaults, { volume: 5, muted: false, theme: "light" }), "DEFAULTS never changed"),
      check(values.sameUser === true && isSameValue(values.user, { name: "Ivy", plan: "pro", credits: 100 }), "upgrade changes the user itself and returns it"),
      check((code.match(/Object\s*\.\s*assign/g) ?? []).length >= 2, "you used Object.assign in both functions"),
    ],
    hint: (
      <>
        <code>{"return Object.assign({}, DEFAULTS, options);"}</code> and{" "}
        <code>{'return Object.assign(user, { plan: "pro", credits: 100 });'}</code>
      </>
    ),
    solution: `const DEFAULTS = { volume: 5, muted: false, theme: "light" };\n\nfunction configure(options) {\n  return Object.assign({}, DEFAULTS, options);\n}\n\nfunction upgrade(user) {\n  return Object.assign(user, { plan: "pro", credits: 100 });\n}\n\nconsole.log(configure({ volume: 9 }));\nconsole.log(DEFAULTS);`,
  },
};

const checkingProperties: Stage = {
  id: "mid-checking",
  level: "mid",
  part: PART_SYNTAX,
  title: "Checking properties: in and Object.hasOwn",
  short: "in & hasOwn",
  lead: (
    <>
      Sometimes you need to know whether a property is <b>there at all</b>.{" "}
      <code>in</code> checks the key exists (including inherited ones);{" "}
      <code>Object.hasOwn</code> checks the object itself owns it.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🔑">
        Checking your keyring for a <b>key</b> is different from checking
        whether the drawer it opens is empty. A key can exist even when the
        drawer holds nothing.
      </Analogy>
      <CodeBlock
        code={`const user = { name: "Ana", nickname: undefined, score: 0 };

"name" in user                 // true
"email" in user                // false
"nickname" in user             // true  ← exists, even though it's undefined

user.email === undefined       // true
user.nickname === undefined    // true  ← can't tell missing from empty!`}
      />
      <p>
        <b>Inherited properties.</b> Every object quietly inherits a few
        methods (like <code>toString</code>) from <code>Object.prototype</code>
        . <code>in</code> sees those too; <code>Object.hasOwn</code> doesn&apos;t:
      </p>
      <CodeBlock
        code={`"toString" in user                // true, inherited
Object.hasOwn(user, "toString")   // false, not user's own
Object.hasOwn(user, "score")      // true`}
      />
      <p>
        <b>Which to use?</b> For &quot;does this object have its own key
        called X?&quot;, which is most of the time, use{" "}
        <code>Object.hasOwn</code>. Use <code>in</code> when inherited
        properties should count.
      </p>
      <Tip>
        ⚠️ <code>if (user.score)</code> is a tempting shortcut, but a real score
        of <code>0</code> counts as false and gets skipped. Check for the key
        instead. And remember the quotes: <code>name in user</code> uses a{" "}
        <i>variable</i> called <code>name</code>.
      </Tip>
    </>
  ),
  widget: { title: "Is it there?", Component: CheckingPropertiesWidget },
  quiz: [
    {
      question: (
        <>
          <code>{'const o = { a: undefined };'}</code> What is{" "}
          <code>&quot;a&quot; in o</code>?
        </>
      ),
      options: ["true", "false", "undefined", "An error"],
      answerIndex: 0,
      explanation: "The key a exists; its value just happens to be undefined.",
    },
    {
      question: (
        <>
          What is <code>Object.hasOwn({"{}"}, &quot;toString&quot;)</code>?
        </>
      ),
      options: ["true", "false", "undefined", "An error"],
      answerIndex: 1,
      explanation: "toString is inherited, not the object's own property.",
    },
    {
      question: (
        <>
          Why can <code>{"if (user.score) { … }"}</code> be a bug?
        </>
      ),
      options: [
        "if can't read properties",
        "A score of 0 counts as false, so a real score is treated as missing",
        "It changes user.score",
        "It's always true",
      ],
      answerIndex: 1,
      explanation: "0, \"\" and false all count as false in an if. Check whether the key exists instead.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>describeField(obj, key)</code> that returns:
        <ol>
          <li>
            <code>&quot;missing&quot;</code> if <code>obj</code> doesn&apos;t{" "}
            <b>own</b> that key (inherited keys count as missing)
          </li>
          <li>
            <code>&quot;empty&quot;</code> if it owns the key but the value is{" "}
            <code>undefined</code> or <code>null</code>
          </li>
          <li>
            <code>&quot;set&quot;</code> otherwise, including values like{" "}
            <code>0</code>, <code>&quot;&quot;</code> and <code>false</code>
          </li>
        </ol>
      </>
    ),
    starter: `function describeField(obj, key) {\n\n}\n\nconst user = { name: "Ana", nickname: null, score: 0 };\nconsole.log(describeField(user, "score"));`,
    extract: `(() => {
      const user = { name: "Ana", nickname: null, score: 0, bio: "", middle: undefined, active: false };
      return {
        name: describeField(user, "name"),
        nickname: describeField(user, "nickname"),
        middle: describeField(user, "middle"),
        score: describeField(user, "score"),
        bio: describeField(user, "bio"),
        active: describeField(user, "active"),
        email: describeField(user, "email"),
        toStringResult: describeField(user, "toString"),
      };
    })()`,
    tests: (values) => [
      check(values.name === "set", 'name: "Ana" → "set"'),
      check(values.nickname === "empty" && values.middle === "empty", 'null and undefined values → "empty"'),
      check(values.score === "set" && values.bio === "set" && values.active === "set", '0, "" and false → "set"'),
      check(values.email === "missing", 'a key that isn\'t there → "missing"'),
      check(values.toStringResult === "missing", 'the inherited toString → "missing"'),
    ],
    hint: (
      <>
        First <code>{'if (!Object.hasOwn(obj, key)) return "missing";'}</code>,
        then{" "}
        <code>{'if (obj[key] === undefined || obj[key] === null) return "empty";'}</code>
        , otherwise <code>&quot;set&quot;</code>.
      </>
    ),
    solution: `function describeField(obj, key) {\n  if (!Object.hasOwn(obj, key)) {\n    return "missing";\n  }\n  if (obj[key] === undefined || obj[key] === null) {\n    return "empty";\n  }\n  return "set";\n}\n\nconst user = { name: "Ana", nickname: null, score: 0 };\nconsole.log(describeField(user, "score"));`,
  },
};

/** Keeps the two expected fields so learners can build the result in any key order. */
function cleanUpdate(result: unknown) {
  if (!isPlainObject(result)) {
    return result;
  }
  return { profile: result.profile, ignored: result.ignored };
}

const intermediateFinal: Stage = {
  id: "mid-final",
  level: "mid",
  part: PART_SYNTAX,
  title: "Intermediate final: the profile updater",
  short: "Final: profile updater",
  lead: (
    <>
      A settings form sends you a bag of changes. Some are valid fields, some
      are junk. Apply the good ones to a <b>copy</b> of the profile and report
      the rest, without ever touching the original.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`const profile = { name: "Ana", city: "Oslo", newsletter: false };

updateProfile(profile, { city: "Rome", newsletter: true, isAdmin: true });
// {
//   profile: { name: "Ana", city: "Rome", newsletter: true },
//   ignored: ["isAdmin"],      // not a field profile already has
// }

updateProfile(profile, undefined);
// { profile: { name: "Ana", city: "Oslo", newsletter: false }, ignored: [] }`}
      />
      <p>A good plan:</p>
      <ol className="my-4 list-decimal pl-10">
        <li>
          Make a copy with <b>spread</b>: <code>{"let updated = { ...profile };"}</code>
        </li>
        <li>
          Treat missing changes as no changes: <code>{"changes ?? {}"}</code>.
        </li>
        <li>
          Loop over <code>Object.entries</code> of the changes, destructuring
          each pair into <code>[key, value]</code>.
        </li>
        <li>
          If <code>Object.hasOwn(profile, key)</code>, apply it (a{" "}
          <b>computed key</b> works nicely:{" "}
          <code>{"updated = { ...updated, [key]: value };"}</code>). Otherwise
          push the key into <code>ignored</code>.
        </li>
        <li>
          Return <code>{"{ profile: updated, ignored }"}</code> with{" "}
          <b>shorthand</b> where you can.
        </li>
      </ol>
      <PanelHeading className="mt-[22px]">Intermediate cheat sheet</PanelHeading>
      <CheatSheet>
        <Cheat code="method() { this.x }">this = the object before the dot</Cheat>
        <Cheat code="Object.keys / values / entries">object → array</Cheat>
        <Cheat code="Object.fromEntries(pairs)">array of pairs → object</Cheat>
        <Cheat code="{ name, [key]: value }">shorthand / computed key</Cheat>
        <Cheat code="const { a, b: c = 1 } = obj">destructure, rename, default</Cheat>
        <Cheat code="obj?.a?.b ?? fallback">safe read with a fallback</Cheat>
        <Cheat code="{ ...a, ...b }">copy and merge (later wins)</Cheat>
        <Cheat code="Object.assign(target, src)">copy into target (changes it)</Cheat>
        <Cheat code="Object.hasOwn(obj, key)">does obj own this key?</Cheat>
      </CheatSheet>
    </>
  ),
  quiz: [
    {
      question: (
        <>
          Why start with <code>{"{ ...profile }"}</code> instead of changing{" "}
          <code>profile</code> directly?
        </>
      ),
      options: [
        "Spread is faster",
        "So the caller's original profile is never changed",
        "Objects can't be changed",
        "It removes unknown keys",
      ],
      answerIndex: 1,
      explanation: "Working on a copy keeps the original intact, so the caller can still compare before and after.",
    },
    {
      question: (
        <>
          <code>Object.entries(undefined)</code> throws. Which line protects
          against missing changes?
        </>
      ),
      options: [
        "const safe = changes || null;",
        "const safe = changes ?? {};",
        "const safe = { changes };",
        "const safe = changes?.();",
      ],
      answerIndex: 1,
      explanation: "?? swaps undefined or null for an empty object, which has zero entries to loop over.",
    },
    {
      question: (
        <>
          With <code>const key = &quot;city&quot;</code>, what does{" "}
          <code>{'{ ...p, [key]: "Rome" }'}</code> do?
        </>
      ),
      options: [
        'Adds a key called "key"',
        "Copies p and sets city to Rome",
        "Changes p.city",
        "Throws a syntax error",
      ],
      answerIndex: 1,
      explanation: "Spread copies p, then the computed key city overwrites the copied value.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>updateProfile(profile, changes)</code> returning{" "}
        <code>{"{ profile, ignored }"}</code>:
        <ol>
          <li>
            Apply each change whose key the profile <b>already owns</b>.
          </li>
          <li>
            Collect every other key in <code>ignored</code>, in order.
          </li>
          <li>
            If <code>changes</code> is missing, return an unchanged copy and an
            empty <code>ignored</code>.
          </li>
          <li>
            Always return a <b>new</b> profile object; never change the
            original.
          </li>
        </ol>
      </>
    ),
    starter: `function updateProfile(profile, changes) {\n  let updated = { ...profile };\n  const ignored = [];\n\n  // loop over the entries of changes (careful: changes may be undefined)\n\n  return { profile: updated, ignored };\n}\n\nconst profile = { name: "Ana", city: "Oslo", newsletter: false };\nconsole.log(updateProfile(profile, { city: "Rome", isAdmin: true }));\nconsole.log(profile);`,
    extract: `(() => {
      const profile = { name: "Ana", city: "Oslo", newsletter: false };
      const before = JSON.stringify(profile);
      const a = updateProfile(profile, { city: "Rome", newsletter: true, isAdmin: true });
      const b = updateProfile(profile, undefined);
      const c = updateProfile(profile, { hack: 1, toString: "x", name: "Bo" });
      return {
        a, b, c,
        untouched: JSON.stringify(profile) === before,
        freshCopy: b && b.profile !== profile,
      };
    })()`,
    tests: (values) => [
      check(
        isSameValue(cleanUpdate(values.a), {
          profile: { name: "Ana", city: "Rome", newsletter: true },
          ignored: ["isAdmin"],
        }),
        "valid changes applied, isAdmin ignored"
      ),
      check(
        isSameValue(cleanUpdate(values.b), {
          profile: { name: "Ana", city: "Oslo", newsletter: false },
          ignored: [],
        }),
        "changes undefined → unchanged copy, nothing ignored"
      ),
      check(values.freshCopy === true, "the returned profile is a new object"),
      check(
        isSameValue(cleanUpdate(values.c), {
          profile: { name: "Bo", city: "Oslo", newsletter: false },
          ignored: ["hack", "toString"],
        }),
        "inherited keys like toString are ignored too"
      ),
      check(values.untouched === true, "the original profile never changed"),
    ],
    hint: (
      <>
        <code>{"for (const [key, value] of Object.entries(changes ?? {})) {"}</code>{" "}
        then{" "}
        <code>
          {"if (Object.hasOwn(profile, key)) { updated = { ...updated, [key]: value }; } else { ignored.push(key); }"}
        </code>
      </>
    ),
    solution: `function updateProfile(profile, changes) {\n  let updated = { ...profile };\n  const ignored = [];\n\n  for (const [key, value] of Object.entries(changes ?? {})) {\n    if (Object.hasOwn(profile, key)) {\n      updated = { ...updated, [key]: value };\n    } else {\n      ignored.push(key);\n    }\n  }\n\n  return { profile: updated, ignored };\n}\n\nconst profile = { name: "Ana", city: "Oslo", newsletter: false };\nconsole.log(updateProfile(profile, { city: "Rome", isAdmin: true }));\nconsole.log(profile);`,
  },
};

export const OBJECT_INTERMEDIATE_STAGES: Stage[] = [
  methodsAndThis,
  keysValuesEntries,
  shorthandAndComputed,
  destructuring,
  optionalChaining,
  spreadOperator,
  objectAssign,
  checkingProperties,
  intermediateFinal,
];
