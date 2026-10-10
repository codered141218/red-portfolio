"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { workCategories } from "../data";

type SelectedWork = {
  categoryIndex: number;
  imageIndex: number;
};

function stepSelection(
  current: SelectedWork | null,
  direction: 1 | -1,
): SelectedWork | null {
  if (!current) return current;
  const count = workCategories[current.categoryIndex].images.length;
  return {
    ...current,
    imageIndex: (current.imageIndex + direction + count) % count,
  };
}

export default function WorkSection() {
  const [selectedWork, setSelectedWork] = useState<SelectedWork | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const isOpen = selectedWork !== null;

  const category = selectedWork ? workCategories[selectedWork.categoryIndex] : null;
  const image = category && selectedWork ? category.images[selectedWork.imageIndex] : null;
  const imageCount = category?.images.length ?? 0;

  const closeLightbox = () => setSelectedWork(null);
  const step = (direction: 1 | -1) =>
    setSelectedWork((current) => stepSelection(current, direction));

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedWork(null);
      if (event.key === "ArrowRight") {
        setSelectedWork((current) => stepSelection(current, 1));
      }
      if (event.key === "ArrowLeft") {
        setSelectedWork((current) => stepSelection(current, -1));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  return (
    <>
      <section className="section projects" id="projects">
        <div className="section-heading">
          <h2>Selected work</h2>
        </div>

        <div className="work-categories">
          {workCategories.map((item, categoryIndex) => (
            <article className="work-category" key={item.title}>
              <header>
                <span>{String(categoryIndex + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </header>
              <div className="work-gallery">
                {item.images.map((workImage, imageIndex) => (
                  <button
                    type="button"
                    className="work-image"
                    key={workImage.src}
                    aria-label={`Expand: ${workImage.alt}`}
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setSelectedWork({ categoryIndex, imageIndex });
                    }}
                  >
                    <Image
                      src={workImage.src}
                      alt={workImage.alt}
                      fill
                      sizes="(max-width: 720px) 100vw, 50vw"
                      className="work-image-content"
                    />
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {category && image && selectedWork && (
        <div
          className="work-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${category.title}, image ${selectedWork.imageIndex + 1} of ${imageCount}`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="work-lightbox-close"
            aria-label="Close expanded image"
            autoFocus
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
          >
            <X aria-hidden="true" />
          </button>

          <figure
            className="work-lightbox-figure"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={1302}
              height={606}
              sizes="94vw"
              className="work-lightbox-image"
              loading="eager"
            />
            <figcaption>
              <span>{category.title}</span>
              <span>{image.alt}</span>
              <span aria-hidden="true">
                {selectedWork.imageIndex + 1} / {imageCount}
              </span>
            </figcaption>
          </figure>

          {imageCount > 1 && (
            <>
              <button
                type="button"
                className="work-lightbox-nav work-lightbox-prev"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                className="work-lightbox-nav work-lightbox-next"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
