export const locales = ["mn", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "mn";

export type L10n<T = string> = Record<Locale, T>;

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Build a locale-prefixed path: href("en", "/products") -> "/en/products" */
export function href(locale: Locale, path = "/") {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export function t<T>(value: L10n<T>, locale: Locale): T {
  return value[locale] ?? value[defaultLocale];
}

/** "2024-06-05" -> "2024.06.05" */
export function formatDate(iso: string) {
  return iso.replaceAll("-", ".");
}

export function formatMonthYear(iso: string, locale: Locale) {
  const [y, m] = iso.split("-").map(Number);
  if (locale === "mn") return `${y} оны ${m}-р сар`;
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
