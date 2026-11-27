"use client";

import { useEffect, useRef } from "react";

/** Small accessible dialog: focus trap, Esc, focus returns to the opener. */
export default function Modal({
  title,
  role = "alertdialog",
  onEscape,
  children,
}: {
  title: string;
  role?: "alertdialog" | "dialog";
  onEscape?: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = ref.current;
    const first = root?.querySelector<HTMLElement>("[data-autofocus]") ?? root?.querySelector<HTMLElement>("button, a[href]");
    first?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onEscape) {
        event.stopPropagation();
        onEscape();
      } else if (event.key === "Tab" && root) {
        const items = root.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input, textarea");
        if (!items.length) return;
        const a = items[0];
        const z = items[items.length - 1];
        if (event.shiftKey && document.activeElement === a) {
          event.preventDefault();
          z.focus();
        } else if (!event.shiftKey && document.activeElement === z) {
          event.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener?.focus?.({ preventScroll: true });
    };
  }, [onEscape]);

  return (
    <div className="modal-backdrop">
      <div ref={ref} className="modal" role={role} aria-modal="true" aria-label={title}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}
