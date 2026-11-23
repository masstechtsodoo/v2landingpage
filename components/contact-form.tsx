"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "mailto" | "error";

export function ContactForm({
  dict,
  email,
  product,
  className,
}: {
  dict: Dictionary["contact"]["form"];
  email: string;
  product?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    data.locale = document.documentElement.lang;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      if (res.status === 503 || res.status === 502) {
        // Email service not configured yet → open the visitor's mail app instead
        const subject = encodeURIComponent(
          `${data.product ? `${dict.productPrefix} ${data.product} — ` : ""}${data.organization || data.name}`,
        );
        const body = encodeURIComponent(
          [
            `${dict.name}: ${data.name}`,
            `${dict.phone}: ${data.phone}`,
            `${dict.email}: ${data.email}`,
            `${dict.organization}: ${data.organization}`,
            data.product ? `${dict.productPrefix} ${data.product}` : "",
            "",
            data.message,
          ]
            .filter((l) => l !== "")
            .join("\n"),
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
        setStatus("mailto");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "peer w-full rounded-[0.65rem] border border-ink/12 bg-paper/60 px-4 pt-6 pb-2.5 text-[0.98rem] text-ink outline-none transition-colors placeholder:text-transparent focus:border-ink/40 focus:bg-white";
  const label =
    "pointer-events-none absolute top-2 left-4 text-[0.75rem] text-ink/50 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[0.95rem] peer-focus:top-2 peer-focus:text-[0.75rem]";

  if (status === "success") {
    return (
      <div className={cn("flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-white p-8 sm:p-10", className)}>
        <CheckCircle2 className="size-10 text-ink" strokeWidth={1.5} />
        <p className="text-xl tracking-[-0.02em]">{dict.success}</p>
        <button type="button" onClick={() => setStatus("idle")} className="text-sm text-ink/60 underline underline-offset-4">
          ↺
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("rounded-[var(--radius-card)] bg-white p-5 sm:p-8", className)} noValidate={false}>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {product && <input type="hidden" name="product" value={product} />}

      {product && (
        <p className="mb-4 rounded-[0.6rem] bg-accent/40 px-4 py-3 text-[0.92rem]">
          {dict.productPrefix} <strong className="font-medium">{product}</strong>
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <input id="cf-name" name="name" required placeholder=" " autoComplete="name" className={field} />
          <label htmlFor="cf-name" className={label}>
            {dict.name} *
          </label>
        </div>
        <div className="relative">
          <input id="cf-phone" name="phone" type="tel" required placeholder=" " autoComplete="tel" className={field} />
          <label htmlFor="cf-phone" className={label}>
            {dict.phone} *
          </label>
        </div>
        <div className="relative">
          <input id="cf-email" name="email" type="email" required placeholder=" " autoComplete="email" className={field} />
          <label htmlFor="cf-email" className={label}>
            {dict.email} *
          </label>
        </div>
        <div className="relative">
          <input id="cf-org" name="organization" placeholder=" " autoComplete="organization" className={field} />
          <label htmlFor="cf-org" className={label}>
            {dict.organization}
          </label>
        </div>
        <div className="relative sm:col-span-2">
          <textarea id="cf-msg" name="message" required rows={5} placeholder=" " className={cn(field, "resize-y pt-7")} />
          <label htmlFor="cf-msg" className={label}>
            {dict.message} *
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/55" role="status" aria-live="polite">
          {status === "error" && <span className="text-coral">{dict.error}</span>}
          {status === "mailto" && dict.mailtoFallback}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center justify-center gap-4 rounded-[0.6rem] bg-ink py-1.5 pr-1.5 pl-5 font-medium text-white transition-colors hover:bg-navy disabled:opacity-70"
        >
          {status === "sending" ? dict.sending : dict.submit}
          <span className="grid size-9 place-items-center rounded-[0.45rem] bg-accent text-ink">
            {status === "sending" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </span>
        </button>
      </div>
    </form>
  );
}
