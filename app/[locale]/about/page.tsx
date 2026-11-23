import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Target } from "lucide-react";
import { BrandBackdrop } from "@/components/brand-backdrop";
import { Breadcrumbs } from "@/components/page-hero";
import { PartnersMarquee } from "@/components/partners-marquee";
import { Reveal } from "@/components/reveal";
import { ContactSection } from "@/components/contact-section";
import { ArrowButton, Chip, MetaItem, SectionLabel } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { href, type Locale } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { imagery } from "@/lib/site";
import { getProducts, getProjects } from "@/lib/content";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return pageMeta(locale, "/about", dict.about.label, dict.about.lead);
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const a = dict.about;
  const [products, projects] = await Promise.all([getProducts(), getProjects()]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink pt-32 pb-20 text-white sm:pt-40 sm:pb-28">
        {imagery.aboutHero ? (
          <>
            <Image src={imagery.aboutHero} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-ink/70" />
          </>
        ) : (
          <BrandBackdrop className="-z-10" />
        )}
        <div className="container-x">
          <Breadcrumbs tone="light" items={[{ label: dict.nav.home, href: href(locale) }, { label: a.label }]} />
          <div className="mt-12 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SectionLabel tone="light">{a.label}</SectionLabel>
              <h1 className="display mt-6 text-[clamp(2.6rem,6vw,5.5rem)]">{a.title}</h1>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">{a.lead}</p>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {dict.home.stats.map((s) => (
              <div key={s.label} className="glass rounded-[1rem] p-5">
                <p className="text-[clamp(2.25rem,4vw,3.5rem)] leading-none tracking-[-0.05em]">
                  {s.value}
                  <span className="text-accent">{s.suffix}</span>
                </p>
                <p className="mt-3 text-[0.9rem] leading-snug text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnersMarquee label={dict.home.partners} />

      {/* Story */}
      <section className="bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionLabel>{dict.home.trusted.label}</SectionLabel>
            <p className="mt-6 text-[2rem] leading-[1.1] tracking-[-0.03em]">{dict.home.trusted.title}</p>
          </Reveal>
          <div className="space-y-6 text-[1.1rem] leading-relaxed text-ink/75 lg:col-span-7 lg:col-start-6">
            {a.body.map((para, i) => (
              <Reveal key={i} delay={i * 80}>
                <p>{para}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision / Mission */}
      <section className="bg-white py-24 sm:py-32">
        <div className="container-x grid gap-5 md:grid-cols-2">
          {[
            { icon: Eye, title: a.visionTitle, text: a.vision, dark: true },
            { icon: Target, title: a.missionTitle, text: a.mission, dark: false },
          ].map(({ icon: Icon, title, text, dark }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div
                className={
                  dark
                    ? "flex h-full flex-col gap-12 rounded-[var(--radius-card)] bg-ink p-8 text-white sm:p-10"
                    : "flex h-full flex-col gap-12 rounded-[var(--radius-card)] bg-accent p-8 text-ink sm:p-10"
                }
              >
                <div className="flex items-center justify-between">
                  <p className={dark ? "text-white/60" : "text-ink/60"}>{title}</p>
                  <span className={dark ? "grid size-11 place-items-center rounded-[0.6rem] bg-white/10" : "grid size-11 place-items-center rounded-[0.6rem] bg-white/60"}>
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                </div>
                <p className="mt-auto text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.2] tracking-[-0.025em] text-balance">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values + Flow */}
      <section className="bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionLabel>{a.flowLabel}</SectionLabel>
            <h2 className="display mt-5 text-[clamp(2.25rem,4.6vw,4rem)]">{a.flowTitle}</h2>
            <ol className="mt-10">
              {a.flow.map((s, i) => (
                <li key={s.title}>
                  <div className="dashed-line text-ink/25" />
                  <div className="flex gap-6 py-6">
                    <span className="text-[2.25rem] leading-none font-light tracking-[-0.05em] text-ink/25">0{i + 1}</span>
                    <div>
                      <h3 className="text-xl tracking-[-0.02em]">{s.title}</h3>
                      <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
                    </div>
                  </div>
                </li>
              ))}
              <div className="dashed-line text-ink/25" />
            </ol>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-[var(--radius-card)] bg-white p-6 shadow-[0_30px_60px_-30px_rgb(11_24_40/0.25)] sm:p-9">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[1.75rem] tracking-[-0.03em]">{a.valuesTitle}</h3>
                <span className="text-ink/60">{a.values.length}</span>
              </div>
              <div className="dashed-line mt-6 text-ink/30" />
              <div className="flex flex-wrap gap-2.5 py-10">
                {a.values.map((v, i) => (
                  <Chip key={v} active={i === 0} className="px-4 py-3 text-base">
                    {v}
                  </Chip>
                ))}
              </div>
              <div className="dashed-line text-ink/30" />
              <div className="mt-6 grid grid-cols-3 gap-4">
                <MetaItem label={dict.home.why.footer[0].label} value="2017" />
                <MetaItem label={dict.nav.products} value={String(products.length)} />
                <MetaItem label={dict.nav.news} value={String(projects.length)} />
              </div>
              <div className="mt-8">
                <ArrowButton href={href(locale, "/products")} variant="dark">
                  {dict.common.viewProducts}
                </ArrowButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactSection locale={locale} dict={dict} />
    </>
  );
}
