import { ogCard, OG_SIZE } from "@/lib/og";

export const alt = "Kodshala: Learn, Practice, Compete & Get Hired";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({ eyebrow: "The all-in-one coding platform", title: "Learn, practice, compete & get hired", subtitle: "Tutorials, a 6-language browser IDE, DSA problems, weekly contests and an AI tutor." });
}
