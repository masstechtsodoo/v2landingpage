import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { BrandBackdrop } from "@/components/brand-backdrop";
import { excerpt, type Project } from "@/lib/content";
import { formatMonthYear, href, t, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function NewsCard({ p, locale, featured, badge }: { p: Project; locale: Locale; featured?: boolean; badge?: string }) {
  const title = t(p.title, locale);
  const cover = p.cover;
  return (
    <Link
      href={href(locale, `/news/${p.slug}`)}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink/8 bg-white transition-shadow duration-300 hover:shadow-[0_24px_50px_-24px_rgb(11_24_40/0.35)]",
        featured && "lg:grid lg:grid-cols-12",
      )}
    >
      <div className={cn("relative isolate overflow-hidden", featured ? "aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]" : "aspect-[16/10]")}>
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <BrandBackdrop />
        )}
        {badge && (
          <span className="absolute top-4 left-4 rounded-[0.5rem] bg-accent px-3 py-1.5 text-sm text-ink">{badge}</span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-6", featured && "lg:col-span-5 lg:p-10")}>
        <p className="flex items-center gap-2 text-sm text-ink/55">
          <CalendarDays className="size-4" />
          {formatMonthYear(p.start, locale)}
        </p>
        <h3
          className={cn(
            "mt-3 tracking-[-0.025em] text-balance",
            featured ? "text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.1]" : "line-clamp-3 text-[1.2rem] leading-snug",
          )}
        >
          {title}
        </h3>
        {featured && <p className="mt-5 leading-relaxed text-muted">{excerpt(t(p.body, locale), 260)}</p>}
        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p className="line-clamp-2 text-[0.9rem] text-ink/60">{t(p.client, locale)}</p>
          <span className="grid size-9 shrink-0 place-items-center rounded-[0.5rem] bg-paper transition-colors group-hover:bg-accent">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
