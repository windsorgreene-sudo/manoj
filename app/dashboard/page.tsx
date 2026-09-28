import { getCurrentUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  return (
    <div className="container-cv py-16">
      <h1 className="font-heading text-3xl font-bold">Hi, {user?.name}</h1>
    </div>
  );
}
