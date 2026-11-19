// components/sections/testimonials.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Testimonial } from "@/lib/content";

// Card geometry in SVG units (1140 x 480 design size)
const W = 1140;
const H = 480;
const R = 28; // outer corner radius
const F = 28; // concave fillet radius where a tab meets an edge
const IN = 24; // rounded inner corner of each tab

const LOGO = { w: 185, h: 48 };
const CTRL = { w: 92, h: 50 };
const { w: LW, h: LH } = LOGO;
const { w: CW, h: CH } = CTRL;

const MOBILE_W = 480;
const MOBILE_H = 560;
const MOBILE_LOGO = { w: 150, h: 50 };
const MOBILE_CTRL = { w: 116, h: 54 };
const TESTIMONIAL_BACKDROP =
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80";
const MOBILE_OUTLINE = [
  `M0 ${MOBILE_LOGO.h + 20}`,
  `A20 20 0 0 1 20 ${MOBILE_LOGO.h}`,
  `L${MOBILE_LOGO.w - 16} ${MOBILE_LOGO.h}`,
  `A16 16 0 0 0 ${MOBILE_LOGO.w} ${MOBILE_LOGO.h - 16}`,
  `L${MOBILE_LOGO.w} 20`,
  `A20 20 0 0 1 ${MOBILE_LOGO.w + 20} 0`,
  `L${MOBILE_W - 24} 0`,
  `A24 24 0 0 1 ${MOBILE_W} 24`,
  `L${MOBILE_W} ${MOBILE_H - MOBILE_CTRL.h - 20}`,
  `A20 20 0 0 1 ${MOBILE_W - 20} ${MOBILE_H - MOBILE_CTRL.h}`,
  `L${MOBILE_W - MOBILE_CTRL.w + 16} ${MOBILE_H - MOBILE_CTRL.h}`,
  `A16 16 0 0 0 ${MOBILE_W - MOBILE_CTRL.w} ${MOBILE_H - MOBILE_CTRL.h + 16}`,
  `L${MOBILE_W - MOBILE_CTRL.w} ${MOBILE_H - 20}`,
  `A20 20 0 0 1 ${MOBILE_W - MOBILE_CTRL.w - 20} ${MOBILE_H}`,
  `L24 ${MOBILE_H}`,
  `A24 24 0 0 1 0 ${MOBILE_H - 24}`,
  "Z",
].join(" ");

const AUTOPLAY_MS = 6000;

const outline = [
  `M0 ${LH + F}`,
  `A${F} ${F} 0 0 1 ${F} ${LH}`,
  `L${LW - IN} ${LH}`,
  `A${IN} ${IN} 0 0 0 ${LW} ${LH - IN}`,
  `L${LW} ${F}`,
  `A${F} ${F} 0 0 1 ${LW + F} 0`,
  `L${W - R} 0`,
  `A${R} ${R} 0 0 1 ${W} ${R}`,
  `L${W} ${H - CH - F}`,
  `A${F} ${F} 0 0 1 ${W - F} ${H - CH}`,
  `L${W - CW + IN} ${H - CH}`,
  `A${IN} ${IN} 0 0 0 ${W - CW} ${H - CH + IN}`,
  `L${W - CW} ${H - F}`,
  `A${F} ${F} 0 0 1 ${W - CW - F} ${H}`,
  `L${R} ${H}`,
  `A${R} ${R} 0 0 1 0 ${H - R}`,
  "Z",
].join(" ");

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CardArtwork({
  viewBox,
  width,
  height,
  path,
  clipId,
  image,
  className,
}: {
  viewBox: string;
  width: number;
  height: number;
  path: string;
  clipId: string;
  image: string;
  className: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      className={`absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
        <filter id={`${clipId}-gray`}>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <linearGradient id={`${clipId}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <image
          href={image}
          x="0"
          y="0"
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
          filter={`url(#${clipId}-gray)`}
          style={{ animation: "tmImage 0.9s ease-out forwards" }}
        />
        <rect width={width} height={height} fill={`url(#${clipId}-shade)`} />
      </g>
    </svg>
  );
}

export default function Testimonials({
  items = [],
}: {
  items?: Testimonial[];
}) {
  const testimonials = items.map((item) => ({
    ...item,
    image: TESTIMONIAL_BACKDROP,
  }));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;
  const current = total > 0 ? testimonials[index % total] : null;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  // Auto-advance, paused while the pointer is over the card
  useEffect(() => {
    if (paused || total < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, total]);

  if (!current) return null;

  return (
    <section className="w-full bg-[var(--background)] px-5 py-20 font-sans text-[var(--foreground)] antialiased md:py-28">
      <style>{`
        @keyframes tmFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes tmImage { from { opacity: 0; } to { opacity: 0.8; } }
        @keyframes tmProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>

      <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center text-center">
        <span className="rounded-full border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.05] px-4 py-1.5 text-[15px] text-[var(--foreground)]/80">
          Testimonials
        </span>
        <h2 className="mt-6 text-[clamp(2.25rem,3.85vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.055em]">
          What My <span className="hl">Clients</span>
          <br />
          Say About Working With Us
        </h2>

        <div
          className="relative mt-10 aspect-[6/7] w-full sm:mt-14 sm:aspect-[1140/480]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div key={`artwork-${index}`}>
            <CardArtwork
              viewBox={`0 0 ${MOBILE_W} ${MOBILE_H}`}
              width={MOBILE_W}
              height={MOBILE_H}
              path={MOBILE_OUTLINE}
              clipId="tm-mobile-clip"
              image={current.image}
              className="sm:hidden"
            />
            <CardArtwork
              viewBox={`0 0 ${W} ${H}`}
              width={W}
              height={H}
              path={outline}
              clipId="tm-desktop-clip"
              image={current.image}
              className="hidden sm:block"
            />
          </div>

          {/* Logo tab */}
          <div
            className="absolute left-0 top-0 flex h-[8.93%] w-[31.25%] items-center justify-center sm:h-[10%] sm:w-[16.23%]"
          >
            <Image
              src="/logo.png"
              alt="Aniket Jamunde"
              width={1728}
              height={1000}
              priority
              className="h-[82%] w-[82%] object-contain"
            />
          </div>

          {/* Quote, author, counter and progress */}
          <div
            key={`testimonial-${index}`}
            className="absolute bottom-[16%] left-[5%] right-[5%] text-left sm:bottom-[6.7%] sm:left-[2.8%] sm:right-[10.5%]"
            style={{ animation: "tmFade 0.7s ease-out both" }}
          >
            <p className="text-[14px] font-semibold leading-[1.25] tracking-[-0.03em] text-white sm:text-[18px] lg:text-[26px]">
              “{current.quote}”
            </p>

            <div className="mt-2 flex items-center gap-2 sm:mt-5 sm:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-[12px] font-semibold text-white sm:h-9 sm:w-9 sm:text-[13px]">
                {current.avatar_url ? (
                  <Image
                    src={current.avatar_url}
                    alt=""
                    width={36}
                    height={36}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                ) : (
                  current.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                )}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[var(--highlight)] sm:text-[15px]">
                  {current.name}
                </p>
                <p className="text-[11px] leading-tight text-white/70 sm:text-[13px]">
                  {current.role && current.company
                    ? `${current.role}, ${current.company}`
                    : current.role || current.company}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-3 sm:mt-5">
              <span className="text-[12px] tabular-nums tracking-wider text-white/75">
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <div className="relative h-[2px] w-28 overflow-hidden rounded-full bg-white/25">
                <div
                  className="absolute inset-0 origin-left bg-white"
                  style={{
                    animation: `tmProgress ${AUTOPLAY_MS}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Controls tab */}
          <div className="absolute bottom-0 right-0 flex h-[9.64%] w-[24.17%] items-center justify-center gap-2 rounded-tl-2xl bg-[var(--background)] sm:h-[10.42%] sm:w-[8.07%] sm:gap-1 md:gap-3 lg:gap-5">
            {total > 1 ? (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="text-[var(--foreground)]/80 transition-colors hover:text-[var(--foreground)]"
                >
                  <ArrowLeft />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="text-[var(--foreground)]/80 transition-colors hover:text-[var(--foreground)]"
                >
                  <ArrowRight />
                </button>
              </>
            ) : (
              <span className="text-[12px] tabular-nums tracking-wider text-[var(--foreground)]/70">
                01 / 01
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
