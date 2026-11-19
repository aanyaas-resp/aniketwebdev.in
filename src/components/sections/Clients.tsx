"use client";

import { useEffect, useRef, type KeyboardEvent as RKeyboardEvent, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import type { Client as ContentClient } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Client = { name: string; logo: string };
type Token = { kind: "word"; text: string; hl?: boolean };

const BASE_SPEED = 60; // px per second at normal speed
const RESUME_DELAY = 1800; // ms after a drag or key nudge before auto-scroll resumes

const HEADLINE: Token[] = [
  { kind: "word", text: "Good" },
  { kind: "word", text: "work" },
  { kind: "word", text: "happens" },
  { kind: "word", text: "together.", hl: true },
];

// Keeps x inside one loop so the row never shows an empty gap.
const wrap = (x: number, half: number) =>
  half ? -((((-x) % half) + half) % half) : 0;

function Hl({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block px-[0.12em]">
      <span
        data-hl-cover
        aria-hidden="true"
        className="absolute inset-0 origin-left rounded-[0.22em] bg-[var(--highlight)]"
      />
      <span className="relative">{children}</span>
    </span>
  );
}

type MState = {
  offset: number;
  half: number;
  vel: number;
  hover: number;
  factor: number;
  boost: number;
  lastY: number;
  visible: boolean;
  dragging: boolean;
  lastX: number;
  pausedUntil: number;
  setX: ((v: number) => void) | null;
};

function LogoMarquee({ items, dir }: { items: Client[]; dir: 1 | -1 }) {
  const regionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const s = useRef<MState>({
    offset: 0,
    half: 0,
    vel: 0,
    hover: 1,
    factor: 1,
    boost: 0,
    lastY: 0,
    visible: true,
    dragging: false,
    lastX: 0,
    pausedUntil: 0,
    setX: null,
  });

  useEffect(() => {
    const track = trackRef.current;
    const region = regionRef.current;
    if (!track || !region) return;

    const st = s.current;
    const setX = gsap.quickSetter(track, "x", "px") as (v: number) => void;
    st.setX = setX;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      st.half = track.scrollWidth / 2;
      st.offset = wrap(st.offset, st.half);
      setX(st.offset);
    };
    measure();
    st.lastY = window.scrollY;

    const ro = new ResizeObserver(measure);
    ro.observe(track);

    // Rows that are off-screen skip all work.
    const io = new IntersectionObserver(([e]) => (st.visible = e.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(region);

    const tick = (_: number, dt: number) => {
      const frames = Math.min(dt, 50) / 16.67;

      // Scroll speed boosts the row, then it settles back down.
      const y = window.scrollY;
      const scrollDelta = Math.abs(y - st.lastY);
      st.lastY = y;

      if (!st.visible || st.half === 0) return;

      st.boost += (Math.min(scrollDelta / 12, 3) - st.boost) * 0.1;
      st.factor += (st.hover - st.factor) * 0.08;

      // Release momentum after a swipe, even while auto-scroll is paused.
      if (!st.dragging && Math.abs(st.vel) > 0.05) {
        st.offset = wrap(st.offset + st.vel * frames, st.half);
        st.vel *= Math.pow(0.94, frames);
        setX(st.offset);
      }

      const idle = !st.dragging && performance.now() >= st.pausedUntil;
      if (reduce || !idle) return;

      st.offset = wrap(
        st.offset + dir * (BASE_SPEED / 60) * frames * (1 + st.boost) * st.factor,
        st.half
      );
      setX(st.offset);
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      ro.disconnect();
      io.disconnect();
    };
  }, [dir]);

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const st = s.current;
    st.dragging = true;
    st.lastX = e.clientX;
    st.vel = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const st = s.current;
    if (!st.dragging) return;
    const dx = e.clientX - st.lastX;
    st.lastX = e.clientX;
    st.vel = st.vel * 0.5 + dx * 0.5;
    st.offset = wrap(st.offset + dx, st.half);
    st.setX?.(st.offset);
  };

  const onUp = () => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    st.pausedUntil = performance.now() + RESUME_DELAY;
  };

  const onKey = (e: RKeyboardEvent<HTMLDivElement>) => {
    const st = s.current;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    st.vel = (e.key === "ArrowRight" ? 1 : -1) * 14;
    st.pausedUntil = performance.now() + RESUME_DELAY;
  };

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label="Client logos. Drag or use arrow keys to browse."
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") s.current.hover = 0.3;
      }}
      onPointerLeave={() => (s.current.hover = 1)}
      onDragStart={(e) => e.preventDefault()}
      className="relative w-full cursor-grab select-none overflow-hidden py-4 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/30"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        touchAction: "pan-y",
      }}
    >
      <div ref={trackRef} className="flex w-max flex-nowrap will-change-transform">
        {[false, true].map((dup) => (
          <ul
            key={String(dup)}
            aria-hidden={dup || undefined}
            className="flex shrink-0 items-center gap-5 pr-5"
          >
            {items.map((client) => (
              <li
                key={`${dup ? "dup-" : ""}${client.logo}`}
                data-logo={dup ? undefined : ""}
                data-tilt={dup ? undefined : ""}
                className="group relative flex h-20 w-36 shrink-0 items-center justify-center rounded-2xl bg-white p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-[0_24px_50px_-16px_rgba(0,0,0,0.35)] sm:h-24 sm:w-44 sm:p-6 [transform-style:preserve-3d] [will-change:transform]"
                onPointerMove={(e) => {
                  if (dup) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
                  e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(160px circle at var(--mx,50%) var(--my,50%), rgba(0,0,0,0.08), transparent 70%)",
                  }}
                />
                <Image
                  src={client.logo}
                  alt={dup ? "" : client.name}
                  width={160}
                  height={80}
                  sizes="(max-width: 640px) 144px, 176px"
                  unoptimized
                  draggable={false}
                  className="relative h-full w-full object-contain grayscale opacity-70 transition duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default function Clients({ items }: { items: ContentClient[] }) {
  const clients = items.filter((item) => item.logo_url).map((item) => ({ name: item.name, logo: item.logo_url! }));
  const scope = useRef<HTMLElement>(null);

  if (!clients.length) return null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const scroller = scope.current?.closest<HTMLElement>(".frame-scroll");

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: Array<() => void> = [];

        // Headline: words rise in on scroll.
        gsap.from("[data-word]", {
          yPercent: 110,
          duration: 1,
          ease: "power4.out",
          stagger: 0.035,
          scrollTrigger: { trigger: scope.current, scroller, start: "top 80%" },
        });

        // Highlight covers sweep open behind the highlighted words.
        gsap.from("[data-hl-cover]", {
          scaleX: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.6,
          delay: 0.5,
          scrollTrigger: { trigger: scope.current, scroller, start: "top 80%" },
        });

        // Logos fly in with a 3D flip, radiating from the center.
        gsap.from("[data-logo]", {
          y: 50,
          opacity: 0,
          rotateX: -40,
          transformPerspective: 900,
          duration: 1,
          ease: "back.out(1.6)",
          stagger: { each: 0.06, from: "center" },
          scrollTrigger: { trigger: "[data-logo]", scroller, start: "top 90%" },
        });

        // Ambient blobs drift around the section.
        gsap.to("[data-blob]", {
          x: "random(-90,90)",
          y: "random(-70,70)",
          scale: "random(0.85,1.25)",
          duration: 6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: { each: 1.2, repeat: -1 },
        });

        // 3D tilt that follows the pointer on desktop.
        const tiltCards = gsap.utils.toArray<HTMLElement>("[data-tilt]");
        tiltCards.forEach((card) => {
          gsap.set(card, { transformPerspective: 700 });
          const rx = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3" });
          const ry = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3" });

          const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 20);
            rx((0.5 - py) * 20);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };

          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope }
  );

  const row1 = clients.slice(0, 8);
  const row2 = clients.slice(8);

  return (
    <section
      ref={scope}
      className="relative isolate overflow-hidden bg-[var(--background)] px-6 py-28 font-sans text-[var(--foreground)] antialiased"
    >
      <div
        data-blob
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-[var(--highlight)]/25 blur-3xl"
      />
      <div
        data-blob
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-[var(--accent)]/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <span className="inline-flex rounded-full border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--foreground)]/60">
          My clients
        </span>

        <h2 className="mt-7 text-balance text-[clamp(1.75rem,4.2vw,3.8rem)] font-semibold leading-[1.12] tracking-[-0.05em]">
          {HEADLINE.map((t, i) => (
            <span
              key={i}
              className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] align-top"
            >
              <span data-word className="inline-block">
                {t.hl ? (
                  <Hl>{t.text}</Hl>
                ) : (
                  t.text
                )}
              </span>
            </span>
          ))}
        </h2>
      </div>

      <div className="relative mt-16 space-y-6">
        <LogoMarquee items={row1} dir={1} />
        <LogoMarquee items={row2} dir={-1} />
      </div>
    </section>
  );
}
