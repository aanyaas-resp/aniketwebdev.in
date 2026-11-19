"use client";

import { useActionState, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGithub, SiInstagram, SiThreads } from "react-icons/si";
import type { IconType } from "react-icons";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { ShaderBackground } from "@/components/ui/shader-background";

const initial: ContactState = { ok: false, message: "" };

const services = ["Website development", "App development", "SEO / AEO / GEO", "E-commerce", "Ads optimization", "Something else"];

const phone = "9146293702";
const whatsappUrl = `https://wa.me/91${phone}`;
const email = "aniketjamunde4@gmail.com";
const emailUrl = `mailto:${email}?subject=${encodeURIComponent("Let's build something together")}&body=${encodeURIComponent("Hi Aniket,\n\nI would like to discuss a project.")}`;

const socials: { label: string; handle: string; href: string; icon: IconType }[] = [
  { label: "LinkedIn", handle: "Aniket Jamunde", href: "https://www.linkedin.com/in/aniketjamunde/", icon: FaLinkedinIn },
  { label: "Instagram", handle: "@aniketwebdev_in", href: "https://www.instagram.com/aniketwebdev_in/", icon: SiInstagram },
  { label: "Threads", handle: "@aniket_jamunde_002", href: "https://www.threads.com/@aniket_jamunde_002", icon: SiThreads },
  { label: "GitHub", handle: "Aniketjamunde9146", href: "https://github.com/Aniketjamunde9146/", icon: SiGithub },
];

const inputClass =
  "w-full rounded-2xl border border-[var(--foreground)]/12 bg-[var(--background)] px-4 py-3.5 text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground)]/50 transition-all duration-200 hover:border-[var(--foreground)]/25 focus:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]";

function ContactDetail({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--foreground)]/15 bg-[var(--foreground)]/[0.06]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]/50">
          {label}
        </p>
        <div className="mt-1 text-sm leading-5 text-[var(--foreground)]/85">{children}</div>
      </div>
    </div>
  );
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initial);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-[var(--background)] px-4 py-14 text-[var(--foreground)] sm:px-8 sm:py-20"
    >
      <div className="mx-auto grid w-full max-w-[1200px] gap-3 rounded-[36px] border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.025] p-2 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative isolate flex flex-col overflow-hidden rounded-[30px] bg-[var(--background)] p-6 sm:p-9">
          <ShaderBackground className="pointer-events-none absolute inset-0 z-0 rounded-[32px]" />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-[var(--background)]/45"
          />

          <div className="relative z-20 flex h-full flex-col">
            <div className="flex items-center justify-between gap-4">
              <a href="/" aria-label="Aniket Jamunde home" className="inline-flex items-center gap-2.5">
                <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
                <span className="text-lg font-semibold tracking-[-0.04em]">Aniket Jamunde</span>
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--foreground)]/20 bg-[var(--background)]/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--foreground)]/75 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--highlight)]" />
                Open for projects
              </span>
            </div>

            <div className="mt-10">
              <h2
                id="contact-heading"
                className="max-w-[13ch] text-balance text-[clamp(2.35rem,4.4vw,4rem)] font-semibold leading-[0.96] tracking-[-0.065em]"
              >
                Ready to build a <span className="hl">website or app?</span>
              </h2>
              <a
                href="#contact-form"
                className="mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)]"
              >
                Contact me
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]/55">
                Call or WhatsApp
              </p>
              <a
                href={`tel:+91${phone}`}
                className="mt-1 block whitespace-nowrap text-[clamp(2rem,4.7vw,4rem)] font-semibold leading-none tracking-[-0.07em] transition-opacity hover:opacity-75"
              >
                {phone}
              </a>
            
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-[var(--foreground)]/20 bg-[var(--foreground)]/[0.06] px-4 text-sm font-medium backdrop-blur-md transition-colors hover:bg-[var(--foreground)]/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/50"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Chat on WhatsApp
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-8 grid gap-4 border-t border-[var(--foreground)]/15 pt-5 sm:mt-auto sm:grid-cols-2">
              <ContactDetail icon={MapPin} label="Visit">
                Chhatrapati Sambhajinagar, Maharashtra
              </ContactDetail>
              <ContactDetail icon={Mail} label="Email">
                <a href={`mailto:${email}`} className="break-all hover:underline">
                  {email}
                </a>
                <a
                  href={emailUrl}
                  className="mt-1 inline-flex items-center gap-1 font-medium text-[var(--foreground)]"
                >
                  Email now <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </ContactDetail>

              <nav
                aria-label="Social profiles"
                className="grid grid-cols-2 gap-2 sm:col-span-2"
              >
                {socials.map(({ label, handle, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit Aniket on ${label}: ${handle}`}
                    className="flex h-10 min-w-0 items-center gap-2 rounded-full border border-[var(--foreground)]/15 bg-[var(--background)]/20 px-3 text-[var(--foreground)]/75 transition-all hover:-translate-y-0.5 hover:border-[var(--foreground)]/40 hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/50"
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate text-[11px] font-medium">{handle}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        <div className="relative isolate flex items-center overflow-hidden rounded-[30px] bg-[var(--secondary)] p-5 text-[var(--background)] sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-28 z-0 h-72 w-72 rounded-full bg-[var(--highlight)]/20 blur-3xl" />
          <form id="contact-form" action={formAction} className="relative z-10 grid w-full gap-4 sm:gap-5">
            {/* Honeypot field: hidden from people, visible to bots */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <input type="hidden" name="source_page" value="/" />

            <div className="mb-1 flex items-start justify-between gap-4">
              <div>
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--background)]/65">
                <span className="text-[var(--highlight)]">01</span> / Project inquiry
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Let’s make it happen.
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--background)]/70">
                Share a few details and I’ll get back to you with a clear next step.
              </p>
              </div>
              <span aria-hidden="true" className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--background)]/15 bg-[var(--background)]/[0.06] sm:flex">
                <ArrowUpRight className="h-5 w-5 text-[var(--highlight)]" />
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input name="name" required maxLength={100} placeholder="Your name" aria-label="Your name" className={inputClass} />
              <input name="email" type="email" required maxLength={150} placeholder="Email address" aria-label="Email address" className={inputClass} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="phone" type="tel" maxLength={30} placeholder="Phone or WhatsApp (optional)" aria-label="Phone" className={inputClass} />
              <select name="service" defaultValue="" aria-label="Service you need" className={inputClass}>
                <option value="" disabled>
                  What do you need?
                </option>
                {services.map((s) => (
                  <option key={s} value={s} className="bg-[var(--background)]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <textarea name="message" required maxLength={2000} rows={6} placeholder="Tell me about your project" aria-label="Project details" className={inputClass} />

            <button
              type="submit"
              disabled={pending}
              className="group mt-2 inline-flex h-12 w-fit justify-self-center items-center justify-between gap-4 rounded-full bg-[var(--accent)] py-1 pl-6 pr-1 text-[15px] font-semibold text-[var(--accent-ink)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--background)] disabled:translate-y-0 disabled:opacity-60"
            >
              {pending && <span aria-hidden="true" className="loader-spin h-4 w-4 rounded-full border-2 border-current/30 border-t-current" />}
              {pending ? "Sending..." : "Send message"}
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--background)] text-[var(--foreground)] transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>

            {state.message && (
              <p role="status" className={`text-sm ${state.ok ? "text-emerald-400" : "text-rose-400"}`}>
                {state.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
