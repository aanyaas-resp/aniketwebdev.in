import Link from "next/link";

// Premium back button, pinned to the top-left while the page scrolls.
export default function BackLink({ href, label = "Back" }: { href: string; label?: string }) {
  return (
    <div className="pointer-events-none sticky top-0 z-40 -mb-14 flex justify-start px-5 pt-5 sm:px-8">
      <Link
        href={href}
        className="pointer-events-auto group relative inline-flex h-12 w-fit items-center overflow-hidden rounded-full border border-[var(--accent)] bg-[var(--accent)] p-1 ps-14 pe-6 text-sm font-medium text-[var(--accent-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_24px_rgba(255,255,255,0.12)] backdrop-blur transition-colors duration-300 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <span
          aria-hidden="true"
          className="absolute left-1 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)] text-[var(--foreground)]"
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
            <path d="M19 12H5m7 7-7-7 7-7" />
          </svg>
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </Link>
    </div>
  );
}
