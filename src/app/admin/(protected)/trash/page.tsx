import Link from "next/link";
import { RotateCcw, Trash2 } from "lucide-react";
import { purgeRecord, restoreRecord } from "@/app/admin/actions";
import { RESOURCES } from "@/lib/admin-config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const panel = "rounded-[24px] bg-[#4a4e68] p-6 sm:p-8";

const notices: Record<string, string> = {
  restored: "Restored. It is live again.",
  purged: "Deleted forever.",
};

export default async function TrashPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const supabase = await createSupabaseServerClient();
  const resources = Object.values(RESOURCES).filter((r) => !r.singleton);

  const groups = await Promise.all(
    resources.map(async (r) => {
      const { data } = await supabase
        .from(r.table)
        .select("*")
        .not("deleted_at", "is", null)
        .order("deleted_at", { ascending: false });
      return { resource: r, rows: data ?? [] };
    }),
  );
  const total = groups.reduce((n, g) => n + g.rows.length, 0);
  const notice = sp.restored ? notices.restored : sp.purged ? notices.purged : null;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.02em]">Trash</h1>
          <p className="mt-2 max-w-xl text-white/55">
            Deleted items wait here until you restore them or delete them forever. They are hidden from the website.
          </p>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-2 text-sm">{total} item{total === 1 ? "" : "s"}</span>
      </header>

      {notice && (
        <p role="status" className="rounded-2xl bg-[var(--accent)]/20 px-5 py-3 text-sm text-[var(--accent)]">{notice}</p>
      )}

      {total === 0 && (
        <div className="rounded-[24px] border border-dashed border-white/20 p-12 text-center">
          <p className="text-white/60">The trash is empty.</p>
          <Link href="/admin" className="mt-4 inline-block text-sm underline underline-offset-4">Back to dashboard</Link>
        </div>
      )}

      {groups
        .filter((g) => g.rows.length > 0)
        .map(({ resource, rows }) => {
          const [titleCol] = resource.listColumns;
          return (
            <section key={resource.key} aria-labelledby={`trash-${resource.key}`} className={panel}>
              <h2 id={`trash-${resource.key}`} className="text-lg font-semibold">
                {resource.label} <span className="text-sm font-normal text-white/50">({rows.length})</span>
              </h2>
              <ul className="mt-5 divide-y divide-white/10">
                {rows.map((row) => (
                  <li key={String(row.id)} className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{titleCol ? String(row[titleCol.key] ?? "Untitled") : "Item"}</p>
                      <p className="text-xs text-white/50">
                        Deleted {new Date(String(row.deleted_at)).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <form action={restoreRecord.bind(null, resource.key)}>
                        <input type="hidden" name="id" value={String(row.id)} />
                        <button className="inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm hover:bg-white/20">
                          <RotateCcw size={15} aria-hidden="true" /> Restore
                        </button>
                      </form>
                      <form action={purgeRecord.bind(null, resource.key)}>
                        <input type="hidden" name="id" value={String(row.id)} />
                        <button className="inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-rose-300 hover:bg-rose-500/15">
                          <Trash2 size={15} aria-hidden="true" /> Delete forever
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
    </div>
  );
}
