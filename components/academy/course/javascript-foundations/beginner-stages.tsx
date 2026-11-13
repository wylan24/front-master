import type { Stage } from "@/lib/academy/types";
import { extractVariables } from "@/lib/academy/format";
import { Analogy, CodeBlock, Cheat, CheatSheet, PanelHeading, Tip } from "../../content";
import { check } from "../check";
import { CodePlayground } from "../../widgets/code-playground";
import { ExpressionExplorer } from "../../widgets/expression-explorer";
import { VariableBoxesWidget } from "../../widgets/variable-boxes";
import { IfElseBranchesWidget } from "../../widgets/if-else-branches";

// ---------------------------------------------------------------------------
// Widgets for this section
// ---------------------------------------------------------------------------

function FirstProgramWidget() {
  return (
    <CodePlayground
      intro="Run each example. Then edit it: change the text, add another line, break it on purpose."
      examples={[
        {
          label: "Hello, world",
          code: `console.log("Hello, world!");`,
          lookFor: "Whatever is in the brackets appears in the console.",
        },
        {
          label: "Several values",
          code: `console.log("I am", 25, "years old");
console.log(10 + 5);
console.log("10" + "5");`,
          lookFor: "Commas log several values; maths is worked out first. Quotes make 10 + 5 behave very differently.",
        },
        {
          label: "Case matters",
          code: `Console.log("Will this work?");`,
          lookFor: "JavaScript is case-sensitive: Console is not console.",
        },
        {
          label: "Missing quote",
          code: `console.log("Oops);`,
          lookFor: "A missing quote is a syntax error. Read the message: it tells you what JavaScript expected.",
        },
      ]}
    />
  );
}

function HowItRunsWidget() {
  return (
    <CodePlayground
      intro="Predict the console output before you press Run."
      examples={[
        {
          label: "Top to bottom",
          code: `console.log("first");
console.log("second");
console.log("third");`,
          lookFor: "One statement at a time, in order.",
        },
        {
          label: "Error halfway",
          code: `console.log("step 1");
console.log(notDefinedYet);
console.log("step 3");`,
          lookFor: "step 1 runs, then the error stops everything. step 3 never happens.",
        },
        {
          label: "Syntax error",
          code: `console.log("step 1");
console.log("step 2";
console.log("step 3");`,
          lookFor: "Nothing at all is logged: a syntax error is caught before any line runs.",
        },
        {
          label: "Comments",
          code: `// This line is a note for humans. JavaScript skips it.
console.log("visible");
/* Block comments can
   span several lines. */
// console.log("switched off");`,
          lookFor: "Commenting a line out is a quick way to switch it off.",
        },
      ]}
    />
  );
}

function TypeofWidget() {
  return (
    <ExpressionExplorer
      intro="typeof tells you what kind of value something is. Guess each one."
      expressions={[
        { code: 'typeof "hello"', note: "Text in quotes is a string." },
        { code: "typeof 42", note: "Whole numbers and decimals are both just number." },
        { code: 'typeof "42"', note: "Quotes make it text, even if it looks like a number." },
        { code: "typeof true", note: "true and false are booleans." },
        { code: "typeof undefined", note: "The value of something that was never given a value." },
        { code: "typeof null", note: "A famous bug from 1995 that can never be fixed: null is not really an object." },
        { code: "typeof [1, 2, 3]", note: "Arrays are a kind of object. Use Array.isArray to spot them." },
        { code: "typeof { name: 'Ada' }", note: "Objects group named values together." },
      ]}
      ownExpressionStart="typeof 3.14"
    />
  );
}

function StringsWidget() {
  return (
    <ExpressionExplorer
      intro="Strings come with built-in tools. Predict each result."
      setup={`const city = "Lisbon";
const name = "  Ada Lovelace  ";
const age = 36;`}
      expressions={[
        { code: "city.length", note: "How many characters." },
        { code: "city[0]", note: "Characters are counted from 0, like floors in a building." },
        { code: "city.toUpperCase()", note: "Returns a new string; city itself is unchanged." },
        { code: 'city.includes("bon")', note: "Is this text somewhere inside?" },
        { code: "city.slice(0, 3)", note: "From index 0 up to (not including) index 3." },
        { code: "name.trim()", note: "Removes spaces at both ends, handy for form input." },
        { code: '"Hi " + city + "!"', note: "Joining strings with + is called concatenation." },
        { code: "`${city} is ${age * 10} years old?`", note: "Template literals: backticks, with ${} for any expression." },
      ]}
      ownExpressionStart="city.toLowerCase()"
    />
  );
}

function NumbersWidget() {
  return (
    <ExpressionExplorer
      intro="Most of these work like a calculator. A few will surprise you."
      expressions={[
        { code: "7 + 3 * 2", note: "Multiplication happens before addition, as in maths." },
        { code: "(7 + 3) * 2", note: "Brackets go first." },
        { code: "17 % 5", note: "% gives the remainder: 17 ÷ 5 is 3, remainder 2." },
        { code: "2 ** 10", note: "** is 'to the power of'." },
        { code: "0.1 + 0.2", note: "Computers store decimals in binary, so tiny rounding errors appear." },
        { code: "Math.round(4.5)", note: "Rounds to the nearest whole number." },
        { code: "Math.floor(4.9)", note: "Always rounds down." },
        { code: "(19.999).toFixed(2)", note: "toFixed gives a string, ready for display." },
        { code: '"abc" * 2', note: "NaN means 'Not a Number': the result of maths that makes no sense." },
        { code: "10 / 0", note: "Dividing by zero gives Infinity, not an error." },
      ]}
      ownExpressionStart="Math.max(4, 19, 7)"
    />
  );
}

function BooleanLogicWidget() {
  return (
    <ExpressionExplorer
      intro="Imagine a cinema: you can watch if you're old enough AND have a ticket. Predict each answer."
      setup={`const age = 16;
const hasTicket = true;
const isMember = false;`}
      expressions={[
        { code: "age >= 18", note: "A comparison always produces true or false." },
        { code: "age >= 18 && hasTicket", note: "&& (AND) needs both sides to be true." },
        { code: "age >= 12 && hasTicket", note: "Both true, so true." },
        { code: "hasTicket || isMember", note: "|| (OR) needs at least one side to be true." },
        { code: "!hasTicket", note: "! (NOT) flips true and false." },
        { code: "!(age >= 18) && !isMember", note: "Brackets help: not an adult, and not a member." },
      ]}
      ownExpressionStart="isMember || age > 15"
    />
  );
}

function ComparisonsWidget() {
  return (
    <ExpressionExplorer
      intro="Comparisons and operators. Some of the string ones are tricky."
      setup={`let score = 10;`}
      expressions={[
        { code: "5 === 5", note: "=== means 'exactly equal': same value, same type." },
        { code: '5 === "5"', note: "Different types (number vs string), so false." },
        { code: "5 !== 6", note: "!== means 'not exactly equal'." },
        { code: '"apple" < "banana"', note: "Strings compare alphabetically, character by character." },
        { code: '"Zebra" < "apple"', note: "Capital letters come before lowercase ones. Watch out when sorting names." },
        { code: '"10" < "9"', note: "As strings, \"1\" comes before \"9\", so this is true. Compare numbers as numbers." },
        { code: "(score += 5, score)", note: "+= adds to the variable and stores the result." },
        { code: "(score++, score)", note: "++ adds exactly one." },
      ]}
      ownExpressionStart="3 > 2 && 2 > 1"
    />
  );
}

function ConversionWidget() {
  return (
    <ExpressionExplorer
      intro="Explicit conversions (you ask) and implicit coercion (JavaScript guesses). Guess first."
      expressions={[
        { code: 'Number("42")', note: "Explicit: text to number." },
        { code: 'Number("42px")', note: "Not a clean number, so NaN." },
        { code: 'parseInt("42px")', note: "parseInt reads digits from the start and stops at the first non-digit." },
        { code: 'Number("")', note: "Trap: an empty string becomes 0, not NaN." },
        { code: "String(99)", note: "Number to text." },
        { code: '"5" + 1', note: "+ with a string joins text, so 1 becomes \"1\"." },
        { code: '"5" - 1', note: "- only does maths, so \"5\" becomes 5." },
        { code: '"3" * "4"', note: "* also forces numbers." },
        { code: "1 + true", note: "true becomes 1 in maths." },
      ]}
      ownExpressionStart='Number("3.5") + 1'
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const whatIsJavaScript: Stage = {
  id: "what",
  level: "basic",
  title: "What is JavaScript?",
  short: "What is JavaScript?",
  lead: (
    <>
      JavaScript is the programming language of the web. It makes pages
      react to you, and it also runs servers, apps and tools. You give it
      instructions; it carries them out.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🎭">
        A website is a <b>theatre show</b>. HTML is the stage and the actors
        (what&apos;s there). CSS is the costumes and lighting (how it looks).{" "}
        <b>JavaScript is the script</b>: what happens, and when, as the
        audience reacts.
      </Analogy>
      <p>
        Every program is a list of <b>instructions</b>, called statements. Here
        is the classic first one:
      </p>
      <CodeBlock code={`console.log("Hello, world!");`} />
      <p>
        <code>console.log</code> prints whatever you put in its brackets to the{" "}
        <b>console</b>, a panel developers use to see what their code is doing.
        You&apos;ll use it constantly to check your work.
      </p>
      <CodeBlock
        code={`console.log("Text goes in quotes");
console.log(42);                 // numbers don't
console.log("Total:", 10 + 5);   // commas log several values: Total: 15`}
      />
      <p>
        Lines starting with <code>{"//"}</code> are <b>comments</b>: notes for
        humans that JavaScript ignores. The semicolon <code>;</code> marks the
        end of a statement.
      </p>
      <Tip>
        💡 JavaScript is <b>case-sensitive</b>: <code>console.log</code> works,{" "}
        <code>Console.log</code> and <code>console.Log</code> don&apos;t. Most
        early errors are a typo, a missing quote or a missing bracket.
      </Tip>
    </>
  ),
  widget: { title: "Your first programs", Component: FirstProgramWidget },
  quiz: [
    {
      question: (
        <>
          What does <code>console.log(&quot;Hi&quot;)</code> do?
        </>
      ),
      options: [
        "Shows a pop-up on the page",
        "Prints Hi to the developer console",
        "Saves Hi to a file",
        "Nothing until you refresh",
      ],
      answerIndex: 1,
      explanation: "console.log writes to the console, the developer's window into what the code is doing.",
    },
    {
      question: "Which line prints the text Good morning?",
      options: [
        "console.log(Good morning);",
        'console.log("Good morning");',
        'Console.log("Good morning");',
        'console.log "Good morning";',
      ],
      answerIndex: 1,
      explanation: "Text needs quotes, the name must be lowercase console, and the value goes in brackets.",
    },
    {
      question: (
        <>
          What does <code>console.log(2 + 3)</code> print?
        </>
      ),
      options: ["2 + 3", "5", '"5"', "23"],
      answerIndex: 1,
      explanation: "Without quotes it's maths, so JavaScript works it out first and prints 5.",
    },
  ],
  exercise: {
    task: (
      <>
        Write a program that logs two lines:
        <ol>
          <li>
            the exact text <code>Hello, JavaScript!</code>
          </li>
          <li>
            the result of <code>7 * 6</code> (let JavaScript do the maths;
            don&apos;t type 42)
          </li>
        </ol>
      </>
    ),
    starter: `// Your two console.log lines go here\n`,
    extract: "null",
    tests: (_values, code, logs) => [
      check(logs.length === 2, "exactly two lines were logged"),
      check(logs[0] === "Hello, JavaScript!", "line 1 is Hello, JavaScript!"),
      check(logs[1] === "42", "line 2 is 42"),
      check(/7\s*\*\s*6/.test(code) && !/42/.test(code), "you calculated 7 * 6 instead of typing 42"),
    ],
    hint: (
      <>
        <code>console.log(&quot;Hello, JavaScript!&quot;);</code> then{" "}
        <code>console.log(7 * 6);</code> (no quotes around the maths).
      </>
    ),
    solution: `console.log("Hello, JavaScript!");\nconsole.log(7 * 6);`,
  },
};

const howJavaScriptRuns: Stage = {
  id: "runs",
  level: "basic",
  title: "How JavaScript runs",
  short: "How it runs",
  lead: (
    <>
      JavaScript reads your code first, then runs it <b>one statement at a
      time, top to bottom</b>. If a statement fails, the program stops there.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🍳">
        Following a <b>recipe</b>. You do step 1, then step 2, then step 3. If
        step 2 says &quot;add the eggs&quot; and there are no eggs, you stop:
        steps after it never happen.
      </Analogy>
      <p>
        The program that runs JavaScript is called an <b>engine</b>. Every
        browser has one (Chrome&apos;s is called V8), and Node.js lets the same
        engine run outside the browser. Two things happen when you run code:
      </p>
      <ol className="my-4 list-decimal pl-10">
        <li>
          <b>Read.</b> The engine checks the whole script is valid JavaScript.
          A <b>syntax error</b> (a missing bracket, say) means it refuses to
          run <i>any</i> of it.
        </li>
        <li>
          <b>Run.</b> Statements execute in order. A <b>runtime error</b>{" "}
          (like using something that doesn&apos;t exist) stops the program at
          that line.
        </li>
      </ol>
      <CodeBlock
        code={`console.log("step 1");        // runs
console.log(price);           // ❌ ReferenceError: price is not defined
console.log("step 3");        // never runs`}
      />
      <p>
        Error messages look scary but they&apos;re helpful: they name the{" "}
        <b>kind</b> of problem (<code>ReferenceError</code>,{" "}
        <code>SyntaxError</code>, <code>TypeError</code>) and usually the line.
        Read them before changing anything.
      </p>
      <Tip>
        💡 Comments are also a debugging tool. Put <code>{"//"}</code> in front of
        a line to switch it off without deleting it, and use{" "}
        <code>console.log</code> to check values as the program runs.
      </Tip>
    </>
  ),
  widget: { title: "Watch the order", Component: HowItRunsWidget },
  quiz: [
    {
      question: "A script's second line throws an error. What happens to the third line?",
      options: ["It runs anyway", "It never runs", "It runs first", "It runs twice"],
      answerIndex: 1,
      explanation: "A runtime error stops the program at the line where it happens.",
    },
    {
      question: "A script has a missing bracket on line 10. What is logged by line 1?",
      options: [
        "Line 1 still logs normally",
        "Nothing: a syntax error stops the whole script before it starts",
        "Only the first word",
        "An error from line 1",
      ],
      answerIndex: 1,
      explanation: "The engine checks the whole script before running it, so a syntax error anywhere means nothing runs.",
    },
    {
      question: "What does JavaScript do with // comments?",
      options: ["Prints them", "Ignores them", "Treats them as errors", "Runs them last"],
      answerIndex: 1,
      explanation: "Comments are notes for people; the engine skips them entirely.",
    },
  ],
  exercise: {
    task: (
      <>
        This recipe program is broken. Fix the error and put the lines in the
        right order, so the console shows steps 1, 2, 3 in order (keep the
        text exactly as it is).
      </>
    ),
    starter: `console.log("3. Bake for 20 minutes");\nconsol.log("2. Pour into a tin");\nconsole.log("1. Mix the flour and eggs");`,
    extract: "null",
    tests: (_values, _code, logs) => [
      check(logs.length === 3, "three lines were logged (no error stopped the program)"),
      check(logs[0] === "1. Mix the flour and eggs", "step 1 comes first"),
      check(logs[1] === "2. Pour into a tin", "step 2 comes second"),
      check(logs[2] === "3. Bake for 20 minutes", "step 3 comes last"),
    ],
    hint: (
      <>
        Look closely at <code>consol.log</code>; it&apos;s missing a letter.
        Then move the lines so they run top to bottom in order.
      </>
    ),
    solution: `console.log("1. Mix the flour and eggs");\nconsole.log("2. Pour into a tin");\nconsole.log("3. Bake for 20 minutes");`,
  },
};

const variables: Stage = {
  id: "variables",
  level: "basic",
  title: "Variables: let, const and var",
  short: "Variables",
  lead: (
    <>
      A variable is a <b>named box</b> that holds a value so you can use it
      later. Use <code>const</code> for values that won&apos;t be replaced and{" "}
      <code>let</code> for values that will.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📦">
        <b>Labelled storage boxes.</b> <code>let</code> is a box you can empty
        and refill. <code>const</code> is a box sealed with tape once
        it&apos;s filled. The label (the name) is how you find it again.
      </Analogy>
      <CodeBlock
        code={`const name = "Ada";     // declare and fill a sealed box
let score = 0;          // a box you can refill

score = 10;             // reassign: no keyword this time
score = score + 5;      // read the old value, store the new one: 15

name = "Bo";            // ❌ TypeError: Assignment to constant variable.`}
      />
      <p>
        <b>Declaring</b> (with <code>let</code> or <code>const</code>) creates
        the box, and you only do it once per name. <b>Assigning</b> with{" "}
        <code>=</code> puts a value in. In JavaScript, <code>=</code> means
        &quot;store&quot;, not &quot;equals&quot;.
      </p>
      <p>
        <b>Which one?</b> Start with <code>const</code>. Switch to{" "}
        <code>let</code> only when you actually need to reassign (a counter, a
        running total). This makes code easier to trust: a <code>const</code>{" "}
        always means what it meant when you first read it.
      </p>
      <p>
        <b>What about var?</b> It&apos;s the original keyword from 1995. It
        follows older, looser rules (you&apos;ll see why in the advanced
        section), so modern code doesn&apos;t use it. Recognise it, but
        don&apos;t write it.
      </p>
      <Tip>
        💡 Names: use <code>camelCase</code> (<code>totalPrice</code>,{" "}
        <code>isLoggedIn</code>), start with a letter, and make them
        descriptive. Names can&apos;t contain spaces or dashes, can&apos;t start
        with a digit, and are case-sensitive (<code>score</code> ≠{" "}
        <code>Score</code>).
      </Tip>
    </>
  ),
  widget: { title: "Variable boxes", Component: VariableBoxesWidget },
  quiz: [
    {
      question: "Which variable can be given a new value later?",
      options: ["const total = 5;", "let total = 5;", "Both", "Neither"],
      answerIndex: 1,
      explanation: "let can be reassigned. const can't be pointed at a new value.",
    },
    {
      question: (
        <>
          <code>let x = 4; x = x + 1;</code> What is <code>x</code>?
        </>
      ),
      options: ["4", "5", "x + 1", "An error"],
      answerIndex: 1,
      explanation: "The right side is worked out first (4 + 1), then stored back into x.",
    },
    {
      question: "Which is a valid variable name?",
      options: ["2ndPlace", "total-price", "first name", "userAge"],
      answerIndex: 3,
      explanation: "Names can't start with a digit or contain dashes or spaces. userAge is perfect camelCase.",
    },
  ],
  exercise: {
    task: (
      <>
        <ol>
          <li>
            Create a <code>const</code> called <code>playerName</code> holding
            any name (a string).
          </li>
          <li>
            Create a <code>let</code> called <code>score</code> starting at{" "}
            <code>0</code>.
          </li>
          <li>
            Then add 10 to <code>score</code> <b>twice</b>, on two separate
            lines, so it ends at <code>20</code>.
          </li>
        </ol>
        Don&apos;t use <code>var</code>.
      </>
    ),
    starter: `// 1. playerName\n\n// 2. score\n\n// 3. add 10, twice\n\n\nconsole.log(playerName, score);`,
    extract: extractVariables(["playerName", "score"]),
    tests: (values, code) => {
      const reassignments = code.match(/score\s*(\+=|=\s*score\s*\+)/g) ?? [];
      return [
        check(typeof values.playerName === "string" && values.playerName !== "", "playerName holds a string"),
        check(/const\s+playerName\b/.test(code), "playerName uses const"),
        check(/let\s+score\s*=\s*0\b/.test(code), "score starts with let score = 0"),
        check(values.score === 20, "score ends at 20"),
        check(reassignments.length >= 2, "you added to score on two separate lines"),
        check(!/\bvar\b/.test(code), "no var"),
      ];
    },
    hint: (
      <>
        <code>score = score + 10;</code> (or the shortcut{" "}
        <code>score += 10;</code>) on two lines. No <code>let</code> in front:
        the box already exists.
      </>
    ),
    solution: `const playerName = "Ada";\n\nlet score = 0;\n\nscore = score + 10;\nscore = score + 10;\n\nconsole.log(playerName, score);`,
  },
};

const dataTypes: Stage = {
  id: "types",
  level: "basic",
  title: "Data types",
  short: "Data types",
  lead: (
    <>
      Every value has a <b>type</b>: text, a number, true/false, nothing, or a
      collection. The type decides what you can do with it, and{" "}
      <code>typeof</code> tells you what it is.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🧰">
        Different <b>materials</b> in a workshop. You can saw wood and you can
        pour water, but not the other way round. JavaScript needs to know what
        a value is made of before it knows what to do with it.
      </Analogy>
      <p>The everyday types:</p>
      <CodeBlock
        code={`"Ada"          // string: text, always in quotes
42, 3.14, -7   // number: whole numbers and decimals alike
true, false    // boolean: yes or no
undefined      // "no value has been given yet"
null           // "deliberately empty"
[1, 2, 3]      // array: an ordered list (a kind of object)
{ name: "Ada" }// object: named values grouped together`}
      />
      <p>
        <b>Values have types; variables don&apos;t.</b> A <code>let</code>{" "}
        variable can hold a number now and a string later. That flexibility is
        why checking types matters:
      </p>
      <CodeBlock
        code={`typeof "hi"        // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof [1, 2]      // "object"   ← use Array.isArray([1, 2]) → true
typeof null        // "object"   ← a famous old bug!`}
      />
      <Tip>
        ⚠️ <code>&quot;42&quot;</code> (a string) and <code>42</code> (a number)
        look alike but behave differently. Data from forms and web pages
        usually arrives as strings, even when it looks like a number. Two rarer
        types, <code>bigint</code> and <code>symbol</code>, exist too;
        you&apos;ll rarely need them.
      </Tip>
    </>
  ),
  widget: { title: "What type is it?", Component: TypeofWidget },
  quiz: [
    {
      question: (
        <>
          What is <code>typeof &quot;7&quot;</code>?
        </>
      ),
      options: ['"number"', '"string"', '"seven"', '"text"'],
      answerIndex: 1,
      explanation: "The quotes make it a string, whatever is inside them.",
    },
    {
      question: (
        <>
          What is <code>typeof null</code>?
        </>
      ),
      options: ['"null"', '"undefined"', '"object"', '"empty"'],
      answerIndex: 2,
      explanation: "It's a long-standing bug in JavaScript. null is its own type, but typeof reports \"object\".",
    },
    {
      question: "How do you check whether a value is an array?",
      options: ['typeof value === "array"', "Array.isArray(value)", "value.isArray", 'value === "array"'],
      answerIndex: 1,
      explanation: "typeof says \"object\" for arrays, so use Array.isArray.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>describeType(value)</code> that returns:
        <ol>
          <li>
            <code>&quot;text&quot;</code> for strings
          </li>
          <li>
            <code>&quot;number&quot;</code> for numbers
          </li>
          <li>
            <code>&quot;yes/no&quot;</code> for booleans
          </li>
          <li>
            <code>&quot;nothing&quot;</code> for <code>null</code> or{" "}
            <code>undefined</code>
          </li>
          <li>
            <code>&quot;list&quot;</code> for arrays
          </li>
          <li>
            <code>&quot;object&quot;</code> for anything else
          </li>
        </ol>
      </>
    ),
    starter: `function describeType(value) {\n  // check null/undefined and arrays BEFORE you trust typeof "object"\n\n}\n\nconsole.log(describeType("hi"), describeType(null), describeType([1]));`,
    extract: `({
      text: describeType("hi"),
      emptyText: describeType(""),
      number: describeType(3.5),
      boolean: describeType(false),
      nothingNull: describeType(null),
      nothingUndefined: describeType(undefined),
      list: describeType([1, 2]),
      object: describeType({ a: 1 }),
      numberLike: describeType("42"),
    })`,
    tests: (values) => [
      check(values.text === "text" && values.emptyText === "text" && values.numberLike === "text", 'strings (even "" and "42") → "text"'),
      check(values.number === "number", '3.5 → "number"'),
      check(values.boolean === "yes/no", 'false → "yes/no"'),
      check(values.nothingNull === "nothing" && values.nothingUndefined === "nothing", 'null and undefined → "nothing"'),
      check(values.list === "list", '[1, 2] → "list"'),
      check(values.object === "object", '{ a: 1 } → "object"'),
    ],
    hint: (
      <>
        Check in this order:{" "}
        <code>{'if (value === null || value === undefined) return "nothing";'}</code>
        , then <code>{'if (Array.isArray(value)) return "list";'}</code>, then{" "}
        <code>{'if (typeof value === "string") return "text";'}</code> and so on.
      </>
    ),
    solution: `function describeType(value) {\n  if (value === null || value === undefined) {\n    return "nothing";\n  }\n  if (Array.isArray(value)) {\n    return "list";\n  }\n  if (typeof value === "string") {\n    return "text";\n  }\n  if (typeof value === "number") {\n    return "number";\n  }\n  if (typeof value === "boolean") {\n    return "yes/no";\n  }\n  return "object";\n}\n\nconsole.log(describeType("hi"), describeType(null), describeType([1]));`,
  },
};

const strings: Stage = {
  id: "strings",
  level: "basic",
  title: "Strings and template literals",
  short: "Strings",
  lead: (
    <>
      Strings hold text. They come with tools for measuring, searching and
      changing it, and <b>template literals</b> (backticks) make building
      text out of values easy to read.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📿">
        A string is a <b>bead necklace</b> of characters. Each bead has a
        position number starting at 0, and the necklace knows its own length.
        You can&apos;t change a bead in place; you make a new necklace.
      </Analogy>
      <CodeBlock
        code={`const city = "Lisbon";      // "double" or 'single' quotes both work

city.length           // 6
city[0]               // "L"   ← positions start at 0
city.toUpperCase()    // "LISBON"
city.includes("bon")  // true
city.slice(0, 3)      // "Lis" (from 0 up to, not including, 3)
"  hi  ".trim()       // "hi"  (strips spaces at both ends)`}
      />
      <p>
        Methods like <code>toUpperCase</code> <b>return a new string</b>; the
        original never changes. Store the result if you need it.
      </p>
      <p>
        <b>Building text.</b> You can join strings with <code>+</code>, but
        it gets fiddly. Template literals use backticks{" "}
        <code>`…`</code> and drop any expression in with{" "}
        <code>{"${ }"}</code>:
      </p>
      <CodeBlock
        code={`const name = "Ada";
const items = 3;

"Hi " + name + ", you have " + items + " items."      // works, but fiddly
\`Hi \${name}, you have \${items} items.\`               // much clearer
\`Total: £\${(items * 2.5).toFixed(2)}\`                 // any expression works
\`Line one
Line two\`                                            // and they can span lines`}
      />
      <Tip>
        ⚠️ Quotes must match: <code>&quot;it&apos;s&quot;</code> is fine (single
        inside double), but <code>&apos;it&apos;s&apos;</code> ends early. Template
        literals avoid most quote headaches. Also, <code>{"${ }"}</code> only
        works inside backticks; in normal quotes it&apos;s just text.
      </Tip>
    </>
  ),
  widget: { title: "String tools", Component: StringsWidget },
  quiz: [
    {
      question: (
        <>
          What is <code>&quot;cat&quot;.length</code>?
        </>
      ),
      options: ["2", "3", "4", '"cat"'],
      answerIndex: 1,
      explanation: "length counts characters: c, a, t.",
    },
    {
      question: (
        <>
          <code>const n = 5;</code> Which gives <code>You have 5 points</code>?
        </>
      ),
      options: [
        '"You have ${n} points"',
        "`You have ${n} points`",
        "'You have ' n ' points'",
        "`You have n points`",
      ],
      answerIndex: 1,
      explanation: "${ } only works inside backticks.",
    },
    {
      question: (
        <>
          <code>let s = &quot;hi&quot;; s.toUpperCase();</code> What is{" "}
          <code>s</code> now?
        </>
      ),
      options: ['"HI"', '"hi"', "undefined", '"Hi"'],
      answerIndex: 1,
      explanation: "String methods return a new string. s still holds \"hi\" unless you store the result.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>makeBadge(first, last, role)</code> that returns text like{" "}
        <code>&quot;LOVELACE, Ada (Engineer)&quot;</code>: the last name in
        capitals, a comma, the first name, then the role in brackets. Use a{" "}
        <b>template literal</b>.
      </>
    ),
    starter: "function makeBadge(first, last, role) {\n  // use backticks and ${ }\n\n}\n\nconsole.log(makeBadge(\"Ada\", \"Lovelace\", \"Engineer\"));",
    extract: `({
      a: makeBadge("Ada", "Lovelace", "Engineer"),
      b: makeBadge("Grace", "Hopper", "Admiral"),
      c: makeBadge("Alan", "turing", "Mathematician"),
    })`,
    tests: (values, code) => [
      check(values.a === "LOVELACE, Ada (Engineer)", '("Ada", "Lovelace", "Engineer") → "LOVELACE, Ada (Engineer)"'),
      check(values.b === "HOPPER, Grace (Admiral)", '("Grace", "Hopper", "Admiral") → "HOPPER, Grace (Admiral)"'),
      check(values.c === "TURING, Alan (Mathematician)", "a lowercase last name is capitalised too"),
      check(/`[^`]*\$\{[^`]*`/.test(code), "you used a template literal"),
    ],
    hint: (
      <>
        <code>{"return `${last.toUpperCase()}, ${first} (${role})`;"}</code>
      </>
    ),
    solution: "function makeBadge(first, last, role) {\n  return `${last.toUpperCase()}, ${first} (${role})`;\n}\n\nconsole.log(makeBadge(\"Ada\", \"Lovelace\", \"Engineer\"));",
  },
};

const numbers: Stage = {
  id: "numbers",
  level: "basic",
  title: "Numbers and mathematical operations",
  short: "Numbers & maths",
  lead: (
    <>
      JavaScript does maths like a calculator, with a few extra operators and
      a built-in <code>Math</code> toolbox. It also has a couple of quirks
      every developer needs to know about.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🧮">
        A <b>calculator</b> that follows school maths rules (multiply before
        add, brackets first), plus a drawer of extra tools:{" "}
        <code>Math.round</code>, <code>Math.max</code>,{" "}
        <code>Math.random</code>…
      </Analogy>
      <CodeBlock
        code={`10 + 3    // 13
10 - 3    // 7
10 * 3    // 30
10 / 4    // 2.5   (there's one number type for whole and decimal)
10 % 3    // 1     remainder: 10 ÷ 3 is 3, remainder 1
2 ** 3    // 8     power
7 + 3 * 2 // 13    multiplication first; (7 + 3) * 2 is 20`}
      />
      <p>
        <code>%</code> (remainder) is more useful than it looks:{" "}
        <code>n % 2 === 0</code> means &quot;n is even&quot;.
      </p>
      <CodeBlock
        code={`Math.round(4.6)    // 5
Math.floor(4.6)    // 4   always down
Math.ceil(4.1)     // 5   always up
Math.max(3, 9, 4)  // 9
Math.random()      // a random decimal from 0 up to (not including) 1

(12.5).toFixed(2)  // "12.50", a string for display`}
      />
      <p>
        <b>Two quirks.</b> Decimals are stored in binary, so{" "}
        <code>0.1 + 0.2</code> is <code>0.30000000000000004</code>. Round
        before displaying, or work in whole units (pence instead of pounds).
        And maths that makes no sense gives <code>NaN</code> (&quot;Not a
        Number&quot;) rather than an error.
      </p>
      <Tip>
        💡 To round to 2 decimal places and keep a <b>number</b>:{" "}
        <code>Math.round(x * 100) / 100</code>. Use <code>toFixed(2)</code>{" "}
        only for the final text you show people.
      </Tip>
    </>
  ),
  widget: { title: "Calculator lab", Component: NumbersWidget },
  quiz: [
    {
      question: (
        <>
          What is <code>2 + 3 * 4</code>?
        </>
      ),
      options: ["20", "14", "24", "9"],
      answerIndex: 1,
      explanation: "Multiplication first: 3 × 4 = 12, then 2 + 12 = 14.",
    },
    {
      question: (
        <>
          What is <code>15 % 4</code>?
        </>
      ),
      options: ["3.75", "3", "4", "1"],
      answerIndex: 1,
      explanation: "15 ÷ 4 is 3 with 3 left over. % gives the leftover.",
    },
    {
      question: "Which keeps the result a number, rounded to 2 decimal places?",
      options: ["x.toFixed(2)", "Math.round(x * 100) / 100", "Math.floor(x, 2)", "round(x, 2)"],
      answerIndex: 1,
      explanation: "toFixed returns a string. Multiply, round, divide keeps a number.",
    },
  ],
  exercise: {
    task: (
      <>
        Write two functions:
        <ol>
          <li>
            <code>splitBill(total, people, tipPercent)</code>: add the tip to
            the total, divide between the people, and return the share as a{" "}
            <b>number</b> rounded to 2 decimal places
          </li>
          <li>
            <code>isEven(n)</code>: <code>true</code> if <code>n</code> is even,
            using <code>%</code>
          </li>
        </ol>
      </>
    ),
    starter: `function splitBill(total, people, tipPercent) {\n\n}\n\nfunction isEven(n) {\n\n}\n\nconsole.log(splitBill(100, 4, 10));   // 27.5\nconsole.log(isEven(7));`,
    extract: `({
      a: splitBill(100, 4, 10),
      b: splitBill(50, 3, 0),
      c: splitBill(84.5, 2, 12.5),
      e1: isEven(4), e2: isEven(7), e3: isEven(0), e4: isEven(-3),
    })`,
    tests: (values, code) => [
      check(values.a === 27.5, "splitBill(100, 4, 10) → 27.5"),
      check(values.b === 16.67, "splitBill(50, 3, 0) → 16.67 (rounded)"),
      check(values.c === 47.53, "splitBill(84.5, 2, 12.5) → 47.53"),
      check(values.e1 === true && values.e3 === true, "isEven(4) and isEven(0) → true"),
      check(values.e2 === false && values.e4 === false, "isEven(7) and isEven(-3) → false"),
      check(/%/.test(code), "you used %"),
    ],
    hint: (
      <>
        <code>const withTip = total * (1 + tipPercent / 100);</code> then{" "}
        <code>return Math.round((withTip / people) * 100) / 100;</code>. For
        isEven: <code>return n % 2 === 0;</code>
      </>
    ),
    solution: `function splitBill(total, people, tipPercent) {\n  const withTip = total * (1 + tipPercent / 100);\n  const share = withTip / people;\n  return Math.round(share * 100) / 100;\n}\n\nfunction isEven(n) {\n  return n % 2 === 0;\n}\n\nconsole.log(splitBill(100, 4, 10));   // 27.5\nconsole.log(isEven(7));`,
  },
};

const booleans: Stage = {
  id: "booleans",
  level: "basic",
  title: "Booleans and logic",
  short: "Booleans",
  lead: (
    <>
      A boolean is either <code>true</code> or <code>false</code>: the answer
      to a yes/no question. Combine questions with <code>&amp;&amp;</code>{" "}
      (and), <code>||</code> (or) and <code>!</code> (not).
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🎟️">
        A <b>cinema door check</b>: you get in if you&apos;re old enough{" "}
        <b>and</b> have a ticket. A member gets a discount if they have a card{" "}
        <b>or</b> the app. Each check is a yes/no, and the rules combine them.
      </Analogy>
      <CodeBlock
        code={`const age = 16;
const hasTicket = true;

age >= 18                 // false: comparisons produce booleans
age >= 12 && hasTicket    // true:  && needs BOTH sides true
age >= 18 || hasTicket    // true:  || needs AT LEAST ONE side true
!hasTicket                // false: ! flips it`}
      />
      <p>The full rules fit in a small table:</p>
      <CodeBlock
        code={`true  && true   → true        true  || true   → true
true  && false  → false       true  || false  → true
false && false  → false       false || false  → false`}
      />
      <p>
        <b>Name your conditions.</b> Storing a check in a variable with an{" "}
        <code>is</code>/<code>has</code>/<code>can</code> name makes code read
        like a sentence:
      </p>
      <CodeBlock
        code={`const isAdult = age >= 18;
const canEnter = isAdult && hasTicket;`}
      />
      <Tip>
        ⚠️ <code>true</code> and <code>&quot;true&quot;</code> are different: one
        is a boolean, the other is text. And when mixing <code>&amp;&amp;</code>{" "}
        with <code>||</code>, use brackets to show what you mean:{" "}
        <code>(a &amp;&amp; b) || c</code>.
      </Tip>
    </>
  ),
  widget: { title: "Cinema logic", Component: BooleanLogicWidget },
  quiz: [
    {
      question: (
        <>
          What is <code>true &amp;&amp; false</code>?
        </>
      ),
      options: ["true", "false", "undefined", '"truefalse"'],
      answerIndex: 1,
      explanation: "&& is only true when both sides are true.",
    },
    {
      question: (
        <>
          What is <code>false || true</code>?
        </>
      ),
      options: ["true", "false", "undefined", "null"],
      answerIndex: 0,
      explanation: "|| is true when at least one side is true.",
    },
    {
      question: (
        <>
          <code>const isOpen = false;</code> What is <code>!isOpen</code>?
        </>
      ),
      options: ["true", "false", '"false"', "An error"],
      answerIndex: 0,
      explanation: "! flips the boolean.",
    },
  ],
  exercise: {
    task: (
      <>
        A theme park ride has rules. Write <code>canRide(height, age, hasParent)</code>{" "}
        returning <code>true</code> or <code>false</code>:
        <ol>
          <li>
            Everyone must be at least <code>120</code> cm tall.
          </li>
          <li>
            Riders under <code>12</code> also need a parent with them.
          </li>
        </ol>
        Store at least one rule in a well-named boolean variable.
      </>
    ),
    starter: `function canRide(height, age, hasParent) {\n  // e.g. const isTallEnough = ...\n\n}\n\nconsole.log(canRide(130, 10, true));   // true`,
    extract: `({
      a: canRide(130, 10, true),
      b: canRide(130, 10, false),
      c: canRide(130, 12, false),
      d: canRide(110, 30, true),
      e: canRide(120, 8, true),
    })`,
    tests: (values, code) => [
      check(values.a === true, "130 cm, age 10, with a parent → true"),
      check(values.b === false, "130 cm, age 10, no parent → false"),
      check(values.c === true, "130 cm, age 12, no parent → true (12 isn't under 12)"),
      check(values.d === false, "110 cm → false, whatever the age"),
      check(values.e === true, "exactly 120 cm counts"),
      check(/const\s+(is|has|can|needs)\w*\s*=/.test(code), "you named a rule with const is…/has…/can…/needs…"),
    ],
    hint: (
      <>
        <code>const isTallEnough = height &gt;= 120;</code>,{" "}
        <code>const needsParent = age &lt; 12;</code>, then{" "}
        <code>return isTallEnough &amp;&amp; (!needsParent || hasParent);</code>
      </>
    ),
    solution: `function canRide(height, age, hasParent) {\n  const isTallEnough = height >= 120;\n  const needsParent = age < 12;\n  return isTallEnough && (!needsParent || hasParent);\n}\n\nconsole.log(canRide(130, 10, true));   // true`,
  },
};

const operatorsAndComparisons: Stage = {
  id: "operators",
  level: "basic",
  title: "Operators and comparisons",
  short: "Operators & comparisons",
  lead: (
    <>
      Comparison operators ask questions about values (<code>===</code>,{" "}
      <code>!==</code>, <code>&lt;</code>, <code>&gt;=</code>…), and
      assignment operators like <code>+=</code> and <code>++</code> update
      variables in place.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="⚖️">
        A set of <b>scales</b>: put two values on, and it tells you whether
        they balance or which side is heavier. The answer is always yes or no.
      </Analogy>
      <CodeBlock
        code={`5 === 5      // true   exactly equal: same value AND same type
5 === "5"    // false  number vs string
5 !== 6      // true   not exactly equal
7 > 3        // true
7 <= 7       // true   less than OR equal`}
      />
      <p>
        <b>Always use === and !==.</b> There&apos;s also a loose{" "}
        <code>==</code> that converts types before comparing, which causes
        surprises. The advanced section shows exactly why.
      </p>
      <p>
        <b>Comparing strings</b> works alphabetically, character by character,
        with a twist: all capitals come before all lowercase letters, and
        digits in strings compare as text.
      </p>
      <CodeBlock
        code={`"apple" < "banana"   // true
"Zebra" < "apple"    // true  ← capital Z comes before lowercase a!
"10" < "9"           // true  ← "1" comes before "9" as text`}
      />
      <p>
        <b>Assignment shortcuts</b> update a variable using its own value:
      </p>
      <CodeBlock
        code={`let points = 10;
points += 5;    // points = points + 5  → 15
points -= 3;    // → 12
points *= 2;    // → 24
points++;       // add one → 25
points--;       // subtract one → 24`}
      />
      <Tip>
        ⚠️ One <code>=</code> stores a value; three <code>===</code> compare.
        Writing <code>if (score = 10)</code> by mistake <i>sets</i> score to
        10 instead of checking it.
      </Tip>
    </>
  ),
  widget: { title: "Compare and update", Component: ComparisonsWidget },
  quiz: [
    {
      question: (
        <>
          What is <code>10 === &quot;10&quot;</code>?
        </>
      ),
      options: ["true", "false", "An error", "undefined"],
      answerIndex: 1,
      explanation: "=== checks the type too: a number is never exactly equal to a string.",
    },
    {
      question: (
        <>
          <code>let n = 4; n *= 3;</code> What is <code>n</code>?
        </>
      ),
      options: ["7", "12", "43", "4"],
      answerIndex: 1,
      explanation: "n *= 3 means n = n * 3.",
    },
    {
      question: (
        <>
          What is <code>&quot;Bob&quot; &lt; &quot;alice&quot;</code>?
        </>
      ),
      options: ["true", "false", "An error", "undefined"],
      answerIndex: 0,
      explanation: "Every capital letter sorts before every lowercase letter, so \"B\" < \"a\".",
    },
  ],
  exercise: {
    task: (
      <>
        Write two functions:
        <ol>
          <li>
            <code>isInRange(value, min, max)</code>: <code>true</code> when{" "}
            <code>value</code> is between <code>min</code> and <code>max</code>,
            including both ends
          </li>
          <li>
            <code>sameWord(a, b)</code>: <code>true</code> when two words match
            ignoring capitals (<code>&quot;Apple&quot;</code> and{" "}
            <code>&quot;aPPLE&quot;</code> match), using <code>===</code>
          </li>
        </ol>
      </>
    ),
    starter: `function isInRange(value, min, max) {\n\n}\n\nfunction sameWord(a, b) {\n\n}\n\nconsole.log(isInRange(5, 1, 10), sameWord("Apple", "aPPLE"));`,
    extract: `({
      r1: isInRange(5, 1, 10), r2: isInRange(1, 1, 10), r3: isInRange(10, 1, 10),
      r4: isInRange(0, 1, 10), r5: isInRange(11, 1, 10),
      w1: sameWord("Apple", "aPPLE"), w2: sameWord("apple", "apples"), w3: sameWord("CAT", "cat"),
    })`,
    tests: (values, code) => [
      check(values.r1 === true, "isInRange(5, 1, 10) → true"),
      check(values.r2 === true && values.r3 === true, "both ends count: 1 and 10 → true"),
      check(values.r4 === false && values.r5 === false, "0 and 11 → false"),
      check(values.w1 === true && values.w3 === true, "words match regardless of capitals"),
      check(values.w2 === false, '"apple" vs "apples" → false'),
      check(/===/.test(code) && !/[^=!]==[^=]/.test(code), "you used === (and never ==)"),
    ],
    hint: (
      <>
        <code>return value &gt;= min &amp;&amp; value &lt;= max;</code> and{" "}
        <code>return a.toLowerCase() === b.toLowerCase();</code>
      </>
    ),
    solution: `function isInRange(value, min, max) {\n  return value >= min && value <= max;\n}\n\nfunction sameWord(a, b) {\n  return a.toLowerCase() === b.toLowerCase();\n}\n\nconsole.log(isInRange(5, 1, 10), sameWord("Apple", "aPPLE"));`,
  },
};

const typeConversion: Stage = {
  id: "conversion",
  level: "basic",
  title: "Type conversion and coercion",
  short: "Type conversion",
  lead: (
    <>
      Sometimes you need to turn one type into another: text from a form into
      a number, for example. Doing it yourself is <b>conversion</b>; when
      JavaScript does it behind your back, it&apos;s <b>coercion</b>.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🔌">
        A <b>travel adapter</b>. Converting is plugging one in on purpose.
        Coercion is the hotel quietly swapping your plug, which usually works,
        but sometimes you get a surprise.
      </Analogy>
      <p>
        <b>Explicit conversion</b>: you ask for it, so the result is
        predictable.
      </p>
      <CodeBlock
        code={`Number("42")       // 42
Number("3.5")      // 3.5
Number("42px")     // NaN   not a clean number
parseInt("42px")   // 42    reads digits until it hits something else
String(99)         // "99"
Boolean(0)         // false (more on this in the advanced section)`}
      />
      <p>
        <b>Implicit coercion</b>: operators convert for you. The rule to
        remember: <code>+</code> with a string <b>joins text</b>; the other
        maths operators <b>force numbers</b>.
      </p>
      <CodeBlock
        code={`"5" + 1     // "51"  ← + sees a string, so it joins
"5" - 1     // 4     ← - only does maths
"5" * "2"   // 10
1 + true    // 2     (true becomes 1)`}
      />
      <p>
        This matters in real life because <b>input from forms is always a
        string</b>. Adding two form fields with <code>+</code> joins them
        unless you convert first:
      </p>
      <CodeBlock
        code={`const a = "10";   // from a text box
const b = "5";
a + b                   // "105" 😬
Number(a) + Number(b)   // 15 ✓`}
      />
      <Tip>
        ⚠️ <code>Number(&quot;&quot;)</code> and <code>Number(&quot; &quot;)</code>{" "}
        are <code>0</code>, not <code>NaN</code>, so an empty box quietly
        becomes zero. Check for empty input separately. To test for{" "}
        <code>NaN</code>, use <code>Number.isNaN(x)</code>:{" "}
        <code>NaN === NaN</code> is false!
      </Tip>
    </>
  ),
  widget: { title: "Converted or coerced?", Component: ConversionWidget },
  quiz: [
    {
      question: (
        <>
          What is <code>&quot;3&quot; + 4</code>?
        </>
      ),
      options: ["7", '"34"', "NaN", "An error"],
      answerIndex: 1,
      explanation: "With a string involved, + joins text.",
    },
    {
      question: (
        <>
          What is <code>&quot;8&quot; - 3</code>?
        </>
      ),
      options: ['"83"', "5", "NaN", '"5"'],
      answerIndex: 1,
      explanation: "- only works on numbers, so \"8\" is coerced to 8.",
    },
    {
      question: (
        <>
          How do you check whether <code>x</code> is <code>NaN</code>?
        </>
      ),
      options: ["x === NaN", "Number.isNaN(x)", 'typeof x === "NaN"', "x == NaN"],
      answerIndex: 1,
      explanation: "NaN isn't equal to anything, not even itself, so you need Number.isNaN.",
    },
  ],
  exercise: {
    task: (
      <>
        Two text boxes give you strings. Write <code>addInputs(a, b)</code>{" "}
        that returns their sum as a <b>number</b>. If either one is empty (or
        just spaces) or isn&apos;t a valid number, return <code>null</code>.
      </>
    ),
    starter: `function addInputs(a, b) {\n  return a + b;   // bug: joins the text\n}\n\nconsole.log(addInputs("10", "5"));   // should be 15`,
    extract: `({
      a: addInputs("10", "5"),
      b: addInputs("2.5", "0.5"),
      c: addInputs("10", "abc"),
      d: addInputs("", "5"),
      e: addInputs("   ", "1"),
      f: addInputs("-4", "4"),
    })`,
    tests: (values) => [
      check(values.a === 15, 'addInputs("10", "5") → 15'),
      check(values.b === 3, 'decimals work: "2.5" + "0.5" → 3'),
      check(values.f === 0, 'negatives work: "-4" + "4" → 0'),
      check(values.c === null, 'a non-number ("abc") → null'),
      check(values.d === null && values.e === null, "an empty or blank box → null (not 0)"),
    ],
    hint: (
      <>
        First{" "}
        <code>{'if (a.trim() === "" || b.trim() === "") return null;'}</code>.
        Then convert with <code>Number</code>, and{" "}
        <code>{"if (Number.isNaN(x) || Number.isNaN(y)) return null;"}</code>
      </>
    ),
    solution: `function addInputs(a, b) {\n  if (a.trim() === "" || b.trim() === "") {\n    return null;\n  }\n\n  const x = Number(a);\n  const y = Number(b);\n  if (Number.isNaN(x) || Number.isNaN(y)) {\n    return null;\n  }\n\n  return x + y;\n}\n\nconsole.log(addInputs("10", "5"));   // should be 15`,
  },
};

const conditions: Stage = {
  id: "conditions",
  level: "basic",
  title: "Conditions: if, else and switch",
  short: "if, else & switch",
  lead: (
    <>
      Conditions let your program make decisions: run this code{" "}
      <b>only if</b> something is true, otherwise run something else.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🛣️">
        A <b>fork in the road</b> with signposts. You read the signs in order
        and take the first road whose sign matches. Once you&apos;ve turned,
        you ignore the remaining signs.
      </Analogy>
      <CodeBlock
        code={`const temp = 21;

if (temp >= 30) {
  console.log("Hot");
} else if (temp >= 18) {
  console.log("Warm");      // ← this one runs
} else {
  console.log("Cold");
}`}
      />
      <p>
        Conditions are checked <b>top to bottom</b>, and only the{" "}
        <b>first</b> true branch runs. That&apos;s why order matters: if{" "}
        <code>temp &gt;= 18</code> came first, 35°C would print
        &quot;Warm&quot;.
      </p>
      <p>
        <b>switch</b> is tidy when you compare one value against several exact
        matches:
      </p>
      <CodeBlock
        code={`switch (day) {
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;                 // stop here
  case "Monday":
    console.log("Back to work");
    break;
  default:                 // nothing matched
    console.log("Midweek");
}`}
      />
      <p>
        For a simple either/or that produces a value, the{" "}
        <b>ternary</b> operator fits on one line:{" "}
        <code>{'const label = age >= 18 ? "adult" : "child";'}</code>
      </p>
      <Tip>
        ⚠️ In a <code>switch</code>, forgetting <code>break</code> makes
        execution <i>fall through</i> into the next case. Sometimes that&apos;s
        deliberate (Saturday and Sunday above share code), but usually it&apos;s
        a bug. <code>switch</code> compares with <code>===</code>, so{" "}
        <code>&quot;1&quot;</code> won&apos;t match <code>case 1</code>.
      </Tip>
    </>
  ),
  widget: { title: "Which branch runs?", Component: IfElseBranchesWidget },
  quiz: [
    {
      question: (
        <>
          <code>score = 85</code>. Which prints?{" "}
          <code>
            {'if (score >= 50) log("pass") else if (score >= 80) log("merit")'}
          </code>
        </>
      ),
      options: ["pass", "merit", "both", "neither"],
      answerIndex: 0,
      explanation: "85 >= 50 is checked first and is true, so later branches are skipped. The order is wrong for this grading.",
    },
    {
      question: "When does an else block run?",
      options: [
        "Always, after the if",
        "Only when none of the conditions above it were true",
        "Only when the if was true",
        "Never on its own",
      ],
      answerIndex: 1,
      explanation: "else is the 'none of the above' branch.",
    },
    {
      question: "What does break do inside a switch case?",
      options: [
        "Crashes the program",
        "Stops the switch so the next case doesn't run too",
        "Restarts the switch",
        "Skips to default",
      ],
      answerIndex: 1,
      explanation: "Without break, execution falls through into the following case.",
    },
  ],
  exercise: {
    task: (
      <>
        Write two functions:
        <ol>
          <li>
            <code>ticketPrice(age)</code> using if / else if / else: under 5 →{" "}
            <code>0</code>; under 18 → <code>6</code>; 65 or over →{" "}
            <code>7</code>; everyone else → <code>12</code>
          </li>
          <li>
            <code>dayType(day)</code> using a <b>switch</b>:{" "}
            <code>&quot;Saturday&quot;</code> or <code>&quot;Sunday&quot;</code> →{" "}
            <code>&quot;weekend&quot;</code>; Monday to Friday →{" "}
            <code>&quot;weekday&quot;</code>; anything else →{" "}
            <code>&quot;unknown&quot;</code>
          </li>
        </ol>
      </>
    ),
    starter: `function ticketPrice(age) {\n\n}\n\nfunction dayType(day) {\n  switch (day) {\n    // your cases here\n  }\n}\n\nconsole.log(ticketPrice(30), dayType("Sunday"));`,
    extract: `({
      p: [ticketPrice(2), ticketPrice(4), ticketPrice(5), ticketPrice(17), ticketPrice(18), ticketPrice(64), ticketPrice(65), ticketPrice(90)],
      d: [dayType("Saturday"), dayType("Sunday"), dayType("Monday"), dayType("Wednesday"), dayType("Friday"), dayType("Funday"), dayType("sunday")],
    })`,
    tests: (values, code) => {
      const prices = Array.isArray(values.p) ? values.p : [];
      const days = Array.isArray(values.d) ? values.d : [];
      return [
        check(prices[0] === 0 && prices[1] === 0, "under 5 → 0"),
        check(prices[2] === 6 && prices[3] === 6, "5 to 17 → 6"),
        check(prices[4] === 12 && prices[5] === 12, "18 to 64 → 12"),
        check(prices[6] === 7 && prices[7] === 7, "65 and over → 7"),
        check(days[0] === "weekend" && days[1] === "weekend", 'Saturday and Sunday → "weekend"'),
        check(days[2] === "weekday" && days[3] === "weekday" && days[4] === "weekday", 'Monday to Friday → "weekday"'),
        check(days[5] === "unknown" && days[6] === "unknown", 'anything else (even lowercase "sunday") → "unknown"'),
        check(/switch\s*\(/.test(code) && /else\s+if/.test(code), "you used if / else if and a switch"),
      ];
    },
    hint: (
      <>
        Order the ifs carefully: check <code>age &lt; 5</code> first, then{" "}
        <code>age &lt; 18</code>, then <code>age &gt;= 65</code>. In the switch,
        stack <code>case &quot;Saturday&quot;: case &quot;Sunday&quot;: return &quot;weekend&quot;;</code>{" "}
        (a <code>return</code> also stops the switch) and finish with{" "}
        <code>default: return &quot;unknown&quot;;</code>
      </>
    ),
    solution: `function ticketPrice(age) {\n  if (age < 5) {\n    return 0;\n  } else if (age < 18) {\n    return 6;\n  } else if (age >= 65) {\n    return 7;\n  } else {\n    return 12;\n  }\n}\n\nfunction dayType(day) {\n  switch (day) {\n    case "Saturday":\n    case "Sunday":\n      return "weekend";\n    case "Monday":\n    case "Tuesday":\n    case "Wednesday":\n    case "Thursday":\n    case "Friday":\n      return "weekday";\n    default:\n      return "unknown";\n  }\n}\n\nconsole.log(ticketPrice(30), dayType("Sunday"));`,
  },
};

const beginnerFinal: Stage = {
  id: "final",
  level: "basic",
  title: "Beginner final: the shipping calculator",
  short: "Final challenge",
  lead: (
    <>
      An online shop needs a shipping quote. It takes everything from this
      section: converting input, maths and rounding, a switch, boolean logic,
      conditions and a template literal for the final message.
    </>
  ),
  lesson: (
    <>
      <p>The rules:</p>
      <CodeBlock
        code={`Base price by destination:  UK £3,  EU £6,  World £10
Heavy parcels:              +£1.50 for every kg over 2 kg
Members:                    20% off the total

shippingQuote(3, "UK", false)      // "£4.50 to UK"
shippingQuote("3", "UK", true)     // "£3.60 to UK"  (weight arrived as text)
shippingQuote(1, "Mars", false)    // "Unknown destination"
shippingQuote("abc", "EU", false)  // "Invalid weight"`}
      />
      <p>A good plan:</p>
      <ol className="my-4 list-decimal pl-10">
        <li>
          <b>Convert</b> the weight with <code>Number()</code>. If it&apos;s{" "}
          <code>NaN</code> or not above 0, return{" "}
          <code>&quot;Invalid weight&quot;</code>.
        </li>
        <li>
          Use a <b>switch</b> on the destination to pick the base price, with
          a <code>default</code> that returns{" "}
          <code>&quot;Unknown destination&quot;</code>.
        </li>
        <li>
          If the weight is over 2, add <code>(weight - 2) * 1.5</code>.
        </li>
        <li>
          If <code>isMember</code> is true, multiply by <code>0.8</code>.
        </li>
        <li>
          Return a <b>template literal</b> with the cost shown using{" "}
          <code>toFixed(2)</code>.
        </li>
      </ol>
      <PanelHeading className="mt-[22px]">Beginner cheat sheet</PanelHeading>
      <CheatSheet>
        <Cheat code="console.log(x)">print to the console</Cheat>
        <Cheat code="const / let">a fixed / changeable variable</Cheat>
        <Cheat code="typeof x">what type is it?</Cheat>
        <Cheat code="`Hi ${name}`">build text from values</Cheat>
        <Cheat code="+ - * / % **">maths, remainder, power</Cheat>
        <Cheat code="&& || !">and, or, not</Cheat>
        <Cheat code="=== !== < >=">compare (always ===)</Cheat>
        <Cheat code='Number("5")'>text → number</Cheat>
        <Cheat code="if / else if / else">first true branch wins</Cheat>
        <Cheat code="switch (x) { case …: break; }">match exact values</Cheat>
      </CheatSheet>
    </>
  ),
  quiz: [
    {
      question: (
        <>
          The weight arrives as <code>&quot;3&quot;</code>. What is{" "}
          <code>&quot;3&quot; - 2</code>, and why is converting first still a
          good idea?
        </>
      ),
      options: [
        '"32"; you must convert',
        "1; but + elsewhere would join text, so convert once at the start",
        "NaN; it can't be done",
        '"1"; it stays a string',
      ],
      answerIndex: 1,
      explanation: "- coerces to a number, but relying on that is fragile. Convert once and the rest of the code is predictable.",
    },
    {
      question: (
        <>
          What does <code>(4.5).toFixed(2)</code> give?
        </>
      ),
      options: ["4.5", '"4.50"', "4.50", '"4.5"'],
      answerIndex: 1,
      explanation: "toFixed always returns a string with exactly that many decimal places, which is perfect for display.",
    },
    {
      question: "A member's quote before the discount is £10. What do they pay?",
      options: ["£2", "£8", "£9.80", "£10"],
      answerIndex: 1,
      explanation: "20% off means paying 80%: 10 × 0.8 = 8.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>shippingQuote(weight, destination, isMember)</code> following
        the rules above. It returns either{" "}
        <code>&quot;£X.XX to DESTINATION&quot;</code>,{" "}
        <code>&quot;Invalid weight&quot;</code> or{" "}
        <code>&quot;Unknown destination&quot;</code>.
      </>
    ),
    starter: "function shippingQuote(weight, destination, isMember) {\n  // 1. convert and check the weight\n\n  // 2. switch on destination for the base price\n\n  // 3. heavy parcel surcharge\n\n  // 4. member discount\n\n  // 5. return the message, e.g. `£4.50 to UK`\n}\n\nconsole.log(shippingQuote(3, \"UK\", false));",
    extract: `({
      a: shippingQuote(3, "UK", false),
      b: shippingQuote("3", "UK", true),
      c: shippingQuote(1, "EU", false),
      d: shippingQuote(2, "World", false),
      e: shippingQuote(6, "World", true),
      f: shippingQuote(1, "Mars", false),
      g: shippingQuote("abc", "EU", false),
      h: shippingQuote(0, "UK", false),
      i: shippingQuote(-2, "UK", true),
    })`,
    tests: (values, code) => [
      check(values.a === "£4.50 to UK", '3 kg to UK → "£4.50 to UK"'),
      check(values.b === "£3.60 to UK", 'weight as text "3", member → "£3.60 to UK"'),
      check(values.c === "£6.00 to EU" && values.d === "£10.00 to World", "at or under 2 kg → just the base price"),
      check(values.e === "£12.80 to World", '6 kg to World, member → "£12.80 to World"'),
      check(values.f === "Unknown destination", 'Mars → "Unknown destination"'),
      check(values.g === "Invalid weight" && values.h === "Invalid weight" && values.i === "Invalid weight", '"abc", 0 or a negative weight → "Invalid weight"'),
      check(/switch\s*\(/.test(code) && /`[^`]*\$\{[^`]*`/.test(code), "you used a switch and a template literal"),
    ],
    hint: (
      <>
        <code>{'const kg = Number(weight); if (Number.isNaN(kg) || kg <= 0) return "Invalid weight";'}</code>
        . Then <code>let cost;</code> and set it in each <code>case</code>. At
        the end:{" "}
        <code>{"return `£${cost.toFixed(2)} to ${destination}`;"}</code>
      </>
    ),
    solution: "function shippingQuote(weight, destination, isMember) {\n  const kg = Number(weight);\n  if (Number.isNaN(kg) || kg <= 0) {\n    return \"Invalid weight\";\n  }\n\n  let cost;\n  switch (destination) {\n    case \"UK\":\n      cost = 3;\n      break;\n    case \"EU\":\n      cost = 6;\n      break;\n    case \"World\":\n      cost = 10;\n      break;\n    default:\n      return \"Unknown destination\";\n  }\n\n  if (kg > 2) {\n    cost += (kg - 2) * 1.5;\n  }\n\n  if (isMember) {\n    cost = cost * 0.8;\n  }\n\n  return `£${cost.toFixed(2)} to ${destination}`;\n}\n\nconsole.log(shippingQuote(3, \"UK\", false));",
  },
};

export const FOUNDATIONS_BEGINNER_STAGES: Stage[] = [
  whatIsJavaScript,
  howJavaScriptRuns,
  variables,
  dataTypes,
  strings,
  numbers,
  booleans,
  operatorsAndComparisons,
  typeConversion,
  conditions,
  beginnerFinal,
];
