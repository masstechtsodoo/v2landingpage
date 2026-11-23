import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 * With API_URL set, messages go to the backend (stored in the database + optional e-mail).
 * Otherwise sends email through Resend (https://resend.com) when these env vars are set in Vercel:
 *   RESEND_API_KEY     – API key
 *   CONTACT_TO_EMAIL   – where messages go (default: info@masstech.mn)
 *   CONTACT_FROM_EMAIL – verified sender, e.g. "Mass Tech Website <web@masstech.mn>"
 * Without RESEND_API_KEY it returns 503 and the form falls back to opening the visitor's mail app.
 */

const MAX = { name: 120, phone: 40, email: 160, organization: 160, message: 5000, product: 200 };

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

const API_URL = process.env.API_URL?.replace(/\/+$/, "");

/** Forwards the message to the Render API, which stores it (admin → Messages) and e-mails a notification. */
async function forwardToApi(req: Request, body: Record<string, unknown>) {
  try {
    const res = await fetch(`${API_URL}/v1/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-IP": (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim(),
        "X-Client-UA": req.headers.get("user-agent") ?? "",
      },
      body: JSON.stringify(body),
      // Render free plan can take ~50 s to wake up
      signal: AbortSignal.timeout(60_000),
    });
    const data = await res.json().catch(() => ({}));
    // 5xx from the API → 502 so the form falls back to the visitor's mail app
    return NextResponse.json(data, { status: res.status >= 500 ? 502 : res.status });
  } catch {
    return NextResponse.json({ error: "api_unreachable" }, { status: 502 });
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (API_URL) return forwardToApi(req, body);

  // Honeypot – bots fill hidden fields
  if (clean(body.website, 100)) return NextResponse.json({ ok: true });

  const data = {
    name: clean(body.name, MAX.name),
    phone: clean(body.phone, MAX.phone),
    email: clean(body.email, MAX.email),
    organization: clean(body.organization, MAX.organization),
    message: clean(body.message, MAX.message),
    product: clean(body.product, MAX.product),
  };

  if (!data.name || !data.phone || !data.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const to = process.env.CONTACT_TO_EMAIL || "info@masstech.mn";
  const from = process.env.CONTACT_FROM_EMAIL || "Mass Tech Website <onboarding@resend.dev>";
  const rows = [
    ["Name", data.name],
    ["Phone", data.phone],
    ["Email", data.email],
    ["Organization", data.organization],
    ["Product", data.product],
  ].filter(([, v]) => v);

  const html = `
    <h2 style="font-family:sans-serif">New website inquiry</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`).join("")}
    </table>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${escapeHtml(data.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: data.email,
      subject: `${data.product ? `[${data.product}] ` : ""}Website inquiry — ${data.organization || data.name}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
