import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Wrench,
  MapPinned,
  GraduationCap,
  Trophy,
  Timer,
  Radiation,
  Stethoscope,
  SunMedium,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { BrandBackdrop } from "@/components/brand-backdrop";
import { ArrowButton, MetaItem, SectionLabel } from "@/components/ui";
import { href, t, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { imagery } from "@/lib/site";
import { categories, getProducts, getProjects, type CategorySlug } from "@/lib/content";
import { cn } from "@/lib/utils";

const catIcon: Record<CategorySlug, typeof Radiation> = {
  radiation: Radiation,
  medical: Stethoscope,
  energy: SunMedium,
};

const catTint: Record<CategorySlug, string> = {
  radiation: "from-[#1d324f] via-[#16283f] to-[#0b1828]",
  medical: "from-[#1f4a5a] via-[#15303f] to-[#0b1828]",
  energy: "from-[#3b4a2a] via-[#1c2a2a] to-[#0b1828]",
};

/* ------------------------------------------------------------------ */
export async function CoreAreas({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.home.core;
  const products = await getProducts();
  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionLabel>{c.label}</SectionLabel>
            <h2 className="display mt-5 text-[clamp(2.25rem,4.6vw,4.25rem)]">{c.title}</h2>
          </Reveal>
          <Reveal delay={120} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-relaxed text-muted">{c.text}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
          {categories.map((slug, i) => {
            const Icon = catIcon[slug];
            const img = imagery.coreAreas[slug];
            const count = products.filter((p) => p.category === slug).length;
            return (
              <Reveal key={slug} delay={i * 110}>
                <Link
                  href={`${href(locale, "/products")}?category=${slug}`}
                  className="group relative isolate flex aspect-[4/5] flex-col overflow-hidden rounded-[var(--radius-card)] p-6 text-white sm:p-7 md:aspect-[3/4] lg:aspect-[4/5]"
                >
                  {img ? (
                    <>
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
                    </>
                  ) : (
                    <div className={cn("grain absolute inset-0 -z-10 bg-gradient-to-br", catTint[slug])}>
                      <Icon
                        aria-hidden
                        strokeWidth={0.6}
                        className="absolute -top-6 -right-10 size-[18rem] text-white/[0.07] transition-transform duration-700 group-hover:scale-105 group-hover:rotate-6"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <span className="grid size-12 place-items-center rounded-[0.7rem] bg-accent text-ink">
                      <Icon className="size-6" strokeWidth={1.6} />
                    </span>
                    <span className="text-sm text-white/60">0{i + 1}</span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-[1.7rem] leading-[1.1] tracking-[-0.03em] text-balance">
                      {dict.categories[slug].title}
                    </h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-white/70">{dict.categories[slug].text}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">
                      <span className="text-sm text-white/60">
                        {count} {dict.common.products}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-[0.55rem] bg-white/10 px-3 py-2 text-sm backdrop-blur transition-colors group-hover:bg-accent group-hover:text-ink">
                        {dict.common.viewProducts}
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
export function Trusted({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const tr = dict.home.trusted;
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <SectionLabel>{tr.label}</SectionLabel>
          <h2 className="display mt-5 text-[clamp(2.25rem,4.6vw,4.25rem)]">{tr.title}</h2>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">{tr.text}</p>
          <div className="mt-9">
            <ArrowButton href={href(locale, "/about")} variant="dark">
              {dict.nav.about}
            </ArrowButton>
          </div>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal delay={100}>
            <p className="text-sm text-ink/50">{dict.about.flowLabel}</p>
            <p className="mt-1 text-2xl tracking-[-0.03em]">{dict.about.flowTitle}</p>
          </Reveal>
          <ol className="mt-8">
            {dict.about.flow.map((step, i) => (
              <Reveal as="li" key={step.title} delay={150 + i * 90} className="relative">
                <div className="dashed-line text-ink/25" />
                <div className="flex gap-6 py-7">
                  <span className="text-[2.5rem] leading-none font-light tracking-[-0.05em] text-ink/25">0{i + 1}</span>
                  <div>
                    <h3 className="text-xl tracking-[-0.02em]">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <div className="dashed-line text-ink/25" />
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
const whyIcons = [BadgeCheck, Wrench, MapPinned, GraduationCap, Trophy, Timer];

export function WhyChoose({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const w = dict.home.why;
  return (
    <section className="relative isolate overflow-hidden py-24 text-white sm:py-32">
      {imagery.whyChoose ? (
        <>
          <Image src={imagery.whyChoose} alt="" fill sizes="100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(11_24_40/0.92)_0%,rgb(11_24_40/0.75)_45%,rgb(11_24_40/0.35)_100%)]" />
        </>
      ) : (
        <BrandBackdrop className="-z-10" />
      )}

      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionLabel tone="light">{w.label}</SectionLabel>
          <h2 className="display mt-5 text-[clamp(2.25rem,4.6vw,4.25rem)]">{w.title}</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">{w.text}</p>
          <div className="mt-9">
            <ArrowButton href={href(locale, "/contact")} size="lg">
              {w.cta}
            </ArrowButton>
          </div>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-7">
          <div className="rounded-[var(--radius-card)] bg-white p-6 text-ink shadow-2xl sm:p-9">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-2xl tracking-[-0.03em] sm:text-[1.75rem]">{w.cardTitle}</h3>
              <span className="text-[0.95rem] text-ink/70">{w.cardMeta}</span>
            </div>
            <div className="dashed-line mt-6 text-ink/30" />
            <ul className="grid gap-x-8 gap-y-7 py-8 sm:grid-cols-2">
              {w.items.map((item, i) => {
                const Icon = whyIcons[i];
                return (
                  <li key={item.title} className="flex gap-4">
                    <span
                      className={cn(
                        "grid size-11 shrink-0 place-items-center rounded-[0.6rem] border",
                        i === 0 ? "border-accent bg-accent" : "border-ink/15",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-[1.05rem] leading-snug tracking-[-0.02em]">{item.title}</p>
                      <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{item.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="dashed-line text-ink/30" />
            <div className="mt-6 grid grid-cols-3 gap-4">
              {w.footer.map((f) => (
                <MetaItem key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
// Home project cards → photo + linked project (matched by slug prefix; falls back to /news)
const featured = [
  { photo: "/images/projects/p07-3.webp", slug: "07-" },
  { photo: "/images/projects/p08-2.webp", slug: "08-" },
  { photo: "/images/projects/p05-6.webp", slug: "05-" },
  { photo: "/images/projects/p09-6.webp", slug: "09-" },
  { photo: null, slug: "12-" },
];

function ProjectTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center gap-3 self-start rounded-[0.6rem] bg-accent py-1 pr-1 pl-3.5 text-[0.92rem] text-ink shadow-lg">
      <span className="line-clamp-1">{children}</span>
      <span className="grid size-8 shrink-0 place-items-center rounded-[0.45rem] bg-white">
        <ArrowUpRight className="size-4" />
      </span>
    </span>
  );
}

export async function ProjectsBento({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const p = dict.home.projects;
  const projects = await getProjects();
  const cards = p.items.map((item, i) => {
    const proj = projects.find((x) => x.slug.startsWith(featured[i].slug));
    return {
      ...item,
      photo: featured[i].photo,
      link: proj ? href(locale, `/news/${proj.slug}`) : href(locale, "/news"),
      client: item.client || (proj ? t(proj.client, locale) : ""),
    };
  });
  const [customs, baggage, radiation, neusoft, lab] = cards;

  const PhotoCard = ({
    c,
    className,
    sizes,
    big,
  }: {
    c: (typeof cards)[number];
    className?: string;
    sizes: string;
    big?: boolean;
  }) => (
    <Link
      href={c.link}
      className={cn("group shard-overlay relative isolate block overflow-hidden rounded-[var(--radius-card)] bg-navy", className)}
    >
      {c.photo && (
        <Image
          src={c.photo}
          alt={c.title}
          fill
          sizes={sizes}
          className="-z-10 object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/55 via-transparent to-ink/40" />
      {big ? (
        <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white sm:p-9">
          <div className="grid gap-4 md:grid-cols-2">
            <h3 className="text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.08] tracking-[-0.03em]">{c.title}</h3>
            <p className="max-w-sm text-[0.98rem] leading-relaxed text-white/85 md:justify-self-end">{c.text}</p>
          </div>
          <div className="flex justify-end">
            <ProjectTag>{c.client || c.title}</ProjectTag>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
          <ProjectTag>{c.title}</ProjectTag>
        </div>
      )}
    </Link>
  );

  return (
    <section className="bg-paper py-24 sm:py-32">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionLabel>{p.label}</SectionLabel>
          </Reveal>
          <Reveal delay={80} className="lg:col-span-7 lg:col-start-6">
            <h2 className="display text-[clamp(2.25rem,4.6vw,4.25rem)]">{p.title}</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{p.text}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-5">
            <Reveal>
              <PhotoCard c={customs} className="aspect-[4/3] lg:aspect-[16/11]" sizes="(min-width: 1024px) 40vw, 50vw" />
            </Reveal>
            <Reveal delay={100}>
              <PhotoCard c={baggage} className="aspect-[4/3] lg:aspect-[16/11]" sizes="(min-width: 1024px) 40vw, 50vw" />
            </Reveal>
          </div>
          <Reveal delay={150} className="lg:col-span-7">
            <PhotoCard c={neusoft} big className="aspect-[4/5] h-full sm:aspect-[16/11] lg:aspect-auto" sizes="(min-width: 1024px) 58vw, 100vw" />
          </Reveal>

          <Reveal className="lg:col-span-5">
            <PhotoCard c={radiation} className="aspect-[4/3] lg:aspect-[16/11]" sizes="(min-width: 1024px) 40vw, 100vw" />
          </Reveal>
          <Reveal delay={100} className="lg:col-span-7">
            <div className="flex h-full flex-col justify-between gap-10 rounded-[var(--radius-card)] bg-ink p-7 text-white sm:p-9">
              <div>
                <p className="text-sm text-white/50">0{cards.length}</p>
                <Link href={lab.link} className="group mt-3 block">
                  <h3 className="text-[1.75rem] leading-[1.1] tracking-[-0.03em] group-hover:text-accent">{lab.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/65">{lab.text}</p>
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <span className="text-white/60">
                  {projects.length} {dict.common.projects}
                </span>
                <ArrowButton href={href(locale, "/news")}>{p.cta}</ArrowButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
