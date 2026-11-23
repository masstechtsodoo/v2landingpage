import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandBackdrop } from "@/components/brand-backdrop";
import { ArrowButton } from "@/components/ui";
import { href, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { imagery } from "@/lib/site";

function StatNumber({ value, suffix }: { value: string; suffix: string }) {
  return (
    <span className="text-[clamp(2.75rem,5vw,4.25rem)] leading-none font-normal tracking-[-0.05em]">
      {value}
      {suffix && <span className="text-accent">{suffix}</span>}
    </span>
  );
}

export function HomeHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home.hero;
  const [years, partners, brands, systems] = dict.home.stats;

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white">
      {imagery.homeHero ? (
        <>
          <Image src={imagery.homeHero} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        </>
      ) : (
        <BrandBackdrop className="-z-10" />
      )}

      <div className="container-x flex flex-1 flex-col justify-end pt-36 pb-8 sm:pb-12 lg:pt-44">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Copy */}
          <div className="lg:col-span-7 xl:col-span-7">
            <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.85rem] text-white/85">
              <span className="size-1.5 rounded-full bg-accent" />
              {h.eyebrow}
            </p>
            <h1 className="display mt-6 text-[clamp(2.6rem,6.4vw,6rem)]">{h.title}</h1>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/75 sm:text-lg">{h.text}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <ArrowButton href={href(locale, "/about")} size="lg">
                {h.primary}
              </ArrowButton>
              <Link
                href={href(locale, "/products")}
                className="group inline-flex items-center gap-1.5 text-[0.95rem] text-white/85 underline decoration-white/30 underline-offset-[6px] transition-colors hover:text-white hover:decoration-accent"
              >
                {h.secondary}
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:col-span-5 xl:col-span-4 xl:col-start-9">
            <Link
              href={href(locale, "/news")}
              className="glass group col-span-2 flex gap-4 rounded-[1rem] p-3 transition-colors hover:bg-white/15"
            >
              <div className="relative aspect-[4/3] w-[46%] shrink-0 overflow-hidden rounded-[0.7rem]">
                <Image
                  src={imagery.heroCard}
                  alt={systems.label}
                  fill
                  sizes="(min-width: 1024px) 200px, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute right-2 bottom-2 grid size-8 place-items-center rounded-[0.45rem] bg-white text-ink">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <div className="flex flex-1 flex-col items-end justify-between py-1 pr-2 text-right">
                <span className="text-[0.95rem] leading-tight text-white/85">{systems.label}</span>
                <StatNumber value={systems.value} suffix={systems.suffix} />
              </div>
            </Link>
            {[partners, brands].map((s) => (
              <div key={s.label} className="glass flex min-h-36 flex-col items-end justify-between rounded-[1rem] p-4 text-right sm:min-h-40">
                <span className="text-[0.9rem] leading-tight text-white/85">{s.label}</span>
                <StatNumber value={s.value} suffix={s.suffix} />
              </div>
            ))}
            <p className="col-span-2 flex items-center justify-end gap-2 text-sm text-white/55">
              <span className="text-white">{years.value}</span> {years.label.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
