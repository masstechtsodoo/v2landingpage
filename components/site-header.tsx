"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ChevronDown, Menu, X, Radiation, Stethoscope, SunMedium, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui";
import { href, locales, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

type Props = {
  locale: Locale;
  nav: Dictionary["nav"];
  categories: Dictionary["categories"];
};

const catIcons = { radiation: Radiation, medical: Stethoscope, energy: SunMedium } as const;

function LanguageSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const search = useSearchParams();
  const rest = pathname.split("/").slice(2).join("/");
  const qs = search.toString();

  return (
    <div className={cn("flex rounded-[0.55rem] bg-white/10 p-0.5 text-[0.8rem] font-medium", className)}>
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest ? `/${rest}` : ""}${qs ? `?${qs}` : ""}`}
          onClick={() => {
            document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
          }}
          aria-current={l === locale ? "true" : undefined}
          className={cn(
            "rounded-[0.45rem] px-2.5 py-1.5 uppercase transition-colors",
            l === locale ? "bg-white text-ink" : "text-white/70 hover:text-white",
          )}
          hrefLang={l}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

export function SiteHeader({ locale, nav, categories }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { key: "home", label: nav.home, path: "/" },
    { key: "products", label: nav.products, path: "/products" },
    { key: "news", label: nav.news, path: "/news" },
    { key: "contact", label: nav.contact, path: "/contact" },
  ] as const;

  // Pages with a dark hero get a translucent bar at the top; light pages get a solid one.
  const darkHero = pathname === href(locale) || pathname === href(locale, "/about");

  const isActive = (path: string) => {
    const full = href(locale, path);
    return path === "/" ? pathname === full : pathname.startsWith(full);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <div
        className={cn(
          "mx-auto max-w-[72rem] rounded-[0.9rem] border text-white transition-[background-color,border-color,box-shadow] duration-500",
          scrolled || open || !darkHero
            ? "border-white/10 bg-ink/90 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.45)] backdrop-blur-xl"
            : "border-white/15 bg-ink/35 backdrop-blur-lg",
        )}
      >
        <nav className="flex items-center gap-3 p-2 pl-3 sm:pl-4" aria-label="Main">
          <Link href={href(locale)} className="mr-auto shrink-0 py-1" aria-label="Mass Tech">
            <Logo />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1.5 lg:flex">
            {links.map((l) =>
              l.key === "products" ? (
                <li key={l.key} className="group relative">
                  <Link
                    href={href(locale, l.path)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-[0.6rem] px-4 py-2.5 text-[0.95rem] transition-colors",
                      isActive(l.path) ? "bg-white/20 text-white" : "bg-white/[0.07] text-white/85 hover:bg-white/15",
                    )}
                  >
                    {l.label}
                    <ChevronDown className="size-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                  </Link>
                  <div className="invisible absolute top-full left-1/2 w-[25rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="rounded-[0.9rem] border border-white/10 bg-ink/95 p-2 shadow-2xl backdrop-blur-xl">
                      {(Object.keys(categories) as (keyof typeof categories)[]).map((c) => {
                        const Icon = catIcons[c];
                        return (
                          <Link
                            key={c}
                            href={`${href(locale, "/products")}?category=${c}`}
                            className="flex gap-3 rounded-[0.65rem] p-3 transition-colors hover:bg-white/10"
                          >
                            <span className="grid size-10 shrink-0 place-items-center rounded-[0.55rem] bg-accent text-ink">
                              <Icon className="size-5" strokeWidth={1.75} />
                            </span>
                            <span>
                              <span className="block text-[0.95rem] text-white">{categories[c].title}</span>
                              <span className="mt-0.5 line-clamp-2 block text-[0.8rem] leading-snug text-white/55">
                                {categories[c].text}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={l.key}>
                  <Link
                    href={href(locale, l.path)}
                    className={cn(
                      "block rounded-[0.6rem] px-4 py-2.5 text-[0.95rem] transition-colors",
                      isActive(l.path) ? "bg-white/20 text-white" : "bg-white/[0.07] text-white/85 hover:bg-white/15",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <Suspense fallback={<div className="hidden w-[5.5rem] sm:block" />}>
            <LanguageSwitch locale={locale} className="hidden sm:flex lg:ml-3" />
          </Suspense>

          <Link
            href={href(locale, "/contact")}
            className="hidden rounded-[0.6rem] bg-accent px-5 py-2.5 text-[0.95rem] font-medium text-ink transition-colors hover:bg-accent-strong md:block"
          >
            {nav.cta}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-[0.6rem] bg-white/10 transition-colors hover:bg-white/20 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? nav.close : nav.menu}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-out lg:hidden",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-white/10 px-3 pt-3 pb-4">
              <ul className="space-y-1">
                {links.map((l) => (
                  <li key={l.key}>
                    <Link
                      href={href(locale, l.path)}
                      className={cn(
                        "flex items-center justify-between rounded-[0.65rem] px-4 py-3.5 text-lg tracking-[-0.02em]",
                        isActive(l.path) ? "bg-white/15" : "hover:bg-white/10",
                      )}
                    >
                      {l.label}
                      <ArrowUpRight className="size-4 text-white/50" />
                    </Link>
                    {l.key === "products" && (
                      <ul className="mt-1 mb-2 ml-4 space-y-0.5 border-l border-white/10 pl-3">
                        {(Object.keys(categories) as (keyof typeof categories)[]).map((c) => (
                          <li key={c}>
                            <Link
                              href={`${href(locale, "/products")}?category=${c}`}
                              className="block rounded-[0.5rem] px-3 py-2 text-[0.95rem] text-white/65 hover:bg-white/10 hover:text-white"
                            >
                              {categories[c].title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <Suspense>
                  <LanguageSwitch locale={locale} />
                </Suspense>
                <Link
                  href={href(locale, "/contact")}
                  className="rounded-[0.6rem] bg-accent px-5 py-2.5 font-medium text-ink"
                >
                  {nav.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
