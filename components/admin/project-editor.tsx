"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { BilingualInput, BilingualLines, linesToText, textToLines } from "@/components/admin/bilingual";
import { GalleryField } from "@/components/admin/image-field";
import { Button, Card, ErrorBox, Field, Input, Spinner, Toggle } from "@/components/admin/ui";
import { api, ApiError, toast, useApi, type AdminProject, type ImageRef, type L10n } from "@/lib/admin/client";

type Form = {
  slug: string;
  title: L10n;
  client: L10n;
  body: { en: string; mn: string };
  startDate: string;
  endDate: string;
  cover: ImageRef | null;
  images: ImageRef[];
  published: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);

const empty = (): Form => ({
  slug: "",
  title: { en: "", mn: "" },
  client: { en: "", mn: "" },
  body: { en: "", mn: "" },
  startDate: today(),
  endDate: "",
  cover: null,
  images: [],
  published: true,
});

export function ProjectEditor({ id }: { id?: number }) {
  const router = useRouter();
  const { data, error, loading, reload } = useApi<AdminProject>(id ? `projects/${id}` : null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [issues, setIssues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data) return;
    setForm({
      slug: data.slug,
      title: data.title,
      client: data.client,
      body: linesToText(data.body),
      startDate: data.startDate,
      endDate: data.endDate ?? "",
      cover: data.cover,
      // Older records may have a cover that is not in the gallery – show it there so it can be managed
      images: data.cover && !data.images.some((i) => i.url === data.cover!.url) ? [data.cover, ...data.images] : data.images,
      published: data.published,
    });
  }, [data]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setIssues({});
    try {
      const saved = await api<AdminProject>(id ? `projects/${id}` : "projects", {
        method: id ? "PUT" : "POST",
        json: {
          ...form,
          slug: form.slug.trim() || undefined,
          body: textToLines(form.body),
          endDate: form.endDate || null,
          cover: form.cover ?? form.images[0] ?? null,
        },
      });
      toast(id ? "Хадгалагдлаа" : "Мэдээ нэмэгдлээ");
      if (!id) router.replace(`/admin/news/${saved.id}`);
      else set("slug", saved.slug);
    } catch (err) {
      if (err instanceof ApiError && err.issues.length) {
        setIssues(Object.fromEntries(err.issues.map((i) => [i.path, i.message])));
      }
      toast(err instanceof Error ? err.message : "Алдаа", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!id || !confirm("Энэ мэдээг бүр мөсөн устгах уу? Зургууд нь Cloudinary-аас мөн устна.")) return;
    setDeleting(true);
    try {
      await api(`projects/${id}`, { method: "DELETE" });
      toast("Устгагдлаа");
      router.push("/admin/news");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Алдаа", "error");
      setDeleting(false);
    }
  }

  if (id && loading && !data) return <Spinner className="mx-auto mt-20" />;
  if (id && error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <form onSubmit={save}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/news" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-ink">
            <ArrowLeft className="size-4" /> Мэдээ, төслүүд
          </Link>
          <h1 className="mt-1 line-clamp-2 text-[1.6rem] leading-tight tracking-[-0.03em]">
            {id ? form.title.mn || form.title.en || "…" : "Шинэ мэдээ"}
          </h1>
        </div>
        <div className="flex gap-2">
          {id && data?.published && (
            <a href={`/mn/news/${form.slug}`} target="_blank" rel="noreferrer">
              <Button type="button" variant="secondary">
                <ExternalLink className="size-4" /> Сайт дээр харах
              </Button>
            </a>
          )}
          <Button type="submit" variant="accent" loading={saving}>
            Хадгалах
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-5">
          <Card title="Гарчиг, захиалагч">
            <div className="space-y-4">
              <BilingualInput label="Гарчиг" value={form.title} onChange={(v) => set("title", v)} required errors={{ en: issues["title.en"], mn: issues["title.mn"] }} />
              <BilingualInput label="Захиалагч" value={form.client} onChange={(v) => set("client", v)} />
            </div>
          </Card>
          <Card title="Агуулга">
            <BilingualLines
              label="Текст"
              hint="мөр бүр = 1 догол мөр · эхний мөр томоор гарна"
              value={form.body}
              onChange={(v) => set("body", v)}
              rows={14}
            />
          </Card>
          <Card title={`Зургууд (${form.images.length})`}>
            <GalleryField value={form.images} onChange={(v) => set("images", v)} cover={form.cover} onCover={(v) => set("cover", v)} folder="projects" />
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Төлөв">
            <div className="space-y-4">
              <Toggle label="Сайт дээр нийтлэх" checked={form.published} onChange={(v) => set("published", v)} />
              <Field label="Эхэлсэн огноо" error={issues.startDate}>
                <Input type="date" required value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
              </Field>
              <Field label="Дууссан огноо" hint="заавал биш" error={issues.endDate}>
                <Input type="date" value={form.endDate} min={form.startDate} onChange={(e) => set("endDate", e.target.value)} />
              </Field>
              <Field label="URL slug" hint={id ? "" : "хоосон бол автоматаар"} error={issues.slug}>
                <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} />
              </Field>
            </div>
          </Card>
          {id && (
            <Card title="Аюултай бүс">
              <Button type="button" variant="danger" className="w-full" loading={deleting} onClick={remove}>
                Мэдээ устгах
              </Button>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
