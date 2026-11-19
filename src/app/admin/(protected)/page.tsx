import { ArrowUpRight, CircleDollarSign, CreditCard, FileText, FolderPlus, Mail, Newspaper, Sparkles } from "lucide-react";
import Link from "next/link";
import { RESOURCES } from "@/lib/admin-config";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { effectiveInvoiceStatus, invoiceBalance } from "@/lib/invoices";
import FinanceDashboard from "@/components/admin/FinanceDashboard";

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient();
  const [{ data: payments, error: paymentError }, { data: invoices, error: invoiceError }] = await Promise.all([
    supabase.from("payments").select("amount,payment_date,invoice_id,currency"),
    supabase.from("invoices").select("id,status,due_date,total,currency"),
  ]);

  let finance: {
    collected: number;
    outstanding: number;
    overdueCount: number;
    invoiceCount: number;
    months: { key: string; label: string; amount: number }[];
    statuses: { key: string; label: string; color: string; count: number }[];
  } | null = null;
  if (!paymentError && !invoiceError) {
    const paymentRows = payments ?? [];
    const invoiceRows = invoices ?? [];
    const nowInIndia = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const currentMonth = `${nowInIndia.getFullYear()}-${String(nowInIndia.getMonth() + 1).padStart(2, "0")}`;
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(Date.UTC(nowInIndia.getFullYear(), nowInIndia.getMonth() - 5 + index, 1, 12));
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
      return {
        key,
        label: date.toLocaleDateString("en-IN", { month: "short", timeZone: "Asia/Kolkata" }),
        amount: paymentRows.filter((payment) => String(payment.currency).trim() === "INR" && String(payment.payment_date).startsWith(key)).reduce((sum, payment) => sum + Number(payment.amount), 0),
      };
    });
    const paidByInvoice = new Map<string, number>();
    for (const payment of paymentRows) if (payment.invoice_id) paidByInvoice.set(payment.invoice_id, (paidByInvoice.get(payment.invoice_id) ?? 0) + Number(payment.amount));
    const enriched = invoiceRows.map((invoice) => ({ ...invoice, paid: paidByInvoice.get(invoice.id) ?? 0, status: effectiveInvoiceStatus(invoice, paidByInvoice.get(invoice.id) ?? 0) }));
    const statuses = [
      { key: "paid", label: "Paid", color: "#10b981" },
      { key: "sent", label: "Sent", color: "#38bdf8" },
      { key: "partially_paid", label: "Partially paid", color: "#f59e0b" },
      { key: "overdue", label: "Overdue", color: "#f43f5e" },
      { key: "draft", label: "Draft", color: "#a1a1aa" },
      { key: "cancelled", label: "Cancelled", color: "#d4d4d8" },
    ].map((status) => ({ ...status, count: enriched.filter((invoice) => invoice.status === status.key).length }));
    finance = {
      collected: paymentRows.filter((payment) => String(payment.currency).trim() === "INR" && String(payment.payment_date).startsWith(currentMonth)).reduce((sum, payment) => sum + Number(payment.amount), 0),
      outstanding: enriched.filter((invoice) => String(invoice.currency).trim() === "INR" && !["paid", "cancelled", "draft"].includes(invoice.status)).reduce((sum, invoice) => sum + invoiceBalance(Number(invoice.total), invoice.paid), 0),
      overdueCount: statuses.find((item) => item.key === "overdue")?.count ?? 0,
      invoiceCount: invoiceRows.length,
      months,
      statuses,
    };
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <header className="relative isolate overflow-hidden rounded-[28px] border border-[var(--foreground)]/10 bg-[var(--background)] px-5 py-7 sm:px-8 sm:py-9">
        <div aria-hidden="true" className="absolute -right-16 -top-24 -z-10 h-64 w-64 rounded-full bg-[var(--accent)]/15 blur-3xl" />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
        <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]/45"><Sparkles size={13} /> Aniket Jamunde · Workspace</p>
        <h1 className="mt-3 text-[40px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[52px]">Good to see you.</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--foreground)]/60 sm:text-[15px]">Your studio, at a glance. Pick up where you left off or make something new.</p>
        </div>
        <Link href="/admin/invoices/new" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><FileText size={16} /> Create invoice <ArrowUpRight size={15} /></Link>
        </div>
      </header>

      <section aria-label="Quick actions" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "New project", href: "/admin/projects?new=1", icon: FolderPlus, detail: "Add to your portfolio" },
          { label: "Write a post", href: "/admin/blog?new=1", icon: Newspaper, detail: "Share an update" },
          { label: "View enquiries", href: "/admin/contact", icon: Mail, detail: "Reply to clients" },
          { label: "All invoices", href: "/admin/invoices", icon: FileText, detail: "Track payments" },
          { label: "Record payment", href: "/admin/payments", icon: CircleDollarSign, detail: "Update an invoice balance" },
          { label: "Payment settings", href: "/admin/settings", icon: CreditCard, detail: "Set UPI and bank details" },
        ].map(({ label, href, icon: Icon, detail }) => <Link key={href} href={href} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-3.5 transition hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-lg sm:p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/12 text-[var(--accent)]"><Icon size={18} /></span><span className="min-w-0"><span className="block truncate text-xs font-semibold sm:text-sm">{label}</span><span className="mt-1 block truncate text-[10px] text-[var(--foreground)]/45 sm:text-[11px]">{detail}</span></span><ArrowUpRight className="ml-auto hidden shrink-0 text-[var(--foreground)]/35 transition group-hover:text-[var(--accent)] sm:block" size={15} /></Link>)}
      </section>

      {finance ? <FinanceDashboard collected={finance.collected} outstanding={finance.outstanding} overdueCount={finance.overdueCount} invoiceCount={finance.invoiceCount} months={finance.months.map(({ label, amount }) => ({ label, amount }))} statuses={finance.statuses} /> : (
        <section className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5"><h2 className="text-sm font-semibold">Finance dashboard</h2><p className="mt-1 text-xs text-[var(--foreground)]/50">Run the billing migrations in Supabase to see payment and invoice charts.</p></section>
      )}

      <section aria-labelledby="dashboard-resources-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 id="dashboard-resources-heading" className="text-sm font-semibold tracking-tight">Your workspace</h2>
            <p className="mt-1 text-xs text-[var(--foreground)]/50">Choose an area to manage</p>
          </div>
          <span className="text-xs tabular-nums text-[var(--foreground)]/45">{String(Object.keys(RESOURCES).length).padStart(2, "0")} areas</span>
        </div>
        <nav aria-label="Manage website content" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Object.values(RESOURCES).map((resource, index) => (
            <NotchedProjectCard
              key={resource.key}
              href={`/admin/${resource.key}`}
              title={resource.label}
              hideTitle
              coverAspectClassName="aspect-[1.55/1] min-h-48"
              coverClassName="bg-[var(--accent)] transition-[filter] duration-300 group-hover:brightness-95"
              surface="var(--background)"
              accent="var(--secondary)"
              accentForeground="var(--accent)"
              icon={<ArrowUpRight size={18} aria-hidden="true" />}
              coverContent={
                <div className="absolute inset-0 p-6 text-left">
                  <span className="text-[10px] font-semibold tabular-nums tracking-[0.12em] text-[var(--accent-ink)]/55">/{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-8 pr-16 text-lg font-semibold tracking-[-0.035em] text-[var(--accent-ink)]">{resource.label}</h3>
                  <p className="mt-2 max-w-[280px] pr-12 text-[13px] leading-5 text-[var(--accent-ink)]/75">{resource.description}</p>
                </div>
              }
            />
          ))}
        </nav>
      </section>
    </div>
  );
}
