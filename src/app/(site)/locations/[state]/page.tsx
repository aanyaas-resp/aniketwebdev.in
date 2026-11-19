import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getIndiaRegion, INDIA_REGIONS } from "@/lib/india-regions";
import { LOCATION_PAGES } from "@/lib/locations";
import { siteUrl } from "@/lib/seo";

export const dynamicParams = false;

type Params = { params: Promise<{ state: string }> };

export function generateStaticParams() {
  return INDIA_REGIONS.map(({ slug }) => ({ state: slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { state } = await params;
  const region = getIndiaRegion(state);
  if (!region) return {};

  const url = `${siteUrl()}/locations/${region.slug}`;
  return {
    title: `Major Cities in ${region.name}, India | Aniket Jamunde`,
    description: `Browse ${region.cities.length} selected major cities and towns in ${region.name}, India. This directory is not exhaustive.`,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function StateLocationsPage({ params }: Params) {
  const { state } = await params;
  const region = getIndiaRegion(state);
  if (!region) notFound();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "India locations", item: `${siteUrl()}/locations` },
        { "@type": "ListItem", position: 2, name: region.name, item: `${siteUrl()}/locations/${region.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Selected major cities and towns in ${region.name}`,
      numberOfItems: region.cities.length,
      itemListElement: region.cities.map((city, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: city,
      })),
    },
  ];

  return (
    <main className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="mx-auto w-full max-w-[960px] px-5 pb-20 pt-10 sm:px-8 sm:pt-16">

        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/50">
          {region.type}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-6xl">
          Major cities in <span className="hl">{region.name}</span>
        </h1>

        <div className="mt-8 rounded-[24px] border border-[var(--foreground)]/12 bg-[var(--foreground)]/[0.025] p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-xl font-semibold tracking-[-0.03em]">
              {region.cities.length} major cities and towns listed
            </h2>
            <span className="text-xs text-[var(--foreground)]/50">Selected list · not exhaustive</span>
          </div>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {region.cities.map((city) => {
              const cityKey =
                city === "Chhatrapati Sambhajinagar" ? "aurangabad" : city.toLowerCase();
              const servicePages = LOCATION_PAGES.filter(
                (page) =>
                  page.city === cityKey &&
                  (region.slug === "maharashtra" || page.city !== "aurangabad")
              );

              return (
                <li
                  key={city}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-[var(--foreground)]/10 bg-[var(--background)] px-4 py-3"
                >
                  <span className="font-medium">{city}</span>
                  {servicePages.length > 0 && (
                    <span className="flex shrink-0 gap-2">
                      {servicePages.map((page) => (
                        <Link
                          key={page.slug}
                          href={`/developers/${page.slug}`}
                          aria-label={`${page.serviceName} in ${city}`}
                          className="text-xs font-medium text-[var(--foreground)]/65 underline underline-offset-4 transition-colors hover:text-[var(--foreground)]"
                        >
                          {page.service === "web" ? "Web" : "App"}
                        </Link>
                      ))}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-6 text-sm leading-6 text-[var(--foreground)]/65">
          This is a selected list of major cities and towns, not a complete count
          of every settlement in {region.name}. Aniket Jamunde currently publishes
          local service pages only for Aurangabad (Chhatrapati Sambhajinagar)
          and Pune.{" "}
          <Link
            href="/contact"
            className="font-semibold text-[var(--foreground)] underline underline-offset-4"
          >
            Contact me
          </Link>{" "}
          to confirm availability elsewhere.
        </p>
      </section>
    </main>
  );
}
