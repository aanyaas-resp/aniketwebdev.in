"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import type { Field } from "@/lib/admin-config";

export default function ImageUploadField({ field, value }: { field: Field; value: string }) {
  const [url, setUrl] = useState(value);
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (!preview.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const shownImage = preview || url;

  return (
    <fieldset className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.025] p-4 sm:p-5">
      <legend className="px-1 text-[13px] font-semibold text-[var(--foreground)]/80">
        {field.label}
        {field.required && <span className="text-rose-600"> *</span>}
      </legend>
      <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-[var(--foreground)]/10 bg-[var(--background)]">
          {shownImage ? (
            <img src={shownImage} alt={`${field.label} preview`} className="h-full w-full object-contain p-2" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[var(--foreground)]/40">
              <ImagePlus size={22} strokeWidth={1.6} aria-hidden="true" />
              <span className="text-xs">Image preview</span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-[13px] font-semibold text-[var(--accent-ink)] transition hover:brightness-95 sm:w-fit">
            <Upload size={15} aria-hidden="true" />
            {fileName || "Choose an image"}
            <input
              type="file"
              name={`${field.name}__file`}
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={(event) => {
                const selected = event.currentTarget.files?.[0];
                if (!selected) return;
                setFileName(selected.name);
                setPreview(URL.createObjectURL(selected));
              }}
              className="sr-only"
            />
          </label>
          <p className="text-xs leading-5 text-[var(--foreground)]/50">PNG, JPG, WebP, GIF or SVG · up to 5 MB</p>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-[var(--foreground)]/60">Or paste an image URL</span>
            <input
              type="text"
              name={field.name}
              inputMode="url"
              placeholder="https://example.com/image.jpg"
              value={url}
              maxLength={500}
              onChange={(event) => setUrl(event.target.value)}
              className="w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
            />
          </label>
          {field.help && <p className="text-xs leading-5 text-[var(--foreground)]/50">{field.help}</p>}
        </div>
      </div>
    </fieldset>
  );
}
