import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Noto_Sans_Devanagari, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { appUrl } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const devanagari = Noto_Sans_Devanagari({ subsets: ["devanagari"], weight: ["400", "600"], variable: "--font-devanagari", display: "swap", preload: false });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: {
    default: "CodeVerse — Learn, Practice, Compete & Get Hired",
    template: "%s · CodeVerse",
  },
  description:
    "CodeVerse is the all-in-one coding platform: in-depth tutorials, 6-language browser IDE, DSA problems, weekly contests, an AI tutor and progress tracking.",
  keywords: ["DSA", "coding practice", "programming tutorials", "competitive programming", "interview preparation", "online compiler"],
  applicationName: "CodeVerse",
  openGraph: {
    type: "website",
    siteName: "CodeVerse",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", creator: "@codeverse" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A14" },
    { media: "(prefers-color-scheme: light)", color: "#F7F7FB" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${devanagari.variable} dark`}>
      <body className="noise min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
          <CustomCursor />
        </Providers>
      </body>
    </html>
  );
}
