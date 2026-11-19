"use client";

import { useState } from "react";

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export default function ColorSettingInput({
  name,
  value,
  required,
}: {
  name: string;
  value: string;
  required?: boolean;
}) {
  const [hex, setHex] = useState(value);
  const [color, setColor] = useState(HEX_COLOR.test(value) ? value : "#000000");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex h-12 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-[var(--foreground)]/10 bg-[var(--background)] p-1.5" aria-label="Pick a color">
        <input
          type="color"
          value={color}
          onChange={(event) => {
            const next = event.target.value;
            setColor(next);
            setHex(next);
            const field = event.currentTarget.form?.elements.namedItem(name) as HTMLInputElement | null;
            if (field) {
              field.value = next;
              field.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }}
          className="h-full w-full cursor-pointer rounded-lg border-0 bg-transparent p-0"
        />
      </label>
      <label className="min-w-[140px] flex-1 sm:max-w-[200px]">
        <span className="sr-only">Hex color value</span>
        <input
          type="text"
          name={name}
          value={hex}
          onChange={(event) => {
            const next = event.target.value;
            setHex(next);
            if (HEX_COLOR.test(next)) setColor(next);
          }}
          required={required}
          maxLength={7}
          pattern="#[0-9a-fA-F]{6}"
          title="Enter a six-digit hex color, such as #6d28d9"
          spellCheck={false}
          className="w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-3.5 py-3 font-mono text-sm uppercase text-[var(--foreground)] placeholder:text-[var(--foreground)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60"
        />
      </label>
      <span className="text-xs text-[var(--foreground)]/50">Click the swatch or enter a hex value</span>
    </div>
  );
}
