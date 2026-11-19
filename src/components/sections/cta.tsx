// components/sections/cta.tsx
import { ActionButton } from "@/components/ui/action-button";

export default function CTA() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
      {/* Top line: brightest at the centre, fading to the edges */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--foreground)]/60 to-transparent"
      />

      {/* Glow rising from the top edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[330px]"
        style={{
          background:
            "radial-gradient(ellipse 52% 100% at 50% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 45%, transparent 72%)",
        }}
      />

      <div className="mx-auto flex min-h-[454px] w-full max-w-[1000px] flex-col items-center px-5 pt-[116px] text-center">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="h-10 w-10 object-contain" />
          <span className="text-[30px] font-semibold leading-none tracking-[-0.03em]">
            Aniket Jamunde
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-9 text-[clamp(2.25rem,4.4vw,4rem)] font-semibold leading-[0.88] tracking-[-0.055em]">
          Ready to <span className="hl">Build Your Website</span>
          <br />
          or App?
        </h2>

        {/* Buttons */}
        <div className="mt-8 flex items-center justify-center">
          <ActionButton href="/contact" variant="primary">
            Contact me
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
