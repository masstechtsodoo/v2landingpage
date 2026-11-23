import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/page-hero";
import { ProductCard } from "@/components/product-card";
import { ProductVisual } from "@/components/product-visual";
import { FeatureList, RichParagraphs } from "@/components/rich-lines";
import { Reveal } from "@/components/reveal";
import { ArrowButton, SectionLabel } from "@/components/ui";
import { excerpt, getProducts, groups, modelCode } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { href, t, type Locale } from "@/lib/i18n";
import { toCard } from "@/lib/product-view";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// New products added in the admin panel are rendered on first visit, then cached.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = (await getProducts()).find((x) => x.slug === slug);
  if (!p) return {};
  return pageMeta(locale, `/products/${slug}`, t(p.name, locale), excerpt(t(p.overview, locale), 160), p.image ?? undefined);
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const products = await getProducts();
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const dict = getDictionary(locale);
  const name = t(p.name, locale);
  const overview = t(p.overview, locale);
  const features = t(p.features, locale);
  const catTitle = dict.categories[p.category].title;
  const groupTitle = p.group ? t(groups[p.group], locale) : null;

  const related = products
    .filter((r) => r.slug !== p.slug && (p.group ? r.group === p.group : r.category === p.category))
    .slice(0, 4);

  const productsHref = href(locale, "/products");
  const catHref = `${productsHref}?category=${p.category}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: excerpt(overview, 300),
    category: groupTitle ?? catTitle,
    ...(p.image ? { image: `${site.url}${p.image}` } : {}),
    offers: { "@type": "Offer", seller: { "@type": "Organization", name: "Mass Tech LLC" } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-paper pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="container-x">
          <Breadcrumbs
            items={[
              { label: dict.nav.home, href: href(locale) },
              { label: dict.nav.products, href: productsHref },
              { label: catTitle, href: catHref },
              { label: name },
            ]}
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <div className="lg:sticky lg:top-32">
                <ProductVisual
                  image={p.image}
                  name={name}
                  code={modelCode(p.name.en)}
                  category={p.category}
                  comingLabel={dict.common.imageComing}
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  priority
                  large
                  className="aspect-square rounded-[var(--radius-card)] sm:aspect-[5/4] lg:aspect-square"
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="flex flex-wrap gap-2">
                <Link href={catHref} className="rounded-[0.5rem] bg-accent px-3 py-1.5 text-sm text-ink">
                  {catTitle}
                </Link>
                {groupTitle && (
                  <Link
                    href={`${productsHref}?category=radiation&group=${p.group}`}
                    className="rounded-[0.5rem] border border-ink/15 bg-white px-3 py-1.5 text-sm text-ink/75 hover:border-ink/35"
                  >
                    {groupTitle}
                  </Link>
                )}
              </div>
              <h1 className="mt-6 text-[clamp(2rem,3.8vw,3.25rem)] leading-[1.05] tracking-[-0.035em] text-balance">{name}</h1>

              <div className="mt-10">
                <p className="text-sm text-ink/50">{dict.common.overview}</p>
                <div className="dashed-line mt-3 text-ink/25" />
                <RichParagraphs lines={overview} className="mt-6 text-[1.05rem] leading-relaxed text-ink/80" />
              </div>

              <div className="mt-10 rounded-[var(--radius-card)] bg-ink p-6 text-white sm:p-8">
                <p className="text-lg leading-snug tracking-[-0.02em] text-white/90">{dict.products.quoteText}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <ArrowButton href={`${href(locale, "/contact")}?product=${encodeURIComponent(name)}`}>
                    {dict.common.requestQuote}
                  </ArrowButton>
                  <a href={site.phoneHref} className="text-white/75 underline underline-offset-4 hover:text-white">
                    {site.phone}
                  </a>
                </div>
              </div>

              {features.length > 0 && (
                <div className="mt-12">
                  <p className="text-sm text-ink/50">{dict.common.features}</p>
                  <div className="dashed-line mt-3 text-ink/25" />
                  <FeatureList lines={features} className="mt-2 md:grid-cols-1" />
                </div>
              )}

              <Link href={catHref} className="mt-10 inline-flex items-center gap-2 text-ink/60 hover:text-ink">
                <ArrowLeft className="size-4" />
                {dict.common.allProducts}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-ink/10 bg-white py-20 sm:py-24">
          <div className="container-x">
            <div className="flex items-end justify-between gap-6">
              <div>
                <SectionLabel>{groupTitle ?? catTitle}</SectionLabel>
                <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] tracking-[-0.03em]">{dict.common.related}</h2>
              </div>
              <ArrowButton href={catHref} variant="outline" className="hidden sm:inline-flex">
                {dict.common.viewAll}
              </ArrowButton>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {related.map((r, i) => (
                <Reveal as="li" key={r.slug} delay={i * 80}>
                  <ProductCard item={toCard(r, locale, dict)} comingLabel={dict.common.imageComing} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
