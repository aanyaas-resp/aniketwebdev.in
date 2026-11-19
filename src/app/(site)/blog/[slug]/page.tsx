import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogSlugs, getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const dynamicParams = true;
export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };

  const url = `${siteUrl()}/blog/${post.slug}`;
  const title = post.seo_title ?? post.title;
  const description = post.seo_description ?? post.excerpt ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: post.tags,
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: post.cover_url ? [post.cover_url] : undefined,
      publishedTime: post.published_at ?? undefined,
      tags: post.tags,
    },
  };
}

// Light-weight formatter: "## " lines become headings, blank lines split paragraphs.
function renderBody(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, i) =>
      block.startsWith("## ") ? (
        <h2 key={i} className="mt-12 text-2xl font-semibold tracking-tight sm:text-3xl">
          {block.replace(/^##\s+/, "")}
        </h2>
      ) : (
        <p key={i} className="mt-5 text-[17px] leading-8 text-[var(--foreground)]/75">
          {block}
        </p>
      ),
    );
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getBlogPost(slug), getSettings()]);
  if (!post) notFound();

  const url = `${siteUrl()}/blog/${post.slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seo_title ?? post.title,
    description: post.seo_description ?? post.excerpt ?? undefined,
    image: post.cover_url ?? undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.published_at ?? undefined,
    author: { "@type": "Organization", name: settings.brand_name, url: siteUrl() },
    publisher: { "@type": "Organization", name: settings.brand_name, logo: { "@type": "ImageObject", url: `${siteUrl()}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", "),
  };

  return (
    <main className="bg-[var(--background)] px-5 py-24 text-[var(--foreground)] sm:px-8">
      <div data-reading-progress aria-hidden="true" className="fixed left-5 right-5 top-3 z-50 h-1 origin-left scale-x-0 rounded-full bg-[var(--accent)] sm:left-8 sm:right-8" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd).replace(/</g, "\\u003c") }}
      />
      <article data-reading-target className="mx-auto w-full max-w-[760px]">
        <h1 className="mt-8 text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-5xl">
          {post.title}
        </h1>
        {post.published_at && (
          <time dateTime={post.published_at} className="mt-5 block text-sm text-[var(--foreground)]/45">
            {new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </time>
        )}
        {post.cover_url && (
          <img src={post.cover_url} alt={post.title} className="mt-10 w-full rounded-[24px] border border-[var(--foreground)]/10 object-cover" />
        )}
        {post.excerpt && <p className="mt-10 text-xl leading-9 text-[var(--foreground)]/85">{post.excerpt}</p>}
        <div>{renderBody(post.content)}</div>
      </article>
    </main>
  );
}
