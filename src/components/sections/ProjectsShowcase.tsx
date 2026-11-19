"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import type { Project } from "@/lib/content";
import Reveal from "./Reveal";

const BASE_SPEED = 55; // px per second at normal speed
const RESUME_DELAY = 2200; // ms of no interaction before auto-scroll resumes after a drag
const DRAG_THRESHOLD = 6; // px a pointer must move before it counts as a drag, not a tap
const ROW_SIZE = 6;

const CARD_WIDTH =
  "w-[min(82vw,400px)] shrink-0 sm:w-[min(70vw,460px)] lg:w-[352px]";

const EDGE_MASK =
  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)";

// Keeps x inside one loop length so the row never shows an empty gap.
const wrap = (x: number, half: number) =>
  half ? -((((-x % half) + half) % half)) : 0;

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
        className="h-full w-full object-cover"
      />
    </span>
  );
}

type RowState = {
  offset: number;
  half: number;
  setX: ((value: number) => void) | null;
  hover: number;
  factor: number;
  boost: number;
  lastScrollY: number;
  visible: boolean;
  dragging: boolean;
  moved: boolean;
  startX: number;
  lastX: number;
  pausedUntil: number;
};

function MarqueeRow({
  projects,
  direction,
}: {
  projects: Project[];
  direction: "ltr" | "rtl";
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const s = useRef<RowState>({
    offset: 0,
    half: 0,
    setX: null,
    hover: 1,
    factor: 1,
    boost: 0,
    lastScrollY: 0,
    visible: true,
    dragging: false,
    moved: false,
    startX: 0,
    lastX: 0,
    pausedUntil: 0,
  });
  const dir = direction === "ltr" ? 1 : -1;

  useEffect(() => {
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return;

    const st = s.current;
    st.setX = gsap.quickSetter(track, "x", "px") as (value: number) => void;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      st.half = track.scrollWidth / 2;
      st.offset = wrap(st.offset, st.half);
      st.setX?.(st.offset);
    };

    measure();
    // Left-to-right rows start at -half so they can move right without a gap.
    st.offset = dir > 0 ? -st.half : 0;
    st.setX?.(st.offset);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);

    // Skip all work for rows that are off-screen.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        st.visible = entry.isIntersecting;
      },
      { rootMargin: "120px" }
    );
    intersectionObserver.observe(row);

    st.lastScrollY = window.scrollY;

    const tick = (_time: number, deltaTime: number) => {
      const dt = Math.min(deltaTime, 50);

      // Scroll speed boosts the row briefly, then it settles back to normal.
      const sy = window.scrollY;
      const perFrame = Math.abs(sy - st.lastScrollY) / Math.max(dt / 16.67, 1);
      st.lastScrollY = sy;

      if (!st.visible) return;

      const target = Math.min(perFrame / 10, 3);
      st.boost += (target - st.boost) * 0.1;
      st.factor += (st.hover - st.factor) * 0.08;

      const autoAllowed =
        !reduceMotion &&
        !st.dragging &&
        performance.now() >= st.pausedUntil &&
        st.half > 0;

      if (!autoAllowed) return;

      st.offset = wrap(
        st.offset + dir * BASE_SPEED * (1 + st.boost) * st.factor * (dt / 1000),
        st.half
      );
      st.setX?.(st.offset);
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [dir]);

  // --- Manual drag handlers ---

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const st = s.current;
    st.dragging = true;
    st.moved = false;
    st.startX = e.clientX;
    st.lastX = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    if (!st.dragging) return;

    if (!st.moved) {
      if (Math.abs(e.clientX - st.startX) <= DRAG_THRESHOLD) return;
      // Only now capture the pointer, so simple taps still reach the card links.
      st.moved = true;
      st.lastX = st.startX;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    const dx = e.clientX - st.lastX;
    st.lastX = e.clientX;
    st.offset = wrap(st.offset + dx, st.half);
    st.setX?.(st.offset);
  };

  const endDrag = () => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    if (st.moved) st.pausedUntil = performance.now() + RESUME_DELAY;
  };

  // After a real drag, swallow the click so releasing doesn't open a project.
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (s.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={rowRef}
      data-project-row
      className="relative w-full select-none overflow-hidden py-3"
      style={{
        maskImage: EDGE_MASK,
        WebkitMaskImage: EDGE_MASK,
        touchAction: "pan-y", // vertical page scroll stays native; horizontal drags go to me
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") s.current.hover = 0.25;
      }}
      onPointerLeave={() => {
        s.current.hover = 1;
      }}
      onClickCapture={onClickCapture}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        ref={trackRef}
        className="flex w-max flex-nowrap will-change-transform [backface-visibility:hidden]"
      >
        {/* Main set: animated reveal */}
        <div className="flex shrink-0 gap-5 pr-5">
          {projects.map((project, index) => (
            <Reveal
              key={project.id}
              variant="blur"
              delay={index * 120}
              className={CARD_WIDTH}
            >
              <NotchedProjectCard
                href={project.live_url ?? undefined}
                title={project.title}
                image={project.image_url ?? undefined}
                imageAlt={project.title}
                description={project.description ?? undefined}
                badge={project.category ?? undefined}
                technologies={project.technologies}
                accent="var(--accent)"
                accentForeground="var(--accent-ink)"
                surface="var(--background)"
              />
            </Reveal>
          ))}
        </div>

        {/* Clone set: plain cards (no Reveal) for less work, hidden from screen readers and tab order */}
        <div aria-hidden="true" inert className="flex shrink-0 gap-5 pr-5">
          {projects.map((project) => (
            <div key={`clone-${project.id}`} className={CARD_WIDTH}>
              <NotchedProjectCard
                href={project.live_url ?? undefined}
                title={project.title}
                image={project.image_url ?? undefined}
                imageAlt={project.title}
                description={project.description ?? undefined}
                badge={project.category ?? undefined}
                technologies={project.technologies}
                accent="var(--accent)"
                accentForeground="var(--accent-ink)"
                surface="var(--background)"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsShowcase({ projects = [] }: { projects?: Project[] }) {
  const rows = useMemo(() => {
    return [projects.slice(0, ROW_SIZE), projects.slice(ROW_SIZE)].filter(
      (row) => row.length > 0,
    );
  }, [projects]);

  if (projects.length === 0) {
    return (
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="bg-[var(--background)] px-5 py-20 text-[var(--foreground)] sm:px-8"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--foreground)]/50">
            Selected work
          </p>
          <h2
            id="projects-heading"
            className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            My portfolio is being updated.
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section
      id="projects"
      data-projects-scroll
      aria-labelledby="projects-heading"
      className="overflow-hidden bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <Reveal>
          <h2
            id="projects-heading"
            className="mx-auto mt-7 max-w-5xl text-balance text-center text-[clamp(1.75rem,4.2vw,3.8rem)] font-semibold leading-[1.12] tracking-[-0.05em]"
          >
            Remarkable{" "}
            <PersonCapsule
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=144&q=80"
              alt="Working on a project"
            />{" "}
            projects
            <span className="block">
              built to <span className="hl">move you forward</span>
            </span>
          </h2>
        </Reveal>

        <div className="mt-14 space-y-6 sm:space-y-8">
          {rows.map((row, rowIndex) => (
            <MarqueeRow
              key={rowIndex}
              projects={row}
              direction={rowIndex % 2 === 0 ? "ltr" : "rtl"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}