import { type ReactNode } from "react";

export default function Stats() {
  return (
    <section className="relative isolate flex min-h-[70svh] items-center justify-center overflow-hidden bg-[var(--background)] px-5 py-32 text-center font-sans text-[var(--foreground)] antialiased sm:px-8">
      <div className="relative z-10 max-w-5xl">
        <h2 className="text-balance text-[clamp(2rem,4.2vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-[var(--foreground)]">
          Thoughtful digital experiences for <span className="hl">growing businesses.</span>
        </h2>
      </div>
    </section>
  );
}
