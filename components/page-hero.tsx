import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionLabel } from "@/components/ui";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", tone === "light" ? "text-white/55" : "text-ink/50")}>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {c.href ? (
              <Link href={c.href} className={tone === "light" ? "hover:text-white" : "hover:text-ink"}>
                {c.label}
              </Link>
            ) : (
              <span className={cn("line-clamp-1", tone === "light" ? "text-white/85" : "text-ink/80")}>{c.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight className="size-3.5 opacity-60" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Light page header: label on the left, large title + intro on the right (reference "Project" layout). */
export function PageHero({
  label,
  title,
  text,
  crumbs,
  children,
}: {
  label: string;
  title: string;
  text?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-paper pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div className="container-x">
        {crumbs && (
          <div className="mb-10">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel>{label}</SectionLabel>
          </div>
          <div className="lg:col-span-8 xl:col-span-7">
            <h1 className="display text-[clamp(2.5rem,5.6vw,5rem)]">{title}</h1>
            {text && <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{text}</p>}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
