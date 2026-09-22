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
    <div className="mb-4 flex items-center justify-between border-b-2 border-primary/70 pb-2">
      <h2 className="text-lg font-bold text-text">{title}</h2>
      {href && (
        <Link href={href} className="text-[13px] font-medium text-primary hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
