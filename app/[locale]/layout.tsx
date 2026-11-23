import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Note: no `dynamicParams = false` here – with on-demand revalidation (admin edits) it makes Next 15
// return 404 for revalidated pages. Unknown locales are rejected below with notFound() instead.

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s — Mass Tech` },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { mn: "/mn", en: "/en" },
    },
    openGraph: {
      type: "website",
      siteName: "Mass Tech",
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "mn" ? "mn_MN" : "en_US",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b1828",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal styles only when JS runs */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SiteHeader locale={locale} nav={dict.nav} categories={dict.categories} />
        <main>{children}</main>
        <SiteFooter locale={locale} dict={dict} />
      </body>
    </html>
  );
}
