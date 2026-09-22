import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[600px] flex-col items-center px-4 py-20 text-center">
      <span className="font-mono text-4xl font-bold text-primary">404</span>
      <h1 className="mt-3 text-2xl font-bold text-text">Page not found</h1>
      <p className="mt-2 text-[15px] text-text-muted">
        The page you are looking for may have been moved, or the link may be out of date.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-contrast hover:bg-primary-hover"
        >
          Go to homepage
        </Link>
        <Link
          href="/tutorials"
          className="rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-text hover:border-primary"
        >
          Browse tutorials
        </Link>
      </div>
    </div>
  );
}
