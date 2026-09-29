import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "motion", "@react-three/drei"],
  },
  // Old paid-plan URLs → home (everything is free now).
  async redirects() {
    const paid = ["/pricing", "/checkout/:path*", "/dashboard/billing", "/admin/monetization"].map((source) => ({ source, destination: source.startsWith("/admin") ? "/admin" : source.startsWith("/dashboard") ? "/dashboard" : "/", permanent: true }));
    // Old CodeVerse URLs after the rename to Kodshala.
    const renamed = [
      { source: "/contests/codeverse-:rest", destination: "/contests/kodshala-:rest", permanent: true },
      { source: "/blog/why-we-built-codeverse", destination: "/blog/why-we-built-kodshala", permanent: true },
      { source: "/blog/inside-the-codeverse-judge", destination: "/blog/inside-the-kodshala-judge", permanent: true },
      { source: "/tutorials/inside-the-codeverse-judge", destination: "/blog/inside-the-kodshala-judge", permanent: true },
    ];
    return [...paid, ...renamed];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
