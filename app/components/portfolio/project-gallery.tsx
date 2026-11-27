"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { PublicProject } from "@/app/lib/admin/types";
import ProjectViewer from "./project-viewer";

const MAX_TAGS = 4;

export function ProjectCard({
  project,
  eager,
  draft,
  onOpen,
}: {
  project: PublicProject;
  eager?: boolean;
  draft?: boolean;
  onOpen: (button: HTMLButtonElement) => void;
}) {
  const n = project.images.length;
  const cover = project.images[0];
  const shown = project.tags.slice(0, MAX_TAGS);
  const extra = project.tags.length - shown.length;

  return (
    <article className="project-card">
      <div className="project-cover">
        {cover ? (
          <Image
            src={cover.url}
            alt=""
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            loading={eager ? "eager" : "lazy"}
          />
        ) : null}
        {draft ? <span className="draft-pill">Draft, not public</span> : null}
        <span className="project-count">
          {n === 1 ? "1 screenshot" : `${n} screenshots`}
        </span>
      </div>
      <div className="project-body">
        <h3>
          <button
            type="button"
            className="project-open"
            aria-label={`Open ${project.title}, ${n === 1 ? "1 screenshot" : `${n} screenshots`}`}
            onClick={(e) => onOpen(e.currentTarget)}
          >
            {project.title}
          </button>
        </h3>
        <p className="project-summary">{project.summary}</p>
        {project.privacyNote ? <p className="project-note">{project.privacyNote}</p> : null}
        {shown.length ? (
          <ul className="project-tags" aria-label="Tags">
            {shown.map((tag) => (
              <li className="chip" key={tag}>
                {tag}
              </li>
            ))}
            {extra > 0 ? <li className="chip">+{extra}</li> : null}
          </ul>
        ) : null}
      </div>
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-secondary project-link"
        >
          Visit project
        </a>
      ) : null}
    </article>
  );
}

export default function ProjectGallery({ projects }: { projects: PublicProject[] }) {
  const [open, setOpen] = useState<PublicProject | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <ul className="project-grid" data-count={projects.length}>
        {projects.map((project, i) => (
          <li key={project.id}>
            <ProjectCard
              project={project}
              eager={i < 3}
              onOpen={(button) => {
                opener.current = button;
                setOpen(project);
              }}
            />
          </li>
        ))}
      </ul>
      {open ? <ProjectViewer project={open} onClose={close} /> : null}
    </>
  );
}
