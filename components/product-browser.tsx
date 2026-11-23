"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { cn } from "@/lib/utils";

type Cat = "radiation" | "medical" | "energy";

export type BrowserItem = ProductCardData & { group: string | null; search: string };

type Props = {
  items: BrowserItem[];
  categories: { slug: Cat; title: string }[];
  groups: { slug: string; title: string }[];
  labels: { all: string; search: string; empty: string; count: string; coming: string };
};

export function ProductBrowser({ items, categories, groups, labels }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const initialCat = params.get("category");
  const [category, setCategory] = useState<Cat | "all">(
    categories.some((c) => c.slug === initialCat) ? (initialCat as Cat) : "all",
  );
  const [group, setGroup] = useState<string | null>(params.get("group"));
  const [query, setQuery] = useState("");

  function sync(next: { category: Cat | "all"; group: string | null }) {
    const sp = new URLSearchParams();
    if (next.category !== "all") sp.set("category", next.category);
    if (next.group) sp.set("group", next.group);
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const pickCategory = (c: Cat | "all") => {
    setCategory(c);
    setGroup(null);
    sync({ category: c, group: null });
  };
  const pickGroup = (g: string | null) => {
    setGroup(g);
    sync({ category, group: g });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) =>
        (category === "all" || i.category === category) &&
        (!group || category !== "radiation" || i.group === group) &&
        (!q || i.search.includes(q)),
    );
  }, [items, category, group, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const i of items) c[i.category] = (c[i.category] ?? 0) + 1;
    return c;
  }, [items]);

  const tab = (active: boolean) =>
    cn(
      "inline-flex shrink-0 items-center gap-2 rounded-[0.6rem] border px-4 py-2.5 text-[0.95rem] whitespace-nowrap transition-colors",
      active ? "border-ink bg-ink text-white" : "border-ink/12 bg-white text-ink hover:border-ink/35",
    );

  return (
    <div>
      {/* Toolbar */}
      <div className="sticky top-[5.25rem] z-30 -mx-5 border-b border-ink/10 bg-paper/90 px-5 py-4 backdrop-blur-xl sm:top-[6.25rem] sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none]" role="tablist">
            <button type="button" role="tab" aria-selected={category === "all"} className={tab(category === "all")} onClick={() => pickCategory("all")}>
              {labels.all}
              <span className="text-[0.8rem] opacity-60">{counts.all}</span>
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={category === c.slug}
                className={tab(category === c.slug)}
                onClick={() => pickCategory(c.slug)}
              >
                {c.title}
                <span className="text-[0.8rem] opacity-60">{counts[c.slug]}</span>
              </button>
            ))}
          </div>
          <label className="relative block xl:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.search}
              className="w-full rounded-[0.6rem] border border-ink/12 bg-white py-2.5 pr-10 pl-10 text-[0.95rem] outline-none placeholder:text-ink/40 focus:border-ink/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-ink/50 hover:bg-paper"
                aria-label="Clear"
              >
                <X className="size-4" />
              </button>
            )}
          </label>
        </div>

        {category === "radiation" && (
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none]">
            <button
              type="button"
              onClick={() => pickGroup(null)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors",
                !group ? "border-accent bg-accent text-ink" : "border-ink/12 bg-white/70 text-ink/75 hover:border-ink/35",
              )}
            >
              {labels.all}
            </button>
            {groups.map((g) => (
              <button
                key={g.slug}
                type="button"
                onClick={() => pickGroup(g.slug)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors",
                  group === g.slug ? "border-accent bg-accent text-ink" : "border-ink/12 bg-white/70 text-ink/75 hover:border-ink/35",
                )}
              >
                {g.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-8 text-sm text-ink/50" aria-live="polite">
        {filtered.length} {labels.count}
      </p>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-lg text-ink/50">{labels.empty}</p>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
          {filtered.map((item) => (
            <li key={item.slug}>
              <ProductCard item={item} comingLabel={labels.coming} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
