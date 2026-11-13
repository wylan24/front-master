import type { ReactNode } from "react";

/** Eyebrow + title + lead paragraph at the top of every page. */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  lead: ReactNode;
}) {
  return (
    <>
      <div className="font-mono text-[12.5px] tracking-[.08em] text-brand uppercase">
        {eyebrow}
      </div>
      <h1 className="mt-1.5 mb-[10px] text-[length:clamp(28px,4vw,40px)] leading-[1.1] font-bold tracking-[-.03em]">
        {title}
      </h1>
      <p className="my-[18px] max-w-[680px] text-[18px] text-body-ink">{lead}</p>
    </>
  );
}
