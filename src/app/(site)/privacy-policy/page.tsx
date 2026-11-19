import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Aniket Jamunde collects, uses, and protects personal information.",
  alternates: { canonical: `${siteUrl()}/privacy-policy` },
};

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Privacy Policy"
      description="I respect your privacy and explain here what information I collect, why I collect it, and the choices available to you."
      updated="November 19, 2026"
      brandName={settings.brand_name}
      email={settings.contact_email}
      sections={[
        { title: "Information I collect", paragraphs: ["I may collect your name, email address, phone number, service interest, message, and source page when you submit a website form or contact me directly.", "I may also collect basic technical information such as browser type, device information, approximate location, and usage data needed to operate and improve the website."] },
        { title: "How I use information", paragraphs: ["I use your information to respond to enquiries, provide estimates, deliver agreed services, send project updates, improve my services, and maintain website security.", "I do not sell your personal information. I process information only as necessary for the purpose for which it was provided or as permitted by applicable law."] },
        { title: "Forms and storage", paragraphs: ["Contact form submissions are securely transmitted and stored using the website's configured database provider, which may include Supabase. Access is restricted to authorized business use.", "Please do not submit passwords, payment credentials, confidential customer records, or other sensitive information through a contact form."] },
        { title: "Cookies and analytics", paragraphs: ["I may use necessary cookies and privacy-conscious analytics to keep the site functioning, understand usage, and improve performance. For details, see my Cookie Policy.", "You can control cookies through your browser settings. Blocking certain cookies may affect website functionality."] },
        { title: "Sharing and retention", paragraphs: ["I may share information with trusted hosting, communication, payment, analytics, or professional service providers only where needed to operate or support my services.", "I retain information only as long as necessary for support, project records, legal obligations, dispute handling, or legitimate business purposes."] },
        { title: "Your choices", paragraphs: ["You may request access, correction, deletion, or a copy of your personal information, subject to applicable legal exceptions.", "If you want to stop marketing communications, use the unsubscribe option where available or contact me directly."] },
        { title: "Security and changes", paragraphs: ["I use reasonable administrative and technical measures to protect data. No method of online transmission or storage is completely secure, so I cannot guarantee absolute security.", "I may update this policy when my practices or legal requirements change. The revised date will appear at the top of this page."] },
      ]}
    />
  );
}
