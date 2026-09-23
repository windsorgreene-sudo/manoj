import type { Metadata } from "next";
import { GroupPage } from "@/components/GroupPage";

export const metadata: Metadata = {
  title: "Tutorials",
  description:
    "Browse all tutorial categories on CodeVidya, programming languages, computer science, databases, software engineering and cyber security.",
  alternates: { canonical: "/tutorials" },
};

export default function TutorialsPage() {
  return (
    <GroupPage
      group={[
        "programming",
        "computer-science",
        "cyber-security",
        "software-engineering",
      ]}
      title="Tutorials"
      description="All subject categories in one place. Pick a topic to browse its tutorials, notes, assignments and lab programs."
    />
  );
}
