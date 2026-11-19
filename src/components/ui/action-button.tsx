"use client";

import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";

type ActionButtonProps = {
  href: string;
  variant: "primary" | "secondary";
  children: ReactNode;
};

export function ActionButton({
  href,
  variant,
  children,
}: ActionButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    element.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  }

  const variantStyles =
    variant === "primary"
      ? "ps-6 pe-14 hover:ps-14 hover:pe-6 border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_24px_rgba(255,255,255,0.12)] hover:border-[var(--accent)] hover:brightness-95"
      : "px-6 border-[var(--foreground)]/25 bg-[var(--foreground)]/5 text-[var(--foreground)]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.2)] hover:border-[var(--foreground)]/45 hover:bg-[var(--foreground)]/10";

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`group relative inline-flex h-12 w-fit items-center overflow-hidden rounded-full border p-1 text-sm font-medium backdrop-blur-xl transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${variantStyles}`}
    >
      <span className="whitespace-nowrap">{children}</span>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)] text-[var(--foreground)] transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </span>
      )}
    </Link>
  );
}
