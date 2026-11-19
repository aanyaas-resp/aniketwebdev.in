"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CreditCard,
  FileText,
  LayoutDashboard,
  Mail,
  Newspaper,
  Settings,
  Star,
  Trash2,
  Users,
} from "lucide-react";

const icons = {
  dashboard: LayoutDashboard,
  enquiries: Mail,
  projects: Briefcase,
  blog: Newspaper,
  testimonials: Star,
  clients: Users,
  payments: CreditCard,
  invoices: FileText,
  trash: Trash2,
  settings: Settings,
};

export type NavItem = { href: string; label: string; icon: keyof typeof icons; badge?: number };

// Sidebar with an active state, so you always know where you are.
export default function AdminNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="mt-3 -mx-1 flex snap-x gap-1 overflow-x-auto overscroll-x-contain px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-5 md:snap-none md:flex-col md:overflow-visible md:px-0 md:pb-0">
      {items.map(({ href, label, icon, badge }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        const Icon = icons[icon];
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-10 shrink-0 snap-start items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors sm:gap-3 sm:px-3.5 sm:text-[13px] sm:py-3 md:min-h-0 ${
              active
                ? "bg-[var(--accent)] text-[var(--accent-ink)] shadow-sm"
                : "text-[var(--background)]/65 hover:bg-white/10 hover:text-[var(--background)]"
            }`}
          >
            <span className="flex items-center gap-3">
              <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
              {label}
            </span>
            {badge ? (
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? "bg-black/10 text-[var(--accent-ink)]" : "bg-white/10 text-[var(--background)]"}`}>{badge}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
