"use client";

import { Download } from "lucide-react";

export default function InvoicePrintButton() {
  return <button type="button" onClick={() => window.print()} className="no-print inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--accent)] px-4 text-[13px] font-semibold text-[var(--accent-ink)] hover:brightness-95"><Download size={15} /> Save as PDF</button>;
}
