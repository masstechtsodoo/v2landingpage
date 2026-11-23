"use client";

import { useState } from "react";
import { Button, Card, Field, Input, PageHeader } from "@/components/admin/ui";
import { api, toast, useApi } from "@/lib/admin/client";

export default function SettingsPage() {
  const me = useApi<{ email: string; name: string | null; lastLoginAt: string | null }>("auth/me");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (f.get("newPassword") !== f.get("confirm")) {
      toast("Шинэ нууц үг таарахгүй байна", "error");
      return;
    }
    setSaving(true);
    try {
      await api("auth/password", { json: { currentPassword: f.get("currentPassword"), newPassword: f.get("newPassword") } });
      toast("Нууц үг солигдлоо");
      form.reset();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Алдаа", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Нууц үг солих" subtitle={me.data ? me.data.email : undefined} />
      <Card className="max-w-lg">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Одоогийн нууц үг">
            <Input name="currentPassword" type="password" autoComplete="current-password" required />
          </Field>
          <Field label="Шинэ нууц үг" hint="хамгийн багадаа 10 тэмдэгт">
            <Input name="newPassword" type="password" autoComplete="new-password" minLength={10} required />
          </Field>
          <Field label="Шинэ нууц үг давтах">
            <Input name="confirm" type="password" autoComplete="new-password" minLength={10} required />
          </Field>
          <Button type="submit" loading={saving}>
            Хадгалах
          </Button>
        </form>
      </Card>
    </>
  );
}
