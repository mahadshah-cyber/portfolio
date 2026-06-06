import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
  Cinzel,
  Playfair_Display,
  Orbitron,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { SmoothScrollProvider } from "@/components/ui/SmoothScroll";
import { BackgroundTransition } from "@/components/ui/BackgroundTransition";
import { ScrollAnimations } from "@/components/ui/ScrollAnimations";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { JsonLd } from "@/components/seo/JsonLd";

import { SoundProvider } from "@/components/ui/SoundManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mahadshah.dev"),
  title: {
    default: "Syed Mahad Shah | Cybersecurity Enthusiast & Developer",
    template: "%s | Syed Mahad Shah",
  },
  description:
    "Personal portfolio of Syed Mahad Shah — aspiring Cybersecurity expert, full-stack developer, and CTF enthusiast from Pakistan. Explore projects, blog posts, and interactive terminal.",
  keywords: [
    "Syed Mahad Shah",
    "Mahad Shah",
    "Cybersecurity",
    "Portfolio",
    "Developer",
    "Pakistan",
    "Programming",
    "C",
    "Java",
    "Web Development",
    "CTF",
    "Full-Stack",
    "Next.js",
    "React",
  ],
  authors: [{ name: "Syed Mahad Shah", url: "https://mahadshah.dev" }],
  creator: "Syed Mahad Shah",
  publisher: "Syed Mahad Shah",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Syed Mahad Shah | Cybersecurity Enthusiast & Developer",
    description:
      "Aspiring cybersecurity expert and full-stack developer from Pakistan. Explore projects, writeups, and an interactive terminal.",
    type: "website",
    locale: "en_US",
    siteName: "Syed Mahad Shah Portfolio",
    url: "https://mahadshah.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Mahad Shah | Cybersecurity Enthusiast & Developer",
    description:
      "Aspiring cybersecurity expert and full-stack developer from Pakistan.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jetbrainsMono.variable} ${cinzel.variable} ${playfairDisplay.variable} ${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col bg-black text-zinc-200 selection:bg-red-500/30 selection:text-white">
        <SoundProvider>
          <LoadingScreen />
          <CustomCursor />
          {/* Grid overlay — visible after loading */}
          <div className="grid-overlay" id="grid-overlay" />
          {/* Noise texture */}
          <div className="noise-overlay" />
          <SmoothScrollProvider>
            <BackgroundTransition />
            <ScrollAnimations />
            <ScrollToTop />
            <Navbar />
            <main className="flex-1 relative z-10">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
