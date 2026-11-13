import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { tokenizeJavaScript, type TokenKind } from "@/lib/academy/highlight";

const TOKEN_CLASS: Record<TokenKind, string> = {
  keyword: "text-[#f08a65]",
  string: "text-[#a7d98b]",
  number: "text-[#f3c64b]",
  comment: "text-[#8f897b]",
  plain: "",
};

/** Dark, syntax-coloured code block used in lessons. */
export function CodeBlock({ code }: { code: string }) {
  const tokens = tokenizeJavaScript(code);

  return (
    <pre className="my-[10px] mb-[14px] overflow-auto rounded-xl bg-code px-4 py-[14px] font-mono text-[14px] leading-[1.6] text-code-ink">
      {tokens.map((token, index) => {
        if (token.kind === "plain") {
          return token.text;
        }
        return (
          <span key={index} className={TOKEN_CLASS[token.kind]}>
            {token.text}
          </span>
        );
      })}
    </pre>
  );
}

/** Blue callout with an emoji, used for real-world comparisons. */
export function Analogy({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <div className="my-3 flex items-start gap-[14px] rounded-xl bg-info-soft px-4 py-[14px]">
      <div className="text-[24px] leading-none">{icon}</div>
      <div>{children}</div>
    </div>
  );
}

/** Yellow side-bar note. */
export function Tip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "my-3 rounded-r-[10px] border-l-4 border-highlight bg-highlight-soft px-[14px] py-[10px] text-[15px]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** A white card section; `lesson-card` gives its paragraphs the reference spacing. */
export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "lesson-card my-5 rounded-2xl border border-border bg-card px-6 py-[22px]",
        className
      )}
    >
      {children}
    </section>
  );
}

/** Card heading with an optional dark tag, e.g. "LEARN The idea". */
export function PanelHeading({
  tag,
  children,
  className,
}: {
  tag?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-[10px] flex items-center gap-[10px] text-[21px] font-bold tracking-[-.02em]",
        className
      )}
    >
      {tag && <Badge variant="tag">{tag}</Badge>}
      {children}
    </h2>
  );
}

/** Dark one-to-three line output box under the widgets. `<b>` renders yellow. */
export function Readout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[42px] rounded-[10px] bg-code px-[14px] py-[10px] font-mono text-[14px] whitespace-pre-wrap text-code-ink [&_b]:font-semibold [&_b]:text-highlight">
      {children}
    </div>
  );
}

/** A wrapping row of buttons and inputs. */
export function Controls({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("my-[10px] flex flex-wrap items-center gap-2", className)}>
      {children}
    </div>
  );
}

/** Small mono label above a row of boxes, e.g. "nums (original)". */
export function RowLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 font-mono text-[13px] text-muted-foreground">
      {children}
    </div>
  );
}

/** Code text that reads as part of a control row, without the pink chip. */
export function PlainCode({ children }: { children: ReactNode }) {
  return <code className="bg-transparent p-0 text-ink">{children}</code>;
}

/** A variable readout chip, e.g. `i = 2`. `<b>` renders in the brand colour. */
export function VariableChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[10px] border-[1.5px] border-border bg-white px-3 py-1.5 font-mono text-[14px] [&_b]:text-brand">
      {children}
    </span>
  );
}

export function CheatSheet({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[10px]">
      {children}
    </div>
  );
}

export function Cheat({ code, children }: { code: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white px-[14px] py-3 text-[14px]">
      <code className="mb-1 inline-block">{code}</code>
      <br />
      {children}
    </div>
  );
}
