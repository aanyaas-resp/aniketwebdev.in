// components/sections/hero.tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { ActionButton } from "@/components/ui/action-button";
import { ShaderBackground } from "@/components/ui/shader-background";

function Pill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="magnetic-pill relative inline-flex h-fit w-fit items-center whitespace-nowrap rounded-full p-1 pr-3 text-sm font-medium tracking-[-0.02em] text-[var(--background)]"
    >
      <span className="shrink-0 rounded-full bg-[var(--accent)] px-2.5 py-1 font-semibold text-[var(--foreground)]">
        Web & App
      </span>
      <span className="pl-2">{children}</span>
    </Link>
  );
}

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[min(620px,calc(100dvh-24px))] flex-col items-center overflow-hidden bg-[var(--background)] px-5 pt-8 pb-10 text-center font-sans text-[var(--foreground)] antialiased sm:min-h-[calc(100dvh-40px)] sm:px-8 sm:pt-10 sm:pb-20">
      <ShaderBackground className="pointer-events-none absolute inset-0 z-0 rounded-[20px]" />
      <div aria-hidden="true" className="absolute inset-0 z-10 bg-[var(--background)]/40" />

      <div className="relative z-20 flex w-full flex-col items-center pt-20 sm:pt-[clamp(6rem,10vh,8rem)]">
        {/* Pill */}
        <Pill href="/#services">Development</Pill>

        {/* Headline */}
        <h1 className="mt-7 max-w-[1200px] text-balance text-[clamp(2.25rem,5.6vw,6.25rem)] font-normal leading-[1.04] tracking-[-0.05em] sm:mt-12">
          I build your <span className="hl">Website Or App,</span>
          <br />
          From Idea To Launch.
        </h1>

        {/* Subcopy */}
        <p className="mt-5 max-w-[680px] text-pretty text-[clamp(1rem,1.45vw,1.6rem)] leading-[1.4] tracking-[-0.02em] text-[var(--foreground)]/50 sm:mt-7">
          I design and build fast, reliable websites and mobile apps that help
          your business grow and connect with customers.
        </p>

        {/* Buttons */}
        <div className="mt-7 flex flex-col items-center gap-4 sm:mt-9 sm:flex-row">
          <ActionButton href="/contact" variant="primary">
            Book a call
          </ActionButton>
        </div>
      </div>
    </section>
  );
}
