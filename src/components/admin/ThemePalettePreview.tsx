"use client";

import { useEffect, useState } from "react";
import { inkFor } from "@/lib/theme";

type Palette = {
  accent: string;
  secondary: string;
  highlight: string;
  background: string;
  foreground: string;
};

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export default function ThemePalettePreview({ initial }: { initial: Palette }) {
  const [palette, setPalette] = useState(initial);

  useEffect(() => {
    const update = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || !target.name.endsWith("_color") || !HEX_COLOR.test(target.value)) return;
      const form = target.form;
      if (!form) return;
      const value = (name: string, fallback: string) =>
        (form.elements.namedItem(name) as HTMLInputElement | null)?.value || fallback;
      setPalette({
        accent: value("accent_color", initial.accent),
        secondary: value("secondary_color", initial.secondary),
        highlight: value("highlight_color", initial.highlight),
        background: value("background_color", initial.background),
        foreground: value("foreground_color", initial.foreground),
      });
    };

    document.addEventListener("input", update, true);
    document.addEventListener("change", update, true);
    return () => {
      document.removeEventListener("input", update, true);
      document.removeEventListener("change", update, true);
    };
  }, [initial]);

  const swatches = [
    { label: "Primary", color: palette.accent },
    { label: "Secondary", color: palette.secondary },
    { label: "Highlight", color: palette.highlight },
    { label: "Background", color: palette.background },
    { label: "Text", color: palette.foreground },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--foreground)]/10" aria-label="Live theme preview">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--foreground)]/10 px-4 py-3">
        <div>
          <h3 className="text-[13px] font-semibold">Live preview</h3>
          <p className="mt-0.5 text-[11px] text-[var(--foreground)]/50">Updates as you change the colors</p>
        </div>
        <span className="rounded-full bg-[var(--accent)]/15 px-2.5 py-1 text-[10px] font-semibold text-[var(--foreground)]/65">YOUR PALETTE</span>
      </div>
      <div className="grid sm:grid-cols-[1fr_220px]">
        <div className="p-4 sm:p-5" style={{ background: palette.background, color: palette.foreground }}>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold tracking-tight">Aniket Jamunde</span>
            <span className="rounded-full px-3 py-1.5 text-[10px] font-semibold" style={{ background: palette.accent, color: inkFor(palette.accent) }}>Get in touch</span>
          </div>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-50">A quick look</p>
          <p className="mt-1.5 text-lg font-semibold leading-tight tracking-[-0.04em]">Make your next idea <span className="rounded px-1" style={{ background: palette.highlight, color: inkFor(palette.highlight) }}>stand out.</span></p>
          <p className="mt-2 max-w-sm text-xs leading-5 opacity-65">Your colors working together across a typical website section.</p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-[var(--foreground)]/10 sm:grid-cols-1">
          {swatches.map(({ label, color }) => (
            <div key={label} className="flex min-h-[48px] items-center justify-between gap-2 px-3 py-2" style={{ background: color, color: inkFor(color) }}>
              <span className="text-[10px] font-semibold">{label}</span>
              <span className="font-mono text-[9px] uppercase">{color}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
