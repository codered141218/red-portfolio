import type { Metadata, Viewport } from "next";
import { profile } from "@/app/components/portfolio/data";
import { siteUrl } from "@/app/lib/site";
import "./globals.css";

const title = `${profile.firstName} ${profile.lastName} | ${profile.role}`;
const description = `${profile.summary} ${profile.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${profile.firstName} ${profile.lastName}`,
  },
  description,
  keywords: [
    "operations specialist",
    "systems specialist",
    "virtual assistant",
    "project management",
    "technical support",
    "WordPress",
    "GoHighLevel",
    "Power Automate",
    "SAP Business One",
    "Philippines",
  ],
  authors: [{ name: profile.fullName, url: siteUrl }],
  creator: profile.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: `${profile.firstName} ${profile.lastName}`,
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
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
