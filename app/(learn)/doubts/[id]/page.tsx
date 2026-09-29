import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Eye } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { AcceptButton, AnswerForm, ReportButton } from "@/components/doubts/doubt-forms";
import { UserText } from "@/components/doubts/user-text";
import { VoteControl } from "@/components/doubts/vote-control";
import { JsonLd, breadcrumbLd } from "@/components/seo/json-ld";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { appUrl, cn, timeAgo } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };
const safeId = (s: string) => s.replace(/[^a-z0-9]/gi, "").slice(0, 40);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await db.doubt.findUnique({ where: { id: safeId((await params).id) }, select: { title: true, body: true, hidden: true, id: true } });
  if (!d || d.hidden) return { title: "Doubt not found" };
  return { title: d.title, description: d.body.slice(0, 160), alternates: { canonical: `/doubts/${d.id}` } };
}

function Author({ user, when }: { user: { name: string; username: string | null; image: string | null }; when: Date }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Avatar className="size-6">
        {user.image ? <AvatarImage src={user.image} alt="" /> : null}
        <AvatarFallback className="bg-brand/20 text-[10px]">{user.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}</AvatarFallback>
      </Avatar>
      {user.username ? <Link href={`/u/${user.username}`} className="font-medium text-foreground hover:text-cyan">{user.name}</Link> : <span className="font-medium text-foreground">{user.name}</span>}
      <span>· {timeAgo(when)}</span>
    </div>
  );
}

export default async function DoubtPage({ params }: Props) {
  const id = safeId((await params).id);
  const [user, doubt] = await Promise.all([
    getCurrentUser(),
    db.doubt.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
        tags: { select: { slug: true, name: true } },
        answers: { where: { hidden: false }, orderBy: [{ score: "desc" }, { createdAt: "asc" }], include: { user: { select: { id: true, name: true, username: true, image: true } } } },
      },
    }),
  ]);
  if (!doubt || (doubt.hidden && user?.role !== "ADMIN")) notFound();
  await db.doubt.update({ where: { id: doubt.id }, data: { views: { increment: 1 } } }).catch(() => undefined);

  const ids = [doubt.id, ...doubt.answers.map((a) => a.id)];
  const votes = user ? await db.vote.findMany({ where: { userId: user.id, targetId: { in: ids }, targetType: { in: ["DOUBT", "ANSWER"] } }, select: { targetId: true, value: true } }) : [];
  const myVote = new Map(votes.map((v) => [v.targetId, v.value]));
  const isAsker = user?.id === doubt.userId || user?.role === "ADMIN";
  const answers = [...doubt.answers].sort((a, b) => Number(b.id === doubt.acceptedAnswerId) - Number(a.id === doubt.acceptedAnswerId));
  const accepted = answers.find((a) => a.id === doubt.acceptedAnswerId);
  const url = `${appUrl()}/doubts/${doubt.id}`;

  return (
    <div className="container-cv max-w-4xl py-10 md:py-14">
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", url: appUrl() }, { name: "Doubts", url: `${appUrl()}/doubts` }, { name: doubt.title, url }]),
          {
            "@context": "https://schema.org",
            "@type": "QAPage",
            mainEntity: {
              "@type": "Question",
              name: doubt.title,
              text: doubt.body,
              answerCount: answers.length,
              upvoteCount: doubt.score,
              dateCreated: doubt.createdAt.toISOString(),
              author: { "@type": "Person", name: doubt.user.name },
              ...(accepted ? { acceptedAnswer: { "@type": "Answer", text: accepted.body, upvoteCount: accepted.score, dateCreated: accepted.createdAt.toISOString(), url: `${url}#answer-${accepted.id}`, author: { "@type": "Person", name: accepted.user.name } } } : {}),
              suggestedAnswer: answers.filter((a) => a.id !== doubt.acceptedAnswerId).slice(0, 5).map((a) => ({ "@type": "Answer", text: a.body, upvoteCount: a.score, dateCreated: a.createdAt.toISOString(), url: `${url}#answer-${a.id}`, author: { "@type": "Person", name: a.user.name } })),
            },
          },
        ]}
      />
      <Link href="/doubts" className="inline-flex items-center gap-1 py-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Doubts forum</Link>

      <article className="mt-4 flex gap-4" aria-labelledby="doubt-title">
        <VoteControl target="DOUBT" id={doubt.id} score={doubt.score} myVote={myVote.get(doubt.id) ?? 0} signedIn={Boolean(user)} />
        <div className="min-w-0 flex-1">
          <h1 id="doubt-title" className="font-heading text-2xl font-bold md:text-3xl">{doubt.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Author user={doubt.user} when={doubt.createdAt} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="size-3.5" /> {doubt.views + 1} views</span>
          </div>
          <UserText text={doubt.body} className="mt-5 space-y-2 text-[15px]" />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {doubt.tags.map((t) => <Link key={t.slug} href={`/doubts?tag=${t.slug}`} className="rounded-md bg-brand/15 px-2 py-0.5 text-xs text-brand hover:bg-brand/25">{t.name}</Link>)}
            <span className="ml-auto"><ReportButton target="DOUBT" id={doubt.id} signedIn={Boolean(user) && !isAsker} /></span>
          </div>
        </div>
      </article>

      <section aria-labelledby="answers-h" className="mt-12">
        <h2 id="answers-h" className="font-heading text-xl font-semibold">{answers.length} answer{answers.length === 1 ? "" : "s"}</h2>
        {answers.length ? (
          <ul className="mt-4 space-y-4">
            {answers.map((a) => {
              const isAccepted = a.id === doubt.acceptedAnswerId;
              return (
                <li key={a.id} id={`answer-${a.id}`} className={cn("glass flex scroll-mt-24 gap-4 p-5", isAccepted && "border-success/60 ring-1 ring-success/40")}>
                  <VoteControl target="ANSWER" id={a.id} score={a.score} myVote={myVote.get(a.id) ?? 0} signedIn={Boolean(user)} />
                  <div className="min-w-0 flex-1">
                    {isAccepted ? <p className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-success"><CheckCircle2 className="size-4" /> Accepted answer</p> : null}
                    <UserText text={a.body} className="space-y-2 text-[15px]" />
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Author user={a.user} when={a.createdAt} />
                      <span className="ml-auto flex items-center gap-3">
                        <ReportButton target="ANSWER" id={a.id} signedIn={Boolean(user) && user?.id !== a.userId} />
                        {isAsker ? <AcceptButton doubtId={doubt.id} answerId={a.id} accepted={isAccepted} /> : null}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="glass mt-4 p-6 text-center text-sm text-muted-foreground">No answers yet, be the first to help!</p>
        )}
      </section>

      <section className="mt-10" aria-label="Write an answer">
        <AnswerForm doubtId={doubt.id} signedIn={Boolean(user)} />
      </section>
    </div>
  );
}
