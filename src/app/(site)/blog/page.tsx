import type { Metadata } from "next";
import Link from "next/link";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import Reveal from "@/components/sections/Reveal";
import { getBlogPosts } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description: "Practical guides on websites, apps, SEO, AEO, GEO and AI automation from Aniket Jamunde.",
  alternates: { canonical: `${siteUrl()}/blog` },
};

export default async function BlogIndex() {
  const posts = await getBlogPosts();

  return (
    <main className="bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--foreground)]/45">Blog</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          Ideas for growing online
        </h1>

        {posts.length === 0 ? (
          <p className="mt-12 text-[var(--foreground)]/55">New articles are coming soon.</p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 90}>
                <NotchedProjectCard
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  image={post.cover_url ?? undefined}
                  imageAlt={post.title}
                  description={post.excerpt ?? undefined}
                  tags={post.tags}
                  accent="var(--accent)"
                  accentForeground="var(--accent-ink)"
                  surface="var(--background)"
                />
              </Reveal>
            ))}
          </div>
        )}

        <Link href="/" className="mt-16 inline-block text-sm text-[var(--foreground)]/60 hover:text-[var(--foreground)]">
          Back to home
        </Link>
      </div>
    </main>
  );
}
