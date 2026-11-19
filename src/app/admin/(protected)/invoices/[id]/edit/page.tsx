import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { notFound } from "next/navigation";
import { updateInvoice } from "@/app/admin/actions";
import InvoiceComposer from "@/components/admin/InvoiceComposer";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export default async function EditInvoicePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createSupabaseServerClient();
  const [{ data: invoice }, { data: items }, { data: payments }, { data: clients }, { data: projects }] = await Promise.all([
    supabase.from("invoices").select("*").eq("id", id).maybeSingle(),
    supabase.from("invoice_items").select("*").eq("invoice_id", id).order("position"),
    supabase.from("payments").select("id").eq("invoice_id", id),
    supabase.from("clients").select("id,name").is("deleted_at", null).order("name"),
    supabase.from("projects").select("id,title").is("deleted_at", null).order("title"),
  ]);
  if (!invoice) notFound();
  const locked = invoice.status === "paid" || invoice.status === "cancelled" || (payments?.length ?? 0) > 0;
  const due = new Date(`${todayInIndia()}T12:00:00+05:30`);
  due.setDate(due.getDate() + 14);
  const dueDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(due);

  return (
    <div className="space-y-6">
      <Link href={`/admin/invoices/${id}`} className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium text-[var(--foreground)]/55 hover:bg-[var(--foreground)]/5"><ArrowLeft size={15} /> Back to invoice</Link>
      <header><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/45">Finance · {invoice.invoice_number}</p><h1 className="text-[36px] font-semibold leading-none tracking-[-0.05em] sm:text-[42px]">Edit invoice</h1><p className="mt-3 text-sm text-[var(--foreground)]/55">The invoice number stays unchanged. Once a payment is recorded, the invoice is locked.</p></header>
      {query.error && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-700">{query.error}</p>}
      {locked ? (
        <section className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-6"><p className="flex items-center gap-2 font-semibold"><LockKeyhole size={16} /> This invoice is locked</p><p className="mt-2 text-sm text-[var(--foreground)]/55">Paid, cancelled, or invoices with recorded payments cannot be edited. Issue a credit note for paid invoice corrections.</p><Link href={`/admin/invoices/${id}`} className="mt-4 inline-flex h-10 items-center rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent-ink)]">View invoice</Link></section>
      ) : (
        <InvoiceComposer
          clients={(clients ?? []).map((client) => ({ id: client.id, name: client.name }))}
          projects={(projects ?? []).map((project) => ({ id: project.id, name: project.title }))}
          action={updateInvoice.bind(null, id)}
          invoiceDate={invoice.invoice_date}
          dueDate={dueDate}
          initialInvoice={{ client_id: invoice.client_id, project_id: invoice.project_id, invoice_date: invoice.invoice_date, due_date: invoice.due_date, currency: invoice.currency, discount: Number(invoice.discount), tax_rate: Number(invoice.tax_rate), tax_label: invoice.tax_label, payment_terms: invoice.payment_terms, status: invoice.status }}
          initialItems={(items ?? []).map((item) => ({ description: item.description, quantity: String(item.quantity), rate: String(item.rate) }))}
        />
      )}
    </div>
  );
}
