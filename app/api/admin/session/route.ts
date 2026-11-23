import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE } from "@/lib/admin/constants";

const API_URL = process.env.API_URL?.replace(/\/+$/, "");

/** Login: exchanges email/password for an API token stored in an httpOnly cookie (never visible to JS). */
export async function POST(req: Request) {
  if (!API_URL) return NextResponse.json({ error: "api_not_configured", message: "API_URL is not set" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  let res: Response;
  try {
    res = await fetch(`${API_URL}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Client-IP": req.headers.get("x-forwarded-for") ?? "" },
      body: JSON.stringify({ email: body.email, password: body.password }),
      signal: AbortSignal.timeout(60_000),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "api_unreachable" }, { status: 502 });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const out = NextResponse.json({ admin: data.admin });
  out.cookies.set(ADMIN_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return out;
}

/** Logout */
export async function DELETE() {
  const out = NextResponse.json({ ok: true });
  out.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return out;
}
