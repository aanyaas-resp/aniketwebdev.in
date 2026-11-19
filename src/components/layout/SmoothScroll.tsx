"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

// Smooth mouse-wheel scrolling for the site's scroll frame (.frame-scroll).
// Touch, keyboard, scrollbars and nested scroll areas keep their native behaviour.
// Turned off for touch screens and for visitors who prefer reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>(".frame-scroll");
    if (!scroller) return;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reduced.matches) return;

    let target = scroller.scrollTop;
    let tweening = false;
    let tween: gsap.core.Tween | null = null;

    const insideNativeScroll = (node: EventTarget | null) => {
      let el = node as HTMLElement | null;
      while (el && el !== scroller) {
        if (el.hasAttribute("data-native-scroll")) return true;
        const { overflowY } = getComputedStyle(el);
        if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) return true;
        el = el.parentElement;
      }
      return false;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || insideNativeScroll(event.target)) return;
      event.preventDefault();
      const max = scroller.scrollHeight - scroller.clientHeight;
      target = Math.min(max, Math.max(0, target + event.deltaY));
      tween?.kill();
      tween = gsap.to(scroller, {
        scrollTop: target,
        duration: 1.1,
        ease: "power3.out",
        onStart: () => {
          tweening = true;
        },
        onComplete: () => {
          tweening = false;
        },
      });
    };

    // Keep the target in sync when the user scrolls by other means
    const onScroll = () => {
      if (!tweening) target = scroller.scrollTop;
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", onScroll);
      tween?.kill();
    };
  }, []);

  return null;
}
