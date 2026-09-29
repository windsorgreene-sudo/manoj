import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/dashboard", "/api/", "/checkout", "/doubts/ask", "/playground/"] }],
    sitemap: `${appUrl()}/sitemap.xml`,
    host: appUrl(),
  };
}
