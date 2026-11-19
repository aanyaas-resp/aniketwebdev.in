import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, Sparkles, Target } from "lucide-react";
import Services from "@/components/sections/Services";
import ProcessSteps from "@/components/sections/ProcessSteps";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import ServiceAreas from "@/components/sections/ServiceAreas";
import FAQ from "@/components/sections/faq";
import CTA from "@/components/sections/cta";
import { ActionButton } from "@/components/ui/action-button";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import { getServiceBySlug, SERVICES, SERVICE_AREAS } from "@/lib/services";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SERVICES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service not found | Aniket Jamunde",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const faqItems = service.faqs.map(({ question, answer }, index) => ({
    number: String(index + 1).padStart(2, "0"),
    category: service.title,
    q: question,
    a: answer,
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: { "@type": "Organization", name: "Aniket Jamunde" },
        areaServed: [
          ...SERVICE_AREAS.map((name) => ({ "@type": "City", name })),
          { "@type": "Place", name: "Worldwide" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return (
    <main className="min-h-full bg-[var(--background)] font-sans text-[var(--foreground)] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className="px-5 pb-12 pt-24 sm:px-8 sm:pt-28">
        <div className="mx-auto max-w-5xl">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[var(--foreground)]/[0.04] sm:aspect-[21/9]">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/45 to-transparent"
            />
            <div className="absolute bottom-0 left-0 max-w-3xl p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--foreground)]/60">
                Aniket Jamunde service
              </p>
              <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
                {service.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--foreground)]/75 sm:text-base">
                {service.description}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-12">
            <p className="text-base leading-relaxed text-[var(--foreground)]/65">
              {service.longDescription}
            </p>
            <NotchedProjectCard
              title={service.pricing.range}
              badge={service.pricing.label}
              notch="bottom-right"
              coverAspectClassName="aspect-[2.8/1]"
              coverStyle={{
                background:
                  "radial-gradient(circle at 22% 18%, #292929 0%, var(--secondary) 72%)",
                color: "var(--background)",
              }}
              coverContent={
                <span className="text-sm font-semibold uppercase tracking-[0.16em]">
                  Pricing
                </span>
              }
              accent="var(--highlight)"
              accentForeground="var(--accent-ink)"
              surface="var(--background)"
              className="h-full"
            >
              <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/65">
                {service.pricing.note}
              </p>
            </NotchedProjectCard>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 lg:grid-cols-2">
            {[
              {
                title: "Who this is for",
                badge: "GOOD FIT",
                items: service.whoItsFor,
                Icon: Target,
              },
              {
                title: "What you gain",
                badge: "THE BENEFITS",
                items: service.benefits,
                Icon: Sparkles,
              },
            ].map(({ title, badge, items, Icon }) => (
              <NotchedProjectCard
                key={title}
                title={title}
                badge={badge}
                notch="bottom-right"
                coverAspectClassName="aspect-[3/1]"
                coverStyle={{
                  background:
                    "radial-gradient(circle at 22% 18%, #292929 0%, var(--secondary) 72%)",
                  color: "var(--background)",
                }}
                coverContent={<Icon className="h-9 w-9" strokeWidth={1.5} aria-hidden="true" />}
                accent="var(--highlight)"
                accentForeground="var(--accent-ink)"
                surface="var(--background)"
                className="h-full"
              >
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item} className="text-sm leading-6 text-[var(--foreground)]/70">
                      {item}
                    </li>
                  ))}
                </ul>
              </NotchedProjectCard>
            ))}
          </div>

          <div className="lg:col-span-2">
            <h2 className="mt-12 text-2xl font-semibold tracking-tight">What&apos;s included</h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.included.map((item, index) => (
                <li key={item} className="h-full">
                  <NotchedProjectCard
                    title={item}
                    badge={`INCLUDED ${String(index + 1).padStart(2, "0")}`}
                    notch="bottom-right"
                    coverAspectClassName="aspect-[2.4/1]"
                    coverStyle={{
                      background:
                        "linear-gradient(145deg, var(--highlight), var(--accent))",
                      color: "var(--accent-ink)",
                    }}
                    coverContent={
                      <Check className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
                    }
                    accent="var(--highlight)"
                    accentForeground="var(--accent-ink)"
                    surface="var(--background)"
                    className="h-full [&_h3]:text-lg"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Services />
      <ProcessSteps />
      <WhyChooseUs />
      <FAQ items={faqItems} />
      <CTA />
      <ServiceAreas />

      <div className="pointer-events-none fixed bottom-5 right-5 z-50 sm:bottom-8 sm:right-8">
        <div className="pointer-events-auto shadow-[0_10px_40px_-10px_rgba(255,255,255,0.35)]">
          <ActionButton href="/contact" variant="primary">
            Contact me
          </ActionButton>
        </div>
      </div>
    </main>
  );
}
