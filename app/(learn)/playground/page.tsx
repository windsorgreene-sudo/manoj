import type { Metadata } from "next";
import { Playground } from "@/components/practice/playground";

export const metadata: Metadata = {
  title: "Online Compiler & Playground",
  description: "Run C, C++, Java, Python, JavaScript and Go online with custom input. Save and share snippets with a link.",
  alternates: { canonical: "/playground" },
};

export default function PlaygroundPage() {
  return <Playground />;
}
