import type { MetadataRoute } from "next";
import { getProducts, getProjects } from "@/lib/content";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, projects] = await Promise.all([getProducts(), getProjects()]);
  const paths = [
    "",
    "/about",
    "/products",
    "/news",
    "/contact",
    ...products.map((p) => `/products/${p.slug}`),
    ...projects.map((p) => `/news/${p.slug}`),
  ];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}${path}`])) },
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.split("/").length > 2 ? 0.6 : 0.8,
    })),
  );
}
