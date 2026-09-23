import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name}, a reference portal of programming and computer science study material.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <StaticPage title={`About ${SITE.name}`}>
      <p>
        {SITE.name} is a study portal for students of {SITE.university}. It brings together
        tutorials, notes, assignments, lab programs and examination material for the computer
        subjects in the BCA, B.Tech (CSE / IT) and MCA programmes. The content is compiled from
        teaching material and coursework maintained over several years and is organised into clear
        subject categories for easy reference.
      </p>
      <p>
        The goal is simple: help IPU students understand concepts quickly, revise from concise
        notes, practise with solved programs, and prepare confidently for internal and external
        examinations.
      </p>
      <h2 id="what-you-find">What you will find here</h2>
      <ul>
        <li>Step-by-step tutorials for Python, Java, C++, C# and SQL.</li>
        <li>Data structures, algorithms and core computer science topics.</li>
        <li>Software engineering, OOSE and OOPJ course material.</li>
        <li>Cyber security and cyber law notes.</li>
        <li>Assignments, lab programs, MCQs, question papers and syllabus.</li>
      </ul>
      <h2 id="editorial">Editorial note</h2>
      <p>
        Material is written and reviewed with a focus on accuracy and clarity for students. Articles
        are updated periodically as syllabi and best practices change.
      </p>
    </StaticPage>
  );
}
