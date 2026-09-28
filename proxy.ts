import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/auth";

/**
 * Route protection (first line of defence). Every page, server action and API route
 * ALSO re-checks the session and role on the server.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const toLogin = () => {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  };

  if (pathname.startsWith("/dashboard") && !sessionCookie) return toLogin();

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!sessionCookie) {
      return pathname.startsWith("/api/") ? NextResponse.json({ error: "Unauthorized" }, { status: 401 }) : toLogin();
    }
    const session = await auth.api.getSession({ headers: request.headers }).catch(() => null);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session) return pathname.startsWith("/api/") ? NextResponse.json({ error: "Unauthorized" }, { status: 401 }) : toLogin();
    if (role !== "ADMIN") {
      return pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
        : NextResponse.redirect(new URL("/?denied=1", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/admin/:path*"],
};
