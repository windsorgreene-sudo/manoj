import { SettingsForms } from "@/components/dashboard/settings-forms";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireUser();
  const [profile, account] = await Promise.all([
    db.profile.findUnique({ where: { userId: user.id } }),
    db.account.findFirst({ where: { userId: user.id, providerId: "credential" }, select: { id: true } }),
  ]);
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-heading text-3xl font-bold">Settings</h1>
      <SettingsForms
        user={{ name: user.name, email: user.email, image: user.image, username: user.username ?? "" }}
        hasPassword={Boolean(account)}
        profile={{
          bio: profile?.bio ?? "",
          college: profile?.college ?? "",
          location: profile?.location ?? "",
          website: profile?.website ?? "",
          github: profile?.github ?? "",
          linkedin: profile?.linkedin ?? "",
          theme: (profile?.theme as "dark" | "light") ?? "dark",
          locale: (profile?.locale as "en" | "hi" | "hinglish") ?? "en",
          preferredLang: profile?.preferredLang ?? "PYTHON",
          emailNotifications: profile?.emailNotifications ?? true,
          pushNotifications: profile?.pushNotifications ?? true,
          weeklyDigest: profile?.weeklyDigest ?? true,
        }}
      />
    </div>
  );
}
