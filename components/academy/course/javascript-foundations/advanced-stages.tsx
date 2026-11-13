import type { Stage } from "@/lib/academy/types";
import { isSameValue } from "@/lib/academy/format";
import { Analogy, CodeBlock, Cheat, CheatSheet, PanelHeading, Tip } from "../../content";
import { check } from "../check";
import { CodePlayground } from "../../widgets/code-playground";
import { ExpressionExplorer } from "../../widgets/expression-explorer";
import { TruthySorterWidget } from "../../widgets/truthy-sorter";
import { CallStackWidget } from "../../widgets/call-stack";
import { ClosureCounterWidget } from "../../widgets/closure-counter";
import { EventLoopWidget } from "../../widgets/event-loop";
import { PromiseStatesWidget } from "../../widgets/promise-states";

// ---------------------------------------------------------------------------
// Widgets for this section
// ---------------------------------------------------------------------------

function NullUndefinedWidget() {
  return (
    <ExpressionExplorer
      intro="Where does each one come from? Predict, then reveal."
      setup={`let notSetYet;
const user = { name: "Ana", middleName: null };
function noReturn() {}
function greet(name) { return name; }`}
      expressions={[
        { code: "notSetYet", note: "Declared but never given a value: JavaScript fills in undefined." },
        { code: "user.age", note: "A property that doesn't exist: undefined." },
        { code: "user.middleName", note: "null was put there on purpose: 'there is no middle name'." },
        { code: "noReturn()", note: "A function with no return gives undefined." },
        { code: "greet()", note: "A parameter with no argument is undefined." },
        { code: "typeof null", note: "The old bug again: null reports \"object\"." },
        { code: "null === undefined", note: "Strictly, they're different values." },
        { code: "user.middleName == null", note: "== null is true for both null and undefined, one handy use of ==." },
        { code: 'user.middleName ?? "(none)"', note: "?? replaces null or undefined, and nothing else." },
      ]}
      ownExpressionStart="user.age ?? 0"
    />
  );
}

function EqualityWidget() {
  return (
    <ExpressionExplorer
      intro="Each pair is compared with loose == and strict ===. Guess both before revealing."
      expressions={[
        { code: '[5 == "5", 5 === "5"]', note: "== converts the string to a number first; === sees two types." },
        { code: '[0 == "", 0 === ""]', note: "\"\" becomes 0, so loose equality says yes." },
        { code: '[0 == false, 0 === false]', note: "false becomes 0." },
        { code: '["1" == true, "1" === true]', note: "true becomes 1, then \"1\" becomes 1." },
        { code: "[null == undefined, null === undefined]", note: "A special rule: null and undefined are loosely equal to each other." },
        { code: "[null == 0, null === 0]", note: "…but null isn't loosely equal to 0. Consistent? Not really." },
        { code: "[NaN == NaN, NaN === NaN]", note: "NaN isn't equal to anything, itself included. Use Number.isNaN." },
        { code: '[" \\t " == 0, " \\t " === 0]', note: "Whitespace-only strings become 0 too." },
      ]}
      ownExpressionStart='[[] == false, [] === false]'
    />
  );
}

function HoistingWidget() {
  return (
    <CodePlayground
      intro="Predict whether each program runs, logs undefined, or crashes."
      examples={[
        {
          label: "Function declaration",
          code: `console.log(add(2, 3));

function add(a, b) {
  return a + b;
}`,
          lookFor: "Function declarations are hoisted whole, so you can call them before the line they're written on.",
        },
        {
          label: "var",
          code: `console.log(score);
var score = 10;
console.log(score);`,
          lookFor: "var is hoisted but its value isn't: it's undefined until the assignment line runs.",
        },
        {
          label: "let (TDZ)",
          code: `console.log(level);
let level = 3;`,
          lookFor: "let and const are hoisted too, but using them before their line is an error (the temporal dead zone).",
        },
        {
          label: "Function expression",
          code: `console.log(multiply(2, 3));

const multiply = (a, b) => a * b;`,
          lookFor: "An arrow function in a const follows const's rules, not function-declaration rules.",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const PART_VALUES = "Part 1 · Values & equality";
const PART_ENGINE = "Part 2 · How code runs";
const PART_ASYNC = "Part 3 · Asynchronous code";

const truthyFalsy: Stage = {
  id: "adv-truthy",
  level: "adv",
  part: PART_VALUES,
  title: "Truthy and falsy values",
  short: "Truthy & falsy",
  lead: (
    <>
      When a value is used where JavaScript expects true or false (an{" "}
      <code>if</code>, <code>&amp;&amp;</code>, <code>||</code>), it&apos;s
      treated as <b>truthy</b> or <b>falsy</b>. Only eight values are falsy;
      everything else is truthy.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🚦">
        A <b>bouncer with a very short list</b>. Eight specific values are
        turned away at the door. Everyone else, however odd they look, gets in.
      </Analogy>
      <p>The complete falsy list:</p>
      <CodeBlock
        code={`false
0  and  -0
0n            // the bigint zero
""            // the empty string
null
undefined
NaN`}
      />
      <p>Everything else is truthy, including some surprises:</p>
      <CodeBlock
        code={`if ("0")     // truthy: a non-empty string
if ("false") // truthy: still a non-empty string
if (" ")     // truthy: a space is a character
if ([])      // truthy: every array, even empty
if ({})      // truthy: every object, even empty
if (-1)      // truthy: only zero is falsy`}
      />
      <p>
        <b>Why it matters.</b> Short checks like{" "}
        <code>{"if (name) { … }"}</code> are everywhere: they mean &quot;if name
        has a real value&quot;. And <code>||</code> returns the first truthy
        value, which is a common way to set defaults:
      </p>
      <CodeBlock
        code={`const displayName = nickname || username || "Guest";

// …but beware: 0 and "" are real values that || throws away
const volume = savedVolume || 50;   // savedVolume 0 → 50 😬
const volume = savedVolume ?? 50;   // savedVolume 0 → 0  ✓`}
      />
      <Tip>
        💡 To turn any value into a real boolean, use{" "}
        <code>Boolean(value)</code> (or the shorthand <code>!!value</code>).
        When 0 or <code>&quot;&quot;</code> are valid, don&apos;t test truthiness:
        check for <code>null</code>/<code>undefined</code> instead.
      </Tip>
    </>
  ),
  widget: { title: "Truthy or falsy?", Component: TruthySorterWidget },
  quiz: [
    {
      question: "Which of these is truthy?",
      options: ['""', "0", '"0"', "null"],
      answerIndex: 2,
      explanation: "\"0\" is a non-empty string, so it's truthy. The others are all on the falsy list.",
    },
    {
      question: (
        <>
          What is <code>{'0 || "default"'}</code>?
        </>
      ),
      options: ["0", '"default"', "true", "false"],
      answerIndex: 1,
      explanation: "|| skips the falsy 0 and returns the first truthy value.",
    },
    {
      question: (
        <>
          Does <code>{'if ([]) { console.log("yes") }'}</code> log?
        </>
      ),
      options: ["Yes, every array is truthy", "No, it's empty", "Only in strict mode", "It throws"],
      answerIndex: 0,
      explanation: "Arrays and objects are always truthy. To test for an empty array, check .length.",
    },
  ],
  exercise: {
    task: (
      <>
        <ol>
          <li>
            <code>displayName(user)</code>: return <code>user.nickname</code> if
            it&apos;s truthy, otherwise <code>user.name</code> if truthy,
            otherwise <code>&quot;Anonymous&quot;</code>. Use <code>||</code>.
          </li>
          <li>
            <code>hasValue(x)</code>: <code>true</code> unless <code>x</code>{" "}
            is <code>null</code> or <code>undefined</code>. (So <code>0</code>,{" "}
            <code>&quot;&quot;</code> and <code>false</code> <i>do</i> have values.)
          </li>
        </ol>
      </>
    ),
    starter: `function displayName(user) {\n\n}\n\nfunction hasValue(x) {\n\n}\n\nconsole.log(displayName({ nickname: "", name: "Ada" }), hasValue(0));`,
    extract: `({
      n1: displayName({ nickname: "Ace", name: "Ada" }),
      n2: displayName({ nickname: "", name: "Ada" }),
      n3: displayName({ name: "" }),
      n4: displayName({}),
      v: [hasValue(0), hasValue(""), hasValue(false), hasValue("hi"), hasValue(null), hasValue(undefined)],
    })`,
    tests: (values, code) => [
      check(values.n1 === "Ace", 'a nickname wins → "Ace"'),
      check(values.n2 === "Ada", 'an empty nickname is skipped → "Ada"'),
      check(values.n3 === "Anonymous" && values.n4 === "Anonymous", 'nothing usable → "Anonymous"'),
      check(isSameValue(values.v, [true, true, true, true, false, false]), "hasValue: 0, \"\", false and \"hi\" → true; null and undefined → false"),
      check(/\|\|/.test(code), "you used ||"),
    ],
    hint: (
      <>
        <code>{'return user.nickname || user.name || "Anonymous";'}</code> and{" "}
        <code>return x !== null &amp;&amp; x !== undefined;</code>
      </>
    ),
    solution: `function displayName(user) {\n  return user.nickname || user.name || "Anonymous";\n}\n\nfunction hasValue(x) {\n  return x !== null && x !== undefined;\n}\n\nconsole.log(displayName({ nickname: "", name: "Ada" }), hasValue(0));`,
  },
};

const nullVsUndefined: Stage = {
  id: "adv-null",
  level: "adv",
  part: PART_VALUES,
  title: "The difference between null and undefined",
  short: "null vs undefined",
  lead: (
    <>
      Both mean &quot;no value&quot;, but they say it differently.{" "}
      <code>undefined</code> is JavaScript saying &quot;nothing was ever put
      here&quot;. <code>null</code> is a programmer saying &quot;this is
      deliberately empty&quot;.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📮">
        A <b>form</b> with a &quot;Middle name&quot; box. Left completely untouched,
        it&apos;s <code>undefined</code>: you don&apos;t know if there is one. Someone
        wrote &quot;none&quot; in it: that&apos;s <code>null</code>, an answer that
        says there&apos;s nothing.
      </Analogy>
      <p>
        <b>JavaScript gives you undefined</b> whenever something is missing:
      </p>
      <CodeBlock
        code={`let score;            // declared, never assigned → undefined
user.age              // a property that doesn't exist → undefined
function f() {}
f()                   // no return → undefined
function g(x) { return x; }
g()                   // missing argument → undefined`}
      />
      <p>
        <b>You choose null</b> to say &quot;empty on purpose&quot;, for example
        to clear a value or to mark &quot;no result&quot;:
      </p>
      <CodeBlock
        code={`let selectedItem = null;   // nothing selected yet, and that's expected
function findUser(id) {
  // …searched everywhere, nobody has that id:
  return null;
}`}
      />
      <p>
        <b>Checking for them.</b> Use <code>===</code> to tell them apart, or{" "}
        <code>?? </code> to give a fallback for either. And the one place loose
        equality is commonly used on purpose: <code>x == null</code> is true
        for both.
      </p>
      <CodeBlock
        code={`x === undefined    // only undefined
x === null         // only null
x == null          // either (a deliberate, widely used shortcut)
x ?? "default"     // fallback for either, but keeps 0, "" and false`}
      />
      <Tip>
        💡 A good habit: never assign <code>undefined</code> yourself. Leave
        it to mean &quot;JavaScript hasn&apos;t been given anything&quot;, and use{" "}
        <code>null</code> for every intentional empty. Then each one always
        tells you something specific.
      </Tip>
    </>
  ),
  widget: { title: "Where does it come from?", Component: NullUndefinedWidget },
  quiz: [
    {
      question: (
        <>
          <code>let x;</code> What is <code>x</code>?
        </>
      ),
      options: ["null", "undefined", "0", '""'],
      answerIndex: 1,
      explanation: "A declared variable with no value starts as undefined.",
    },
    {
      question: "Which is the clearest way for a search function to say 'not found'?",
      options: ["return undefined;", "return null;", "return 0;", 'return "";'],
      answerIndex: 1,
      explanation: "null is the deliberate 'no result'. 0 and \"\" could be real results.",
    },
    {
      question: (
        <>
          What is <code>{'0 ?? 5'}</code>?
        </>
      ),
      options: ["0", "5", "null", "undefined"],
      answerIndex: 0,
      explanation: "?? only replaces null and undefined. 0 is a real value, so it's kept.",
    },
  ],
  exercise: {
    task: (
      <>
        <ol>
          <li>
            <code>describe(value)</code>: return <code>&quot;unset&quot;</code>{" "}
            for <code>undefined</code>, <code>&quot;empty&quot;</code> for{" "}
            <code>null</code>, and <code>&quot;value&quot;</code> for anything
            else. Use <code>===</code>.
          </li>
          <li>
            <code>withDefault(value, fallback)</code>: return the fallback only
            when value is <code>null</code> or <code>undefined</code>. Use{" "}
            <code>??</code>.
          </li>
        </ol>
      </>
    ),
    starter: `function describe(value) {\n\n}\n\nfunction withDefault(value, fallback) {\n\n}\n\nconsole.log(describe(null), withDefault(0, 10));`,
    extract: `({
      d: [describe(undefined), describe(null), describe(0), describe(""), describe(false), describe("x")],
      w: [withDefault(undefined, 10), withDefault(null, 10), withDefault(0, 10), withDefault("", "x"), withDefault(false, true), withDefault(7, 10)],
    })`,
    tests: (values, code) => [
      check(isSameValue(values.d, ["unset", "empty", "value", "value", "value", "value"]), 'describe: undefined → "unset", null → "empty", 0/""/false/"x" → "value"'),
      check(isSameValue(values.w, [10, 10, 0, "", false, 7]), "withDefault keeps 0, \"\" and false, and only replaces null/undefined"),
      check(/\?\?/.test(code), "you used ??"),
      check(/===\s*undefined|undefined\s*===/.test(code) && /===\s*null|null\s*===/.test(code), "you used === to check undefined and null"),
    ],
    hint: (
      <>
        <code>{'if (value === undefined) return "unset";'}</code>,{" "}
        <code>{'if (value === null) return "empty";'}</code>, otherwise{" "}
        <code>&quot;value&quot;</code>. Then <code>return value ?? fallback;</code>
      </>
    ),
    solution: `function describe(value) {\n  if (value === undefined) {\n    return "unset";\n  }\n  if (value === null) {\n    return "empty";\n  }\n  return "value";\n}\n\nfunction withDefault(value, fallback) {\n  return value ?? fallback;\n}\n\nconsole.log(describe(null), withDefault(0, 10));`,
  },
};

const looseVsStrictEquality: Stage = {
  id: "adv-equality",
  level: "adv",
  part: PART_VALUES,
  title: "Equality: == vs ===",
  short: "== vs ===",
  lead: (
    <>
      <code>===</code> (strict) compares value <b>and</b> type.{" "}
      <code>==</code> (loose) first converts the two sides to a common type,
      following rules that produce some famous surprises. Use{" "}
      <code>===</code>.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🔍">
        <b>Strict</b> equality is a passport check: same name <i>and</i> same
        nationality. <b>Loose</b> equality is a bouncer who squints:
        &quot;close enough&quot;, after translating your name into the
        local language.
      </Analogy>
      <CodeBlock
        code={`5 === "5"     // false: number vs string
5 == "5"      // true:  "5" is converted to 5 first

0 == ""       // true   ("" becomes 0)
0 == false    // true   (false becomes 0)
"" == false   // true
null == 0     // false  (null only loosely equals undefined)
NaN == NaN    // false  (NaN never equals anything)`}
      />
      <p>
        <b>How == decides</b>, in short: if the types differ, it converts
        booleans and strings to numbers and compares those. Those conversions
        are exactly the coercion rules you met earlier, and they&apos;re why
        a blank form field can &quot;equal&quot; zero.
      </p>
      <p>
        <b>The rule for real code:</b> always use <code>===</code> and{" "}
        <code>!==</code>. If types might differ (form input!), convert{" "}
        <i>explicitly</i> first, then compare strictly:
      </p>
      <CodeBlock
        code={`const answer = "7";            // from a text box
answer == 7                    // true, but for fragile reasons
Number(answer) === 7           // true, and you can see why`}
      />
      <Tip>
        💡 The one well-known exception: <code>value == null</code> is a
        deliberate shortcut for &quot;null or undefined&quot;. Many teams allow
        it; many write <code>value === null || value === undefined</code> to be
        explicit.
      </Tip>
    </>
  ),
  widget: { title: "Loose vs strict", Component: EqualityWidget },
  quiz: [
    {
      question: (
        <>
          What is <code>&quot;10&quot; == 10</code>?
        </>
      ),
      options: ["true", "false", "An error", "undefined"],
      answerIndex: 0,
      explanation: "== converts \"10\" to 10, then compares.",
    },
    {
      question: (
        <>
          What is <code>0 == &quot;&quot;</code>?
        </>
      ),
      options: ["true", "false"],
      answerIndex: 0,
      explanation: "The empty string converts to 0. That's why a blank input can look like zero.",
    },
    {
      question: "A text box gives you the string \"3\". How should you check it equals 3?",
      options: ['input == 3', 'input === 3', 'Number(input) === 3', 'input === "3" == 3'],
      answerIndex: 2,
      explanation: "Convert explicitly, then compare strictly. input === 3 is false because the types differ.",
    },
  ],
  exercise: {
    task: (
      <>
        <code>checkAnswer(answer, expected)</code> marks a quiz answer typed into
        a text box. It uses <code>==</code>, so a <b>blank</b> answer is marked
        correct when the expected number is 0. Rewrite it with{" "}
        <code>===</code> and an explicit conversion, so blank or whitespace-only
        answers are always wrong. Don&apos;t use <code>==</code> anywhere.
      </>
    ),
    starter: `function checkAnswer(answer, expected) {\n  return answer == expected;\n}\n\nconsole.log(checkAnswer("", 0));   // true, but it should be false!`,
    extract: `({
      a: checkAnswer("7", 7),
      b: checkAnswer("0", 0),
      c: checkAnswer("", 0),
      d: checkAnswer("   ", 0),
      e: checkAnswer("8", 7),
      f: checkAnswer("7.0", 7),
      g: checkAnswer("seven", 7),
    })`,
    tests: (values, code) => [
      check(values.a === true && values.b === true, '"7" for 7, and "0" for 0 → true'),
      check(values.f === true, '"7.0" for 7 → true (it is the same number)'),
      check(values.c === false && values.d === false, "blank or whitespace answers → false"),
      check(values.e === false && values.g === false, "wrong or non-numeric answers → false"),
      check(/===/.test(code) && !/[^=!]==[^=]/.test(code), "you used === and no loose =="),
    ],
    hint: (
      <>
        <code>{'if (answer.trim() === "") return false;'}</code> then{" "}
        <code>return Number(answer) === expected;</code>
      </>
    ),
    solution: `function checkAnswer(answer, expected) {\n  if (answer.trim() === "") {\n    return false;\n  }\n  return Number(answer) === expected;\n}\n\nconsole.log(checkAnswer("", 0));   // now false`,
  },
};

const hoisting: Stage = {
  id: "adv-hoisting",
  level: "adv",
  part: PART_ENGINE,
  title: "Hoisting",
  short: "Hoisting",
  lead: (
    <>
      Before running your code, JavaScript scans it and sets up every
      declaration in advance. This is called <b>hoisting</b>, and it explains
      why some things work before the line they&apos;re written on and others
      don&apos;t.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📋">
        Before a meeting, the organiser reads the <b>attendee list</b> and puts
        a name card on every chair. Function declarations arrive early and
        sit down. <code>var</code> names have a card but an empty chair.{" "}
        <code>let</code>/<code>const</code> have a card marked &quot;reserved: do
        not use until they arrive&quot;.
      </Analogy>
      <CodeBlock
        code={`// 1. Function declarations: hoisted completely
sayHi();                         // ✓ "Hi!"
function sayHi() { console.log("Hi!"); }

// 2. var: the name is hoisted, the value isn't
console.log(count);              // undefined (not an error!)
var count = 5;

// 3. let and const: hoisted, but locked until their line (the "TDZ")
console.log(level);              // ❌ ReferenceError: Cannot access 'level' before initialization
let level = 1;

// 4. Function expressions/arrows follow their variable's rules
greet();                         // ❌ ReferenceError (it's a const)
const greet = () => console.log("Hello");`}
      />
      <p>
        The &quot;locked&quot; period for <code>let</code> and <code>const</code>{" "}
        is called the <b>temporal dead zone</b>. It&apos;s a feature: an
        error is far easier to find than the silent <code>undefined</code> that{" "}
        <code>var</code> gives you.
      </p>
      <p>
        <b>In practice:</b> declare variables before you use them, and
        don&apos;t rely on hoisting except for function declarations, where
        putting helper functions at the bottom of a file is a common, readable
        style.
      </p>
      <Tip>
        💡 Hoisting doesn&apos;t move code. It describes the setup phase the
        engine runs first (the &quot;read&quot; step from <i>How JavaScript
        runs</i>), creating each scope&apos;s variables before any line
        executes.
      </Tip>
    </>
  ),
  widget: { title: "Before the line", Component: HoistingWidget },
  quiz: [
    {
      question: (
        <>
          <code>console.log(x); var x = 3;</code> What is logged?
        </>
      ),
      options: ["3", "undefined", "A ReferenceError", "null"],
      answerIndex: 1,
      explanation: "var x is hoisted and starts as undefined; the = 3 only happens on its own line.",
    },
    {
      question: (
        <>
          <code>console.log(y); let y = 3;</code> What happens?
        </>
      ),
      options: ["Logs 3", "Logs undefined", "ReferenceError (temporal dead zone)", "Logs null"],
      answerIndex: 2,
      explanation: "let is hoisted but can't be touched until its declaration line runs.",
    },
    {
      question: "Which can you safely call before the line where it's written?",
      options: [
        "function add(a, b) { … }",
        "const add = (a, b) => …",
        "let add = function (a, b) { … }",
        "var add = function (a, b) { … }",
      ],
      answerIndex: 0,
      explanation: "Only function declarations are hoisted along with their body.",
    },
  ],
  exercise: {
    task: (
      <>
        This program crashes and logs the wrong total. Fix it so it logs{" "}
        <code>Subtotal: 30</code> then <code>Total: 36</code>. Move code around
        as needed and replace <code>var</code> with <code>let</code> or{" "}
        <code>const</code>. Keep <code>addTax</code> as an arrow function.
      </>
    ),
    starter: `console.log("Subtotal: " + subtotal);\nconsole.log("Total: " + addTax(subtotal));\n\nvar subtotal = 10 + 20;\nconst addTax = (amount) => amount * 1.2;`,
    extract: "null",
    tests: (_values, code, logs) => [
      check(logs[0] === "Subtotal: 30", "first line: Subtotal: 30"),
      check(logs[1] === "Total: 36", "second line: Total: 36"),
      check(logs.length === 2, "exactly two lines, with no crash"),
      check(!/\bvar\b/.test(code), "no var"),
      check(/const\s+addTax\s*=\s*\(?\s*amount\s*\)?\s*=>/.test(code), "addTax is still an arrow function"),
    ],
    hint: (
      <>
        Declarations first: <code>const subtotal = 10 + 20;</code> and the{" "}
        <code>addTax</code> line at the top, then the two{" "}
        <code>console.log</code> lines.
      </>
    ),
    solution: `const subtotal = 10 + 20;\nconst addTax = (amount) => amount * 1.2;\n\nconsole.log("Subtotal: " + subtotal);\nconsole.log("Total: " + addTax(subtotal));`,
  },
};

const callStack: Stage = {
  id: "adv-call-stack",
  level: "adv",
  part: PART_ENGINE,
  title: "Execution context and the call stack",
  short: "Call stack",
  lead: (
    <>
      Every function call gets its own <b>execution context</b>: a workspace
      holding its variables. JavaScript keeps these in a <b>call stack</b>,
      always working on the one at the top.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🍽️">
        A <b>stack of plates</b>. Each function call puts a plate on top. You
        can only work on the top plate; when that function finishes, its
        plate is removed and you carry on with the one underneath.
      </Analogy>
      <CodeBlock
        code={`function shout(text) {
  return text.toUpperCase() + "!";
}
function makeGreeting(name) {
  return "Hello, " + shout(name);   // pauses here while shout runs
}
function greet(name) {
  console.log(makeGreeting(name));
}

greet("ada");
// stack grows:   global → greet → makeGreeting → shout
// then shrinks:  shout returns, makeGreeting returns, greet returns`}
      />
      <p>
        <b>Execution contexts.</b> The script itself runs in the{" "}
        <b>global</b> context. Each call creates a fresh context with its own
        parameters and local variables. That&apos;s why two calls of the same
        function don&apos;t mix up their variables, and why a function can
        even call itself (<b>recursion</b>):
      </p>
      <CodeBlock
        code={`function countdown(n) {
  if (n === 0) {          // the base case: stop recursing
    return "liftoff!";
  }
  return n + " " + countdown(n - 1);
}
countdown(3);   // "3 2 1 liftoff!"`}
      />
      <p>
        <b>Stack traces</b> in error messages are a snapshot of this stack:
        they list the functions that were waiting when the error happened,
        newest first. Read them top-down to find where things went wrong.
      </p>
      <Tip>
        ⚠️ A function that calls itself with no way to stop keeps adding
        plates until there&apos;s no room:{" "}
        <i>RangeError: Maximum call stack size exceeded</i>, a &quot;stack
        overflow&quot;. Every recursive function needs a base case.
      </Tip>
    </>
  ),
  widget: { title: "Step through the stack", Component: CallStackWidget },
  quiz: [
    {
      question: "Which function is running at any moment?",
      options: [
        "The first one that was called",
        "The one at the top of the call stack",
        "All of them at once",
        "The one at the bottom",
      ],
      answerIndex: 1,
      explanation: "Everything below the top is paused, waiting for the function above it to return.",
    },
    {
      question: "What is a stack overflow?",
      options: [
        "Too many variables",
        "Calls nested so deeply (usually endless recursion) that the stack runs out of room",
        "A loop that never ends",
        "A website for questions",
      ],
      answerIndex: 1,
      explanation: "Each unfinished call takes space on the stack. Recursion with no base case never frees any.",
    },
    {
      question: "Two calls of the same function run one after another. Do they share local variables?",
      options: ["Yes, always", "No, each call gets its own execution context", "Only const ones", "Only if they have the same arguments"],
      answerIndex: 1,
      explanation: "A fresh context, with fresh local variables, is created for every call.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>factorial(n)</code> using <b>recursion</b> (no loops). The
        factorial of n is n × (n − 1) × … × 1, and <code>factorial(0)</code> is{" "}
        <code>1</code>. Don&apos;t forget the base case.
      </>
    ),
    starter: `function factorial(n) {\n  // base case: when should it stop?\n\n  // recursive case: n times the factorial of the number below it\n}\n\nconsole.log(factorial(5));   // 120`,
    extract: `({ f0: factorial(0), f1: factorial(1), f5: factorial(5), f10: factorial(10) })`,
    tests: (values, code) => [
      check(values.f0 === 1 && values.f1 === 1, "factorial(0) and factorial(1) → 1"),
      check(values.f5 === 120, "factorial(5) → 120"),
      check(values.f10 === 3628800, "factorial(10) → 3628800"),
      check((code.match(/factorial\s*\(/g) ?? []).length >= 3, "factorial calls itself"),
      check(!/\bfor\s*\(|\bwhile\s*\(/.test(code), "no loops"),
    ],
    hint: (
      <>
        <code>{"if (n <= 1) return 1;"}</code> then{" "}
        <code>return n * factorial(n - 1);</code>
      </>
    ),
    solution: `function factorial(n) {\n  if (n <= 1) {\n    return 1;\n  }\n  return n * factorial(n - 1);\n}\n\nconsole.log(factorial(5));   // 120`,
  },
};

const closures: Stage = {
  id: "adv-closures",
  level: "adv",
  part: PART_ENGINE,
  title: "Closures",
  short: "Closures",
  lead: (
    <>
      A function <b>remembers the variables from where it was created</b>,
      even after that outer function has finished. That remembered link is
      called a <b>closure</b>, and it&apos;s how JavaScript gives functions
      private, lasting state.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🎒">
        A function packs a <b>backpack</b> of the variables around it when
        it&apos;s created, and carries it wherever it goes. Long after it left
        home, it can still reach in and use (or change) what&apos;s inside.
      </Analogy>
      <CodeBlock
        code={`function makeCounter() {
  let count = 0;                 // lives in makeCounter's scope…
  return function () {
    count = count + 1;           // …yet the inner function can still use it
    return count;
  };
}

const counterA = makeCounter();
const counterB = makeCounter();

counterA();   // 1
counterA();   // 2
counterB();   // 1  ← its own, separate count`}
      />
      <p>
        Normally a function&apos;s local variables disappear when it returns
        (remember the call stack). But here the returned function still needs{" "}
        <code>count</code>, so JavaScript keeps it alive. Each call of{" "}
        <code>makeCounter</code> creates a new <code>count</code>, so every
        counter has its own.
      </p>
      <p>
        <b>Why closures are useful:</b>
      </p>
      <ul className="my-3 list-disc pl-10">
        <li>
          <b>Private state</b>: nothing outside can touch <code>count</code>{" "}
          except through the function you returned.
        </li>
        <li>
          <b>Function factories</b>: functions that build customised functions.
        </li>
        <li>
          <b>Callbacks that remember context</b>: event handlers and timers
          use closures constantly.
        </li>
      </ul>
      <CodeBlock
        code={`function makeMultiplier(factor) {
  return (n) => n * factor;      // remembers factor
}
const double = makeMultiplier(2);
const triple = makeMultiplier(3);
double(5);   // 10
triple(5);   // 15`}
      />
      <Tip>
        💡 Closures capture <b>variables</b>, not snapshots of values: if the
        variable changes, the function sees the new value. This is also why{" "}
        <code>let</code> in a <code>for</code> loop matters: each lap gets a
        fresh <code>i</code>, so callbacks created in the loop each remember
        their own.
      </Tip>
    </>
  ),
  widget: { title: "Counters with backpacks", Component: ClosureCounterWidget },
  quiz: [
    {
      question: (
        <>
          After <code>const c = makeCounter(); c(); c();</code>, what does the
          next <code>c()</code> return?
        </>
      ),
      options: ["1", "2", "3", "0"],
      answerIndex: 2,
      explanation: "c's count survives between calls: 1, 2, then 3.",
    },
    {
      question: "Two counters were made by separate makeCounter() calls. Do they share a count?",
      options: ["Yes", "No, each call created its own count variable", "Only after the first call", "Only if they have the same name"],
      answerIndex: 1,
      explanation: "Every call of the outer function creates a fresh scope, and so a fresh variable to close over.",
    },
    {
      question: "Can code outside makeCounter read count directly?",
      options: ["Yes, as makeCounter.count", "No, only the returned function can reach it", "Only with var", "Yes, it's global"],
      answerIndex: 1,
      explanation: "That's the privacy closures give you: the variable is only reachable through the inner function.",
    },
  ],
  exercise: {
    task: (
      <>
        Write two function factories using closures:
        <ol>
          <li>
            <code>makeMultiplier(factor)</code>: returns a function that
            multiplies its argument by <code>factor</code>
          </li>
          <li>
            <code>makeLimiter(max)</code>: returns a function that returns{" "}
            <code>true</code> the first <code>max</code> times it&apos;s called,
            and <code>false</code> after that. Each limiter keeps its own
            count.
          </li>
        </ol>
      </>
    ),
    starter: `function makeMultiplier(factor) {\n\n}\n\nfunction makeLimiter(max) {\n\n}\n\nconst double = makeMultiplier(2);\nconsole.log(double(21));`,
    extract: `(() => {
      const double = makeMultiplier(2);
      const tenTimes = makeMultiplier(10);
      const twoTries = makeLimiter(2);
      const oneTry = makeLimiter(1);
      const zeroTries = makeLimiter(0);
      return {
        m: [double(21), tenTimes(4), double(0)],
        two: [twoTries(), twoTries(), twoTries(), twoTries()],
        one: [oneTry(), oneTry()],
        zero: [zeroTries()],
      };
    })()`,
    tests: (values) => [
      check(isSameValue(values.m, [42, 40, 0]), "multipliers remember their own factor"),
      check(isSameValue(values.two, [true, true, false, false]), "makeLimiter(2) → true, true, false, false"),
      check(isSameValue(values.one, [true, false]), "a separate limiter keeps its own count"),
      check(isSameValue(values.zero, [false]), "makeLimiter(0) is false straight away"),
    ],
    hint: (
      <>
        <code>{"return (n) => n * factor;"}</code>. For the limiter:{" "}
        <code>let calls = 0;</code> then return a function that does{" "}
        <code>calls++;</code> and <code>return calls &lt;= max;</code>
      </>
    ),
    solution: `function makeMultiplier(factor) {\n  return (n) => n * factor;\n}\n\nfunction makeLimiter(max) {\n  let calls = 0;\n  return () => {\n    calls++;\n    return calls <= max;\n  };\n}\n\nconst double = makeMultiplier(2);\nconsole.log(double(21));`,
  },
};

const introToAsync: Stage = {
  id: "adv-async",
  level: "adv",
  part: PART_ASYNC,
  title: "Introduction to asynchronous JavaScript",
  short: "Async basics",
  lead: (
    <>
      JavaScript runs one thing at a time, but some work (timers, network
      requests) takes a while. Instead of waiting, JavaScript starts that work,
      carries on, and runs a callback when it&apos;s done. That&apos;s{" "}
      <b>asynchronous</b> code.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🍽️">
        A <b>restaurant waiter</b>. They take your order to the kitchen and
        then serve other tables instead of standing at the stove. When the
        kitchen rings the bell, they bring your food. One waiter, many tables,
        no waiting around.
      </Analogy>
      <CodeBlock
        code={`console.log("A: order placed");

setTimeout(() => {
  console.log("C: food is ready");
}, 1000);                       // run this function in about 1 second

console.log("B: serving other tables");
// A, B, …one second later… C`}
      />
      <p>
        <code>setTimeout</code> hands the function to the browser&apos;s timer
        and returns immediately. When the time is up, the callback is put in a{" "}
        <b>queue</b>. The <b>event loop</b> runs queued callbacks only when
        the call stack is empty, that is, when the current code has
        finished.
      </p>
      <p>
        That&apos;s why a delay of <code>0</code> doesn&apos;t mean
        &quot;now&quot;: it means &quot;as soon as you&apos;re free&quot;. And
        it&apos;s why a long-running loop freezes a page: nothing queued can run
        until it ends.
      </p>
      <p>
        There are two queues. Promise callbacks (next stage) go in the{" "}
        <b>microtask</b> queue, which is always emptied <i>before</i> timers
        get a turn. Step through the widget to see both in action.
      </p>
      <Tip>
        ⚠️ You can&apos;t get a value &quot;out&quot; of a callback that hasn&apos;t
        run yet. Code that needs the result must go <b>inside</b> the callback
        (or, more neatly, use promises and <code>await</code>, coming next).
      </Tip>
    </>
  ),
  widget: { title: "The event loop", Component: EventLoopWidget },
  quiz: [
    {
      question: (
        <>
          In what order do these log?{" "}
          <code>
            {'log("1"); setTimeout(() => log("2"), 0); log("3");'}
          </code>
        </>
      ),
      options: ["1, 2, 3", "1, 3, 2", "2, 1, 3", "3, 2, 1"],
      answerIndex: 1,
      explanation: "The timer callback waits in the queue until the current script finishes.",
    },
    {
      question: "When does the event loop run a queued callback?",
      options: [
        "Immediately",
        "When the call stack is empty",
        "After exactly the delay, interrupting other code",
        "Only once per second",
      ],
      answerIndex: 1,
      explanation: "Running code is never interrupted. Callbacks wait for the stack to clear.",
    },
    {
      question: "A promise .then callback and a 0 ms timer are both waiting. Which runs first?",
      options: ["The timer", "The promise callback", "Whichever was created first", "They run at the same time"],
      answerIndex: 1,
      explanation: "Microtasks (promise callbacks) always run before the next task (timer).",
    },
  ],
  exercise: {
    task: (
      <>
        <ol>
          <li>
            Use <code>setTimeout</code> so the console shows{" "}
            <code>Waiting...</code> first and <code>Ready!</code> about 100 ms
            later. Write the <code>Ready!</code> line <b>above</b> the{" "}
            <code>Waiting...</code> line in your code.
          </li>
          <li>
            Write <code>delayedGreeting(name, ms, callback)</code> that, after{" "}
            <code>ms</code> milliseconds, calls <code>callback</code> with{" "}
            <code>&quot;Hello, &quot; + name</code>.
          </li>
        </ol>
      </>
    ),
    starter: `// Part 1: the Ready! line goes here, above Waiting...\n\nconsole.log("Waiting...");\n\n// Part 2\nfunction delayedGreeting(name, ms, callback) {\n\n}`,
    extract: `new Promise((resolve) => {
      const started = Date.now();
      delayedGreeting("Ada", 50, (message) => {
        const waited = Date.now() - started;
        // Keep listening a little longer so part 1's 100 ms "Ready!" log is captured too.
        setTimeout(() => resolve({ message, waited }), 250);
      });
      setTimeout(() => resolve({ message: "callback never called", waited: 0 }), 1500);
    })`,
    tests: (values, code, logs) => {
      const readyLine = code.indexOf("Ready!");
      const waitingLine = code.indexOf("Waiting...");
      return [
        check(logs[0] === "Waiting..." && logs[1] === "Ready!", "the console shows Waiting... then Ready!"),
        check(readyLine >= 0 && readyLine < waitingLine && /setTimeout\s*\(/.test(code), "Ready! is written first but delayed with setTimeout"),
        check(values.message === "Hello, Ada", 'the callback receives "Hello, Ada"'),
        check(typeof values.waited === "number" && values.waited >= 40, "the callback waits for the delay (it isn't called straight away)"),
      ];
    },
    hint: (
      <>
        <code>{'setTimeout(() => console.log("Ready!"), 100);'}</code> and in
        the function:{" "}
        <code>{'setTimeout(() => callback("Hello, " + name), ms);'}</code>
      </>
    ),
    solution: `// Part 1\nsetTimeout(() => console.log("Ready!"), 100);\n\nconsole.log("Waiting...");\n\n// Part 2\nfunction delayedGreeting(name, ms, callback) {\n  setTimeout(() => callback("Hello, " + name), ms);\n}`,
  },
};

const promisesAndAwait: Stage = {
  id: "adv-promises",
  level: "adv",
  part: PART_ASYNC,
  title: "Promises and async/await",
  short: "Promises & await",
  lead: (
    <>
      A <b>promise</b> is an object standing in for a value that isn&apos;t
      ready yet. <code>async</code>/<code>await</code> lets you write code
      that waits for promises while reading top to bottom, like normal code.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📟">
        The <b>buzzer</b> a café gives you after you order. It isn&apos;t your
        coffee, but it promises you&apos;ll get one, or be told why not. It
        starts <i>pending</i>, then buzzes once: <i>fulfilled</i> (coffee&apos;s
        ready) or <i>rejected</i> (sorry, out of milk).
      </Analogy>
      <CodeBlock
        code={`fetch("/api/user/1")                    // returns a promise straight away
  .then((response) => response.json())  // runs when it fulfils
  .then((user) => console.log(user.name))
  .catch((error) => console.log("Failed:", error.message))  // if anything rejects
  .finally(() => console.log("Done"));`}
      />
      <p>
        <b>async/await</b> is the same thing with friendlier syntax. Inside an{" "}
        <code>async</code> function, <code>await</code> pauses <i>that
        function</i> until the promise settles (the rest of the program keeps
        running), and gives you the value. Errors are handled with ordinary{" "}
        <code>try</code>/<code>catch</code>:
      </p>
      <CodeBlock
        code={`async function showUserName(id) {
  try {
    const response = await fetch("/api/user/" + id);
    const user = await response.json();
    console.log(user.name);
  } catch (error) {
    console.log("Failed:", error.message);
  }
}`}
      />
      <p>Making your own promise, for example to wrap a timer:</p>
      <CodeBlock
        code={`function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function countdown() {
  console.log("3"); await wait(1000);
  console.log("2"); await wait(1000);
  console.log("1");
}`}
      />
      <Tip>
        ⚠️ An <code>async</code> function <b>always returns a promise</b>, even
        when you <code>return 5</code>. Callers must <code>await</code> it (or
        use <code>.then</code>). Forgetting <code>await</code> is the most
        common async bug: you get a <code>Promise</code> object instead of the
        value. To run several things at once, use{" "}
        <code>await Promise.all([a(), b()])</code>.
      </Tip>
    </>
  ),
  widget: { title: "Promise states", Component: PromiseStatesWidget },
  quiz: [
    {
      question: "What are a promise's three states?",
      options: [
        "start, middle, end",
        "pending, fulfilled, rejected",
        "waiting, running, stopped",
        "true, false, null",
      ],
      answerIndex: 1,
      explanation: "It starts pending and settles exactly once, as fulfilled or rejected.",
    },
    {
      question: (
        <>
          <code>{"async function f() { return 5; }"}</code> What does{" "}
          <code>f()</code> return?
        </>
      ),
      options: ["5", "A promise that fulfils with 5", "undefined", "An error"],
      answerIndex: 1,
      explanation: "async functions always wrap their result in a promise.",
    },
    {
      question: "How do you handle a rejected promise when using await?",
      options: ["You can't", "Wrap the await in try/catch", "Use if (error)", "Add a second await"],
      answerIndex: 1,
      explanation: "A rejection makes await throw, so try/catch works just like with normal errors.",
    },
  ],
  exercise: {
    task: (
      <>
        <code>fakeFetchUser(id)</code> returns a promise: it fulfils with a user
        object for ids 1 and 2, and rejects for anything else. Write{" "}
        <code>async function getUserName(id)</code> that <b>awaits</b> it and
        returns the user&apos;s name, or <code>&quot;Unknown user&quot;</code> if it
        rejects.
      </>
    ),
    starter: `function fakeFetchUser(id) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (id === 1) resolve({ id: 1, name: "Ada" });\n      else if (id === 2) resolve({ id: 2, name: "Linus" });\n      else reject(new Error("User " + id + " not found"));\n    }, 50);\n  });\n}\n\nasync function getUserName(id) {\n  // await fakeFetchUser(id) inside try/catch\n}\n\ngetUserName(1).then((name) => console.log(name));`,
    extract: `(async () => {
      const pending = getUserName(1);
      return {
        isPromise: pending instanceof Promise,
        a: await pending,
        b: await getUserName(2),
        c: await getUserName(99),
      };
    })()`,
    tests: (values, code) => [
      check(values.isPromise === true, "getUserName returns a promise (it's async)"),
      check(values.a === "Ada" && values.b === "Linus", "ids 1 and 2 → their names"),
      check(values.c === "Unknown user", 'an unknown id → "Unknown user" instead of an error'),
      check(/await\s+fakeFetchUser/.test(code) && /try\s*\{/.test(code), "you used await inside try/catch"),
    ],
    hint: (
      <>
        <code>
          {'try { const user = await fakeFetchUser(id); return user.name; } catch (error) { return "Unknown user"; }'}
        </code>
      </>
    ),
    solution: `function fakeFetchUser(id) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (id === 1) resolve({ id: 1, name: "Ada" });\n      else if (id === 2) resolve({ id: 2, name: "Linus" });\n      else reject(new Error("User " + id + " not found"));\n    }, 50);\n  });\n}\n\nasync function getUserName(id) {\n  try {\n    const user = await fakeFetchUser(id);\n    return user.name;\n  } catch (error) {\n    return "Unknown user";\n  }\n}\n\ngetUserName(1).then((name) => console.log(name));`,
  },
};

const advancedFinal: Stage = {
  id: "adv-final",
  level: "adv",
  part: PART_ASYNC,
  title: "Advanced final: the caching loader",
  short: "Final: caching loader",
  lead: (
    <>
      Loading data is slow, so apps <b>cache</b> it: the first request goes
      to the server, and repeats are answered from memory. Build a cache that
      uses closures, async/await, error handling and careful checks for
      &quot;no value&quot;.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`async function loadScore(player) { /* slow: asks the server */ }

const getScore = makeCache(loadScore);

await getScore("ada");   // calls loadScore("ada")…
await getScore("ada");   // …but not again: answered from the cache
await getScore("bo");    // a new key, so loadScore("bo") runs`}
      />
      <p>The traps this challenge is built around:</p>
      <ul className="my-3 list-disc pl-10">
        <li>
          A cached score of <code>0</code> is a real result. Checking{" "}
          <code>if (cache[key])</code> would treat it as missing (truthy/falsy!).
          Check whether the key exists instead.
        </li>
        <li>
          If the loader <b>fails</b>, don&apos;t cache the failure: let the
          error reach the caller, and try again next time.
        </li>
        <li>
          The cache must be <b>private</b> to each <code>makeCache</code> call
          (closures), so two caches never mix up their data.
        </li>
      </ul>
      <p>A good plan:</p>
      <ol className="my-4 list-decimal pl-10">
        <li>
          In <code>makeCache</code>, create <code>{"const cache = {};"}</code>.
        </li>
        <li>
          Return an <code>async</code> function of <code>key</code>.
        </li>
        <li>
          If <code>Object.hasOwn(cache, key)</code>, return the cached value.
        </li>
        <li>
          Otherwise <code>await loader(key)</code>, store it, and return it.
          (If the await throws, nothing is stored, and the error goes to the
          caller by itself.)
        </li>
      </ol>
      <PanelHeading className="mt-[22px]">Advanced cheat sheet</PanelHeading>
      <CheatSheet>
        <Cheat code="false 0 '' null undefined NaN">the main falsy values</Cheat>
        <Cheat code="value ?? fallback">fallback for null/undefined only</Cheat>
        <Cheat code="=== / !==">compare without coercion</Cheat>
        <Cheat code="let / const before use">avoid the temporal dead zone</Cheat>
        <Cheat code="base case + recursive call">safe recursion</Cheat>
        <Cheat code="function outer() { let x; return () => x; }">a closure</Cheat>
        <Cheat code="setTimeout(fn, ms)">run fn later, via the queue</Cheat>
        <Cheat code="async / await">pause a function until a promise settles</Cheat>
        <Cheat code="try { await … } catch (e)">handle rejections</Cheat>
      </CheatSheet>
    </>
  ),
  quiz: [
    {
      question: (
        <>
          The cache holds <code>{"{ ada: 0 }"}</code>. Why is{" "}
          <code>{'if (cache["ada"])'}</code> the wrong check?
        </>
      ),
      options: [
        "It's too slow",
        "0 is falsy, so a real cached result looks missing",
        "Brackets don't work on objects",
        "It changes the cache",
      ],
      answerIndex: 1,
      explanation: "Test whether the key exists (Object.hasOwn), not whether the value is truthy.",
    },
    {
      question: "Why is the cache object safe from outside code?",
      options: [
        "It's frozen",
        "It lives in makeCache's scope, reachable only through the returned function's closure",
        "It's a const",
        "It isn't",
      ],
      answerIndex: 1,
      explanation: "Only the inner function closes over cache; nothing else has a reference to it.",
    },
    {
      question: "If await loader(key) throws, what happens without a try/catch inside the cache function?",
      options: [
        "The program crashes",
        "The returned promise rejects with that error, so the caller can catch it",
        "undefined is cached",
        "The loader is retried forever",
      ],
      answerIndex: 1,
      explanation: "An error inside an async function rejects its promise; nothing after the await runs, so nothing is cached.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>makeCache(loader)</code> returning an <code>async</code>{" "}
        function <code>get(key)</code>:
        <ol>
          <li>
            The first <code>get(key)</code> awaits <code>loader(key)</code>,
            stores the result and returns it.
          </li>
          <li>
            Later calls with the same key return the stored value{" "}
            <b>without</b> calling the loader, even when the value is{" "}
            <code>0</code>, <code>&quot;&quot;</code> or <code>null</code>.
          </li>
          <li>
            If the loader rejects, <code>get</code> rejects too, and nothing
            is cached.
          </li>
          <li>Each cache keeps its own private data.</li>
        </ol>
      </>
    ),
    starter: `function makeCache(loader) {\n  // a private cache object here\n\n  return async function get(key) {\n    // 1. already cached? return it (careful with 0 and "")\n    // 2. otherwise await the loader, store the result, return it\n  };\n}\n\nconst getDouble = makeCache(async (n) => n * 2);\ngetDouble(21).then((value) => console.log(value));`,
    extract: `(async () => {
      const calls = [];
      const scores = { ada: 7, zero: 0, blank: "", none: null };
      const loader = async (key) => {
        calls.push(key);
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (key === "boom") throw new Error("Server down");
        return scores[key];
      };
      const get = makeCache(loader);
      const first = await get("ada");
      const second = await get("ada");
      const zero1 = await get("zero");
      const zero2 = await get("zero");
      const blank1 = await get("blank");
      const blank2 = await get("blank");
      const none1 = await get("none");
      const none2 = await get("none");
      let error1 = "no error";
      try { await get("boom"); } catch (error) { error1 = error.message; }
      let error2 = "no error";
      try { await get("boom"); } catch (error) { error2 = error.message; }
      const otherCalls = [];
      const other = makeCache(async (key) => { otherCalls.push(key); return "other:" + key; });
      const otherValue = await other("ada");
      return {
        values: [first, second, zero1, zero2, blank1, blank2, none1, none2],
        calls, error1, error2, otherValue, otherCalls,
        returnsPromise: get("ada") instanceof Promise,
      };
    })()`,
    tests: (values) => [
      check(values.returnsPromise === true, "get returns a promise (it's async)"),
      check(isSameValue(values.values, [7, 7, 0, 0, "", "", null, null]), "every value comes back correctly, including 0, \"\" and null"),
      check(
        isSameValue((values.calls as unknown[] | undefined)?.filter((key) => key !== "boom"), ["ada", "zero", "blank", "none"]),
        "the loader runs once per key, even for 0, \"\" and null"
      ),
      check(values.error1 === "Server down" && values.error2 === "Server down", "loader errors reach the caller"),
      check(
        isSameValue((values.calls as unknown[] | undefined)?.filter((key) => key === "boom"), ["boom", "boom"]),
        "a failed load isn't cached, so it's retried"
      ),
      check(values.otherValue === "other:ada" && isSameValue(values.otherCalls, ["ada"]), "a second cache has its own private data"),
    ],
    hint: (
      <>
        <code>{"const cache = {};"}</code> then inside get:{" "}
        <code>{"if (Object.hasOwn(cache, key)) { return cache[key]; }"}</code>{" "}
        and <code>{"const value = await loader(key); cache[key] = value; return value;"}</code>
      </>
    ),
    solution: `function makeCache(loader) {\n  const cache = {};\n\n  return async function get(key) {\n    if (Object.hasOwn(cache, key)) {\n      return cache[key];\n    }\n    const value = await loader(key);\n    cache[key] = value;\n    return value;\n  };\n}\n\nconst getDouble = makeCache(async (n) => n * 2);\ngetDouble(21).then((value) => console.log(value));`,
  },
};

export const FOUNDATIONS_ADVANCED_STAGES: Stage[] = [
  truthyFalsy,
  nullVsUndefined,
  looseVsStrictEquality,
  hoisting,
  callStack,
  closures,
  introToAsync,
  promisesAndAwait,
  advancedFinal,
];
