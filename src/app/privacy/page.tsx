import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE.name}.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <StaticPage title="Privacy Policy" intro="How this site handles your data.">
      <p>
        {SITE.name} is designed to be usable without an account. Reading any article, tutorial or
        resource does not require you to provide personal information.
      </p>
      <h2 id="local-storage">Local storage</h2>
      <p>
        Your theme preference (light or dark), recent searches and bookmarks are stored in your
        browser using local storage. This data stays on your device and is not transmitted to a
        server.
      </p>
      <h2 id="analytics">Analytics</h2>
      <p>
        If analytics are enabled, only aggregate, non-identifying usage information is collected to
        understand which topics are most useful. No personally identifying profiles are built.
      </p>
      <h2 id="changes">Changes</h2>
      <p>This policy may be updated. The date of the latest revision will be noted here.</p>
    </StaticPage>
  );
}
