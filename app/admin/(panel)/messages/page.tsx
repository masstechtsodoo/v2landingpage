"use client";

import { useState } from "react";
import { Archive, Mail, MailOpen, Phone, Trash2 } from "lucide-react";
import { Badge, Button, Empty, ErrorBox, PageHeader, Spinner } from "@/components/admin/ui";
import { api, toast, useApi, type AdminMessage } from "@/lib/admin/client";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "new", label: "Шинэ" },
  { key: "read", label: "Уншсан" },
  { key: "archived", label: "Архив" },
  { key: "", label: "Бүгд" },
] as const;

const PAGE = 30;

export default function MessagesPage() {
  const [status, setStatus] = useState<string>("new");
  const [offset, setOffset] = useState(0);
  const [openId, setOpenId] = useState<number | null>(null);
  const query = `messages?limit=${PAGE}&offset=${offset}${status ? `&status=${status}` : ""}`;
  const { data, setData, error, loading, reload } = useApi<{ items: AdminMessage[]; total: number }>(query);

  async function setStatusOf(m: AdminMessage, next: AdminMessage["status"]) {
    try {
      await api(`messages/${m.id}`, { method: "PATCH", json: { status: next } });
      if (status && status !== next) {
        setData((d) => d && { ...d, items: d.items.filter((x) => x.id !== m.id), total: d.total - 1 });
      } else {
        setData((d) => d && { ...d, items: d.items.map((x) => (x.id === m.id ? { ...x, status: next } : x)) });
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : "Алдаа", "error");
    }
  }

  async function remove(m: AdminMessage) {
    if (!confirm(`${m.name}-ийн зурвасыг устгах уу?`)) return;
    try {
      await api(`messages/${m.id}`, { method: "DELETE" });
      setData((d) => d && { ...d, items: d.items.filter((x) => x.id !== m.id), total: d.total - 1 });
      toast("Устгагдлаа");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Алдаа", "error");
    }
  }

  function toggle(m: AdminMessage) {
    const opening = openId !== m.id;
    setOpenId(opening ? m.id : null);
    if (opening && m.status === "new") void setStatusOf(m, "read");
  }

  return (
    <>
      <PageHeader title="Зурвасууд" subtitle="Сайтын холбоо барих формоор ирсэн хүсэлтүүд" />
      <div className="mb-4 flex gap-1 overflow-x-auto rounded-[0.7rem] bg-white p-1 sm:inline-flex">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setStatus(t.key);
              setOffset(0);
              setOpenId(null);
            }}
            className={cn(
              "rounded-[0.5rem] px-4 py-2 text-sm whitespace-nowrap transition-colors",
              status === t.key ? "bg-ink text-white" : "text-ink/65 hover:bg-paper",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <ErrorBox message={error} onRetry={reload} />}
      {loading && !data && <Spinner className="mx-auto mt-10" />}
      {data && data.items.length === 0 && <Empty>Зурвас алга.</Empty>}

      {data && data.items.length > 0 && (
        <ul className="divide-y divide-ink/8 overflow-hidden rounded-[1rem] border border-ink/8 bg-white">
          {data.items.map((m) => {
            const open = openId === m.id;
            return (
              <li key={m.id}>
                <button type="button" onClick={() => toggle(m)} className="flex w-full items-start gap-4 px-4 py-3.5 text-left hover:bg-paper/60">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", m.status === "new" ? "bg-coral" : "bg-transparent")} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={cn(m.status === "new" && "font-semibold")}>{m.name}</span>
                      {m.organization && <span className="text-sm text-ink/50">{m.organization}</span>}
                      {m.product && <Badge tone="accent">{m.product}</Badge>}
                    </span>
                    <span className={cn("mt-0.5 block text-sm text-ink/60", !open && "truncate")}>{open ? null : m.message}</span>
                  </span>
                  <span className="shrink-0 text-xs text-ink/45">{new Date(m.createdAt).toLocaleString("mn-MN")}</span>
                </button>
                {open && (
                  <div className="border-t border-ink/8 bg-paper/50 px-4 py-4 sm:pl-10">
                    <p className="text-[0.95rem] leading-relaxed whitespace-pre-wrap">{m.message}</p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.product ?? "Mass Tech"))}`} className="inline-flex items-center gap-1.5 text-navy hover:underline">
                        <Mail className="size-4" /> {m.email}
                      </a>
                      <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1.5 text-navy hover:underline">
                        <Phone className="size-4" /> {m.phone}
                      </a>
                      {m.locale && <span className="text-ink/45">Хэл: {m.locale.toUpperCase()}</span>}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.status !== "new" && (
                        <Button size="sm" variant="secondary" onClick={() => setStatusOf(m, "new")}>
                          <MailOpen className="size-4" /> Уншаагүй болгох
                        </Button>
                      )}
                      {m.status !== "archived" && (
                        <Button size="sm" variant="secondary" onClick={() => setStatusOf(m, "archived")}>
                          <Archive className="size-4" /> Архивлах
                        </Button>
                      )}
                      <Button size="sm" variant="danger" onClick={() => remove(m)}>
                        <Trash2 className="size-4" /> Устгах
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {data && data.total > PAGE && (
        <div className="mt-4 flex items-center justify-between text-sm text-ink/55">
          <span>
            {offset + 1}–{Math.min(offset + PAGE, data.total)} / {data.total}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>
              Өмнөх
            </Button>
            <Button size="sm" variant="secondary" disabled={offset + PAGE >= data.total} onClick={() => setOffset(offset + PAGE)}>
              Дараах
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
