import Link from "next/link";

export function SectionHeading({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2 className="font-display relative pl-3 text-xl font-bold tracking-tight text-text before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-primary before:to-accent">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1 text-[13px] font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
        >
          {linkLabel}
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </div>
  );
}
