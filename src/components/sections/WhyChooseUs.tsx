"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Rocket, Timer, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import Reveal from "./Reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REASONS: { title: string; text: string; icon: LucideIcon }[] = [
  { title: "Cost efficient", text: "Reduce manual workload and spend less on tools you do not need.", icon: Wallet },
  { title: "Better insights", text: "Understand your customers and your numbers quickly, with clear reports.", icon: TrendingUp },
  { title: "Time saving", text: "Automate repeated tasks so your team can focus on the work that matters.", icon: Timer },
  { title: "Faster workflows", text: "Speed up your operations, from the first enquiry to final delivery.", icon: Rocket },
];

type Token =
  | { kind: "word"; text: string; hl?: boolean }
  | { kind: "photo"; src: string; alt: string };

const HEADING: Token[] = [
  { kind: "word", text: "What" },
  { kind: "word", text: "makes" },
  { kind: "word", text: "my" },
  { kind: "word", text: "solutions", hl: true },
  { kind: "word", text: "better" },
  { kind: "word", text: "for" },
  {
    kind: "photo",
    src: "https://picsum.photos/seed/why-me-photo/144/144",
    alt: "Working with a client",
  },
  { kind: "word", text: "your" },
  { kind: "word", text: "business", hl: true },
];

function PersonCapsule({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="group inline-flex h-9 w-12 shrink-0 align-middle overflow-hidden rounded-full border-2 border-[var(--foreground)]/80 transition-[width] duration-500 hover:w-20 sm:h-11 sm:w-14 sm:hover:w-28 lg:h-12 lg:w-16 lg:hover:w-36">
      <Image
        src={src}
        alt={alt}
        width={144}
        height={144}
        loading="lazy"
        unoptimized
        draggable={false}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

function Heading() {
  return (
    <h2
      id="why-heading"
      className="mt-6 text-balance text-center text-[clamp(1.75rem,4.2vw,3.8rem)] font-semibold leading-[1.12] tracking-[-0.05em]"
    >
      {HEADING.map((t, i) => (
        <span
          key={i}
          className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] align-top"
        >
          <span data-word className="inline-block">
            {t.kind === "photo" ? (
              <PersonCapsule src={t.src} alt={t.alt} />
            ) : t.hl ? (
              <span className="relative inline-block px-[0.12em]">
                <span
                  data-hl
                  aria-hidden="true"
                  className="absolute inset-0 origin-left rounded-[0.22em] bg-[var(--highlight)]"
                />
                <span className="relative">{t.text}</span>
              </span>
            ) : (
              t.text
            )}
          </span>
        </span>
      ))}
    </h2>
  );
}

export default function WhyChooseUs() {
  const scope = useRef<HTMLElement>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useGSAP(
    () => {
      if (!hydrated) return;

      const scroller = scope.current?.closest<HTMLElement>(".frame-scroll");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-word]", {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: scope.current,
            scroller,
            start: "top 80%",
          },
        });

        gsap.from("[data-hl]", {
          scaleX: 0,
          duration: 0.9,
          ease: "expo.out",
          delay: 0.4,
          scrollTrigger: {
            trigger: scope.current,
            scroller,
            start: "top 80%",
          },
        });
      });
    },
    { scope, dependencies: [hydrated], revertOnUpdate: true }
  );

  return (
    <section
      ref={scope}
      id="why-me"
      aria-labelledby="why-heading"
      className="bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex rounded-full border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--foreground)]/60">
            Why Aniket Jamunde
          </span>
          <Heading />
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(({ title, text, icon: Icon }, i) => {
            const lime = i % 2 === 0;
            return (
              <li key={title} className="h-full list-none">
                <Reveal delay={i * 100}>
                  <NotchedProjectCard
                    title={title}
                    description={text}
                    coverStyle={{
                      backgroundColor: lime ? "var(--highlight)" : "var(--secondary)",
                      color: lime ? "var(--accent-ink)" : "var(--background)",
                    }}
                    coverContent={<Icon size={72} strokeWidth={1.4} aria-hidden="true" />}
                    accent={lime ? "var(--secondary)" : "var(--accent)"}
                    accentForeground={lime ? "var(--background)" : "var(--accent-ink)"}
                  />
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}