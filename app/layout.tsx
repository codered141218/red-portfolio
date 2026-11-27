import type { Metadata, Viewport } from "next";
import { metaDescription, metaTitle, profile } from "@/app/components/portfolio/data";
import { siteUrl } from "@/app/lib/site";
import "./globals.css";

const title = metaTitle;
const description = metaDescription;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${profile.fullName}`,
  },
  description,
  keywords: [
    "app builder",
    "AI coding agents",
    "Claude Code",
    "PHP developer",
    "business systems",
    "ERP implementation",
    "project management",
    "Philippines",
  ],
  authors: [{ name: profile.fullName, url: siteUrl }],
  creator: profile.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: profile.fullName,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
