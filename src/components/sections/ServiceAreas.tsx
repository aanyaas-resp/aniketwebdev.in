import { ArrowUpRight, Code2, MapPin, Smartphone } from "lucide-react";
import Link from "next/link";
import { LOCATION_PAGES } from "@/lib/locations";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import Reveal from "./Reveal";

// Internal links to the local landing pages: helps Google find them and users pick the right one.
export default function ServiceAreas() {
  return (
    <section
      aria-labelledby="areas-heading"
      className="bg-[var(--background)] px-5 py-20 text-[var(--foreground)] sm:px-8 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--foreground)]/50">
            Where I work
          </p>
          <h2
            id="areas-heading"
            className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl"
          >
            Web and app development in{" "}
            <span className="hl">Aurangabad and Pune.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--foreground)]/55 sm:text-base">
            Local collaboration when it helps, and a clear remote process wherever you are.
          </p>
          <Link
            href="/locations"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]/75 transition-colors hover:text-[var(--foreground)]"
          >
            Browse all states and territories
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATION_PAGES.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <NotchedProjectCard
                href={`/developers/${p.slug}`}
                title={p.h1}
                badge={p.serviceName}
                coverAspectClassName="aspect-[1.35/1]"
                coverStyle={{
                  background:
                    i % 2 === 0
                      ? "linear-gradient(145deg, #d4f94c 0%, #c4ed3d 100%)"
                      : "radial-gradient(circle at 22% 18%, #202020 0%, #0b0b0b 68%)",
                  color: i % 2 === 0 ? "#0b0b0b" : "#ffffff",
                }}
                coverContent={
                  <div className="flex h-full w-full flex-col items-start justify-between px-5 pb-12 pr-16 pt-12 text-left">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-65">
                      Serving Maharashtra
                    </span>
                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-xs opacity-70">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Local expertise</span>
                      </div>
                      <p className="text-2xl font-semibold leading-none tracking-[-0.04em]">
                        {p.city === "aurangabad" ? "Aurangabad" : "Pune"}
                      </p>
                    </div>
                  </div>
                }
                icon={
                  p.service === "web" ? (
                    <Code2 className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Smartphone className="h-5 w-5" aria-hidden="true" />
                  )
                }
                description={
                  p.service === "web"
                    ? "Websites and custom web applications."
                    : "Mobile apps for iOS and Android."
                }
                accent="var(--highlight)"
                accentForeground="var(--accent-ink)"
                surface="var(--background)"
                className="h-full transition-transform duration-300 hover:-translate-y-1"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
