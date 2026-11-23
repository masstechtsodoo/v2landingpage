"use client";

import { Field, Input, Textarea } from "@/components/admin/ui";
import { fromLines, toLines, type L10n, type L10nLines } from "@/lib/admin/client";

const LANGS = [
  { key: "mn", label: "Монгол" },
  { key: "en", label: "English" },
] as const;

/** Side-by-side MN / EN single-line inputs */
export function BilingualInput({
  label,
  value,
  onChange,
  required,
  errors,
}: {
  label: string;
  value: L10n;
  onChange: (v: L10n) => void;
  required?: boolean;
  errors?: Partial<Record<"en" | "mn", string>>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {LANGS.map(({ key, label: lang }) => (
        <Field key={key} label={`${label} · ${lang}`} error={errors?.[key]}>
          <Input value={value[key]} required={required} onChange={(e) => onChange({ ...value, [key]: e.target.value })} />
        </Field>
      ))}
    </div>
  );
}

/**
 * Side-by-side MN / EN multi-line text. Each line becomes one paragraph / bullet on the site.
 * Text is kept as typed while editing and converted to lines by the caller on save (see toLines).
 */
export function BilingualLines({
  label,
  hint,
  value,
  onChange,
  rows = 8,
}: {
  label: string;
  hint?: string;
  value: { en: string; mn: string };
  onChange: (v: { en: string; mn: string }) => void;
  rows?: number;
}) {
  return (
    <div>
      {hint && <p className="mb-3 text-xs text-ink/45">{hint}</p>}
      <div className="grid gap-4 md:grid-cols-2">
      {LANGS.map(({ key, label: lang }) => (
        <Field key={key} label={`${label} · ${lang}`}>
          <Textarea rows={rows} value={value[key]} onChange={(e) => onChange({ ...value, [key]: e.target.value })} />
        </Field>
      ))}
      </div>
    </div>
  );
}

export const linesToText = (v: L10nLines) => ({ en: fromLines(v.en), mn: fromLines(v.mn) });
export const textToLines = (v: { en: string; mn: string }): L10nLines => ({ en: toLines(v.en), mn: toLines(v.mn) });
