import type { Stage } from "@/lib/academy/types";
import { isSameValue } from "@/lib/academy/format";
import { Analogy, CodeBlock, Cheat, CheatSheet, PanelHeading, Tip } from "../../content";
import { check } from "../check";
import { ReferenceCopyWidget } from "../../widgets/reference-copy";
import { ExpressionExplorer } from "../../widgets/expression-explorer";
import { FreezeSealWidget } from "../../widgets/freeze-seal";
import { PrototypeChainWidget } from "../../widgets/prototype-chain";

// ---------------------------------------------------------------------------
// Widgets for this section
// ---------------------------------------------------------------------------

function ReferencesWidget() {
  return (
    <ReferenceCopyWidget intro="Start with copy = original, then change copy.name. Each badge number is one actual object in memory: same number, same object." />
  );
}

function ShallowDeepWidget() {
  return (
    <ReferenceCopyWidget intro="Now try the spread copy and change both fields. The outer object is new, but look at the address badge." />
  );
}

function StructuredCloneWidget() {
  return (
    <ExpressionExplorer
      intro="Compare the JSON trick with structuredClone. Some of these crash: that's the point."
      setup={`const original = {
  name: "Ana",
  joined: new Date("2024-01-15"),
  address: { city: "Oslo" },
  nickname: undefined,
};
const loop = { name: "me" };
loop.self = loop;   // an object that contains itself`}
      expressions={[
        { code: "structuredClone(original).address === original.address", note: "A deep copy: even the nested address is a new object." },
        { code: "structuredClone(original).joined instanceof Date", note: "Dates survive as real Dates." },
        { code: "typeof JSON.parse(JSON.stringify(original)).joined", note: "The JSON trick turns the Date into a plain string." },
        { code: '"nickname" in JSON.parse(JSON.stringify(original))', note: "JSON drops properties whose value is undefined." },
        { code: "JSON.stringify(loop)", note: "JSON can't handle an object that refers to itself." },
        { code: "((copy) => copy.self === copy)(structuredClone(loop))", note: "structuredClone copies circular references correctly." },
        { code: "structuredClone({ greet() { return 'hi'; } })", note: "Functions can't be cloned, so objects with methods fail." },
      ]}
      ownExpressionStart="structuredClone([1, [2, 3]])"
    />
  );
}

function DescriptorsWidget() {
  return (
    <ExpressionExplorer
      intro="id was added with defineProperty and locked down. fullName is a getter. Predict each result."
      setup={`const user = { first: "Ana", last: "Silva" };
Object.defineProperty(user, "id", {
  value: 42,
  writable: false,
  enumerable: false,
  configurable: false,
});
Object.defineProperty(user, "fullName", {
  get() { return this.first + " " + this.last; },
  enumerable: true,
});`}
      expressions={[
        { code: 'Object.getOwnPropertyDescriptor(user, "first")', note: "Normal properties have every switch on." },
        { code: 'Object.getOwnPropertyDescriptor(user, "id")', note: "Exactly the settings we chose." },
        { code: "user.id", note: "You can still read it." },
        { code: "(user.id = 7, user.id)", note: "Writing is silently ignored outside strict mode." },
        { code: "Object.keys(user)", note: "id is non-enumerable, so it's hidden from keys and loops." },
        { code: "user.fullName", note: "A getter runs a function each time you read it." },
        { code: '(user.first = "Bea", user.fullName)', note: "It recalculates from the current values." },
        { code: "delete user.id", note: "Non-configurable properties can't be deleted." },
      ]}
      ownExpressionStart="JSON.stringify(user)"
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const PART_MEMORY = "Part 1 · Copies & memory";
const PART_CONTROL = "Part 2 · Control & inheritance";

const referencesAndMutation: Stage = {
  id: "adv-references",
  level: "adv",
  part: PART_MEMORY,
  title: "Object references and mutation",
  short: "References",
  lead: (
    <>
      A variable doesn&apos;t hold an object; it holds a <b>reference</b> to
      one, like an address. Copying the variable copies the address, not the
      object.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🏠">
        Writing a <b>house address</b> on two sticky notes doesn&apos;t build a
        second house. Whoever visits either address and repaints the door
        repaints the one and only house.
      </Analogy>
      <CodeBlock
        code={`const a = { score: 1 };
const b = a;            // b gets the same reference: ONE object, two names

b.score = 99;
console.log(a.score);   // 99 ← "a" changed, because it's the same object
a === b                 // true: same object`}
      />
      <p>
        Numbers and strings don&apos;t behave like this (copying a number
        really copies it). Objects and arrays do, because copying a whole
        object every time would be slow and usually isn&apos;t what you want.
      </p>
      <p>
        <b>Comparing objects</b> with <code>===</code> asks &quot;is this the
        same object?&quot;, not &quot;do they look the same?&quot;:
      </p>
      <CodeBlock
        code={`{ x: 1 } === { x: 1 }   // false: two different objects

function reset(player) {
  player.score = 0;      // functions receive the reference too…
}
reset(a);
a.score                  // 0 …so they can change the caller's object`}
      />
      <p>
        <b>Mutation vs reassignment.</b> Changing a property{" "}
        <i>mutates</i> the shared object. Pointing a variable at a new object (
        <code>{"b = { score: 5 }"}</code>, with <code>let</code>) only moves
        that one sticky note; the other variable is unaffected.
      </p>
      <Tip>
        ⚠️ The most common object bug: a function that &quot;quietly&quot;
        changes the object it was given. If a function shouldn&apos;t affect
        the caller&apos;s data, build and return a <b>new</b> object instead.
      </Tip>
    </>
  ),
  widget: { title: "Same object or a copy?", Component: ReferencesWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"const x = { n: 1 }; const y = x; y.n = 2;"}</code> What is{" "}
          <code>x.n</code>?
        </>
      ),
      options: ["1", "2", "undefined", "An error"],
      answerIndex: 1,
      explanation: "x and y refer to the same object, so the change shows up through both names.",
    },
    {
      question: (
        <>
          What is <code>{"{ a: 1 } === { a: 1 }"}</code>?
        </>
      ),
      options: ["true", "false", "undefined", "An error"],
      answerIndex: 1,
      explanation: "=== on objects checks identity. These are two separate objects that happen to look alike.",
    },
    {
      question: (
        <>
          <code>{"let p = { n: 1 }; let q = p; q = { n: 5 };"}</code> What is{" "}
          <code>p.n</code>?
        </>
      ),
      options: ["1", "5", "undefined", "An error"],
      answerIndex: 0,
      explanation: "q was pointed at a brand-new object. That reassignment doesn't touch p's object.",
    },
  ],
  exercise: {
    task: (
      <>
        <code>addBonus</code> has a bug: it changes the player it&apos;s given.
        Rewrite it so it <b>returns a new object</b> with{" "}
        <code>score</code> increased by 10, and leaves the original player
        exactly as it was.
      </>
    ),
    starter: `function addBonus(player) {\n  player.score = player.score + 10;   // bug: changes the caller's object\n  return player;\n}\n\nconst kai = { name: "Kai", score: 5, level: 2 };\nconst boosted = addBonus(kai);\nconsole.log(boosted.score, kai.score);   // should be 15 5`,
    extract: `(() => {
      const kai = { name: "Kai", score: 5, level: 2 };
      const boosted = addBonus(kai);
      const again = addBonus(kai);
      return { boosted, kai, again, different: boosted !== kai };
    })()`,
    tests: (values) => [
      check(isSameValue(values.boosted, { name: "Kai", score: 15, level: 2 }), "the result has score 15 and keeps the other fields"),
      check(isSameValue(values.kai, { name: "Kai", score: 5, level: 2 }), "the original player still has score 5"),
      check(values.different === true, "the result is a different object"),
      check(isSameValue(values.again, { name: "Kai", score: 15, level: 2 }), "calling it twice gives 15 both times (no hidden changes)"),
    ],
    hint: (
      <>
        Copy then change: <code>{"return { ...player, score: player.score + 10 };"}</code>
      </>
    ),
    solution: `function addBonus(player) {\n  return { ...player, score: player.score + 10 };\n}\n\nconst kai = { name: "Kai", score: 5, level: 2 };\nconst boosted = addBonus(kai);\nconsole.log(boosted.score, kai.score);   // should be 15 5`,
  },
};

const shallowVsDeep: Stage = {
  id: "adv-shallow-deep",
  level: "adv",
  part: PART_MEMORY,
  title: "Shallow copying vs deep copying",
  short: "Shallow vs deep",
  lead: (
    <>
      Spread and <code>Object.assign</code> make a <b>shallow</b> copy: a new
      outer object, but nested objects inside are still shared. A{" "}
      <b>deep</b> copy copies every level.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🗂️">
        Photocopying a folder&apos;s <b>contents page</b> gives you a new page,
        but the documents it lists are still the same originals. A deep copy
        photocopies every document inside, too.
      </Analogy>
      <CodeBlock
        code={`const user = { name: "Ana", address: { city: "Oslo" } };
const copy = { ...user };          // shallow copy

copy.name = "Bo";                  // ✓ safe: name lives on the new outer object
copy.address.city = "Rome";        // ❌ address is the SAME inner object

console.log(user.name);            // "Ana"
console.log(user.address.city);    // "Rome"  😬`}
      />
      <p>
        The fix for a shape you know: <b>copy each level you change</b>.
        This is the everyday pattern in modern apps:
      </p>
      <CodeBlock
        code={`const moved = {
  ...user,                                   // copy the outer level
  address: { ...user.address, city: "Rome" } // and the level you change
};
user.address.city   // still "Oslo" ✓`}
      />
      <p>
        You&apos;ll also see the old <b>JSON trick</b>,{" "}
        <code>JSON.parse(JSON.stringify(obj))</code>. It deep-copies plain
        data but quietly damages anything else: Dates become strings, functions
        and <code>undefined</code> values vanish. The next stage covers the
        proper tool.
      </p>
      <Tip>
        💡 Shallow copies aren&apos;t wrong; they&apos;re cheap. Copy only the
        levels you&apos;re about to change and keep sharing the rest. Just be
        sure you never change a nested object that&apos;s still shared.
      </Tip>
    </>
  ),
  widget: { title: "Shallow or deep?", Component: ShallowDeepWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"const c = { ...o };"}</code> Which change also affects{" "}
          <code>o</code>?
        </>
      ),
      options: ['c.title = "x"', "c.tags.push(\"x\")  (tags is an array)", "c.count = 3", "delete c.title"],
      answerIndex: 1,
      explanation: "tags is a nested array, still shared after a shallow copy. Pushing changes the one array both objects point at.",
    },
    {
      question: "What does the JSON trick do to a Date property?",
      options: [
        "Keeps it as a Date",
        "Turns it into a string",
        "Removes it",
        "Throws an error",
      ],
      answerIndex: 1,
      explanation: "JSON has no Date type, so it's written out and read back as text.",
    },
    {
      question: "Which updates the nested city without touching the original?",
      options: [
        '{ ...user, city: "Rome" }',
        '{ ...user, address: { city: "Rome" } }',
        '{ ...user, address: { ...user.address, city: "Rome" } }',
        'user.address.city = "Rome"',
      ],
      answerIndex: 2,
      explanation: "Copy each level you change, keeping the other address fields. The second option would drop them.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>moveHouse(user, newCity)</code>. Return a new user whose{" "}
        <code>address.city</code> is <code>newCity</code>. Keep every other
        field (including other address fields). The original user, and its
        address object, must not change, and the result needs its{" "}
        <b>own</b> new address object.
      </>
    ),
    starter: `function moveHouse(user, newCity) {\n\n}\n\nconst ana = { name: "Ana", address: { city: "Oslo", zip: "0150" }, tags: ["vip"] };\nconst moved = moveHouse(ana, "Rome");\nconsole.log(moved.address.city, ana.address.city);   // Rome Oslo`,
    extract: `(() => {
      const ana = { name: "Ana", address: { city: "Oslo", zip: "0150" }, tags: ["vip"] };
      const before = JSON.stringify(ana);
      const moved = moveHouse(ana, "Rome");
      return {
        moved,
        untouched: JSON.stringify(ana) === before,
        newOuter: moved !== ana,
        newAddress: moved && moved.address !== ana.address,
      };
    })()`,
    tests: (values) => [
      check(
        isSameValue(values.moved, { name: "Ana", address: { city: "Rome", zip: "0150" }, tags: ["vip"] }),
        "the result has city Rome and keeps name, zip and tags"
      ),
      check(values.untouched === true, "the original user (and its address) did not change"),
      check(values.newOuter === true, "the result is a new object"),
      check(values.newAddress === true, "the result has its own new address object"),
    ],
    hint: (
      <>
        <code>{"return { ...user, address: { ...user.address, city: newCity } };"}</code>
      </>
    ),
    solution: `function moveHouse(user, newCity) {\n  return {\n    ...user,\n    address: { ...user.address, city: newCity },\n  };\n}\n\nconst ana = { name: "Ana", address: { city: "Oslo", zip: "0150" }, tags: ["vip"] };\nconst moved = moveHouse(ana, "Rome");\nconsole.log(moved.address.city, ana.address.city);   // Rome Oslo`,
  },
};

const structuredCloning: Stage = {
  id: "adv-clone",
  level: "adv",
  part: PART_MEMORY,
  title: "Structured cloning",
  short: "structuredClone",
  lead: (
    <>
      <code>structuredClone(value)</code> makes a complete deep copy in one
      call: every level, plus Dates, Maps, Sets and even objects that refer to
      themselves. It&apos;s built into modern browsers and Node.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🧬">
        A <b>full clone</b> rather than a photocopy of the cover: everything
        inside is duplicated, so the two can go their separate ways completely.
      </Analogy>
      <CodeBlock
        code={`const original = {
  name: "Ana",
  joined: new Date("2024-01-15"),
  address: { city: "Oslo" },
};

const copy = structuredClone(original);

copy.address.city = "Rome";
original.address.city          // "Oslo" ✓ nothing is shared
copy.joined instanceof Date    // true ✓ (the JSON trick gives a string)`}
      />
      <p>
        <b>What it can&apos;t clone.</b> It copies <i>data</i>, not behaviour:
      </p>
      <CodeBlock
        code={`structuredClone({ greet() {} })
// ❌ DataCloneError: functions can't be cloned

class Point { constructor(x) { this.x = x; } }
structuredClone(new Point(1)) instanceof Point
// false: you get a plain { x: 1 }, the class is lost`}
      />
      <p>
        <b>Which copy should I use?</b>
      </p>
      <ul className="my-3 list-disc pl-10">
        <li>
          Changing one or two levels? Spread those levels (fast, clear).
        </li>
        <li>
          Need a fully independent snapshot of plain data (undo history, a
          draft, a backup)? <code>structuredClone</code>.
        </li>
        <li>
          Avoid the JSON trick in new code; it silently breaks Dates and
          drops values.
        </li>
      </ul>
      <Tip>
        💡 Deep copies cost time and memory proportional to the whole object.
        Cloning a small settings object is nothing; cloning a huge data set on
        every keystroke is not.
      </Tip>
    </>
  ),
  widget: { title: "Clone it", Component: StructuredCloneWidget },
  quiz: [
    {
      question: (
        <>
          After <code>const c = structuredClone(o);</code>, changing{" "}
          <code>c.a.b</code> affects <code>o</code>…
        </>
      ),
      options: ["Always", "Never", "Only for arrays", "Only if a is a Date"],
      answerIndex: 1,
      explanation: "structuredClone copies every level, so nothing is shared.",
    },
    {
      question: "Which of these will structuredClone refuse?",
      options: [
        "{ when: new Date() }",
        "{ list: [1, [2, 3]] }",
        "{ run() { return 1; } }",
        "An object that refers to itself",
      ],
      answerIndex: 2,
      explanation: "Functions can't be cloned. Dates, nesting and circular references are all fine.",
    },
    {
      question: "Why prefer structuredClone over the JSON trick?",
      options: [
        "It's shorter to type",
        "It keeps Dates as Dates and handles undefined and circular references",
        "It copies functions too",
        "It only copies the top level",
      ],
      answerIndex: 1,
      explanation: "The JSON round trip loses types and fails on cycles; structuredClone doesn't.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>makeBackup(game)</code>. Return a <b>deep copy</b> of the
        game made with <code>structuredClone</code>, with one extra property:{" "}
        <code>backupOf</code> set to the game&apos;s <code>id</code>. Later
        changes to the game (at any depth) must not affect the backup, and{" "}
        <code>startedAt</code> must still be a Date.
      </>
    ),
    starter: `function makeBackup(game) {\n\n}\n\nconst game = {\n  id: "g-17",\n  startedAt: new Date("2025-03-01T10:00:00Z"),\n  players: [{ name: "Ivy", score: 3 }],\n};\nconst backup = makeBackup(game);\ngame.players[0].score = 99;\nconsole.log(backup.players[0].score);   // should still be 3`,
    extract: `(() => {
      const game = { id: "g-17", startedAt: new Date("2025-03-01T10:00:00Z"), players: [{ name: "Ivy", score: 3 }], settings: { mode: "duo" } };
      const backup = makeBackup(game);
      game.players[0].score = 99;
      game.players.push({ name: "Max", score: 0 });
      game.settings.mode = "solo";
      return {
        backupOf: backup.backupOf,
        players: backup.players,
        mode: backup.settings.mode,
        isDate: backup.startedAt instanceof Date,
        sameTime: backup.startedAt instanceof Date && backup.startedAt.getTime() === new Date("2025-03-01T10:00:00Z").getTime(),
        gameHasNoBackupOf: !("backupOf" in game),
      };
    })()`,
    tests: (values, code) => [
      check(values.backupOf === "g-17", 'backup.backupOf is "g-17"'),
      check(isSameValue(values.players, [{ name: "Ivy", score: 3 }]), "later changes to players don't reach the backup"),
      check(values.mode === "duo", "later changes to nested settings don't reach the backup"),
      check(values.isDate === true && values.sameTime === true, "startedAt is still the same Date"),
      check(values.gameHasNoBackupOf === true, "the original game didn't get a backupOf property"),
      check(/structuredClone\s*\(/.test(code), "you used structuredClone"),
    ],
    hint: (
      <>
        <code>const copy = structuredClone(game);</code> then{" "}
        <code>copy.backupOf = game.id;</code> and <code>return copy;</code>
      </>
    ),
    solution: `function makeBackup(game) {\n  const copy = structuredClone(game);\n  copy.backupOf = game.id;\n  return copy;\n}\n\nconst game = {\n  id: "g-17",\n  startedAt: new Date("2025-03-01T10:00:00Z"),\n  players: [{ name: "Ivy", score: 3 }],\n};\nconst backup = makeBackup(game);\ngame.players[0].score = 99;\nconsole.log(backup.players[0].score);   // should still be 3`,
  },
};

const propertyDescriptors: Stage = {
  id: "adv-descriptors",
  level: "adv",
  part: PART_CONTROL,
  title: "Property descriptors and getters",
  short: "Descriptors & getters",
  lead: (
    <>
      Every property has hidden settings besides its value: can it be changed
      (<b>writable</b>), does it show up in loops (<b>enumerable</b>), can it
      be deleted or redefined (<b>configurable</b>)? A <b>getter</b> computes
      its value whenever it&apos;s read.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🎛️">
        Each drawer has <b>hidden switches</b> on the back: a lock, an
        &quot;include in the inventory&quot; switch, and a &quot;can be
        removed&quot; switch. Normally they&apos;re all on. You can flip them
        with <code>Object.defineProperty</code>.
      </Analogy>
      <CodeBlock
        code={`const user = { name: "Ana" };

Object.getOwnPropertyDescriptor(user, "name");
// { value: "Ana", writable: true, enumerable: true, configurable: true }

Object.defineProperty(user, "id", {
  value: 42,
  writable: false,      // can't be changed
  enumerable: false,    // hidden from Object.keys, for...in and JSON
  configurable: false,  // can't be deleted or redefined
});

user.id = 7;            // ignored (a TypeError in strict mode)
user.id                 // 42
Object.keys(user)       // ["name"]
delete user.id          // false`}
      />
      <p>
        <b>Getters</b> look like ordinary properties but run a function when
        read, so the value is always up to date. In an object literal, write{" "}
        <code>get</code> before a method name:
      </p>
      <CodeBlock
        code={`const person = {
  first: "Ana",
  last: "Silva",
  get fullName() {
    return this.first + " " + this.last;
  },
};

person.fullName          // "Ana Silva"  (no parentheses!)
person.first = "Bea";
person.fullName          // "Bea Silva"
person.fullName = "X";   // ignored: there's no setter`}
      />
      <Tip>
        ⚠️ <code>defineProperty</code> defaults every switch you leave out to{" "}
        <b>false</b>, the opposite of normal properties. If you only meant to
        make a property read-only, say <code>enumerable: true</code> explicitly
        or it will also vanish from <code>Object.keys</code>.
      </Tip>
    </>
  ),
  widget: { title: "Look behind the drawer", Component: DescriptorsWidget },
  quiz: [
    {
      question: (
        <>
          A property was defined with <code>enumerable: false</code>. Where
          does it still appear?
        </>
      ),
      options: ["Object.keys(obj)", "JSON.stringify(obj)", "obj.thatProperty", "for...in loops"],
      answerIndex: 2,
      explanation: "Non-enumerable properties are hidden from listings, but reading them directly still works.",
    },
    {
      question: (
        <>
          <code>{'Object.defineProperty(o, "x", { value: 1 })'}</code>: is{" "}
          <code>o.x</code> writable?
        </>
      ),
      options: ["Yes, properties are writable by default", "No, unspecified switches default to false", "Only once", "Only inside methods"],
      answerIndex: 1,
      explanation: "With defineProperty, anything you don't set is false.",
    },
    {
      question: "How do you read a getter called total?",
      options: ["obj.total()", "obj.total", "obj.get(total)", "obj.getTotal"],
      answerIndex: 1,
      explanation: "Getters are read like normal properties; the function runs behind the scenes.",
    },
  ],
  exercise: {
    task: (
      <>
        Two small jobs:
        <ol>
          <li>
            <code>addId(obj, id)</code>: define an <code>id</code> property
            that is <b>not writable, not enumerable and not configurable</b>,
            then return <code>obj</code>.
          </li>
          <li>
            Give <code>temperature</code> a <b>getter</b> called{" "}
            <code>fahrenheit</code> that returns <code>celsius * 9 / 5 + 32</code>
            .
          </li>
        </ol>
      </>
    ),
    starter: `function addId(obj, id) {\n\n}\n\nconst temperature = {\n  celsius: 20,\n  // add a getter called fahrenheit here\n};\n\nconsole.log(temperature.fahrenheit);   // 68`,
    extract: `(() => {
      const item = addId({ name: "Lamp" }, 7);
      const descriptor = Object.getOwnPropertyDescriptor(item, "id") || {};
      item.id = 99;
      const deleted = delete item.id;
      const f1 = temperature.fahrenheit;
      temperature.celsius = 100;
      const f2 = temperature.fahrenheit;
      const fDescriptor = Object.getOwnPropertyDescriptor(temperature, "fahrenheit") || {};
      return {
        id: item.id,
        keys: Object.keys(item),
        writable: descriptor.writable,
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable,
        deleted,
        f1, f2,
        isGetter: typeof fDescriptor.get === "function",
      };
    })()`,
    tests: (values) => [
      check(values.id === 7, "item.id is 7, even after trying to set it to 99"),
      check(values.writable === false && values.configurable === false && values.deleted === false, "id can't be changed or deleted"),
      check(values.enumerable === false && isSameValue(values.keys, ["name"]), "id is hidden from Object.keys"),
      check(values.f1 === 68, "20°C → fahrenheit is 68"),
      check(values.f2 === 212 && values.isGetter === true, "fahrenheit is a getter that follows celsius (100°C → 212)"),
    ],
    hint: (
      <>
        <code>{"Object.defineProperty(obj, \"id\", { value: id, writable: false, enumerable: false, configurable: false });"}</code>{" "}
        then <code>return obj;</code>. In the object:{" "}
        <code>{"get fahrenheit() { return this.celsius * 9 / 5 + 32; },"}</code>
      </>
    ),
    solution: `function addId(obj, id) {\n  Object.defineProperty(obj, "id", {\n    value: id,\n    writable: false,\n    enumerable: false,\n    configurable: false,\n  });\n  return obj;\n}\n\nconst temperature = {\n  celsius: 20,\n  get fahrenheit() {\n    return this.celsius * 9 / 5 + 32;\n  },\n};\n\nconsole.log(temperature.fahrenheit);   // 68`,
  },
};

const freezeAndSeal: Stage = {
  id: "adv-freeze",
  level: "adv",
  part: PART_CONTROL,
  title: "Object.freeze() and Object.seal()",
  short: "freeze & seal",
  lead: (
    <>
      <code>Object.seal</code> stops properties being <b>added or removed</b>
      . <code>Object.freeze</code> also stops them being <b>changed</b>. Both
      are shallow: nested objects stay unlocked unless you lock them too.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🧊">
        A <b>sealed</b> jar: you can stir what&apos;s inside, but you can&apos;t
        add or take anything out. A <b>frozen</b> block of ice: nothing inside
        can move at all.
      </Analogy>
      <CodeBlock
        code={`const settings = { theme: "dark", fontSize: 14 };

Object.seal(settings);
settings.fontSize = 18;      // ✓ allowed: changing an existing value
settings.language = "en";    // ✗ ignored: can't add
delete settings.theme;       // ✗ ignored: can't remove

const config = Object.freeze({ apiUrl: "/api", retries: 3 });
config.retries = 10;         // ✗ ignored: nothing can change
Object.isFrozen(config)      // true`}
      />
      <p>
        &quot;Ignored&quot; means silently, in normal scripts. In{" "}
        <b>strict mode</b> (which classes and ES modules use automatically)
        each blocked change throws a <code>TypeError</code>, which is much
        easier to notice.
      </p>
      <p>
        <b>Freezing is shallow.</b> Only the object you pass in is locked:
      </p>
      <CodeBlock
        code={`const app = Object.freeze({ user: { name: "Ana" } });
app.user = null;          // ✗ ignored
app.user.name = "Bo";     // ✓ works! user is a separate, unfrozen object`}
      />
      <p>
        To lock every level, freeze recursively: freeze each nested object,
        then the object itself (a &quot;deep freeze&quot;).
      </p>
      <Tip>
        💡 Freezing is great for <b>constants and configuration</b> that
        nothing should ever change. Remember that <code>const</code> only stops
        reassigning the variable; <code>Object.freeze</code> is what protects
        the contents.
      </Tip>
    </>
  ),
  widget: { title: "Seal vs freeze", Component: FreezeSealWidget },
  quiz: [
    {
      question: "On a sealed object, which still works?",
      options: ["Adding a property", "Deleting a property", "Changing an existing property's value", "None of them"],
      answerIndex: 2,
      explanation: "Seal fixes which properties exist, but their values can still change.",
    },
    {
      question: (
        <>
          <code>{'const o = Object.freeze({ inner: { n: 1 } }); o.inner.n = 2;'}</code>{" "}
          What is <code>o.inner.n</code>?
        </>
      ),
      options: ["1", "2", "undefined", "It throws"],
      answerIndex: 1,
      explanation: "freeze is shallow. inner is its own object and was never frozen.",
    },
    {
      question: (
        <>
          What&apos;s the difference between <code>const</code> and{" "}
          <code>Object.freeze</code>?
        </>
      ),
      options: [
        "None",
        "const stops reassigning the variable; freeze stops changing the object's contents",
        "const is deep; freeze is shallow",
        "freeze only works on arrays",
      ],
      answerIndex: 1,
      explanation: "They protect different things, so you often use both together.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>deepFreeze(obj)</code>: freeze <code>obj</code> and every
        object or array nested inside it, at any depth, then return{" "}
        <code>obj</code>.
      </>
    ),
    starter: `function deepFreeze(obj) {\n  // 1. loop over obj's values\n  // 2. if a value is an object (and not null), deepFreeze it too\n  // 3. freeze obj itself and return it\n}\n\nconst config = deepFreeze({ api: { url: "/v1", retry: { times: 3 } }, flags: ["beta"] });\nconfig.api.retry.times = 99;\nconsole.log(config.api.retry.times);   // should still be 3`,
    extract: `(() => {
      const config = { name: "app", api: { url: "/v1", retry: { times: 3 } }, flags: ["beta"], empty: null };
      const returned = deepFreeze(config);
      config.api.retry.times = 99;
      config.api.url = "/v2";
      config.flags.length = 0;
      config.name = "changed";
      return {
        same: returned === config,
        frozenTop: Object.isFrozen(config),
        frozenApi: Object.isFrozen(config.api),
        frozenRetry: Object.isFrozen(config.api.retry),
        frozenFlags: Object.isFrozen(config.flags),
        values: config,
      };
    })()`,
    tests: (values) => [
      check(values.same === true, "deepFreeze returns the same object it was given"),
      check(values.frozenTop === true, "the top level is frozen"),
      check(values.frozenApi === true && values.frozenRetry === true, "nested objects at every depth are frozen"),
      check(values.frozenFlags === true, "nested arrays are frozen too"),
      check(
        isSameValue(values.values, { name: "app", api: { url: "/v1", retry: { times: 3 } }, flags: ["beta"], empty: null }),
        "no change got through, and null values didn't cause a crash"
      ),
    ],
    hint: (
      <>
        <code>
          {'for (const value of Object.values(obj)) { if (typeof value === "object" && value !== null) { deepFreeze(value); } }'}
        </code>{" "}
        then <code>return Object.freeze(obj);</code>
      </>
    ),
    solution: `function deepFreeze(obj) {\n  for (const value of Object.values(obj)) {\n    if (typeof value === "object" && value !== null) {\n      deepFreeze(value);\n    }\n  }\n  return Object.freeze(obj);\n}\n\nconst config = deepFreeze({ api: { url: "/v1", retry: { times: 3 } }, flags: ["beta"] });\nconfig.api.retry.times = 99;\nconsole.log(config.api.retry.times);   // should still be 3`,
  },
};

const prototypes: Stage = {
  id: "adv-prototypes",
  level: "adv",
  part: PART_CONTROL,
  title: "Prototypes and inheritance",
  short: "Prototypes",
  lead: (
    <>
      Every object has a hidden link to another object, its{" "}
      <b>prototype</b>. If you read a property the object doesn&apos;t have,
      JavaScript follows that link and looks there, then up the chain.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="👪">
        Asking for a <b>family recipe</b>. If you don&apos;t know it, you ask a
        parent; if they don&apos;t, they ask a grandparent. The first person
        who knows it answers. Nobody copies the recipe down; they just know who
        to ask.
      </Analogy>
      <CodeBlock
        code={`const animal = {
  alive: true,
  eat() { return this.name + " eats"; },
};

const dog = Object.create(animal);     // dog's prototype is animal
dog.bark = function () { return "Woof"; };

const rex = Object.create(dog);        // rex's prototype is dog
rex.name = "Rex";

rex.name     // "Rex"       own property
rex.bark()   // "Woof"      found on dog
rex.eat()    // "Rex eats"  found on animal, and this is still rex
rex.fly      // undefined   checked every link, then hit null`}
      />
      <p>
        That&apos;s also why <code>{"{}.toString"}</code> exists: every plain
        object&apos;s chain ends at <code>Object.prototype</code>, which owns{" "}
        <code>toString</code>, <code>hasOwnProperty</code> and friends.
      </p>
      <p>
        <b>Own vs inherited.</b> Setting a property always writes to the object
        itself, which <b>shadows</b> (hides) any inherited one with the same
        name:
      </p>
      <CodeBlock
        code={`Object.getPrototypeOf(rex) === dog    // true
Object.hasOwn(rex, "bark")             // false, it's inherited
rex.alive = false;                     // creates rex's OWN alive
animal.alive                           // still true`}
      />
      <p>
        <b>Classes are built on this.</b> The <code>class</code> syntax is a
        friendlier way to set up the same prototype chain:
      </p>
      <CodeBlock
        code={`class Animal {
  constructor(name) { this.name = name; }
  eat() { return this.name + " eats"; }
}
class Dog extends Animal {
  bark() { return "Woof"; }
}

const fido = new Dog("Fido");
Object.getPrototypeOf(fido) === Dog.prototype            // true
Object.getPrototypeOf(Dog.prototype) === Animal.prototype // true`}
      />
      <Tip>
        💡 Methods live <b>once</b> on the prototype and are shared by every
        object below it. A thousand dogs don&apos;t need a thousand copies of{" "}
        <code>bark</code>.
      </Tip>
    </>
  ),
  widget: { title: "Walk the chain", Component: PrototypeChainWidget },
  quiz: [
    {
      question: (
        <>
          <code>const b = Object.create(a);</code> where <code>a.x = 1</code>.
          What is <code>b.x</code>?
        </>
      ),
      options: ["undefined", "1", "An error", "null"],
      answerIndex: 1,
      explanation: "b doesn't own x, so JavaScript looks it up on b's prototype, a.",
    },
    {
      question: (
        <>
          Continuing: what is <code>Object.hasOwn(b, &quot;x&quot;)</code>?
        </>
      ),
      options: ["true", "false"],
      answerIndex: 1,
      explanation: "x is inherited from a, not b's own property.",
    },
    {
      question: (
        <>
          Then you run <code>b.x = 5;</code>. What is <code>a.x</code>?
        </>
      ),
      options: ["5", "1", "undefined", "It throws"],
      answerIndex: 1,
      explanation: "Assignment creates b's own x, which shadows a's. a is unchanged.",
    },
  ],
  exercise: {
    task: (
      <>
        Use <code>Object.create</code> to build two objects that inherit from{" "}
        <code>vehicle</code>:
        <ol>
          <li>
            <code>car</code>: own <code>name</code> of{" "}
            <code>&quot;Car&quot;</code> (uses the inherited 4 wheels)
          </li>
          <li>
            <code>bike</code>: own <code>name</code> of{" "}
            <code>&quot;Bike&quot;</code> and its own <code>wheels</code> of{" "}
            <code>2</code>
          </li>
        </ol>
        Don&apos;t copy <code>describe</code> onto them; they should inherit it.
      </>
    ),
    starter: `const vehicle = {\n  wheels: 4,\n  describe() {\n    return this.name + " has " + this.wheels + " wheels";\n  },\n};\n\n// create car and bike here\n\n\nconsole.log(car.describe());\nconsole.log(bike.describe());`,
    extract: `({
      carText: car.describe(),
      bikeText: bike.describe(),
      carProto: Object.getPrototypeOf(car) === vehicle,
      bikeProto: Object.getPrototypeOf(bike) === vehicle,
      carOwnsDescribe: Object.hasOwn(car, "describe") || Object.hasOwn(bike, "describe"),
      carOwnsWheels: Object.hasOwn(car, "wheels"),
      bikeOwnsWheels: Object.hasOwn(bike, "wheels"),
      vehicleWheels: vehicle.wheels,
    })`,
    tests: (values) => [
      check(values.carText === "Car has 4 wheels", 'car.describe() → "Car has 4 wheels"'),
      check(values.bikeText === "Bike has 2 wheels", 'bike.describe() → "Bike has 2 wheels"'),
      check(values.carProto === true && values.bikeProto === true, "both have vehicle as their prototype"),
      check(values.carOwnsDescribe === false, "describe is inherited, not copied"),
      check(values.carOwnsWheels === false && values.bikeOwnsWheels === true, "car inherits wheels; bike has its own"),
      check(values.vehicleWheels === 4, "vehicle itself still has 4 wheels"),
    ],
    hint: (
      <>
        <code>const car = Object.create(vehicle);</code> then{" "}
        <code>car.name = &quot;Car&quot;;</code>. Same for bike, plus{" "}
        <code>bike.wheels = 2;</code>
      </>
    ),
    solution: `const vehicle = {\n  wheels: 4,\n  describe() {\n    return this.name + " has " + this.wheels + " wheels";\n  },\n};\n\nconst car = Object.create(vehicle);\ncar.name = "Car";\n\nconst bike = Object.create(vehicle);\nbike.name = "Bike";\nbike.wheels = 2;\n\nconsole.log(car.describe());\nconsole.log(bike.describe());`,
  },
};

const advancedFinal: Stage = {
  id: "adv-final",
  level: "adv",
  part: PART_CONTROL,
  title: "Advanced final: the snapshot store",
  short: "Final: snapshot store",
  lead: (
    <>
      Apps often keep their data in a <b>store</b> that hands out read-only
      snapshots. Build one that no outside code can tamper with, using deep
      copies, freezing, spread and a getter.
    </>
  ),
  lesson: (
    <>
      <CodeBlock
        code={`const settings = { theme: { mode: "light" }, volume: 5 };
const store = createStore(settings);

settings.volume = 99;          // changing the input later…
store.getState().volume        // 5 …doesn't affect the store

const snap = store.getState();
snap.volume = 0;               // ignored: snapshots are deep-frozen
snap.theme.mode = "dark";      // ignored: every level is frozen

store.update({ volume: 7 });   // returns the new frozen state
snap.volume                    // still 5: old snapshots never change
store.version                  // 1, one update so far
store.version = 100;           // ignored: it's a getter with no setter`}
      />
      <p>A good plan:</p>
      <ol className="my-4 list-decimal pl-10">
        <li>
          Inside <code>createStore</code>, keep a private{" "}
          <code>let state = deepFreeze(structuredClone(initial));</code> and{" "}
          <code>let version = 0;</code>.
        </li>
        <li>
          <code>getState()</code> returns <code>state</code>. Because it&apos;s
          deep-frozen, it&apos;s safe to hand out as is.
        </li>
        <li>
          <code>update(changes)</code> builds the next state with spread,
          clones and freezes it, replaces <code>state</code>, adds one to{" "}
          <code>version</code>, and returns the new state. The old state
          object is never touched.
        </li>
        <li>
          <code>get version()</code> returns the count.
        </li>
      </ol>
      <PanelHeading className="mt-[22px]">Advanced cheat sheet</PanelHeading>
      <CheatSheet>
        <Cheat code="b = a">same object, two names</Cheat>
        <Cheat code="a === b">same object? (not same contents)</Cheat>
        <Cheat code="{ ...o, inner: { ...o.inner } }">copy the levels you change</Cheat>
        <Cheat code="structuredClone(o)">full deep copy of data</Cheat>
        <Cheat code="Object.defineProperty(o, k, {…})">control the hidden switches</Cheat>
        <Cheat code="get total() { … }">a computed, read-only property</Cheat>
        <Cheat code="Object.seal / Object.freeze">lock shape / lock everything</Cheat>
        <Cheat code="Object.create(proto)">a new object inheriting from proto</Cheat>
      </CheatSheet>
    </>
  ),
  quiz: [
    {
      question: "Why clone initial before storing it?",
      options: [
        "Cloning makes it faster",
        "So later changes to the caller's object can't sneak into the store",
        "Freezing needs a clone first",
        "So it becomes an array",
      ],
      answerIndex: 1,
      explanation: "The caller still holds a reference to initial. A clone breaks that link.",
    },
    {
      question: "Why is it safe for getState to return the stored object without copying it?",
      options: [
        "Because it's deep-frozen, so callers can't change it",
        "Because objects are copied when returned",
        "Because getState is a getter",
        "It isn't safe",
      ],
      answerIndex: 0,
      explanation: "A deep-frozen object can be shared freely: nothing can modify it.",
    },
    {
      question: "update makes a new state instead of changing the old one. What does that give you?",
      options: [
        "Less memory use",
        "Old snapshots stay exactly as they were",
        "Faster reads",
        "Nothing; it's only style",
      ],
      answerIndex: 1,
      explanation: "Anyone holding an older snapshot sees consistent data. That's how undo history works.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>createStore(initial)</code> returning an object with:
        <ol>
          <li>
            <code>getState()</code>: the current state, <b>deep-frozen</b> and
            unaffected by later changes to <code>initial</code>
          </li>
          <li>
            <code>update(changes)</code>: makes a new state from the current
            one plus <code>changes</code> (later wins), freezes it, and returns
            it. Earlier snapshots never change.
          </li>
          <li>
            a <code>version</code> getter: how many updates have happened
          </li>
        </ol>
        A <code>deepFreeze</code> helper is provided.
      </>
    ),
    starter: `function deepFreeze(obj) {\n  for (const value of Object.values(obj)) {\n    if (typeof value === "object" && value !== null) {\n      deepFreeze(value);\n    }\n  }\n  return Object.freeze(obj);\n}\n\nfunction createStore(initial) {\n  let state = initial;   // fix: clone it, then deep-freeze it\n  let version = 0;\n\n  return {\n    getState() {\n      return state;\n    },\n    update(changes) {\n      // build the next state, freeze it, store it, count it, return it\n    },\n    // add a version getter\n  };\n}\n\nconst store = createStore({ theme: { mode: "light" }, volume: 5 });\nconsole.log(store.update({ volume: 7 }), store.version);`,
    extract: `(() => {
      const settings = { theme: { mode: "light" }, volume: 5, tags: ["a"] };
      const store = createStore(settings);
      settings.volume = 99;
      settings.theme.mode = "neon";
      const first = store.getState();
      first.volume = 0;
      first.theme.mode = "dark";
      const updated = store.update({ volume: 7, extra: { on: true } });
      const second = store.getState();
      store.version = 100;
      const versionAfterOne = store.version;
      store.update({ volume: 8 });
      return {
        first,
        firstFrozenDeep: Object.isFrozen(first) && Object.isFrozen(first.theme) && Object.isFrozen(first.tags),
        updated,
        updatedIsCurrent: updated === second,
        secondFrozenDeep: Object.isFrozen(second) && Object.isFrozen(second.extra),
        versionAfterOne,
        versionAfterTwo: store.version,
        latestVolume: store.getState().volume,
        firstVolumeLater: first.volume,
      };
    })()`,
    tests: (values) => [
      check(
        isSameValue(values.first, { theme: { mode: "light" }, volume: 5, tags: ["a"] }),
        "later changes to initial don't reach the store, and snapshots can't be changed"
      ),
      check(values.firstFrozenDeep === true, "getState() is frozen at every level"),
      check(
        isSameValue(values.updated, { theme: { mode: "light" }, volume: 7, tags: ["a"], extra: { on: true } }) &&
          values.updatedIsCurrent === true,
        "update merges changes and returns the new current state"
      ),
      check(values.secondFrozenDeep === true, "updated states are deep-frozen too"),
      check(values.versionAfterOne === 1 && values.versionAfterTwo === 2, "version counts updates and can't be overwritten"),
      check(values.latestVolume === 8 && values.firstVolumeLater === 5, "old snapshots keep their values after later updates"),
    ],
    hint: (
      <>
        Start with <code>let state = deepFreeze(structuredClone(initial));</code>
        . In update:{" "}
        <code>{"state = deepFreeze(structuredClone({ ...state, ...changes })); version++; return state;"}</code>
        . Add <code>{"get version() { return version; },"}</code>
      </>
    ),
    solution: `function deepFreeze(obj) {\n  for (const value of Object.values(obj)) {\n    if (typeof value === "object" && value !== null) {\n      deepFreeze(value);\n    }\n  }\n  return Object.freeze(obj);\n}\n\nfunction createStore(initial) {\n  let state = deepFreeze(structuredClone(initial));\n  let version = 0;\n\n  return {\n    getState() {\n      return state;\n    },\n    update(changes) {\n      state = deepFreeze(structuredClone({ ...state, ...changes }));\n      version++;\n      return state;\n    },\n    get version() {\n      return version;\n    },\n  };\n}\n\nconst store = createStore({ theme: { mode: "light" }, volume: 5 });\nconsole.log(store.update({ volume: 7 }), store.version);`,
  },
};

export const OBJECT_ADVANCED_STAGES: Stage[] = [
  referencesAndMutation,
  shallowVsDeep,
  structuredCloning,
  propertyDescriptors,
  freezeAndSeal,
  prototypes,
  advancedFinal,
];
