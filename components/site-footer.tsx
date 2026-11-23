import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui";
import { href, t, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { site } from "@/lib/site";

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const nav = [
    { label: dict.nav.home, path: "/" },
    { label: dict.nav.about, path: "/about" },
    { label: dict.nav.products, path: "/products" },
    { label: dict.nav.news, path: "/news" },
    { label: dict.nav.contact, path: "/contact" },
  ];
  const cats = Object.entries(dict.categories) as [string, { title: string }][];

  return (
    <footer className="grain relative overflow-hidden bg-ink text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 size-[36rem] rounded-full bg-navy/60 blur-3xl"
      />
      <div className="container-x relative pt-20 pb-10 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-white/60">{dict.footer.tagline}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <p className="text-sm text-white/45">{dict.footer.navigate}</p>
              <ul className="mt-4 space-y-2.5">
                {nav.map((n) => (
                  <li key={n.path}>
                    <Link href={href(locale, n.path)} className="text-white/85 transition-colors hover:text-accent">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-white/45">{dict.footer.productsTitle}</p>
              <ul className="mt-4 space-y-2.5">
                {cats.map(([slug, c]) => (
                  <li key={slug}>
                    <Link
                      href={`${href(locale, "/products")}?category=${slug}`}
                      className="text-white/85 transition-colors hover:text-accent"
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-white/45">{dict.footer.contactTitle}</p>
              <ul className="mt-4 space-y-3.5 text-[0.95rem] text-white/85">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                  <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    {t(site.address, locale)}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                  <a href={site.phoneHref} className="hover:text-accent">
                    {site.phone}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                  <a href={`mailto:${site.email}`} className="hover:text-accent">
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-20 text-[clamp(4rem,17vw,15rem)] leading-[0.8] font-medium tracking-[-0.06em] text-white/[0.06] select-none"
        >
          Mass Tech
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:justify-between">
          <p>
            © {year} {t(site.legalName, locale)}. {dict.footer.rights}
          </p>
          <p>masstech.mn</p>
        </div>
      </div>
    </footer>
  );
}
