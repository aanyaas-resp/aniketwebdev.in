"use client";

import { useInView } from "@/lib/use-in-view";
import { type CSSProperties, type ReactNode } from "react";

export type RevealVariant = "fade" | "blur" | "scale";

const variantClass: Record<RevealVariant, string> = {
  fade: "reveal",
  blur: "reveal-blur",
  scale: "reveal-scale",
};

// Animates children into view. "blur" (default for cards) resolves from a soft blur.
export default function Reveal({
  children,
  delay = 0,
  variant = "blur",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  className?: string;
}) {
  const { ref, visible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${variantClass[variant]} ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
