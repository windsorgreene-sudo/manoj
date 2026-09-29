import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/legal-page";

export const metadata: Metadata = { title: "Privacy Policy", description: "How CodeVerse collects, uses and protects your data.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="1 September 2026">
      <p>CodeVerse Learning Pvt. Ltd. (&quot;CodeVerse&quot;, &quot;we&quot;) respects your privacy. This policy explains what we collect, why, and the choices you have. It is written to comply with India&apos;s Digital Personal Data Protection Act, 2023.</p>
      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account data</strong> — name, email, password hash, avatar and profile details you add (college, bio, links).</li>
        <li><strong>Learning activity</strong> — lessons completed, code you submit, quiz attempts, contest participation, notes and bookmarks.</li>
        <li><strong>Usage data</strong> — pages visited, device type and approximate country, used in aggregate to improve the product.</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To provide the service: run your code, track progress, issue certificates and show leaderboards.</li>
        <li>To send transactional emails (verification, password reset, receipts) and — only if you opt in — the weekly digest.</li>
        <li>To keep the platform safe: rate limiting, abuse prevention and fraud detection.</li>
      </ul>
      <h2>AI tutor</h2>
      <p>Messages you send to the AI tutor, along with the article or problem you are viewing, are sent to our AI provider to generate a response. They are not used to train third-party models.</p>
      <h2>Sharing</h2>
      <p>We never sell personal data. We share data only with processors that help us run CodeVerse (hosting, email, payments, code execution) under contracts that protect it, or when required by law.</p>
      <h2>Public information</h2>
      <p>Your username, avatar, badges, solved counts, heatmap and contest rating appear on your public profile. Your email, notes and code are private.</p>
      <h2>Your rights</h2>
      <p>You can access, correct, export or delete your data from Settings, or by emailing <a href="mailto:privacy@codeverse.dev">privacy@codeverse.dev</a>. We respond within 30 days.</p>
      <h2>Retention &amp; security</h2>
      <p>We keep account data while your account is active and delete it within 30 days of account deletion (payment records are retained as required by tax law). Data is encrypted in transit (TLS) and at rest; passwords are hashed with scrypt.</p>
      <h2>Contact</h2>
      <p>Grievance Officer: Priya Verma, privacy@codeverse.dev, HSR Layout, Bengaluru 560102.</p>
    </LegalPage>
  );
}
