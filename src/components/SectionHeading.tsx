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
    <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
      <h2 className="relative pl-3 text-lg font-bold text-text before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-gradient-to-b before:from-primary before:to-accent">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-[13px] font-medium text-primary"
        >
          <span className="link-underline">{linkLabel}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>
      )}
    </div>
  );
}
