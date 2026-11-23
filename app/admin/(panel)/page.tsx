"use client";

import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Inbox, Newspaper, Package } from "lucide-react";
import { Badge, Card, ErrorBox, PageHeader, Spinner } from "@/components/admin/ui";
import { useApi, type AdminMessage, type Stats } from "@/lib/admin/client";

export default function DashboardPage() {
  const stats = useApi<Stats>("stats");
  const latest = useApi<{ items: AdminMessage[] }>("messages?status=new&limit=5");

  const tiles = stats.data
    ? [
        { href: "/admin/products", label: "Бүтээгдэхүүн", value: stats.data.products, icon: Package },
        { href: "/admin/news", label: "Мэдээ, төслүүд", value: stats.data.projects, icon: Newspaper },
        { href: "/admin/messages", label: "Шинэ зурвас", value: stats.data.messages.new, icon: Inbox, highlight: stats.data.messages.new > 0 },
      ]
    : [];

  return (
    <>
      <PageHeader title="Хянах самбар" subtitle="masstech.mn контент" />
      {stats.error && <ErrorBox message={stats.error} onRetry={stats.reload} />}
      {stats.loading && !stats.data && <Spinner className="mx-auto mt-10" />}

      {stats.data && !stats.data.cloudinary && (
        <div className="mb-5 flex items-start gap-3 rounded-[0.8rem] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          Cloudinary тохируулагдаагүй тул зураг оруулах боломжгүй. Render дээр CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET-ийг нэмнэ үү.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {tiles.map(({ href, label, value, icon: Icon, highlight }) => (
          <Link key={href} href={href} className="group rounded-[1rem] border border-ink/8 bg-white p-5 transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className={highlight ? "grid size-10 place-items-center rounded-[0.6rem] bg-accent" : "grid size-10 place-items-center rounded-[0.6rem] bg-paper"}>
                <Icon className="size-5" strokeWidth={1.7} />
              </span>
              <ArrowUpRight className="size-4 text-ink/30 transition-colors group-hover:text-ink" />
            </div>
            <p className="mt-6 text-4xl tracking-[-0.04em]">{value}</p>
            <p className="mt-1 text-sm text-ink/55">{label}</p>
          </Link>
        ))}
      </div>

      <Card
        className="mt-6"
        title="Сүүлийн шинэ зурвасууд"
        actions={
          <Link href="/admin/messages" className="text-sm text-ink/60 hover:text-ink">
            Бүгд →
          </Link>
        }
      >
        {latest.loading && !latest.data ? (
          <Spinner />
        ) : latest.data?.items.length ? (
          <ul className="divide-y divide-ink/8">
            {latest.data.items.map((m) => (
              <li key={m.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium">
                    {m.name} {m.organization && <span className="font-normal text-ink/50">· {m.organization}</span>}
                  </p>
                  <p className="truncate text-sm text-ink/60">{m.message}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs text-ink/45">
                  {m.product && <Badge tone="accent">{m.product}</Badge>}
                  {new Date(m.createdAt).toLocaleString("mn-MN")}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink/50">Шинэ зурвас алга.</p>
        )}
      </Card>
    </>
  );
}
