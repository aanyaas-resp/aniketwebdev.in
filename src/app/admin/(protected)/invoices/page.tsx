import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { effectiveInvoiceStatus, formatMoney, invoiceBalance, invoiceStatusLabel } from "@/lib/invoices";

const badge: Record<string, string> = {
  draft: "bg-[var(--foreground)]/8 text-[var(--foreground)]/60",
  sent: "bg-sky-500/10 text-sky-700",
  partially_paid: "bg-amber-500/15 text-amber-800",
  paid: "bg-emerald-500/15 text-emerald-800",
  overdue: "bg-rose-500/12 text-rose-700",
  cancelled: "bg-[var(--foreground)]/8 text-[var(--foreground)]/45",
};

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const [{ data: invoices, error: invoiceError }, { data: payments, error: paymentError }] = await Promise.all([
    supabase.from("invoices").select("*").order("invoice_date", { ascending: false }),
    supabase.from("payments").select("invoice_id,amount"),
  ]);

  if (invoiceError || paymentError) {
    return <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6"><h1 className="text-2xl font-semibold">Invoices</h1><p className="mt-2 text-sm text-[var(--foreground)]/65">Run supabase/FULL-SETUP.sql in Supabase to enable invoices.</p></section>;
  }

  const rows = invoices ?? [];
  const paidByInvoice = new Map<string, number>();
  for (const payment of payments ?? []) if (payment.invoice_id) paidByInvoice.set(payment.invoice_id, (paidByInvoice.get(payment.invoice_id) ?? 0) + Number(payment.amount));
  const enriched = rows.map((invoice) => ({ ...invoice, paidAmount: paidByInvoice.get(invoice.id) ?? 0, currentStatus: effectiveInvoiceStatus(invoice, paidByInvoice.get(invoice.id) ?? 0) }));
  const due = enriched.filter((invoice) => invoice.currency === "INR" && !["paid", "cancelled", "draft"].includes(invoice.currentStatus)).reduce((sum, invoice) => sum + invoiceBalance(Number(invoice.total), invoice.paidAmount), 0);
  const overdue = enriched.filter((invoice) => invoice.currentStatus === "overdue");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/45">Finance</p><h1 className="text-[36px] font-semibold leading-none tracking-[-0.05em] sm:text-[42px]">Invoices</h1><p className="mt-3 text-sm text-[var(--foreground)]/55">Create, share and track what clients owe.</p></div>
        <Link href="/admin/invoices/new" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-[13px] font-semibold text-[var(--accent-ink)]"><Plus size={16} /> New invoice</Link>
      </header>
      {params.error && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-700">{params.error}</p>}
      {params.saved && <p role="status" className="rounded-xl bg-[var(--accent)]/15 px-4 py-3 text-sm">Invoice updated.</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Invoices" value={String(rows.length)} />
        <Metric label="Outstanding (INR)" value={formatMoney(due)} />
        <Metric label="Overdue" value={String(overdue.length)} detail={overdue.length ? formatMoney(overdue.reduce((sum, invoice) => sum + invoiceBalance(Number(invoice.total), invoice.paidAmount), 0)) : "All clear"} />
      </div>

      {enriched.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--foreground)]/15 p-12 text-center"><h2 className="font-semibold">No invoices yet</h2><p className="mt-2 text-sm text-[var(--foreground)]/55">Create your first invoice and its number will be generated automatically.</p><Link href="/admin/invoices/new" className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)]"><Plus size={16} /> Create invoice</Link></div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)]">
          <div className="hidden grid-cols-[1fr_1.4fr_1fr_1fr_1fr_32px] gap-3 border-b border-[var(--foreground)]/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground)]/45 sm:grid"><span>Invoice</span><span>Client / project</span><span>Due</span><span>Status</span><span className="text-right">Balance</span><span /></div>
          {enriched.map((invoice) => {
            const balance = invoiceBalance(Number(invoice.total), invoice.paidAmount);
            const status = invoice.currentStatus;
            return <Link key={invoice.id} href={`/admin/invoices/${invoice.id}`} className="grid gap-2 border-b border-[var(--foreground)]/[0.06] px-5 py-4 transition-colors last:border-0 hover:bg-[var(--foreground)]/[0.025] sm:grid-cols-[1fr_1.4fr_1fr_1fr_1fr_32px] sm:items-center sm:gap-3">
              <span><span className="block text-sm font-semibold">{invoice.invoice_number}</span><span className="mt-1 block text-[11px] text-[var(--foreground)]/45">{new Date(`${invoice.invoice_date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></span>
        <span><span className="block text-sm">{invoice.client_name}</span><span className="mt-1 block truncate text-xs text-[var(--foreground)]/50">{invoice.project_title}</span></span>
              <span className="text-xs text-[var(--foreground)]/60">{new Date(`${invoice.due_date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${badge[status] ?? badge.sent}`}>{invoiceStatusLabel[status] ?? status}</span></span>
              <span className="text-sm font-semibold tabular-nums sm:text-right">{formatMoney(balance, invoice.currency)}<span className="block text-[10px] font-normal text-[var(--foreground)]/45">of {formatMoney(Number(invoice.total), invoice.currency)}</span></span>
              <ArrowUpRight size={16} className="hidden text-[var(--foreground)]/40 sm:block" />
            </Link>;
          })}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <div className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5"><p className="text-xs font-medium text-[var(--foreground)]/50">{label}</p><p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{value}</p>{detail && <p className="mt-1 text-[11px] text-[var(--foreground)]/45">{detail}</p>}</div>;
}
