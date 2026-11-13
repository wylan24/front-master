/**
 * Formats a value the way the course displays it:
 * strings in double quotes, arrays as `[a, b]`, objects as JSON.
 */
export function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (Array.isArray(value)) {
    const formattedItems: string[] = [];
    for (const item of value) {
      formattedItems.push(formatValue(item));
    }
    return "[" + formattedItems.join(", ") + "]";
  }

  if (value !== null && typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

/** Deep equality by JSON shape, as used by the exercise checks. */
export function isSameValue(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export function isMissing(value: unknown): boolean {
  return value === "__missing__";
}

/**
 * Builds the expression that reads the named variables after the learner's
 * code has run, e.g. `{ colors: (typeof colors !== 'undefined' ? colors : '__missing__') }`.
 */
export function extractVariables(names: string[]): string {
  const parts: string[] = [];
  for (const name of names) {
    parts.push(
      `${name}: (typeof ${name} !== 'undefined' ? ${name} : '__missing__')`
    );
  }
  return "{" + parts.join(", ") + "}";
}

/** Adds a beginner-friendly explanation to common JavaScript errors. */
export function explainError(error: string): string {
  if (/Unexpected end of input/.test(error)) {
    return error + " (you may be missing a closing ] ) or })";
  }
  if (/Unexpected token/.test(error)) {
    return error + " (check for a missing comma, quote, or bracket)";
  }
  if (/is not defined/.test(error)) {
    return error + " (check the spelling; JavaScript is case-sensitive)";
  }
  if (/Assignment to constant/.test(error)) {
    return (
      error +
      " (a const variable can't be reassigned. Use let, or change what's inside the array or object instead)"
    );
  }
  if (/Cannot assign to read only property|object is not extensible/.test(error)) {
    return (
      error +
      " (props are read-only. Don't change them: calculate a new variable from them instead)"
    );
  }
  if (/toFixed is not a function/.test(error)) {
    return error + " (toFixed only works on numbers. Was a number passed as text, like price=\"9.99\" instead of price={9.99}?)";
  }
  if (/Missing initializer/.test(error)) {
    return error + " (a const needs a value after the = sign)";
  }
  return error;
}
