import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid enquiry." }, { status: 400 });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 150);
  const phone = clean(body.phone, 30);
  const service = clean(body.service, 80);
  const message = clean(body.message, 2000);
  const sourcePage = clean(body.source_page, 200) || "/";

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return Response.json({ error: "Please provide your name, a valid email, and project details." }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json({ error: "The contact system is not configured yet." }, { status: 503 });
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await supabase.from("contact_submissions").insert({
    name,
    email,
    phone: phone || null,
    service: service || null,
    message,
    source_page: sourcePage,
  });

  if (error) {
    return Response.json({ error: "The enquiry could not be sent. Please try again." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
