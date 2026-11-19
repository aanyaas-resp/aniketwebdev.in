import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES, getCity } from "@/lib/cities";
import { DEFAULT_WHY, LOCATION_PAGES } from "@/lib/locations";
import { siteUrl } from "@/lib/seo";

export const dynamicParams = false;

type Params = { params: Promise<{ city: string }> };

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  const url = `${siteUrl()}/cities/${c.slug}`;
  const title = `Web, App & SEO Developer in ${c.name} | Aniket Jamunde`;
  const description = `Websites, mobile apps and SEO for businesses in ${c.displayName}, ${c.region}. ${c.industries.slice(0, 3).join(", ")} and more. Fixed quotes and remote support.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description },
  };
}

export default async function CityPage({ params }: Params) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  const base = siteUrl();
  const url = `${base}/cities/${c.slug}`;
  const serviceLinks = LOCATION_PAGES.filter((p) => p.slug.endsWith(c.slug) || (c.slug === "chhatrapati-sambhajinagar" && p.city === "aurangabad"));
  const nearby = c.nearby.map((slug) => CITIES.find((x) => x.slug === slug)).filter(Boolean) as typeof CITIES;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Aniket Jamunde",
      url: base,
      description: c.intro,
      areaServed: [
        { "@type": "City", name: c.name },
        { "@type": "AdministrativeArea", name: c.region },
      ],
      serviceType: ["Website development", "App development", "SEO, AEO and GEO"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faqs.map((f) => ({
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
        { "@type": "ListItem", position: 2, name: "Cities", item: `${base}/locations/maharashtra` },
        { "@type": "ListItem", position: 3, name: c.name, item: url },
      ],
    },
  ];

  return (
    <main className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <section className="mx-auto w-full max-w-[1100px] px-5 pb-12 pt-6 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/55">{c.region}</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl">
          Web, app and SEO developer in {c.displayName}
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--foreground)]/80">{c.intro}</p>
      </section>

      <section aria-labelledby="local" className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-8">
        <h2 id="local" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Working with businesses in {c.name}</h2>
        <p className="mt-5 max-w-3xl text-[15px] leading-7 text-[var(--foreground)]/75">{c.localContext}</p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {c.industries.map((industry) => (
            <li key={industry} className="rounded-full border border-[var(--foreground)]/15 px-4 py-2 text-sm">{industry}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="services" className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-8">
        <h2 id="services" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">What I can build for you in {c.name}</h2>
        {serviceLinks.length === 0 && (
          <p className="mt-6 max-w-3xl text-[15px] leading-7 text-[var(--foreground)]/75">
            I build websites, apps and search visibility for {c.name} businesses. Tell me what you need and I will suggest the right service.
          </p>
        )}
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {serviceLinks.map((p) => (
            <li key={p.slug}>
              <Link href={`/developers/${p.slug}`} className="flex h-full flex-col gap-3 rounded-[24px] border border-[var(--foreground)]/10 p-6 hover:border-[var(--foreground)]/30">
                <span className="text-sm text-[var(--foreground)]/55">{p.serviceName}</span>
                <span className="text-lg font-semibold">{p.h1}</span>
                <span className="text-sm text-[var(--foreground)]/70">{p.answer.slice(0, 160)}&hellip;</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-[var(--foreground)]/65">
          Not sure which service you need? <Link href="/servicesweoffer" className="underline underline-offset-4">See all services</Link> or <Link href="/#contact" className="underline underline-offset-4">send me a message</Link>.
        </p>
      </section>

      <section aria-labelledby="why" className="mx-auto w-full max-w-[1100px] px-5 py-12 sm:px-8">
        <h2 id="why" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Why clients in {c.name} choose me</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {DEFAULT_WHY.map((point) => (
            <li key={point} className="flex items-start gap-3 rounded-[20px] border border-[var(--foreground)]/10 p-5">
              <span aria-hidden="true" className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--highlight)]" />
              <span className="text-[15px] leading-7">{point}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="faq" className="mx-auto w-full max-w-[860px] px-5 py-12 sm:px-8">
        <h2 id="faq" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">Questions from {c.name} businesses</h2>
        <div className="mt-8 divide-y divide-[var(--foreground)]/10 border-y border-[var(--foreground)]/10">
          {c.faqs.map((f) => (
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

      {nearby.length > 0 && (
        <section aria-labelledby="nearby" className="mx-auto w-full max-w-[1100px] px-5 pb-24 pt-12 sm:px-8">
          <h2 id="nearby" className="text-xl font-semibold">Nearby cities I also serve</h2>
          <ul className="mt-5 flex flex-wrap gap-3">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link href={`/cities/${n.slug}`} className="inline-block rounded-full border border-[var(--foreground)]/15 px-5 py-2.5 text-sm hover:bg-[var(--foreground)]/5">
                  {n.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
