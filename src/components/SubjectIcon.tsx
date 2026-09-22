import { subjectTheme } from "@/lib/subjectTheme";

// A small colored tile showing the subject monogram. Gives each category a
// recognisable visual identity without relying on external icon libraries.
export function SubjectIcon({
  slug,
  size = "md",
}: {
  slug: string;
  size?: "sm" | "md" | "lg";
}) {
  const t = subjectTheme(slug);
  const dims =
    size === "lg"
      ? "h-12 w-12 text-sm"
      : size === "sm"
        ? "h-8 w-8 text-[11px]"
        : "h-10 w-10 text-xs";
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg font-bold ${dims}`}
      style={{ backgroundColor: t.color, color: "#fff" }}
      aria-hidden
    >
      {t.label}
    </span>
  );
}
