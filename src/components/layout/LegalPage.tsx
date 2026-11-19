export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export default function LegalPage({
  title,
  description,
  updated,
  sections,
  brandName,
  email,
}: {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
  brandName: string;
  email: string | null;
}) {
  return (
    <main className="min-h-full bg-[var(--background)] px-5 py-16 text-[var(--foreground)] sm:px-8 sm:py-24">
      <article className="mx-auto w-full max-w-[900px]">
        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]/45">
          Legal
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--foreground)]/65 sm:text-lg">
          {description}
        </p>
        <p className="mt-5 text-sm text-[var(--foreground)]/45">Last updated: {updated}</p>

        <div className="mt-12 space-y-5">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className="rounded-[24px] border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.025] p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="hl shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold tracking-wide">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="pt-0.5 text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                  <span className="hl">{section.title}</span>
                </h2>
              </div>
              <div className="mt-5 space-y-4 sm:pl-12">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-7 text-[var(--foreground)]/65 sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {email && (
          <div className="mt-10 flex flex-col gap-3 rounded-[24px] bg-[var(--secondary)] px-6 py-6 text-[var(--foreground)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-sm font-semibold">Questions about this policy?</p>
              <p className="mt-1 text-sm opacity-70">Contact {brandName} directly.</p>
            </div>
            <a
              href={`mailto:${email}`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-ink)]"
            >
              Email me
            </a>
          </div>
        )}
      </article>
    </main>
  );
}
