"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Send, Sparkles, X } from "lucide-react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  enabled: boolean;
  greeting: string;
  suggestions: string[];
  whatsapp: string | null;
};

type Enquiry = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

const EMPTY_ENQUIRY: Enquiry = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

// Floating assistant in the bottom-right corner. Hidden on the admin pages.
export default function ChatWidget({ enabled, greeting, suggestions, whatsapp }: Props) {
  const pathname = usePathname();
  const [chatEnabled, setChatEnabled] = useState(enabled);
  const [chatGreeting, setChatGreeting] = useState(greeting);
  const [chatSuggestions, setChatSuggestions] = useState(suggestions);
  const [chatWhatsapp, setChatWhatsapp] = useState(whatsapp);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryReview, setEnquiryReview] = useState(false);
  const [enquiry, setEnquiry] = useState<Enquiry>(EMPTY_ENQUIRY);
  const [enquiryStatus, setEnquiryStatus] = useState<string | null>(null);
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    let ignore = false;
    fetch("/api/chat", { cache: "no-store" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (ignore || !data) return;
        setChatEnabled(data.enabled !== false);
        if (typeof data.greeting === "string" && data.greeting) setChatGreeting(data.greeting);
        if (Array.isArray(data.suggestions)) setChatSuggestions(data.suggestions);
        if (typeof data.whatsapp === "string" || data.whatsapp === null) setChatWhatsapp(data.whatsapp);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  if (!chatEnabled || pathname.startsWith("/admin") || pathname.startsWith("/i/")) return null;

  const whatsappDigits = (chatWhatsapp ?? "").replace(/\D/g, "");

  async function send(text: string) {
    const clean = text.trim().slice(0, 800);
    if (!clean || busy) return;

    const next: Msg[] = [...messages, { role: "user", content: clean }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "The assistant is unavailable right now.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        // Hide any internal reasoning block the model may emit
        const shown = full.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<think>[\s\S]*$/, "").trimStart();
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: shown };
          return copy;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  function closeEnquiry() {
    setEnquiryOpen(false);
    setEnquiryReview(false);
    setEnquiryStatus(null);
    setEnquirySubmitted(false);
  }

  async function submitEnquiry() {
    setEnquirySending(true);
    setEnquiryStatus(null);
    try {
      const res = await fetch("/api/chat/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...enquiry,
          source_page: pathname,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "The enquiry could not be sent.");
      setEnquirySubmitted(true);
    } catch (err) {
      setEnquiryStatus(err instanceof Error ? err.message : "The enquiry could not be sent.");
    } finally {
      setEnquirySending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={open}
        className="magnetic-pill fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full p-0 text-[var(--background)] shadow-[0_14px_40px_-12px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_-12px_rgba(0,0,0,0.55)] sm:bottom-6 sm:right-6 sm:w-auto sm:px-4"
      >
        {open ? (
          <X size={22} aria-hidden="true" />
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
              <IoChatbubbleEllipsesOutline size={20} aria-hidden="true" />
            </span>
            <span className="ml-2 hidden pr-1 text-sm font-semibold sm:inline">Chat</span>
          </>
        )}
      </button>

      {open && (
        <section
          aria-label="Chat assistant"
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-3 bottom-20 z-[60] flex h-[min(560px,calc(100dvh-104px))] flex-col overflow-hidden rounded-[20px] border border-[var(--foreground)]/10 bg-[var(--background)] shadow-[0_24px_70px_-18px_rgba(0,0,0,0.6)] sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[390px]"
        >
          <header className="flex items-center gap-3 bg-[var(--secondary)] px-4 py-3.5 text-[var(--background)]">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
              <Sparkles size={18} aria-hidden="true" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--secondary)] bg-emerald-400" aria-label="Online" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">Aniket&apos;s AI assistant</p>
              <p className="mt-0.5 text-xs text-[var(--background)]/65">Typically replies instantly</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--background)]/70 transition-colors hover:bg-white/10 hover:text-[var(--background)]"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </header>

          <div data-native-scroll className="chat-scroll flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-5" aria-live="polite">
            {enquiryOpen ? (
              enquirySubmitted ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
                    <Send size={20} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">Enquiry sent</h3>
                  <p className="mt-2 max-w-[260px] text-sm leading-6 text-[var(--foreground)]/65">
                    Aniket can now see your project details. He will contact you using the email or phone number you provided.
                  </p>
                  <button type="button" onClick={closeEnquiry} className="mt-6 h-11 rounded-full border border-[var(--foreground)]/20 px-5 text-sm font-semibold hover:bg-[var(--foreground)]/5">
                    Back to chat
                  </button>
                </div>
              ) : enquiryReview ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]/50">Review before sending</p>
                    <h3 className="mt-2 text-lg font-semibold">Your enquiry</h3>
                  </div>
                  <dl className="space-y-3 rounded-[18px] border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.03] p-4 text-sm">
                    <div><dt className="text-xs text-[var(--foreground)]/50">Name</dt><dd className="mt-1 font-medium">{enquiry.name}</dd></div>
                    <div><dt className="text-xs text-[var(--foreground)]/50">Email</dt><dd className="mt-1 break-all font-medium">{enquiry.email}</dd></div>
                    {enquiry.phone && <div><dt className="text-xs text-[var(--foreground)]/50">Phone</dt><dd className="mt-1 font-medium">{enquiry.phone}</dd></div>}
                    {enquiry.service && <div><dt className="text-xs text-[var(--foreground)]/50">Service</dt><dd className="mt-1 font-medium">{enquiry.service}</dd></div>}
                    <div><dt className="text-xs text-[var(--foreground)]/50">Project details</dt><dd className="mt-1 whitespace-pre-wrap leading-6">{enquiry.message}</dd></div>
                  </dl>
                  {enquiryStatus && <p role="status" className="text-sm text-[var(--foreground)]/70">{enquiryStatus}</p>}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={closeEnquiry}
                      disabled={enquirySending}
                      className="h-11 rounded-full border border-[var(--foreground)]/20 text-sm font-semibold hover:bg-[var(--foreground)]/5 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={submitEnquiry}
                      disabled={enquirySending}
                      className="h-11 rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)] disabled:opacity-50"
                    >
                      {enquirySending ? "Sending..." : "Send to Aniket"}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const missing: string[] = [];
                    if (!enquiry.name.trim()) missing.push("name");
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) missing.push("valid email");
                    if (enquiry.message.trim().length < 5) missing.push("short project description");
                    if (missing.length > 0) {
                      setEnquiryStatus(`Please add: ${missing.join(", ")}.`);
                      return;
                    }
                    setEnquiryStatus(null);
                    setEnquiryReview(true);
                  }}
                  className="space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]/50">Project enquiry</p>
                      <h3 className="mt-2 text-lg font-semibold">Send Aniket your details</h3>
                    </div>
                    <button type="button" onClick={closeEnquiry} aria-label="Close enquiry" className="rounded-full p-2 hover:bg-[var(--foreground)]/5">
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <input
                    required
                    maxLength={100}
                    value={enquiry.name}
                    onChange={(event) => {
                      setEnquiry((current) => ({ ...current, name: event.target.value }));
                      setEnquiryStatus(null);
                    }}
                    placeholder="Your name"
                    aria-label="Your name"
                    aria-invalid={!enquiry.name.trim()}
                    className="h-11 w-full rounded-xl border border-[var(--foreground)]/15 bg-[var(--foreground)]/[0.03] px-3 text-sm outline-none focus:border-[var(--accent)]"
                  />
                  <input
                    required
                    type="email"
                    maxLength={150}
                    value={enquiry.email}
                    onChange={(event) => {
                      setEnquiry((current) => ({ ...current, email: event.target.value }));
                      setEnquiryStatus(null);
                    }}
                    placeholder="Email address"
                    aria-label="Email address"
                    aria-invalid={enquiry.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)}
                    className="h-11 w-full rounded-xl border border-[var(--foreground)]/15 bg-[var(--foreground)]/[0.03] px-3 text-sm outline-none focus:border-[var(--accent)]"
                  />
                  <input
                    maxLength={30}
                    value={enquiry.phone}
                    onChange={(event) => {
                      setEnquiry((current) => ({ ...current, phone: event.target.value }));
                      setEnquiryStatus(null);
                    }}
                    placeholder="Phone or WhatsApp (optional)"
                    aria-label="Phone or WhatsApp"
                    className="h-11 w-full rounded-xl border border-[var(--foreground)]/15 bg-[var(--foreground)]/[0.03] px-3 text-sm outline-none focus:border-[var(--accent)]"
                  />
                  <select
                    value={enquiry.service}
                    onChange={(event) => {
                      setEnquiry((current) => ({ ...current, service: event.target.value }));
                      setEnquiryStatus(null);
                    }}
                    aria-label="Service needed"
                    className="h-11 w-full rounded-xl border border-[var(--foreground)]/15 bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--accent)]"
                  >
                    <option value="">What do you need? (optional)</option>
                    <option>Website development</option>
                    <option>App development</option>
                    <option>SEO / AEO / GEO</option>
                    <option>E-commerce</option>
                    <option>Ads optimization</option>
                    <option>Something else</option>
                  </select>
                  <textarea
                    required
                    maxLength={2000}
                    rows={5}
                    value={enquiry.message}
                    onChange={(event) => {
                      setEnquiry((current) => ({ ...current, message: event.target.value }));
                      setEnquiryStatus(null);
                    }}
                    placeholder="Tell me about your project"
                    aria-label="Project details"
                    className="w-full resize-none rounded-xl border border-[var(--foreground)]/15 bg-[var(--foreground)]/[0.03] px-3 py-3 text-sm leading-6 outline-none focus:border-[var(--accent)]"
                  />
                  {enquiryStatus && <p role="alert" className="text-xs text-rose-600">{enquiryStatus}</p>}
                  <button type="submit" className="h-11 w-full rounded-full bg-[var(--accent)] text-sm font-semibold text-[var(--accent-ink)]">
                    Review enquiry
                  </button>
                </form>
              )
            ) : (
              <>
            <div className="max-w-[88%] rounded-[18px] rounded-tl-md bg-[var(--foreground)]/[0.07] px-4 py-3 text-sm leading-6">{chatGreeting}</div>

            {messages.length === 0 && chatSuggestions.length > 0 && (
              <div className="flex flex-col items-start gap-2 pt-1">
                {chatSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="max-w-full rounded-full border border-[var(--accent)]/35 px-3.5 py-2 text-left text-xs font-medium transition-colors hover:bg-[var(--accent)]/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] whitespace-pre-wrap rounded-[18px] px-4 py-3 text-sm leading-6 ${
                  m.role === "user"
                    ? "ml-auto rounded-tr-md bg-[var(--accent)] text-[var(--accent-ink)]"
                    : "rounded-tl-md bg-[var(--foreground)]/[0.07]"
                }`}
              >
                {m.content || (busy && i === messages.length - 1 ? (
                  <span className="inline-flex h-5 items-center gap-1" aria-label="Assistant is typing">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                  </span>
                ) : "")}
              </div>
            ))}

            {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
            <div ref={endRef} />
              </>
            )}
          </div>

          <footer className="border-t border-[var(--foreground)]/10 bg-[var(--background)] p-3 sm:p-4">
            {!enquiryOpen ? (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={800}
                    placeholder="Type your question"
                    aria-label="Type your question"
                    className="h-11 min-w-0 flex-1 rounded-full bg-[var(--foreground)]/5 px-4 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  />
                  <button
                    type="submit"
                    disabled={busy || !input.trim()}
                    aria-label="Send message"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] disabled:opacity-50"
                  >
                    <Send size={16} aria-hidden="true" />
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => {
                    setEnquiryOpen(true);
                    setEnquiryReview(false);
                    setEnquirySubmitted(false);
                    setEnquiryStatus(null);
                  }}
                  className="mt-2 h-9 w-full rounded-full border border-[var(--accent)]/35 text-xs font-semibold hover:bg-[var(--accent)]/10"
                >
                  Send project details to Aniket
                </button>
              </>
            ) : null}
            <div className="mt-3 flex items-center justify-center gap-3 text-xs text-[var(--foreground)]/65">
              <a href="/contact" className="underline underline-offset-4 hover:text-[var(--foreground)]">
                Use the contact form
              </a>
              {whatsappDigits && (
                <>
                  <span aria-hidden="true">or</span>
                <a
                  href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hi, I came from the website chat and would like to talk about a project.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-[var(--foreground)]"
                >
                  Message on WhatsApp
                </a>
                </>
              )}
            </div>
          </footer>
        </section>
      )}
    </>
  );
}
