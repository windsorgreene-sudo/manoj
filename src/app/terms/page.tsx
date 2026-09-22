import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${SITE.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <StaticPage title="Terms of Use">
      <p>
        By using {SITE.name} you agree to the following terms. The content is provided for
        educational purposes.
      </p>
      <h2 id="use">Permitted use</h2>
      <p>
        You may read, reference and learn from the material for personal and academic use. Code
        samples may be used in your own projects and assignments.
      </p>
      <h2 id="content">Content accuracy</h2>
      <p>
        Content is provided in good faith and reviewed for accuracy, but is offered without warranty.
        Always verify critical information against official documentation and your course
        requirements.
      </p>
      <h2 id="ip">Intellectual property</h2>
      <p>
        The brand, layout and original written explanations belong to {SITE.name}. Please attribute
        the source if you reproduce substantial portions.
      </p>
    </StaticPage>
  );
}
