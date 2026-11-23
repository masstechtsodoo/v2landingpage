import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { ContactFormFromQuery } from "@/components/contact-form-query";
import { ContactInfo } from "@/components/contact-section";
import { PageHero } from "@/components/page-hero";
import { ArrowButton } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { href, t, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return pageMeta(locale, "/contact", dict.contact.label, dict.contact.text);
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t(site.legalName, locale),
    url: site.url,
    email: site.email,
    telephone: site.phone,
    foundingDate: String(site.foundedYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Soyombo Tower, 1st Khoroo",
      addressLocality: "Ulaanbaatar",
      addressRegion: "Sukhbaatar District",
      postalCode: "14251",
      addressCountry: "MN",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        label={dict.contact.label}
        title={dict.contact.title}
        text={dict.contact.text}
        crumbs={[{ label: dict.nav.home, href: href(locale) }, { label: dict.nav.contact }]}
      />
      <section className="bg-paper pb-24 sm:pb-32">
        <div className="container-x grid gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <div className="rounded-[var(--radius-card)] bg-white px-6 py-2 sm:px-8">
              <ContactInfo locale={locale} dict={dict} />
            </div>
            <div className="relative min-h-72 flex-1 overflow-hidden rounded-[var(--radius-card)] bg-paper-2">
              <iframe
                title={t(site.address, locale)}
                src={site.mapEmbed}
                className="absolute inset-0 size-full grayscale-[0.4]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute bottom-4 left-4">
                <ArrowButton href={site.mapLink} external variant="light">
                  {dict.contact.openMap}
                </ArrowButton>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Suspense fallback={<ContactForm dict={dict.contact.form} email={site.email} className="h-full" />}>
              <ContactFormFromQuery dict={dict.contact.form} email={site.email} className="h-full" />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
