import { ImageIcon, Mail } from "lucide-react";
import { mailtoHref } from "../data";

export default function ProjectsSection() {
  return (
    <section
      className="section projects"
      id="projects"
      aria-labelledby="projects-title"
    >
      <h2 id="projects-title" className="section-title section-title-left">
        Projects
      </h2>
      <p className="section-intro">
        Screenshots of apps and systems I&apos;ve built.
      </p>
      <div className="empty-card">
        <ImageIcon aria-hidden="true" />
        <h3>Projects are on the way.</h3>
        <p>
          I&apos;m adding finished apps and systems here soon. In the meantime,
          see the featured apps above.
        </p>
        <a
          href={mailtoHref}
          rel="noopener noreferrer"
          className="button button-secondary"
        >
          <Mail aria-hidden="true" /> Email me
        </a>
      </div>
    </section>
  );
}
