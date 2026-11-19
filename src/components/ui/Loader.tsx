// Simple loading indicator used for route and form transitions.
export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-5">
      <span aria-hidden="true" className="loader-spin h-12 w-12 rounded-full border-[3px] border-[var(--foreground)]/10 border-t-[var(--accent)]" />
      <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--foreground)]/50">{label}</p>
      <span className="sr-only">{label}</span>
    </div>
  );
}
