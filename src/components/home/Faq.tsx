import { SectionHeading } from "@/components/SectionHeading";
import { ChevronDown } from "@/components/icons";

// Interactive FAQ using native <details>/<summary>. Accessible and keyboard
// friendly with zero JavaScript dependency; the chevron rotates via the
// [open] state using a group class.
interface QA {
  q: string;
  a: string;
}

const FAQS: QA[] = [
  {
    q: "Is CodeVidya really free?",
    a: "Yes. Every course, lesson, solved program and the code editor are free to use. No account is required to read the material.",
  },
  {
    q: "Which universities and courses does it cover?",
    a: "It is built around the GGSIPU (IP University) syllabus for BCA, B.Tech and MCA computer-science subjects, from C and Python to DBMS, OS, Networks and more.",
  },
  {
    q: "Can I read the lessons in Hindi?",
    a: "Yes. Use the EN / हिं toggle in the header to switch a lesson between English and Hinglish (Roman-script Hindi) at any time.",
  },
  {
    q: "Which languages can I run in the browser?",
    a: "Python and JavaScript run instantly in your browser, with no setup. C, C++ and Java can be read and edited here, then compiled locally.",
  },
  {
    q: "Does my progress get saved?",
    a: "Your completed lessons, XP and bookmarks are saved in your browser, so you can pick up where you left off on the same device.",
  },
];

export function Faq() {
  return (
    <section className="mb-10">
      <SectionHeading title="Frequently asked questions" />
      <div className="mx-auto max-w-3xl divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {FAQS.map((f) => (
          <details key={f.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-text transition-colors hover:text-primary">
              {f.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-text-faint transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-4 text-[13px] leading-relaxed text-text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
