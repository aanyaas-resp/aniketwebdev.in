import { publicClient, hasSupabase } from "@/lib/supabase/public";

// ---------- Types ----------
export type Settings = {
  brand_name: string;
  tagline: string | null;
  meta_description: string | null;
  accent_color: string;
  secondary_color: string;
  highlight_color: string;
  background_color: string;
  foreground_color: string;
  logo_url: string | null;
  contact_email: string | null;
  phone: string | null;
  whatsapp: string | null;
  footer_text: string | null;
  footer_url: string | null;
  chat_enabled: boolean;
  chat_greeting: string | null;
  chat_instructions: string | null;
  chat_suggestions: string[];
  business_name: string;
  business_address: string | null;
  business_gstin: string | null;
  business_pan: string | null;
  business_upi_id: string | null;
  business_bank_details: string | null;
};

export type Project = {
  id: string;
  title: string;
  slug: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  live_url: string | null;
  tags: string[];
  technologies?: string[];
  featured: boolean;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number | null;
  sort_order: number;
};

export type Client = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  content: string;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
};

// ---------- Defaults (used when Supabase is not configured yet) ----------
export const DEFAULT_SETTINGS: Settings = {
  brand_name: "Aniket Jamunde",
  tagline: "Web, App & AI Development",
  meta_description:
    "Aniket Jamunde builds fast, SEO-ready websites, mobile apps and AI automation for growing businesses.",
  accent_color: "#d4f94a",
  secondary_color: "#0b0b0b",
  highlight_color: "#d4f94a",
  background_color: "#f4f8ea",
  foreground_color: "#0b0b0b",
  logo_url: null,
  contact_email: null,
  phone: null,
  whatsapp: null,
  footer_text: "aniketwebdev.in",
  footer_url: "https://aniketwebdev.in",
  business_name: "Aniket Jamunde",
  business_address: null,
  business_gstin: null,
  business_pan: null,
  business_upi_id: null,
  business_bank_details: null,
  chat_enabled: true,
  chat_greeting: "Hi! I am the assistant for Aniket Jamunde. Ask me about websites, apps, SEO or how to start a project.",
  chat_instructions: null,
  chat_suggestions: ["What services do you offer?", "Can you build a mobile app?", "How do I improve my Google ranking?", "How do I start a project?"],
};

// ---------- Readers (never throw; return safe fallbacks) ----------
export async function getSettings(): Promise<Settings> {
  if (!hasSupabase()) return DEFAULT_SETTINGS;
  const { data, error } = await publicClient()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(data as Partial<Settings>) };
}

export async function getProjects(limit?: number): Promise<Project[]> {
  if (!hasSupabase()) return [];
  let query = publicClient()
    .from("projects")
    .select("*").is("deleted_at", null)
    .order("sort_order", { ascending: true });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  return error ? [] : ((data ?? []) as Project[]);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!hasSupabase()) return [];
  const { data, error } = await publicClient()
    .from("testimonials")
    .select("*").is("deleted_at", null)
    .order("sort_order", { ascending: true });
  return error ? [] : ((data ?? []) as Testimonial[]);
}

export async function getClients(): Promise<Client[]> {
  if (!hasSupabase()) return [];
  const { data, error } = await publicClient()
    .from("clients")
    .select("*").is("deleted_at", null)
    .order("sort_order", { ascending: true });
  return error ? [] : ((data ?? []) as Client[]);
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  if (!hasSupabase()) return [];
  let query = publicClient()
    .from("blog_posts")
    .select("*").is("deleted_at", null)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  return error ? [] : ((data ?? []) as BlogPost[]);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!hasSupabase()) return null;
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const { data, error } = await publicClient()
    .from("blog_posts")
    .select("*").is("deleted_at", null)
    .eq("slug", slug)
    .maybeSingle();
  return error ? null : ((data as BlogPost) ?? null);
}

export async function getBlogSlugs(): Promise<{ slug: string; published_at: string | null }[]> {
  if (!hasSupabase()) return [];
  const { data, error } = await publicClient().from("blog_posts").select("slug, published_at").is("deleted_at", null);
  return error ? [] : ((data ?? []) as { slug: string; published_at: string | null }[]);
}
