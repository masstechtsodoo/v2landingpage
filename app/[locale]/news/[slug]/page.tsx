import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/page-hero";
import { Gallery } from "@/components/gallery";
import { NewsCard } from "@/components/news-card";
import { RichParagraphs } from "@/components/rich-lines";
import { ArrowButton, MetaItem, SectionLabel } from "@/components/ui";
import { excerpt, getProjects } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { formatDate, href, t, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = (await getProjects()).find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta(locale, `/news/${slug}`, t(p.title, locale), excerpt(t(p.body, locale), 160), p.cover ?? undefined);
}

// "Mongol Post Branch, Buyant-Ukhaa CX100100D — Unit 1" → location + model (project 8 equipment list)
const MODEL_ROW = /^(.+?)\s+((?:CX|MX)\d{4,}[A-Z]*(?:\s*[—–-]\s*[^:]+)?)\s*:?$/;

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const projects = await getProjects();
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const dict = getDictionary(locale);
  const title = t(p.title, locale);
  const body = t(p.body, locale);

  const rows = body.map((l) => l.match(MODEL_ROW)).filter(Boolean) as RegExpMatchArray[];
  const useTable = rows.length >= 4;
  const textLines = useTable ? body.filter((l) => !MODEL_ROW.test(l)) : body;
  const [intro, ...after] = textLines;

  const idx = projects.findIndex((x) => x.slug === p.slug);
  const newer = projects[idx - 1];
  const older = projects[idx + 1];
  const more = projects.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <>
      <section className="bg-paper pt-32 sm:pt-40">
        <div className="container-x">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: href(locale) },
              { label: dict.nav.news, href: href(locale, "/news") },
              { label: title },
            ]}
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <SectionLabel>{dict.news.label}</SectionLabel>
            </div>
            <div className="lg:col-span-9">
              <h1 className="text-[clamp(2rem,4.2vw,3.75rem)] leading-[1.05] tracking-[-0.035em] text-balance">{title}</h1>
              <div className="dashed-line mt-10 text-ink/25" />
              <div className="grid gap-6 py-6 sm:grid-cols-2">
                <MetaItem label={dict.common.client} value={t(p.client, locale)} />
                <MetaItem label={dict.common.period} value={p.end ? `${formatDate(p.start)} — ${formatDate(p.end)}` : formatDate(p.start)} />
              </div>
              <div className="dashed-line text-ink/25" />
            </div>
          </div>
        </div>
      </section>

      {p.cover && (
        <section className="bg-paper pt-10">
          <div className="container-x grid gap-8 lg:grid-cols-12">
            {/* Large photos go full-width; small source photos stay in the text column to avoid blur */}
            <div
              className={
                p.coverWidth >= 1400
                  ? "relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-paper-2 sm:aspect-[21/9] lg:col-span-12"
                  : "relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-paper-2 lg:col-span-9 lg:col-start-4 lg:max-w-3xl"
              }
            >
              <Image
                src={p.cover}
                alt={title}
                fill
                priority
                sizes={p.coverWidth >= 1400 ? "100vw" : "(min-width: 1024px) 768px, 100vw"}
                className="object-cover"
              />
            </div>
          </div>
        </section>
      )}

      <section className="bg-paper py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-4">
            {intro && <p className="text-[1.3rem] leading-relaxed tracking-[-0.015em] text-ink sm:text-2xl">{intro}</p>}
            {after.length > 0 && <RichParagraphs lines={after} className="mt-8 text-[1.05rem] leading-relaxed text-ink/75" />}

            {useTable && (
              <div className="mt-10 overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-white">
                <table className="w-full text-left text-[0.95rem]">
                  <tbody>
                    {rows.map((m, i) => (
                      <tr key={i} className="border-b border-ink/8 last:border-0">
                        <td className="px-5 py-3 text-ink/80">{m[1]}</td>
                        <td className="px-5 py-3 text-right font-medium whitespace-nowrap text-ink">{m[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {p.images.length > 1 && (
        <section className="bg-white py-16 sm:py-24">
          <div className="container-x">
            <SectionLabel>{dict.common.photos}</SectionLabel>
            <div className="mt-8">
              <Gallery images={p.images} alt={title} />
            </div>
          </div>
        </section>
      )}

      <nav className="border-t border-ink/10 bg-paper">
        <div className="container-x grid sm:grid-cols-2">
          {older ? (
            <Link href={href(locale, `/news/${older.slug}`)} className="group flex flex-col gap-2 py-8 sm:pr-8">
              <span className="flex items-center gap-2 text-sm text-ink/50">
                <ArrowLeft className="size-4" /> {formatDate(older.start)}
              </span>
              <span className="line-clamp-2 text-lg tracking-[-0.02em] group-hover:text-navy">{t(older.title, locale)}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link
              href={href(locale, `/news/${newer.slug}`)}
              className="group flex flex-col items-end gap-2 border-t border-ink/10 py-8 text-right sm:border-t-0 sm:border-l sm:pl-8"
            >
              <span className="flex items-center gap-2 text-sm text-ink/50">
                {formatDate(newer.start)} <ArrowRight className="size-4" />
              </span>
              <span className="line-clamp-2 text-lg tracking-[-0.02em] group-hover:text-navy">{t(newer.title, locale)}</span>
            </Link>
          )}
        </div>
      </nav>

      <section className="bg-white py-20 sm:py-24">
        <div className="container-x">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] tracking-[-0.03em]">{dict.news.more}</h2>
            <ArrowButton href={href(locale, "/news")} variant="outline" className="hidden sm:inline-flex">
              {dict.common.viewAll}
            </ArrowButton>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {more.map((m) => (
              <li key={m.slug}>
                <NewsCard p={m} locale={locale} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
