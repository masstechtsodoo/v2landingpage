"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Star, Trash2, Upload } from "lucide-react";
import { discardUpload, thumb, toast, uploadImage, type ImageRef } from "@/lib/admin/client";
import { cn } from "@/lib/utils";

type Folder = "products" | "projects";

function useUploader(folder: Folder) {
  const [progress, setProgress] = useState<number | null>(null);
  async function upload(files: File[]): Promise<ImageRef[]> {
    const out: ImageRef[] = [];
    for (const [i, file] of files.entries()) {
      try {
        setProgress(0);
        out.push(
          await uploadImage(file, folder, (p) => setProgress(Math.round(((i + p / 100) / files.length) * 100))),
        );
      } catch (e) {
        toast(`${file.name}: ${e instanceof Error ? e.message : "upload failed"}`, "error");
      }
    }
    setProgress(null);
    return out;
  }
  return { progress, upload };
}

function DropZone({
  onFiles,
  multiple,
  progress,
  className,
  children,
}: {
  onFiles: (f: File[]) => void;
  multiple?: boolean;
  progress: number | null;
  className?: string;
  children?: React.ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith("image/"));
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-[0.8rem] border-2 border-dashed p-6 text-center text-sm transition-colors",
        over ? "border-ink/50 bg-accent/20" : "border-ink/15 bg-paper/60",
        className,
      )}
    >
      {progress !== null ? (
        <>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full bg-ink transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-ink/60">{progress}%</span>
        </>
      ) : (
        <>
          {children ?? <ImagePlus className="size-6 text-ink/40" />}
          <button type="button" onClick={() => input.current?.click()} className="font-medium text-ink underline underline-offset-4">
            Зураг сонгох
          </button>
          <span className="text-xs text-ink/45">эсвэл энд чирч оруулна · JPG, PNG, WebP · 10MB хүртэл</span>
        </>
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
}

/** Single image (product photo, project cover) */
export function ImageField({
  value,
  onChange,
  folder,
  aspect = "aspect-[4/3]",
  contain,
}: {
  value: ImageRef | null;
  onChange: (v: ImageRef | null) => void;
  folder: Folder;
  aspect?: string;
  contain?: boolean;
}) {
  const { progress, upload } = useUploader(folder);
  const [fresh, setFresh] = useState<string | null>(null); // uploaded in this session, not yet saved

  const replace = async (files: File[]) => {
    const [img] = await upload(files);
    if (!img) return;
    if (fresh && value?.publicId === fresh) discardUpload(value);
    setFresh(img.publicId ?? null);
    onChange(img);
  };

  if (!value) return <DropZone onFiles={replace} progress={progress} className={aspect} />;

  return (
    <div className="space-y-2">
      <div className={cn("relative overflow-hidden rounded-[0.8rem] border border-ink/10 bg-paper", aspect)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumb(value.url, 640)} alt="" className={cn("size-full", contain ? "object-contain p-3" : "object-cover")} />
        {progress !== null && (
          <div className="absolute inset-0 grid place-items-center bg-white/80 text-sm">{progress}%</div>
        )}
      </div>
      <div className="flex gap-2">
        <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-[0.55rem] border border-ink/15 bg-white px-3 py-2 text-sm hover:border-ink/35">
          <Upload className="size-4" /> Солих
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = [...(e.target.files ?? [])];
              e.target.value = "";
              if (f.length) void replace(f);
            }}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            if (fresh && value.publicId === fresh) discardUpload(value);
            onChange(null);
          }}
          className="inline-flex items-center gap-2 rounded-[0.55rem] border border-ink/15 bg-white px-3 py-2 text-sm text-coral hover:border-coral/50"
        >
          <Trash2 className="size-4" /> Устгах
        </button>
      </div>
    </div>
  );
}

/** Ordered photo gallery (project images). One can be marked as cover. */
export function GalleryField({
  value,
  onChange,
  cover,
  onCover,
  folder,
}: {
  value: ImageRef[];
  onChange: (v: ImageRef[]) => void;
  cover: ImageRef | null;
  onCover: (v: ImageRef | null) => void;
  folder: Folder;
}) {
  const { progress, upload } = useUploader(folder);

  const add = async (files: File[]) => {
    const imgs = await upload(files);
    if (!imgs.length) return;
    const next = [...value, ...imgs];
    onChange(next);
    if (!cover) onCover(next[0]);
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => {
    const img = value[i];
    const next = value.filter((_, k) => k !== i);
    onChange(next);
    if (cover?.url === img.url) onCover(next[0] ?? null);
  };

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {value.map((img, i) => {
            const isCover = cover?.url === img.url;
            return (
              <li key={img.url + i} className={cn("group overflow-hidden rounded-[0.8rem] border bg-paper", isCover ? "border-ink ring-2 ring-accent" : "border-ink/10")}>
                <div className="relative aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb(img.url, 400)} alt="" className="size-full object-cover" loading="lazy" />
                  {isCover && (
                    <span className="absolute top-2 left-2 rounded-full bg-accent px-2 py-0.5 text-xs font-medium">Нүүр зураг</span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1 p-1.5">
                  <div className="flex">
                    <button type="button" title="Зүүн тийш" onClick={() => move(i, -1)} className="grid size-8 place-items-center rounded-md hover:bg-ink/5 disabled:opacity-30" disabled={i === 0}>
                      <ArrowLeft className="size-4" />
                    </button>
                    <button type="button" title="Баруун тийш" onClick={() => move(i, 1)} className="grid size-8 place-items-center rounded-md hover:bg-ink/5 disabled:opacity-30" disabled={i === value.length - 1}>
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                  <div className="flex">
                    <button type="button" title="Нүүр зураг болгох" onClick={() => onCover(img)} className={cn("grid size-8 place-items-center rounded-md hover:bg-ink/5", isCover && "text-amber-500")}>
                      <Star className="size-4" fill={isCover ? "currentColor" : "none"} />
                    </button>
                    <button type="button" title="Устгах" onClick={() => remove(i)} className="grid size-8 place-items-center rounded-md text-coral hover:bg-coral/10">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <DropZone onFiles={add} multiple progress={progress} className="py-8" />
    </div>
  );
}
