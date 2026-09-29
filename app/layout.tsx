import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { NavigationProgress } from "@/components/motion/navigation-progress";
import { Suspense } from "react";
import { appUrl } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: {
    default: "Kodshala: Learn, Practice, Compete & Get Hired",
    template: "%s · Kodshala",
  },
  description:
    "Kodshala is the all-in-one coding platform: in-depth tutorials, 6-language browser IDE, DSA problems, weekly contests, an AI tutor and progress tracking.",
  keywords: ["DSA", "coding practice", "programming tutorials", "competitive programming", "interview preparation", "online compiler"],
  applicationName: "Kodshala",
  openGraph: {
    type: "website",
    siteName: "Kodshala",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", creator: "@kodshala" },
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} dark`}>
      <head>
        {/* Set the content language before first paint so Hinglish readers never see an English flash. */}
        <script dangerouslySetInnerHTML={{ __html: `try{var m=document.cookie.match(/(?:^|; )NEXT_LOCALE=(hinglish|hi)(?:;|$)/);if(m)document.documentElement.lang="hi-Latn"}catch(e){}` }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Providers>
          <SmoothScroll>{children}</SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
