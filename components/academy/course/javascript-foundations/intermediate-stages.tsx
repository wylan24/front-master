import type { Stage } from "@/lib/academy/types";
import { isSameValue } from "@/lib/academy/format";
import { Analogy, CodeBlock, Cheat, CheatSheet, PanelHeading, Tip } from "../../content";
import { check, isPlainObject } from "../check";
import { CodePlayground } from "../../widgets/code-playground";
import { ExpressionExplorer } from "../../widgets/expression-explorer";
import { LoopTraceWidget } from "../../widgets/loop-trace";

// ---------------------------------------------------------------------------
// Widgets for this section
// ---------------------------------------------------------------------------

function FunctionsWidget() {
  return (
    <CodePlayground
      intro="Define once, call as often as you like. Try adding a third call, or calling before the function is defined."
      examples={[
        {
          label: "Define and call",
          code: `function sayHello() {
  console.log("Hello!");
  console.log("Nice to see you.");
}

sayHello();
sayHello();`,
          lookFor: "Defining the function prints nothing. Each call runs the whole body.",
        },
        {
          label: "Forgot the ()",
          code: `function sayHello() {
  console.log("Hello!");
}

sayHello;          // mentions the function, doesn't call it
console.log("done");`,
          lookFor: "Without parentheses, the function never runs.",
        },
        {
          label: "Reuse",
          code: `function drawLine() {
  console.log("----------");
}

drawLine();
console.log("  REPORT");
drawLine();
console.log("  All good");
drawLine();`,
          lookFor: "Change the dashes in one place and every line updates.",
        },
      ]}
    />
  );
}

function ParametersWidget() {
  return (
    <CodePlayground
      intro="Change the arguments in the calls and run again."
      examples={[
        {
          label: "One parameter",
          code: `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Ada");
greet("Linus");`,
          lookFor: "name takes the value of whichever argument was passed in.",
        },
        {
          label: "Order matters",
          code: `function describe(pet, sound) {
  console.log("The " + pet + " says " + sound);
}

describe("cat", "meow");
describe("meow", "cat");   // swapped!`,
          lookFor: "Arguments are matched to parameters by position, not by name.",
        },
        {
          label: "Missing & defaults",
          code: `function order(item, quantity = 1) {
  console.log(quantity + " x " + item);
}

order("coffee", 3);
order("bagel");          // quantity uses its default
order();                 // item is undefined`,
          lookFor: "Missing arguments are undefined, unless the parameter has a default.",
        },
      ]}
    />
  );
}

function ReturnWidget() {
  return (
    <ExpressionExplorer
      intro="Three functions that look similar. Which ones give you a value back?"
      setup={`function addAndReturn(a, b) {
  return a + b;
}
function addAndLog(a, b) {
  console.log(a + b);
}
function checkAge(age) {
  if (age < 0) {
    return "invalid";
  }
  return age >= 18 ? "adult" : "minor";
}`}
      expressions={[
        { code: "addAndReturn(2, 3)", note: "return hands the value back to the caller." },
        { code: "addAndLog(2, 3)", note: "Logging isn't returning: the caller gets undefined." },
        { code: "addAndReturn(2, 3) * 10", note: "A returned value can be used in bigger expressions." },
        { code: "addAndReturn(addAndReturn(1, 2), 4)", note: "Or passed straight into another call." },
        { code: "checkAge(-5)", note: "return ends the function immediately (an early return)." },
        { code: "checkAge(30)", note: "The ternary picks one of two values to return." },
      ]}
      ownExpressionStart="checkAge(12)"
    />
  );
}

function ScopeWidget() {
  return (
    <CodePlayground
      intro="Each example shows one scope rule. Predict the output, including any errors."
      examples={[
        {
          label: "Inside sees outside",
          code: `const siteName = "Snacks";      // global scope

function welcome() {
  const greeting = "Welcome to"; // function scope
  console.log(greeting + " " + siteName);
}

welcome();`,
          lookFor: "Code inside a function can read variables from outside it.",
        },
        {
          label: "Outside can't see in",
          code: `function makeSecret() {
  const secret = 42;
}

makeSecret();
console.log(secret);`,
          lookFor: "Variables made inside a function vanish when it finishes; outside code can't reach them.",
        },
        {
          label: "Block scope",
          code: `const hour = 9;

if (hour < 12) {
  const message = "Good morning";
  console.log(message);       // fine: inside the block
}

console.log(message);         // outside the { }`,
          lookFor: "let and const belong to the nearest { } block.",
        },
        {
          label: "Shadowing",
          code: `const colour = "red";

function paint() {
  const colour = "blue";      // a different variable with the same name
  console.log("inside:", colour);
}

paint();
console.log("outside:", colour);`,
          lookFor: "The inner colour hides the outer one, but only inside the function.",
        },
        {
          label: "var ignores blocks",
          code: `if (true) {
  var leaky = "I escaped the block";
  let tidy = "I stay inside";
}

console.log(leaky);
console.log(typeof tidy);`,
          lookFor: "var only respects function boundaries, one reason modern code avoids it.",
        },
      ]}
    />
  );
}

function ArrowWidget() {
  return (
    <ExpressionExplorer
      intro="These arrow functions are already defined. Call them."
      setup={`const double = (n) => n * 2;
const greet = name => "Hi " + name;
const add = (a, b) => a + b;
const rollDice = () => Math.floor(Math.random() * 6) + 1;
const makePoint = (x, y) => ({ x, y });
const broken = (x, y) => { x + y };`}
      expressions={[
        { code: "double(21)", note: "One expression after =>: its value is returned automatically." },
        { code: 'greet("Ada")', note: "With exactly one parameter, the brackets are optional." },
        { code: "add(2, 3)", note: "Two or more parameters need brackets." },
        { code: "rollDice()", note: "No parameters: empty brackets. Reveal a few times… or edit and re-run." },
        { code: "makePoint(1, 2)", note: "To return an object, wrap it in ( ) so { } isn't read as a block." },
        { code: "broken(2, 3)", note: "With { } you're writing a block, so you need an explicit return." },
      ]}
      ownExpressionStart="double(add(1, 2))"
    />
  );
}

function CallbacksWidget() {
  return (
    <CodePlayground
      intro="A callback is a function you hand to another function, for it to call."
      examples={[
        {
          label: "Pass a function",
          code: `function shout(text) {
  return text.toUpperCase() + "!";
}
function whisper(text) {
  return "(" + text.toLowerCase() + ")";
}

function announce(message, style) {
  console.log(style(message));   // call whichever function we were given
}

announce("Lunch is ready", shout);
announce("Lunch is ready", whisper);`,
          lookFor: "announce doesn't know or care which style it gets; it just calls it.",
        },
        {
          label: "Inline arrow",
          code: `function repeat(times, action) {
  for (let i = 1; i <= times; i++) {
    action(i);
  }
}

repeat(3, (n) => console.log("Lap " + n));`,
          lookFor: "Writing the callback inline as an arrow is the most common style.",
        },
        {
          label: "Called later",
          code: `console.log("Ordering pizza…");

setTimeout(() => {
  console.log("🍕 Pizza arrived!");
}, 300);

console.log("Laying the table…");`,
          lookFor: "setTimeout calls your function later, so the last line prints before the pizza arrives.",
        },
      ]}
      waitForTimersMilliseconds={500}
    />
  );
}

function ErrorsWidget() {
  return (
    <CodePlayground
      intro="Errors don't have to end your program. Run each example."
      examples={[
        {
          label: "Uncaught",
          code: `console.log("before");
null.length;              // TypeError
console.log("after");`,
          lookFor: "Without try/catch, the error stops everything.",
        },
        {
          label: "try / catch",
          code: `console.log("before");

try {
  null.length;
  console.log("this line is skipped");
} catch (error) {
  console.log("Caught:", error.name, "-", error.message);
}

console.log("after: still running");`,
          lookFor: "The rest of try is skipped, catch runs, then the program carries on.",
        },
        {
          label: "throw your own",
          code: `function withdraw(balance, amount) {
  if (amount > balance) {
    throw new Error("Insufficient funds");
  }
  return balance - amount;
}

try {
  console.log(withdraw(100, 30));
  console.log(withdraw(100, 500));
} catch (error) {
  console.log("Sorry:", error.message);
} finally {
  console.log("Receipt printed");
}`,
          lookFor: "throw stops the function and jumps to the nearest catch; finally runs either way.",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const loops: Stage = {
  id: "mid-loops",
  level: "mid",
  title: "Loops: for and while",
  short: "Loops",
  lead: (
    <>
      A loop repeats code without you copying it. Use <code>for</code> when
      you know how many times to repeat, and <code>while</code> when you
      repeat until something changes.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🏃">
        <b>Running laps</b> of a track. Before every lap you ask &quot;have I
        done enough yet?&quot;. If not, run a lap and count it. The moment the
        answer is yes, you stop.
      </Analogy>
      <CodeBlock
        code={`for (let i = 1; i <= 3; i++) {
  console.log("Lap " + i);
}
// Lap 1, Lap 2, Lap 3`}
      />
      <p>The three parts inside the brackets:</p>
      <ol className="my-4 list-decimal pl-10">
        <li>
          <code>let i = 1</code>: <b>start</b>. Runs once.
        </li>
        <li>
          <code>i &lt;= 3</code>: <b>check</b>. Runs before every lap; false
          means stop.
        </li>
        <li>
          <code>i++</code>: <b>update</b>. Runs after every lap.
        </li>
      </ol>
      <p>
        A <code>while</code> loop only has the check. Use it when you
        can&apos;t know the number of laps in advance:
      </p>
      <CodeBlock
        code={`let savings = 100;
let years = 0;

while (savings < 200) {
  savings = savings * 1.1;   // 10% growth a year
  years++;
}
console.log(years);   // 8 years to double`}
      />
      <p>
        <code>break</code> leaves a loop early; <code>continue</code> skips to
        the next lap.
      </p>
      <Tip>
        ⚠️ If the check never becomes false, the loop runs forever and freezes
        the page. With <code>while</code>, make sure something inside the loop
        moves you towards the end. (The exercises here stop runaway loops after
        a couple of seconds.)
      </Tip>
    </>
  ),
  widget: { title: "Step through a for loop", Component: LoopTraceWidget },
  quiz: [
    {
      question: (
        <>
          How many times does <code>{"for (let i = 0; i < 4; i++)"}</code> run
          its body?
        </>
      ),
      options: ["3", "4", "5", "Forever"],
      answerIndex: 1,
      explanation: "i is 0, 1, 2, 3; when it reaches 4 the check fails.",
    },
    {
      question: "When is a while loop a better fit than a for loop?",
      options: [
        "When you know exactly how many times to repeat",
        "When you repeat until something changes, and don't know how many times",
        "Never; they're identical",
        "Only for counting down",
      ],
      answerIndex: 1,
      explanation: "while keeps going as long as its condition holds, however many laps that takes.",
    },
    {
      question: (
        <>
          <code>{"let n = 1; while (n < 10) { console.log(n); }"}</code> What
          happens?
        </>
      ),
      options: ["Logs 1 to 9", "Logs 1 once", "Runs forever", "An error"],
      answerIndex: 2,
      explanation: "n never changes, so n < 10 is always true. The loop needs n++.",
    },
  ],
  exercise: {
    task: (
      <>
        Write two functions:
        <ol>
          <li>
            <code>sumTo(n)</code>: the total of every whole number from 1 to{" "}
            <code>n</code>, using a <b>for</b> loop (<code>sumTo(4)</code> is
            1 + 2 + 3 + 4 = 10)
          </li>
          <li>
            <code>doublingsToReach(start, target)</code>: how many times you
            must double <code>start</code> before it reaches{" "}
            <code>target</code> or more, using a <b>while</b> loop
          </li>
        </ol>
      </>
    ),
    starter: `function sumTo(n) {\n  let total = 0;\n  // for loop here\n  return total;\n}\n\nfunction doublingsToReach(start, target) {\n  let count = 0;\n  // while loop here\n  return count;\n}\n\nconsole.log(sumTo(4), doublingsToReach(1, 100));`,
    extract: `({
      s1: sumTo(4), s2: sumTo(1), s3: sumTo(100), s4: sumTo(0),
      d1: doublingsToReach(1, 100), d2: doublingsToReach(5, 5), d3: doublingsToReach(3, 4), d4: doublingsToReach(10, 1000),
    })`,
    tests: (values, code) => [
      check(values.s1 === 10 && values.s2 === 1, "sumTo(4) → 10 and sumTo(1) → 1"),
      check(values.s3 === 5050 && values.s4 === 0, "sumTo(100) → 5050 and sumTo(0) → 0"),
      check(values.d1 === 7, "doublingsToReach(1, 100) → 7 (1→2→4→…→128)"),
      check(values.d2 === 0, "already there → 0"),
      check(values.d3 === 1 && values.d4 === 7, "(3, 4) → 1 and (10, 1000) → 7"),
      check(/for\s*\(/.test(code) && /while\s*\(/.test(code), "you used a for loop and a while loop"),
    ],
    hint: (
      <>
        <code>{"for (let i = 1; i <= n; i++) { total += i; }"}</code> and{" "}
        <code>{"while (start < target) { start = start * 2; count++; }"}</code>
      </>
    ),
    solution: `function sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}\n\nfunction doublingsToReach(start, target) {\n  let count = 0;\n  let value = start;\n  while (value < target) {\n    value = value * 2;\n    count++;\n  }\n  return count;\n}\n\nconsole.log(sumTo(4), doublingsToReach(1, 100));`,
  },
};

const functions: Stage = {
  id: "mid-functions",
  level: "mid",
  title: "Functions",
  short: "Functions",
  lead: (
    <>
      A function is a <b>named, reusable block of code</b>. You define it once,
      then run it whenever you need it by <b>calling</b> it.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📖">
        A <b>recipe card</b>. Writing the recipe doesn&apos;t cook anything.
        Cooking happens each time someone picks up the card and follows it, as
        many times as you like.
      </Analogy>
      <CodeBlock
        code={`// Define it: nothing runs yet
function brewTea() {
  console.log("Boil the water");
  console.log("Add the tea bag");
  console.log("Wait 3 minutes");
}

// Call it: the body runs, top to bottom, every time
brewTea();
brewTea();`}
      />
      <p>
        <b>Why bother?</b> Functions let you:
      </p>
      <ul className="my-3 list-disc pl-10">
        <li>
          <b>reuse</b> code instead of copying it (fix a bug once, fixed
          everywhere);
        </li>
        <li>
          <b>name</b> a chunk of work, so <code>brewTea()</code> explains
          itself;
        </li>
        <li>
          <b>split</b> a big problem into small, testable pieces.
        </li>
      </ul>
      <p>
        Function names follow the same rules as variables. Start them with a
        verb: <code>calculateTotal</code>, <code>showMenu</code>,{" "}
        <code>isValid</code>.
      </p>
      <Tip>
        ⚠️ The parentheses are what make it run. <code>brewTea</code> on its
        own just refers to the function; <code>brewTea()</code> calls it.
      </Tip>
    </>
  ),
  widget: { title: "Define and call", Component: FunctionsWidget },
  quiz: [
    {
      question: "What happens when JavaScript reaches a function definition?",
      options: [
        "It runs the body immediately",
        "It stores the function so it can be called later",
        "It runs the body twice",
        "It throws an error until called",
      ],
      answerIndex: 1,
      explanation: "Defining only creates the function. The body runs when it's called.",
    },
    {
      question: "How do you call a function named showMenu?",
      options: ["showMenu", "call showMenu", "showMenu()", "function showMenu()"],
      answerIndex: 2,
      explanation: "Parentheses after the name call it.",
    },
    {
      question: "Which is the best name for a function?",
      options: ["stuff", "x", "calculateShipping", "Function1"],
      answerIndex: 2,
      explanation: "A verb plus what it acts on tells readers exactly what it does.",
    },
  ],
  exercise: {
    task: (
      <>
        Write a function called <code>cheer</code> that logs two lines:{" "}
        <code>Hip hip!</code> then <code>Hooray!</code>. Then <b>call it three
        times</b>, so six lines are logged in total.
      </>
    ),
    starter: `// define cheer here\n\n\n// call it three times\n`,
    extract: "null",
    tests: (_values, code, logs) => {
      // Lines that start with cheer() are calls; the definition starts with "function".
      const callCount = (code.match(/^\s*cheer\s*\(\s*\)/gm) ?? []).length;
      const expected = ["Hip hip!", "Hooray!", "Hip hip!", "Hooray!", "Hip hip!", "Hooray!"];
      return [
        check(/function\s+cheer\s*\(/.test(code), "you defined a function called cheer"),
        check(isSameValue(logs, expected), "the console shows Hip hip! / Hooray! three times"),
        check(callCount >= 3, "you called cheer() three times instead of copying the logs"),
        check((code.match(/console\.log/g) ?? []).length === 2, "there are only two console.log lines, both inside cheer"),
      ];
    },
    hint: (
      <>
        <code>{'function cheer() { console.log("Hip hip!"); console.log("Hooray!"); }'}</code>{" "}
        then <code>cheer();</code> on three lines.
      </>
    ),
    solution: `function cheer() {\n  console.log("Hip hip!");\n  console.log("Hooray!");\n}\n\ncheer();\ncheer();\ncheer();`,
  },
};

const parameters: Stage = {
  id: "mid-parameters",
  level: "mid",
  title: "Parameters and arguments",
  short: "Parameters",
  lead: (
    <>
      Parameters let a function work with <b>different values each time</b>.
      The <b>parameter</b> is the placeholder name in the definition; the{" "}
      <b>argument</b> is the actual value you pass in the call.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="☕">
        A <b>coffee order</b>. The barista&apos;s process has blanks:{" "}
        <i>size</i> and <i>drink</i> (parameters). Each customer fills them in:
        &quot;large&quot;, &quot;latte&quot; (arguments). Same process,
        different coffee.
      </Analogy>
      <CodeBlock
        code={`function makeCoffee(size, drink) {   // size and drink are parameters
  console.log("One " + size + " " + drink + " coming up!");
}

makeCoffee("large", "latte");       // "large" and "latte" are arguments
makeCoffee("small", "espresso");`}
      />
      <p>
        Arguments are matched to parameters <b>by position</b>: the first
        argument goes into the first parameter, and so on. Inside the function,
        parameters behave like ordinary variables.
      </p>
      <p>
        <b>Missing and extra arguments</b> don&apos;t cause errors. A missing
        one is <code>undefined</code>; an extra one is ignored. A{" "}
        <b>default value</b> covers the missing case:
      </p>
      <CodeBlock
        code={`function makeCoffee(size, drink = "flat white") {
  console.log("One " + size + " " + drink);
}

makeCoffee("medium");              // One medium flat white
makeCoffee("medium", "mocha");     // One medium mocha (default not used)`}
      />
      <Tip>
        💡 Put parameters with defaults <b>last</b>. With{" "}
        <code>{'function f(a = 1, b)'}</code>, you can&apos;t skip{" "}
        <code>a</code> without writing <code>f(undefined, 5)</code>.
      </Tip>
    </>
  ),
  widget: { title: "Pass it in", Component: ParametersWidget },
  quiz: [
    {
      question: (
        <>
          In <code>{"function area(width, height) {…}"}</code> called as{" "}
          <code>area(3, 5)</code>, what is <code>height</code>?
        </>
      ),
      options: ["3", "5", "undefined", "15"],
      answerIndex: 1,
      explanation: "Arguments fill parameters in order: width gets 3, height gets 5.",
    },
    {
      question: (
        <>
          <code>{'function hi(name) { return "Hi " + name; }'}</code> What does{" "}
          <code>hi()</code> return?
        </>
      ),
      options: ['"Hi "', '"Hi undefined"', "An error", '"Hi name"'],
      answerIndex: 1,
      explanation: "No argument was passed, so name is undefined, and that gets joined into the text.",
    },
    {
      question: (
        <>
          <code>{'function pay(amount, currency = "EUR")'}</code>. What is{" "}
          <code>currency</code> in <code>pay(10, &quot;USD&quot;)</code>?
        </>
      ),
      options: ['"EUR"', '"USD"', "undefined", "10"],
      answerIndex: 1,
      explanation: "Defaults only apply when the argument is missing.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>introduce(name, age, city)</code> that returns{" "}
        <code>&quot;I&apos;m Ada, 36, from London.&quot;</code>.{" "}
        <code>city</code> should default to <code>&quot;London&quot;</code> when
        it isn&apos;t given.
      </>
    ),
    starter: `function introduce(name, age, city) {\n\n}\n\nconsole.log(introduce("Ada", 36));\nconsole.log(introduce("Linus", 54, "Portland"));`,
    extract: `({
      a: introduce("Ada", 36),
      b: introduce("Linus", 54, "Portland"),
      c: introduce("Grace", 85, undefined),
    })`,
    tests: (values, code) => [
      check(values.a === "I'm Ada, 36, from London.", "introduce(\"Ada\", 36) → \"I'm Ada, 36, from London.\""),
      check(values.b === "I'm Linus, 54, from Portland.", "a given city is used"),
      check(values.c === "I'm Grace, 85, from London.", "an explicit undefined also uses the default"),
      check(/city\s*=\s*["'`]London["'`]/.test(code), "you used a default parameter"),
    ],
    hint: (
      <>
        <code>{'function introduce(name, age, city = "London")'}</code> and{" "}
        <code>{"return `I'm ${name}, ${age}, from ${city}.`;"}</code>
      </>
    ),
    solution: "function introduce(name, age, city = \"London\") {\n  return `I'm ${name}, ${age}, from ${city}.`;\n}\n\nconsole.log(introduce(\"Ada\", 36));\nconsole.log(introduce(\"Linus\", 54, \"Portland\"));",
  },
};

const returnValues: Stage = {
  id: "mid-return",
  level: "mid",
  title: "Return values",
  short: "Return values",
  lead: (
    <>
      <code>return</code> sends a value <b>back</b> to the code that called
      the function, so you can store it, test it or pass it on. It also ends
      the function on the spot.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🧾">
        A <b>vending machine</b>. You put money in (arguments), and it hands
        something back (the return value) that you can then do things with.
        A machine that only flashes a light (<code>console.log</code>) gives
        you nothing to hold.
      </Analogy>
      <CodeBlock
        code={`function addVat(price) {
  return price * 1.2;
}

const total = addVat(50);          // 60, stored for later
console.log(addVat(10) + 5);       // 17, used in a bigger expression
if (addVat(100) > 100) { /* … */ } // tested in a condition`}
      />
      <p>
        <b>Logging is not returning.</b> This is the most common mix-up:
      </p>
      <CodeBlock
        code={`function addVatAndLog(price) {
  console.log(price * 1.2);   // shows 60 on screen…
}

const result = addVatAndLog(50);
result      // undefined: nothing was returned`}
      />
      <p>
        <b>Early returns</b> handle special cases first and keep the main logic
        flat:
      </p>
      <CodeBlock
        code={`function grade(score) {
  if (score < 0 || score > 100) {
    return "invalid";          // the function stops here
  }
  if (score >= 70) {
    return "pass with merit";
  }
  return score >= 50 ? "pass" : "fail";
}`}
      />
      <Tip>
        💡 A function without <code>return</code> (or with a bare{" "}
        <code>return;</code>) gives back <code>undefined</code>. Code after a{" "}
        <code>return</code> in the same block never runs.
      </Tip>
    </>
  ),
  widget: { title: "Returned or not?", Component: ReturnWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"function f() { console.log(5); }"}</code> What is{" "}
          <code>f() + 1</code>?
        </>
      ),
      options: ["6", "NaN", "5", '"51"'],
      answerIndex: 1,
      explanation: "f logs 5 but returns undefined, and undefined + 1 is NaN.",
    },
    {
      question: "What happens to code after a return statement in the same block?",
      options: ["It runs next", "It never runs", "It runs on the next call", "It throws"],
      answerIndex: 1,
      explanation: "return ends the function immediately.",
    },
    {
      question: (
        <>
          <code>{"function sq(n) { return n * n; }"}</code> What is{" "}
          <code>sq(sq(2))</code>?
        </>
      ),
      options: ["4", "8", "16", "undefined"],
      answerIndex: 2,
      explanation: "The inner call returns 4, which is passed to the outer call: 4 × 4 = 16.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>passwordStrength(password)</code> that <b>returns</b> (not
        logs) a label, using early returns:
        <ol>
          <li>
            fewer than 6 characters → <code>&quot;too short&quot;</code>
          </li>
          <li>
            contains the word <code>password</code> in any capitalisation →{" "}
            <code>&quot;too obvious&quot;</code>
          </li>
          <li>
            12 or more characters → <code>&quot;strong&quot;</code>
          </li>
          <li>
            anything else → <code>&quot;okay&quot;</code>
          </li>
        </ol>
      </>
    ),
    starter: `function passwordStrength(password) {\n\n}\n\nconsole.log(passwordStrength("hunter2"));`,
    extract: `({
      a: passwordStrength("abc"),
      b: passwordStrength("MyPassword123"),
      c: passwordStrength("correct horse battery"),
      d: passwordStrength("hunter2"),
      e: passwordStrength("abcdef"),
      f: passwordStrength("pass1234"),
    })`,
    tests: (values, code) => [
      check(values.a === "too short", '"abc" → "too short"'),
      check(values.b === "too obvious", '"MyPassword123" → "too obvious" (any capitalisation)'),
      check(values.c === "strong", '"correct horse battery" → "strong"'),
      check(values.d === "okay" && values.e === "okay" && values.f === "okay", '"hunter2", "abcdef" and "pass1234" → "okay"'),
      check((code.match(/\breturn\b/g) ?? []).length >= 3, "you used several return statements"),
    ],
    hint: (
      <>
        Check in order:{" "}
        <code>{'if (password.length < 6) return "too short";'}</code>, then{" "}
        <code>{'if (password.toLowerCase().includes("password")) return "too obvious";'}</code>
        , then the length check for strong, and finally{" "}
        <code>return &quot;okay&quot;;</code>
      </>
    ),
    solution: `function passwordStrength(password) {\n  if (password.length < 6) {\n    return "too short";\n  }\n  if (password.toLowerCase().includes("password")) {\n    return "too obvious";\n  }\n  if (password.length >= 12) {\n    return "strong";\n  }\n  return "okay";\n}\n\nconsole.log(passwordStrength("hunter2"));`,
  },
};

const scope: Stage = {
  id: "mid-scope",
  level: "mid",
  title: "Scope and block scope",
  short: "Scope",
  lead: (
    <>
      <b>Scope</b> decides where a variable can be used. A variable made
      inside a function or a <code>{"{ }"}</code> block only exists inside it.
      Inner code can see outward; outer code can&apos;t see in.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🪟">
        Rooms with <b>one-way windows</b>. From inside a room you can see into
        the hallway and the rooms around you. From the hallway you can&apos;t
        see into the room. Each room&apos;s furniture stays in that room.
      </Analogy>
      <CodeBlock
        code={`const shopName = "Snacks";          // global: visible everywhere

function openShop() {
  const sign = "Open!";             // function scope
  if (true) {
    const today = "Monday";         // block scope: only inside these { }
    console.log(shopName, sign, today);   // ✓ can see all three
  }
  console.log(today);               // ❌ ReferenceError: today is not defined
}

console.log(sign);                  // ❌ ReferenceError: sign is not defined`}
      />
      <p>
        <b>Why have scope at all?</b> It keeps variables from clashing. Two
        functions can both use a variable called <code>total</code> without
        interfering, and temporary variables disappear when they&apos;re no
        longer needed.
      </p>
      <p>
        <b>Shadowing</b>: a new variable with the same name in an inner scope
        hides the outer one inside that scope only. It&apos;s legal, but
        confusing, so avoid it unless you mean it.
      </p>
      <Tip>
        ⚠️ A classic bug: declaring a variable inside an <code>if</code> and
        trying to use it after. Declare it <b>before</b> the block with{" "}
        <code>let</code>, then assign inside. And <code>var</code> ignores
        block scope entirely, another reason to avoid it.
      </Tip>
    </>
  ),
  widget: { title: "Who can see what?", Component: ScopeWidget },
  quiz: [
    {
      question: "A variable is declared with const inside an if block. Where can it be used?",
      options: [
        "Anywhere in the file",
        "Anywhere in the function",
        "Only inside that if block",
        "Only on the line where it's declared",
      ],
      answerIndex: 2,
      explanation: "let and const are block-scoped: they belong to the nearest { }.",
    },
    {
      question: "Can a function read a global variable?",
      options: ["Yes, inner code can see outer variables", "No, never", "Only if passed as a parameter", "Only with var"],
      answerIndex: 0,
      explanation: "Scope looks outward: functions can use variables from the scopes around them.",
    },
    {
      question: (
        <>
          <code>{'const x = 1; function f() { const x = 2; } f();'}</code> What
          is <code>x</code> outside?
        </>
      ),
      options: ["1", "2", "undefined", "An error"],
      answerIndex: 0,
      explanation: "The inner x is a separate variable that shadows the outer one only inside f.",
    },
  ],
  exercise: {
    task: (
      <>
        Both functions have scope bugs. Fix them:
        <ol>
          <li>
            <code>describeTemperature</code> should return{" "}
            <code>&quot;hot&quot;</code> above 25 and <code>&quot;mild&quot;</code>{" "}
            otherwise.
          </li>
          <li>
            <code>addToTotal</code> should add to the <b>global</b>{" "}
            <code>total</code> and return it, so calling it with 5 then 10
            returns 15.
          </li>
        </ol>
      </>
    ),
    starter: `function describeTemperature(celsius) {\n  if (celsius > 25) {\n    let message = "hot";\n  } else {\n    let message = "mild";\n  }\n  return message;\n}\n\nlet total = 0;\n\nfunction addToTotal(amount) {\n  let total = total + amount;\n  return total;\n}\n\nconsole.log(describeTemperature(30));\nconsole.log(addToTotal(5), addToTotal(10));`,
    // The learner's own console.log already called addToTotal, so start the total afresh.
    extract: `(() => {
      total = 0;
      return {
      hot: describeTemperature(30),
      mild: describeTemperature(10),
      edge: describeTemperature(25),
      first: addToTotal(5),
      second: addToTotal(10),
      globalTotal: total,
      };
    })()`,
    tests: (values) => [
      check(values.hot === "hot", 'describeTemperature(30) → "hot"'),
      check(values.mild === "mild" && values.edge === "mild", '10 and 25 → "mild"'),
      check(values.first === 5 && values.second === 15, "addToTotal(5) → 5, then addToTotal(10) → 15"),
      check(values.globalTotal === 15, "the global total is 15 afterwards"),
    ],
    hint: (
      <>
        In the first function, declare <code>let message;</code> before the{" "}
        <code>if</code> and just assign inside. In the second, remove{" "}
        <code>let</code>: <code>total = total + amount;</code> updates the
        global instead of making a new local one.
      </>
    ),
    solution: `function describeTemperature(celsius) {\n  let message;\n  if (celsius > 25) {\n    message = "hot";\n  } else {\n    message = "mild";\n  }\n  return message;\n}\n\nlet total = 0;\n\nfunction addToTotal(amount) {\n  total = total + amount;\n  return total;\n}\n\nconsole.log(describeTemperature(30));\nconsole.log(addToTotal(5), addToTotal(10));`,
  },
};

const arrowFunctions: Stage = {
  id: "mid-arrows",
  level: "mid",
  title: "Arrow functions",
  short: "Arrow functions",
  lead: (
    <>
      Arrow functions are a shorter way to write functions:{" "}
      <code>(a, b) =&gt; a + b</code>. They&apos;re perfect for small,
      one-line functions, especially ones you pass to other functions.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="✏️">
        <b>Shorthand notes</b> versus a full letter. Same message, fewer
        words, ideal when the message is short. For anything long, the full
        letter is clearer.
      </Analogy>
      <CodeBlock
        code={`// classic function
function double(n) {
  return n * 2;
}

// the same as an arrow function
const double = (n) => {
  return n * 2;
};

// one expression? drop the { } and return: it's returned automatically
const double = (n) => n * 2;

// exactly one parameter? the ( ) are optional
const double = n => n * 2;`}
      />
      <p>The shapes you&apos;ll meet:</p>
      <CodeBlock
        code={`const rollDice = () => Math.floor(Math.random() * 6) + 1;   // no parameters
const add = (a, b) => a + b;                                 // several
const makePoint = (x, y) => ({ x: x, y: y });                // returning an object needs ( )`}
      />
      <p>
        <b>When to use which?</b> Arrows for short functions and callbacks.
        Classic <code>function</code> declarations for bigger, named building
        blocks of your program. And for methods inside objects, use method
        syntax: arrows don&apos;t get their own <code>this</code>.
      </p>
      <Tip>
        ⚠️ Once you add <code>{"{ }"}</code>, the automatic return is gone:{" "}
        <code>{"(a, b) => { a + b }"}</code> returns <code>undefined</code>.
        Either drop the braces or write <code>return</code>.
      </Tip>
    </>
  ),
  widget: { title: "Arrow lab", Component: ArrowWidget },
  quiz: [
    {
      question: (
        <>
          What does <code>{"const f = x => x + 1;"}</code> return for{" "}
          <code>f(4)</code>?
        </>
      ),
      options: ["4", "5", "undefined", "x + 1"],
      answerIndex: 1,
      explanation: "A single expression after => is returned automatically.",
    },
    {
      question: (
        <>
          What does <code>{"const f = (a, b) => { a * b };"}</code> return for{" "}
          <code>f(2, 3)</code>?
        </>
      ),
      options: ["6", "undefined", "An error", "23"],
      answerIndex: 1,
      explanation: "With braces you're writing a block, which needs an explicit return.",
    },
    {
      question: "Which arrow function returns an object?",
      options: [
        "() => { ok: true }",
        "() => ({ ok: true })",
        "() => [ok: true]",
        "() => return { ok: true }",
      ],
      answerIndex: 1,
      explanation: "The ( ) stop the { } being read as a block of code.",
    },
  ],
  exercise: {
    task: (
      <>
        Rewrite all three functions as <b>arrow functions</b> stored in{" "}
        <code>const</code>s, keeping their names and behaviour. Use the short
        form (no <code>{"{ }"}</code> or <code>return</code>) for each.
      </>
    ),
    starter: `function triple(n) {\n  return n * 3;\n}\n\nfunction isLong(word) {\n  return word.length > 5;\n}\n\nfunction fullName(first, last) {\n  return first + " " + last;\n}\n\nconsole.log(triple(4), isLong("banana"), fullName("Ada", "Lovelace"));`,
    extract: `({
      t: triple(4), t2: triple(-2),
      l1: isLong("banana"), l2: isLong("kiwi"),
      n: fullName("Ada", "Lovelace"),
    })`,
    tests: (values, code) => [
      check(values.t === 12 && values.t2 === -6, "triple still works"),
      check(values.l1 === true && values.l2 === false, "isLong still works"),
      check(values.n === "Ada Lovelace", "fullName still works"),
      check(!/\bfunction\b/.test(code), "no function keyword left"),
      check((code.match(/=>/g) ?? []).length >= 3 && !/=>\s*\{/.test(code), "three short-form arrows (no { } after =>)"),
    ],
    hint: (
      <>
        <code>{"const triple = (n) => n * 3;"}</code>, and the same shape for
        the other two.
      </>
    ),
    solution: `const triple = (n) => n * 3;\n\nconst isLong = (word) => word.length > 5;\n\nconst fullName = (first, last) => first + " " + last;\n\nconsole.log(triple(4), isLong("banana"), fullName("Ada", "Lovelace"));`,
  },
};

const callbacks: Stage = {
  id: "mid-callbacks",
  level: "mid",
  title: "Callbacks",
  short: "Callbacks",
  lead: (
    <>
      In JavaScript, functions are values: you can store them and{" "}
      <b>pass them into other functions</b>. A function passed in like this is
      called a <b>callback</b>, because the other function calls it back.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📞">
        Leaving your <b>number with a shop</b>: &quot;call me back when it&apos;s
        ready&quot;. You hand over <i>how to reach you</i>, and the shop decides{" "}
        <i>when</i> to use it.
      </Analogy>
      <CodeBlock
        code={`function shout(text) {
  return text.toUpperCase() + "!";
}

function announce(message, style) {
  console.log(style(message));   // call the function we were given
}

announce("dinner time", shout);   // DINNER TIME!
//                       ↑ no ( ): we pass the function, not its result`}
      />
      <p>
        Callbacks let one function handle the <b>repetitive part</b> while you
        supply the <b>specific part</b>:
      </p>
      <CodeBlock
        code={`function repeat(times, action) {
  for (let i = 1; i <= times; i++) {
    action(i);
  }
}

repeat(3, (n) => console.log("Lap " + n));   // the callback, written inline`}
      />
      <p>
        You&apos;ll meet callbacks everywhere: buttons call them when clicked,
        timers call them later (<code>setTimeout</code>), and array tools like{" "}
        <code>map</code> and <code>filter</code> call them once per item.
      </p>
      <Tip>
        ⚠️ Pass the function, don&apos;t call it: <code>announce(&quot;hi&quot;, shout)</code>{" "}
        not <code>announce(&quot;hi&quot;, shout())</code>. With the brackets, you&apos;d
        run <code>shout</code> straight away and pass its <i>result</i>.
      </Tip>
    </>
  ),
  widget: { title: "Call me back", Component: CallbacksWidget },
  quiz: [
    {
      question: "What is a callback?",
      options: [
        "A function that calls itself",
        "A function passed to another function, to be called by it",
        "A function that returns a phone number",
        "Any function with no parameters",
      ],
      answerIndex: 1,
      explanation: "You hand it over; the receiving function decides when to call it.",
    },
    {
      question: (
        <>
          <code>{"function run(fn) { return fn(5); }"}</code> What is{" "}
          <code>{"run(n => n * 10)"}</code>?
        </>
      ),
      options: ["5", "10", "50", "undefined"],
      answerIndex: 2,
      explanation: "run calls the callback with 5, and the callback returns 5 × 10.",
    },
    {
      question: (
        <>
          Why is <code>setTimeout(sayHi(), 1000)</code> wrong?
        </>
      ),
      options: [
        "1000 is too long",
        "It calls sayHi immediately and passes its result instead of the function",
        "setTimeout needs three arguments",
        "Nothing is wrong",
      ],
      answerIndex: 1,
      explanation: "Pass sayHi without brackets so setTimeout can call it later.",
    },
  ],
  exercise: {
    task: (
      <>
        Write two functions that take callbacks:
        <ol>
          <li>
            <code>repeat(times, action)</code>: calls <code>action(i)</code>{" "}
            for <code>i</code> from 1 up to <code>times</code>
          </li>
          <li>
            <code>applyTwice(fn, value)</code>: calls <code>fn</code> on{" "}
            <code>value</code>, then calls it again on the result, and returns
            that
          </li>
        </ol>
      </>
    ),
    starter: `function repeat(times, action) {\n\n}\n\nfunction applyTwice(fn, value) {\n\n}\n\nrepeat(3, (n) => console.log("Lap " + n));\nconsole.log(applyTwice((x) => x + 10, 1));   // 21`,
    extract: `(() => {
      const seen = [];
      repeat(4, (n) => seen.push(n));
      const none = [];
      repeat(0, (n) => none.push(n));
      return {
        seen, none,
        a: applyTwice((x) => x + 10, 1),
        b: applyTwice((s) => s + "!", "hey"),
        c: applyTwice((x) => x * x, 3),
      };
    })()`,
    tests: (values) => [
      check(isSameValue(values.seen, [1, 2, 3, 4]), "repeat(4, action) calls action with 1, 2, 3, 4"),
      check(isSameValue(values.none, []), "repeat(0, action) never calls it"),
      check(values.a === 21, "applyTwice(x => x + 10, 1) → 21"),
      check(values.b === "hey!!", 'applyTwice(s => s + "!", "hey") → "hey!!"'),
      check(values.c === 81, "applyTwice(x => x * x, 3) → 81"),
    ],
    hint: (
      <>
        <code>{"for (let i = 1; i <= times; i++) { action(i); }"}</code> and{" "}
        <code>return fn(fn(value));</code>
      </>
    ),
    solution: `function repeat(times, action) {\n  for (let i = 1; i <= times; i++) {\n    action(i);\n  }\n}\n\nfunction applyTwice(fn, value) {\n  const once = fn(value);\n  return fn(once);\n}\n\nrepeat(3, (n) => console.log("Lap " + n));\nconsole.log(applyTwice((x) => x + 10, 1));   // 21`,
  },
};

const errorHandling: Stage = {
  id: "mid-errors",
  level: "mid",
  title: "Basic error handling",
  short: "Error handling",
  lead: (
    <>
      Errors happen: bad input, missing data, a failed network request.{" "}
      <code>try</code>/<code>catch</code> lets your program respond instead
      of crashing, and <code>throw</code> lets you report problems yourself.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🤸">
        A <b>trapeze artist with a safety net</b>. They still try the trick
        (<code>try</code>). If they fall, the net catches them (
        <code>catch</code>) and the show goes on. Without the net, a fall ends
        the show.
      </Analogy>
      <CodeBlock
        code={`try {
  const data = JSON.parse("{ broken json");   // throws a SyntaxError
  console.log("never reached");
} catch (error) {
  console.log("Couldn't read the data:", error.message);
} finally {
  console.log("Runs whether it worked or not");
}

console.log("The program carries on");`}
      />
      <p>
        <b>Throwing your own errors</b> is how a function says &quot;I
        can&apos;t do this&quot; loudly, instead of quietly returning a wrong
        answer:
      </p>
      <CodeBlock
        code={`function withdraw(balance, amount) {
  if (amount <= 0) {
    throw new Error("Amount must be positive");
  }
  if (amount > balance) {
    throw new Error("Insufficient funds");
  }
  return balance - amount;
}`}
      />
      <p>
        <code>throw</code> stops the function immediately and jumps to the
        nearest <code>catch</code>, even several function calls up. Every error
        has a <code>name</code> (<code>TypeError</code>, <code>Error</code>…)
        and a <code>message</code>.
      </p>
      <Tip>
        ⚠️ Don&apos;t <b>swallow</b> errors with an empty{" "}
        <code>{"catch {}"}</code>: the problem still happened, you just
        can&apos;t see it any more. Catch errors where you can actually do
        something useful (show a message, use a fallback, try again).
      </Tip>
    </>
  ),
  widget: { title: "Catch it", Component: ErrorsWidget },
  quiz: [
    {
      question: "An error is thrown halfway through a try block. What happens to the rest of the try block?",
      options: ["It still runs", "It's skipped; catch runs instead", "The program crashes", "It runs after catch"],
      answerIndex: 1,
      explanation: "Execution jumps straight from the failing line to catch.",
    },
    {
      question: "When does finally run?",
      options: ["Only on success", "Only on error", "Always, either way", "Never with catch"],
      answerIndex: 2,
      explanation: "finally is for clean-up that must happen however the try block ended.",
    },
    {
      question: "How do you create and throw an error with a message?",
      options: [
        'error("Bad input")',
        'throw new Error("Bad input")',
        'return Error("Bad input")',
        'catch("Bad input")',
      ],
      answerIndex: 1,
      explanation: "new Error makes the error object; throw sends it up to the nearest catch.",
    },
  ],
  exercise: {
    task: (
      <>
        <ol>
          <li>
            <code>parseAge(text)</code>: convert <code>text</code> to a number.
            Throw <code>new Error(&quot;Age must be a number&quot;)</code> if it
            isn&apos;t one, or <code>new Error(&quot;Age can&apos;t be negative&quot;)</code>{" "}
            if it&apos;s below 0. Otherwise return the number.
          </li>
          <li>
            <code>safeParseAge(text)</code>: call <code>parseAge</code> inside{" "}
            <code>try</code>/<code>catch</code>; return the age, or{" "}
            <code>null</code> if it threw.
          </li>
        </ol>
      </>
    ),
    starter: `function parseAge(text) {\n\n}\n\nfunction safeParseAge(text) {\n\n}\n\nconsole.log(safeParseAge("42"), safeParseAge("forty"));`,
    extract: `(() => {
      function messageFrom(text) {
        try { parseAge(text); return "no error"; } catch (error) { return error.message; }
      }
      return {
        ok: parseAge("42"),
        notNumber: messageFrom("forty"),
        negative: messageFrom("-3"),
        safeOk: safeParseAge("7"),
        safeBad: safeParseAge("seven"),
        safeNegative: safeParseAge("-1"),
      };
    })()`,
    tests: (values, code) => [
      check(values.ok === 42, 'parseAge("42") → 42 (a number)'),
      check(values.notNumber === "Age must be a number", 'parseAge("forty") throws "Age must be a number"'),
      check(values.negative === "Age can't be negative", 'parseAge("-3") throws "Age can\'t be negative"'),
      check(values.safeOk === 7, 'safeParseAge("7") → 7'),
      check(values.safeBad === null && values.safeNegative === null, "safeParseAge returns null when parseAge throws"),
      check(/try\s*\{/.test(code) && /catch\s*(\(|\{)/.test(code) && /throw\s+new\s+Error/.test(code), "you used throw new Error and try/catch"),
    ],
    hint: (
      <>
        <code>const age = Number(text);</code> then{" "}
        <code>{'if (Number.isNaN(age)) throw new Error("Age must be a number");'}</code>
        . In safeParseAge:{" "}
        <code>{"try { return parseAge(text); } catch (error) { return null; }"}</code>
      </>
    ),
    solution: `function parseAge(text) {\n  const age = Number(text);\n  if (Number.isNaN(age)) {\n    throw new Error("Age must be a number");\n  }\n  if (age < 0) {\n    throw new Error("Age can't be negative");\n  }\n  return age;\n}\n\nfunction safeParseAge(text) {\n  try {\n    return parseAge(text);\n  } catch (error) {\n    return null;\n  }\n}\n\nconsole.log(safeParseAge("42"), safeParseAge("forty"));`,
  },
};

/** Keeps the expected fields so learners can build the result in any key order. */
function cleanRetry(result: unknown) {
  if (!isPlainObject(result)) {
    return result;
  }
  if (result.ok === true) {
    return { ok: true, value: result.value, attempts: result.attempts };
  }
  return { ok: result.ok, error: result.error, attempts: result.attempts };
}

const intermediateFinal: Stage = {
  id: "mid-final",
  level: "mid",
  title: "Intermediate final: try, try again",
  short: "Final: retry",
  lead: (
    <>
      Real programs talk to things that sometimes fail: a flaky network, a
      busy server. Write a <code>retry</code> helper that keeps trying a task
      until it works or runs out of attempts.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`// A task that fails twice, then works
let calls = 0;
const flakyTask = (attempt) => {
  calls++;
  if (calls < 3) {
    throw new Error("Server busy");
  }
  return "data!";
};

retry(flakyTask, 5);
// { ok: true, value: "data!", attempts: 3 }

retry(() => { throw new Error("Down"); }, 2);
// { ok: false, error: "Down", attempts: 2 }`}
      />
      <p>The result is a small <b>object</b> with named parts: a handy way to return several values at once. A good plan:</p>
      <ol className="my-4 list-decimal pl-10">
        <li>
          Give <code>maxAttempts</code> a <b>default</b> of 3. If it&apos;s
          below 1, <b>throw</b> an error straight away.
        </li>
        <li>
          <b>Loop</b> from attempt 1 to <code>maxAttempts</code>.
        </li>
        <li>
          Inside, <b>try</b> calling the <b>callback</b> with the attempt
          number. If it works, <b>return</b> the success object at once.
        </li>
        <li>
          In <b>catch</b>, remember the error&apos;s message and let the loop
          carry on.
        </li>
        <li>
          After the loop, return the failure object.
        </li>
      </ol>
      <PanelHeading className="mt-[22px]">Intermediate cheat sheet</PanelHeading>
      <CheatSheet>
        <Cheat code="for (let i = 0; i < n; i++)">repeat n times</Cheat>
        <Cheat code="while (condition)">repeat until something changes</Cheat>
        <Cheat code="function name(a, b = 1)">define, with a default</Cheat>
        <Cheat code="return value">hand a value back (and stop)</Cheat>
        <Cheat code="{ } blocks">let/const live inside their block</Cheat>
        <Cheat code="(a, b) => a + b">a short arrow function</Cheat>
        <Cheat code="doThing(callback)">pass a function to be called later</Cheat>
        <Cheat code="try { } catch (e) { }">handle errors</Cheat>
        <Cheat code='throw new Error("…")'>report a problem</Cheat>
      </CheatSheet>
    </>
  ),
  quiz: [
    {
      question: "Why return inside the try block as soon as the task succeeds?",
      options: [
        "return is required inside try",
        "So the loop stops: there's no need to try again",
        "To trigger the catch",
        "It doesn't matter where you return",
      ],
      answerIndex: 1,
      explanation: "return ends the whole function, which also ends the loop.",
    },
    {
      question: "What should happen if retry is called with maxAttempts set to 0?",
      options: [
        "Return { ok: true }",
        "Run the task once anyway",
        "Throw an error: zero attempts makes no sense",
        "Loop forever",
      ],
      answerIndex: 2,
      explanation: "Bad arguments are a programming mistake, so it's better to fail loudly with throw.",
    },
    {
      question: "How does retry know which attempt it's on?",
      options: [
        "The task tells it",
        "The loop counter, which is also passed to the callback",
        "A global variable",
        "It doesn't",
      ],
      answerIndex: 1,
      explanation: "The loop variable counts attempts, and passing it to the task lets the task use it too.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>retry(task, maxAttempts = 3)</code>:
        <ol>
          <li>
            Call <code>task(attempt)</code> with attempt numbers 1, 2, 3… up to{" "}
            <code>maxAttempts</code>, stopping at the first success.
          </li>
          <li>
            On success return{" "}
            <code>{"{ ok: true, value, attempts }"}</code>.
          </li>
          <li>
            If every attempt throws, return{" "}
            <code>{"{ ok: false, error, attempts }"}</code>, where{" "}
            <code>error</code> is the <b>last</b> error&apos;s message.
          </li>
          <li>
            If <code>maxAttempts</code> is less than 1, throw an Error.
          </li>
        </ol>
      </>
    ),
    starter: `function retry(task, maxAttempts = 3) {\n  // 1. check maxAttempts\n  // 2. loop over the attempts, try the task, return on success\n  // 3. after the loop, return the failure object\n}\n\nlet calls = 0;\nconsole.log(retry((attempt) => {\n  calls++;\n  if (calls < 3) throw new Error("Server busy");\n  return "data!";\n}, 5));`,
    extract: `(() => {
      let calls = 0;
      const flaky = (attempt) => { calls++; if (calls < 3) throw new Error("Server busy " + calls); return "data!"; };
      const a = retry(flaky, 5);
      const seen = [];
      const b = retry((attempt) => { seen.push(attempt); throw new Error("Down " + attempt); }, 2);
      let defaultCalls = 0;
      const c = retry(() => { defaultCalls++; throw new Error("nope"); });
      const d = retry((attempt) => attempt * 10);
      let threw = false;
      try { retry(() => 1, 0); } catch (error) { threw = true; }
      return { a, b, c, d, seen, defaultCalls, threw };
    })()`,
    tests: (values) => [
      check(isSameValue(cleanRetry(values.a), { ok: true, value: "data!", attempts: 3 }), "fails twice then works → { ok: true, value: \"data!\", attempts: 3 }"),
      check(isSameValue(cleanRetry(values.b), { ok: false, error: "Down 2", attempts: 2 }), "always fails → { ok: false, error: \"Down 2\", attempts: 2 } (the last message)"),
      check(isSameValue(values.seen, [1, 2]), "the task receives the attempt numbers 1, 2"),
      check(values.defaultCalls === 3, "maxAttempts defaults to 3"),
      check(isSameValue(cleanRetry(values.d), { ok: true, value: 10, attempts: 1 }), "succeeds first time → attempts: 1"),
      check(values.threw === true, "maxAttempts of 0 throws an error"),
    ],
    hint: (
      <>
        <code>{'if (maxAttempts < 1) throw new Error("maxAttempts must be at least 1");'}</code>{" "}
        then <code>{'let lastError = "";'}</code> and{" "}
        <code>
          {"for (let attempt = 1; attempt <= maxAttempts; attempt++) { try { const value = task(attempt); return { ok: true, value: value, attempts: attempt }; } catch (error) { lastError = error.message; } }"}
        </code>
      </>
    ),
    solution: `function retry(task, maxAttempts = 3) {\n  if (maxAttempts < 1) {\n    throw new Error("maxAttempts must be at least 1");\n  }\n\n  let lastError = "";\n  for (let attempt = 1; attempt <= maxAttempts; attempt++) {\n    try {\n      const value = task(attempt);\n      return { ok: true, value: value, attempts: attempt };\n    } catch (error) {\n      lastError = error.message;\n    }\n  }\n\n  return { ok: false, error: lastError, attempts: maxAttempts };\n}\n\nlet calls = 0;\nconsole.log(retry((attempt) => {\n  calls++;\n  if (calls < 3) throw new Error("Server busy");\n  return "data!";\n}, 5));`,
  },
};

export const FOUNDATIONS_INTERMEDIATE_STAGES: Stage[] = [
  loops,
  functions,
  parameters,
  returnValues,
  scope,
  arrowFunctions,
  callbacks,
  errorHandling,
  intermediateFinal,
];
