"use client";

// A small print action for articles, handy for students who print notes.
export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1.5 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
      aria-label="Print or save as PDF"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" />
      </svg>
      <span className="hidden sm:inline">Print</span>
    </button>
  );
}
