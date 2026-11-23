import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { ProductBrowser, type BrowserItem } from "@/components/product-browser";
import { ProductCard } from "@/components/product-card";
import { categories, getProducts, groups, type GroupSlug } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { href, t, type Locale } from "@/lib/i18n";
import { toCard } from "@/lib/product-view";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return pageMeta(locale, "/products", dict.products.label, dict.products.text);
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const products = await getProducts();

  const items: BrowserItem[] = products.map((p) => ({
    ...toCard(p, locale, dict),
    group: p.group,
    search: [p.name.en, p.name.mn, ...p.overview[locale]].join(" ").toLowerCase(),
  }));

  const labels = {
    all: dict.products.all,
    search: dict.products.search,
    empty: dict.products.empty,
    count: dict.products.count,
    coming: dict.common.imageComing,
  };

  return (
    <>
      <PageHero
        label={dict.products.label}
        title={dict.products.title}
        text={dict.products.text}
        crumbs={[{ label: dict.nav.home, href: href(locale) }, { label: dict.nav.products }]}
      />
      <section className="bg-paper pb-24 sm:pb-32">
        <div className="container-x">
          <Suspense
            fallback={
              <ul className="mt-24 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                  <li key={item.slug}>
                    <ProductCard item={item} comingLabel={labels.coming} />
                  </li>
                ))}
              </ul>
            }
          >
            <ProductBrowser
              items={items}
              categories={categories.map((c) => ({ slug: c, title: dict.categories[c].title }))}
              groups={(Object.keys(groups) as GroupSlug[]).map((g) => ({ slug: g, title: t(groups[g], locale) }))}
              labels={labels}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
