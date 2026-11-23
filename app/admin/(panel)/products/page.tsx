"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ImageOff, Plus, Search } from "lucide-react";
import { CATEGORY_LABELS, GROUP_LABELS } from "@/components/admin/product-editor";
import { Badge, Button, Empty, ErrorBox, Input, PageHeader, Select, Spinner } from "@/components/admin/ui";
import { thumb, useApi, type AdminProduct } from "@/lib/admin/client";

export default function ProductsAdminPage() {
  const { data, error, loading, reload } = useApi<{ items: AdminProduct[] }>("products");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const items = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (data?.items ?? []).filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!term || [p.slug, p.name.en, p.name.mn].some((s) => s.toLowerCase().includes(term))),
    );
  }, [data, q, cat]);

  return (
    <>
      <PageHeader
        title="Бүтээгдэхүүн"
        subtitle={data ? `${data.items.length} бүтээгдэхүүн` : undefined}
        actions={
          <Link href="/admin/products/new">
            <Button variant="accent">
              <Plus className="size-4" /> Шинэ бүтээгдэхүүн
            </Button>
          </Link>
        }
      />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Нэр, загвар, slug-аар хайх…" className="pl-9" />
        </div>
        <Select value={cat} onChange={(e) => setCat(e.target.value)} className="sm:w-64">
          <option value="">Бүх ангилал</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </Select>
      </div>

      {error && <ErrorBox message={error} onRetry={reload} />}
      {loading && !data && <Spinner className="mx-auto mt-10" />}
      {data && items.length === 0 && <Empty>Илэрц олдсонгүй.</Empty>}

      {items.length > 0 && (
        <ul className="divide-y divide-ink/8 overflow-hidden rounded-[1rem] border border-ink/8 bg-white">
          {items.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/products/${p.id}`} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-paper/70">
                <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-[0.6rem] bg-paper">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb(p.image.url, 120)} alt="" className="size-full object-cover" loading="lazy" />
                  ) : (
                    <ImageOff className="size-5 text-ink/25" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{p.name.mn}</span>
                  <span className="block truncate text-sm text-ink/50">{p.name.en}</span>
                </span>
                <span className="hidden shrink-0 flex-col items-end gap-1 text-xs text-ink/50 md:flex">
                  <span>{CATEGORY_LABELS[p.category]}</span>
                  {p.group && <span className="text-ink/35">{GROUP_LABELS[p.group]}</span>}
                </span>
                <span className="w-20 shrink-0 text-right">
                  {p.published ? <Badge tone="success">Нийтэлсэн</Badge> : <Badge tone="warning">Ноорог</Badge>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
