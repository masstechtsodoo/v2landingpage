import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

/** Per-page metadata with correct canonical + hreflang alternates. */
export function pageMeta(locale: Locale, path: string, title: string, description?: string, image?: string): Metadata {
  const p = path === "/" ? "" : path;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${p}`,
      languages: { mn: `/mn${p}`, en: `/en${p}` },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${p}`,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}
