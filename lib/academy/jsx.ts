/**
 * A small JSX compiler for the React course's code challenges and playgrounds.
 *
 * It turns JSX into ordinary `React.createElement(...)` calls, the same thing
 * a real build tool does, so the learner's code can run in the plain
 * JavaScript sandbox. It handles the JSX a beginner writes: elements,
 * fragments, attributes, `{expressions}` (including JSX inside them), spread
 * props and text. It does not try to handle TypeScript or regular-expression
 * literals.
 *
 * Errors are reported in plain language with a line number, because a
 * learner's first JSX mistakes are usually an unclosed or mismatched tag.
 */

export class JsxSyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SyntaxError";
  }
}

// After one of these words, a `<` starts JSX rather than meaning "less than".
const KEYWORDS_BEFORE_EXPRESSION = new Set([
  "return",
  "case",
  "default",
  "do",
  "else",
  "in",
  "of",
  "typeof",
  "void",
  "delete",
  "yield",
  "await",
  "new",
  "throw",
]);

// HTML lets these stay unclosed; JSX does not.
const VOID_HTML_TAGS = new Set(["img", "input", "br", "hr", "meta", "link"]);

const HTML_ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
  "&copy;": "©",
  "&pound;": "£",
  "&euro;": "€",
  "&times;": "×",
  "&hellip;": "…",
  "&rarr;": "→",
};

function isIdentifierStart(character: string): boolean {
  return /[A-Za-z_$]/.test(character);
}

function isIdentifierCharacter(character: string): boolean {
  return /[A-Za-z0-9_$]/.test(character);
}

function isWhitespace(character: string): boolean {
  return /\s/.test(character);
}

function decodeEntities(text: string): string {
  let decoded = text;
  for (const entity of Object.keys(HTML_ENTITIES)) {
    decoded = decoded.split(entity).join(HTML_ENTITIES[entity]);
  }
  return decoded;
}

/**
 * JSX text follows the same whitespace rules as React's own compiler:
 * line breaks and the indentation around them disappear, and text on
 * separate lines is joined with a single space.
 */
function cleanJsxText(rawText: string): string {
  const lines = rawText.split(/\r\n|\n|\r/);
  const keptLines: string[] = [];

  for (let index = 0; index < lines.length; index++) {
    let line = lines[index];
    const isFirstLine = index === 0;
    const isLastLine = index === lines.length - 1;

    if (!isFirstLine) {
      line = line.replace(/^\s+/, "");
    }
    if (!isLastLine) {
      line = line.replace(/\s+$/, "");
    }
    if (line !== "") {
      keptLines.push(line);
    }
  }

  return decodeEntities(keptLines.join(" "));
}

/** The kind of the last meaningful thing read, used to tell JSX from "less than". */
type PreviousToken = "value" | "operator";

class JsxCompiler {
  private source: string;
  private position = 0;

  constructor(source: string) {
    this.source = source;
  }

  compileProgram(): string {
    const output = this.compileJavaScript();
    if (this.position < this.source.length) {
      this.fail(`there is an extra "}" that doesn't match any "{".`);
    }
    return output;
  }

  // ---------------------------------------------------------------------------
  // Plain JavaScript
  // ---------------------------------------------------------------------------

  /**
   * Copies JavaScript to the output, compiling any JSX it finds. It stops
   * (without consuming) at a `}` that closes nothing, which is how a JSX
   * `{expression}` ends.
   */
  private compileJavaScript(): string {
    let output = "";
    let braceDepth = 0;
    let previousToken: PreviousToken = "operator";

    while (this.position < this.source.length) {
      const character = this.source[this.position];
      const nextCharacter = this.source[this.position + 1] ?? "";

      if (character === "/" && nextCharacter === "/") {
        output += this.readLineComment();
        continue;
      }
      if (character === "/" && nextCharacter === "*") {
        output += this.readBlockComment();
        continue;
      }
      if (character === '"' || character === "'") {
        output += this.readQuotedString(character);
        previousToken = "value";
        continue;
      }
      if (character === "`") {
        output += this.readTemplateLiteral();
        previousToken = "value";
        continue;
      }

      if (character === "{") {
        braceDepth++;
        output += character;
        this.position++;
        previousToken = "operator";
        continue;
      }
      if (character === "}") {
        // The caller decides whether an unmatched "}" ends an expression
        // or is a mistake (see compileProgram).
        if (braceDepth === 0) {
          return output;
        }
        braceDepth--;
        output += character;
        this.position++;
        previousToken = "operator";
        continue;
      }

      if (character === "<" && previousToken === "operator" && this.looksLikeJsxStart()) {
        output += this.compileElement();
        this.rejectAdjacentElement();
        previousToken = "value";
        continue;
      }

      if (isIdentifierStart(character)) {
        const word = this.readWhile(isIdentifierCharacter);
        output += word;
        previousToken = KEYWORDS_BEFORE_EXPRESSION.has(word) ? "operator" : "value";
        continue;
      }
      if (/[0-9]/.test(character)) {
        output += this.readWhile((c) => /[0-9A-Za-z_.]/.test(c));
        previousToken = "value";
        continue;
      }
      if (isWhitespace(character)) {
        output += character;
        this.position++;
        continue;
      }

      output += character;
      this.position++;
      previousToken = character === ")" || character === "]" ? "value" : "operator";
    }

    return output;
  }

  /** Two JSX elements side by side, e.g. `return (<h1/><p/>)`, is the classic beginner mistake. */
  private rejectAdjacentElement() {
    const positionAfterElement = this.position;
    this.skipWhitespaceAndComments();
    const startsAnotherElement = this.source[this.position] === "<" && this.looksLikeJsxStart();
    if (startsAnotherElement) {
      this.fail(
        "two JSX elements sit side by side, but a component must return one parent element. Wrap them in a <div> or a fragment <>...</>."
      );
    }
    this.position = positionAfterElement;
  }

  private looksLikeJsxStart(): boolean {
    const afterBracket = this.source[this.position + 1] ?? "";
    return afterBracket === ">" || isIdentifierStart(afterBracket);
  }

  private readWhile(test: (character: string) => boolean): string {
    const start = this.position;
    while (this.position < this.source.length && test(this.source[this.position])) {
      this.position++;
    }
    return this.source.slice(start, this.position);
  }

  private readLineComment(): string {
    const start = this.position;
    while (this.position < this.source.length && this.source[this.position] !== "\n") {
      this.position++;
    }
    return this.source.slice(start, this.position);
  }

  private readBlockComment(): string {
    const start = this.position;
    const end = this.source.indexOf("*/", this.position + 2);
    if (end === -1) {
      this.fail("a /* comment is never closed with */.");
    }
    this.position = end + 2;
    return this.source.slice(start, this.position);
  }

  private readQuotedString(quote: string): string {
    const start = this.position;
    const startLine = this.lineNumber();
    this.position++;
    while (this.position < this.source.length) {
      const character = this.source[this.position];
      if (character === "\\") {
        this.position += 2;
        continue;
      }
      if (character === quote) {
        this.position++;
        return this.source.slice(start, this.position);
      }
      if (character === "\n") {
        break;
      }
      this.position++;
    }
    this.fail(`a string starting with ${quote} is never closed.`, startLine);
  }

  /** Template literals may contain `${ ... }`, which is JavaScript again (and may hold JSX). */
  private readTemplateLiteral(): string {
    const startLine = this.lineNumber();
    let output = "`";
    this.position++;

    while (this.position < this.source.length) {
      const character = this.source[this.position];
      if (character === "\\") {
        output += this.source.slice(this.position, this.position + 2);
        this.position += 2;
        continue;
      }
      if (character === "`") {
        output += "`";
        this.position++;
        return output;
      }
      if (character === "$" && this.source[this.position + 1] === "{") {
        this.position += 2;
        output += "${" + this.compileJavaScript();
        this.expect("}", "a ${ inside a template string is never closed.");
        output += "}";
        continue;
      }
      output += character;
      this.position++;
    }
    this.fail("a template string (backticks) is never closed.", startLine);
  }

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------

  /** Compiles one JSX element starting at `<` into a createElement call. */
  private compileElement(): string {
    const startLine = this.lineNumber();
    this.position++; // the "<"

    const isFragment = this.source[this.position] === ">";
    if (isFragment) {
      this.position++;
      const children = this.compileChildren("", startLine);
      return this.buildCall("React.Fragment", "null", children);
    }

    const tagName = this.readWhile((c) => /[A-Za-z0-9_$.\-:]/.test(c));
    const props = this.compileAttributes(tagName);

    if (this.source.startsWith("/>", this.position)) {
      this.position += 2;
      return this.buildCall(this.tagExpression(tagName), props, []);
    }
    this.expect(">", `the <${tagName}> tag is missing its closing ">".`);

    if (VOID_HTML_TAGS.has(tagName)) {
      this.fail(
        `<${tagName}> must be closed in JSX. Write it as a self-closing tag: <${tagName} ... />.`,
        startLine
      );
    }

    const children = this.compileChildren(tagName, startLine);
    return this.buildCall(this.tagExpression(tagName), props, children);
  }

  /** Lowercase names are HTML tags (strings); capitalised names are components (variables). */
  private tagExpression(tagName: string): string {
    const isHtmlTag = /^[a-z]/.test(tagName) && !tagName.includes(".");
    if (isHtmlTag) {
      return JSON.stringify(tagName);
    }
    return tagName;
  }

  private buildCall(tag: string, props: string, children: string[]): string {
    const parts = [tag, props, ...children];
    return "React.createElement(" + parts.join(", ") + ")";
  }

  /** Reads attributes up to `>` or `/>` and returns them as an object literal (or "null"). */
  private compileAttributes(tagName: string): string {
    const entries: string[] = [];

    while (true) {
      this.skipWhitespaceAndComments();

      if (this.position >= this.source.length) {
        this.fail(`the <${tagName}> tag is never finished. Is a ">" missing?`);
      }

      const character = this.source[this.position];
      if (character === ">" || this.source.startsWith("/>", this.position)) {
        break;
      }

      if (character === "{") {
        this.position++;
        this.skipWhitespaceAndComments();
        if (!this.source.startsWith("...", this.position)) {
          this.fail(`inside <${tagName}>, a { } on its own must be a spread like {...props}.`);
        }
        this.position += 3;
        const spreadExpression = this.compileJavaScript();
        this.expect("}", `a {...} inside <${tagName}> is never closed.`);
        entries.push("...(" + spreadExpression.trim() + ")");
        continue;
      }

      if (!isIdentifierStart(character)) {
        this.fail(`unexpected "${character}" inside the <${tagName}> tag.`);
      }

      const attributeName = this.readWhile((c) => /[A-Za-z0-9_$\-:]/.test(c));
      this.skipWhitespaceAndComments();

      if (this.source[this.position] !== "=") {
        entries.push(JSON.stringify(attributeName) + ": true");
        continue;
      }

      this.position++; // the "="
      this.skipWhitespaceAndComments();
      const valueStart = this.source[this.position];

      if (valueStart === '"' || valueStart === "'") {
        const quoted = this.readJsxAttributeString(valueStart, attributeName);
        entries.push(JSON.stringify(attributeName) + ": " + JSON.stringify(decodeEntities(quoted)));
        continue;
      }

      if (valueStart === "{") {
        this.position++;
        const expression = this.compileJavaScript();
        this.expect("}", `the value of ${attributeName} is missing its closing "}".`);
        if (expression.trim() === "") {
          this.fail(`${attributeName}={} is empty. Put a value inside the braces.`);
        }
        entries.push(JSON.stringify(attributeName) + ": (" + expression.trim() + ")");
        continue;
      }

      this.fail(
        `the value of ${attributeName} must be in quotes ("text") or braces ({expression}).`
      );
    }

    if (entries.length === 0) {
      return "null";
    }
    return "{ " + entries.join(", ") + " }";
  }

  /** JSX attribute strings have no escapes, so this just reads up to the matching quote. */
  private readJsxAttributeString(quote: string, attributeName: string): string {
    const end = this.source.indexOf(quote, this.position + 1);
    if (end === -1) {
      this.fail(`the value of ${attributeName} is missing its closing ${quote}.`);
    }
    const value = this.source.slice(this.position + 1, end);
    this.position = end + 1;
    return value;
  }

  /** Reads children up to the matching closing tag. `tagName` is "" for fragments. */
  private compileChildren(tagName: string, openingLine: number): string[] {
    const children: string[] = [];
    const displayName = tagName === "" ? "<>" : `<${tagName}>`;
    const closingName = tagName === "" ? "</>" : `</${tagName}>`;

    while (true) {
      if (this.position >= this.source.length) {
        this.fail(`${displayName} is never closed. Add ${closingName}.`, openingLine);
      }

      if (this.source.startsWith("</", this.position)) {
        const closingLine = this.lineNumber();
        this.position += 2;
        const foundName = this.readWhile((c) => /[A-Za-z0-9_$.\-:]/.test(c));
        this.skipWhitespaceAndComments();
        this.expect(">", `the closing tag </${foundName}> is missing its ">".`);
        if (foundName !== tagName) {
          const foundDisplay = foundName === "" ? "</>" : `</${foundName}>`;
          this.fail(
            `expected ${closingName} to close ${displayName} from line ${openingLine}, but found ${foundDisplay}.`,
            closingLine
          );
        }
        return children;
      }

      const character = this.source[this.position];

      if (character === "<") {
        children.push(this.compileElement());
        continue;
      }

      if (character === "{") {
        this.position++;
        const expression = this.compileJavaScript();
        this.expect("}", "a { inside JSX is never closed with }.");
        const isOnlyComment = expression.replace(/\/\*[\s\S]*?\*\//g, "").trim() === "";
        if (!isOnlyComment) {
          children.push("(" + expression.trim() + ")");
        }
        continue;
      }

      const rawText = this.readWhile((c) => c !== "<" && c !== "{");
      const text = cleanJsxText(rawText);
      if (text !== "") {
        children.push(JSON.stringify(text));
      }
    }
  }

  private skipWhitespaceAndComments() {
    while (this.position < this.source.length) {
      const character = this.source[this.position];
      if (isWhitespace(character)) {
        this.position++;
        continue;
      }
      if (this.source.startsWith("/*", this.position)) {
        this.readBlockComment();
        continue;
      }
      if (this.source.startsWith("//", this.position)) {
        this.readLineComment();
        continue;
      }
      return;
    }
  }

  private expect(text: string, problem: string) {
    if (!this.source.startsWith(text, this.position)) {
      this.fail(problem);
    }
    this.position += text.length;
  }

  private lineNumber(): number {
    let line = 1;
    for (let index = 0; index < this.position && index < this.source.length; index++) {
      if (this.source[index] === "\n") {
        line++;
      }
    }
    return line;
  }

  private fail(problem: string, line: number = this.lineNumber()): never {
    throw new JsxSyntaxError(`line ${line}: ${problem}`);
  }
}

/** Turns JSX source into plain JavaScript that calls React.createElement. */
export function compileJsx(source: string): string {
  const compiler = new JsxCompiler(source);
  return compiler.compileProgram();
}
