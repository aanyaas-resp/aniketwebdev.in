"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// One place that controls scroll-linked motion on the site. Sections opt in with data attributes:
//   data-parallax                     slow vertical drift tied to scroll
//   data-count-to="101" [data-count-suffix="+"]  number counts up as the section scrolls in
//   data-pin-steps + data-step + data-progress   pinned step sequence (desktop)
//   data-projects-scroll + data-project-row      auto-scrolling project rows
//   data-reading-progress + data-reading-target  reading progress bar on articles
// Everything runs only for visitors without reduced-motion preference.
// The page keeps its full text in the HTML, so search engines read every value.
export default function ScrollEffects() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const scroller = rootRef.current?.closest<HTMLElement>(".frame-scroll");
      if (!scroller) return;

      const q = <T extends Element>(sel: string) => Array.from(scroller.querySelectorAll<HTMLElement>(sel)) as T[];
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let projectTimeline: gsap.core.Timeline | undefined;

        // 1. Parallax drift
        q<HTMLElement>("[data-parallax]").forEach((el) => {
          gsap.to(el, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              scroller,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        // 2. Scroll-linked counters
        q<HTMLElement>("[data-count-to]").forEach((el) => {
          const target = Number(el.dataset.countTo ?? 0);
          const suffix = el.dataset.countSuffix ?? "";
          const counter = { value: 0 };
          el.textContent = `0${suffix}`;
          gsap.to(counter, {
            value: target,
            ease: "none",
            onUpdate: () => {
              el.textContent = `${Math.round(counter.value)}${suffix}`;
            },
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 85%",
              end: "top 35%",
              scrub: true,
            },
          });
        });

        // 3. Pinned process steps (desktop only)
        mm.add("(min-width: 768px)", () => {
          const section = scroller.querySelector<HTMLElement>("[data-pin-steps]");
          if (!section) return;
          const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-step]"));
          const bar = section.querySelector<HTMLElement>("[data-progress]");
          if (steps.length === 0) return;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              scroller,
              pin: true,
              start: "top top",
              end: () => `+=${Math.round(window.innerHeight * 1.4)}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: steps.length }, 0);
          steps.forEach((step, i) => {
            tl.fromTo(step, { opacity: 0.3, y: 28 }, { opacity: 1, y: 0, duration: 1 }, i);
          });
          return () => tl.kill();
        });

        // 4. Auto-scrolling horizontal project rows
        const section = scroller.querySelector<HTMLElement>("[data-projects-scroll]");
        const rows = Array.from(
          section?.querySelectorAll<HTMLElement>("[data-project-row]") ?? [],
        ).flatMap((row) => {
          const track = row.querySelector<HTMLElement>("[data-project-track]");
          return track ? [{ row, track }] : [];
        });
        if (section && rows.length > 0) {
          const distance = ({ track }: (typeof rows)[number]) =>
            track.scrollWidth / 2;
          const duration = Math.max(16, Math.max(...rows.map(distance)) / 45);
          const timeline = gsap.timeline({
            repeat: -1,
          });

          projectTimeline = timeline;

          rows.forEach((row, index) => {
            if (index % 2 === 0) {
              timeline.to(row.track, {
                x: () => -distance(row),
                duration,
                ease: "none",
              }, 0);
            } else {
              timeline.fromTo(
                row.track,
                { x: () => -distance(row) },
                { x: 0, duration, ease: "none" },
                0,
              );
            }
          });
        }

        // 5. Reading progress on articles
        q<HTMLElement>("[data-reading-progress]").forEach((bar) => {
          const target = scroller.querySelector<HTMLElement>("[data-reading-target]");
          if (!target) return;
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: target,
                scroller,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
              },
            },
          );
        });

        // Images and fonts change layout after load: recalculate every trigger
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);
        document.fonts?.ready.then(refresh);
        return () => {
          projectTimeline?.kill();
          window.removeEventListener("load", refresh);
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [pathname], revertOnUpdate: true },
  );

  return <div ref={rootRef} aria-hidden="true" className="hidden" />;
}
