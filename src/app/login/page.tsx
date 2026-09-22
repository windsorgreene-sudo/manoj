import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to CodeVidya to sync bookmarks across devices.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[440px] px-4 py-10">
      <Breadcrumbs items={[{ label: "Login" }]} />
      <div className="mt-6 rounded-md border border-border bg-surface p-6">
        <h1 className="text-xl font-bold text-text">Sign in to CodeVidya</h1>
        <p className="mt-1 text-sm text-text-muted">
          Login is optional. It is used to sync your bookmarks across devices. Reading all content
          never requires an account.
        </p>
        <form className="mt-5 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-text">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-contrast hover:bg-primary-hover"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-text-faint">
          Authentication backend is not enabled in this build.
        </p>
        <p className="mt-4 text-center text-sm text-text-muted">
          <Link href="/" className="text-primary hover:underline">
            Continue without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}
