import Image from "next/image";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Mail,
  PanelsTopLeft,
} from "lucide-react";
import { mailtoHref, profile } from "../data";

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="16"
      height="16"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="hero" id="top">
      <p className="hero-role">{profile.role}</p>

      <h1 className="hero-name">
        <span className="hero-name-line">{profile.firstName}</span>
        <span className="hero-name-line">
          {profile.lastName}
          <span className="hero-dot">.</span>
        </span>
      </h1>

      <div className="hero-orbit" aria-hidden="true" />

      <div className="hero-left-copy">
        <p>
          Hi, I&apos;m {profile.fullName}, an {profile.summary}
        </p>
        <div className="hero-links" aria-label={`${profile.firstName} ${profile.lastName} links`}>
          <a href={mailtoHref} aria-label={`Email ${profile.firstName} ${profile.lastName}`}>
            <Mail aria-hidden="true" />
          </a>
          <a
            href={profile.linkedin.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${profile.firstName} ${profile.lastName} on LinkedIn`}
          >
            <LinkedInIcon />
          </a>
          <a
            href={profile.onlineJobs.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`View ${profile.firstName} ${profile.lastName} on OnlineJobs.ph`}
          >
            <BriefcaseBusiness aria-hidden="true" />
          </a>
          <a href="#projects" aria-label="View selected work">
            <PanelsTopLeft aria-hidden="true" />
          </a>
        </div>
      </div>

      <figure className="hero-portrait">
        <Image
          src={profile.portrait}
          alt={`${profile.firstName} ${profile.lastName}, ${profile.role}`}
          fill
          preload
          className="hero-image"
          sizes="(max-width: 760px) 92vw, 58vw"
        />
      </figure>

      <div className="hero-right-copy">
        <p>
          I specialize in streamlining workflows, improving processes, and
          implementing efficient systems that help businesses operate more
          effectively. I&apos;m organized, reliable, and committed to delivering
          high-quality results that support business growth.
        </p>
        <a href={mailtoHref} className="button button-primary">
          Let&apos;s talk <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
