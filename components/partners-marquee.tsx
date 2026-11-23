import Image from "next/image";
import { partners } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Infinite, pausable logo strip. Add logos in lib/site.ts → partners. */
export function PartnersMarquee({ label, className }: { label: string; className?: string }) {
  // Repeat so one half always fills wide screens; the animation shifts by exactly 50%.
  const base = partners.length < 8 ? [...partners, ...partners] : partners;
  const items = [...base, ...base];

  return (
    <section className={cn("border-b border-ink/10 bg-paper", className)} aria-label={label}>
      <div className="container-x flex flex-col gap-6 py-10 md:flex-row md:items-center md:gap-10 md:py-12">
        <p className="shrink-0 text-[0.95rem] text-ink/60 md:w-48">{label}</p>
        <div className="group relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ul className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
            {items.map((p, i) => (
              <li
                key={`${p.name}-${i}`}
                className="flex h-14 shrink-0 items-center px-8 sm:px-12"
                aria-hidden={i >= base.length ? true : undefined}
              >
                {p.logo ? (
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={160}
                    height={56}
                    className="h-9 w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-10"
                  />
                ) : (
                  <span className="text-[1.6rem] font-semibold tracking-[-0.04em] whitespace-nowrap text-ink/35 transition-colors hover:text-ink sm:text-[1.9rem]">
                    {p.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
