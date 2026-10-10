import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/app/components/portfolio/data";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="not-found" id="main-content">
      <p className="not-found-kicker">404</p>
      <h1>
        This page doesn&apos;t exist<span className="hero-dot">.</span>
      </h1>
      <p>
        The link may be outdated or mistyped. Head back to the portfolio to
        see {profile.firstName}&apos;s work, services, and contact details.
      </p>
      <Link href="/" className="button button-primary">
        Back to the portfolio <ArrowUpRight aria-hidden="true" />
      </Link>
    </main>
  );
}
