import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = "https://shubhbuilds.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Shubh Saxena · AI-directed web developer",
  description:
    "Operator who directs AI to ship real products. 17, self-taught, three shipped builds and counting.",
  openGraph: {
    title: "Shubh Saxena · AI-directed web developer",
    description:
      "Operator who directs AI to ship real products. Three shipped builds and counting.",
    url: SITE_URL,
    siteName: "shubh.build",
    images: [{ url: "/og.png", width: 1200, height: 630 }], // TODO: add public/og.png (1200×630)
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubh Saxena · AI-directed web developer",
    description: "Operator who directs AI to ship real products.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0D10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Loader />
        <Cursor />
        {children}
      </body>
    </html>
  );
}
