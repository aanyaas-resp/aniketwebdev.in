import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Aniket Jamunde about your website, app, or digital project.",
  robots: { index: false, follow: false },
};

export default function ContactPage() {
  return (
    <main className="min-h-full bg-[var(--background)]">
      <ContactForm />
    </main>
  );
}
