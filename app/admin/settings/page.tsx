import { PageHeader } from "@/components/admin/ui";
import { SettingsPanel } from "@/components/admin/settings-panel";
import { db } from "@/lib/db";
import { integrationStatus } from "@/lib/env";

export const metadata = { title: "Settings" };

export default async function AdminSettings() {
  const flags = await db.featureFlag.findMany({ orderBy: { key: "asc" } });
  const branding = (flags.find((f) => f.key === "branding")?.value as { siteName: string; tagline: string; supportEmail: string } | null) ?? { siteName: "Kodshala", tagline: "", supportEmail: "support@kodshala.com" };
  return (
    <>
      <PageHeader title="Settings" description="Branding, feature flags, maintenance mode and integrations." />
      <SettingsPanel branding={branding} flags={flags.filter((f) => f.key !== "branding").map((f) => ({ key: f.key, enabled: f.enabled, description: f.description }))} integrations={integrationStatus()} />
    </>
  );
}
