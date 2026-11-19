import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, LockKeyhole, MessageCircle, Mail, Printer } from "lucide-react";
import PendingActionButton from "@/components/admin/PendingActionButton";
import { cancelInvoice, issueCreditNote, markInvoiceSent } from "@/app/admin/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/seo";
import { effectiveInvoiceStatus, formatMoney, invoiceBalance, invoiceStatusLabel } from "@/lib/invoices";

const panel = "rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5 sm:p-6";
const button = "inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--foreground)]/10 bg-[var(--background)] px-3.5 text-[13px] font-medium text-[var(--foreground)]/75 hover:bg-[var(--foreground)]/[0.04]";
const label = "text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]/45";

export default async function InvoiceDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string; saved?: string; credit?: string; error?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createSupabaseServerClient();
  const [{ data: invoice, error }, { data: items }, { data: payments }, { data: creditNotes }] = await Promise.all([
    supabase.from("invoices").select("*").eq("id", id).maybeSingle(),
    supabase.from("invoice_items").select("*").eq("invoice_id", id).order("position"),
    supabase.from("payments").select("*").eq("invoice_id", id).order("payment_date", { ascending: false }),
    supabase.from("credit_notes").select("*").eq("invoice_id", id).order("issue_date", { ascending: false }),
  ]);
  if (error || !invoice) notFound();
  const paid = (payments ?? []).reduce((sum, payment) => sum + Number(payment.amount), 0);
  const total = Number(invoice.total);
  const balance = invoiceBalance(total, paid);
  const status = effectiveInvoiceStatus(invoice, paid);
  const shareable = !["draft", "cancelled"].includes(status);
  const creditTotal = (creditNotes ?? []).reduce((sum, note) => sum + Number(note.amount), 0);
  const publicUrl = `${siteUrl()}/i/${invoice.public_token}`;
  const phoneDigits = String(invoice.client_phone ?? "").replace(/\D/g, "");
  const shareMessage = `Hi ${invoice.client_name}, here is invoice ${invoice.invoice_number} for ${formatMoney(total, invoice.currency)}. Balance due: ${formatMoney(balance, invoice.currency)}. ${publicUrl}`;
  const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(shareMessage)}` : `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  const emailHref = invoice.client_email ? `mailto:${encodeURIComponent(invoice.client_email)}?subject=${encodeURIComponent(`Invoice ${invoice.invoice_number}`)}&body=${encodeURIComponent(shareMessage)}` : null;
  const overdueReminder = `Hi ${invoice.client_name}, a quick reminder that invoice ${invoice.invoice_number} for ${formatMoney(balance, invoice.currency)} was due on ${invoice.due_date}. You can view it and pay here: ${publicUrl}`;
  const reminderHref = phoneDigits ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(overdueReminder)}` : null;

  return (
    <div className="space-y-6">
      <Link href="/admin/invoices" className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium text-[var(--foreground)]/55 hover:bg-[var(--foreground)]/5"><ArrowLeft size={15} /> Back to invoices</Link>
      {query.error && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-700">{query.error}</p>}
      {query.created && <p role="status" className="rounded-xl bg-[var(--accent)]/15 px-4 py-3 text-sm">Invoice {invoice.invoice_number} created.</p>}
      {query.saved && <p role="status" className="rounded-xl bg-[var(--accent)]/15 px-4 py-3 text-sm">Invoice status updated.</p>}
      {query.credit && <p role="status" className="rounded-xl bg-[var(--accent)]/15 px-4 py-3 text-sm">Credit note issued.</p>}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/45">{invoiceStatusLabel[status]}</p><h1 className="text-[34px] font-semibold leading-none tracking-[-0.05em] sm:text-[42px]">{invoice.invoice_number}</h1><p className="mt-3 text-sm text-[var(--foreground)]/55">{invoice.client_name} · {invoice.project_title}</p></div>
        <div className="flex flex-wrap gap-2">
          {["draft", "sent", "overdue"].includes(status) && paid === 0 && <Link href={`/admin/invoices/${id}/edit`} className={button}>Edit invoice</Link>}
          {shareable ? <><a href={publicUrl} target="_blank" rel="noreferrer" className={button}><ExternalLink size={15} /> Client view</a><a href={publicUrl} target="_blank" rel="noreferrer" className={button}><Printer size={15} /> Save as PDF</a>{emailHref ? <a href={emailHref} className={button}><Mail size={15} /> Email</a> : <span title="Add a billing email to the client profile" className={`${button} cursor-not-allowed opacity-45`}><Mail size={15} /> Email</span>}<a href={whatsappHref} target="_blank" rel="noreferrer" className={button}><MessageCircle size={15} /> WhatsApp</a></> : <span className="self-center text-xs text-[var(--foreground)]/45">Mark as sent to create a shareable client link.</span>}
        </div>
      </header>

      {status === "overdue" && <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-500/15 bg-rose-500/[0.04] p-4"><div><p className="text-sm font-semibold text-rose-800">Payment is overdue</p><p className="mt-1 text-xs text-rose-700/75">Balance {formatMoney(balance, invoice.currency)} was due {invoice.due_date}.</p></div>{reminderHref && <a href={reminderHref} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-lg bg-rose-600 px-3.5 text-xs font-semibold text-white"><MessageCircle size={14} /> Send WhatsApp reminder</a>}</div>}

      <div className="grid gap-4 sm:grid-cols-3"><Metric label="Invoice total" value={formatMoney(total, invoice.currency)} /><Metric label="Paid" value={formatMoney(paid, invoice.currency)} /><Metric label="Balance due" value={formatMoney(balance, invoice.currency)} /></div>

      <section className={panel}>
        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[var(--foreground)]/10 pb-5">
          <div><p className={label}>Bill to</p><h2 className="mt-2 text-lg font-semibold">{invoice.client_name}</h2>{invoice.client_email && <p className="mt-1 text-sm text-[var(--foreground)]/55">{invoice.client_email}</p>}{invoice.client_address && <p className="mt-1 whitespace-pre-line text-sm text-[var(--foreground)]/55">{invoice.client_address}</p>}</div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm"><div><p className={label}>Invoice date</p><p className="mt-2">{invoice.invoice_date}</p></div><div><p className={label}>Due date</p><p className="mt-2">{invoice.due_date}</p></div><div className="col-span-2"><p className={label}>Project</p><p className="mt-2">{invoice.project_title}</p></div></div>
        </div>
        <div className="mt-5 hidden overflow-x-auto sm:block"><table className="w-full min-w-[520px] text-left text-sm"><thead><tr className="text-[10px] font-semibold uppercase tracking-wider text-[var(--foreground)]/45"><th className="pb-3">Description</th><th className="pb-3 text-right">Qty</th><th className="pb-3 text-right">Rate</th><th className="pb-3 text-right">Amount</th></tr></thead><tbody>{(items ?? []).map((item) => <tr key={item.id} className="border-t border-[var(--foreground)]/[0.06]"><td className="py-3">{item.description}</td><td className="py-3 text-right">{item.quantity}</td><td className="py-3 text-right">{formatMoney(Number(item.rate), invoice.currency)}</td><td className="py-3 text-right font-semibold">{formatMoney(Number(item.amount), invoice.currency)}</td></tr>)}</tbody></table></div>
        <div className="mt-4 space-y-3 sm:hidden">{(items ?? []).map((item) => <div key={item.id} className="rounded-xl border border-[var(--foreground)]/10 p-3 text-sm"><p className="break-words font-medium">{item.description}</p><div className="mt-3 grid grid-cols-3 gap-2 text-xs"><div><span className="block text-[var(--foreground)]/45">Qty</span><span className="mt-1 block">{item.quantity}</span></div><div className="text-right"><span className="block text-[var(--foreground)]/45">Rate</span><span className="mt-1 block">{formatMoney(Number(item.rate), invoice.currency)}</span></div><div className="text-right"><span className="block text-[var(--foreground)]/45">Amount</span><span className="mt-1 block font-semibold">{formatMoney(Number(item.amount), invoice.currency)}</span></div></div></div>)}</div>
        <div className="ml-auto mt-5 max-w-[280px] space-y-2 text-sm"><div className="flex justify-between text-[var(--foreground)]/55"><span>Subtotal</span><span>{formatMoney(Number(invoice.subtotal), invoice.currency)}</span></div>{Number(invoice.discount) > 0 && <div className="flex justify-between text-[var(--foreground)]/55"><span>Discount</span><span>−{formatMoney(Number(invoice.discount), invoice.currency)}</span></div>}{Number(invoice.tax_amount) > 0 && <div className="flex justify-between text-[var(--foreground)]/55"><span>{invoice.tax_label} ({invoice.tax_rate}%)</span><span>{formatMoney(Number(invoice.tax_amount), invoice.currency)}</span></div>}<div className="flex justify-between border-t border-[var(--foreground)]/10 pt-3 font-semibold"><span>Total</span><span>{formatMoney(total, invoice.currency)}</span></div></div>
        {invoice.payment_terms && <p className="mt-5 whitespace-pre-line rounded-xl bg-[var(--foreground)]/[0.03] p-4 text-sm leading-6 text-[var(--foreground)]/65">{invoice.payment_terms}</p>}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={panel}><div className="mb-4"><h2 className="text-sm font-semibold">Payments</h2><p className="mt-1 text-xs text-[var(--foreground)]/50">Payment records update the balance and invoice status automatically.</p></div>{(payments ?? []).length ? <div className="space-y-3">{payments!.map((payment) => <div key={payment.id} className="flex items-center justify-between gap-3 border-t border-[var(--foreground)]/[0.06] pt-3 text-sm"><div><p className="font-medium">{formatMoney(Number(payment.amount), payment.currency)}</p><p className="mt-1 text-xs capitalize text-[var(--foreground)]/50">{payment.method.replaceAll("_", " ")} · {payment.payment_date}{payment.reference ? ` · ${payment.reference}` : ""}</p></div><span className="text-xs text-[var(--foreground)]/45">Received</span></div>)}</div> : <p className="text-sm text-[var(--foreground)]/50">No payments recorded yet.</p>}<Link href={`/admin/payments?invoice=${invoice.id}`} className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--accent)] px-3 text-xs font-semibold text-[var(--accent-ink)]">Record a payment</Link></section>

        <section className={panel}><div className="mb-4"><h2 className="text-sm font-semibold">Credit notes</h2><p className="mt-1 text-xs text-[var(--foreground)]/50">A credit note documents a correction without changing a paid invoice.</p></div>{(creditNotes ?? []).length > 0 && <div className="mb-4 space-y-2">{creditNotes!.map((note) => <div key={note.id} className="rounded-xl bg-[var(--foreground)]/[0.03] p-3 text-xs"><p className="flex justify-between gap-2 font-semibold"><span>{note.credit_note_number}</span><span>{formatMoney(Number(note.amount), invoice.currency)}</span></p><p className="mt-1 text-[var(--foreground)]/55">{note.reason}</p></div>)}</div>}{status === "paid" ? <form action={issueCreditNote} className="space-y-3 border-t border-[var(--foreground)]/10 pt-4"><input type="hidden" name="invoice_id" value={invoice.id} /><p className="flex items-center gap-2 text-xs font-semibold"><LockKeyhole size={14} /> Paid invoice locked</p><label className="block"><span className="mb-1 block text-[11px] font-semibold text-[var(--foreground)]/60">Credit amount (maximum {formatMoney(Math.max(0, total - creditTotal), invoice.currency)})</span><input className="w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-3.5 py-3 text-sm" type="number" name="amount" min="0.01" max={Math.max(0, total - creditTotal)} step="0.01" required /></label><label className="block"><span className="mb-1 block text-[11px] font-semibold text-[var(--foreground)]/60">Reason</span><textarea className="w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-3.5 py-3 text-sm" name="reason" maxLength={1000} required rows={2} placeholder="Explain the correction" /></label><PendingActionButton className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--accent)] px-3 text-xs font-semibold text-[var(--accent-ink)]" pendingLabel="Issuing...">Issue credit note</PendingActionButton></form> : <p className="text-sm text-[var(--foreground)]/50">Credit notes are available after an invoice is paid.</p>}</section>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        {status === "draft" && <form action={markInvoiceSent}><input type="hidden" name="id" value={invoice.id} /><PendingActionButton className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-[13px] font-semibold text-[var(--accent-ink)]" pendingLabel="Sending...">Mark as sent</PendingActionButton></form>}
        {["draft", "sent"].includes(status) && <form action={cancelInvoice}><input type="hidden" name="id" value={invoice.id} /><PendingActionButton className={`${button} text-rose-700`} pendingLabel="Cancelling...">Cancel invoice</PendingActionButton></form>}
      </div>
    </div>
  );
}

function Metric({ label: title, value }: { label: string; value: string }) {
  return <div className={panel}><p className="text-xs text-[var(--foreground)]/50">{title}</p><p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">{value}</p></div>;
}
