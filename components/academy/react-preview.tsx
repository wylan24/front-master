"use client";

import type { CSSProperties, FormEvent, ReactNode } from "react";
import type {
  PreviewAction,
  PreviewElement,
  PreviewNode,
} from "@/lib/academy/react-runtime";

/*
  Draws the screen that the learner's React code rendered in the sandbox.

  The learner's code never touches this page. The worker sends back a plain
  description of the screen, and this component draws it with a fixed list
  of safe tags and attributes. Clicks and typing are sent back as actions;
  the parent re-runs the code with those actions replayed.
*/

type ReactPreviewProps = {
  /** null when the code ran but never called render(...). */
  tree: PreviewNode[] | null;
  onAction: (action: PreviewAction) => void;
  isBusy: boolean;
};

// Tags drawn as themselves. Anything else is drawn as a <span>.
const ALLOWED_TAGS = new Set([
  "article",
  "aside",
  "b",
  "blockquote",
  "br",
  "button",
  "code",
  "dd",
  "div",
  "dl",
  "dt",
  "em",
  "fieldset",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "i",
  "input",
  "label",
  "legend",
  "li",
  "main",
  "mark",
  "nav",
  "ol",
  "option",
  "p",
  "pre",
  "s",
  "section",
  "select",
  "small",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "textarea",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

// Plain attributes copied across. Event handlers, href and src never are.
const ALLOWED_ATTRIBUTES = new Set([
  "id",
  "title",
  "alt",
  "type",
  "placeholder",
  "name",
  "disabled",
  "min",
  "max",
  "step",
  "rows",
  "colSpan",
  "htmlFor",
  "aria-label",
  "role",
]);

function getSafeStyle(style: PreviewElement["style"]): CSSProperties | undefined {
  if (style === null) {
    return undefined;
  }
  const safeStyle: Record<string, string | number> = {};
  for (const property of Object.keys(style)) {
    const value = style[property];
    // url(...) could load something from the internet, so it is left out.
    const loadsSomething = typeof value === "string" && value.includes("url(");
    if (!loadsSomething) {
      safeStyle[property] = value;
    }
  }
  return safeStyle as CSSProperties;
}

function getSafeAttributes(element: PreviewElement): Record<string, string | number | boolean> {
  const safeAttributes: Record<string, string | number | boolean> = {};
  for (const name of Object.keys(element.attributes)) {
    if (ALLOWED_ATTRIBUTES.has(name)) {
      safeAttributes[name] = element.attributes[name];
    }
  }
  return safeAttributes;
}

export function ReactPreview({ tree, onAction, isBusy }: ReactPreviewProps) {
  let body: ReactNode;
  if (tree === null) {
    body = (
      <p className="text-[14px] text-muted-foreground">
        Nothing rendered. End your code with <code>render(&lt;App /&gt;);</code> to
        see it here.
      </p>
    );
  } else if (tree.length === 0) {
    body = <p className="text-[14px] text-muted-foreground">(the component rendered nothing)</p>;
  } else {
    body = <PreviewNodes nodes={tree} onAction={onAction} />;
  }

  return (
    <div className="mt-[10px] overflow-hidden rounded-xl border-[1.5px] border-border">
      <div className="flex items-center gap-1.5 border-b border-border bg-background px-3 py-1.5">
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="ml-2 text-[11px] tracking-[.1em] text-muted-foreground uppercase">
          Preview{isBusy ? " · updating…" : ""}
        </span>
      </div>
      <div className="preview-page bg-surface px-4 py-3 text-[15px] text-ink">{body}</div>
    </div>
  );
}

function PreviewNodes({
  nodes,
  onAction,
}: {
  nodes: PreviewNode[];
  onAction: (action: PreviewAction) => void;
}) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.kind === "text") {
          return node.text;
        }
        if (node.kind === "component") {
          return <PreviewNodes key={index} nodes={node.children} onAction={onAction} />;
        }
        return <PreviewHtmlElement key={index} element={node} onAction={onAction} />;
      })}
    </>
  );
}

function PreviewHtmlElement({
  element,
  onAction,
}: {
  element: PreviewElement;
  onAction: (action: PreviewAction) => void;
}) {
  const attributes = getSafeAttributes(element);
  const style = getSafeStyle(element.style);
  const children = <PreviewNodes nodes={element.children} onAction={onAction} />;
  const hasClick = element.events.includes("onClick");
  const hasChange = element.events.includes("onChange");

  if (element.tag === "img") {
    return <ImagePlaceholder alt={element.attributes.alt} style={style} />;
  }

  if (element.tag === "input" || element.tag === "textarea") {
    return <PreviewField element={element} attributes={attributes} style={style} onAction={onAction} />;
  }

  if (element.tag === "select") {
    return (
      <select
        {...attributes}
        style={style}
        value={String(element.attributes.value ?? "")}
        disabled={!hasChange}
        onChange={(event) => onAction({ kind: "change", id: element.id, value: event.target.value })}
      >
        {children}
      </select>
    );
  }

  if (element.tag === "option") {
    return (
      <option {...attributes} value={String(element.attributes.value ?? "")}>
        {getPlainText(element.children)}
      </option>
    );
  }

  if (element.tag === "form") {
    function handleSubmit(event: FormEvent) {
      event.preventDefault();
      onAction({ kind: "submit", id: element.id });
    }
    return (
      <form {...attributes} style={style} onSubmit={handleSubmit}>
        {children}
      </form>
    );
  }

  if (element.tag === "button") {
    // A button inside a form submits it unless type="button", as in a browser.
    const submitsForm = element.insideForm && element.attributes.type !== "button";
    function handleButtonClick(event: { preventDefault: () => void }) {
      event.preventDefault();
      if (hasClick || submitsForm) {
        onAction({ kind: "click", id: element.id });
      }
    }
    return (
      <button {...attributes} type="button" style={style} onClick={handleButtonClick}>
        {children}
      </button>
    );
  }

  if (element.tag === "br" || element.tag === "hr") {
    const VoidTag = element.tag;
    return <VoidTag />;
  }

  const Tag = (ALLOWED_TAGS.has(element.tag) ? element.tag : "span") as "div";
  const clickProps = hasClick
    ? { onClick: () => onAction({ kind: "click", id: element.id }), className: "cursor-pointer" }
    : {};

  return (
    <Tag {...attributes} style={style} {...clickProps}>
      {children}
    </Tag>
  );
}

function PreviewField({
  element,
  attributes,
  style,
  onAction,
}: {
  element: PreviewElement;
  attributes: Record<string, string | number | boolean>;
  style: CSSProperties | undefined;
  onAction: (action: PreviewAction) => void;
}) {
  const hasChange = element.events.includes("onChange");
  const isCheckbox = element.attributes.type === "checkbox" || element.attributes.type === "radio";

  if (isCheckbox) {
    return (
      <input
        {...attributes}
        style={style}
        checked={element.attributes.checked === true}
        readOnly={!hasChange}
        onChange={(event) =>
          onAction({ kind: "change", id: element.id, checked: event.target.checked })
        }
      />
    );
  }

  function handleChange(event: { target: { value: string } }) {
    onAction({ kind: "change", id: element.id, value: event.target.value });
  }

  // A field with a value prop is controlled: it shows exactly what the code
  // says, and can only change through onChange. Without one, the browser
  // keeps whatever the learner types.
  const isControlled = element.attributes.value !== undefined;
  if (isControlled) {
    const controlledProps = {
      ...attributes,
      style,
      value: String(element.attributes.value),
      readOnly: !hasChange,
      onChange: handleChange,
    };
    if (element.tag === "textarea") {
      return <textarea {...controlledProps} />;
    }
    return <input {...controlledProps} />;
  }

  const uncontrolledProps = {
    ...attributes,
    style,
    defaultValue: String(element.attributes.defaultValue ?? ""),
    onChange: handleChange,
  };
  if (element.tag === "textarea") {
    return <textarea {...uncontrolledProps} />;
  }
  return <input {...uncontrolledProps} />;
}

function ImagePlaceholder({
  alt,
  style,
}: {
  alt: string | number | boolean | undefined;
  style: CSSProperties | undefined;
}) {
  const hasAlt = typeof alt === "string" && alt !== "";
  return (
    <span
      role="img"
      aria-label={hasAlt ? alt : "image without alt text"}
      style={style}
      className="my-1 inline-grid min-h-16 min-w-24 place-items-center rounded-md border border-dashed border-border bg-background px-2 text-[12px] text-muted-foreground"
    >
      🖼 {hasAlt ? alt : "(no alt text)"}
    </span>
  );
}

function getPlainText(nodes: PreviewNode[]): string {
  let text = "";
  for (const node of nodes) {
    if (node.kind === "text") {
      text += node.text;
    } else {
      text += getPlainText(node.children);
    }
  }
  return text;
}
