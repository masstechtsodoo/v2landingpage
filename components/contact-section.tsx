import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/ui";
import { t, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { site } from "@/lib/site";

export function ContactInfo({ locale, dict, tone = "dark" }: { locale: Locale; dict: Dictionary; tone?: "dark" | "light" }) {
  const items = [
    { icon: MapPin, label: dict.contact.address, value: t(site.address, locale), href: site.mapLink, external: true },
    { icon: Phone, label: dict.contact.phone, value: site.phone, href: site.phoneHref },
    { icon: Mail, label: dict.contact.email, value: site.email, href: `mailto:${site.email}` },
  ];
  const light = tone === "light";
  return (
    <ul className={light ? "divide-y divide-white/10" : "divide-y divide-ink/10"}>
      {items.map(({ icon: Icon, ...it }) => (
        <li key={it.label}>
          <a
            href={it.href}
            {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-start gap-4 py-5"
          >
            <span
              className={
                light
                  ? "grid size-11 shrink-0 place-items-center rounded-[0.6rem] bg-white/10 text-accent"
                  : "grid size-11 shrink-0 place-items-center rounded-[0.6rem] bg-accent text-ink"
              }
            >
              <Icon className="size-5" strokeWidth={1.7} />
            </span>
            <span>
              <span className={light ? "block text-sm text-white/50" : "block text-sm text-ink/50"}>{it.label}</span>
              <span
                className={
                  light
                    ? "mt-0.5 block text-[1.05rem] text-white transition-colors group-hover:text-accent"
                    : "mt-0.5 block text-[1.05rem] text-ink transition-colors group-hover:text-navy group-hover:underline"
                }
              >
                {it.value}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Home page closing section – dark with form card */
export function ContactSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.home.contact;
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div aria-hidden className="absolute -bottom-40 -left-40 -z-10 size-[40rem] rounded-full bg-navy/70 blur-3xl" />
      <div aria-hidden className="absolute top-10 right-0 -z-10 size-[28rem] rounded-full bg-accent/[0.06] blur-3xl" />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionLabel tone="light">{c.label}</SectionLabel>
          <h2 className="display mt-5 text-[clamp(2.25rem,4.6vw,4.25rem)]">{c.title}</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">{c.text}</p>
          <div className="mt-8">
            <ContactInfo locale={locale} dict={dict} tone="light" />
          </div>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-7">
          <ContactForm dict={dict.contact.form} email={site.email} className="text-ink shadow-2xl" />
        </Reveal>
      </div>
    </section>
  );
}
