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
    <nav
      aria-label="Breadcrumb"
      className="flex flex-nowrap items-center gap-1 overflow-x-auto whitespace-nowrap text-[13px] sm:flex-wrap sm:whitespace-normal no-scrollbar"
    >
      {all.map((c, i) => {
        const last = i === all.length - 1;
        return (
          <span key={i} className="flex min-w-0 items-center gap-1">
            {c.href && !last ? (
              <Link href={c.href} className="shrink-0 text-text-muted hover:text-primary">
                {c.label}
              </Link>
            ) : (
              <span
                className={`max-w-[60vw] truncate sm:max-w-none ${last ? "text-text" : "text-text-muted"}`}
                aria-current={last ? "page" : undefined}
              >
                {c.label}
              </span>
            )}
            {!last && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-text-faint" />}
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
