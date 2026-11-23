"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { BrandBackdrop } from "@/components/brand-backdrop";
import { Button, Field, Input } from "@/components/admin/ui";
import { Logo } from "@/components/ui";

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Имэйл эсвэл нууц үг буруу байна.",
  too_many_requests: "Хэт олон оролдлого. 15 минутын дараа дахин оролдоно уу.",
  api_unreachable: "Сервертэй холбогдсонгүй (сэрж байж магадгүй). Хэдэн секундын дараа дахин оролдоно уу.",
  api_not_configured: "API_URL тохируулагдаагүй байна.",
  validation: "Имэйл хаягаа зөв оруулна уу.",
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(MESSAGES[data.error] ?? "Нэвтрэх үед алдаа гарлаа.");
        setLoading(false);
        return;
      }
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/admin") ? next : "/admin";
    } catch {
      setError(MESSAGES.api_unreachable);
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate grid min-h-[100svh] place-items-center p-4">
      <BrandBackdrop className="-z-10" />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <form onSubmit={onSubmit} className="space-y-4 rounded-[1.1rem] bg-white p-7 shadow-2xl">
          <div className="mb-2 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[0.6rem] bg-accent">
              <Lock className="size-5" />
            </span>
            <div>
              <h1 className="text-lg font-medium tracking-[-0.02em]">Админ нэвтрэх</h1>
              <p className="text-sm text-ink/50">Сайтын контент удирдах</p>
            </div>
          </div>
          <Field label="Имэйл">
            <Input name="email" type="email" autoComplete="username" required autoFocus />
          </Field>
          <Field label="Нууц үг">
            <Input name="password" type="password" autoComplete="current-password" required />
          </Field>
          {error && <p className="rounded-[0.55rem] bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
          <Button type="submit" className="w-full" loading={loading}>
            Нэвтрэх
          </Button>
        </form>
      </div>
    </main>
  );
}
