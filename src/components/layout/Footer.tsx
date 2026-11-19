import Link from "next/link";
import type { Settings } from "@/lib/content";
import { inkFor } from "@/lib/theme";
import { ShaderBackground } from "@/components/ui/shader-background";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiInstagram, SiThreads } from "react-icons/si";
import type { IconType } from "react-icons";

const NOTCH_RADIUS = 24;

// Concave corner: a square filled with the page background, with a
// circle punched out so the card's dark color curves into the notch.
const fillet: React.CSSProperties = {
  width: NOTCH_RADIUS,
  height: NOTCH_RADIUS,
  background: `radial-gradient(circle at 100% 100%, transparent ${NOTCH_RADIUS - 0.5}px, var(--background) ${NOTCH_RADIUS}px)`,
};

const pages = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Locations", href: "/locations" },
  { label: "Contact", href: "/contact" },
];

const socials: { label: string; href: string; icon: IconType }[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aniketjamunde/", icon: FaLinkedinIn },
  { label: "Instagram", href: "https://www.instagram.com/aniketwebdev_in/", icon: SiInstagram },
  { label: "Threads", href: "https://www.threads.com/@aniket_jamunde_002", icon: SiThreads },
  { label: "GitHub", href: "https://github.com/Aniketjamunde9146/", icon: SiGithub },
];

const legalPages = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const dark = settings.secondary_color;
  const ink = inkFor(dark);

  return (
    <footer className="w-full bg-[var(--background)] px-4 pb-4 pt-10 md:px-8 md:pb-8 md:pt-14">
      <div
        className="relative isolate mx-auto w-full max-w-[1400px] overflow-hidden rounded-[32px] px-6 pb-8 pt-28 sm:px-10 md:min-h-[520px] md:px-14 md:pt-32"
        style={{ background: dark, color: ink }}
      >
        <ShaderBackground className="pointer-events-none absolute inset-0 z-0 rounded-[32px] opacity-90" />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1]"
          style={{ background: `linear-gradient(135deg, ${dark}cc 0%, ${dark}a8 55%, ${dark}e8 100%)` }}
        />

        {/* Notch: brand tab with concave corners where it meets the card */}
        <Link
          href="/"
          aria-label={`${settings.brand_name} home`}
          className="absolute left-0 top-0 z-20 flex h-16 items-center gap-2.5 bg-[var(--background)] px-5 text-[var(--foreground)] sm:px-6 md:px-8"
          style={{ borderBottomRightRadius: NOTCH_RADIUS }}
        >
          <span aria-hidden="true" className="pointer-events-none absolute left-full top-0" style={fillet} />
          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-full" style={fillet} />

          {settings.logo_url ? (
            <img src={settings.logo_url} alt="" className="h-7 w-auto max-w-[130px] object-contain" />
          ) : (
            <img src="/logo.png" alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
          )}
          <span className="text-[17px] font-semibold tracking-[-0.03em]">{settings.brand_name}</span>
        </Link>

        <Link
          href="/#contact"
          className="absolute right-5 top-5 z-20 inline-flex h-11 items-center rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.12em] backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 sm:right-8 md:right-10"
          style={{ borderColor: `${ink}32`, background: `${ink}12`, color: ink }}
        >
          Start a project
        </Link>

        <div className="relative z-10 grid gap-10 md:grid-cols-[minmax(0,1.55fr)_minmax(240px,0.45fr)] md:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: `${ink}99` }}>
              Let&apos;s build something remarkable
            </p>
            <h2 className="max-w-[760px] text-[clamp(2.5rem,5.8vw,5.25rem)] font-semibold leading-[0.92] tracking-[-0.07em]">
              {settings.tagline ?? "Web, App & AI Development"}
            </h2>
            {(settings.contact_email || settings.phone || settings.whatsapp) && (
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[15px] sm:text-[16px]" style={{ color: `${ink}c5` }}>
                {settings.contact_email && (
                  <li>
                    <a href={`mailto:${settings.contact_email}`} className="underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-current">
                      {settings.contact_email}
                    </a>
                  </li>
                )}
                {settings.phone && (
                  <li>
                    <a href={`tel:${settings.phone}`} className="underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-current">
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings.whatsapp && (
                  <li>
                    <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} className="underline decoration-white/20 underline-offset-4 transition-colors hover:decoration-current">
                      WhatsApp me
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div>
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: `${ink}99` }}>
              Explore
            </p>
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-3 text-[15px] sm:text-[16px]" style={{ color: `${ink}c5` }}>
              {pages.map((page) => (
                <Link key={page.href} href={page.href} className="border-b border-transparent pb-1 transition-colors hover:border-current">
                  {page.label}
                </Link>
              ))}
            </nav>
            <div className="mt-7 flex items-center gap-2">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border transition-transform duration-300 hover:-translate-y-1"
                  style={{ borderColor: `${ink}32`, background: `${ink}10`, color: ink }}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="relative z-10 mt-14 border-t pt-6 text-sm"
          style={{ borderColor: `${ink}22`, color: `${ink}99` }}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <p>&copy; {year} {settings.brand_name}. All rights reserved.</p>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
              {legalPages.map((page) => (
                <Link key={page.href} href={page.href} className="transition-colors hover:text-current">
                  {page.label}
                </Link>
              ))}
            </nav>
          </div>
          {settings.footer_text && (
            <div className="mt-4 text-right">
              <a href={settings.footer_url ?? "https://aniketwebdev.in"} target="_blank" rel="noopener noreferrer" className="hover:opacity-100">
                {settings.footer_text}
              </a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
