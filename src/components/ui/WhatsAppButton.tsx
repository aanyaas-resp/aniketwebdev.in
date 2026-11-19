import { MessageCircle } from "lucide-react";

// Floating WhatsApp button. Only renders when a WhatsApp number is set in the admin panel.
export default function WhatsAppButton({ number }: { number: string | null }) {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  const message = encodeURIComponent("Hi, I would like a quote for my project.");
  return (
    <a
      href={`https://wa.me/${digits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-4 right-4 z-50 flex h-12 items-center gap-2 rounded-full bg-[var(--secondary)] px-4 text-xs font-semibold text-[var(--background)] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:h-14 sm:px-5 sm:text-sm"
    >
      <MessageCircle size={20} aria-hidden="true" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
