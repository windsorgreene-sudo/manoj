import Link from "next/link";
import { ChevronRight } from "./icons";
import { SITE } from "@/lib/site";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[13px]">
      {all.map((c, i) => {
        const last = i === all.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {c.href && !last ? (
              <Link href={c.href} className="text-text-muted hover:text-primary">
                {c.label}
              </Link>
            ) : (
              <span className={last ? "text-text" : "text-text-muted"} aria-current={last ? "page" : undefined}>
                {c.label}
              </span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5 text-text-faint" />}
          </span>
        );
      })}
    </nav>
  );
}

// JSON-LD BreadcrumbList for SEO.
export function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE.url}${c.href === "/" ? "" : c.href}` } : {}),
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
