export function formatMoney(amount: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency.trim().toUpperCase(), maximumFractionDigits: 2 }).format(amount || 0);
  } catch {
    return `${currency.trim().toUpperCase()} ${(amount || 0).toFixed(2)}`;
  }
}

export function effectiveInvoiceStatus(invoice: { status: string; due_date: string; total: number }, paidAmount: number) {
  if (invoice.status === "draft" || invoice.status === "cancelled") return invoice.status;
  if (invoice.total > 0 && paidAmount >= invoice.total) return "paid";
  if (paidAmount > 0) return "partially_paid";
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return invoice.due_date < today ? "overdue" : invoice.status;
}

export const invoiceStatusLabel: Record<string, string> = {
  draft: "Draft",
  sent: "Sent",
  partially_paid: "Partially paid",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export function invoiceBalance(total: number, paidAmount: number) {
  return Math.max(0, Math.round((total - paidAmount) * 100) / 100);
}
