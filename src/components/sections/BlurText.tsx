"use client";

import { type CSSProperties } from "react";
import { useInView } from "@/lib/use-in-view";

// Headline that resolves word by word from a blur. Words listed in `highlight`
// get the lime keyword pill from the banner style.
export default function BlurText({
  text,
  as: Tag = "h2",
  id,
  className = "",
  delay = 0,
  highlight = [],
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  delay?: number;
  highlight?: string[];
}) {
  const { ref, visible } = useInView<HTMLHeadingElement>(0.3);
  const words = text.split(" ");
  const marks = highlight.map((h) => h.toLowerCase());

  return (
    <Tag ref={ref as never} id={id} aria-label={text} className={`${className} ${visible ? "is-visible" : ""}`}>
      {words.map((word, i) => {
        const key = word.replace(/[^\w]/g, "").toLowerCase();
        const isMarked = marks.includes(key);
        return (
          <span
            key={`${word}-${i}`}
            aria-hidden="true"
            className="blur-word"
            style={{ "--i": i, "--reveal-delay": `${delay}ms` } as CSSProperties}
          >
            <span className={isMarked ? "hl" : ""}>{word}</span>
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </Tag>
  );
}
