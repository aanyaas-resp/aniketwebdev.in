"use client";

import { useMemo, useState } from "react";
import type { Field } from "@/lib/admin-config";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export default function TitleWithAutoSlug({
  titleField,
  slugField,
  titleValue,
  slugValue,
  routePrefix,
}: {
  titleField: Field;
  slugField: Field;
  titleValue: string;
  slugValue: string;
  routePrefix?: string;
}) {
  const [title, setTitle] = useState(titleValue);
  const isExistingSlug = Boolean(slugValue);
  const generatedSlug = useMemo(() => isExistingSlug ? slugValue : slugify(title), [isExistingSlug, slugValue, title]);
  const maxLength = titleField.maxLength;

  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-[var(--foreground)]/80">
        {titleField.label}
        {titleField.required && <span className="text-rose-600"> *</span>}
      </span>
      <input
        name={titleField.name}
        required={titleField.required}
        maxLength={maxLength}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
      />
      <input type="hidden" name={slugField.name} value={generatedSlug} />
      {routePrefix && (
        <span className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-[var(--foreground)]/50">
          <span className="font-medium text-[var(--foreground)]/65">Page link</span>
          <span className="font-mono">{routePrefix}/{generatedSlug || "your-title"}</span>
          {isExistingSlug && <span>URL stays the same when you edit the title</span>}
        </span>
      )}
    </label>
  );
}
