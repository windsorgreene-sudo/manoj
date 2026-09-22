import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Disclaimer for ${SITE.name}.`,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <StaticPage title="Disclaimer">
      <p>
        The material on {SITE.name} is intended for educational reference. While every effort is
        made to keep tutorials, notes and code samples accurate and up to date, they are provided
        &ldquo;as is&rdquo; without any guarantee of completeness.
      </p>
      <h2 id="academic">Academic use</h2>
      <p>
        Assignments and lab programs are provided as study aids. Follow your institution&rsquo;s
        academic integrity policy when using them. They are meant to help you understand a topic, not
        to be submitted as your own unmodified work.
      </p>
      <h2 id="external">External links</h2>
      <p>
        Some articles reference external resources. {SITE.name} is not responsible for the content of
        third-party sites.
      </p>
    </StaticPage>
  );
}
