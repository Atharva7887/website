import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://indiskaai.com"),
  title: {
    default: "IndiskaAI - AI-Accelerated Antibody Discovery",
    template: "%s - IndiskaAI",
  },
  description:
    "IndiskaAI builds antibody libraries and AI-driven discovery platforms, helping biopharma and biotechnology partners identify promising antibody candidates with greater speed and precision.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "IndiskaAI",
    description:
      "Antibody libraries, discovery, and engineering, powered by AI-driven data analysis and modern sequencing technology.",
    type: "website",
    siteName: "IndiskaAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "IndiskaAI",
    description:
      "AI-accelerated antibody discovery and engineering.",
  },
};

import Preloader from "@/components/Preloader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        <Preloader />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
