"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Code2, PenTool, Phone, Rocket, type LucideIcon } from "lucide-react";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LIME = "#d4f94c";
const BLACK = "#0b0b0b";
const WHITE = "#ffffff";

type Step = {
  icon: LucideIcon;
  title: string;
  description: [string, string];
};

const STEPS: Step[] = [
  {
    icon: Phone,
    title: "Discovery call",
    description: [
      "I learn about your goals and audience.",
      "Then I define what your project needs.",
    ],
  },
  {
    icon: PenTool,
    title: "Design and planning",
    description: [
      "I plan the pages and features.",
      "Then I shape a design around your brand.",
    ],
  },
  {
    icon: Code2,
    title: "Build and deployment",
    description: [
      "I build a fast, responsive experience.",
      "Then I test it across devices.",
    ],
  },
  {
    icon: Rocket,
    title: "Launch and growth",
    description: [
      "I launch your product and track results.",
      "Then I keep improving it with you.",
    ],
  },
];

type Token =
  | { kind: "word"; text: string; hl?: boolean }
  | { kind: "photo"; src: string; alt: string };

const HEADING: Token[] = [
  { kind: "word", text: "From" },
  { kind: "word", text: "first" },
  { kind: "word", text: "call" },
  { kind: "word", text: "to" },
  { kind: "word", text: "live" },
  { kind: "word", text: "site" },
  {
    kind: "photo",
    src: "https://picsum.photos/seed/process-hero/144/144",
    alt: "Working on a project",
  },
  { kind: "word", text: "in" },
  { kind: "word", text: "four", hl: true },
  { kind: "word", text: "steps" },
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
      id="process-heading"
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

export default function ProcessSteps() {
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

        gsap.from("[data-step]", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: "[data-step-grid]",
            scroller,
            start: "top 85%",
          },
        });
      });
    },
    { scope, dependencies: [hydrated], revertOnUpdate: true }
  );

  return (
    <section
      ref={scope}
      id="process"
      aria-labelledby="process-heading"
      className="relative overflow-hidden bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex rounded-full border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--foreground)]/60">
            How I work
          </span>
          <Heading />
        </div>

        <ol
          data-step-grid
          className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((step, i) => {
            const lime = i % 2 === 0;
            const Icon = step.icon;
            const fill = lime ? LIME : BLACK;
            const ink = lime ? BLACK : WHITE;

            return (
              <li key={step.title} className="list-none">
                <div data-step className="h-full">
                  <NotchedProjectCard
                    title={step.title}
                    hideTitle
                    badge={step.title}
                    coverContent={
                      <div className="flex h-full w-full items-center justify-center px-6 pb-10 pr-16 pt-[35px]">
                        <br />
                        <br />
                        <div className="w-full max-w-[24ch] text-left" style={{ color: ink }}>
                          <p className="text-sm font-semibold leading-snug sm:text-base">
                            {step.description[0]}
                          </p>
                          <span
                            aria-hidden="true"
                            className="my-3 block h-px w-8 opacity-35"
                            style={{ backgroundColor: ink }}
                          />
                          
                          <p className="text-xs leading-relaxed opacity-75 sm:text-sm sm:leading-5">
                            {step.description[1]}
                          </p>
                        </div>
                      </div>
                    }
                    coverStyle={{
                      background: lime
                        ? `linear-gradient(145deg, ${fill} 0%, #c4ed3d 100%)`
                        : `radial-gradient(circle at 22% 18%, #202020 0%, ${fill} 68%)`,
                      color: ink,
                    }}
                    icon={<Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />}
                    accent="var(--highlight)"
                    accentForeground="var(--accent-ink)"
                    surface="var(--background)"
                    className="h-full transition-transform duration-300 hover:-translate-y-1"
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}