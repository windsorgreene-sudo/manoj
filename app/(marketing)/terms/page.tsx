import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Terms of Service", description: "The rules for using CodeVerse.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="1 September 2026">
      <p>By creating an account or using CodeVerse you agree to these terms. If you do not agree, please do not use the service.</p>
      <h2>1. Accounts</h2>
      <p>You must be at least 13 years old. Keep your credentials secure; you are responsible for activity under your account. One person, one account.</p>
      <h2>2. Acceptable use</h2>
      <ul>
        <li>Do not attempt to break, overload or escape the code-execution sandbox, or use it for crypto-mining, network scanning or other abuse.</li>
        <li>Do not share contest solutions while a contest is running or use multiple accounts in rated contests.</li>
        <li>Be respectful in comments and the Doubts forum. Harassment, hate speech and spam are removed and may lead to suspension.</li>
      </ul>
      <h2>3. Your content</h2>
      <p>You keep ownership of code, notes, comments and articles you create. You grant CodeVerse a licence to host and display content you choose to make public (comments, answers, published articles).</p>
      <h2>4. Contributors</h2>
      <p>Approved contributors grant CodeVerse a non-exclusive licence to publish their articles. Articles are reviewed before publication and may be edited for clarity.</p>
      <h2>5. Pro subscriptions</h2>
      <p>Pro renews automatically until cancelled. You can cancel anytime from Settings; access continues until the end of the paid period. First-time subscribers may request a full refund within 7 days.</p>
      <h2>6. Certificates</h2>
      <p>Certificates confirm course completion on CodeVerse. They can be revoked if obtained through academic dishonesty.</p>
      <h2>7. Disclaimers</h2>
      <p>The service is provided &quot;as is&quot;. We work hard to keep content accurate but do not guarantee specific results such as job offers.</p>
      <h2>8. Changes &amp; contact</h2>
      <p>We may update these terms and will notify you of material changes by email. Questions: legal@codeverse.dev. These terms are governed by the laws of India; courts in Bengaluru have jurisdiction.</p>
    </LegalPage>
  );
}
