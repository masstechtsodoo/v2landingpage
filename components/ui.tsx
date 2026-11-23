import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Brand mark + wordmark. `tone="light"` for dark backgrounds. */
export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src={tone === "light" ? "/brand/mark-light.png" : "/brand/mark.png"}
        alt=""
        width={36}
        height={36}
        className="size-8 sm:size-9"
        priority
      />
      <span
        className={cn(
          "text-[1.35rem] leading-none font-medium tracking-[-0.03em] whitespace-nowrap sm:text-2xl",
          tone === "light" ? "text-white" : "text-ink",
        )}
      >
        Mass Tech
      </span>
    </span>
  );
}

/** Small section label with the brand mark, e.g. "◎ What We Do" */
export function SectionLabel({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 text-[0.95rem] tracking-[-0.01em]",
        tone === "light" ? "text-white/85" : "text-ink/75",
        className,
      )}
    >
      <Image
        src={tone === "light" ? "/brand/mark-light.png" : "/brand/mark.png"}
        alt=""
        width={22}
        height={22}
        className="size-[22px]"
      />
      {children}
    </p>
  );
}

type ArrowButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "accent" | "light" | "dark" | "outline";
  size?: "md" | "lg";
  className?: string;
  external?: boolean;
};

/** Pill button with an arrow tile – the main CTA style of the site. */
export function ArrowButton({ href, children, variant = "accent", size = "md", className, external }: ArrowButtonProps) {
  const styles = {
    accent: "bg-accent text-ink hover:bg-accent-strong",
    light: "bg-white text-ink hover:bg-paper",
    dark: "bg-ink text-white hover:bg-navy",
    outline: "border border-ink/15 bg-transparent text-ink hover:border-ink/40",
  }[variant];
  const tile = {
    accent: "bg-white text-ink",
    light: "bg-accent text-ink",
    dark: "bg-accent text-ink",
    outline: "bg-ink text-white",
  }[variant];
  const content = (
    <>
      <span className="whitespace-nowrap">{children}</span>
      <span
        className={cn(
          "grid place-items-center rounded-[0.45rem] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          size === "lg" ? "size-9" : "size-8",
          tile,
        )}
      >
        <ArrowUpRight className="size-4" strokeWidth={2} />
      </span>
    </>
  );
  const cls = cn(
    "group inline-flex items-center gap-4 rounded-[0.6rem] font-medium tracking-[-0.01em] transition-colors",
    size === "lg" ? "py-1.5 pr-1.5 pl-5 text-base" : "py-1 pr-1 pl-4 text-[0.95rem]",
    styles,
    className,
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

/** Small tag/chip with optional arrow */
export function Chip({
  children,
  active,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[0.55rem] border px-3.5 py-2 text-[0.9rem] leading-none tracking-[-0.01em] transition-colors",
        active ? "border-accent bg-accent text-ink" : "border-ink/15 bg-white text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Two-line "label / value" pair used under dashed separators */
export function MetaItem({ label, value, tone = "dark" }: { label: string; value: string; tone?: "light" | "dark" }) {
  return (
    <div>
      <p className={cn("text-sm", tone === "light" ? "text-white/55" : "text-ink/50")}>{label}</p>
      <p className={cn("mt-1 text-lg tracking-[-0.02em]", tone === "light" ? "text-white" : "text-ink")}>{value}</p>
    </div>
  );
}
