"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { BilingualInput, BilingualLines, linesToText, textToLines } from "@/components/admin/bilingual";
import { ImageField } from "@/components/admin/image-field";
import { Button, Card, ErrorBox, Field, Input, Select, Spinner, Toggle } from "@/components/admin/ui";
import { api, ApiError, toast, useApi, type AdminProduct, type ImageRef, type L10n } from "@/lib/admin/client";

export const CATEGORY_LABELS = {
  radiation: "Цацрагийн хяналт",
  medical: "Эмнэлгийн тоног төхөөрөмж",
  energy: "Эрчим хүчний шийдлүүд",
} as const;

export const GROUP_LABELS = {
  "baggage-parcel": "Ачаа тээш, илгээмжийн хяналт",
  "personnel-screening": "Хүний биеийн аюулгүй байдлын үзлэг",
  "explosives-narcotics": "Тэсрэх, мансууруулах бодис илрүүлэх",
  "radiation-dosimetry": "Цацраг илрүүлэх, тун хэмжих",
} as const;

type Form = {
  slug: string;
  category: AdminProduct["category"];
  group: AdminProduct["group"];
  name: L10n;
  overview: { en: string; mn: string };
  features: { en: string; mn: string };
  image: ImageRef | null;
  sortOrder: number;
  published: boolean;
};

const empty: Form = {
  slug: "",
  category: "radiation",
  group: "baggage-parcel",
  name: { en: "", mn: "" },
  overview: { en: "", mn: "" },
  features: { en: "", mn: "" },
  image: null,
  sortOrder: 0,
  published: true,
};

export function ProductEditor({ id }: { id?: number }) {
  const router = useRouter();
  const { data, error, loading, reload } = useApi<AdminProduct>(id ? `products/${id}` : null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [issues, setIssues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data) return;
    setForm({
      slug: data.slug,
      category: data.category,
      group: data.group,
      name: data.name,
      overview: linesToText(data.overview),
      features: linesToText(data.features),
      image: data.image,
      sortOrder: data.sortOrder,
      published: data.published,
    });
  }, [data]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setIssues({});
    const payload = {
      ...form,
      slug: form.slug.trim() || undefined,
      group: form.category === "radiation" ? form.group : null,
      overview: textToLines(form.overview),
      features: textToLines(form.features),
      sortOrder: Number(form.sortOrder) || 0,
    };
    try {
      const saved = await api<AdminProduct>(id ? `products/${id}` : "products", {
        method: id ? "PUT" : "POST",
        json: payload,
      });
      toast(id ? "Хадгалагдлаа" : "Бүтээгдэхүүн нэмэгдлээ");
      if (!id) router.replace(`/admin/products/${saved.id}`);
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
    if (!id || !confirm("Энэ бүтээгдэхүүнийг бүр мөсөн устгах уу?")) return;
    setDeleting(true);
    try {
      await api(`products/${id}`, { method: "DELETE" });
      toast("Устгагдлаа");
      router.push("/admin/products");
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
          <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-ink">
            <ArrowLeft className="size-4" /> Бүтээгдэхүүн
          </Link>
          <h1 className="mt-1 text-[1.6rem] leading-tight tracking-[-0.03em]">
            {id ? form.name.mn || form.name.en || "…" : "Шинэ бүтээгдэхүүн"}
          </h1>
        </div>
        <div className="flex gap-2">
          {id && data?.published && (
            <a href={`/mn/products/${form.slug}`} target="_blank" rel="noreferrer">
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
          <Card title="Нэр">
            <BilingualInput
              label="Нэр"
              value={form.name}
              onChange={(v) => set("name", v)}
              required
              errors={{ en: issues["name.en"], mn: issues["name.mn"] }}
            />
          </Card>
          <Card title="Ерөнхий танилцуулга">
            <BilingualLines label="Танилцуулга" hint="мөр бүр = 1 догол мөр" value={form.overview} onChange={(v) => set("overview", v)} rows={7} />
          </Card>
          <Card title="Техникийн онцлог">
            <BilingualLines
              label="Онцлог"
              hint="мөр бүр = 1 цэг · «Түлхүүр: утга» · «Гарчиг:»"
              value={form.features}
              onChange={(v) => set("features", v)}
              rows={12}
            />
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Төлөв">
            <div className="space-y-4">
              <Toggle label="Сайт дээр нийтлэх" checked={form.published} onChange={(v) => set("published", v)} />
              <Field label="Ангилал">
                <Select value={form.category} onChange={(e) => set("category", e.target.value as Form["category"])}>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
              {form.category === "radiation" && (
                <Field label="Дэд бүлэг">
                  <Select value={form.group ?? ""} onChange={(e) => set("group", (e.target.value || null) as Form["group"])}>
                    <option value="">—</option>
                    {Object.entries(GROUP_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}
              <Field label="Эрэмбэ" hint="бага тоо эхэнд">
                <Input type="number" min={0} value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
              </Field>
              <Field label="URL slug" hint={id ? "" : "хоосон бол автоматаар"} error={issues.slug}>
                <Input value={form.slug} placeholder="cx6040d-x-ray-inspection-system" onChange={(e) => set("slug", e.target.value)} />
              </Field>
            </div>
          </Card>
          <Card title="Зураг">
            <ImageField value={form.image} onChange={(v) => set("image", v)} folder="products" aspect="aspect-square" contain />
            <p className="mt-3 text-xs leading-relaxed text-ink/45">Цагаан эсвэл тунгалаг фонтой, 1200px-ээс том зураг хамгийн сайн харагдана.</p>
          </Card>
          {id && (
            <Card title="Аюултай бүс">
              <Button type="button" variant="danger" className="w-full" loading={deleting} onClick={remove}>
                Бүтээгдэхүүн устгах
              </Button>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
