import type { Stage, TestCheck } from "@/lib/academy/types";
import {
  extractVariables,
  isMissing,
  isSameValue,
} from "@/lib/academy/format";
import {
  Analogy,
  CodeBlock,
  Cheat,
  CheatSheet,
  PanelHeading,
  Tip,
} from "../content";
import { BuildArrayWidget } from "../widgets/build-array";
import { IndexExplorerWidget } from "../widgets/index-explorer";
import { LengthVisualiserWidget } from "../widgets/length-visualiser";
import { MutationPlaygroundWidget } from "../widgets/mutation-playground";
import { LoopStepperWidget } from "../widgets/loop-stepper";
import { SearchWatchWidget } from "../widgets/search-watch";
import { TransformMachineWidget } from "../widgets/transform-machine";

function check(passed: boolean, label: string): TestCheck {
  return { passed, label };
}

const whatIsAnArray: Stage = {
  id: "what",
  level: "basic",
  title: "What is an array?",
  short: "What is an array?",
  lead: (
    <>
      An array is a single variable that holds an <b>ordered list</b> of
      values. Instead of making ten separate variables, you keep them together
      in one.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🚃">
        Picture a <b>train</b>. The whole train has one name (
        <code>train</code>), and each carriage holds one thing. The carriages
        stay in order, and you can add or remove carriages later.
      </Analogy>
      <p>Without arrays, storing three friends looks like this:</p>
      <CodeBlock
        code={`let friend1 = "Aisha";
let friend2 = "Ben";
let friend3 = "Chen";   // what about 100 friends? 😬`}
      />
      <p>
        With an array, it&apos;s one variable. Square brackets <code>[ ]</code>{" "}
        make the array, and commas separate the items:
      </p>
      <CodeBlock code={`const friends = ["Aisha", "Ben", "Chen"];`} />
      <p>
        An array can hold any kind of value: text (strings), numbers,
        true/false, even a mix:
      </p>
      <CodeBlock
        code={`const scores  = [90, 72, 85];
const answers = [true, false, true];
const empty   = [];   // an array with nothing in it (yet)`}
      />
      <Tip>
        💡 Text values need quotes (<code>&quot;Ben&quot;</code>). Numbers
        don&apos;t (<code>72</code>). A missing comma or bracket is the most
        common beginner error.
      </Tip>
    </>
  ),
  widget: { title: "Build an array", Component: BuildArrayWidget },
  quiz: [
    {
      question: "Which line correctly creates an array?",
      options: [
        'const pets = "cat", "dog";',
        'const pets = ["cat", "dog"];',
        "const pets = (cat, dog);",
        'const pets = {"cat" "dog"};',
      ],
      answerIndex: 1,
      explanation:
        "Arrays use square brackets, with commas between items. Text items go in quotes.",
    },
    {
      question: (
        <>
          What does <code>[]</code> on its own create?
        </>
      ),
      options: ["An error", "An array with one item", "An empty array", "undefined"],
      answerIndex: 2,
      explanation: (
        <>
          <code>[]</code> is a perfectly valid empty array. You can add items
          later.
        </>
      ),
    },
  ],
  exercise: {
    task: (
      <>
        Create an array called <code>colors</code> containing exactly{" "}
        <b>three</b> colour names as strings.
      </>
    ),
    starter: `// Create your array below\n\n\nconsole.log(colors);`,
    extract: extractVariables(["colors"]),
    tests: (values) => {
      const colors = values.colors;
      const isArray = Array.isArray(colors);
      const hasThree = Array.isArray(colors) && colors.length === 3;
      const allStrings =
        Array.isArray(colors) &&
        colors.every((item) => typeof item === "string");
      return [
        check(!isMissing(colors), "A variable named colors exists"),
        check(isArray, "colors is an array (uses [ ])"),
        check(hasThree, "colors has exactly 3 items"),
        check(allStrings, "every item is a string (in quotes)"),
      ];
    },
    hint: (
      <>
        Start with <code>const colors = [</code> then three words in quotes
        separated by commas, then <code>];</code>
      </>
    ),
    solution: `const colors = ["red", "green", "blue"];\n\nconsole.log(colors);`,
  },
};

const indexes: Stage = {
  id: "index",
  level: "basic",
  title: "Indexes: finding items by position",
  short: "Indexes",
  lead: (
    <>
      Every item in an array has a position number called its <b>index</b>. You
      use the index to read a specific item.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🏢">
        Think of floors in a European building: the first floor you walk into
        is the <b>ground floor, 0</b>. The one above is 1. Arrays count the
        same way.
      </Analogy>
      <p>
        The most important rule about arrays: <b>counting starts at 0</b>, not
        1.
      </p>
      <CodeBlock
        code={`const fruits = ["apple", "banana", "cherry"];
//  index:          0         1          2

fruits[0]   // "apple"   ← the FIRST item
fruits[1]   // "banana"
fruits[2]   // "cherry"  ← the THIRD item
fruits[3]   // undefined ← nothing there!`}
      />
      <p>
        The pattern is <code>arrayName[index]</code>. Asking for an index that
        doesn&apos;t exist doesn&apos;t crash; you just get{" "}
        <code>undefined</code>, which means &quot;no value here&quot;.
      </p>
      <Tip>
        💡 Quick conversion: the <b>n-th</b> item lives at index <b>n − 1</b>.
        3rd item → index 2.
      </Tip>
    </>
  ),
  widget: { title: "Index explorer", Component: IndexExplorerWidget },
  quiz: [
    {
      question: (
        <>
          Given <code>const days = [&quot;Mon&quot;, &quot;Tue&quot;, &quot;Wed&quot;]</code>, what is{" "}
          <code>days[1]</code>?
        </>
      ),
      options: ['"Mon"', '"Tue"', '"Wed"', "undefined"],
      answerIndex: 1,
      explanation: "Index 1 is the second item, because index 0 is the first.",
    },
    {
      question: (
        <>
          How do you get the <b>4th</b> item of an array called{" "}
          <code>list</code>?
        </>
      ),
      options: ["list[4]", "list(4)", "list[3]", "list.4"],
      answerIndex: 2,
      explanation: "4th item → index 4 − 1 = 3.",
    },
    {
      question: (
        <>
          What does <code>days[10]</code> give for the 3-item array above?
        </>
      ),
      options: [
        "An error that stops the program",
        "undefined",
        "The last item",
        "0",
      ],
      answerIndex: 1,
      explanation: (
        <>
          Reading past the end returns <code>undefined</code>. JavaScript
          doesn&apos;t crash.
        </>
      ),
    },
  ],
  exercise: {
    task: (
      <>
        Using indexes on <code>planets</code> (don&apos;t type the names
        yourself!):
        <ol>
          <li>
            store the <b>first</b> planet in a variable called{" "}
            <code>first</code>
          </li>
          <li>
            store the <b>third</b> planet in a variable called{" "}
            <code>third</code>
          </li>
        </ol>
      </>
    ),
    starter: `const planets = ["Mercury", "Venus", "Earth", "Mars"];\n\nconst first = \nconst third = \n\nconsole.log(first, third);`,
    extract: extractVariables(["first", "third"]),
    tests: (values, code) => {
      const usedIndexes =
        /planets\s*\[\s*0\s*\]/.test(code) && /planets\s*\[\s*2\s*\]/.test(code);
      return [
        check(values.first === "Mercury", 'first is "Mercury"'),
        check(values.third === "Earth", 'third is "Earth"'),
        check(usedIndexes, "you used planets[...] indexes to read them"),
      ];
    },
    hint: (
      <>
        The first item is at index <code>0</code>; the third is at index{" "}
        <code>2</code>. So: <code>planets[0]</code>.
      </>
    ),
    solution: `const planets = ["Mercury", "Venus", "Earth", "Mars"];\n\nconst first = planets[0];\nconst third = planets[2];\n\nconsole.log(first, third);`,
  },
};

const length: Stage = {
  id: "length",
  level: "basic",
  title: "Length & the last item",
  short: "Length",
  lead: (
    <>
      <code>.length</code> tells you how many items an array has. It is also
      the trick for grabbing the last item, however long the array gets.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`const pets = ["cat", "dog", "fish", "owl"];
pets.length              // 4
pets[pets.length - 1]   // "owl" ← the last item`}
      />
      <p>
        Why <code>length - 1</code>? With 4 items the indexes are 0, 1, 2, 3.
        Because we start at 0, the last index is <b>always one less</b> than
        the length.
      </p>
      <Analogy icon="🧮">
        <b>length</b> answers &quot;how many?&quot;; <b>index</b> answers
        &quot;which position?&quot;. They&apos;re off by one because of that
        zero start.
      </Analogy>
      <Tip>
        💡 Writing <code>pets[pets.length - 1]</code> instead of{" "}
        <code>pets[3]</code> means your code still works when the array grows
        or shrinks.
      </Tip>
    </>
  ),
  widget: { title: "Length visualiser", Component: LengthVisualiserWidget },
  quiz: [
    {
      question: (
        <>
          <code>const a = [5, 10, 15, 20, 25]</code>. What is{" "}
          <code>a.length</code>?
        </>
      ),
      options: ["4", "5", "25", "6"],
      answerIndex: 1,
      explanation:
        "There are 5 items. Length counts items; it doesn't care about the values.",
    },
    {
      question: (
        <>
          For that same array, what is the <b>last index</b>?
        </>
      ),
      options: ["5", "25", "4", "-1"],
      answerIndex: 2,
      explanation: "Last index = length − 1 = 4.",
    },
    {
      question: (
        <>
          What is <code>[].length</code>?
        </>
      ),
      options: ["0", "undefined", "1", "-1"],
      answerIndex: 0,
      explanation: "An empty array has 0 items.",
    },
  ],
  exercise: {
    task: (
      <>
        Using <code>.length</code>:
        <ol>
          <li>
            store how many scores there are in <code>count</code>
          </li>
          <li>
            store the last score in <code>last</code>, <b>without</b> typing the
            index number 4 directly
          </li>
        </ol>
      </>
    ),
    starter: `const scores = [12, 45, 7, 88, 23];\n\nconst count = \nconst last = \n\nconsole.log(count, last);`,
    extract: extractVariables(["count", "last"]),
    tests: (values, code) => [
      check(values.count === 5, "count is 5"),
      check(values.last === 23, "last is 23"),
      check(
        /scores\s*\[\s*scores\.length\s*-\s*1\s*\]/.test(code),
        "last uses scores[scores.length - 1]"
      ),
    ],
    hint: (
      <>
        <code>scores.length</code> gives the count. The last item is at{" "}
        <code>scores.length - 1</code>.
      </>
    ),
    solution: `const scores = [12, 45, 7, 88, 23];\n\nconst count = scores.length;\nconst last = scores[scores.length - 1];\n\nconsole.log(count, last);`,
  },
};

const changingArrays: Stage = {
  id: "change",
  level: "basic",
  title: "Changing arrays",
  short: "Changing arrays",
  lead: (
    <>
      Arrays aren&apos;t frozen. You can replace items, add to either end, and
      remove from either end.
    </>
  ),
  lesson: (
    <>
      <p>
        <b>Replace</b> an item by assigning to its index:
      </p>
      <CodeBlock
        code={`const pets = ["cat", "dog"];
pets[1] = "parrot";   // ["cat", "parrot"]`}
      />
      <p>
        <b>Add &amp; remove</b> with four built-in methods:
      </p>
      <CodeBlock
        code={`pets.push("fish");      // add to the END     → ["cat","parrot","fish"]
pets.pop();             // remove from END    → ["cat","parrot"]
pets.unshift("ant");    // add to the START   → ["ant","cat","parrot"]
pets.shift();           // remove from START  → ["cat","parrot"]`}
      />
      <Analogy icon="🥞">
        <b>push / pop</b> work at the back, like stacking and grabbing the top
        pancake. <b>unshift / shift</b> work at the front, and every other
        item&apos;s index moves by one.
      </Analogy>
      <Tip>
        💡 Wait, <code>const</code>? <code>const</code> stops you{" "}
        <i>reassigning the variable</i> (<code>pets = something else</code>).
        It does <b>not</b> stop you changing what&apos;s inside the array.
      </Tip>
    </>
  ),
  widget: { title: "Mutation playground", Component: MutationPlaygroundWidget },
  quiz: [
    {
      question: (
        <>
          Which method adds an item to the <b>end</b> of an array?
        </>
      ),
      options: ["shift()", "unshift()", "push()", "pop()"],
      answerIndex: 2,
      explanation: (
        <>
          <code>push</code> adds to the end; <code>pop</code> removes from the
          end.
        </>
      ),
    },
    {
      question: (
        <>
          <code>const n = [1, 2, 3]; n.shift();</code>. What is <code>n</code>{" "}
          now?
        </>
      ),
      options: ["[1, 2]", "[2, 3]", "[1, 2, 3]", "Error: n is const"],
      answerIndex: 1,
      explanation: (
        <>
          <code>shift</code> removes the first item. And yes, it&apos;s allowed
          on a <code>const</code> array.
        </>
      ),
    },
    {
      question: (
        <>
          <code>const n = [1, 2, 3]; n[0] = 9;</code>. What is <code>n</code>?
        </>
      ),
      options: ["[9, 2, 3]", "[1, 9, 2, 3]", "[1, 2, 3, 9]", "[9]"],
      answerIndex: 0,
      explanation: "Assigning to an index replaces the item at that position.",
    },
  ],
  exercise: {
    task: (
      <>
        Do these three steps <b>in order</b> to <code>cart</code>:
        <ol>
          <li>
            add <code>&quot;eggs&quot;</code> to the end
          </li>
          <li>remove the first item</li>
          <li>
            replace the item at index 0 with <code>&quot;butter&quot;</code>
          </li>
        </ol>
        The final cart should be <code>[&quot;butter&quot;, &quot;eggs&quot;]</code>.
      </>
    ),
    starter: `const cart = ["milk", "bread"];\n\n// step 1\n\n// step 2\n\n// step 3\n\n\nconsole.log(cart);`,
    extract: extractVariables(["cart"]),
    tests: (values, code) => [
      check(/\.push\s*\(/.test(code), "used push()"),
      check(/\.shift\s*\(/.test(code), "used shift()"),
      check(/cart\s*\[\s*0\s*\]\s*=/.test(code), "assigned with cart[0] = ..."),
      check(
        isSameValue(values.cart, ["butter", "eggs"]),
        'cart ends up as ["butter", "eggs"]'
      ),
    ],
    hint: (
      <>
        <code>cart.push(&quot;eggs&quot;)</code>, then <code>cart.shift()</code>,
        then <code>cart[0] = &quot;butter&quot;</code>. After step 2 the cart is{" "}
        <code>[&quot;bread&quot;, &quot;eggs&quot;]</code>.
      </>
    ),
    solution: `const cart = ["milk", "bread"];\n\ncart.push("eggs");      // ["milk", "bread", "eggs"]\ncart.shift();           // ["bread", "eggs"]\ncart[0] = "butter";     // ["butter", "eggs"]\n\nconsole.log(cart);`,
  },
};

const loops: Stage = {
  id: "loop",
  level: "basic",
  title: "Looping through an array",
  short: "Loops",
  lead: (
    <>
      Arrays get really useful when you do something to <b>every</b> item. A
      loop visits each index in turn, so the same code works for 3 items or
      3,000.
    </>
  ),
  lesson: (
    <>
      <p>
        The classic <code>for</code> loop counts through the indexes:
      </p>
      <CodeBlock
        code={`const prices = [4, 10, 6];
let total = 0;

for (let i = 0; i < prices.length; i++) {
  total = total + prices[i];
}
// total is now 20`}
      />
      <p>
        Read the <code>for</code> line as three parts: <b>start</b> at{" "}
        <code>i = 0</code> · <b>keep going while</b>{" "}
        <code>{"i < prices.length"}</code> · <b>after each pass</b> add 1 to{" "}
        <code>i</code>.
      </p>
      <p>
        There&apos;s also a shorter loop for when you only need the values, not
        the index:
      </p>
      <CodeBlock
        code={`for (const price of prices) {
  console.log(price);   // 4, then 10, then 6
}`}
      />
      <Tip>
        💡 Use <code>{"<"}</code>, not <code>{"<="}</code>. With{" "}
        <code>{"i <= prices.length"}</code> the last pass reads{" "}
        <code>prices[3]</code>, which is <code>undefined</code>. That&apos;s the
        classic &quot;off-by-one&quot; bug.
      </Tip>
    </>
  ),
  widget: { title: "Loop stepper", Component: LoopStepperWidget },
  quiz: [
    {
      question: (
        <>
          In <code>{"for (let i = 0; i < arr.length; i++)"}</code>, what is{" "}
          <code>i</code> during the <b>first</b> pass?
        </>
      ),
      options: ["1", "0", "arr.length", "undefined"],
      answerIndex: 1,
      explanation: (
        <>
          <code>let i = 0</code> starts the counter at the first index.
        </>
      ),
    },
    {
      question: "An array has 5 items. How many times does that loop body run?",
      options: ["4", "5", "6", "It depends on the values"],
      answerIndex: 1,
      explanation:
        "i goes 0, 1, 2, 3, 4: five passes. At i = 5 the condition is false.",
    },
    {
      question: "Inside the loop, how do you get the current item?",
      options: ["arr.i", "arr[i]", "i", "arr(i)"],
      answerIndex: 1,
      explanation: (
        <>
          <code>i</code> is just the position; <code>arr[i]</code> reads the
          item at that position.
        </>
      ),
    },
  ],
  exercise: {
    task: (
      <>
        Use a <code>for</code> loop to add up every price in{" "}
        <code>prices</code> into <code>total</code>. (Expected: 40.)
      </>
    ),
    starter: `const prices = [4, 10, 6, 20];\nlet total = 0;\n\n// write your loop here\n\n\nconsole.log(total);`,
    extract: extractVariables(["total"]),
    tests: (values, code) => [
      check(/\bfor\s*\(/.test(code), "used a for loop"),
      check(values.total === 40, "total is 40"),
    ],
    hint: (
      <>
        <code>{"for (let i = 0; i < prices.length; i++) { total = total + prices[i]; }"}</code>
        . A <code>for...of</code> loop is fine too.
      </>
    ),
    solution: `const prices = [4, 10, 6, 20];\nlet total = 0;\n\nfor (let i = 0; i < prices.length; i++) {\n  total = total + prices[i];\n}\n\nconsole.log(total);`,
  },
};

const searching: Stage = {
  id: "search",
  level: "basic",
  title: "Searching an array",
  short: "Searching",
  lead: (
    <>
      &quot;Is this item in my list?&quot; and &quot;Where is it?&quot; come up
      constantly. JavaScript has built-in methods that answer them in one line.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`const guests = ["Ana", "Ben", "Cy"];

guests.includes("Ben")   // true  → is it in there?
guests.includes("Zoe")   // false

guests.indexOf("Cy")     // 2     → where is it?
guests.indexOf("Zoe")    // -1    → -1 means "not found"`}
      />
      <p>
        Under the hood, both methods do what you learned in the last stage: they
        loop from index 0 and compare each item until they find a match.
      </p>
      <Tip>
        💡 <code>indexOf</code> returns <code>-1</code> when nothing matches,
        because <code>-1</code> can never be a real index. Matching is exact,
        so <code>&quot;ben&quot;</code> ≠ <code>&quot;Ben&quot;</code>.
      </Tip>
    </>
  ),
  widget: { title: "Watch a search happen", Component: SearchWatchWidget },
  quiz: [
    {
      question: (
        <>
          <code>[&quot;a&quot;, &quot;b&quot;, &quot;c&quot;].indexOf(&quot;b&quot;)</code> returns…
        </>
      ),
      options: ["1", "2", "true", '"b"'],
      answerIndex: 0,
      explanation: '"b" sits at index 1.',
    },
    {
      question: (
        <>
          <code>[&quot;a&quot;, &quot;b&quot;, &quot;c&quot;].indexOf(&quot;z&quot;)</code> returns…
        </>
      ),
      options: ["undefined", "false", "-1", "0"],
      answerIndex: 2,
      explanation: '-1 is the "not found" signal.',
    },
    {
      question: (
        <>
          Which method gives you a simple <code>true</code>/<code>false</code>{" "}
          answer?
        </>
      ),
      options: ["indexOf", "includes", "push", "length"],
      answerIndex: 1,
      explanation: (
        <>
          <code>includes</code> answers yes/no; <code>indexOf</code> answers
          &quot;where&quot;.
        </>
      ),
    },
  ],
  exercise: {
    task: (
      <>
        Using the search methods on <code>guests</code>:
        <ol>
          <li>
            <code>hasBen</code> should be whether &quot;Ben&quot; is invited
            (true/false)
          </li>
          <li>
            <code>cyPosition</code> should be the index of &quot;Cy&quot;
          </li>
          <li>
            <code>zoePosition</code> should be the index of &quot;Zoe&quot;
          </li>
        </ol>
      </>
    ),
    starter: `const guests = ["Ana", "Ben", "Cy", "Dee"];\n\nconst hasBen = \nconst cyPosition = \nconst zoePosition = \n\nconsole.log(hasBen, cyPosition, zoePosition);`,
    extract: extractVariables(["hasBen", "cyPosition", "zoePosition"]),
    tests: (values, code) => [
      check(
        values.hasBen === true && /\.includes\s*\(/.test(code),
        "hasBen is true (using includes)"
      ),
      check(
        values.cyPosition === 2 && /\.indexOf\s*\(/.test(code),
        "cyPosition is 2 (using indexOf)"
      ),
      check(values.zoePosition === -1, "zoePosition is -1"),
    ],
    hint: (
      <>
        <code>guests.includes(&quot;Ben&quot;)</code> and{" "}
        <code>guests.indexOf(&quot;Cy&quot;)</code>.
      </>
    ),
    solution: `const guests = ["Ana", "Ben", "Cy", "Dee"];\n\nconst hasBen = guests.includes("Ben");\nconst cyPosition = guests.indexOf("Cy");\nconst zoePosition = guests.indexOf("Zoe");\n\nconsole.log(hasBen, cyPosition, zoePosition);`,
  },
};

const mapAndFilter: Stage = {
  id: "transform",
  level: "basic",
  title: "Transforming: map & filter",
  short: "map & filter",
  lead: (
    <>
      Two methods do most of the everyday array work: <code>map</code> changes
      every item, and <code>filter</code> keeps only the items you want. Both
      give you a <b>new</b> array and leave the original untouched.
    </>
  ),
  lesson: (
    <>
      <p>
        <b>map</b> runs a function on every item and collects the results. Same
        length in, same length out:
      </p>
      <CodeBlock
        code={`const nums = [1, 2, 3];
const doubled = nums.map(n => n * 2);   // [2, 4, 6]`}
      />
      <p>
        <b>filter</b> runs a true/false test on every item and keeps the ones
        that pass, so you may get fewer items back:
      </p>
      <CodeBlock
        code={`const ages = [12, 25, 17, 40];
const adults = ages.filter(age => age >= 18);   // [25, 40]`}
      />
      <Analogy icon="🏭">
        <code>{"n => n * 2"}</code> is a tiny function (an &quot;arrow
        function&quot;). Read it as:{" "}
        <i>&quot;take each item, call it n, give back n × 2.&quot;</i>{" "}
        <b>map</b> is a factory line that reshapes every item. <b>filter</b> is
        a bouncer that lets some items through.
      </Analogy>
      <Tip>
        💡 You could write both with a <code>for</code> loop and{" "}
        <code>push</code>. map and filter are shorter ways to do that same job.
      </Tip>
    </>
  ),
  widget: { title: "Transformation machine", Component: TransformMachineWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"[1, 2, 3].map(n => n + 1)"}</code> returns…
        </>
      ),
      options: ["[2, 3, 4]", "[1, 2, 3, 1]", "6", "[1, 2, 3]"],
      answerIndex: 0,
      explanation: (
        <>
          map applies <code>n + 1</code> to each item.
        </>
      ),
    },
    {
      question: (
        <>
          <code>{"[5, 15, 25].filter(n => n > 10)"}</code> returns…
        </>
      ),
      options: ["[true, true, false]", "[15, 25]", "[5]", "2"],
      answerIndex: 1,
      explanation:
        "filter keeps the items that pass the test, not the true/false values.",
    },
    {
      question: (
        <>
          After <code>const b = a.map(...)</code>, what happens to{" "}
          <code>a</code>?
        </>
      ),
      options: [
        "It becomes b",
        "It gets emptied",
        "It stays exactly the same",
        "It is sorted",
      ],
      answerIndex: 2,
      explanation:
        "map and filter return a new array; the original is untouched.",
    },
  ],
  exercise: {
    task: (
      <>
        Using map and filter on <code>nums</code>:
        <ol>
          <li>
            <code>doubled</code>: every number × 2
          </li>
          <li>
            <code>big</code>: only numbers greater than 7
          </li>
        </ol>
      </>
    ),
    starter: `const nums = [3, 8, 12, 5, 20];\n\nconst doubled = \nconst big = \n\nconsole.log(doubled);\nconsole.log(big);`,
    extract: extractVariables(["doubled", "big", "nums"]),
    tests: (values, code) => [
      check(
        isSameValue(values.doubled, [6, 16, 24, 10, 40]) &&
          /\.map\s*\(/.test(code),
        "doubled is [6, 16, 24, 10, 40] (using map)"
      ),
      check(
        isSameValue(values.big, [8, 12, 20]) && /\.filter\s*\(/.test(code),
        "big is [8, 12, 20] (using filter)"
      ),
      check(isSameValue(values.nums, [3, 8, 12, 5, 20]), "nums itself is unchanged"),
    ],
    hint: (
      <>
        <code>{"nums.map(n => n * 2)"}</code> and{" "}
        <code>{"nums.filter(n => n > 7)"}</code>.
      </>
    ),
    solution: `const nums = [3, 8, 12, 5, 20];\n\nconst doubled = nums.map(n => n * 2);\nconst big = nums.filter(n => n > 7);\n\nconsole.log(doubled);\nconsole.log(big);`,
  },
};

const finalChallenge: Stage = {
  id: "final",
  level: "basic",
  title: "Final challenge",
  short: "Final challenge",
  lead: (
    <>
      Time to combine it all. You&apos;ll write a <b>function</b> that takes
      any array of numbers, so your code has to work for arrays you&apos;ve
      never seen.
    </>
  ),
  lesson: (
    <>
      <p>
        A quick refresher on functions: a function takes inputs (parameters) and
        gives back a result with <code>return</code>.
      </p>
      <CodeBlock
        code={`function firstItem(arr) {
  return arr[0];
}
firstItem([7, 8, 9]);   // 7`}
      />
      <PanelHeading className="mt-[22px]">Your cheat sheet</PanelHeading>
      <CheatSheet>
        <Cheat code="[a, b, c]">create an array</Cheat>
        <Cheat code="arr[i]">read item at index i (starts at 0)</Cheat>
        <Cheat code="arr.length">how many items</Cheat>
        <Cheat code="arr[arr.length - 1]">the last item</Cheat>
        <Cheat code="push / pop">add / remove at the end</Cheat>
        <Cheat code="unshift / shift">add / remove at the start</Cheat>
        <Cheat code="for (let i = 0; i < arr.length; i++)">visit every index</Cheat>
        <Cheat code="includes / indexOf">is it there? where? (-1 = no)</Cheat>
        <Cheat code="map / filter">new array: transformed / kept items</Cheat>
      </CheatSheet>
    </>
  ),
  quiz: [
    {
      question: (
        <>
          <code>const a = [2, 4, 6]; a.push(8); a.shift();</code>. What is{" "}
          <code>a[a.length - 1]</code>?
        </>
      ),
      options: ["6", "8", "2", "4"],
      answerIndex: 1,
      explanation:
        "After push: [2,4,6,8]. After shift: [4,6,8]. The last item is 8.",
    },
    {
      question: "Which loop condition has an off-by-one bug?",
      options: [
        "i < arr.length",
        "i <= arr.length - 1",
        "i <= arr.length",
        "They're all fine",
      ],
      answerIndex: 2,
      explanation: (
        <>
          <code>{"i <= arr.length"}</code> runs one extra time and reads{" "}
          <code>undefined</code> at the end.
        </>
      ),
    },
  ],
  exercise: {
    task: (
      <>
        Write a function <code>summarize(nums)</code> that returns an array of
        three things: <code>[smallest, largest, sum]</code>.
        <ol>
          <li>
            <code>summarize([4, 9, 1, 7])</code> → <code>[1, 9, 21]</code>
          </li>
          <li>
            It must work for any non-empty array of numbers, including
            negatives.
          </li>
          <li>
            Try a loop. Avoid <code>Math.min</code>/<code>Math.max</code> so you
            practise the logic yourself.
          </li>
        </ol>
      </>
    ),
    starter: `function summarize(nums) {\n  let smallest = nums[0];\n  let largest = nums[0];\n  let sum = 0;\n\n  // loop over nums and update the three variables\n\n\n  return [smallest, largest, sum];\n}\n\nconsole.log(summarize([4, 9, 1, 7]));`,
    extract: `{ a: summarize([4, 9, 1, 7]), b: summarize([5]), c: summarize([-3, -10, 0, 8]), d: summarize([2, 2, 2]) }`,
    tests: (values, code) => [
      check(isSameValue(values.a, [1, 9, 21]), "summarize([4, 9, 1, 7]) → [1, 9, 21]"),
      check(isSameValue(values.b, [5, 5, 5]), "summarize([5]) → [5, 5, 5]"),
      check(
        isSameValue(values.c, [-10, 8, -5]),
        "summarize([-3, -10, 0, 8]) → [-10, 8, -5]"
      ),
      check(isSameValue(values.d, [2, 2, 6]), "summarize([2, 2, 2]) → [2, 2, 6]"),
      check(!/Math\.(min|max)/.test(code), "didn't use Math.min / Math.max"),
    ],
    hint: (
      <>
        Inside a loop: <code>sum = sum + nums[i];</code> then{" "}
        <code>{"if (nums[i] < smallest) smallest = nums[i];"}</code> and the
        same idea with <code>{">"}</code> for largest.
      </>
    ),
    solution: `function summarize(nums) {\n  let smallest = nums[0];\n  let largest = nums[0];\n  let sum = 0;\n\n  for (let i = 0; i < nums.length; i++) {\n    const n = nums[i];\n    sum = sum + n;\n    if (n < smallest) smallest = n;\n    if (n > largest) largest = n;\n  }\n\n  return [smallest, largest, sum];\n}\n\nconsole.log(summarize([4, 9, 1, 7]));`,
  },
};

export const BEGINNER_STAGES: Stage[] = [
  whatIsAnArray,
  indexes,
  length,
  changingArrays,
  loops,
  searching,
  mapAndFilter,
  finalChallenge,
];
