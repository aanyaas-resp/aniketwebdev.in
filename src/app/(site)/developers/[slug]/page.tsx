import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DEFAULT_WHY, LOCATION_PAGES, getLocationPage } from "@/lib/locations";
import { siteUrl } from "@/lib/seo";

export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOCATION_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getLocationPage(slug);
  if (!page) return {};
  const url = `${siteUrl()}/developers/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: page.title, description: page.description },
  };
}

export default async function LocationPage({ params }: Params) {
  const { slug } = await params;
  const page = getLocationPage(slug);
  if (!page) notFound();

  const base = siteUrl();
  const url = `${base}/developers/${page.slug}`;
  const others = LOCATION_PAGES.filter((p) => p.slug !== page.slug);

  // Structured data for search engines and AI answer engines
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Aniket Jamunde",
      url,
      description: page.description,
      serviceType: page.serviceType,
      provider: { "@type": "Organization", name: "Aniket Jamunde", url: base },
      areaServed: [
        { "@type": "City", name: page.cityName.split(" (")[0] },
        { "@type": "AdministrativeArea", name: "Maharashtra" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: page.h1, item: url },
      ],
    },
  ];

  return (
    <main className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="mx-auto w-full max-w-[1100px] px-5 pb-16 pt-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/55">
          {page.serviceName} · {page.cityName}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
          {page.h1}
        </h1>
        {/* Direct answer first: this paragraph is what answer engines quote */}
        <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--foreground)]/80 sm:text-xl">{page.answer}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/#contact" className="inline-flex h-12 items-center rounded-full bg-[var(--accent)] px-7 text-[15px] font-semibold text-[var(--accent-ink)] hover:opacity-90">
            Get a free quote
          </Link>
          <Link href="/#services" className="inline-flex h-12 items-center rounded-full border border-[var(--foreground)]/20 px-7 text-[15px] font-medium hover:bg-[var(--foreground)]/5">
            See my services
          </Link>
        </div>
      </section>

      <section aria-labelledby="offerings" className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-8">
        <h2 id="offerings" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">What I build</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {page.offerings.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-[20px] border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.03] p-5">
              <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--highlight)]" />
              <span className="text-[15px] leading-7">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="why-me" className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-8">
        <h2 id="why-me" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Why clients choose me</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {(page.whyChoose ?? DEFAULT_WHY).map((point) => (
            <li key={point} className="flex items-start gap-3 rounded-[20px] border border-[var(--foreground)]/10 p-5">
              <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--highlight)]" />
              <span className="text-[15px] leading-7">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="process" className="mx-auto w-full max-w-[1100px] px-5 py-16 sm:px-8">
        <h2 id="process" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">How I work</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {page.process.map((step, i) => (
            <li key={step.title} className="rounded-[20px] bg-[var(--secondary)] p-6 text-[var(--background)]">
              <span className="text-sm font-semibold text-[var(--highlight)]">0{i + 1}</span>
              <p className="mt-3 text-lg font-semibold">{step.title}</p>
              <p className="mt-2 text-sm leading-6 opacity-80">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-[15px] leading-7 text-[var(--foreground)]/70">{page.localNote}</p>
      </section>

      <section aria-labelledby="faq" className="mx-auto w-full max-w-[860px] px-5 py-16 sm:px-8">
        <h2 id="faq" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Common questions</h2>
        <div className="mt-8 divide-y divide-[var(--foreground)]/10 border-y border-[var(--foreground)]/10">
          {page.faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                {f.q}
                <span aria-hidden="true" className="text-[var(--foreground)]/50 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-7 text-[var(--foreground)]/75">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="elsewhere" className="mx-auto w-full max-w-[1100px] px-5 pb-24 sm:px-8">
        <h2 id="elsewhere" className="text-xl font-semibold">Also available</h2>
        <ul className="mt-5 flex flex-wrap gap-3">
          {others.map((p) => (
            <li key={p.slug}>
              <Link href={`/developers/${p.slug}`} className="inline-block rounded-full border border-[var(--foreground)]/15 px-5 py-2.5 text-sm hover:bg-[var(--foreground)]/5">
                {p.h1}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
