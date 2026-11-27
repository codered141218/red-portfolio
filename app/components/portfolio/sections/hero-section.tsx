import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { mailtoHref, profile } from "../data";

const externalLinks = [profile.linkedin, profile.upwork, profile.onlineJobs];

export default function HeroSection() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <span className="hero-ghost" aria-hidden="true">
        {profile.surname.toUpperCase()}
      </span>
      <div className="hero-orbit" aria-hidden="true" />

      <div className="hero-copy">
        <p className="eyebrow">Hi, I&apos;m {profile.nickname}.</p>
        <h1 id="hero-title" className="hero-title">
          {profile.fullName}
          <span className="hero-dot">.</span>
        </h1>
        <p className="hero-role">{profile.role}</p>
        <p className="hero-summary">{profile.summary}</p>

        <div className="hero-actions" data-hero-cta>
          <a
            href={mailtoHref}
            rel="noopener noreferrer"
            className="button button-primary"
          >
            <Mail aria-hidden="true" /> Email me
          </a>
          <a href="#apps" className="button button-secondary">
            See the apps
          </a>
        </div>

        <ul className="hero-links" aria-label="Profiles">
          {externalLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${link.label} (opens in a new tab)`}
              >
                {link.label}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <figure className="hero-portrait">
        <Image
          src={profile.portrait}
          alt={`Portrait of ${profile.fullName}, known as ${profile.nickname}`}
          fill
          preload
          className="hero-image"
          sizes="(max-width: 900px) 92vw, 40vw"
        />
      </figure>
    </section>
  );
}
