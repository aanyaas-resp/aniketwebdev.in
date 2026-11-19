import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Website, professional, and third-party disclaimers for Aniket Jamunde.",
  alternates: { canonical: `${siteUrl()}/disclaimer` },
};

export default async function DisclaimerPage() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Disclaimer"
      description="Information on this website is provided for general information and may change as my services, tools, and industry practices evolve."
      updated="November 19, 2026"
      brandName={settings.brand_name}
      email={settings.contact_email}
      sections={[
        { title: "General information", paragraphs: ["Website content is provided in good faith and is intended as general information, not a promise of a specific result or a substitute for professional advice.", "Before acting on information about technology, marketing, legal, tax, financial, or business matters, obtain advice appropriate to your circumstances."] },
        { title: "Performance and results", paragraphs: ["Website speed, search rankings, engagement, conversions, advertising outcomes, and app performance can depend on many factors outside my control, including competition, budget, content, platforms, hosting, user behaviour, and search engine changes.", "Case studies and examples describe past work or possible outcomes but do not guarantee that a future project will produce the same result."] },
        { title: "External links", paragraphs: ["This website may contain links to third-party websites or resources. I do not control or endorse those services and are not responsible for their content, availability, security, or privacy practices."] },
        { title: "Availability and errors", paragraphs: ["I aim to keep the website accurate and available, but I do not warrant that content is complete, current, uninterrupted, or free from errors.", "To the extent permitted by law, Aniket Jamunde disclaims liability arising from reliance on website content or temporary inability to access the website."] },
        { title: "Professional agreement", paragraphs: ["A written proposal or signed agreement overrides general information on this website where the documents differ.", "Questions about a proposed project should be sent through the contact details shown on this website."] },
      ]}
    />
  );
}
