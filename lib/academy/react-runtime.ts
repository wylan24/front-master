import { compileJsx } from "./jsx";

/**
 * A tiny stand-in for React, used by the React course's challenges and
 * playgrounds. It runs inside the same sandboxed worker as every other
 * exercise, so it is kept as plain JavaScript source text.
 *
 * It supports what the beginner course teaches: function components, props
 * (frozen, as in React's development mode), children, fragments, keys,
 * useState with React's snapshot and bail-out rules, and click, change and
 * submit events. It also prints the warnings React prints for the common
 * beginner mistakes (missing keys, `class` instead of `className`,
 * lowercase component names, `onClick={handle()}` and so on).
 *
 * Learner code can call `render(<App />)` to show a preview. Exercise checks
 * use `screen` to read the result and act like a user:
 *   screen.text()              all visible text
 *   screen.html()              the rendered HTML
 *   screen.count("li")         how many <li> elements are on screen
 *   screen.countComponents("ProductCard")
 *   screen.click("Add", 1)     clicks the second clickable element containing "Add"
 *   screen.type("Search", "k") types into the field with that placeholder, aria-label, name or id
 *   screen.submit()            submits the first form
 *   __logsDuring(() => ...)    what console.log printed during an action
 *
 * Written with String.raw so the backslashes in its regular expressions survive.
 * It must not contain backticks or dollar-brace sequences.
 */
const REACT_RUNTIME_SOURCE = String.raw`
const __warnings = [];
const __warnedMessages = new Set();

function __warn(message) {
  if (__warnedMessages.has(message)) {
    return;
  }
  __warnedMessages.add(message);
  __warnings.push(message);
  console.warn("Warning: " + message);
}

const Fragment = "React.Fragment";

const __KNOWN_TAGS = new Set((
  "a abbr article aside b blockquote br button caption code dd del details div dl dt em " +
  "fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr i img input ins kbd " +
  "label legend li main mark nav ol optgroup option output p pre progress s section select " +
  "small span strong sub summary sup table tbody td textarea tfoot th thead time tr u ul"
).split(" "));

const __VOID_TAGS = new Set(["img", "input", "br", "hr"]);

function __isElement(value) {
  return value !== null && typeof value === "object" && value.$$typeof === "react.element";
}

// Children written side by side in JSX arrive as an array too, but they are
// not a list from map(), so React doesn't ask them for keys. Those arrays are
// remembered here so passing them on (as props.children) doesn't warn.
const __staticChildLists = new WeakSet();

function __checkListKeys(list) {
  if (__staticChildLists.has(list)) {
    return;
  }
  const seenKeys = new Set();
  for (const item of list) {
    if (!__isElement(item)) {
      continue;
    }
    if (item.key === null) {
      __warn('Each child in a list should have a unique "key" prop. Add key={...} to the element you return from map(), using something unique like an id.');
      continue;
    }
    const key = String(item.key);
    if (seenKeys.has(key)) {
      __warn('Two children in a list have the same key "' + key + '". Keys must be unique among siblings.');
    }
    seenKeys.add(key);
  }
}

function createElement(type, config) {
  if (type === undefined || type === null) {
    throw new Error("A JSX tag refers to something that is " + String(type) + ". Check the component is defined and its name is spelled the same way.");
  }

  const props = {};
  let key = null;
  if (config) {
    for (const name of Object.keys(config)) {
      if (name === "key") {
        key = config[name] === undefined ? null : config[name];
      } else {
        props[name] = config[name];
      }
    }
  }

  const children = Array.prototype.slice.call(arguments, 2);
  for (const child of children) {
    if (Array.isArray(child)) {
      __checkListKeys(child);
    }
  }
  if (children.length === 1) {
    props.children = children[0];
  } else if (children.length > 1) {
    __staticChildLists.add(children);
    props.children = children;
  }

  return { $$typeof: "react.element", type: type, key: key, props: props };
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

let __rootElement = null;
let __tree = null;
let __hookStore = new Map();
let __visitedPaths = new Set();
let __currentHooks = null;
let __hookIndex = 0;
let __isRendering = false;
let __isHandlingEvent = false;
let __renderRequested = false;
let __elementsById = new Map();
let __nextElementId = 0;

function __resolve(node, path, formId) {
  if (node === null || node === undefined || node === true || node === false) {
    return [];
  }
  if (typeof node === "string" || typeof node === "number") {
    return [{ kind: "text", text: String(node) }];
  }
  if (Array.isArray(node)) {
    const resolved = [];
    for (let index = 0; index < node.length; index++) {
      const child = node[index];
      let childPath = path + "/" + index;
      if (__isElement(child) && child.key !== null) {
        childPath = path + "/key:" + String(child.key);
      }
      for (const resolvedChild of __resolve(child, childPath, formId)) {
        resolved.push(resolvedChild);
      }
    }
    return resolved;
  }
  if (typeof node === "function") {
    const name = node.name || "Component";
    __warn("Functions are not valid as a React child. To show a component, write <" + name + " /> instead of {" + name + "}.");
    return [];
  }
  if (!__isElement(node)) {
    throw new Error("Objects are not valid as a React child (found an object with keys {" + Object.keys(node).join(", ") + "}). Show one of its properties instead, such as {product.name}.");
  }
  if (typeof node.type === "function") {
    return __renderComponent(node, path, formId);
  }
  if (node.type === Fragment) {
    return __resolve(node.props.children, path + "/fragment", formId);
  }
  if (typeof node.type === "string") {
    return [__renderHtmlElement(node, path, formId)];
  }
  throw new Error("This JSX tag is not a component or an HTML tag: " + String(node.type));
}

function __renderComponent(element, path, formId) {
  const component = element.type;
  const name = component.name || "Anonymous";
  const componentPath = path + "<" + name + ">";
  __visitedPaths.add(componentPath);

  let hooks = __hookStore.get(componentPath);
  if (hooks === undefined) {
    hooks = [];
    __hookStore.set(componentPath, hooks);
  }

  const props = Object.freeze(Object.assign({}, element.props));
  const outerHooks = __currentHooks;
  const outerHookIndex = __hookIndex;
  __currentHooks = hooks;
  __hookIndex = 0;

  let output;
  try {
    output = component(props);
  } finally {
    __currentHooks = outerHooks;
    __hookIndex = outerHookIndex;
  }

  if (output === undefined) {
    __warn(name + " returned undefined, so it shows nothing. Did you forget the return keyword? (Return null to show nothing on purpose.)");
  }

  return [{ kind: "component", name: name, children: __resolve(output, componentPath, formId) }];
}

function __eventHandlerSuggestion(name) {
  return "on" + name.charAt(2).toUpperCase() + name.slice(3);
}

function __renderHtmlElement(element, path, formId) {
  const tag = element.type;
  const props = element.props;
  const id = __nextElementId;
  __nextElementId++;

  if (!__KNOWN_TAGS.has(tag)) {
    if (/[A-Z]/.test(tag)) {
      __warn("<" + tag + " /> is treated as an HTML tag because it starts with a lowercase letter. Component names must start with a capital letter.");
    } else {
      __warn("<" + tag + "> is not an HTML element this preview knows about.");
    }
  }

  const attributes = {};
  const events = [];
  let style = null;

  for (const name of Object.keys(props)) {
    const value = props[name];

    if (name === "children") {
      continue;
    }
    if (name === "class") {
      __warn("Invalid DOM property 'class'. Did you mean 'className'?");
    }
    if (name === "for") {
      __warn("Invalid DOM property 'for'. Did you mean 'htmlFor'?");
    }
    if (name === "style") {
      if (value === null || value === undefined) {
        continue;
      }
      if (typeof value !== "object") {
        throw new Error('The style prop expects an object, like style={{ color: "red" }}, not a string.');
      }
      style = {};
      for (const property of Object.keys(value)) {
        style[property] = value[property];
      }
      continue;
    }
    if (/^on[A-Z]/.test(name)) {
      if (typeof value === "function") {
        events.push(name);
      } else if (value !== undefined && value !== null) {
        __warn("Expected '" + name + "' to be a function, but got a " + typeof value + ". Pass the function itself, " + name + "={handleClick}, not the result of calling it, " + name + "={handleClick()}.");
      }
      continue;
    }
    if (/^on[a-z]/.test(name)) {
      __warn("Unknown event handler property '" + name + "'. Did you mean '" + __eventHandlerSuggestion(name) + "'?");
      continue;
    }
    if (value === undefined || value === null || typeof value === "function" || typeof value === "object") {
      continue;
    }
    attributes[name] = value;
  }

  const isFormField = tag === "input" || tag === "textarea" || tag === "select";
  const hasValueWithoutOnChange = props.value !== undefined && typeof props.onChange !== "function";
  const hasCheckedWithoutOnChange = props.checked !== undefined && typeof props.onChange !== "function";
  if (isFormField && !props.readOnly && (hasValueWithoutOnChange || hasCheckedWithoutOnChange)) {
    __warn("A form field has a value (or checked) prop but no onChange handler, so the user can't change it. Add onChange, or use defaultValue for a field React doesn't control.");
  }

  __elementsById.set(id, { tag: tag, props: props, formId: formId });

  let childFormId = formId;
  if (tag === "form") {
    childFormId = id;
  }
  const children = __resolve(props.children, path + "/" + tag, childFormId);

  return {
    kind: "element",
    id: id,
    tag: tag,
    attributes: attributes,
    style: style,
    events: events,
    insideForm: formId !== null,
    children: children,
  };
}

function __renderRoot() {
  if (__rootElement === null) {
    return;
  }

  let passes = 0;
  do {
    passes++;
    if (passes > 25) {
      throw new Error("Too many re-renders. React stops here to prevent an infinite loop. Is state being set while the component renders? For example onClick={setCount(count + 1)} calls setCount straight away; write onClick={() => setCount(count + 1)}.");
    }
    __renderRequested = false;
    __isRendering = true;
    __visitedPaths = new Set();
    __elementsById = new Map();
    __nextElementId = 0;
    try {
      __tree = __resolve(__rootElement, "", null);
    } finally {
      __isRendering = false;
    }
  } while (__renderRequested);

  // Components that left the screen lose their state, as in React.
  for (const path of Array.from(__hookStore.keys())) {
    if (!__visitedPaths.has(path)) {
      __hookStore.delete(path);
    }
  }
}

function __requestRender() {
  if (__isRendering || __isHandlingEvent) {
    __renderRequested = true;
    return;
  }
  __renderRoot();
}

function render(element) {
  if (!__isElement(element)) {
    throw new Error("render() expects JSX, for example render(<App />).");
  }
  __rootElement = element;
  __hookStore = new Map();
  __renderRoot();
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

function useState(initialValue) {
  if (__currentHooks === null) {
    throw new Error("useState can only be called at the top of a component function, while it renders. It can't be called inside an event handler or outside a component.");
  }

  const hooks = __currentHooks;
  const index = __hookIndex;
  __hookIndex++;

  if (!(index in hooks)) {
    hooks[index] = typeof initialValue === "function" ? initialValue() : initialValue;
  }

  function setState(nextValue) {
    let value = nextValue;
    if (typeof nextValue === "function") {
      value = nextValue(hooks[index]);
    }
    // React skips the re-render when the new value is the same value (or the same array/object).
    if (Object.is(value, hooks[index])) {
      return;
    }
    hooks[index] = value;
    __requestRender();
  }

  return [hooks[index], setState];
}

const React = { createElement: createElement, Fragment: Fragment, useState: useState };

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

function __createEvent(entry, type, fields) {
  const target = {
    tagName: entry.tag.toUpperCase(),
    name: entry.props.name,
    id: entry.props.id,
    type: entry.props.type,
    value: entry.props.value === undefined ? "" : String(entry.props.value),
    checked: Boolean(entry.props.checked),
  };
  if (fields.value !== undefined) {
    target.value = String(fields.value);
  }
  if (fields.checked !== undefined) {
    target.checked = Boolean(fields.checked);
  }

  const event = {
    type: type,
    target: target,
    currentTarget: target,
    defaultPrevented: false,
    preventDefault: function () {
      event.defaultPrevented = true;
    },
    stopPropagation: function () {},
  };
  return event;
}

function __findEntry(id) {
  const entry = __elementsById.get(id);
  if (entry === undefined) {
    throw new Error("That element is no longer on the screen.");
  }
  return entry;
}

function __submitForm(formId) {
  const form = __findEntry(formId);
  const event = __createEvent(form, "submit", {});
  if (typeof form.props.onSubmit === "function") {
    form.props.onSubmit(event);
  }
  if (!event.defaultPrevented) {
    __warn("The form was submitted without event.preventDefault(). In a real browser the page would reload and every piece of state would reset. Call event.preventDefault() first in your submit handler.");
  }
}

/** Runs one user action, then renders once, like React batching updates from an event. */
function __handleEvent(runHandlers) {
  __isHandlingEvent = true;
  try {
    runHandlers();
  } finally {
    __isHandlingEvent = false;
  }
  if (__renderRequested) {
    __renderRoot();
  }
}

function __click(id) {
  const entry = __findEntry(id);
  if (entry.props.disabled) {
    return;
  }
  __handleEvent(function () {
    const event = __createEvent(entry, "click", {});
    if (typeof entry.props.onClick === "function") {
      entry.props.onClick(event);
    }
    const isSubmitButton = entry.tag === "button" && entry.props.type !== "button";
    if (isSubmitButton && entry.formId !== null && !event.defaultPrevented) {
      __submitForm(entry.formId);
    }
  });
}

function __change(id, fields) {
  const entry = __findEntry(id);
  __handleEvent(function () {
    const event = __createEvent(entry, "change", fields);
    if (typeof entry.props.onChange === "function") {
      entry.props.onChange(event);
    }
  });
}

function __submit(id) {
  __handleEvent(function () {
    __submitForm(id);
  });
}

// ---------------------------------------------------------------------------
// Reading the screen
// ---------------------------------------------------------------------------

function __requireRoot() {
  if (__tree === null) {
    throw new Error("Nothing is on the screen yet. Call render(<App />) first.");
  }
}

function __textOf(nodes) {
  let text = "";
  for (const node of nodes) {
    if (node.kind === "text") {
      text += node.text;
    } else {
      text += __textOf(node.children);
    }
  }
  return text;
}

function __escapeHtml(text) {
  return String(text).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;");
}

function __htmlAttributeName(name) {
  if (name === "className") {
    return "class";
  }
  if (name === "htmlFor") {
    return "for";
  }
  return name;
}

function __styleText(style) {
  const parts = [];
  for (const property of Object.keys(style)) {
    const cssName = property.replace(/[A-Z]/g, function (letter) {
      return "-" + letter.toLowerCase();
    });
    parts.push(cssName + ": " + style[property]);
  }
  return parts.join("; ");
}

function __htmlOf(nodes) {
  let html = "";
  for (const node of nodes) {
    if (node.kind === "text") {
      html += __escapeHtml(node.text);
      continue;
    }
    if (node.kind === "component") {
      html += __htmlOf(node.children);
      continue;
    }
    let opening = "<" + node.tag;
    for (const name of Object.keys(node.attributes)) {
      const value = node.attributes[name];
      if (value === false) {
        continue;
      }
      if (value === true) {
        opening += " " + __htmlAttributeName(name);
        continue;
      }
      opening += " " + __htmlAttributeName(name) + '="' + __escapeHtml(value) + '"';
    }
    if (node.style !== null) {
      opening += ' style="' + __escapeHtml(__styleText(node.style)) + '"';
    }
    opening += ">";
    html += opening;
    if (__VOID_TAGS.has(node.tag)) {
      continue;
    }
    html += __htmlOf(node.children) + "</" + node.tag + ">";
  }
  return html;
}

/** Collects matching nodes in page order. */
function __collect(nodes, test, found) {
  for (const node of nodes) {
    if (node.kind === "text") {
      continue;
    }
    if (test(node)) {
      found.push(node);
    }
    __collect(node.children, test, found);
  }
  return found;
}

function __contains(outer, inner) {
  for (const child of outer.children) {
    if (child === inner) {
      return true;
    }
    if (child.kind !== "text" && __contains(child, inner)) {
      return true;
    }
  }
  return false;
}

function __fieldMatches(node, label) {
  const isField = node.tag === "input" || node.tag === "textarea" || node.tag === "select";
  if (!isField) {
    return false;
  }
  const attributes = node.attributes;
  return attributes.placeholder === label || attributes["aria-label"] === label || attributes.name === label || attributes.id === label;
}

const screen = {
  text: function () {
    __requireRoot();
    return __textOf(__tree);
  },
  html: function () {
    __requireRoot();
    return __htmlOf(__tree);
  },
  count: function (tag) {
    __requireRoot();
    return __collect(__tree, function (node) {
      return node.kind === "element" && node.tag === tag;
    }, []).length;
  },
  countComponents: function (name) {
    __requireRoot();
    return __collect(__tree, function (node) {
      return node.kind === "component" && node.name === name;
    }, []).length;
  },
  click: function (text, which) {
    __requireRoot();
    const position = which === undefined ? 0 : which;
    const clickable = __collect(__tree, function (node) {
      if (node.kind !== "element") {
        return false;
      }
      const canBeClicked = node.events.includes("onClick") || (node.tag === "button" && node.insideForm);
      return canBeClicked && __textOf(node.children).includes(text);
    }, []);
    // Prefer the innermost match: the button, not the card around it.
    const innermost = clickable.filter(function (node) {
      return !clickable.some(function (other) {
        return other !== node && __contains(node, other);
      });
    });
    const target = innermost[position];
    if (target === undefined) {
      throw new Error('Could not click "' + text + '": found ' + innermost.length + " clickable element(s) containing that text. Is there a button with an onClick?");
    }
    __click(target.id);
  },
  type: function (label, value) {
    __requireRoot();
    const field = __collect(__tree, function (node) {
      return node.kind === "element" && __fieldMatches(node, label);
    }, [])[0];
    if (field === undefined) {
      throw new Error('Could not find a field with the placeholder, aria-label, name or id "' + label + '".');
    }
    if (!field.events.includes("onChange")) {
      throw new Error('The "' + label + '" field has no onChange handler, so typing in it does nothing React can see.');
    }
    __change(field.id, { value: String(value) });
  },
  toggle: function (label, checked) {
    __requireRoot();
    const field = __collect(__tree, function (node) {
      return node.kind === "element" && __fieldMatches(node, label);
    }, [])[0];
    if (field === undefined) {
      throw new Error('Could not find a checkbox with the name, aria-label or id "' + label + '".');
    }
    __change(field.id, { checked: checked });
  },
  submit: function () {
    __requireRoot();
    const form = __collect(__tree, function (node) {
      return node.kind === "element" && node.tag === "form";
    }, [])[0];
    if (form === undefined) {
      throw new Error("There is no <form> on the screen to submit.");
    }
    __submit(form.id);
  },
};

// ---------------------------------------------------------------------------
// Exercise check helpers
// ---------------------------------------------------------------------------

/** Runs an action and returns what console.log printed while it ran. */
function __logsDuring(action) {
  const captured = [];
  const originalLog = console.log;
  console.log = function () {
    const parts = [];
    for (const value of arguments) {
      parts.push(typeof value === "string" ? value : JSON.stringify(value));
    }
    captured.push(parts.join(" "));
    originalLog.apply(console, arguments);
  };
  try {
    action();
  } finally {
    console.log = originalLog;
  }
  return captured;
}

// ---------------------------------------------------------------------------
// Preview support
// ---------------------------------------------------------------------------

function __snapshot() {
  if (__tree === null) {
    return null;
  }
  return JSON.parse(JSON.stringify(__tree));
}

/** Replays preview interactions in order. Stops quietly if the screen has changed shape. */
function __replay(actions) {
  for (const action of actions) {
    if (__tree === null || !__elementsById.has(action.id)) {
      return;
    }
    if (action.kind === "click") {
      __click(action.id);
    } else if (action.kind === "change") {
      __change(action.id, { value: action.value, checked: action.checked });
    } else if (action.kind === "submit") {
      __submit(action.id);
    }
  }
}
`;

/** One node of a rendered React screen, as sent back from the worker. */
export type PreviewNode = PreviewText | PreviewElement | PreviewComponent;

export type PreviewText = { kind: "text"; text: string };

export type PreviewElement = {
  kind: "element";
  id: number;
  tag: string;
  attributes: Record<string, string | number | boolean>;
  style: Record<string, string | number> | null;
  events: string[];
  insideForm: boolean;
  children: PreviewNode[];
};

export type PreviewComponent = { kind: "component"; name: string; children: PreviewNode[] };

/** Something the learner did in a preview, replayed against a fresh run of their code. */
export type PreviewAction =
  | { kind: "click"; id: number }
  | { kind: "change"; id: number; value?: string; checked?: boolean }
  | { kind: "submit"; id: number };

/**
 * Learners may write imports and exports out of habit. The sandbox is not a
 * module, so these lines are removed: React and useState are already there.
 */
function removeModuleSyntax(code: string): string {
  const withoutImports = code.replace(/^\s*import\s[^\n]*from\s+["']react["'];?[ \t]*$/gm, "");
  return withoutImports.replace(/^(\s*)export\s+(default\s+)?(?=function|const|let|class)/gm, "$1");
}

/**
 * Builds one runnable program: the runtime, then the learner's code in its
 * own scope (so it may declare its own names), then `resultExpression`.
 * The program leaves `{ preview, values }` in a variable called `__result`.
 */
export function buildReactProgram(learnerCode: string, resultExpression: string): string {
  const compiledLearnerCode = compileJsx(removeModuleSyntax(learnerCode));
  const compiledResultExpression = compileJsx(resultExpression);

  return [
    '"use strict";',
    REACT_RUNTIME_SOURCE,
    "const __result = (() => {",
    compiledLearnerCode,
    ";",
    "const __preview = __snapshot();",
    "return { preview: __preview, values: (" + compiledResultExpression + ") };",
    "})();",
  ].join("\n");
}

/** The expression that replays preview actions and returns the screen afterwards. */
export function buildReplayExpression(actions: PreviewAction[]): string {
  return "(__replay(" + JSON.stringify(actions) + "), __snapshot())";
}
