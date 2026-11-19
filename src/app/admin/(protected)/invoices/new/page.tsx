import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createInvoice } from "@/app/admin/actions";
import InvoiceComposer from "@/components/admin/InvoiceComposer";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export default async function NewInvoicePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const [{ data: clients, error: clientsError }, { data: projects, error: projectsError }, { error: invoicesError }, { error: profileError }] = await Promise.all([
    supabase.from("clients").select("id,name").is("deleted_at", null).order("name"),
    supabase.from("projects").select("id,title").is("deleted_at", null).order("title"),
    supabase.from("invoices").select("id").limit(1),
    supabase.from("invoice_business_profile").select("id").eq("id", 1).maybeSingle(),
  ]);
  const invoiceDate = todayInIndia();
  const due = new Date(`${invoiceDate}T12:00:00+05:30`);
  due.setDate(due.getDate() + 14);
  const dueDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(due);

  if (clientsError || projectsError || invoicesError || profileError) {
    return <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6"><h1 className="text-2xl font-semibold">New invoice</h1><p className="mt-2 text-sm text-[var(--foreground)]/65">Run the billing migrations in Supabase before creating invoices.</p></section>;
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/invoices" className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-xs font-medium text-[var(--foreground)]/55 hover:bg-[var(--foreground)]/5"><ArrowLeft size={15} /> Back to invoices</Link>
      <header><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/45">Finance · Invoices</p><h1 className="text-[36px] font-semibold leading-none tracking-[-0.05em] sm:text-[42px]">Create an invoice</h1><p className="mt-3 max-w-xl text-sm text-[var(--foreground)]/55">Add the work, review the totals, and share a polished invoice with your client.</p></header>
      {params.error && <p role="alert" className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-700">{params.error}</p>}
      {(!clients?.length || !projects?.length) ? (
        <div className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-6">
          <h2 className="font-semibold">Set up clients and projects first</h2>
          <p className="mt-2 text-sm text-[var(--foreground)]/55">Invoices need both a client and project linked to them.</p>
          <div className="mt-5 flex flex-wrap gap-3">{!clients?.length && <Link href="/admin/clients?new=1" className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-ink)]">Add a client</Link>}{!projects?.length && <Link href="/admin/projects?new=1" className="rounded-xl border border-[var(--foreground)]/10 px-4 py-2.5 text-sm font-semibold">Add a project</Link>}</div>
        </div>
      ) : (
        <InvoiceComposer
          clients={clients.map((client) => ({ id: client.id, name: client.name }))}
          projects={projects.map((project) => ({ id: project.id, name: project.title }))}
          action={createInvoice}
          invoiceDate={invoiceDate}
          dueDate={dueDate}
        />
      )}
    </div>
  );
}
