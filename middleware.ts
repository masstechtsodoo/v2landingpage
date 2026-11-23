import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { ADMIN_COOKIE } from "@/lib/admin/constants";

// Old URLs from the previous version of the site
const legacy: Record<string, string> = {
  "/product": "/products",
  "/about": "/about",
  "/login": "/",
  "/admin": "/",
  "/admin/createitem": "/",
};

function preferredLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  if (isLocale(cookie)) return cookie;
  const header = req.headers.get("accept-language")?.toLowerCase() ?? "";
  if (header.startsWith("mn")) return "mn";
  if (header.startsWith("en") && !header.includes("mn")) return "en";
  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Admin panel: not localized, requires the session cookie (the API validates the token itself)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const hasSession = Boolean(req.cookies.get(ADMIN_COOKIE)?.value);
    if (!hasSession && pathname !== "/admin/login") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    if (hasSession && pathname === "/admin/login") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const target = legacy[pathname] ?? pathname;
  const url = req.nextUrl.clone();
  url.pathname = `/${preferredLocale(req)}${target === "/" ? "" : target}`;
  url.search = search;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, favicon, robots.txt…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
