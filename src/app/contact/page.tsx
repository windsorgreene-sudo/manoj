import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the CodeVidya editorial team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <StaticPage
      title="Contact"
      intro="Questions, corrections or suggestions about the content are welcome."
    >
      <p>
        If you spot an error in an article, want to request a topic, or have feedback about the
        site, please reach out. Corrections to technical content are especially appreciated and are
        reviewed before publishing.
      </p>
      <h2 id="email">Email</h2>
      <p>
        Editorial: <a href="mailto:editor@codevidya.in">editor@codevidya.in</a>
      </p>
      <h2 id="corrections">Reporting a correction</h2>
      <p>
        Include the article title and a short description of the issue. If you are suggesting a code
        fix, mention the language and the expected output so it can be verified.
      </p>
    </StaticPage>
  );
}
