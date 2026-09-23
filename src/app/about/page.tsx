import type { Metadata } from "next";
import { StaticPage } from "@/components/StaticPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name}, an animated learning platform with tutorials, a live code editor and expert-crafted courses.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <StaticPage title={`About ${SITE.name}`}>
      <p>
        {SITE.name} is a modern learning platform for developers at every level. It brings together
        animated tutorials, a live code editor and structured courses so you can learn a concept,
        practise it immediately, and test yourself, all in one place.
      </p>
      <p>
        Our goal is simple: make learning to code clear, hands-on and enjoyable. Read a lesson, run
        the example in the playground, take a quick quiz, and track your progress as you go.
      </p>
      <h2 id="what-you-find">What you will find here</h2>
      <ul>
        <li>Structured courses for HTML, CSS, JavaScript, Python, React and more.</li>
        <li>Data structures, algorithms and core computer science topics.</li>
        <li>SQL, databases, Git, Node.js and system design.</li>
        <li>A live code playground to run and experiment with code.</li>
        <li>Quizzes, progress tracking, XP and achievement badges.</li>
      </ul>
      <h2 id="approach">Our approach</h2>
      <p>
        Every lesson is written to be practical and easy to follow, with real code examples and
        clear explanations. Content is reviewed for accuracy and updated as technologies evolve.
      </p>
    </StaticPage>
  );
}
