import Link from "next/link";
import { Download, Mail } from "lucide-react";
import { ActionButton } from "@/components/admin/action-button";
import { PageHeader, StatusBadge, Table, tdCls, thCls, trCls } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { deleteMessage, setMessageStatus, unsubscribeEmail } from "@/lib/actions/admin/community";
import { db } from "@/lib/db";
import { cn, formatDate, timeAgo } from "@/lib/utils";

export const metadata = { title: "Inbox" };

type SP = Promise<{ tab?: string; status?: string }>;

export default async function AdminInbox({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const tab = sp.tab === "subscribers" ? "subscribers" : "messages";
  const status = sp.status === "ARCHIVED" || sp.status === "READ" ? sp.status : sp.status === "all" ? undefined : "NEW";
  const [counts, messages, subscribers, activeSubs] = await Promise.all([
    db.contactMessage.groupBy({ by: ["status"], _count: { _all: true } }),
    tab === "messages" ? db.contactMessage.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" }, take: 100 }) : Promise.resolve([]),
    tab === "subscribers" ? db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 500 }) : Promise.resolve([]),
    db.newsletterSubscriber.count({ where: { unsubscribedAt: null } }),
  ]);
  const count = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const tabCls = (active: boolean) => cn("rounded-xl px-3 py-1.5 text-sm", active ? "bg-brand text-white" : "text-muted-foreground hover:text-foreground");

  return (
    <>
      <PageHeader title="Inbox" description="Contact form messages and weekly digest subscribers." />
      <nav aria-label="Inbox sections" className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/admin/inbox" className={tabCls(tab === "messages")} aria-current={tab === "messages" ? "page" : undefined}>Messages {count("NEW") ? <span className="ml-1 rounded bg-danger px-1.5 text-[10px] text-white">{count("NEW")}</span> : null}</Link>
        <Link href="/admin/inbox?tab=subscribers" className={tabCls(tab === "subscribers")} aria-current={tab === "subscribers" ? "page" : undefined}>Subscribers ({activeSubs})</Link>
        {tab === "messages" ? (
          <span className="ml-auto flex gap-1 text-xs">
            {[["NEW", "New"], ["READ", "Read"], ["ARCHIVED", "Archived"], ["all", "All"]].map(([v, l]) => (
              <Link key={v} href={`/admin/inbox?status=${v}`} className={cn("rounded-lg px-2 py-1", (status ?? "all") === v ? "bg-accent text-foreground" : "text-muted-foreground")}>{l}{v !== "all" ? ` (${count(v)})` : ""}</Link>
            ))}
          </span>
        ) : (
          <Button asChild size="sm" variant="outline" className="ml-auto rounded-xl"><a href="/api/admin/subscribers/export"><Download /> Export CSV</a></Button>
        )}
      </nav>

      {tab === "messages" ? (
        messages.length ? (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id} className={cn("glass p-5", m.status === "NEW" && "border-brand/50")}>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{m.subject}</p>
                  <StatusBadge status={m.status === "NEW" ? "OPEN" : m.status} />
                  <span className="ml-auto text-xs text-muted-foreground" title={formatDate(m.createdAt, { dateStyle: "medium", timeStyle: "short" })}>{timeAgo(m.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{m.name} · {m.email}</p>
                <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="xs" className="rounded-lg"><a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}><Mail /> Reply</a></Button>
                  {m.status !== "READ" ? <ActionButton size="xs" variant="outline" action={setMessageStatus.bind(null, { id: m.id, status: "READ" })} success="Marked as read">Mark read</ActionButton> : null}
                  {m.status !== "ARCHIVED" ? <ActionButton size="xs" variant="outline" action={setMessageStatus.bind(null, { id: m.id, status: "ARCHIVED" })} success="Archived">Archive</ActionButton> : <ActionButton size="xs" variant="outline" action={setMessageStatus.bind(null, { id: m.id, status: "NEW" })} success="Moved to inbox">Move to inbox</ActionButton>}
                  <ActionButton size="xs" variant="ghost" className="text-danger" action={deleteMessage.bind(null, m.id)} confirm="Delete this message?" success="Deleted">Delete</ActionButton>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No messages here" description="Messages sent from the Contact page show up in this list." />
        )
      ) : (
        <Table caption="Subscribers">
          <thead><tr><th scope="col" className={`${thCls} px-4 py-3`}>Email</th><th scope="col" className={`${thCls} px-4 py-3`}>Subscribed</th><th scope="col" className={`${thCls} px-4 py-3`}>Status</th><th scope="col" className={`${thCls} px-4 py-3`}><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id} className={trCls}>
                <td className={tdCls}>{s.email}</td>
                <td className={`${tdCls} text-muted-foreground`}>{formatDate(s.createdAt)}</td>
                <td className={tdCls}><StatusBadge status={s.unsubscribedAt ? "ARCHIVED" : "ACTIVE"} /></td>
                <td className={`${tdCls} text-right`}>{!s.unsubscribedAt ? <ActionButton size="xs" variant="ghost" action={unsubscribeEmail.bind(null, s.id)} confirm={`Unsubscribe ${s.email}?`} success="Unsubscribed">Unsubscribe</ActionButton> : null}</td>
              </tr>
            ))}
            {!subscribers.length ? <tr><td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">No subscribers yet.</td></tr> : null}
          </tbody>
        </Table>
      )}
    </>
  );
}
