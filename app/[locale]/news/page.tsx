import type { Metadata } from "next";
import { NewsCard } from "@/components/news-card";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/reveal";
import { getProjects } from "@/lib/content";
import { getDictionary } from "@/lib/dictionaries";
import { href, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return pageMeta(locale, "/news", dict.news.label, dict.news.text);
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const projects = await getProjects();
  if (projects.length === 0) return null;
  // Lead with the most recent project that has photos
  const lead = projects.find((p) => p.cover) ?? projects[0];
  const rest = projects.filter((p) => p !== lead);

  return (
    <>
      <PageHero
        label={dict.news.label}
        title={dict.news.title}
        text={dict.news.text}
        crumbs={[{ label: dict.nav.home, href: href(locale) }, { label: dict.nav.news }]}
      />
      <section className="bg-paper pb-24 sm:pb-32">
        <div className="container-x">
          <Reveal>
            <NewsCard p={lead} locale={locale} featured badge={dict.news.latest} />
          </Reveal>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {rest.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={(i % 3) * 80}>
                <NewsCard p={p} locale={locale} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
