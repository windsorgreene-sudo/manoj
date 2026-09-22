import Link from "next/link";
import type { Article } from "@/content/types";
import { getCategory } from "@/content";
import { formatDate } from "@/lib/site";
import { TypeBadge, DifficultyLabel } from "./Badge";
import { SubjectIcon } from "./SubjectIcon";
import { ClockIcon } from "./icons";

// Article listing row with a subject icon for quick scanning. Whole row is a
// gentle hover target so it clearly reads as clickable.
export function ArticleListItem({
  article,
  showCategory = true,
}: {
  article: Article;
  showCategory?: boolean;
}) {
  const cat = getCategory(article.category);
  const href = `/${article.category}/${article.slug}`;
  return (
    <article className="border-b border-border last:border-b-0">
      <div className="group relative -mx-2 flex gap-3 rounded-lg px-2 py-4 transition-colors hover:bg-surface-2">
        <div className="pt-0.5">
          <SubjectIcon slug={article.category} size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <TypeBadge type={article.contentType} />
            {showCategory && cat && (
              <span className="text-xs font-medium text-primary">{cat.name}</span>
            )}
          </div>
          <h3 className="text-[17px] font-semibold leading-snug">
            <Link href={href} className="text-text group-hover:text-primary">
              <span className="absolute inset-0" aria-hidden />
              {article.title}
            </Link>
          </h3>
          <p className="clamp-2 mt-1 text-sm text-text-muted">{article.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-faint">
            <span>Updated {formatDate(article.updatedDate)}</span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {article.readingMinutes} min read
            </span>
            {article.difficulty && <DifficultyLabel level={article.difficulty} />}
          </div>
        </div>
      </div>
    </article>
  );
}

// Compact link used inside sidebars.
export function CompactArticleLink({ article }: { article: Article }) {
  return (
    <li>
      <Link
        href={`/${article.category}/${article.slug}`}
        className="block text-[13px] leading-snug text-text-muted hover:text-primary"
      >
        {article.title}
      </Link>
    </li>
  );
}
