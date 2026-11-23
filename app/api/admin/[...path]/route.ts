import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin/constants";

/**
 * Authenticated proxy from the admin panel to the Render API.
 *   /api/admin/auth/<x>  →  {API_URL}/v1/auth/<x>
 *   /api/admin/<x>       →  {API_URL}/v1/admin/<x>
 * The token lives in an httpOnly cookie, so the browser never sees it.
 * After a successful change to products/projects the matching cache tag is revalidated,
 * so the public site updates immediately.
 */

const API_URL = process.env.API_URL?.replace(/\/+$/, "");

type Ctx = { params: Promise<{ path: string[] }> };

async function handle(req: Request, { params }: Ctx) {
  if (!API_URL) return NextResponse.json({ error: "api_not_configured" }, { status: 503 });
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { path } = await params;
  if (path.some((seg) => seg === ".." || seg === ".")) return NextResponse.json({ error: "bad_path" }, { status: 400 });
  const isAuth = path[0] === "auth";
  const target = `${API_URL}/v1/${isAuth ? "auth" : "admin"}/${(isAuth ? path.slice(1) : path).map(encodeURIComponent).join("/")}${new URL(req.url).search}`;

  const hasBody = !["GET", "HEAD"].includes(req.method);
  let res: Response;
  try {
    res = await fetch(target, {
      method: req.method,
      headers: { Authorization: `Bearer ${token}`, ...(hasBody ? { "Content-Type": "application/json" } : {}) },
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    return NextResponse.json({ error: "api_unreachable", message: "API is not reachable (it may be waking up – try again)" }, { status: 502 });
  }

  const text = await res.text();
  const out = new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" },
  });

  if (res.status === 401) out.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });

  if (res.ok && hasBody && !isAuth) {
    if (path[0] === "products") revalidateTag("products");
    if (path[0] === "projects") revalidateTag("projects");
  }
  return out;
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE };
