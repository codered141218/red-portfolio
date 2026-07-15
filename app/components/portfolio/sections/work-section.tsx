"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { workCategories } from "../data";

type SelectedWork = {
  src: string;
  alt: string;
};

export default function WorkSection() {
  const [selectedWork, setSelectedWork] = useState<SelectedWork | null>(null);

  useEffect(() => {
    if (!selectedWork) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedWork(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedWork]);

  return (
    <>
      <section className="section projects" id="projects">
        <div className="section-heading">
          <h2>Selected work</h2>
        </div>

        <div className="work-categories">
          {workCategories.map((category, categoryIndex) => (
            <article className="work-category" key={category.title}>
              <header>
                <span>0{categoryIndex + 1}</span>
                <h3>{category.title}</h3>
              </header>
              <div className="work-gallery">
                {category.images.map((src, imageIndex) => {
                  const alt = `${category.title} project preview ${imageIndex + 1}`;

                  return (
                    <button
                      type="button"
                      className="work-image"
                      key={src}
                      aria-label={`Expand ${alt}`}
                      onClick={() => setSelectedWork({ src, alt })}
                    >
                      <Image
                        src={src}
                        alt={alt}
                        fill
                        sizes="(max-width: 720px) 100vw, 50vw"
                        className="work-image-content"
                      />
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      {selectedWork && (
        <div
          className="work-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={selectedWork.alt}
          onClick={() => setSelectedWork(null)}
        >
          <button
            type="button"
            className="work-lightbox-close"
            aria-label="Close expanded image"
            autoFocus
            onClick={(event) => {
              event.stopPropagation();
              setSelectedWork(null);
            }}
          >
            <X aria-hidden="true" />
          </button>
          <Image
            src={selectedWork.src}
            alt={selectedWork.alt}
            width={1302}
            height={606}
            sizes="94vw"
            className="work-lightbox-image"
            priority
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
