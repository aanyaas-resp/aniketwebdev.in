// components/sections/faq.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";

const faqs = [
  {
    number: "01",
    category: "Websites",
    q: "Can you build a website tailored to my business?",
    a: "Yes. I design and build responsive business websites around your goals, with clear service pages, contact options, and SEO foundations included from the start.",
  },
  {
    number: "02",
    category: "Apps",
    q: "Do you develop custom web and mobile apps?",
    a: "Yes. I build custom applications and dashboards to fit your workflow, including integrations with the tools and services your business already uses.",
  },
  {
    number: "03",
    category: "SEO, AEO & GEO",
    q: "Can you help my business get found on Google and AI search?",
    a: "I improve technical and on-page SEO, local visibility, and how clearly your content answers questions, helping search engines and AI tools understand your business.",
  },
  {
    number: "04",
    category: "E-commerce",
    q: "Can you build or improve my online store?",
    a: "Yes. I work on e-commerce and Shopify stores, including store setup, design, and integrations that make it easier for customers to browse and buy.",
  },
  {
    number: "05",
    category: "Getting started",
    q: "How do I get started with a project?",
    a: "Send me a note about your goals, timeline, and the service you need. We can discuss the right scope and next steps together.",
  },
];

type FAQItem = {
  number: string;
  category: string;
  q: string;
  a: string;
};

export default function FAQ({ items = faqs }: { items?: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="w-full overflow-hidden bg-[var(--background)] px-5 py-16 font-sans text-[var(--foreground)] antialiased sm:px-8 md:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--highlight)] px-3.5 py-1.5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--accent-ink)]">
            FAQs
          </span>
          <h2
            id="faq-heading"
            className="mt-4 max-w-[10ch] text-balance text-[clamp(2.25rem,4.5vw,4rem)] font-medium leading-[1] tracking-[-0.055em]"
          >
            Questions, <span className="hl">answered.</span>
          </h2>
          <p className="mt-4 max-w-[38ch] text-[15px] leading-6 text-[var(--foreground)]/55 sm:text-base sm:leading-7">
            Everything you need to know before starting with Aniket Jamunde.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--foreground)]/60 lg:mt-8">
            <span>Still have a question?</span>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-semibold text-[var(--foreground)] underline decoration-[var(--highlight)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--foreground)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--highlight)]"
            >
              Ask me <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;

            return (
              <article key={item.q} className={`group relative overflow-hidden rounded-[28px] transition-colors duration-300 ${isOpen ? "bg-[var(--foreground)]/[0.045]" : "bg-[var(--foreground)]/[0.025] hover:bg-[var(--foreground)]/[0.045]"}`}>
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="relative grid w-full grid-cols-1 items-center px-5 py-5 pr-20 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--highlight)] sm:px-7 sm:py-6 sm:pr-24"
                >
                  <span>
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]/45">
                      {item.category}
                    </span>
                    <span className="block text-[clamp(1.05rem,2vw,1.35rem)] font-medium leading-[1.25] tracking-[-0.025em]">
                      {item.q}
                    </span>
                  </span>
                  <span aria-hidden="true" className="absolute bottom-0 right-0 h-16 w-16 rounded-tl-[28px] bg-[var(--background)]" />
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 right-0 z-10 flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 ${
                      isOpen ? "rotate-45 bg-[var(--highlight)] text-[var(--accent-ink)]" : "bg-[var(--highlight)] text-[var(--accent-ink)]"
                    }`}
                  >
                    <Plus className="h-5 w-5" strokeWidth={2} />
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-400 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] px-5 pb-7 pr-16 text-sm leading-6 text-[var(--foreground)]/60 sm:px-7 sm:pb-8 sm:pl-7 sm:text-[15px] sm:leading-7">
                      {item.a}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
