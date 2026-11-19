import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms governing use of the Aniket Jamunde website and services.",
  alternates: { canonical: `${siteUrl()}/terms` },
};

export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Terms and Conditions"
      description="These terms govern your use of this website and any services, proposals, or agreements entered into with Aniket Jamunde."
      updated="November 19, 2026"
      brandName={settings.brand_name}
      email={settings.contact_email}
      sections={[
        { title: "Acceptance", paragraphs: ["By using this website or engaging my services, you agree to these terms. If you do not agree, please stop using the website.", "Specific project scope, price, payment schedule, timeline, and acceptance conditions will be defined in a written proposal or agreement."] },
        { title: "Website use", paragraphs: ["You may browse and use this website for lawful business and personal purposes. You must not attempt to disrupt, exploit, reverse engineer, or misuse the website or its systems.", "All website content may be updated or removed without notice. I do not guarantee that every page or feature will always remain available or error-free."] },
        { title: "Services and proposals", paragraphs: ["Website, application, SEO, automation, and related estimates are based on information available at the time of quotation. Additional work or changes outside the agreed scope may require revised fees and timelines.", "Third-party tools, hosting, domains, licenses, advertising spend, and platform fees are not included unless expressly stated in writing."] },
        { title: "Client responsibilities", paragraphs: ["Clients are responsible for providing accurate requirements and timely content, approvals, credentials, and feedback. Delays may affect delivery schedules.", "Clients confirm that they own or have permission to use submitted text, images, logos, software, and other materials."] },
        { title: "Payments", paragraphs: ["Payment terms, due dates, milestones, and renewal charges must be included in the applicable proposal or invoice.", "Overdue balances may pause work or suspension of hosted services until settled. Applicable taxes and payment platform charges remain the client's responsibility."] },
        { title: "Intellectual property", paragraphs: ["Unless otherwise agreed in writing, final project materials transfer to the client after full payment. Aniket Jamunde retains ownership of reusable components, internal tools, frameworks, processes, and work completed before or outside the project.", "My branding, website code, written resources, and original visual assets may not be copied or resold without permission."] },
        { title: "Limitation of liability", paragraphs: ["To the extent permitted by law, Aniket Jamunde is not liable for indirect, incidental, lost-profit, data-loss, or consequential damages arising from website use or third-party services.", "Nothing in these terms excludes liability that cannot lawfully be excluded."] },
        { title: "Changes and governing law", paragraphs: ["I may revise these terms from time to time. Continued use of the website after revisions constitutes acceptance of the updated terms.", "These terms are governed by the laws applicable in India. Disputes should first be raised with me through the contact details published on this website."] },
      ]}
    />
  );
}
