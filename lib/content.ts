import fs from "node:fs";
import path from "node:path";
import productData from "@/content/products.json";
import projectData from "@/content/projects.json";
import type { L10n } from "@/lib/i18n";

/**
 * Content layer.
 * - With API_URL set (Render backend), products/projects come from the API and are cached
 *   with ISR; the admin panel revalidates the "products"/"projects" tags after every change.
 * - Without API_URL (or if the API cannot be reached during a build) the bundled JSON in /content is used.
 */

export type CategorySlug = "radiation" | "medical" | "energy";
export const categories: CategorySlug[] = ["radiation", "medical", "energy"];

export type GroupSlug = "baggage-parcel" | "personnel-screening" | "explosives-narcotics" | "radiation-dosimetry";

export type Product = {
  slug: string;
  category: CategorySlug;
  group: GroupSlug | null;
  name: L10n;
  overview: L10n<string[]>;
  features: L10n<string[]>;
  image: string | null;
};

export type Project = {
  slug: string;
  start: string;
  end: string | null;
  title: L10n;
  client: L10n;
  body: L10n<string[]>;
  images: string[];
  cover: string | null;
  coverWidth: number;
};

export const groups = productData.groups as Record<GroupSlug, L10n>;

/* ------------------------------------------------------------------ API */

type ApiImage = { url: string; publicId?: string | null; width?: number | null; height?: number | null } | null;
type ApiProduct = Omit<Product, "image"> & { image: ApiImage };
type ApiProject = {
  slug: string;
  startDate: string;
  endDate: string | null;
  title: L10n;
  client: L10n;
  body: L10n<string[]>;
  cover: ApiImage;
  images: NonNullable<ApiImage>[];
};

export const API_URL = process.env.API_URL?.replace(/\/+$/, "");
export const REVALIDATE_SECONDS = 300;
const isBuild = process.env.NEXT_PHASE === "phase-production-build";

async function apiGet<T>(pathname: string, tags: string[]): Promise<T> {
  let lastError: unknown;
  // Render's free plan sleeps; the first request can take ~50 s, so allow a generous timeout + one retry.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${API_URL}/v1${pathname}`, {
        next: { revalidate: REVALIDATE_SECONDS, tags },
        signal: AbortSignal.timeout(isBuild ? 70_000 : 20_000),
      });
      if (!res.ok) throw new Error(`API ${pathname} → ${res.status}`);
      return (await res.json()) as T;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}

/* ------------------------------------------------------------ fallback */

const IMAGE_EXT = ["webp", "jpg", "jpeg", "png", "avif"];
const productImageDir = path.join(process.cwd(), "public", "images", "products");

/** Local image in /public/images/products/<slug>.* (used when no uploaded image exists). */
function localProductImage(slug: string): string | null {
  for (const ext of IMAGE_EXT) {
    if (fs.existsSync(path.join(productImageDir, `${slug}.${ext}`))) return `/images/products/${slug}.${ext}`;
  }
  return null;
}

const fallbackProducts = (): Product[] =>
  (productData.products as Omit<Product, "image">[]).map((p) => ({ ...p, image: localProductImage(p.slug) }));

const fallbackProjects = (): Project[] =>
  [...(projectData as Project[])].sort((a, b) => b.start.localeCompare(a.start));

/* -------------------------------------------------------------- public */

export async function getProducts(): Promise<Product[]> {
  if (!API_URL) return fallbackProducts();
  try {
    const data = await apiGet<{ items: ApiProduct[] }>("/products", ["products"]);
    return data.items.map((p) => ({ ...p, image: p.image?.url ?? localProductImage(p.slug) }));
  } catch (e) {
    // During a build we would rather ship the bundled content than fail the deploy.
    // At runtime, throwing keeps the previously generated page (ISR) instead of showing stale JSON.
    if (isBuild) {
      console.warn("⚠️  API unavailable during build – using bundled products.json", e);
      return fallbackProducts();
    }
    throw e;
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!API_URL) return fallbackProjects();
  try {
    const data = await apiGet<{ items: ApiProject[] }>("/projects", ["projects"]);
    return data.items.map((p) => {
      const cover = p.cover ?? p.images[0] ?? null;
      return {
        slug: p.slug,
        start: p.startDate,
        end: p.endDate,
        title: p.title,
        client: p.client,
        body: p.body,
        images: p.images.map((i) => i.url),
        cover: cover?.url ?? null,
        // Unknown width → treat as small so it is not stretched full-width
        coverWidth: cover?.width ?? (cover?.url.includes("res.cloudinary.com") ? 1600 : 0),
      };
    });
  } catch (e) {
    if (isBuild) {
      console.warn("⚠️  API unavailable during build – using bundled projects.json", e);
      return fallbackProjects();
    }
    throw e;
  }
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

/* ------------------------------------------------------------- helpers */

/** Model code shown large on image placeholders, e.g. "CX6040D", "MKS-05", "NeuViz". */
export function modelCode(name: string): string | null {
  const cleaned = name.replace(/^NUCTECH\s+/i, "").replace(/^Dosimeter-radiometer\s+/i, "");
  const first = cleaned.split(/\s+/)[0];
  return /\d|[A-Z].*[A-Z]/.test(first) ? first : null;
}

export function excerpt(lines: string[], max = 180) {
  const text = lines.join(" ");
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text;
}
