import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";

export type ProductCardData = {
  slug: string;
  href: string;
  category: "radiation" | "medical" | "energy";
  name: string;
  code: string | null;
  excerpt: string;
  tag: string;
  image: string | null;
};

export function ProductCard({ item, comingLabel }: { item: ProductCardData; comingLabel: string }) {
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink/8 bg-white transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(11_24_40/0.35)]"
    >
      <ProductVisual
        image={item.image}
        name={item.name}
        code={item.code}
        category={item.category}
        comingLabel={comingLabel}
        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/3]"
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.78rem] tracking-wide text-ink/50 uppercase">{item.tag}</p>
        <h3 className="mt-2 text-[1.12rem] leading-snug tracking-[-0.02em] text-balance">{item.name}</h3>
        <p className="mt-2.5 line-clamp-3 text-[0.9rem] leading-relaxed text-muted">{item.excerpt}</p>
        <span className="mt-auto flex justify-end pt-5">
          <span className="grid size-9 place-items-center rounded-[0.5rem] bg-paper transition-colors group-hover:bg-accent">
            <ArrowUpRight className="size-4" />
          </span>
        </span>
      </div>
    </Link>
  );
}
