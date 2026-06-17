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
  title: "Shubh Saxena · Independent developer",
  description:
    "I turn ambitious ideas into real-world products. Design, build, ship — websites and products that earn their keep.",
  openGraph: {
    title: "Shubh Saxena · Independent developer",
    description:
      "I turn ambitious ideas into real-world products. Design, build, ship.",
    url: SITE_URL,
    siteName: "Shubh Saxena",
    images: [{ url: "/og.png", width: 1200, height: 630 }], // TODO: add public/og.png (1200×630)
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubh Saxena · Independent developer",
    description: "I turn ambitious ideas into real-world products.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
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
