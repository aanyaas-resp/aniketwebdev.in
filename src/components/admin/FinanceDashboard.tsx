import { AlertTriangle, ArrowDownRight, ArrowUpRight, CircleDollarSign, FileText, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { formatMoney } from "@/lib/invoices";

type MonthPoint = { label: string; amount: number };
type StatusPoint = { key: string; label: string; count: number; color: string };

export default function FinanceDashboard({
  collected,
  outstanding,
  overdueCount,
  invoiceCount,
  months,
  statuses,
}: {
  collected: number;
  outstanding: number;
  overdueCount: number;
  invoiceCount: number;
  months: MonthPoint[];
  statuses: StatusPoint[];
}) {
  const max = Math.max(1, ...months.map((month) => month.amount));
  const totalStatus = statuses.reduce((sum, item) => sum + item.count, 0);
  const points = months.map((month, index) => ({
    x: months.length < 2 ? 300 : 32 + index * (536 / (months.length - 1)),
    y: 150 - (month.amount / max) * 116,
  }));
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${line} L ${points[points.length - 1]?.x ?? 568} 164 L ${points[0]?.x ?? 32} 164 Z`;

  return (
    <section aria-label="Finance dashboard" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/45">Finance</p><h2 className="mt-1 text-lg font-semibold tracking-[-0.03em]">Cash flow at a glance</h2></div><p className="text-xs text-[var(--foreground)]/45">INR totals · other currencies stay separate on invoices</p></div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<CircleDollarSign size={17} />} label="Collected this month (INR)" value={formatMoney(collected)} note="Payments received" />
        <Metric icon={<Wallet size={17} />} label="Outstanding (INR)" value={formatMoney(outstanding)} note="On sent invoices" />
        <Metric icon={<AlertTriangle size={17} />} label="Overdue invoices" value={String(overdueCount)} note={overdueCount ? "Follow-up recommended" : "No overdue balances"} alert={overdueCount > 0} />
        <Metric icon={<FileText size={17} />} label="Invoices issued" value={String(invoiceCount)} note="All statuses" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold">Payments received</h3><p className="mt-1 text-xs text-[var(--foreground)]/45">Monthly total · last 6 months</p></div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-700"><ArrowUpRight size={12} /> Cash in</span></div>
          <div className="mt-5 overflow-hidden">
            <svg viewBox="0 0 600 190" role="img" aria-label="Line chart of monthly payments received" className="h-[190px] w-full overflow-visible">
              {[42, 82, 122, 164].map((y) => <line key={y} x1="30" x2="570" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 5" />)}
              <path d={area} fill="var(--accent)" fillOpacity="0.12" />
              <path d={line} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((point, index) => <g key={months[index].label}><circle cx={point.x} cy={point.y} r="5" fill="var(--background)" stroke="var(--accent)" strokeWidth="3"><title>{months[index].label}: {formatMoney(months[index].amount)}</title></circle><text x={point.x} y="184" fill="currentColor" fillOpacity=".5" fontSize="10" textAnchor="middle">{months[index].label}</text></g>)}
            </svg>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-5 sm:p-6">
          <div><h3 className="text-sm font-semibold">Invoice status</h3><p className="mt-1 text-xs text-[var(--foreground)]/45">Current portfolio · {totalStatus} invoices</p></div>
          <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-[var(--foreground)]/[0.06]" role="img" aria-label={statuses.map((item) => `${item.count} ${item.label}`).join(", ")}>
            {statuses.map((item) => <span key={item.key} title={`${item.label}: ${item.count}`} style={{ width: `${totalStatus ? item.count / totalStatus * 100 : 0}%`, background: item.color }} />)}
          </div>
          <ul className="mt-5 space-y-3">{statuses.map((item) => <li key={item.key} className="flex items-center justify-between gap-4 text-xs"><span className="flex items-center gap-2 text-[var(--foreground)]/60"><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />{item.label}</span><span className="font-semibold tabular-nums">{item.count}</span></li>)}</ul>
          <div className="mt-5 flex items-center gap-2 border-t border-[var(--foreground)]/[0.07] pt-4 text-[11px] text-[var(--foreground)]/45"><ArrowDownRight size={14} /> Review overdue invoices and follow up with clients.</div>
        </section>
      </div>
    </section>
  );
}

function Metric({ icon, label, value, note, alert = false }: { icon: ReactNode; label: string; value: string; note: string; alert?: boolean }) {
  return <div className="rounded-2xl border border-[var(--foreground)]/10 bg-[var(--background)] p-4"><div className="flex items-center justify-between gap-3 text-[var(--foreground)]/45"><span className="text-[11px] font-medium">{label}</span>{icon}</div><p className={`mt-3 text-xl font-semibold tracking-[-0.045em] ${alert ? "text-rose-700" : ""}`}>{value}</p><p className="mt-1 text-[10px] text-[var(--foreground)]/45">{note}</p></div>;
}
