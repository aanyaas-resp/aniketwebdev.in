import type { Metadata } from "next";
import LegalPage from "@/components/layout/LegalPage";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  description: "Cancellation, refund, and project termination terms for Aniket Jamunde services.",
  alternates: { canonical: `${siteUrl()}/refund-policy` },
};

export default async function RefundPolicyPage() {
  const settings = await getSettings();
  return (
    <LegalPage
      title="Refund and Cancellation Policy"
      description="Project engagements are customized, so cancellation and refund terms depend on work completed and the agreement attached to each proposal."
      updated="November 19, 2026"
      brandName={settings.brand_name}
      email={settings.contact_email}
      sections={[
        { title: "Cancellation requests", paragraphs: ["A cancellation request must be sent in writing to the contact address shown on this website. It becomes effective only after written acknowledgement.", "Where possible, please provide at least five business days' notice before stopping scheduled work or a hosting and maintenance engagement."] },
        { title: "Refund eligibility", paragraphs: ["Advance payments secure project time and reserving work; they are generally non-refundable once work, planning, design, development, or procurement has begun.", "A refund may be considered where Aniket Jamunde has not started the affected service or where a specific written agreement provides a refund entitlement. Third-party charges and completed work are excluded."] },
        { title: "Completed work", paragraphs: ["If a project is cancelled after work begins, invoices for completed work and approved milestones remain payable. Work may be handed over where required under the project agreement and subject to full payment for delivered work.", "Unused hours, domain or hosting renewals, paid subscriptions, advertising budgets, stock assets, and third-party licenses are generally non-refundable."] },
        { title: "Payment disputes", paragraphs: ["Please raise any billing or quality concern promptly and allow reasonable opportunity for review or correction before cancelling the project.", "Any approved refund will be returned using the original payment method where feasible. Processing time may vary by bank or payment provider."] },
        { title: "Project termination", paragraphs: ["I may suspend or terminate a project for non-payment, abusive conduct, illegal use, repeated scope changes, or failure to provide required information or approvals.", "Termination does not remove outstanding payment obligations. Any usable project files or credentials will be handled according to the signed agreement."] },
      ]}
    />
  );
}
