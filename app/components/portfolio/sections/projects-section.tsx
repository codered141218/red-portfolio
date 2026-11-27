import { ImageIcon, Mail } from "lucide-react";
import type { PublicResult } from "@/app/lib/admin/storage";
import { mailtoHref } from "../data";
import ProjectGallery from "../project-gallery";

export default function ProjectsSection({ result }: { result: PublicResult }) {
  const projects = result.status === "ok" ? result.projects : [];
  const failed = result.status === "error";

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

      {projects.length ? (
        <ProjectGallery projects={projects} />
      ) : (
        <div className="empty-card">
          <ImageIcon aria-hidden="true" />
          <h3>{failed ? "Projects can't load right now." : "Projects are on the way."}</h3>
          <p>
            {failed
              ? "Please try again in a moment."
              : "I'm adding finished apps and systems here soon. In the meantime, see the featured apps above."}
          </p>
          {failed ? null : (
            <a
              href={mailtoHref}
              rel="noopener noreferrer"
              className="button button-secondary"
            >
              <Mail aria-hidden="true" /> Email me
            </a>
          )}
        </div>
      )}
    </section>
  );
}
