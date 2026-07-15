import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Reden | Operations & Systems Specialist",
  description:
    "Operations, systems, project management, technical support, and virtual assistance portfolio of John Reden.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
