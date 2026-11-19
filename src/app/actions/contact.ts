"use server";

import { hasSupabase, publicClient } from "@/lib/supabase/public";

export type ContactState = { ok: boolean; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, key: string, max: number) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never fill this hidden field, bots often do.
  if (field(formData, "website", 200)) {
    return { ok: true, message: "Thanks! I'll be in touch shortly." };
  }

  const name = field(formData, "name", 100);
  const email = field(formData, "email", 150);
  const phone = field(formData, "phone", 30);
  const service = field(formData, "service", 80);
  const message = field(formData, "message", 2000);
  const sourcePage = field(formData, "source_page", 200);

  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return { ok: false, message: "Please add your name, a valid email and a short message." };
  }

  if (!hasSupabase()) {
    return { ok: false, message: "Contact form is not configured yet. Please email me directly." };
  }

  const { error } = await publicClient()
    .from("contact_submissions")
    .insert({ name, email, phone: phone || null, service: service || null, message, source_page: sourcePage || "/" });

  if (error) {
    return { ok: false, message: "Something went wrong. Please try again in a moment." };
  }

  return { ok: true, message: "Thanks! I'll be in touch shortly." };
}
