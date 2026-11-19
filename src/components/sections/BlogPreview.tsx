import Link from "next/link";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import type { BlogPost } from "@/lib/content";
import Reveal from "./Reveal";
import BlurText from "./BlurText";

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" aria-labelledby="blog-heading" className="bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <Reveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--foreground)]/45">Insights</p>
              <BlurText
                as="h2"
                id="blog-heading"
                text="From the blog"
                highlight={["blog"]}
                className="mt-4 text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-6xl"
              />
            </div>
            <Link href="/blog" className="text-sm text-[var(--foreground)]/70 underline-offset-4 hover:text-[var(--foreground)] hover:underline">
              Read all articles
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.id} variant="blur" delay={(index % 3) * 120}>
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
      </div>
    </section>
  );
}
