"use client";

import type { ReactNode } from "react";
import ScrollEffects from "@/components/layout/ScrollEffects";
import SmoothScroll from "@/components/layout/SmoothScroll";

export default function SiteAnimations({ children }: { children: ReactNode }) {
  return (
    <div className="contents">
      {children}
      <ScrollEffects />
      <SmoothScroll />
    </div>
  );
}
