import { cn } from "@/lib/utils";

/**
 * Renders text lines from the product/project documents:
 *  - "Heading:"            → small sub-heading
 *  - "Key: value"          → bold key + value
 *  - anything else         → normal line
 */
type Line = { kind: "heading"; text: string } | { kind: "kv"; key: string; value: string } | { kind: "text"; text: string };

export function parseLine(raw: string): Line {
  const line = raw.trim();
  const m = line.match(/^([^:：.]{2,60})[:：]\s*(.*)$/);
  if (m) {
    const [, key, value] = m;
    if (!value) return { kind: "heading", text: key };
    return { kind: "kv", key, value };
  }
  return { kind: "text", text: line };
}

export function FeatureList({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <ul className={cn("grid gap-x-10 md:grid-cols-2", className)}>
      {lines.map((raw, i) => {
        const l = parseLine(raw);
        if (l.kind === "heading") {
          return (
            <li key={i} className="pt-5 pb-1 text-[0.8rem] font-medium tracking-wide text-ink/55 uppercase md:col-span-2">
              {l.text}
            </li>
          );
        }
        return (
          <li key={i} className="flex gap-3 border-b border-dashed border-ink/15 py-3.5 text-[0.95rem] leading-relaxed">
            <span className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-accent-strong" />
            <span>
              {l.kind === "kv" ? (
                <>
                  <strong className="font-medium text-ink">{l.key}:</strong> <span className="text-ink/75">{l.value}</span>
                </>
              ) : (
                <span className="text-ink/80">{l.text}</span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Paragraph-style rendering for overviews and project descriptions. */
export function RichParagraphs({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {lines.map((raw, i) => {
        const l = parseLine(raw);
        if (l.kind === "heading") {
          return (
            <p key={i} className="pt-2 font-medium text-ink">
              {l.text}
            </p>
          );
        }
        if (l.kind === "kv") {
          return (
            <p key={i}>
              <strong className="font-medium text-ink">{l.key}:</strong> {l.value}
            </p>
          );
        }
        return <p key={i}>{l.text}</p>;
      })}
    </div>
  );
}
