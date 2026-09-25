import Link from "next/link";
import { SITE } from "@/lib/site";
import { LogoMark } from "./Logo";

const columns = [
  {
    title: "Courses",
    links: [
      { label: "C Programming", href: "/courses/c-programming" },
      { label: "Python", href: "/courses/python-programming" },
      { label: "Data Structures", href: "/courses/data-structures" },
      { label: "DBMS & SQL", href: "/courses/dbms-sql" },
      { label: "All courses", href: "/courses" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "OOP with Java", href: "/courses/oop-java" },
      { label: "Operating Systems", href: "/courses/operating-systems" },
      { label: "Computer Networks", href: "/courses/computer-networks" },
      { label: "Web Technology", href: "/courses/web-technology" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Code Playground", href: "/playground" },
      { label: "My Dashboard", href: "/student" },
      { label: "Teacher Portal", href: "/admin" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface-2">
      <div className="mx-auto max-w-[1240px] px-4 py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <LogoMark className="h-8 w-8 rounded-lg" />
              <span className="font-display text-lg font-bold text-text">
                Code<span className="text-primary">Vidya</span>
              </span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-text-muted">{SITE.tagline}</p>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-text-muted">
              Exam-ready notes, solved programs and a live code editor for GGSIPU BCA, B.Tech and
              MCA students, in English and Hinglish.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold text-text">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-block text-[13px] text-text-muted transition-all duration-200 hover:translate-x-0.5 hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-[13px] text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>Built for IPU students 🇮🇳 · Free forever.</p>
        </div>
      </div>
    </footer>
  );
}
