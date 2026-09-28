import { ArticleEditor } from "@/components/admin/article-editor";
import { loadArticleEditor } from "@/lib/queries/article-editor";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Write article" };

export default async function ContributorArticleEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser("CONTRIBUTOR", "/dashboard/articles");
  const data = await loadArticleEditor(id === "new" ? null : id, user);
  return <ArticleEditor {...data} canPublish={user.role === "ADMIN"} backHref="/dashboard/articles" />;
}
