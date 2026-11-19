import Link from "next/link";

const leftLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
];

const rightLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

function NavLinks({ links }: { links: typeof leftLinks }) {
  return (
    <div className="flex items-center gap-0 sm:gap-4">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="whitespace-nowrap text-[11px] font-medium text-[var(--foreground)]/75 transition-colors hover:text-[var(--foreground)] sm:text-xs"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-50">
      <div className="liquid-notch pointer-events-auto absolute left-1/2 top-0 -translate-x-1/2">
        <svg
          aria-hidden="true"
          viewBox="0 0 128 36"
          preserveAspectRatio="none"
          className="liquid-notch-shape pointer-events-none absolute inset-0 text-[var(--foreground)]/15"
        >
          <path
            d="M0 0H128C110 0 111 12 99 23C89 32 79 35 64 35C49 35 39 32 29 23C17 12 18 0 0 0Z"
            style={{ fill: "var(--background)" }}
            stroke="currentColor"
          />
        </svg>

        <nav
          aria-label="Primary"
          className="liquid-notch-links absolute inset-x-0 top-0 z-10 grid h-6 grid-cols-[minmax(0,1fr)_132px_minmax(0,1fr)] items-start pt-1"
        >
          <div className="flex justify-end">
            <NavLinks links={leftLinks} />
          </div>
          <div />
          <div className="flex justify-start">
            <NavLinks links={rightLinks} />
          </div>
        </nav>

        <Link
          href="/"
          aria-label="Aniket Jamunde home"
          className="pointer-events-auto absolute left-1/2 top-0 z-20 flex h-9 w-[88px] -translate-x-1/2 items-center justify-center pt-0.5 sm:h-10 sm:w-[112px] sm:-translate-y-1/2 sm:pt-[3px]"
        >
          <img
            src="/logo.png"
            alt=""
            className="h-full w-full object-contain object-center"
          />
        </Link>
      </div>
    </header>
  );
}
