import type { Metadata } from "next";
import { HomeHero } from "@/components/home/hero";
import { CoreAreas, ProjectsBento, Trusted, WhyChoose } from "@/components/home/sections";
import { PartnersMarquee } from "@/components/partners-marquee";
import { ContactSection } from "@/components/contact-section";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return { ...pageMeta(locale, "/", dict.meta.title, dict.meta.description), title: { absolute: dict.meta.title } };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <>
      <HomeHero locale={locale} dict={dict} />
      <PartnersMarquee label={dict.home.partners} />
      <CoreAreas locale={locale} dict={dict} />
      <Trusted locale={locale} dict={dict} />
      <WhyChoose locale={locale} dict={dict} />
      <ProjectsBento locale={locale} dict={dict} />
      <ContactSection locale={locale} dict={dict} />
    </>
  );
}
