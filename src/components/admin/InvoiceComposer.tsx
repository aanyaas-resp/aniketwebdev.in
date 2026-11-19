"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import PendingActionButton from "@/components/admin/PendingActionButton";

type Choice = { id: string; name: string };
type LineItem = { description: string; quantity: string; rate: string };
type Props = {
  clients: Choice[];
  projects: Choice[];
  action: (formData: FormData) => void | Promise<void>;
  invoiceDate: string;
  dueDate: string;
  initialTerms?: string;
  initialInvoice?: {
    client_id: string;
    project_id: string;
    invoice_date: string;
    due_date: string;
    currency: string;
    discount: number;
    tax_rate: number;
    tax_label: string;
    payment_terms: string | null;
    status: string;
  };
  initialItems?: LineItem[];
};

const input = "w-full rounded-xl border border-[var(--foreground)]/12 bg-[var(--background)] px-3.5 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/60";
const label = "mb-1.5 block text-[11px] font-semibold text-[var(--foreground)]/60";
const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

function currency(value: number, code: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: code, maximumFractionDigits: 2 }).format(value || 0);
}

export default function InvoiceComposer({ clients, projects, action, invoiceDate, dueDate, initialTerms = "50% advance, balance on delivery", initialInvoice, initialItems }: Props) {
  const [items, setItems] = useState<LineItem[]>(initialItems?.length ? initialItems : [{ description: "", quantity: "1", rate: "" }]);
  const [discount, setDiscount] = useState(String(initialInvoice?.discount ?? 0));
  const [taxRate, setTaxRate] = useState(String(initialInvoice?.tax_rate ?? 0));
  const [taxLabel, setTaxLabel] = useState(initialInvoice?.tax_label ?? "GST");
  const [code, setCode] = useState(initialInvoice?.currency ?? "INR");
  const totals = useMemo(() => {
    const subtotal = roundMoney(items.reduce((sum, item) => sum + roundMoney(Number(item.quantity || 0) * Number(item.rate || 0)), 0));
    const discountValue = Math.min(Math.max(Number(discount || 0), 0), subtotal);
    const tax = roundMoney((subtotal - discountValue) * Math.max(Number(taxRate || 0), 0) / 100);
    return { subtotal, discount: discountValue, tax, total: subtotal - discountValue + tax };
  }, [items, discount, taxRate]);
  const discountTooHigh = Number(discount || 0) > totals.subtotal;

  function updateItem(index: number, key: keyof LineItem, value: string) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  }

  return (
    <form action={action} className="space-y-6">
      <section className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-sm font-semibold">Who is this for?</h2>
          <p className="mt-1 text-xs text-[var(--foreground)]/50">Choose the client and project. Billing details are filled from the client profile.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label><span className={label}>Client</span><select name="client_id" required className={input} defaultValue={initialInvoice?.client_id ?? ""}><option value="" disabled>Select a client</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
          <label><span className={label}>Project</span><select name="project_id" required className={input} defaultValue={initialInvoice?.project_id ?? ""}><option value="" disabled>Select a project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-sm font-semibold">Invoice details</h2><p className="mt-1 text-xs text-[var(--foreground)]/50">{initialInvoice ? "The invoice number stays the same when you save." : "Invoice number is assigned securely when you save."}</p></div>
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--foreground)]/65"><input type="checkbox" name="send_now" defaultChecked={initialInvoice ? initialInvoice.status !== "draft" : true} className="h-4 w-4 accent-[var(--accent)]" />{initialInvoice?.status === "sent" ? "Keep as sent" : "Mark as sent"}</label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <label><span className={label}>Invoice date</span><input className={input} name="invoice_date" type="date" required defaultValue={initialInvoice?.invoice_date ?? invoiceDate} /></label>
          <label><span className={label}>Due date</span><input className={input} name="due_date" type="date" required defaultValue={initialInvoice?.due_date ?? dueDate} /></label>
          <label><span className={label}>Currency</span><select className={input} name="currency" value={code} onChange={(event) => setCode(event.target.value)}>{["INR", "USD", "GBP", "EUR", "AUD", "CAD"].map((value) => <option key={value}>{value}</option>)}</select></label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div><h2 className="text-sm font-semibold">What are you charging for?</h2><p className="mt-1 text-xs text-[var(--foreground)]/50">Add each service or deliverable as a line item.</p></div>
          <button type="button" onClick={() => setItems((current) => [...current, { description: "", quantity: "1", rate: "" }])} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--foreground)]/10 px-3 text-xs font-semibold hover:bg-[var(--foreground)]/[0.04]"><Plus size={14} /> Add item</button>
        </div>
        <input type="hidden" name="items" value={JSON.stringify(items.filter((item) => item.description.trim()))} />
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-[var(--foreground)]/8 bg-[var(--foreground)]/[0.02] p-3 sm:grid-cols-[minmax(0,1fr)_100px_140px_120px_36px] sm:items-end sm:border-0 sm:bg-transparent sm:p-0">
              <label><span className={label}>Description</span><input className={input} maxLength={300} placeholder="e.g. Website design and development" value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} /></label>
              <label><span className={label}>Qty</span><input className={input} type="number" min="0.01" step="0.01" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} /></label>
              <label><span className={label}>Rate ({code})</span><input className={input} type="number" min="0" step="0.01" placeholder="0.00" value={item.rate} onChange={(event) => updateItem(index, "rate", event.target.value)} /></label>
              <div><span className={label}>Amount</span><p className="flex h-11 items-center px-2 text-sm font-semibold tabular-nums">{currency(Number(item.quantity || 0) * Number(item.rate || 0), code)}</p></div>
              <button type="button" onClick={() => setItems((current) => current.length === 1 ? [{ description: "", quantity: "1", rate: "" }] : current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Remove line item" className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--foreground)]/45 hover:bg-rose-500/10 hover:text-rose-600"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>

        {discountTooHigh && <p role="alert" className="mt-4 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-700">Discount cannot be greater than the subtotal.</p>}
        <div className="mt-6 grid gap-6 border-t border-[var(--foreground)]/10 pt-5 sm:grid-cols-[1fr_280px]">
          <div className="grid content-start gap-4 sm:grid-cols-2">
            <label><span className={label}>Payment terms or note</span><textarea className={input} name="payment_terms" rows={3} maxLength={1000} defaultValue={initialInvoice?.payment_terms ?? initialTerms} placeholder="e.g. 50% advance, balance on delivery" /></label>
            <div className="grid gap-4">
              <label><span className={label}>Discount ({code})</span><input className={input} name="discount" type="number" min="0" step="0.01" value={discount} onChange={(event) => setDiscount(event.target.value)} /></label>
              <div className="grid grid-cols-[1fr_90px] gap-2"><label><span className={label}>Tax name</span><input className={input} name="tax_label" value={taxLabel} onChange={(event) => setTaxLabel(event.target.value)} /></label><label><span className={label}>Tax %</span><input className={input} name="tax_rate" type="number" min="0" max="100" step="0.01" value={taxRate} onChange={(event) => setTaxRate(event.target.value)} /></label></div>
            </div>
          </div>
          <dl className="space-y-2 rounded-xl bg-[var(--foreground)]/[0.035] p-4 text-sm">
            <div className="flex justify-between gap-3 text-[var(--foreground)]/60"><dt>Subtotal</dt><dd>{currency(totals.subtotal, code)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between gap-3 text-[var(--foreground)]/60"><dt>Discount</dt><dd>−{currency(totals.discount, code)}</dd></div>}
            {totals.tax > 0 && <div className="flex justify-between gap-3 text-[var(--foreground)]/60"><dt>{taxLabel} ({taxRate}%)</dt><dd>{currency(totals.tax, code)}</dd></div>}
            <div className="mt-3 flex justify-between gap-3 border-t border-[var(--foreground)]/10 pt-3 text-base font-semibold"><dt>Total</dt><dd>{currency(totals.total, code)}</dd></div>
          </dl>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-xs leading-5 text-[var(--foreground)]/50">Your business and client billing details will be copied onto this invoice.</p>
        <div className="flex gap-3"><a href="/admin/invoices" className="inline-flex h-10 items-center rounded-xl border border-[var(--foreground)]/10 px-4 text-[13px] font-medium">Cancel</a><PendingActionButton pendingLabel="Saving..." disabled={discountTooHigh || totals.total <= 0} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-[13px] font-semibold text-[var(--accent-ink)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50">{initialInvoice ? "Save invoice" : "Create invoice"}</PendingActionButton></div>
      </div>
    </form>
  );
}
