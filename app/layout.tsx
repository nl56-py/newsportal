import type { Metadata, Viewport } from "next";
import { Mukta, Martel, Inter } from "next/font/google";
import "./globals.css";
import "./sawal-home.css";
import { getHomepageContent } from "@/lib/homepage";
import { Header } from "@/components/header/Header";
import { Footer } from "@/components/footer/Footer";
import { BottomAnchorAd } from "@/components/ads/BottomAnchorAd";

export const dynamic = 'force-dynamic';

/* ── Sawal Nepal Font Stack ──────────────────────────────────
 * Primary:   Mukta      — Devanagari headings, nav, body (300–700)
 * Secondary: Martel     — Devanagari serif option (200–900)
 * Tertiary:  Inter      — English UI, numbers, meta
 * ──────────────────────────────────────────────────────────── */

const mukta = Mukta({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-mukta",
  display: "swap",
});

const martel = Martel({
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  subsets: ["devanagari", "latin"],
  variable: "--font-martel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.sawalnepal.com"),
  title: {
    default: "Sawal Nepal - News and Entertainment (सवाल नेपाल)",
    template: "%s - Sawal Nepal",
  },
  description:
    "सवाल नेपाल (Sawal Nepal) - News and Entertainment. ताजा, सत्य र निष्पक्ष नेपाली समाचार, राजनीति, विचार, अर्थ, खेलकुद, मनोरञ्जन, प्रदेश र विश्वका ताजा अपडेटहरू।",
  keywords: [
    "Sawal Nepal",
    "सवाल नेपाल",
    "Nepali News",
    "News and Entertainment",
    "दमक समाचार",
    "झापा समाचार",
    "ताजा अपडेट",
    "Bikram Sambat",
    "Nepali Unicode",
  ],
  authors: [{ name: "सवाल नेपाल सम्पादकीय टिम" }],
  creator: "Nexaform",
  publisher: "Sawal Nepal",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ne_NP",
    url: "https://www.sawalnepal.com",
    title: "Sawal Nepal - News and Entertainment (सवाल नेपाल)",
    description: "ताजा, सत्य र निष्पक्ष नेपाली समाचार, विचार, र मनोरञ्जन चौबीसै घण्टा।",
    siteName: "Sawal Nepal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sawal Nepal - News and Entertainment",
    description: "ताजा, सत्य र निष्पक्ष नेपाली समाचार, विचार, र मनोरञ्जन चौबीसै घण्टा।",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const homepage = getHomepageContent();
  return (
    <html
      lang="ne"
      className={`${mukta.variable} ${martel.variable} ${inter.variable} antialiased`}
    >
      <body className="flex flex-col min-h-screen font-mukta bg-[#f4f6f8] text-slate-900 selection:bg-sawal-red selection:text-white">
        {/* Master Header */}
        <Header recent={homepage.recent} popular={homepage.sections['धेरै पढिएको']} breaking={homepage.breaking} ad={homepage.ads.Header_Masthead} />

        {/* Main Content Area */}
        <main className="flex-1 w-full">{children}</main>

        {/* Master Footer */}
        <Footer />

        {/* Fixed Bottom Anchor Sticky Ad */}
        <BottomAnchorAd slot={homepage.ads.Bottom_Sticky_Anchor} />
      </body>
    </html>
  );
}
