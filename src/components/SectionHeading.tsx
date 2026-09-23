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
    <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-border pb-2">
      <h2 className="font-display text-xl font-bold tracking-tight text-text">{title}</h2>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-[13px] font-medium text-primary hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
