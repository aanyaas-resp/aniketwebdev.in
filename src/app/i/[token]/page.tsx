import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InvoicePrintButton from "@/components/admin/InvoicePrintButton";
import { effectiveInvoiceStatus, formatMoney, invoiceBalance, invoiceStatusLabel } from "@/lib/invoices";
import { publicClient } from "@/lib/supabase/public";

export const metadata: Metadata = { title: "Invoice", robots: { index: false, follow: false } };

function dateLabel(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PublicInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(token)) notFound();
  const { data, error } = await publicClient().rpc("get_public_invoice", { p_token: token });
  if (error || !data) notFound();
  const invoice = data as any;
  const paid = Number(invoice.paid_amount ?? 0);
  const balance = invoiceBalance(Number(invoice.total), paid);
  const status = effectiveInvoiceStatus(invoice, paid);
  const upiLink = invoice.business_upi_id && String(invoice.currency).trim() === "INR" && balance > 0
    ? `upi://pay?pa=${encodeURIComponent(invoice.business_upi_id)}&pn=${encodeURIComponent(invoice.business_name)}&am=${balance.toFixed(2)}&cu=INR&tn=${encodeURIComponent(invoice.invoice_number)}`
    : null;

  return (
    <main className="min-h-dvh bg-[#f2f3f5] px-4 py-8 text-slate-900 sm:px-8 sm:py-12 print:min-h-0 print:bg-white print:p-0">
      <div className="no-print mx-auto mb-4 flex max-w-[850px] items-center justify-between gap-3"><p className="text-xs font-medium text-slate-500">Invoice from {invoice.business_name}</p><InvoicePrintButton /></div>
      <article className="invoice-document mx-auto max-w-[850px] rounded-2xl bg-white p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,.35)] sm:p-12 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-8">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Invoice</p><h1 className="mt-2 text-3xl font-bold tracking-tight">{invoice.invoice_number}</h1><span className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{invoiceStatusLabel[status] ?? status}</span></div>
          <div className="text-right"><p className="text-lg font-bold">{invoice.business_name}</p>{invoice.business_address && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-500">{invoice.business_address}</p>}{invoice.business_gstin && <p className="mt-2 text-xs text-slate-500">GSTIN: {invoice.business_gstin}</p>}{invoice.business_pan && <p className="text-xs text-slate-500">PAN: {invoice.business_pan}</p>}</div>
        </header>

        <section className="grid gap-7 py-8 sm:grid-cols-2">
          <div><h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Bill to</h2><p className="mt-2 font-semibold">{invoice.client_name}</p>{invoice.client_address && <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-500">{invoice.client_address}</p>}{invoice.client_email && <p className="mt-1 text-sm text-slate-500">{invoice.client_email}</p>}{invoice.client_gstin && <p className="mt-1 text-xs text-slate-500">GSTIN: {invoice.client_gstin}</p>}{invoice.client_pan && <p className="text-xs text-slate-500">PAN: {invoice.client_pan}</p>}</div>
          <div className="grid grid-cols-2 gap-4 sm:text-right"><div><h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Invoice date</h2><p className="mt-2 text-sm font-medium">{dateLabel(invoice.invoice_date)}</p></div><div><h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Due date</h2><p className="mt-2 text-sm font-medium">{dateLabel(invoice.due_date)}</p></div><div className="col-span-2 sm:mt-2"><h2 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Project</h2><p className="mt-2 text-sm font-medium">{invoice.project_title}</p></div></div>
        </section>

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead><tr className="border-y border-slate-200 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400"><th className="py-3 pr-3">Description</th><th className="px-2 py-3 text-right">Qty</th><th className="px-2 py-3 text-right">Rate</th><th className="py-3 pl-2 text-right">Amount</th></tr></thead>
            <tbody>{invoice.items.map((item: any) => <tr key={item.id} className="border-b border-slate-100"><td className="py-4 pr-3 font-medium">{item.description}</td><td className="px-2 py-4 text-right text-slate-500">{item.quantity}</td><td className="px-2 py-4 text-right text-slate-500">{formatMoney(Number(item.rate), invoice.currency)}</td><td className="py-4 pl-2 text-right font-semibold">{formatMoney(Number(item.amount), invoice.currency)}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="space-y-3 sm:hidden">
          {invoice.items.map((item: any) => <div key={item.id} className="rounded-xl border border-slate-200 p-3 text-sm"><p className="break-words font-semibold">{item.description}</p><div className="mt-3 grid grid-cols-3 gap-2 text-xs"><div><span className="block text-slate-400">Qty</span><span className="mt-1 block">{item.quantity}</span></div><div className="text-right"><span className="block text-slate-400">Rate</span><span className="mt-1 block">{formatMoney(Number(item.rate), invoice.currency)}</span></div><div className="text-right"><span className="block text-slate-400">Amount</span><span className="mt-1 block font-semibold">{formatMoney(Number(item.amount), invoice.currency)}</span></div></div></div>)}
        </div>

        <div className="ml-auto mt-6 max-w-[310px] space-y-2.5 text-sm">
          <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatMoney(Number(invoice.subtotal), invoice.currency)}</span></div>
          {Number(invoice.discount) > 0 && <div className="flex justify-between text-slate-500"><span>Discount</span><span>−{formatMoney(Number(invoice.discount), invoice.currency)}</span></div>}
          {Number(invoice.tax_amount) > 0 && <div className="flex justify-between text-slate-500"><span>{invoice.tax_label} ({invoice.tax_rate}%)</span><span>{formatMoney(Number(invoice.tax_amount), invoice.currency)}</span></div>}
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold"><span>Total</span><span>{formatMoney(Number(invoice.total), invoice.currency)}</span></div>
          <div className="flex justify-between text-slate-500"><span>Paid</span><span>−{formatMoney(paid, invoice.currency)}</span></div>
          <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-3 font-bold"><span>Balance due</span><span>{formatMoney(balance, invoice.currency)}</span></div>
        </div>

        {invoice.payment_terms && <section className="mt-8 rounded-xl bg-slate-50 p-4"><h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Payment terms / note</h2><p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{invoice.payment_terms}</p></section>}
        {(invoice.business_upi_id || invoice.business_bank_details) && <section className="mt-6 border-t border-slate-200 pt-5"><h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Payment details</h2>{invoice.business_upi_id && <p className="mt-2 text-sm">UPI ID: <span className="font-semibold">{invoice.business_upi_id}</span></p>}{invoice.business_bank_details && <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{invoice.business_bank_details}</p>}{upiLink && <a className="no-print mt-4 inline-flex h-10 items-center rounded-lg bg-slate-900 px-4 text-xs font-semibold text-white" href={upiLink}>Pay {formatMoney(balance, invoice.currency)} via UPI</a>}</section>}
        {invoice.credit_notes?.length > 0 && <section className="mt-6 border-t border-slate-200 pt-5"><h2 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Credit notes</h2><ul className="mt-2 space-y-1 text-xs text-slate-600">{invoice.credit_notes.map((note: any) => <li key={note.number}>{note.number} · {dateLabel(note.issue_date)} · {formatMoney(Number(note.amount), invoice.currency)} — {note.reason}</li>)}</ul></section>}
        <footer className="mt-10 border-t border-slate-200 pt-4 text-center text-[10px] text-slate-400">Thank you for your business · {invoice.business_name}</footer>
      </article>
    </main>
  );
}
