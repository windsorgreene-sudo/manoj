import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name}, exam-ready notes, tutorials and solved code for GGSIPU BCA, B.Tech and MCA students.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <StaticPage title={`About ${SITE.name}`}>
      <p>
        {SITE.name} is a free study platform for students of {SITE.university}. It brings together
        exam-ready notes, tutorials, solved programs and practice questions for the computer science
        subjects in the BCA, B.Tech (CSE / IT) and MCA programmes, alongside a live code editor so
        you can run examples as you learn.
      </p>
      <p>
        The goal is simple: help IPU students understand a topic quickly, revise from concise notes,
        practise with real code, and prepare confidently for internal and external examinations.
      </p>
      <h2 id="what-you-find">What you will find here</h2>
      <ul>
        <li>Full subject courses: C, Python, Data Structures, DBMS and SQL.</li>
        <li>Object-oriented programming with Java and C++.</li>
        <li>Operating Systems, Computer Networks and Software Engineering.</li>
        <li>Web Technology fundamentals (HTML, CSS, JavaScript).</li>
        <li>A live code playground, MCQ quizzes and progress tracking.</li>
      </ul>
      <h2 id="approach">Our approach</h2>
      <p>
        Every lesson is written to be practical and exam-focused, with clear explanations, real code
        and quick quizzes. Content is organised by subject so you can find exactly what you need for
        your semester.
      </p>
    </StaticPage>
  );
}
