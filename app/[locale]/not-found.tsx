"use client";

import { usePathname } from "next/navigation";
import { ArrowButton } from "@/components/ui";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";

export default function NotFound() {
  const seg = usePathname()?.split("/")[1];
  const locale = isLocale(seg) ? seg : defaultLocale;
  const d = getDictionary(locale).notFound;
  return (
    <section className="flex min-h-[80vh] items-center bg-paper pt-32 pb-20">
      <div className="container-x">
        <p className="text-[clamp(5rem,16vw,12rem)] leading-none font-light tracking-[-0.06em] text-ink/15">404</p>
        <h1 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] tracking-[-0.03em]">{d.title}</h1>
        <p className="mt-4 max-w-md text-lg text-muted">{d.text}</p>
        <div className="mt-8">
          <ArrowButton href={`/${locale}`}>{d.home}</ArrowButton>
        </div>
      </div>
    </section>
  );
}
