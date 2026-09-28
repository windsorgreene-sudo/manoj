import { ArticleEditor } from "@/components/admin/article-editor";
import { loadArticleEditor } from "@/lib/queries/article-editor";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Edit article" };

export default async function AdminArticleEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser("ADMIN");
  const data = await loadArticleEditor(id === "new" ? null : id, user);
  return <ArticleEditor {...data} canPublish backHref="/admin/articles" />;
}
