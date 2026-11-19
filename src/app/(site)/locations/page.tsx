import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { INDIA_REGIONS } from "@/lib/india-regions";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Major Cities of India by State | Aniket Jamunde",
  description:
    "Browse selected major cities and towns across all Indian states and union territories.",
  alternates: { canonical: `${siteUrl()}/locations` },
  robots: { index: true, follow: true },
};

const states = INDIA_REGIONS.filter((region) => region.type === "state");
const unionTerritories = INDIA_REGIONS.filter(
  (region) => region.type === "union territory"
);
const totalListedCities = INDIA_REGIONS.reduce(
  (total, region) => total + region.cities.length,
  0
);

function RegionList({
  heading,
  regions,
}: {
  heading: string;
  regions: typeof INDIA_REGIONS;
}) {
  return (
    <section aria-label={heading}>
      <h2 className="text-xl font-semibold tracking-[-0.03em]">{heading}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => (
          <li key={region.slug}>
            <Link
              href={`/locations/${region.slug}`}
              className="group flex min-h-14 items-center justify-between gap-4 rounded-2xl border border-[var(--foreground)]/12 bg-[var(--foreground)]/[0.025] px-5 py-4 transition-colors hover:border-[var(--foreground)]/30 hover:bg-[var(--foreground)]/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              <span className="font-medium">{region.name}</span>
              <span className="flex shrink-0 items-center gap-2 text-[var(--foreground)]/55">
                <span className="text-xs">{region.cities.length} cities listed</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function LocationsDirectoryPage() {
  return (
    <main className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
      <section className="mx-auto w-full max-w-[1100px] px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]/50">
          India locations
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-6xl">
          Browse by <span className="hl">state or territory.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--foreground)]/65 sm:text-lg">
          Explore a curated, non-exhaustive list of major cities and towns
          grouped by state and union territory. {totalListedCities} places are
          currently listed.
        </p>

        <div className="mt-12 space-y-12">
          <RegionList heading="States" regions={states} />
          <RegionList
            heading="Union territories"
            regions={unionTerritories}
          />
        </div>

        <p className="mt-12 rounded-2xl border border-[var(--foreground)]/10 p-5 text-sm leading-6 text-[var(--foreground)]/65">
          Aniket Jamunde currently has local service pages for Aurangabad
          (Chhatrapati Sambhajinagar) and Pune.{" "}
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
