import { articles } from "./articles";

// Maps old Blogger URL paths to new clean URLs so that inbound links and
// search-engine results for the original blog continue to resolve after the
// domain is pointed here. Blogger permalinks look like /YYYY/MM/slug.html.
export function getLegacyRedirects(): { source: string; destination: string; permanent: boolean }[] {
  const seen = new Set<string>();
  const redirects: { source: string; destination: string; permanent: boolean }[] = [];
  for (const a of articles) {
    if (!a.legacyUrl) continue;
    try {
      const path = new URL(a.legacyUrl).pathname; // e.g. /2020/05/map-in-python.html
      if (seen.has(path)) continue;
      seen.add(path);
      redirects.push({
        source: path,
        destination: `/${a.category}/${a.slug}`,
        permanent: true,
      });
    } catch {
      // ignore malformed legacy URLs
    }
  }
  return redirects;
}
