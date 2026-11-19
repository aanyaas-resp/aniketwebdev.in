import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Information about cookies used on the Aniket Jamunde website.",
  alternates: { canonical: `${siteUrl()}/cookie-policy` },
};

export default async function CookiePolicyPage() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Cookie Policy"
      description="This policy explains how cookies and similar browser technologies may be used on the Aniket Jamunde website."
      updated="November 19, 2026"
      brandName={settings.brand_name}
      email={settings.contact_email}
      sections={[
        { title: "What are cookies?", paragraphs: ["Cookies are small text files stored in a browser when you visit a website. Similar technologies include local storage and pixels.", "Cookies help websites remember preferences, understand visits, maintain security, and improve the experience."] },
        { title: "Cookie types", paragraphs: ["Necessary cookies support essential functions and may not be disabled in some systems.", "Preference cookies remember choices such as layout or accessibility settings. Analytics cookies help me understand which pages are viewed and how visitors move through the site.", "Marketing cookies may be used to measure campaign performance or show relevant promotions where enabled."] },
        { title: "Third-party services", paragraphs: ["Hosting, analytics, embedded media, maps, and other service providers may set their own cookies. Their use is governed by their respective privacy policies.", "I do not control how third-party providers process data collected through their technologies."] },
        { title: "Managing cookies", paragraphs: ["You can delete, block, or manage cookies through your browser settings. Instructions vary by browser and device.", "Blocking necessary cookies may reduce website functionality. Blocking analytics or marketing cookies will not prevent you from using the core website."] },
        { title: "Policy updates", paragraphs: ["I may update this Cookie Policy as my technology or legal requirements change. The most recent update date appears at the top of this page."] },
      ]}
    />
  );
}
