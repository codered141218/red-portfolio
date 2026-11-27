"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PublicProject } from "@/app/lib/admin/types";

function Slide({ src, alt }: { src: string; alt: string }) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  if (state === "failed") {
    return <div className="viewer-fail">This screenshot couldn&apos;t be loaded.</div>;
  }
  return (
    <>
      {state === "loading" ? <span className="spinner viewer-spinner" role="status" aria-label="Loading screenshot" /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={state === "loading" ? { opacity: 0 } : undefined}
        onLoad={() => setState("ready")}
        onError={() => setState("failed")}
      />
    </>
  );
}

export default function ProjectViewer({
  project,
  startIndex = 0,
  onClose,
}: {
  project: PublicProject;
  startIndex?: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = project.images.length;
  const image = project.images[index];

  const step = (dir: 1 | -1) =>
    setIndex((i) => Math.min(count - 1, Math.max(0, i + dir)));

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      } else if (event.key === "ArrowRight") {
        setIndex((i) => Math.min(count - 1, i + 1));
      } else if (event.key === "ArrowLeft") {
        setIndex((i) => Math.max(0, i - 1));
      } else if (event.key === "Tab") {
        const items = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href]",
        );
        if (!items?.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [count, onClose]);

  if (!image) return null;

  return (
    <div
      ref={dialogRef}
      className="viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} screenshots`}
      onClick={onClose}
      onTouchStart={(e) => {
        const t = e.touches[0];
        touchStart.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="viewer-btn viewer-close"
        aria-label="Close viewer"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X aria-hidden="true" />
      </button>

      <div className="viewer-stage" onClick={(e) => e.stopPropagation()}>
        <Slide key={image.url} src={image.url} alt={image.alt} />
      </div>

      <div className="viewer-caption" onClick={(e) => e.stopPropagation()}>
        <strong>{project.title}</strong>
        <span aria-live="polite">
          {index + 1} of {count}
        </span>
        {project.link ? (
          <div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary viewer-visit"
            >
              Visit project
            </a>
          </div>
        ) : null}
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            className="viewer-btn viewer-prev"
            aria-label="Previous screenshot"
            disabled={index === 0}
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="viewer-btn viewer-next"
            aria-label="Next screenshot"
            disabled={index === count - 1}
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
}
