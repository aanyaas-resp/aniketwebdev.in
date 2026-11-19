import { Code2, Globe, TrendingUp } from "lucide-react";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import Reveal from "./Reveal";

// Packages describe what is included, not prices. Quotes are fixed after a short call.
const PACKAGES = [
  {
    name: "Starter website",
    for: "Small businesses who need a credible online presence fast.",
    items: ["Up to 5 pages", "Mobile-friendly design", "Contact form and WhatsApp link", "Basic SEO setup and sitemap", "Google Business guidance"],
    icon: Globe,
    featured: false,
  },
  {
    name: "Growth website + SEO",
    for: "Businesses that want leads from Google and an admin panel to edit content.",
    items: ["Everything in Starter", "Admin panel to manage content", "Blog and service pages", "Local SEO landing pages", "Speed and Core Web Vitals tuning"],
    icon: TrendingUp,
    featured: true,
  },
  {
    name: "Custom web or app",
    for: "Products that need logins, dashboards, payments or a mobile app.",
    items: ["Scoped with a written plan", "Web app or Flutter mobile app", "Backend and database setup", "Store publishing support", "Ongoing care available"],
    icon: Code2,
    featured: false,
  },
];

export default function PackagesSection() {
  return (
    <section
      id="packages"
      aria-label="Packages"
      className="bg-[var(--background)] px-5 py-12 text-[var(--foreground)] sm:px-8 sm:py-16"
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="grid gap-5 lg:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <Reveal
              key={pkg.name}
              className="h-full"
              delay={i * 110}
              variant={pkg.featured ? "scale" : "blur"}
            >
              <NotchedProjectCard
                title={pkg.name}
                description={pkg.for}
                href="/#contact"
                coverAspectClassName="aspect-[2/1]"
                coverStyle={{
                  backgroundColor: pkg.featured
                    ? "var(--secondary)"
                    : "var(--highlight)",
                  color: pkg.featured
                    ? "var(--highlight)"
                    : "var(--accent-ink)",
                }}
                coverContent={<pkg.icon size={40} strokeWidth={1.5} aria-hidden="true" />}
                surface="var(--background)"
                accent="var(--highlight)"
                accentForeground="var(--accent-ink)"
                className={`h-full rounded-[28px] border bg-[var(--background)] p-3 [&_h3]:mt-3 [&_h3]:text-xl [&_p]:mt-1 [&_p]:text-xs ${
                  pkg.featured
                    ? "border-[var(--highlight)]"
                    : "border-[var(--foreground)]/10"
                }`}
              >
                <ul className="mt-4 flex-1 space-y-1.5">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-xs leading-5">
                      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--highlight)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="sr-only">
                  Choose this package and request a fixed quote.
                </span>
              </NotchedProjectCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
