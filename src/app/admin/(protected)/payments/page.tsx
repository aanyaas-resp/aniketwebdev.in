import Link from "next/link";
import PendingActionButton from "@/components/admin/PendingActionButton";
import type { ReactNode } from "react";
import { ArrowUpRight, CircleDollarSign, Plus } from "lucide-react";
import { recordPayment } from "@/app/admin/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { effectiveInvoiceStatus, formatMoney, invoiceBalance, invoiceStatusLabel } from "@/lib/invoices";

const input = "w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-3.5 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60";

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string; invoice?: string }> }) {
  const query = await searchParams;
  const supabase = await createSupabaseServerClient();
  const [{ data: invoices, error: invoicesError }, { data: payments, error: paymentsError }] = await Promise.all([
    supabase.from("invoices").select("id,invoice_number,client_name,project_id,total,currency,due_date,status").order("invoice_date", { ascending: false }),
    supabase.from("payments").select("*").order("payment_date", { ascending: false }),
  ]);

  if (invoicesError || paymentsError) {
    return <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6"><h1 className="text-2xl font-semibold">Payments</h1><p className="mt-2 text-sm text-[var(--foreground)]/65">Run supabase/FULL-SETUP.sql in Supabase to enable payment tracking.</p></section>;
  }

  const invoiceRows = invoices ?? [];
  const paymentRows = payments ?? [];
  const paidByInvoice = new Map<string, number>();
  for (const payment of paymentRows) {
    if (payment.invoice_id) paidByInvoice.set(payment.invoice_id, (paidByInvoice.get(payment.invoice_id) ?? 0) + Number(payment.amount));
  }
  const openInvoices = invoiceRows.filter((invoice) => {
    const status = effectiveInvoiceStatus(invoice, paidByInvoice.get(invoice.id) ?? 0);
    return ["sent", "partially_paid", "overdue"].includes(status);
  });
  const amountReceived = paymentRows.filter((payment) => String(payment.currency).trim() === "INR").reduce((total, payment) => total + Number(payment.amount), 0);
  const thisMonth = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit" });
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  const receivedThisMonth = paymentRows.filter((payment) => String(payment.currency).trim() === "INR" && String(payment.payment_date).startsWith(thisMonth)).reduce((total, payment) => total + Number(payment.amount), 0);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/45">Finance</p><h1 className="text-[36px] font-semibold leading-none tracking-[-0.05em] sm:text-[42px]">Payments</h1><p className="mt-3 text-sm text-[var(--foreground)]/55">Record client payments and see what has been collected.</p></div>
        <Link href="/admin/invoices/new" className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-[13px] font-semibold text-[var(--accent-ink)]"><Plus size={16} /> Create invoice</Link>
      </header>

      {query.error && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-700">{query.error}</p>}
      {query.saved && <p role="status" className="rounded-xl bg-[var(--accent)]/15 px-4 py-3 text-sm">Payment recorded. The invoice balance has been updated.</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Metric label="Collected this month" value={formatMoney(receivedThisMonth)} icon={<CircleDollarSign size={18} />} />
        <Metric label="All recorded (INR)" value={formatMoney(amountReceived)} icon={<CircleDollarSign size={18} />} />
      </div>

      <section className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5 sm:p-6">
        <div className="mb-5"><h2 className="text-sm font-semibold">Record a payment</h2><p className="mt-1 text-xs text-[var(--foreground)]/50">Choose the invoice. Client, project and currency are filled in automatically.</p></div>
        {openInvoices.length === 0 ? (
          <p className="rounded-xl bg-[var(--foreground)]/[0.035] p-4 text-sm text-[var(--foreground)]/60">There are no unpaid sent invoices. <Link href="/admin/invoices/new" className="font-semibold text-[var(--foreground)] underline underline-offset-4">Create an invoice</Link> first.</p>
        ) : (
          <form action={recordPayment} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <label className="sm:col-span-2 xl:col-span-2"><span className="mb-1.5 block text-[11px] font-semibold text-[var(--foreground)]/60">Invoice</span><select className={input} name="invoice_id" required defaultValue={query.invoice ?? ""}><option value="" disabled>Select an unpaid invoice</option>{openInvoices.map((invoice) => <option key={invoice.id} value={invoice.id}>{invoice.invoice_number} · {invoice.client_name} · {formatMoney(invoiceBalance(Number(invoice.total), paidByInvoice.get(invoice.id) ?? 0), invoice.currency)}</option>)}</select></label>
            <label><span className="mb-1.5 block text-[11px] font-semibold text-[var(--foreground)]/60">Amount received</span><input className={input} name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00" /></label>
            <label><span className="mb-1.5 block text-[11px] font-semibold text-[var(--foreground)]/60">Date received</span><input className={input} name="payment_date" type="date" required defaultValue={today} /></label>
            <label><span className="mb-1.5 block text-[11px] font-semibold text-[var(--foreground)]/60">Method</span><select className={input} name="method" defaultValue="bank_transfer"><option value="upi">UPI</option><option value="bank_transfer">Bank transfer</option><option value="cash">Cash</option><option value="card">Card</option><option value="cheque">Cheque</option><option value="other">Other</option></select></label>
            <label className="sm:col-span-2"><span className="mb-1.5 block text-[11px] font-semibold text-[var(--foreground)]/60">Reference (optional)</span><input className={input} name="reference" maxLength={160} placeholder="Transaction ID or cheque number" /></label>
            <div className="flex items-end"><PendingActionButton className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-[13px] font-semibold text-[var(--accent-ink)] hover:brightness-95" pendingLabel="Saving...">Save payment</PendingActionButton></div>
          </form>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between"><div><h2 className="text-sm font-semibold">Payment history</h2><p className="mt-1 text-xs text-[var(--foreground)]/50">{paymentRows.length} recorded</p></div></div>
        {paymentRows.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--foreground)]/15 p-10 text-center text-sm text-[var(--foreground)]/55">Payments you record will appear here.</div> : (
          <div className="overflow-hidden rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)]">
            <div className="hidden grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr] gap-3 border-b border-[var(--foreground)]/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground)]/45 sm:grid"><span>Invoice</span><span>Client</span><span>Date</span><span>Method</span><span className="text-right">Amount</span></div>
            {paymentRows.map((payment) => {
              const invoice = invoiceRows.find((row) => row.id === payment.invoice_id);
              return <div key={payment.id} className="grid gap-1 border-b border-[var(--foreground)]/[0.06] px-5 py-4 last:border-0 sm:grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr] sm:items-center sm:gap-3">
                <span className="text-sm font-semibold">{invoice ? <Link className="inline-flex items-center gap-1 hover:underline" href={`/admin/invoices/${invoice.id}`}>{invoice.invoice_number}<ArrowUpRight size={13} /></Link> : "Unassigned"}</span>
                <span className="text-xs text-[var(--foreground)]/65">{invoice?.client_name ?? "—"}</span><span className="text-xs text-[var(--foreground)]/55">{new Date(`${payment.payment_date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span><span className="text-xs capitalize text-[var(--foreground)]/55">{String(payment.method).replaceAll("_", " ")}</span><span className="text-sm font-semibold tabular-nums sm:text-right">{formatMoney(Number(payment.amount), payment.currency)}</span>
              </div>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return <div className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5"><div className="flex items-center justify-between text-[var(--foreground)]/45"><span className="text-xs font-medium">{label}</span>{icon}</div><p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">{value}</p></div>;
}
