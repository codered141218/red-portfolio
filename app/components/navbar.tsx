"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Expertise", href: "#expertise" },
  { name: "Services", href: "#services" },
  { name: "Work", href: "#projects" },
];

const mobileNavLinks = [...navLinks, { name: "Contact", href: "#contact" }];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#about");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const focusableElements = menuPanelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );

        if (!focusableElements?.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus({ preventScroll: true });
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const handleNavClick = (href: string) => {
    setActiveHref(href);
    closeMenu();
  };

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <a
          href="#top"
          className="brand"
          aria-label="John Reden portfolio home"
          onClick={() => handleNavClick("#top")}
        >
          John Reden<span>.</span>
        </a>

        <div className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
              onClick={() => handleNavClick(link.href)}
            >
              {link.name}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="nav-cta nav-cta-desktop"
          onClick={() => handleNavClick("#contact")}
        >
          Let&apos;s talk <ArrowUpRight aria-hidden="true" />
        </a>

        <button
          type="button"
          className="nav-menu-toggle"
          ref={menuButtonRef}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label="Open navigation menu"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu aria-hidden="true" />
        </button>

        <div
          className="mobile-nav-backdrop"
          hidden={!isMenuOpen}
          onClick={closeMenu}
        >
          <aside
            id="mobile-navigation"
            className="mobile-nav"
            ref={menuPanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-nav-header">
              <a
                href="#top"
                className="mobile-nav-brand"
                onClick={() => handleNavClick("#top")}
              >
                John Reden<span>.</span>
              </a>

              <button
                type="button"
                className="mobile-nav-close"
                aria-label="Close navigation menu"
                autoFocus
                onClick={closeMenu}
              >
                <X aria-hidden="true" />
                <span>Close</span>
              </button>
            </div>

            <div className="mobile-nav-links">
              {mobileNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="mobile-nav-link"
                  aria-current={activeHref === link.href ? "location" : undefined}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <p className="mobile-nav-note">
              Operations <span aria-hidden="true">•</span> Systems{" "}
              <span aria-hidden="true">•</span> Digital support
            </p>
          </aside>
        </div>
      </nav>
    </header>
  );
}
