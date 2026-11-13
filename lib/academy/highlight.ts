export type TokenKind = "keyword" | "string" | "number" | "comment" | "plain";

export type Token = {
  kind: TokenKind;
  text: string;
};

// The only keywords the lessons colour.
const KEYWORDS = new Set([
  "const",
  "let",
  "for",
  "of",
  "function",
  "return",
  "true",
  "false",
]);

// One alternative per token kind. Earlier alternatives win at the same position,
// so a comment swallows any strings or numbers written inside it.
const TOKEN_PATTERN = /(\/\/.*)|("[^"\n]*")|\b([A-Za-z_]\w*)\b|\b(\d+(?:\.\d+)?)\b/g;

/**
 * Splits a JavaScript snippet into coloured tokens for the lesson code blocks.
 * It is intentionally tiny: it only needs to handle the snippets in this course.
 */
export function tokenizeJavaScript(code: string): Token[] {
  const tokens: Token[] = [];
  let plainStart = 0;

  function pushPlain(end: number) {
    if (end > plainStart) {
      tokens.push({ kind: "plain", text: code.slice(plainStart, end) });
    }
  }

  for (const match of code.matchAll(TOKEN_PATTERN)) {
    const matchStart = match.index;
    const [fullMatch, comment, string, word, number] = match;

    let kind: TokenKind | null = null;
    if (comment !== undefined) {
      kind = "comment";
    } else if (string !== undefined) {
      kind = "string";
    } else if (number !== undefined) {
      kind = "number";
    } else if (word !== undefined && KEYWORDS.has(word)) {
      kind = "keyword";
    }

    // Ordinary identifiers stay in the surrounding plain text.
    if (kind === null) {
      continue;
    }

    pushPlain(matchStart);
    tokens.push({ kind, text: fullMatch });
    plainStart = matchStart + fullMatch.length;
  }

  pushPlain(code.length);
  return tokens;
}
