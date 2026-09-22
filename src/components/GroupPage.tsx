import Link from "next/link";
import { categories, articles } from "@/content";
import type { NavGroup } from "@/content/types";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";
import { ArticleListItem } from "@/components/ArticleListItem";
import { SectionHeading } from "@/components/SectionHeading";

export function GroupPage({
  group,
  title,
  description,
}: {
  group: NavGroup | NavGroup[];
  title: string;
  description: string;
}) {
  const groups = Array.isArray(group) ? group : [group];
  const cats = categories
    .filter((c) => groups.includes(c.group))
    .sort((a, b) => a.order - b.order);
  const catSlugs = new Set(cats.map((c) => c.slug));
  const recent = articles
    .filter((a) => catSlugs.has(a.category))
    .sort((a, b) => +new Date(b.updatedDate) - +new Date(a.updatedDate))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-6">
      <BreadcrumbSchema items={[{ label: title }]} />
      <Breadcrumbs items={[{ label: title }]} />
      <header className="mt-4 border-b border-border pb-5">
        <h1 className="text-[26px] font-bold text-text sm:text-[30px]">{title}</h1>
        <p className="mt-2 max-w-3xl text-[15px] text-text-muted">{description}</p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <SectionHeading title="Categories" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cats.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-md border border-border p-4 transition-colors hover:border-primary"
              >
                <span className="font-semibold text-text">{c.name}</span>
                <p className="clamp-2 mt-1 text-[13px] text-text-muted">{c.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <aside>
          <SectionHeading title="Recently Updated" />
          <div>
            {recent.map((a) => (
              <ArticleListItem key={a.slug} article={a} />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
