import { NotificationsList } from "@/components/dashboard/notifications-list";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  await requireUser();
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl font-bold">Notifications</h1>
      <NotificationsList />
    </div>
  );
}
