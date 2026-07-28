import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { basics } from "@/lib/resume";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const display = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s — ${basics.name}`,
  },
  description: site.description,
  applicationName: site.title,
  authors: [{ name: basics.name, url: siteUrl }],
  creator: basics.name,
  keywords: [
    basics.name,
    "software developer",
    "machine learning",
    "portfolio",
    "Vancouver",
    "University of British Columbia",
    "Cognitive Systems",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: site.title,
    title: site.title,
    description: site.description,
    url: siteUrl,
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#131313",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${GeistSans.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-surface text-ink">
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:bg-primary focus:px-4 focus:py-3 focus:text-on-primary"
        >
          Skip to content
        </a>
        <SiteHeader name={basics.name} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
