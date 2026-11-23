"use client";

import { useCallback, useEffect, useState } from "react";

export type L10n = { en: string; mn: string };
export type L10nLines = { en: string[]; mn: string[] };
export type ImageRef = { url: string; publicId?: string | null; width?: number | null; height?: number | null };

export type AdminProduct = {
  id: number;
  slug: string;
  category: "radiation" | "medical" | "energy";
  group: "baggage-parcel" | "personnel-screening" | "explosives-narcotics" | "radiation-dosimetry" | null;
  name: L10n;
  overview: L10nLines;
  features: L10nLines;
  image: ImageRef | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminProject = {
  id: number;
  slug: string;
  title: L10n;
  client: L10n;
  body: L10nLines;
  startDate: string;
  endDate: string | null;
  cover: ImageRef | null;
  images: ImageRef[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminMessage = {
  id: number;
  name: string;
  phone: string;
  email: string;
  organization: string | null;
  product: string | null;
  message: string;
  locale: string | null;
  status: "new" | "read" | "archived";
  createdAt: string;
};

export type Stats = {
  products: number;
  projects: number;
  messages: { new: number; read: number; archived: number };
  cloudinary: boolean;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public issues: { path: string; message: string }[] = [],
  ) {
    super(message);
  }
}

const ERRORS: Record<string, string> = {
  invalid_credentials: "Имэйл эсвэл нууц үг буруу байна.",
  too_many_requests: "Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.",
  api_unreachable: "API-тай холбогдож чадсангүй (сервер сэрж байж магадгүй) — хэдэн секундын дараа дахин оролдоно уу.",
  api_not_configured: "API_URL тохируулагдаагүй байна.",
  cloudinary_not_configured: "Cloudinary тохируулагдаагүй байна (Render дээрх CLOUDINARY_* хувьсагчид).",
  conflict: "Ийм slug-тай бичлэг аль хэдийн байна.",
  wrong_password: "Одоогийн нууц үг буруу байна.",
  not_found: "Олдсонгүй.",
  validation: "Талбаруудыг шалгана уу.",
};

/** fetch wrapper for /api/admin/* (cookie auth). Redirects to login on 401. */
export async function api<T>(path: string, init: { method?: string; json?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api/admin/${path.replace(/^\/+/, "")}`, {
    method: init.method ?? (init.json !== undefined ? "POST" : "GET"),
    headers: init.json !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init.json !== undefined ? JSON.stringify(init.json) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !path.startsWith("auth/password")) {
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
  }
  if (!res.ok) {
    const code = data?.error ?? "error";
    throw new ApiError(res.status, code, ERRORS[code] ?? data?.message ?? `Алдаа (${res.status})`, data?.issues ?? []);
  }
  return data as T;
}

/** Tiny data hook: { data, error, loading, reload } */
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(Boolean(path));

  const reload = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    try {
      setData(await api<T>(path));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, setData, error, loading, reload };
}

/* ------------------------------------------------------------- toasts */

type ToastKind = "success" | "error" | "info";
export function toast(message: string, kind: ToastKind = "success") {
  window.dispatchEvent(new CustomEvent("admin-toast", { detail: { message, kind } }));
}

/* ------------------------------------------------------------- uploads */

type Signed = {
  cloudName: string;
  apiKey: string;
  uploadUrl: string;
  timestamp: number;
  folder: string;
  signature: string;
};

export const MAX_UPLOAD_MB = 10;

/** Uploads straight from the browser to Cloudinary using a signature from the API. */
export async function uploadImage(
  file: File,
  folder: "products" | "projects",
  onProgress?: (pct: number) => void,
): Promise<ImageRef> {
  if (!file.type.startsWith("image/")) throw new ApiError(400, "type", "Зөвхөн зураг оруулна уу.");
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) throw new ApiError(400, "size", `Зураг ${MAX_UPLOAD_MB}MB-аас бага байх ёстой.`);

  const s = await api<Signed>("uploads/sign", { json: { folder } });
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", s.apiKey);
  form.append("timestamp", String(s.timestamp));
  form.append("folder", s.folder);
  form.append("signature", s.signature);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", s.uploadUrl);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      try {
        const r = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ url: r.secure_url, publicId: r.public_id, width: r.width, height: r.height });
        } else {
          reject(new ApiError(xhr.status, "upload", r?.error?.message ?? "Upload амжилтгүй"));
        }
      } catch {
        reject(new ApiError(xhr.status, "upload", "Upload амжилтгүй"));
      }
    };
    xhr.onerror = () => reject(new ApiError(0, "upload", "Сүлжээний алдаа"));
    xhr.send(form);
  });
}

/** Removes an uploaded-but-unsaved image (best effort). */
export function discardUpload(img: ImageRef | null | undefined) {
  if (img?.publicId) void api("uploads/destroy", { json: { publicId: img.publicId } }).catch(() => {});
}

/** Cloudinary thumbnail URL (falls back to the original for non-Cloudinary images). */
export function thumb(url: string, w = 320) {
  return url.includes("res.cloudinary.com") ? url.replace("/upload/", `/upload/c_fill,w_${w},h_${Math.round(w * 0.75)},q_auto,f_auto/`) : url;
}

export const toLines = (text: string) => text.split("\n").map((l) => l.trim()).filter(Boolean);
export const fromLines = (lines: string[]) => lines.join("\n");
