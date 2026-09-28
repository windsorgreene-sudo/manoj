import { PageHeader, StatusBadge } from "@/components/admin/ui";
import { AnnouncementForm } from "@/components/admin/announcement-form";
import { ActionButton } from "@/components/admin/action-button";
import { deleteAnnouncement } from "@/lib/actions/admin/platform";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Announcements" };

export default async function Announcements() {
  const list = await db.announcement.findMany({ orderBy: { createdAt: "desc" }, include: { author: { select: { name: true } } } });
  return (
    <>
      <PageHeader title="Announcements" description="Site-wide banner, in-app notifications and email." />
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <AnnouncementForm />
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.id} className="glass space-y-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{a.title}</p>
                <StatusBadge status={a.isActive ? "ACTIVE" : "ARCHIVED"} />
                {a.isBanner ? <span className="text-[10px] text-cyan">BANNER</span> : null}
                <span className="ml-auto text-xs text-muted-foreground">{a.author?.name} · {formatDate(a.createdAt)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{a.body}</p>
              <div className="flex gap-2">
                <AnnouncementForm initial={{ id: a.id, title: a.title, body: a.body, link: a.link ?? "", variant: a.variant as "info", isBanner: a.isBanner, isActive: a.isActive, endsAt: a.endsAt?.toISOString() ?? null }} compact />
                <ActionButton size="xs" variant="ghost" className="text-danger" action={deleteAnnouncement.bind(null, a.id)} confirm="Delete this announcement?" success="Deleted">Delete</ActionButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
