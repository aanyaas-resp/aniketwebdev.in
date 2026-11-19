"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import NotchedProjectCard from "@/components/ui/notched-project-card";
import { SERVICES } from "@/lib/services";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Heading segments. "text" is plain words, "hl" is a highlighted phrase
// (only 2 highlights), "avatar" is an inline person capsule.
type Segment =
  | { kind: "text"; text: string }
  | { kind: "hl"; text: string }
  | { kind: "avatar"; src: string; alt: string };

const HEADING: Segment[] = [
  { kind: "text", text: "I turn your" },
  {
    kind: "avatar",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=144&q=80",
    alt: "Founder working on a new idea",
  },
  { kind: "text", text: "big idea into a" },
  { kind: "hl", text: "product people love" },
  { kind: "text", text: "and help your business" },
  { kind: "hl", text: "grow" },
  { kind: "text", text: "with every release." },
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

// Each token is wrapped in a mask so it can rise into place.
function MaskedToken({ children }: { children: React.ReactNode }) {
  return (
    <span className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] align-top">
      <span data-word className="inline-block">
        {children}
      </span>
    </span>
  );
}

function renderHeading() {
  return HEADING.flatMap((seg, si) => {
    if (seg.kind === "avatar") {
      return [
        <MaskedToken key={`a-${si}`}>
          <PersonCapsule src={seg.src} alt={seg.alt} />
        </MaskedToken>,
      ];
    }

    if (seg.kind === "hl") {
      return [
        <MaskedToken key={`h-${si}`}>
          <span className="relative inline-block px-[0.12em]">
            <span
              data-hl-cover
              aria-hidden="true"
              className="absolute inset-0 origin-left rounded-[0.22em] bg-[var(--highlight)]"
            />
            <span className="relative">{seg.text}</span>
          </span>
        </MaskedToken>,
      ];
    }

    return seg.text.split(" ").map((word, wi) => (
      <MaskedToken key={`t-${si}-${wi}`}>{word}</MaskedToken>
    ));
  });
}

export default function Services() {
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
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            scroller,
            start: "top 75%",
          },
        });

        tl.from("[data-eyebrow]", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
          .from(
            "[data-word]",
            { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.04 },
            "-=0.2"
          )
          .from(
            "[data-hl-cover]",
            { scaleX: 0, duration: 0.8, ease: "expo.out", stagger: 0.35 },
            "-=0.5"
          );

        gsap.from("[data-service-card]", {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: "[data-service-grid]",
            scroller,
            start: "top 85%",
          },
        });

        gsap.to("[data-glow]", {
          x: "random(-60,60)",
          y: "random(-40,40)",
          duration: 7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    { scope, dependencies: [hydrated], revertOnUpdate: true }
  );

  return (
    <section
      ref={scope}
      id="services"
      aria-labelledby="services-heading"
      className="relative isolate overflow-hidden bg-[var(--background)] px-5 py-24 font-sans text-[var(--foreground)] antialiased sm:px-8 sm:py-32"
    >
      <div
        data-glow
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-16 -z-10 h-96 w-96 rounded-full bg-[var(--highlight)]/20 blur-3xl"
      />
      <div
        data-glow
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-[var(--accent)]/15 blur-3xl"
      />

      <div className="mx-auto max-w-6xl">
        <header className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span
            data-eyebrow
            className="inline-flex rounded-full border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--foreground)]/60"
          >
            What I do
          </span>

          <h2
            id="services-heading"
            className="mt-6 text-balance text-[clamp(1.5rem,3.4vw,3.1rem)] font-semibold leading-[1.15] tracking-[-0.045em] text-[var(--foreground)]"
          >
            {renderHeading()}
          </h2>
        </header>

        <div
          data-service-grid
          className="mt-20 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => (
            <div key={service.title} data-service-card className="h-full">
              <NotchedProjectCard
                href={`/servicesweoffer/${service.slug}`}
                title={service.title}
                image={service.image}
                imageAlt={service.imageAlt}
                description={service.description}
                tags={service.tags}
                highlightFirstTag
                accent="var(--highlight)"
                accentForeground="var(--accent-ink)"
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}