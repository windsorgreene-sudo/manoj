import type { NextConfig } from "next";
import { getLegacyRedirects } from "./src/content/redirects";

const nextConfig: NextConfig = {
  // Performance: modern image formats and responsive sizes for lazy-loaded
  // images used in articles.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // 301-redirect old Blogger permalinks to the new clean URLs.
    return getLegacyRedirects();
  },
};

export default nextConfig;
