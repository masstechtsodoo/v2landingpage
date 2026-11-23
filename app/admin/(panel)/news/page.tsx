"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ImageOff, Plus, Search } from "lucide-react";
import { Badge, Button, Empty, ErrorBox, Input, PageHeader, Spinner } from "@/components/admin/ui";
import { thumb, useApi, type AdminProject } from "@/lib/admin/client";

export default function NewsAdminPage() {
  const { data, error, loading, reload } = useApi<{ items: AdminProject[] }>("projects");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data?.items ?? []).filter(
      (p) => !term || [p.slug, p.title.en, p.title.mn, p.client.mn, p.client.en].some((s) => s.toLowerCase().includes(term)),
    );
  }, [data, q]);

  return (
    <>
      <PageHeader
        title="Мэдээ, төслүүд"
        subtitle={data ? `${data.items.length} бичлэг` : undefined}
        actions={
          <Link href="/admin/news/new">
            <Button variant="accent">
              <Plus className="size-4" /> Шинэ мэдээ
            </Button>
          </Link>
        }
      />
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Гарчиг, захиалагчаар хайх…" className="pl-9" />
      </div>

      {error && <ErrorBox message={error} onRetry={reload} />}
      {loading && !data && <Spinner className="mx-auto mt-10" />}
      {data && items.length === 0 && <Empty>Илэрц олдсонгүй.</Empty>}

      {items.length > 0 && (
        <ul className="divide-y divide-ink/8 overflow-hidden rounded-[1rem] border border-ink/8 bg-white">
          {items.map((p) => {
            const cover = p.cover ?? p.images[0];
            return (
              <li key={p.id}>
                <Link href={`/admin/news/${p.id}`} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-paper/70">
                  <span className="grid h-14 w-20 shrink-0 place-items-center overflow-hidden rounded-[0.6rem] bg-paper">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb(cover.url, 160)} alt="" className="size-full object-cover" loading="lazy" />
                    ) : (
                      <ImageOff className="size-5 text-ink/25" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-1 font-medium">{p.title.mn}</span>
                    <span className="block truncate text-sm text-ink/50">{p.client.mn}</span>
                  </span>
                  <span className="hidden shrink-0 text-sm text-ink/50 md:block">{p.startDate.replaceAll("-", ".")}</span>
                  <span className="hidden w-16 shrink-0 text-right text-sm text-ink/45 sm:block">{p.images.length} зураг</span>
                  <span className="w-20 shrink-0 text-right">
                    {p.published ? <Badge tone="success">Нийтэлсэн</Badge> : <Badge tone="warning">Ноорог</Badge>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
