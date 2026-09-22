import type { ReactNode } from "react";
import { Breadcrumbs, BreadcrumbSchema } from "@/components/Breadcrumbs";

export function StaticPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-6">
      <BreadcrumbSchema items={[{ label: title }]} />
      <Breadcrumbs items={[{ label: title }]} />
      <header className="mt-4 border-b border-border pb-5">
        <h1 className="text-[26px] font-bold text-text sm:text-[30px]">{title}</h1>
        {intro && <p className="mt-2 text-[15px] text-text-muted">{intro}</p>}
      </header>
      <div className="prose mt-6">{children}</div>
    </div>
  );
}
