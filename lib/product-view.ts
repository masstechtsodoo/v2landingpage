import { excerpt, groups, modelCode, type Product } from "@/lib/content";
import type { Dictionary } from "@/lib/dictionaries";
import { href, t, type Locale } from "@/lib/i18n";
import type { ProductCardData } from "@/components/product-card";

/** Localized, serializable card data for a product. */
export function toCard(p: Product, locale: Locale, dict: Dictionary): ProductCardData {
  const name = t(p.name, locale);
  return {
    slug: p.slug,
    href: href(locale, `/products/${p.slug}`),
    category: p.category,
    name,
    code: modelCode(p.name.en),
    excerpt: excerpt(t(p.overview, locale), 160),
    tag: p.group ? t(groups[p.group], locale) : dict.categories[p.category].title,
    image: p.image,
  };
}
