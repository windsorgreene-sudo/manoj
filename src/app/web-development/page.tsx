import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Web Development",
  description: "Web development tutorials and resources on CodeVidya.",
  alternates: { canonical: "/web-development" },
};

export default function WebDevelopmentPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-6">
      <BreadcrumbSchema items={[{ label: "Web Development" }]} />
      <Breadcrumbs items={[{ label: "Web Development" }]} />
      <header className="mt-4 border-b border-border pb-5">
        <h1 className="text-[26px] font-bold text-text sm:text-[30px]">Web Development</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-text-muted">
          Web development tutorials are being prepared and will be published in this section.
          In the meantime, you can explore the programming and computer science material below.
        </p>
      </header>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/programming" className="rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-text hover:border-primary">
          Programming
        </Link>
        <Link href="/computer-science" className="rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-text hover:border-primary">
          Computer Science
        </Link>
        <Link href="/tutorials" className="rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-text hover:border-primary">
          All Tutorials
        </Link>
      </div>
    </div>
  );
}
