import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <defs>
        <linearGradient id="cv-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="0.5" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d="M16 2 28 9v14l-12 7L4 23V9z" fill="url(#cv-logo)" opacity="0.18" />
      <path d="M16 2 28 9v14l-12 7L4 23V9z" fill="none" stroke="url(#cv-logo)" strokeWidth="1.6" />
      <path d="m13 11-5 5 5 5M19 11l5 5-5 5" fill="none" stroke="url(#cv-logo)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-heading text-lg font-bold tracking-tight", className)} aria-label="CodeVerse home">
      <LogoMark />
      <span>
        <span className="text-gradient">Code</span>Verse
      </span>
    </Link>
  );
}
