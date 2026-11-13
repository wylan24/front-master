import type { Stage } from "@/lib/academy/types";
import { extractVariables, isMissing, isSameValue } from "@/lib/academy/format";
import { Analogy, CodeBlock, Cheat, CheatSheet, PanelHeading, Tip } from "../../content";
import { check, isPlainObject } from "../check";
import { PropertyPlayground } from "../../widgets/property-playground";
import { ExpressionExplorer } from "../../widgets/expression-explorer";
import { ObjectTreeExplorer } from "../../widgets/object-tree-explorer";
import { CodePlayground } from "../../widgets/code-playground";

// ---------------------------------------------------------------------------
// Widgets for this section. Each wraps a shared widget with this stage's data.
// ---------------------------------------------------------------------------

function BuildAnObjectWidget() {
  return (
    <PropertyPlayground
      intro="This object starts empty. Type a key and a value, then press set. Try name, age and isGoodBoy (true). Set the same key twice and watch it change instead of duplicating."
      variableName="pet"
      initial={{}}
    />
  );
}

function PropertyTypesWidget() {
  return (
    <ExpressionExplorer
      intro="Guess each result before you reveal it."
      setup={`const user = {
  username: "ada99",
  age: 36,
  isAdmin: false,
  hobbies: ["chess", "rowing"],
  "favourite colour": "teal",
};`}
      expressions={[
        { code: "user.username", note: "A string value." },
        { code: "typeof user.age", note: "Numbers are stored without quotes." },
        { code: "user.isAdmin", note: "Booleans are just true or false, no quotes." },
        {
          code: "typeof user.hobbies",
          note: (
            <>
              Arrays are a special kind of object, so <code>typeof</code> says
              &quot;object&quot;.
            </>
          ),
        },
        { code: 'user["favourite colour"]', note: "A key with a space must be quoted, and read with brackets." },
        { code: "({ volume: 3, volume: 8 }).volume", note: "Two properties with the same key: the last one wins." },
      ]}
      ownExpressionStart="user.hobbies[1]"
    />
  );
}

function DotAndBracketWidget() {
  return (
    <PropertyPlayground
      intro="Read properties with a dot, then use the bracket row to read with a key stored in a variable. Try reading a key that doesn't exist, and a key with a space using the dot."
      variableName="pet"
      initial={{ name: "Rex", age: 3, "best friend": "Tom" }}
      showBrackets
    />
  );
}

function ChangePropertiesWidget() {
  return (
    <PropertyPlayground
      intro="Set an existing key to change it, a new key to add it, and delete to remove one. The message tells you which of the three happened."
      variableName="player"
      initial={{ name: "Kai", score: 0, level: 1 }}
      showDelete
    />
  );
}

function NestedTreeWidget() {
  return (
    <ObjectTreeExplorer
      intro="Click any key to see the path of dots that reaches it. Each dot goes one level deeper."
      variableName="user"
      value={{
        name: "Lina",
        address: { city: "Lisbon", postcode: "1100-148" },
        settings: { theme: { mode: "dark", accent: "teal" }, notifications: false },
      }}
    />
  );
}

function SchoolTreeWidget() {
  return (
    <ObjectTreeExplorer
      intro="Arrays and objects inside each other. Click around: numbers in [brackets] pick from a list, .names pick a labelled field."
      variableName="school"
      value={{
        name: "Hillside",
        classes: [
          { teacher: "Ms Obi", students: ["Ivy", "Leo"] },
          { teacher: "Mr Sato", students: ["Max", "Zoe", "Ana"] },
        ],
      }}
    />
  );
}

function LoopObjectWidget() {
  return (
    <CodePlayground
      intro="Run each example, then change the stock numbers and run it again."
      examples={[
        {
          label: "List every key",
          code: `const stock = { apples: 12, pears: 0, plums: 7 };

for (const fruit in stock) {
  console.log(fruit + ": " + stock[fruit]);
}`,
          lookFor: "fruit holds the key; stock[fruit] fetches its value.",
        },
        {
          label: "Add up the values",
          code: `const stock = { apples: 12, pears: 0, plums: 7 };
let total = 0;

for (const fruit in stock) {
  total = total + stock[fruit];
}

console.log("Total fruit: " + total);`,
          lookFor: "The same running-total pattern you use with arrays.",
        },
        {
          label: "Find what's sold out",
          code: `const stock = { apples: 12, pears: 0, plums: 7 };
const soldOut = [];

for (const fruit in stock) {
  if (stock[fruit] === 0) {
    soldOut.push(fruit);
  }
}

console.log(soldOut);`,
          lookFor: "Loop, test, collect: the result is an array of keys.",
        },
        {
          label: "Common mistake",
          code: `const stock = { apples: 12, pears: 0, plums: 7 };

for (const fruit in stock) {
  console.log(stock.fruit);   // looks for a key literally called "fruit"
}`,
          lookFor: "Every line is undefined. With a key in a variable, you need stock[fruit].",
        },
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// Stages
// ---------------------------------------------------------------------------

const whatIsAnObject: Stage = {
  id: "what",
  level: "basic",
  title: "What is an object?",
  short: "What is an object?",
  lead: (
    <>
      An object keeps related information together as <b>named values</b>.
      Every piece gets a label, so you look things up by name instead of by
      position.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📇">
        Think of a <b>contact card</b> in your phone. It has a label for each
        line (Name, Phone, Email) and the information next to it. You never
        ask for &quot;line 3&quot;; you ask for the <b>email</b>.
      </Analogy>
      <p>Say you want to describe one pet. Separate variables get messy fast:</p>
      <CodeBlock
        code={`let petName = "Rex";
let petSpecies = "dog";
let petAge = 3;          // three variables for one pet 😬`}
      />
      <p>
        An array keeps them together, but now you have to remember what each
        position means:
      </p>
      <CodeBlock code={`const pet = ["Rex", "dog", 3];   // is pet[2] the age? the weight?`} />
      <p>
        An object solves both problems. Curly braces <code>{"{ }"}</code> make
        the object, each entry is <code>key: value</code>, and commas separate
        the entries:
      </p>
      <CodeBlock
        code={`const pet = {
  name: "Rex",
  species: "dog",
  age: 3,
};`}
      />
      <p>
        Each <code>key: value</code> pair is called a <b>property</b>. Now the
        code describes itself: <code>pet.age</code> is obviously the age.
      </p>
      <p>
        <b>Arrays or objects?</b> Use an array for a <i>list of similar
        things</i> in order (ten scores, five names). Use an object to describe{" "}
        <i>one thing with several named parts</i> (one user, one book, one
        order).
      </p>
      <Tip>
        💡 Inside an object you write <code>key: value</code> with a{" "}
        <b>colon</b>, never <code>key = value</code>. Forgetting a comma between
        properties is the most common beginner error. A comma after the last
        property is allowed, and makes adding the next one easier.
      </Tip>
    </>
  ),
  widget: { title: "Build an object", Component: BuildAnObjectWidget },
  quiz: [
    {
      question: "Which line correctly creates an object?",
      options: [
        'const pet = { name = "Rex", age = 3 };',
        'const pet = { name: "Rex", age: 3 };',
        'const pet = [name: "Rex", age: 3];',
        'const pet = { "Rex", 3 };',
      ],
      answerIndex: 1,
      explanation:
        "Objects use curly braces, a colon between each key and value, and commas between properties.",
    },
    {
      question: "Which of these is a better fit for an object than an array?",
      options: [
        "A shopping list, in order",
        "100 test scores",
        "One book: its title, author and year",
        "The days of the week",
      ],
      answerIndex: 2,
      explanation:
        "A book is one thing with several named parts. The others are lists of similar items, which suit arrays.",
    },
    {
      question: (
        <>
          What does <code>{"const settings = {};"}</code> create?
        </>
      ),
      options: [
        "An error, because objects need properties",
        "An empty object you can add to later",
        "An empty array",
        "undefined",
      ],
      answerIndex: 1,
      explanation: (
        <>
          <code>{"{}"}</code> is a perfectly valid object with no properties
          yet.
        </>
      ),
    },
  ],
  exercise: {
    task: (
      <>
        Create an object called <code>book</code> with three properties:{" "}
        <code>title</code> (a string), <code>author</code> (a string) and{" "}
        <code>pages</code> (a number).
      </>
    ),
    starter: `// Create your book object below\n\n\nconsole.log(book);`,
    extract: extractVariables(["book"]),
    tests: (values) => {
      const book = values.book;
      const isObject = isPlainObject(book);
      return [
        check(!isMissing(book), "A variable named book exists"),
        check(isObject, "book is an object (uses { })"),
        check(isObject && typeof book.title === "string" && book.title !== "", "book.title is a string"),
        check(isObject && typeof book.author === "string" && book.author !== "", "book.author is a string"),
        check(isObject && typeof book.pages === "number", "book.pages is a number (no quotes)"),
      ];
    },
    hint: (
      <>
        Start with <code>{"const book = {"}</code>, then one{" "}
        <code>key: value,</code> per line, and close with <code>{"};"}</code>
      </>
    ),
    solution: `const book = {\n  title: "The Hobbit",\n  author: "J. R. R. Tolkien",\n  pages: 310,\n};\n\nconsole.log(book);`,
  },
};

const propertiesAndValues: Stage = {
  id: "props",
  level: "basic",
  title: "Properties and values",
  short: "Properties & values",
  lead: (
    <>
      A property is a <b>key</b> (its name) paired with a <b>value</b>. Keys
      are names; values can be anything: text, numbers, true/false, arrays,
      even other objects.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🫙">
        A spice rack of <b>labelled jars</b>. The label is the key, what&apos;s
        inside is the value. Every jar needs a different label, otherwise you
        can&apos;t tell them apart.
      </Analogy>
      <p>One object can hold every kind of value:</p>
      <CodeBlock
        code={`const user = {
  username: "ada99",           // string
  age: 36,                     // number
  isAdmin: false,              // boolean
  hobbies: ["chess", "rowing"],// array
  nickname: null,              // "deliberately empty"
  "favourite colour": "teal",  // a key with a space needs quotes
};`}
      />
      <p>
        <b>Keys are names.</b> If a key is a simple name (letters, digits,{" "}
        <code>_</code> or <code>$</code>, not starting with a digit), you can
        write it without quotes. Anything else, like a space or a dash, needs
        quotes: <code>&quot;favourite colour&quot;</code>,{" "}
        <code>&quot;first-name&quot;</code>.
      </p>
      <p>
        <b>Keys are unique.</b> If you write the same key twice, the second one
        quietly replaces the first:
      </p>
      <CodeBlock
        code={`const settings = { volume: 3, volume: 8 };
console.log(settings.volume);   // 8, the first one is gone`}
      />
      <Tip>
        💡 Keys are always stored as strings. Even{" "}
        <code>{'{ 1: "one" }'}</code> has the key <code>&quot;1&quot;</code>.
        Values keep their own type, so <code>age: 36</code> stays a number while{" "}
        <code>age: &quot;36&quot;</code> would be text.
      </Tip>
    </>
  ),
  widget: { title: "What type is each value?", Component: PropertyTypesWidget },
  quiz: [
    {
      question: (
        <>
          In <code>{"{ score: 10 }"}</code>, what is <code>score</code>?
        </>
      ),
      options: ["The value", "The key (the property's name)", "The object's type", "An index"],
      answerIndex: 1,
      explanation: "The key is the name on the left of the colon; 10 is the value.",
    },
    {
      question: "Which key needs quotes?",
      options: ["age", "firstName", "first name", "_id"],
      answerIndex: 2,
      explanation: "It contains a space, so it isn't a simple name. The others are all valid names.",
    },
    {
      question: (
        <>
          <code>{"const box = { size: 1, size: 2 };"}</code> What is{" "}
          <code>box.size</code>?
        </>
      ),
      options: ["1", "2", "[1, 2]", "An error"],
      answerIndex: 1,
      explanation: "Keys must be unique, so the later property overwrites the earlier one.",
    },
  ],
  exercise: {
    task: (
      <>
        Create an object called <code>movie</code> with these properties:
        <ol>
          <li>
            <code>title</code>: a string
          </li>
          <li>
            <code>year</code>: a number
          </li>
          <li>
            <code>isClassic</code>: a boolean
          </li>
          <li>
            <code>genres</code>: an array of at least two strings
          </li>
          <li>
            <code>&quot;running time&quot;</code> (with the space): a number of
            minutes
          </li>
        </ol>
      </>
    ),
    starter: `const movie = {\n  // add the five properties here\n};\n\nconsole.log(movie);`,
    extract: extractVariables(["movie"]),
    tests: (values) => {
      const movie = values.movie;
      const isObject = isPlainObject(movie);
      const genres = isObject ? movie.genres : undefined;
      const genresOk =
        Array.isArray(genres) &&
        genres.length >= 2 &&
        genres.every((genre) => typeof genre === "string");
      return [
        check(isObject, "movie is an object"),
        check(isObject && typeof movie.title === "string", "title is a string"),
        check(isObject && typeof movie.year === "number", "year is a number"),
        check(isObject && typeof movie.isClassic === "boolean", "isClassic is true or false (no quotes)"),
        check(genresOk, "genres is an array of at least two strings"),
        check(isObject && typeof movie["running time"] === "number", '"running time" is a number'),
      ];
    },
    hint: (
      <>
        The last key has a space, so write it in quotes:{" "}
        <code>&quot;running time&quot;: 96,</code>. Booleans are{" "}
        <code>true</code>/<code>false</code> without quotes.
      </>
    ),
    solution: `const movie = {\n  title: "Spirited Away",\n  year: 2001,\n  isClassic: true,\n  genres: ["animation", "fantasy"],\n  "running time": 125,\n};\n\nconsole.log(movie);`,
  },
};

const dotAndBracket: Stage = {
  id: "access",
  level: "basic",
  title: "Reading properties: dot and bracket notation",
  short: "Dot & bracket",
  lead: (
    <>
      Read a property with a <b>dot</b> (<code>pet.name</code>) when you know
      the key as you write the code, or with <b>brackets</b> (
      <code>pet[key]</code>) when the key is stored in a variable or isn&apos;t
      a simple name.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🗄️">
        A filing cabinet with labelled drawers. The <b>dot</b> is walking
        straight to the drawer marked &quot;name&quot;. <b>Brackets</b> are being
        handed a sticky note and opening whichever drawer it names.
      </Analogy>
      <CodeBlock
        code={`const pet = { name: "Rex", age: 3, "best friend": "Tom" };

pet.name             // "Rex"
pet["name"]          // "Rex"   ← same thing, key written as a string
pet["best friend"]   // "Tom"   ← dots can't cope with the space

const key = "age";
pet[key]             // 3       ← uses the VALUE of key, which is "age"
pet.key              // undefined ← looks for a property literally named "key"

pet.colour           // undefined ← missing properties don't crash`}
      />
      <p>
        <b>When to use which?</b> Dots are shorter and easier to read, so
        they&apos;re the default. Reach for brackets when:
      </p>
      <ul className="my-3 list-disc pl-10">
        <li>the key is in a variable (for example, chosen by the user), or</li>
        <li>the key has spaces, dashes or starts with a digit.</li>
      </ul>
      <Tip>
        💡 The classic mix-up: <code>pet.key</code> vs <code>pet[key]</code>.
        A dot always means &quot;the property with exactly this name&quot;.
        And <code>pet[age]</code> without quotes is an error too: JavaScript
        looks for a <i>variable</i> called <code>age</code>.
      </Tip>
    </>
  ),
  widget: { title: "Dot or brackets?", Component: DotAndBracketWidget },
  quiz: [
    {
      question: (
        <>
          <code>const k = &quot;name&quot;;</code> Which reads the pet&apos;s
          name?
        </>
      ),
      options: ["pet.k", "pet[k]", 'pet["k"]', "pet(k)"],
      answerIndex: 1,
      explanation: (
        <>
          Brackets use the value inside <code>k</code>, which is &quot;name&quot;.
          The other two look for a key literally called &quot;k&quot;.
        </>
      ),
    },
    {
      question: (
        <>
          <code>pet.colour</code> when <code>pet</code> has no colour property
          gives…
        </>
      ),
      options: ["An error that stops the program", "null", "undefined", '""'],
      answerIndex: 2,
      explanation: "Reading a property that doesn't exist gives undefined, just like reading past the end of an array.",
    },
    {
      question: (
        <>
          Why does <code>pet[&quot;best friend&quot;]</code> need brackets?
        </>
      ),
      options: [
        "Brackets are faster",
        "The key has a space, so it isn't a valid name after a dot",
        "String values always need brackets",
        "It doesn't; pet.best friend works too",
      ],
      answerIndex: 1,
      explanation: "After a dot, JavaScript expects a simple name. Any other key goes in brackets as a string.",
    },
  ],
  exercise: {
    task: (
      <>
        Read from <code>prices</code> without typing any numbers yourself:
        <ol>
          <li>
            <code>applePrice</code>: the apple price, using a <b>dot</b>
          </li>
          <li>
            <code>wantedPrice</code>: the price of whatever <code>wanted</code>{" "}
            holds, using <b>brackets with the variable</b>
          </li>
          <li>
            <code>dragonPrice</code>: the price of{" "}
            <code>&quot;dragon fruit&quot;</code>
          </li>
        </ol>
      </>
    ),
    starter: `const prices = { apple: 0.5, banana: 0.25, "dragon fruit": 3 };\nconst wanted = "banana";\n\nconst applePrice = \nconst wantedPrice = \nconst dragonPrice = \n\nconsole.log(applePrice, wantedPrice, dragonPrice);`,
    extract: extractVariables(["applePrice", "wantedPrice", "dragonPrice"]),
    tests: (values, code) => [
      check(values.applePrice === 0.5, "applePrice is 0.5"),
      check(values.wantedPrice === 0.25, "wantedPrice is 0.25"),
      check(values.dragonPrice === 3, "dragonPrice is 3"),
      check(/prices\s*\.\s*apple\b/.test(code), "used a dot for the apple"),
      check(/prices\s*\[\s*wanted\s*\]/.test(code), "used prices[wanted] for the wanted fruit"),
      check(/prices\s*\[\s*["']dragon fruit["']\s*\]/.test(code), 'used prices["dragon fruit"]'),
    ],
    hint: (
      <>
        <code>prices.apple</code>, then <code>prices[wanted]</code> (no quotes:
        it&apos;s a variable), then <code>prices[&quot;dragon fruit&quot;]</code>{" "}
        (quotes: it&apos;s the key itself).
      </>
    ),
    solution: `const prices = { apple: 0.5, banana: 0.25, "dragon fruit": 3 };\nconst wanted = "banana";\n\nconst applePrice = prices.apple;\nconst wantedPrice = prices[wanted];\nconst dragonPrice = prices["dragon fruit"];\n\nconsole.log(applePrice, wantedPrice, dragonPrice);`,
  },
};

const changingObjects: Stage = {
  id: "change",
  level: "basic",
  title: "Adding, changing and deleting properties",
  short: "Add, change, delete",
  lead: (
    <>
      Objects can grow and change after you create them. Assign to a{" "}
      <b>new</b> key to add it, to an <b>existing</b> key to change it, and
      use <code>delete</code> to remove one.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📝">
        A <b>form on a whiteboard</b>. Writing next to a label that&apos;s
        already there replaces the answer. Writing a new label adds a line.
        Wiping a line removes label and answer together.
      </Analogy>
      <CodeBlock
        code={`const player = { name: "Kai", score: 0 };

player.score = 10;         // change: the key already exists
player.level = 1;          // add: the key is new
player["lives left"] = 3;  // add, using brackets
delete player.level;       // remove the key AND its value

console.log(player);
// { name: "Kai", score: 10, "lives left": 3 }`}
      />
      <p>
        Adding and changing use the exact same syntax. JavaScript simply checks
        whether the key exists yet.
      </p>
      <p>
        <b>But it&apos;s a const!</b> <code>const</code> stops you pointing the
        variable at a different object. It doesn&apos;t freeze what&apos;s
        inside:
      </p>
      <CodeBlock
        code={`const player = { score: 0 };
player.score = 5;     // ✓ fine: same object, new contents
player = {};          // ❌ TypeError: Assignment to constant variable.`}
      />
      <Tip>
        ⚠️ Typos don&apos;t cause errors; they create new properties.{" "}
        <code>player.scroe = 20</code> silently adds a key called{" "}
        <code>scroe</code> and leaves <code>score</code> unchanged. If a value
        &quot;won&apos;t update&quot;, check the spelling first.
      </Tip>
    </>
  ),
  widget: { title: "Property playground", Component: ChangePropertiesWidget },
  quiz: [
    {
      question: (
        <>
          <code>{"const p = { score: 1 }; p.score = 5;"}</code> What happens?
        </>
      ),
      options: [
        "An error, because p is a const",
        "p.score is now 5",
        "p now has two score properties",
        "p.score is still 1",
      ],
      answerIndex: 1,
      explanation: "const only stops reassigning p itself. Changing a property inside the object is allowed.",
    },
    {
      question: (
        <>
          What does <code>delete p.score</code> do?
        </>
      ),
      options: [
        "Sets p.score to undefined but keeps the key",
        "Sets p.score to 0",
        "Removes the score property completely",
        "Deletes the whole object",
      ],
      answerIndex: 2,
      explanation: "delete removes both the key and its value from the object.",
    },
    {
      question: (
        <>
          You meant to update <code>score</code> but typed{" "}
          <code>p.scroe = 9</code>. What happens?
        </>
      ),
      options: [
        "JavaScript throws an error",
        "score becomes 9",
        "A new property called scroe is added",
        "Nothing at all",
      ],
      answerIndex: 2,
      explanation: "Assigning to a key that doesn't exist adds it, typos included. No warning appears.",
    },
  ],
  exercise: {
    task: (
      <>
        Update <code>profile</code> by changing its properties (don&apos;t
        rewrite the object):
        <ol>
          <li>
            change <code>age</code> to <code>30</code>
          </li>
          <li>
            add <code>email</code> with the value{" "}
            <code>&quot;sam@example.com&quot;</code>
          </li>
          <li>
            remove <code>tempCode</code> completely
          </li>
        </ol>
      </>
    ),
    starter: `const profile = { name: "Sam", age: 29, city: "Leeds", tempCode: "x91" };\n\n// your three changes here\n\n\nconsole.log(profile);`,
    extract: `(() => ({
      profile: typeof profile !== "undefined" ? profile : "__missing__",
      hasTempCode: typeof profile !== "undefined" && Object.hasOwn(profile, "tempCode"),
    }))()`,
    tests: (values, code) => {
      const profile = values.profile;
      const isObject = isPlainObject(profile);
      return [
        check(isObject && profile.age === 30, "age is 30"),
        check(isObject && profile.email === "sam@example.com", 'email is "sam@example.com"'),
        check(values.hasTempCode === false, "tempCode is gone (the key itself, not just its value)"),
        check(isObject && profile.name === "Sam" && profile.city === "Leeds", "name and city are unchanged"),
        check(/delete\s+profile/.test(code), "you used delete"),
      ];
    },
    hint: (
      <>
        Three lines: <code>profile.age = 30;</code>, then{" "}
        <code>profile.email = &quot;…&quot;;</code>, then{" "}
        <code>delete profile.tempCode;</code>
      </>
    ),
    solution: `const profile = { name: "Sam", age: 29, city: "Leeds", tempCode: "x91" };\n\nprofile.age = 30;\nprofile.email = "sam@example.com";\ndelete profile.tempCode;\n\nconsole.log(profile);`,
  },
};

const nestedObjects: Stage = {
  id: "nested",
  level: "basic",
  title: "Nested objects",
  short: "Nested objects",
  lead: (
    <>
      A property&apos;s value can be another object. That lets you group
      related details inside a bigger object, and you reach them by{" "}
      <b>chaining dots</b>, one per level.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📁">
        <b>Folders inside folders.</b> To reach a file you name every folder on
        the way: Documents → Taxes → 2024 → receipt. A path like{" "}
        <code>user.address.city</code> works the same way.
      </Analogy>
      <CodeBlock
        code={`const user = {
  name: "Lina",
  address: {
    city: "Lisbon",
    postcode: "1100-148",
  },
  settings: {
    theme: { mode: "dark", accent: "teal" },
  },
};

user.address.city            // "Lisbon"
user.settings.theme.mode     // "dark"
user["address"]["postcode"]  // "1100-148" (brackets chain too)

user.address.city = "Porto"; // change something deep inside
user.settings.language = "pt"; // add to an inner object`}
      />
      <p>
        Read a path <b>left to right</b>: <code>user</code>, then its{" "}
        <code>settings</code>, then that object&apos;s <code>theme</code>, then
        its <code>mode</code>. Each step works on whatever the previous step
        gave back.
      </p>
      <Tip>
        ⚠️ If a level in the middle is missing, the next dot crashes:{" "}
        <code>user.phone.number</code> throws{" "}
        <i>TypeError: Cannot read properties of undefined</i>, because{" "}
        <code>user.phone</code> is <code>undefined</code> and{" "}
        <code>undefined</code> has no properties. You&apos;ll learn a safe way
        to do this (optional chaining) in the intermediate section.
      </Tip>
    </>
  ),
  widget: { title: "Path explorer", Component: NestedTreeWidget },
  quiz: [
    {
      question: (
        <>
          Using the <code>user</code> above, what is{" "}
          <code>user.settings.theme.accent</code>?
        </>
      ),
      options: ['"dark"', '"teal"', "undefined", "An error"],
      answerIndex: 1,
      explanation: "settings → theme → accent, one level per dot.",
    },
    {
      question: (
        <>
          <code>user</code> has no <code>phone</code> property. What does{" "}
          <code>user.phone.number</code> do?
        </>
      ),
      options: [
        "Gives undefined",
        "Throws a TypeError",
        "Gives null",
        'Gives ""',
      ],
      answerIndex: 1,
      explanation: "user.phone is undefined, and reading .number from undefined throws a TypeError.",
    },
    {
      question: "How do you add a floor number to the user's address?",
      options: [
        "user.floor = 2;",
        "user.address.floor = 2;",
        "user[address][floor] = 2;",
        "address.floor = 2;",
      ],
      answerIndex: 1,
      explanation: "Walk the path to the inner object, then assign the new key there.",
    },
  ],
  exercise: {
    task: (
      <>
        Work with the nested <code>company</code> object:
        <ol>
          <li>
            store the CEO&apos;s email in <code>ceoEmail</code> (read it, don&apos;t
            type it)
          </li>
          <li>
            change the office city to <code>&quot;Bath&quot;</code>
          </li>
          <li>
            add a <code>floor</code> property with the value <code>3</code> to
            the office
          </li>
        </ol>
      </>
    ),
    starter: `const company = {\n  name: "Brightside",\n  ceo: {\n    name: "Rosa",\n    contact: { email: "rosa@brightside.io" },\n  },\n  office: { city: "Bristol" },\n};\n\nconst ceoEmail = \n\n\nconsole.log(ceoEmail, company.office);`,
    extract: extractVariables(["ceoEmail", "company"]),
    tests: (values, code) => {
      const company = values.company;
      const office = isPlainObject(company) ? company.office : undefined;
      return [
        check(values.ceoEmail === "rosa@brightside.io", "ceoEmail is rosa@brightside.io"),
        check(/company\s*\.\s*ceo\s*\.\s*contact\s*\.\s*email/.test(code), "you read it with company.ceo.contact.email"),
        check(isPlainObject(office) && office.city === "Bath", 'the office city is "Bath"'),
        check(isPlainObject(office) && office.floor === 3, "the office has floor: 3"),
      ];
    },
    hint: (
      <>
        Chain one dot per level: <code>company.ceo.contact.email</code>. For
        the office, assign to <code>company.office.city</code> and{" "}
        <code>company.office.floor</code>.
      </>
    ),
    solution: `const company = {\n  name: "Brightside",\n  ceo: {\n    name: "Rosa",\n    contact: { email: "rosa@brightside.io" },\n  },\n  office: { city: "Bristol" },\n};\n\nconst ceoEmail = company.ceo.contact.email;\ncompany.office.city = "Bath";\ncompany.office.floor = 3;\n\nconsole.log(ceoEmail, company.office);`,
  },
};

const objectsAndArrays: Stage = {
  id: "obj-arrays",
  level: "basic",
  title: "Objects and arrays together",
  short: "Objects & arrays",
  lead: (
    <>
      Real data mixes the two: <b>objects that hold arrays</b> (one thing with
      a list inside) and <b>arrays of objects</b> (many similar records).
    </>
  ),
  lesson: (
    <>
      <Analogy icon="📚">
        A <b>library</b>: the shelf is an array of books, and each book is an
        object with a title, author and year. A single book might also hold a
        list: its chapters.
      </Analogy>
      <p>An object holding an array:</p>
      <CodeBlock
        code={`const team = {
  name: "Hawks",
  players: ["Ivy", "Leo", "Max"],
};

team.players[0]        // "Ivy"
team.players.length    // 3
team.players.push("Zoe");`}
      />
      <p>An array of objects, the most common shape of data from the web:</p>
      <CodeBlock
        code={`const students = [
  { name: "Ivy", grade: 91 },
  { name: "Leo", grade: 78 },
];

students[1].name       // "Leo"
students[0].grade = 95;

for (const student of students) {
  console.log(student.name + ": " + student.grade);
}`}
      />
      <p>
        The reading rule never changes: <code>[number]</code> picks an item
        from a list, <code>.name</code> picks a labelled field. Read the path
        left to right and ask &quot;what do I have now?&quot; at each step.
      </p>
      <Tip>
        ⚠️ <code>students.name</code> is <code>undefined</code>: the array
        itself has no name. Pick an item first (<code>students[0].name</code>)
        or loop through them.
      </Tip>
    </>
  ),
  widget: { title: "Mixed data explorer", Component: SchoolTreeWidget },
  quiz: [
    {
      question: (
        <>
          With <code>students</code> above, what is{" "}
          <code>students[1].grade</code>?
        </>
      ),
      options: ["91", "78", '"Leo"', "undefined"],
      answerIndex: 1,
      explanation: "Index 1 is the second student, Leo, and his grade is 78.",
    },
    {
      question: (
        <>
          After <code>team.players.push(&quot;Zoe&quot;)</code>, what is{" "}
          <code>team.players.length</code>?
        </>
      ),
      options: ["3", "4", "5", "undefined"],
      answerIndex: 1,
      explanation: "team.players is an ordinary array, so push adds a fourth item.",
    },
    {
      question: (
        <>
          What does <code>students.name</code> give?
        </>
      ),
      options: ['"Ivy"', '["Ivy", "Leo"]', "undefined", "An error"],
      answerIndex: 2,
      explanation: "The array has no name property. You need an item first, like students[0].name.",
    },
  ],
  exercise: {
    task: (
      <>
        Using <code>orders</code>:
        <ol>
          <li>
            store the second order&apos;s item in <code>secondItem</code>
          </li>
          <li>
            add a new order <code>{'{ id: 4, item: "Scone", qty: 2 }'}</code> to
            the end
          </li>
          <li>
            <b>after</b> adding it, use a loop to add up every{" "}
            <code>qty</code> into <code>totalQty</code>
          </li>
        </ol>
      </>
    ),
    starter: `const orders = [\n  { id: 1, item: "Tea", qty: 2 },\n  { id: 2, item: "Cake", qty: 1 },\n  { id: 3, item: "Coffee", qty: 3 },\n];\n\nconst secondItem = \n\n// add the new order\n\nlet totalQty = 0;\n// loop and add up qty\n\n\nconsole.log(secondItem, totalQty);`,
    extract: extractVariables(["secondItem", "totalQty", "orders"]),
    tests: (values, code) => {
      const orders = values.orders;
      const lastOrder = Array.isArray(orders) ? orders[orders.length - 1] : undefined;
      return [
        check(values.secondItem === "Cake", 'secondItem is "Cake"'),
        check(Array.isArray(orders) && orders.length === 4, "orders now has 4 orders"),
        check(
          isSameValue(lastOrder, { id: 4, item: "Scone", qty: 2 }),
          'the last order is { id: 4, item: "Scone", qty: 2 }'
        ),
        check(values.totalQty === 8, "totalQty is 8 (2 + 1 + 3 + 2)"),
        check(/for\s*\(/.test(code), "you used a loop"),
      ];
    },
    hint: (
      <>
        <code>orders[1].item</code> for the second item, then{" "}
        <code>orders.push({"{ … }"})</code>. In the loop:{" "}
        <code>{"for (const order of orders) { totalQty = totalQty + order.qty; }"}</code>
      </>
    ),
    solution: `const orders = [\n  { id: 1, item: "Tea", qty: 2 },\n  { id: 2, item: "Cake", qty: 1 },\n  { id: 3, item: "Coffee", qty: 3 },\n];\n\nconst secondItem = orders[1].item;\n\norders.push({ id: 4, item: "Scone", qty: 2 });\n\nlet totalQty = 0;\nfor (const order of orders) {\n  totalQty = totalQty + order.qty;\n}\n\nconsole.log(secondItem, totalQty);`,
  },
};

const loopingObjects: Stage = {
  id: "loop",
  level: "basic",
  title: "Looping through an object",
  short: "Looping objects",
  lead: (
    <>
      To visit every property, use <code>for...in</code>. It hands you each{" "}
      <b>key</b> in turn, and you use brackets to fetch that key&apos;s value.
    </>
  ),
  lesson: (
    <>
      <Analogy icon="🚪">
        Walking down a corridor of labelled doors. At each door you read the
        label (the key), and if you want what&apos;s inside, you open that door
        (<code>stock[fruit]</code>).
      </Analogy>
      <CodeBlock
        code={`const stock = { apples: 12, pears: 0, plums: 7 };

for (const fruit in stock) {
  console.log(fruit + ": " + stock[fruit]);
}
// apples: 12
// pears: 0
// plums: 7`}
      />
      <p>
        On each lap, <code>fruit</code> holds one key as a string (
        <code>&quot;apples&quot;</code>, then <code>&quot;pears&quot;</code>, …). The key
        is in a variable, which is exactly when you need brackets:{" "}
        <code>stock[fruit]</code>.
      </p>
      <p>
        All the array patterns you know still apply. A running total, a count,
        or collecting matches:
      </p>
      <CodeBlock
        code={`let total = 0;
for (const fruit in stock) {
  total = total + stock[fruit];
}
// total is 19`}
      />
      <Tip>
        💡 <b>in</b> vs <b>of</b>: <code>for...in</code> walks the <b>keys</b>{" "}
        of an object. <code>for...of</code> walks the <b>values</b> of an
        array. Using <code>for...of</code> on a plain object throws{" "}
        <i>TypeError: stock is not iterable</i>. (Avoid <code>for...in</code>{" "}
        on arrays: it gives you the indexes as strings.)
      </Tip>
    </>
  ),
  widget: { title: "Loop it yourself", Component: LoopObjectWidget },
  quiz: [
    {
      question: (
        <>
          In <code>{"for (const k in scores) { … }"}</code>, what is{" "}
          <code>k</code> on each lap?
        </>
      ),
      options: ["Each value", "Each key, as a string", "Each index number", "The whole object"],
      answerIndex: 1,
      explanation: "for...in gives you the keys. You use them to look up the values.",
    },
    {
      question: "Inside that loop, how do you get the current value?",
      options: ["scores.k", "scores[k]", "k.value", "scores(k)"],
      answerIndex: 1,
      explanation: "The key is in a variable, so you need brackets. scores.k would look for a key named \"k\".",
    },
    {
      question: (
        <>
          What happens with <code>for (const x of stock)</code> when{" "}
          <code>stock</code> is a plain object?
        </>
      ),
      options: [
        "It loops over the values",
        "It loops over the keys",
        "TypeError: stock is not iterable",
        "It runs zero times",
      ],
      answerIndex: 2,
      explanation: "for...of needs something iterable, like an array. Plain objects aren't, so use for...in.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>countPassed(scores)</code>. <code>scores</code> is an object
        like <code>{"{ ana: 72, ben: 45 }"}</code>. Return how many people
        scored <b>50 or more</b>. Use a <code>for...in</code> loop.
      </>
    ),
    starter: `function countPassed(scores) {\n  let passed = 0;\n\n  // loop over the keys and count scores of 50 or more\n\n  return passed;\n}\n\nconsole.log(countPassed({ ana: 72, ben: 45, cy: 50, dee: 91 }));`,
    extract: `({
      a: countPassed({ ana: 72, ben: 45, cy: 50, dee: 91 }),
      b: countPassed({ solo: 10 }),
      c: countPassed({}),
      d: countPassed({ x: 100, y: 99 }),
    })`,
    tests: (values, code) => [
      check(values.a === 3, "{ ana: 72, ben: 45, cy: 50, dee: 91 } → 3 (50 counts)"),
      check(values.b === 0, "{ solo: 10 } → 0"),
      check(values.c === 0, "{} → 0"),
      check(values.d === 2, "{ x: 100, y: 99 } → 2"),
      check(/for\s*\(\s*(const|let)\s+\w+\s+in\s+scores\s*\)/.test(code), "you used for (… in scores)"),
    ],
    hint: (
      <>
        <code>{"for (const name in scores) { if (scores[name] >= 50) { passed++; } }"}</code>
      </>
    ),
    solution: `function countPassed(scores) {\n  let passed = 0;\n\n  for (const name in scores) {\n    if (scores[name] >= 50) {\n      passed++;\n    }\n  }\n\n  return passed;\n}\n\nconsole.log(countPassed({ ana: 72, ben: 45, cy: 50, dee: 91 }));`,
  },
};

type ReceiptLine = { name: unknown; qty: unknown; cost: unknown };

/** Keeps just the three expected fields, so key order inside each line doesn't matter. */
function cleanReceipt(receipt: unknown) {
  if (!isPlainObject(receipt) || !Array.isArray(receipt.items)) {
    return receipt;
  }
  const items: ReceiptLine[] = [];
  for (const item of receipt.items) {
    if (isPlainObject(item)) {
      items.push({ name: item.name, qty: item.qty, cost: item.cost });
    } else {
      items.push({ name: item, qty: undefined, cost: undefined });
    }
  }
  return { items, total: receipt.total, missing: receipt.missing };
}

const beginnerFinal: Stage = {
  id: "final",
  level: "basic",
  title: "Beginner final: the shopping receipt",
  short: "Final challenge",
  lead: (
    <>
      Time to combine everything: looping over an object, reading values with
      brackets, building new objects and filling an array with them.
    </>
  ),
  lesson: (
    <>
      <p>
        A shop keeps its prices in an object, and each basket is an object of{" "}
        <b>item → quantity</b>. Prices are in <b>pence</b> (whole numbers), so
        there are no decimal surprises.
      </p>
      <CodeBlock
        code={`const prices = { apple: 50, bread: 120, milk: 90 };
const basket = { apple: 3, bread: 1, cheese: 2 };

makeReceipt(basket, prices);
// {
//   items: [
//     { name: "apple", qty: 3, cost: 150 },
//     { name: "bread", qty: 1, cost: 120 },
//   ],
//   total: 270,
//   missing: ["cheese"],   // not in prices, so not charged
// }`}
      />
      <p>A good plan:</p>
      <ol className="my-4 list-decimal pl-10">
        <li>
          Start with an empty <code>items</code> array, a <code>total</code>{" "}
          of 0 and an empty <code>missing</code> array.
        </li>
        <li>
          <b>Loop</b> over the basket with <code>for...in</code>.
        </li>
        <li>
          Look up the price with <b>brackets</b>:{" "}
          <code>prices[name]</code>. If it&apos;s <code>undefined</code>, push
          the name into <code>missing</code> and move on.
        </li>
        <li>
          Otherwise work out the cost, push a new{" "}
          <code>{"{ name, qty, cost }"}</code> object and add the cost to the
          total.
        </li>
        <li>Return one object holding all three.</li>
      </ol>
      <PanelHeading className="mt-[22px]">Beginner cheat sheet</PanelHeading>
      <CheatSheet>
        <Cheat code='{ key: "value" }'>make an object</Cheat>
        <Cheat code="obj.key">read with a dot</Cheat>
        <Cheat code="obj[variable]">read with a key stored in a variable</Cheat>
        <Cheat code="obj.key = value">add or change a property</Cheat>
        <Cheat code="delete obj.key">remove a property</Cheat>
        <Cheat code="a.b.c">walk into nested objects</Cheat>
        <Cheat code="list[0].name">pick an item, then a field</Cheat>
        <Cheat code="for (const k in obj)">loop over the keys</Cheat>
      </CheatSheet>
    </>
  ),
  quiz: [
    {
      question: (
        <>
          Inside <code>{"for (const name in basket)"}</code>, how do you get that
          item&apos;s price?
        </>
      ),
      options: ["prices.name", "prices[name]", "basket[name].price", "name.price"],
      answerIndex: 1,
      explanation: "The key is in the variable name, so you need brackets on the prices object.",
    },
    {
      question: (
        <>
          <code>prices[&quot;cheese&quot;]</code> when cheese isn&apos;t in{" "}
          <code>prices</code> gives…
        </>
      ),
      options: ["0", "null", "undefined", "An error"],
      answerIndex: 2,
      explanation: "Missing properties are undefined, which makes them easy to check with === undefined.",
    },
    {
      question: "Which line adds one line to the receipt?",
      options: [
        "items = { name, qty, cost };",
        "items.push({ name: name, qty: qty, cost: cost });",
        "items.name = name;",
        "items[name] = cost;",
      ],
      answerIndex: 1,
      explanation: "items is an array of objects, so you push a new object onto it.",
    },
  ],
  exercise: {
    task: (
      <>
        Write <code>makeReceipt(basket, prices)</code> returning{" "}
        <code>{"{ items, total, missing }"}</code>:
        <ol>
          <li>
            <code>items</code>: one <code>{"{ name, qty, cost }"}</code> object
            per priced item, in basket order (<code>cost</code> = qty × price)
          </li>
          <li>
            <code>total</code>: the sum of every cost
          </li>
          <li>
            <code>missing</code>: names of basket items with no price (they
            aren&apos;t charged)
          </li>
          <li>
            Don&apos;t change <code>basket</code> or <code>prices</code>.
          </li>
        </ol>
      </>
    ),
    starter: `function makeReceipt(basket, prices) {\n  const items = [];\n  let total = 0;\n  const missing = [];\n\n  // 1. loop over the basket\n  // 2. look up the price; no price → add to missing\n  // 3. otherwise push { name, qty, cost } and add to total\n\n  return { items: items, total: total, missing: missing };\n}\n\nconst prices = { apple: 50, bread: 120, milk: 90 };\nconsole.log(makeReceipt({ apple: 3, bread: 1, cheese: 2 }, prices));`,
    extract: `(() => {
      const prices = { apple: 50, bread: 120, milk: 90, jam: 200 };
      const basket = { apple: 3, bread: 1, cheese: 2 };
      const basketBefore = JSON.stringify(basket);
      const pricesBefore = JSON.stringify(prices);
      return {
        a: makeReceipt(basket, prices),
        b: makeReceipt({ milk: 2, jam: 1 }, prices),
        c: makeReceipt({}, prices),
        d: makeReceipt({ caviar: 1, truffle: 2 }, prices),
        untouched: JSON.stringify(basket) === basketBefore && JSON.stringify(prices) === pricesBefore,
      };
    })()`,
    tests: (values) => [
      check(
        isSameValue(cleanReceipt(values.a), {
          items: [
            { name: "apple", qty: 3, cost: 150 },
            { name: "bread", qty: 1, cost: 120 },
          ],
          total: 270,
          missing: ["cheese"],
        }),
        "the example basket → 2 items, total 270, missing [\"cheese\"]"
      ),
      check(
        isSameValue(cleanReceipt(values.b), {
          items: [
            { name: "milk", qty: 2, cost: 180 },
            { name: "jam", qty: 1, cost: 200 },
          ],
          total: 380,
          missing: [],
        }),
        "{ milk: 2, jam: 1 } → total 380, nothing missing"
      ),
      check(isSameValue(cleanReceipt(values.c), { items: [], total: 0, missing: [] }), "an empty basket → no items, total 0"),
      check(
        isSameValue(cleanReceipt(values.d), { items: [], total: 0, missing: ["caviar", "truffle"] }),
        "nothing priced → total 0, both names in missing"
      ),
      check(values.untouched === true, "basket and prices were not changed"),
    ],
    hint: (
      <>
        Inside <code>{"for (const name in basket)"}</code>:{" "}
        <code>const price = prices[name];</code> then{" "}
        <code>{"if (price === undefined) { missing.push(name); continue; }"}</code>
        . Otherwise <code>const cost = basket[name] * price;</code>, push{" "}
        <code>{"{ name: name, qty: basket[name], cost: cost }"}</code> and add
        cost to total.
      </>
    ),
    solution: `function makeReceipt(basket, prices) {\n  const items = [];\n  let total = 0;\n  const missing = [];\n\n  for (const name in basket) {\n    const price = prices[name];\n    if (price === undefined) {\n      missing.push(name);\n      continue;\n    }\n\n    const qty = basket[name];\n    const cost = qty * price;\n    items.push({ name: name, qty: qty, cost: cost });\n    total = total + cost;\n  }\n\n  return { items: items, total: total, missing: missing };\n}\n\nconst prices = { apple: 50, bread: 120, milk: 90 };\nconsole.log(makeReceipt({ apple: 3, bread: 1, cheese: 2 }, prices));`,
  },
};

export const OBJECT_BEGINNER_STAGES: Stage[] = [
  whatIsAnObject,
  propertiesAndValues,
  dotAndBracket,
  changingObjects,
  nestedObjects,
  objectsAndArrays,
  loopingObjects,
  beginnerFinal,
];
