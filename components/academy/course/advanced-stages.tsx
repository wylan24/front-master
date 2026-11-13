import type { Stage, TestCheck } from "@/lib/academy/types";
import { extractVariables, isSameValue } from "@/lib/academy/format";
import {
  Analogy,
  CodeBlock,
  Cheat,
  CheatSheet,
  PanelHeading,
  Tip,
} from "../content";
import { FindStopEarlyWidget } from "../widgets/find-stop-early";
import { MutationDetectorWidget } from "../widgets/mutation-detector";
import { SameOrCopyWidget } from "../widgets/same-or-copy";
import { QueryRecordsWidget } from "../widgets/query-records";
import { GridExplorerWidget } from "../widgets/grid-explorer";
import { PipelineBuilderWidget } from "../widgets/pipeline-builder";

function check(passed: boolean, label: string): TestCheck {
  return { passed, label };
}

function countMatches(code: string, pattern: RegExp): number {
  const matches = code.match(pattern);
  return matches === null ? 0 : matches.length;
}

const PART_ONE = "Part 1 · Power tools";
const PART_TWO = "Part 2 · Real world";

const findSomeEvery: Stage = {
  id: "adv-find",
  level: "adv",
  part: PART_ONE,
  title: "Asking questions: find, findIndex, some, every",
  short: "find / some / every",
  lead: (
    <>
      <code>includes</code> and <code>indexOf</code> only look for an exact
      value. These four methods take a <b>test function</b> instead, so you can
      ask questions like &quot;the first temperature above 20?&quot; or
      &quot;are they <i>all</i> positive?&quot;
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`const temps = [12, 18, 25, 31, 22];

temps.find(t => t > 20)        // 25    → the first ITEM that passes
temps.findIndex(t => t > 20)   // 2     → the INDEX of that item
temps.some(t => t > 30)        // true  → does AT LEAST ONE pass?
temps.every(t => t > 10)       // true  → do ALL of them pass?`}
      />
      <p>
        When nothing matches: <code>find</code> gives <code>undefined</code>,{" "}
        <code>findIndex</code> gives <code>-1</code>, and <code>some</code>{" "}
        gives <code>false</code>. An empty array is a special case:{" "}
        <code>[].every(...)</code> is <code>true</code>, because nothing failed.
      </p>
      <Analogy icon="🔦">
        All four <b>stop early</b>. <code>find</code>/<code>findIndex</code>/
        <code>some</code> stop at the first item that passes.{" "}
        <code>every</code> stops at the first item that <i>fails</i>, since one
        failure already settles the answer.
      </Analogy>
      <Tip>
        💡 <code>find</code> vs <code>filter</code>: <code>find</code> returns{" "}
        <b>one item</b> (the first match), while <code>filter</code> returns an{" "}
        <b>array of all</b> matches.
      </Tip>
    </>
  ),
  widget: { title: "Watch them stop early", Component: FindStopEarlyWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"[3, 7, 9, 12].find(n => n > 5)"}</code> returns…
        </>
      ),
      options: ["[7, 9, 12]", "7", "1", "true"],
      answerIndex: 1,
      explanation: "find returns the first matching item itself, not an array.",
    },
    {
      question: (
        <>
          <code>{"[2, 4, 6].every(n => n % 2 === 0)"}</code> returns…
        </>
      ),
      options: ["true", "false", "[2, 4, 6]", "3"],
      answerIndex: 0,
      explanation: "Every item is even, so every gives true.",
    },
    {
      question: (
        <>
          <code>{"[1, 2, 3].findIndex(n => n > 10)"}</code> returns…
        </>
      ),
      options: ["undefined", "false", "-1", "0"],
      answerIndex: 2,
      explanation: 'findIndex uses -1 for "not found", just like indexOf.',
    },
  ],
  exercise: {
    task: (
      <>
        Using the four methods on <code>ages</code>:
        <ol>
          <li>
            <code>firstAdult</code>: the first age that is 18 or over (use{" "}
            <code>find</code>)
          </li>
          <li>
            <code>adultPos</code>: the index of that age (use{" "}
            <code>findIndex</code>)
          </li>
          <li>
            <code>anyMinor</code>: is any age under 18? (use <code>some</code>)
          </li>
          <li>
            <code>allTeens</code>: are all ages between 13 and 19? (use{" "}
            <code>every</code>)
          </li>
        </ol>
      </>
    ),
    starter: `const ages = [14, 17, 21, 16, 30];\n\nconst firstAdult = \nconst adultPos = \nconst anyMinor = \nconst allTeens = \n\nconsole.log(firstAdult, adultPos, anyMinor, allTeens);`,
    extract: extractVariables(["firstAdult", "adultPos", "anyMinor", "allTeens"]),
    tests: (values, code) => [
      check(
        values.firstAdult === 21 && /\.find\s*\(/.test(code),
        "firstAdult is 21 (using find)"
      ),
      check(
        values.adultPos === 2 && /\.findIndex\s*\(/.test(code),
        "adultPos is 2 (using findIndex)"
      ),
      check(
        values.anyMinor === true && /\.some\s*\(/.test(code),
        "anyMinor is true (using some)"
      ),
      check(
        values.allTeens === false && /\.every\s*\(/.test(code),
        "allTeens is false (using every)"
      ),
    ],
    hint: (
      <>
        <code>{"ages.find(a => a >= 18)"}</code>. For the last one, combine two
        conditions: <code>{"a => a >= 13 && a <= 19"}</code>.
      </>
    ),
    solution: `const ages = [14, 17, 21, 16, 30];\n\nconst firstAdult = ages.find(a => a >= 18);\nconst adultPos = ages.findIndex(a => a >= 18);\nconst anyMinor = ages.some(a => a < 18);\nconst allTeens = ages.every(a => a >= 13 && a <= 19);\n\nconsole.log(firstAdult, adultPos, anyMinor, allTeens);`,
  },
};

const sliceSpliceSort: Stage = {
  id: "adv-slice",
  level: "adv",
  part: PART_ONE,
  title: "slice vs splice, and sorting properly",
  short: "slice, splice & sort",
  lead: (
    <>
      Two methods with nearly the same name do very different things, and{" "}
      <code>sort</code> has a famous trap. The key question for every method:{" "}
      <b>does it change the original array?</b>
    </>
  ),
  lesson: (
    <>
      <p>
        <b>slice(start, end)</b> copies part of an array. The <code>end</code>{" "}
        index is <i>not</i> included. The original is untouched:
      </p>
      <CodeBlock
        code={`const a = ["a", "b", "c", "d"];
a.slice(1, 3)   // ["b", "c"]   a is still ["a","b","c","d"]
a.slice(-2)     // ["c", "d"]   negative = count from the end`}
      />
      <p>
        <b>splice(start, deleteCount, ...newItems)</b> cuts into the original
        array. It removes and/or inserts items, and returns what it removed:
      </p>
      <CodeBlock
        code={`a.splice(1, 2)        // returns ["b","c"]; a is now ["a","d"]
a.splice(1, 0, "x")   // inserts; a is now ["a","x","d"]`}
      />
      <p>
        <b>sort()</b> also changes the original. Without a compare function it
        sorts items <b>as text</b>, so numbers come out wrong:
      </p>
      <CodeBlock
        code={`[10, 1, 5].sort()                  // [1, 10, 5]  😱 "10" comes before "5" as text
[10, 1, 5].sort((a, b) => a - b)    // [1, 5, 10]  low → high
[10, 1, 5].sort((a, b) => b - a)    // [10, 5, 1]  high → low`}
      />
      <Analogy icon="✂️">
        <b>slice</b> is a photocopier: it copies a section and leaves the
        original alone. <b>splice</b> is scissors and glue: it changes the
        actual page.
      </Analogy>
      <Tip>
        💡 To sort without touching the original, sort a copy:{" "}
        <code>{"[...nums].sort((a, b) => a - b)"}</code>. You&apos;ll see what{" "}
        <code>...</code> does in the next stage.
      </Tip>
    </>
  ),
  widget: { title: "Mutation detector", Component: MutationDetectorWidget },
  quiz: [
    {
      question: (
        <>
          Does <code>slice</code> change the original array?
        </>
      ),
      options: [
        "Yes, always",
        "No, it returns a new array",
        "Only with negative numbers",
        "Only if you pass two arguments",
      ],
      answerIndex: 1,
      explanation: "slice only copies. splice is the one that changes the original.",
    },
    {
      question: (
        <>
          <code>[10, 1, 5].sort()</code> returns…
        </>
      ),
      options: ["[1, 5, 10]", "[10, 5, 1]", "[1, 10, 5]", "An error"],
      answerIndex: 2,
      explanation:
        'Without a compare function, items are compared as text, and "10" comes before "5".',
    },
    {
      question: (
        <>
          <code>
            const a = [&quot;x&quot;, &quot;y&quot;, &quot;z&quot;]; a.splice(1, 1);
          </code>
          . What is <code>a</code> now?
        </>
      ),
      options: ['["x", "z"]', '["y"]', '["x", "y", "z"]', '["z"]'],
      answerIndex: 0,
      explanation:
        'splice(1, 1) removes 1 item starting at index 1 ("y"), changing a itself. It returns ["y"].',
    },
  ],
  exercise: {
    task: (
      <ol>
        <li>
          <code>middle</code>: a <b>copy</b> of &quot;b&quot;, &quot;c&quot;,
          &quot;d&quot; from <code>letters</code>, using <code>slice</code>
        </li>
        <li>
          Then remove <code>&quot;c&quot;</code> from <code>letters</code> itself
          using <code>splice</code>, so letters becomes{" "}
          <code>[&quot;a&quot;,&quot;b&quot;,&quot;d&quot;,&quot;e&quot;]</code>
        </li>
        <li>
          Sort <code>nums</code> numerically from low to high using{" "}
          <code>sort</code> with a compare function
        </li>
      </ol>
    ),
    starter: `const letters = ["a", "b", "c", "d", "e"];\nconst nums = [40, 100, 1, 5, 25];\n\nconst middle = \n\n// remove "c" from letters\n\n// sort nums low → high\n\n\nconsole.log(middle, letters, nums);`,
    extract: extractVariables(["middle", "letters", "nums"]),
    tests: (values, code) => [
      check(
        isSameValue(values.middle, ["b", "c", "d"]) && /\.slice\s*\(/.test(code),
        'middle is ["b", "c", "d"] (using slice)'
      ),
      check(
        isSameValue(values.letters, ["a", "b", "d", "e"]) &&
          /\.splice\s*\(/.test(code),
        'letters is ["a", "b", "d", "e"] (using splice)'
      ),
      check(isSameValue(values.nums, [1, 5, 25, 40, 100]), "nums is [1, 5, 25, 40, 100]"),
      check(
        /\.sort\s*\(\s*\(?\s*\w+\s*,\s*\w+/.test(code),
        "sort uses a compare function"
      ),
    ],
    hint: (
      <>
        <code>letters.slice(1, 4)</code>: remember the end index isn&apos;t
        included. &quot;c&quot; is at index 2, so{" "}
        <code>letters.splice(2, 1)</code>. Then{" "}
        <code>{"nums.sort((a, b) => a - b)"}</code>.
      </>
    ),
    solution: `const letters = ["a", "b", "c", "d", "e"];\nconst nums = [40, 100, 1, 5, 25];\n\nconst middle = letters.slice(1, 4);\n\n// remove "c" from letters\nletters.splice(2, 1);\n\n// sort nums low → high\nnums.sort((a, b) => a - b);\n\nconsole.log(middle, letters, nums);`,
  },
};

const copiesAndSpread: Stage = {
  id: "adv-copy",
  level: "adv",
  part: PART_ONE,
  title: "Copies vs references, spread & destructuring",
  short: "Copies & spread",
  lead: (
    <>
      This is the concept behind a lot of confusing bugs:{" "}
      <b>assigning an array to a new variable does not copy it</b>. Both names
      point at the same array.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`const a = [1, 2, 3];
const b = a;        // NOT a copy: b points at the same array
b.push(4);
console.log(a);     // [1, 2, 3, 4]  😮 a changed too!`}
      />
      <Analogy icon="🏠">
        A variable doesn&apos;t hold the array itself; it holds the array&apos;s{" "}
        <b>address</b>. <code>const b = a</code> copies the address, so now two
        people have the key to <i>the same house</i>. Rearrange the furniture
        through <code>b</code>, and <code>a</code> sees it too.
      </Analogy>
      <p>
        To make a <b>real copy</b>, use the spread operator <code>...</code>,
        which &quot;spreads out&quot; the items into a brand-new array:
      </p>
      <CodeBlock
        code={`const c = [...a];           // a new array with the same items
const both = [...a, ...[9, 8]];  // merge arrays: [1, 2, 3, 4, 9, 8]
[1, 2] === [1, 2]          // false: two different arrays, two different addresses`}
      />
      <p>
        <b>Destructuring</b> unpacks items into variables by position:
      </p>
      <CodeBlock
        code={`const [first, second] = ["gold", "silver", "bronze"];   // "gold", "silver"
const [winner, ...rest] = ["gold", "silver", "bronze"]; // rest = ["silver", "bronze"]
let x = 1, y = 2;
[x, y] = [y, x];   // swap! x = 2, y = 1`}
      />
      <Tip>
        💡 In React, state updates rely on this.{" "}
        <code>setItems([...items, newItem])</code> creates a new array so React
        notices the change. <code>items.push(newItem)</code> keeps the same
        address, so React may not re-render.
      </Tip>
    </>
  ),
  widget: { title: "Same array or a copy?", Component: SameOrCopyWidget },
  quiz: [
    {
      question: (
        <>
          <code>const a = [1]; const b = a; b.push(2);</code>. What is{" "}
          <code>a</code>?
        </>
      ),
      options: ["[1]", "[1, 2]", "[2]", "Error: a is const"],
      answerIndex: 1,
      explanation:
        "b and a point at the same array, so pushing through b changes what a sees.",
    },
    {
      question: (
        <>
          What does <code>[1, 2] === [1, 2]</code> give?
        </>
      ),
      options: ["true", "false", "undefined", "An error"],
      answerIndex: 1,
      explanation:
        "=== on arrays compares addresses, not contents. These are two separate arrays.",
    },
    {
      question: (
        <>
          <code>const [x, ...rest] = [5, 6, 7];</code>. What is{" "}
          <code>rest</code>?
        </>
      ),
      options: ["7", "[6, 7]", "[5, 6, 7]", "6"],
      answerIndex: 1,
      explanation:
        "x takes the first item; ...rest collects everything left into a new array.",
    },
  ],
  exercise: {
    task: (
      <ol>
        <li>
          <code>copy</code>: a real copy of <code>original</code> using spread,
          then push <code>4</code> onto <code>copy</code> (original must stay{" "}
          <code>[1, 2, 3]</code>)
        </li>
        <li>
          <code>combined</code>: <code>original</code> and <code>extra</code>{" "}
          merged into one new array using spread
        </li>
        <li>
          Use destructuring on <code>original</code> to create{" "}
          <code>first</code> (the first item) and <code>others</code> (the
          rest)
        </li>
      </ol>
    ),
    starter: `const original = [1, 2, 3];\nconst extra = [10, 20];\n\nconst copy = \n\n\nconst combined = \n\n// destructure first and others from original\n\n\nconsole.log(original, copy, combined, first, others);`,
    extract: extractVariables(["original", "copy", "combined", "first", "others"]),
    tests: (values, code) => [
      check(isSameValue(values.copy, [1, 2, 3, 4]), "copy is [1, 2, 3, 4]"),
      check(isSameValue(values.original, [1, 2, 3]), "original is still [1, 2, 3]"),
      check(
        isSameValue(values.combined, [1, 2, 3, 10, 20]),
        "combined is [1, 2, 3, 10, 20]"
      ),
      check(
        values.first === 1 &&
          isSameValue(values.others, [2, 3]) &&
          /\[\s*first\s*,\s*\.\.\.\s*others\s*\]/.test(code),
        "first is 1 and others is [2, 3] (using destructuring)"
      ),
      check(
        countMatches(code, /\.\.\./g) >= 3,
        "used spread ... for the copy and the merge"
      ),
    ],
    hint: (
      <>
        <code>const copy = [...original];</code> then{" "}
        <code>copy.push(4);</code>. Merge with{" "}
        <code>[...original, ...extra]</code>, and destructure with{" "}
        <code>const [first, ...others] = original;</code>
      </>
    ),
    solution: `const original = [1, 2, 3];\nconst extra = [10, 20];\n\nconst copy = [...original];\ncopy.push(4);\n\nconst combined = [...original, ...extra];\n\n// destructure first and others from original\nconst [first, ...others] = original;\n\nconsole.log(original, copy, combined, first, others);`,
  },
};

const arraysOfObjects: Stage = {
  id: "adv-objects",
  level: "adv",
  part: PART_TWO,
  title: "Arrays of objects",
  short: "Arrays of objects",
  lead: (
    <>
      Real app data is rarely a list of plain numbers. It&apos;s usually a list
      of <b>records</b> such as users, products or orders, each one an object.
      Everything you&apos;ve learned still works; you just reach into each
      object with a dot.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`const students = [
  { name: "Ana",  grade: 88, city: "Paris" },
  { name: "Ben",  grade: 72, city: "Lagos" },
  { name: "Chen", grade: 95, city: "Toronto" },
];

students[0]                          // { name: "Ana", grade: 88, city: "Paris" }
students[0].name                     // "Ana"   index first, then the property
students.map(s => s.name)             // ["Ana", "Ben", "Chen"]
students.filter(s => s.grade >= 80)  // [ {Ana…}, {Chen…} ]  whole objects
students.find(s => s.city === "Lagos") // { name: "Ben", … }  one object
[...students].sort((a, b) => b.grade - a.grade)  // highest grade first`}
      />
      <Analogy icon="🗂️">
        Think of a spreadsheet: the <b>array</b> is the list of rows, and each{" "}
        <b>object</b> is one row with named columns.{" "}
        <code>{"s => s.grade"}</code> means &quot;for each row, read the grade
        column&quot;.
      </Analogy>
      <Tip>
        💡 This is exactly the shape of most API responses, and of the data
        behind every list or table you render in React (
        <code>{"users.map(u => <Row key={u.id} … />)"}</code>).
      </Tip>
    </>
  ),
  widget: { title: "Query the records", Component: QueryRecordsWidget },
  quiz: [
    {
      question: (
        <>
          <code>
            {'const p = [{ n: "A", price: 5 }, { n: "B", price: 9 }];'}
          </code>
          . What is <code>p[1].price</code>?
        </>
      ),
      options: ["5", "9", '"B"', "undefined"],
      answerIndex: 1,
      explanation: "p[1] is the second object; .price reads its price.",
    },
    {
      question: (
        <>
          What does <code>{"users.map(u => u.email)"}</code> return?
        </>
      ),
      options: [
        "An array of user objects",
        "One email string",
        "An array of email strings",
        "true or false",
      ],
      answerIndex: 2,
      explanation:
        "map turns each user object into its email, giving an array of strings.",
    },
    {
      question: (
        <>
          What does <code>{"users.find(u => u.id === 7)"}</code> return when it
          matches?
        </>
      ),
      options: [
        "An array with one user",
        "The user object itself",
        "The index 7",
        "true",
      ],
      answerIndex: 1,
      explanation:
        "find returns the matching item. Here that's an object, not an array.",
    },
  ],
  exercise: {
    task: (
      <>
        Using <code>products</code>:
        <ol>
          <li>
            <code>names</code>: an array of just the product names
          </li>
          <li>
            <code>available</code>: only the products that are in stock (the
            whole objects)
          </li>
          <li>
            <code>bookPrice</code>: the price of the product named
            &quot;Book&quot; (use <code>find</code>)
          </li>
        </ol>
      </>
    ),
    starter: `const products = [\n  { name: "Pen",  price: 2,  inStock: true },\n  { name: "Book", price: 15, inStock: false },\n  { name: "Bag",  price: 30, inStock: true },\n  { name: "Mug",  price: 8,  inStock: true },\n];\n\nconst names = \nconst available = \nconst bookPrice = \n\nconsole.log(names);\nconsole.log(available);\nconsole.log(bookPrice);`,
    extract: extractVariables(["names", "available", "bookPrice"]),
    tests: (values, code) => {
      const available = values.available;
      let availableIsCorrect = false;
      if (Array.isArray(available)) {
        const availableNames = available.map((product) => product && product.name);
        availableIsCorrect =
          isSameValue(availableNames, ["Pen", "Bag", "Mug"]) &&
          typeof available[0] === "object";
      }

      return [
        check(
          isSameValue(values.names, ["Pen", "Book", "Bag", "Mug"]) &&
            /\.map\s*\(/.test(code),
          'names is ["Pen", "Book", "Bag", "Mug"] (using map)'
        ),
        check(availableIsCorrect, "available holds the 3 in-stock product objects"),
        check(
          values.bookPrice === 15 && /\.find\s*\(/.test(code),
          "bookPrice is 15 (using find)"
        ),
      ];
    },
    hint: (
      <>
        <code>{"products.map(p => p.name)"}</code>,{" "}
        <code>{"products.filter(p => p.inStock)"}</code>, and{" "}
        <code>{'products.find(p => p.name === "Book").price'}</code>.
      </>
    ),
    solution: `const products = [\n  { name: "Pen",  price: 2,  inStock: true },\n  { name: "Book", price: 15, inStock: false },\n  { name: "Bag",  price: 30, inStock: true },\n  { name: "Mug",  price: 8,  inStock: true },\n];\n\nconst names = products.map(p => p.name);\nconst available = products.filter(p => p.inStock);\nconst bookPrice = products.find(p => p.name === "Book").price;\n\nconsole.log(names);\nconsole.log(available);\nconsole.log(bookPrice);`,
  },
};

const grids: Stage = {
  id: "adv-grid",
  level: "adv",
  part: PART_TWO,
  title: "Nested arrays & 2D grids",
  short: "2D grids",
  lead: (
    <>
      An array can hold other arrays. That gives you a <b>grid</b> with rows
      and columns, the structure behind game boards, seating plans,
      spreadsheets and pixel images.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`const board = [
  ["X", "O", "X"],   // row 0
  [" ", "X", "O"],   // row 1
  ["O", " ", "X"],   // row 2
];

board[1]          // [" ", "X", "O"]  ← a whole row (an array)
board[1][2]       // "O"   ← row 1, then column 2
board.length      // 3     ← number of rows
board[0].length   // 3     ← number of columns`}
      />
      <p>
        The rule is <b>row first, column second</b>:{" "}
        <code>grid[row][col]</code>. The first <code>[ ]</code> picks a row
        (which is itself an array), and the second picks an item inside that
        row.
      </p>
      <p>To visit every cell, put a loop inside a loop:</p>
      <CodeBlock
        code={`for (let r = 0; r < board.length; r++) {
  for (let c = 0; c < board[r].length; c++) {
    console.log(r, c, board[r][c]);
  }
}`}
      />
      <Tip>
        💡 The inner loop runs all the way through for <b>every single</b> pass
        of the outer loop, so a 3 × 4 grid runs the inner body 12 times.
      </Tip>
    </>
  ),
  widget: { title: "Grid explorer", Component: GridExplorerWidget },
  quiz: [
    {
      question: (
        <>
          <code>const g = [[1, 2], [3, 4]];</code>. What is <code>g[1][0]</code>?
        </>
      ),
      options: ["2", "3", "4", "[3, 4]"],
      answerIndex: 1,
      explanation: "g[1] is [3, 4], and index 0 of that row is 3.",
    },
    {
      question: (
        <>
          For the same grid, what is <code>g[0]</code>?
        </>
      ),
      options: ["1", "[1, 3]", "[1, 2]", "undefined"],
      answerIndex: 2,
      explanation: "One index gives a whole row, which is an array.",
    },
    {
      question:
        "A grid has 3 rows and 4 columns. How many times does the inner body of a nested loop run?",
      options: ["7", "3", "4", "12"],
      answerIndex: 3,
      explanation: "4 columns for each of 3 rows: 3 × 4 = 12.",
    },
  ],
  exercise: {
    task: (
      <>
        Using the <code>seats</code> grid:
        <ol>
          <li>
            <code>middleSeat</code>: the seat in the very centre
          </li>
          <li>
            <code>lastRow</code>: the whole last row (use <code>.length</code>,
            not the number 2)
          </li>
          <li>
            <code>total</code>: count every seat using a <b>nested</b> for loop
          </li>
        </ol>
      </>
    ),
    starter: `const seats = [\n  ["A1", "A2", "A3"],\n  ["B1", "B2", "B3"],\n  ["C1", "C2", "C3"],\n];\n\nconst middleSeat = \nconst lastRow = \n\nlet total = 0;\n// nested loop here\n\n\nconsole.log(middleSeat, lastRow, total);`,
    extract: extractVariables(["middleSeat", "lastRow", "total"]),
    tests: (values, code) => [
      check(values.middleSeat === "B2", 'middleSeat is "B2"'),
      check(
        isSameValue(values.lastRow, ["C1", "C2", "C3"]) &&
          /seats\s*\[\s*seats\.length\s*-\s*1\s*\]/.test(code),
        'lastRow is ["C1", "C2", "C3"] (using seats.length - 1)'
      ),
      check(values.total === 9, "total is 9"),
      check(
        countMatches(code, /\bfor\s*\(/g) >= 2,
        "used two for loops (one inside the other)"
      ),
    ],
    hint: (
      <>
        Centre is row 1, column 1: <code>seats[1][1]</code>. For the count:{" "}
        <code>
          {"for (let r …) { for (let c = 0; c < seats[r].length; c++) { total++; } }"}
        </code>
      </>
    ),
    solution: `const seats = [\n  ["A1", "A2", "A3"],\n  ["B1", "B2", "B3"],\n  ["C1", "C2", "C3"],\n];\n\nconst middleSeat = seats[1][1];\nconst lastRow = seats[seats.length - 1];\n\nlet total = 0;\nfor (let r = 0; r < seats.length; r++) {\n  for (let c = 0; c < seats[r].length; c++) {\n    total++;\n  }\n}\n\nconsole.log(middleSeat, lastRow, total);`,
  },
};

const chaining: Stage = {
  id: "adv-chain",
  level: "adv",
  part: PART_TWO,
  title: "Chaining methods into a pipeline",
  short: "Chaining",
  lead: (
    <>
      Because <code>filter</code>, <code>map</code>, <code>sort</code> and{" "}
      <code>slice</code> all <b>return an array</b>, you can call the next
      method straight on the result. A few lines can do what used to take a
      whole loop.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`const topTitles = movies
  .filter(m => m.rating >= 8)             // 1. keep the good ones
  .sort((a, b) => b.rating - a.rating)   // 2. best first
  .slice(0, 3)                          // 3. top three
  .map(m => m.title);                    // 4. just the titles`}
      />
      <p>
        Read it top to bottom like a recipe. Each line receives the array
        produced by the line above it.
      </p>
      <Analogy icon="🏭">
        A chain is an <b>assembly line</b>: each station does one job and passes
        its output to the next station.
      </Analogy>
      <p>
        <b>Order matters.</b> To get the names of the top 3, you must{" "}
        <code>sort</code> before <code>slice</code>, and <code>map</code> to
        names last. Once you&apos;ve mapped to strings, the ratings are gone.
      </p>
      <Tip>
        💡 <code>filter</code> already returns a new array, so a{" "}
        <code>sort</code> after it is safe. If <code>sort</code> comes{" "}
        <b>first</b> in the chain, copy before sorting:{" "}
        <code>[...movies].sort(...)</code>. Otherwise you&apos;ll reorder the
        original.
      </Tip>
    </>
  ),
  widget: { title: "Pipeline builder", Component: PipelineBuilderWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"[1, 2, 3, 4].filter(n => n % 2 === 0).map(n => n * 10)"}</code>{" "}
          returns…
        </>
      ),
      options: ["[10, 20, 30, 40]", "[20, 40]", "[2, 4]", "[10, 30]"],
      answerIndex: 1,
      explanation: "filter keeps [2, 4], then map multiplies each by 10.",
    },
    {
      question: (
        <>
          Why can you write <code>.filter(...).map(...)</code> straight after
          each other?
        </>
      ),
      options: [
        "JavaScript ignores the dots",
        "filter returns an array, and arrays have a map method",
        "map is a global function",
        "It only works with numbers",
      ],
      answerIndex: 1,
      explanation:
        "Each method returns an array, so the next method is called on that new array.",
    },
    {
      question: (
        <>
          You want the <b>names</b> of the <b>top 2</b> scorers. Which order
          works?
        </>
      ),
      options: [
        "map → sort → slice",
        "slice → sort → map",
        "sort → slice → map",
        "map → slice → sort",
      ],
      answerIndex: 2,
      explanation:
        "Sort first so the best are at the front, take 2, then map to names. Mapping first throws away the scores you need to sort by.",
    },
  ],
  exercise: {
    task: (
      <>
        In <b>one chain</b>, make <code>topNames</code>: the names of players
        who scored <b>80 or more</b>, ordered <b>highest score first</b>.
        <br />
        Expected: <code>[&quot;Lea&quot;, &quot;Ola&quot;, &quot;Noa&quot;]</code>.
        The original <code>players</code> array must keep its order.
      </>
    ),
    starter: `const players = [\n  { name: "Kai", score: 72 },\n  { name: "Lea", score: 95 },\n  { name: "Max", score: 60 },\n  { name: "Noa", score: 88 },\n  { name: "Ola", score: 91 },\n];\n\nconst topNames = players\n  // your chain here\n\n\nconsole.log(topNames);`,
    extract: extractVariables(["topNames", "players"]),
    tests: (values, code) => {
      const players = values.players;
      const keptOrder =
        Array.isArray(players) &&
        players[0] &&
        players[0].name === "Kai" &&
        players[4].name === "Ola";
      const usedAllThree =
        /\.filter\s*\(/.test(code) &&
        /\.sort\s*\(/.test(code) &&
        /\.map\s*\(/.test(code);

      return [
        check(
          isSameValue(values.topNames, ["Lea", "Ola", "Noa"]),
          'topNames is ["Lea", "Ola", "Noa"]'
        ),
        check(usedAllThree, "used filter, sort and map"),
        check(Boolean(keptOrder), "players kept its original order"),
      ];
    },
    hint: (
      <>
        <code>{".filter(p => p.score >= 80)"}</code> →{" "}
        <code>{".sort((a, b) => b.score - a.score)"}</code> →{" "}
        <code>{".map(p => p.name)"}</code>. Filtering first means sort works on
        a new array.
      </>
    ),
    solution: `const players = [\n  { name: "Kai", score: 72 },\n  { name: "Lea", score: 95 },\n  { name: "Max", score: 60 },\n  { name: "Noa", score: 88 },\n  { name: "Ola", score: 91 },\n];\n\nconst topNames = players\n  .filter(p => p.score >= 80)\n  .sort((a, b) => b.score - a.score)\n  .map(p => p.name);\n\nconsole.log(topNames);`,
  },
};

/** Keeps only `player` and `total` so extra fields don't fail the comparison. */
function cleanLeaderboard(value: unknown): unknown {
  if (!Array.isArray(value)) {
    return value;
  }
  return value.map((entry) => entry && { player: entry.player, total: entry.total });
}

const leaderboard: Stage = {
  id: "adv-final",
  level: "adv",
  part: PART_TWO,
  title: "Advanced final: the leaderboard",
  short: "Final: leaderboard",
  lead: (
    <>
      Real data arrives messy. You get a log of individual match results, with
      players appearing many times, and you need to turn it into a ranked
      leaderboard. This uses nearly everything from the advanced section.
    </>
  ),
  lesson: (
    <>
      <p>The input looks like this, with one object per match:</p>
      <CodeBlock
        code={`const matches = [
  { player: "Ana", points: 10 },
  { player: "Ben", points: 5 },
  { player: "Ana", points: 15 },   // Ana again!
  …
];`}
      />
      <p>
        A good plan is to build a <code>totals</code> array of{" "}
        <code>{"{ player, total }"}</code> objects:
      </p>
      <ol className="my-4 list-decimal pl-10">
        <li>
          <b>Loop</b> over every match.
        </li>
        <li>
          Use <code>find</code> to check whether that player is already in{" "}
          <code>totals</code>.
        </li>
        <li>
          If they are, add the points to their <code>total</code>. If not (
          <code>find</code> gave <code>undefined</code>), <code>push</code> a
          new object.
        </li>
        <li>
          <code>sort</code> by total, highest first. If two totals are tied,
          sort those two by name A→Z.
        </li>
        <li>
          <code>slice</code> the top 3.
        </li>
      </ol>
      <Tip>
        💡 <code>find</code> returns the object <b>itself</b>, not a copy
        (remember references). So <code>existing.total += m.points</code>{" "}
        updates the object that&apos;s inside <code>totals</code>.
      </Tip>
      <PanelHeading className="mt-[22px]">Advanced cheat sheet</PanelHeading>
      <CheatSheet>
        <Cheat code="find / findIndex">first match: the item / its index</Cheat>
        <Cheat code="some / every">any pass? / all pass?</Cheat>
        <Cheat code="slice(s, e)">copy a part (original untouched)</Cheat>
        <Cheat code="splice(s, n, ...items)">cut/insert in the original</Cheat>
        <Cheat code="sort((a, b) => a - b)">numeric sort (changes the original)</Cheat>
        <Cheat code="[...a]  /  [...a, ...b]">copy / merge</Cheat>
        <Cheat code="const [x, ...rest] = a">destructuring</Cheat>
        <Cheat code="arr.map(o => o.key)">pluck a property from objects</Cheat>
        <Cheat code="grid[row][col]">2D access, row first</Cheat>
        <Cheat code=".filter().sort().slice().map()">a pipeline</Cheat>
      </CheatSheet>
    </>
  ),
  quiz: [
    {
      question: (
        <>
          <code>{'totals.find(t => t.player === "Zoe")'}</code> when Zoe
          isn&apos;t in totals returns…
        </>
      ),
      options: ["-1", "null", "undefined", "An empty object"],
      answerIndex: 2,
      explanation: (
        <>
          find gives undefined when nothing matches, which makes it easy to
          check with <code>if (!existing)</code>.
        </>
      ),
    },
    {
      question: (
        <>
          Which compare function sorts objects by <code>total</code>, highest
          first?
        </>
      ),
      options: [
        "(a, b) => a.total - b.total",
        "(a, b) => b.total - a.total",
        "(a, b) => a - b",
        "(a, b) => a.total > b.total",
      ],
      answerIndex: 1,
      explanation:
        "b − a puts larger values first. You must compare the .total property, not the objects themselves.",
    },
    {
      question: (
        <>
          You found <code>const existing = totals.find(...)</code> and did{" "}
          <code>existing.total += 5</code>. Does <code>totals</code> change?
        </>
      ),
      options: [
        "No, find returned a copy",
        "Yes, existing points at the same object that's in totals",
        "Only if you push it back in",
        "It throws an error",
      ],
      answerIndex: 1,
      explanation:
        "Objects and arrays are shared by reference, so you're editing the actual object inside totals.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>leaderboard(matches)</code> that returns the <b>top 3</b>{" "}
        players as <code>{"{ player, total }"}</code> objects, highest total
        first.
        <ol>
          <li>Players appear multiple times, so add up all their points.</li>
          <li>
            If two totals tie, put them in alphabetical order by name (
            <code>a.player.localeCompare(b.player)</code>).
          </li>
          <li>
            Fewer than 3 players → return all of them. No matches →{" "}
            <code>[]</code>.
          </li>
          <li>
            Don&apos;t change the <code>matches</code> array.
          </li>
        </ol>
      </>
    ),
    starter: `function leaderboard(matches) {\n  const totals = []; // e.g. [{ player: "Ana", total: 25 }]\n\n  // 1. loop through matches\n  //    use find() to see if the player is already in totals\n  //    yes → add the points   no → push a new { player, total }\n\n  // 2. sort totals: highest total first (ties → A–Z by name)\n\n  // 3. return only the top 3\n  return totals;\n}\n\nconsole.log(leaderboard([\n  { player: "Ana", points: 10 },\n  { player: "Ben", points: 5 },\n  { player: "Ana", points: 15 },\n  { player: "Cy",  points: 20 },\n  { player: "Ben", points: 12 },\n  { player: "Dee", points: 8 },\n  { player: "Cy",  points: 3 },\n]));`,
    extract: `(() => {
      const m1 = [{player:"Ana",points:10},{player:"Ben",points:5},{player:"Ana",points:15},{player:"Cy",points:20},{player:"Ben",points:12},{player:"Dee",points:8},{player:"Cy",points:3},{player:"Dee",points:1}];
      const copy = JSON.stringify(m1);
      const a = leaderboard(m1);
      return { a, untouched: JSON.stringify(m1) === copy,
        b: leaderboard([{player:"Zed",points:5}]),
        c: leaderboard([{player:"Bo",points:10},{player:"Al",points:4},{player:"Cy",points:4},{player:"Al",points:6}]),
        d: leaderboard([]) };
    })()`,
    tests: (values) => [
      check(
        isSameValue(cleanLeaderboard(values.a), [
          { player: "Ana", total: 25 },
          { player: "Cy", total: 23 },
          { player: "Ben", total: 17 },
        ]),
        "main example → Ana 25, Cy 23, Ben 17"
      ),
      check(
        isSameValue(cleanLeaderboard(values.b), [{ player: "Zed", total: 5 }]),
        'one player → [{ player: "Zed", total: 5 }]'
      ),
      check(
        isSameValue(cleanLeaderboard(values.c), [
          { player: "Al", total: 10 },
          { player: "Bo", total: 10 },
          { player: "Cy", total: 4 },
        ]),
        "tie on 10 → Al before Bo"
      ),
      check(isSameValue(values.d, []), "no matches → []"),
      check(values.untouched === true, "the matches array was not changed"),
    ],
    hint: (
      <>
        Inside the loop:{" "}
        <code>{"const existing = totals.find(t => t.player === m.player);"}</code>{" "}
        then{" "}
        <code>
          {"if (existing) existing.total += m.points; else totals.push({ player: m.player, total: m.points });"}
        </code>
        . Sort with{" "}
        <code>
          {"(a, b) => b.total - a.total || a.player.localeCompare(b.player)"}
        </code>
        , then <code>return totals.slice(0, 3);</code>
      </>
    ),
    solution: `function leaderboard(matches) {\n  const totals = [];\n\n  for (const m of matches) {\n    const existing = totals.find(t => t.player === m.player);\n    if (existing) {\n      existing.total += m.points;\n    } else {\n      totals.push({ player: m.player, total: m.points });\n    }\n  }\n\n  totals.sort((a, b) => b.total - a.total || a.player.localeCompare(b.player));\n\n  return totals.slice(0, 3);\n}\n\nconsole.log(leaderboard([\n  { player: "Ana", points: 10 },\n  { player: "Ben", points: 5 },\n  { player: "Ana", points: 15 },\n  { player: "Cy",  points: 20 },\n  { player: "Ben", points: 12 },\n  { player: "Dee", points: 8 },\n  { player: "Cy",  points: 3 },\n]));`,
  },
};

export const ADVANCED_STAGES: Stage[] = [
  findSomeEvery,
  sliceSpliceSort,
  copiesAndSpread,
  arraysOfObjects,
  grids,
  chaining,
  leaderboard,
];
