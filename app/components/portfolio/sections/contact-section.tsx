import { ArrowUpRight, Mail } from "lucide-react";
import { mailtoHref, profile } from "../data";

const externalLinks = [profile.linkedin, profile.upwork, profile.onlineJobs];

export default function ContactSection() {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-inner">
        <h2 id="contact-title">Email {profile.nickname}</h2>
        <p>
          Have an app in mind, or a process that needs fixing? Send me a short
          note about what you&apos;re trying to do.
        </p>
        <a
          href={mailtoHref}
          rel="noopener noreferrer"
          className="button button-primary"
        >
          <Mail aria-hidden="true" /> Email me
        </a>
        <a
          href={mailtoHref}
          rel="noopener noreferrer"
          className="contact-address"
        >
          {profile.email}
        </a>
        <div className="contact-links">
          {externalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
              aria-label={`${link.label} (opens in a new tab)`}
            >
              {link.label} <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="contact-location">Based in the {profile.location}.</p>
      </div>
    </section>
  );
}
