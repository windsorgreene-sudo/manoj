import type { Metadata } from "next";
import { GroupPage } from "@/components/GroupPage";

export const metadata: Metadata = {
  title: "Programming",
  description:
    "Programming language tutorials — Python, Core Java, C++, C# and object-oriented programming with lab work and assignments.",
  alternates: { canonical: "/programming" },
};

export default function ProgrammingPage() {
  return (
    <GroupPage
      group="programming"
      title="Programming"
      description="Tutorials and practice material for programming languages including Python, Java, C++ and C#."
    />
  );
}
