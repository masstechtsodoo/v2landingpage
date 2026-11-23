/**
 * Site-wide settings. Edit this file to change contact details, partners and imagery.
 */

export const site = {
  name: "Mass Tech",
  legalName: { en: "Mass Tech LLC", mn: "“Масс Теч” ХХК" },
  url: "https://www.masstech.mn", // primary domain on Vercel
  email: "info@masstech.mn",
  phone: "+976 7505 5775",
  phoneHref: "tel:+97675055775",
  address: {
    en: "Soyombo Tower, 1st Khoroo, Sukhbaatar District, Ulaanbaatar 14251, Mongolia",
    mn: "Монгол Улс, Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Соёмбо тауэр 14251",
  },
  mapEmbed: "https://www.google.com/maps?q=Soyombo+Tower+Ulaanbaatar&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=Soyombo+Tower+Ulaanbaatar",
  foundedYear: 2017,
};

/**
 * Hero / section imagery.
 * Drop files into /public/images and set the path here. While a value is `null`
 * the section shows a branded gradient instead of a photo.
 */
export const imagery = {
  homeHero: null as string | null, // e.g. "/images/hero.jpg" (min 2400px wide)
  whyChoose: "/images/projects/p03-8.webp" as string | null, // real project photo for now
  aboutHero: null as string | null, // e.g. "/images/about.jpg"
  coreAreas: {
    radiation: null as string | null, // e.g. "/images/core-radiation.jpg"
    medical: null as string | null,
    energy: null as string | null,
  },
  // Thumbnail inside the hero stat card – uses a real project photo for now.
  heroCard: "/images/projects/p10-2.webp",
};

/**
 * Partner logos for the scrolling strip.
 * Put logo files (SVG or transparent PNG) in /public/partners and set `logo`.
 * Without a logo the partner name is shown as text.
 * NOTE: list is based on manufacturers named in the product catalogue – confirm with Mass Tech.
 */
export const partners: { name: string; logo?: string; url?: string }[] = [
  { name: "NUCTECH" },
  { name: "Neusoft Medical" },
  { name: "ECOTEST" },
  { name: "LinaTech" },
  { name: "KSTAR" },
  { name: "Drawell" },
];