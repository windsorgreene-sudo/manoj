import Link from "next/link";
import { categories, articles } from "@/content";
import type { NavGroup } from "@/content/types";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";
import { ArticleListItem } from "@/components/ArticleListItem";
import { SectionHeading } from "@/components/SectionHeading";
import { SubjectIcon } from "@/components/SubjectIcon";
import { Reveal } from "@/components/Reveal";

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
      <header className="animate-fade-up mt-4 border-b border-border pb-5">
        <h1 className="font-display text-[26px] font-bold text-text sm:text-[32px]">{title}</h1>
        <p className="mt-2 max-w-3xl text-[15px] text-text-muted">{description}</p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <SectionHeading title="Categories" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {cats.map((c, i) => (
              <Reveal key={c.slug} delay={i * 50}>
                <Link
                  href={`/${c.slug}`}
                  className="sheen hover-lift group flex h-full items-start gap-3 rounded-xl border border-border bg-surface p-4 hover:border-primary/50"
                >
                  <span className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <SubjectIcon slug={c.slug} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-text transition-colors group-hover:text-primary">
                      {c.name}
                    </span>
                    <span className="clamp-2 mt-1 block text-[13px] text-text-muted">
                      {c.description}
                    </span>
                  </span>
                </Link>
              </Reveal>
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
