import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LifeBuoy, LogOut } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import AdminNav, { type NavItem } from "@/components/admin/AdminNav";
import PendingActionButton from "@/components/admin/PendingActionButton";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login?error=forbidden");

  const { count: newEnquiries } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true }).is("deleted_at", null)
    .eq("handled", false);

  const items: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/admin/contact", label: "Enquiries", icon: "enquiries", badge: newEnquiries ?? 0 },
    { href: "/admin/projects", label: "Projects", icon: "projects" },
    { href: "/admin/blog", label: "Blog", icon: "blog" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "testimonials" },
    { href: "/admin/clients", label: "Clients", icon: "clients" },
    { href: "/admin/payments", label: "Payments", icon: "payments" },
    { href: "/admin/invoices", label: "Invoices", icon: "invoices" },
    { href: "/admin/trash", label: "Trash", icon: "trash" },
    { href: "/admin/settings", label: "Theme & Settings", icon: "settings" },
  ];

  return (
    <div className="admin-shell min-h-dvh md:flex">
      <aside className="relative z-20 flex flex-col border-b border-white/10 bg-[var(--secondary)] px-4 py-4 text-[var(--background)] md:sticky md:top-0 md:h-dvh md:w-[264px] md:shrink-0 md:border-b-0 md:border-r md:border-white/10 md:px-5 md:py-7">
        <div className="flex items-center justify-between gap-2">
        <Link href="/admin" className="flex h-10 min-w-0 items-center px-2">
          <span className="text-[19px] font-semibold tracking-[-0.055em] text-[var(--background)]">
            Aniket Jamunde
          </span>
        </Link>
        <div className="flex items-center gap-1 md:hidden">
          <a href="/" aria-label="View website" className="grid h-10 w-10 place-items-center rounded-xl text-[var(--background)]/70 hover:bg-white/10"><ExternalLink size={17} /></a>
          <form action={signOut}><PendingActionButton pendingLabel=" " aria-label="Sign out" className="grid h-10 w-10 place-items-center rounded-xl text-[var(--background)]/70 hover:bg-white/10"><LogOut size={17} /></PendingActionButton></form>
        </div>
        </div>

        <p className="mt-8 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--background)]/40 md:block">
          Manage
        </p>
        <AdminNav items={items} />

        <div className="mt-auto hidden space-y-1 border-t border-white/10 pt-4 md:block">
          <a href="https://aniketwebdev.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--background)]/60 transition-colors hover:bg-white/10 hover:text-[var(--background)]">
            <LifeBuoy size={17} strokeWidth={1.8} aria-hidden="true" /> Support
          </a>
          <a href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--background)]/60 transition-colors hover:bg-white/10 hover:text-[var(--background)]">
            <ExternalLink size={17} strokeWidth={1.8} aria-hidden="true" /> View website
          </a>
          <form action={signOut} className="pt-2">
            <PendingActionButton pendingLabel="Signing out..." className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[var(--background)]/60 transition-colors hover:bg-white/10 hover:text-[var(--background)]">
              <LogOut size={17} strokeWidth={1.8} aria-hidden="true" /> Sign out
            </PendingActionButton>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 hidden h-[68px] items-center justify-between border-b border-[var(--foreground)]/8 bg-[var(--background)]/90 px-8 backdrop-blur-xl md:flex xl:px-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-[var(--foreground)]/55">Workspace online</span>
          </div>
          <div className="flex h-9 items-center rounded-full border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.035] px-4 text-xs font-medium text-[var(--foreground)]/70">
            {user.email ?? "Administrator"}
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 md:px-9 md:py-10 xl:px-12">{children}</div>
      </main>
    </div>
  );
}
