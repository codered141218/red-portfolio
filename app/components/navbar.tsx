"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { contactLink, navLinks, profile } from "@/app/components/portfolio/data";

const mobileNavLinks = [...navLinks, contactLink];
const sectionHrefs = ["#top", ...mobileNavLinks.map((link) => link.href)];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#top");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);

  // Highlight the nav link for whichever section is currently in view.
  useEffect(() => {
    const sections = sectionHrefs
      .map((href) => document.getElementById(href.slice(1)))
      .filter((section): section is HTMLElement => section !== null);

    if (!sections.length) return;

    const visibility = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let best: Element | null = null;
        let bestRatio = 0;
        for (const [section, ratio] of visibility) {
          if (ratio > bestRatio) {
            best = section;
            bestRatio = ratio;
          }
        }

        if (best) setActiveHref(`#${best.id}`);
      },
      { rootMargin: "-64px 0px -45% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
  const isActive = (href: string) => activeHref === href;

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <a
          href="#top"
          className="brand"
          aria-label={`${profile.firstName} ${profile.lastName} portfolio home`}
          onClick={() => handleNavClick("#top")}
        >
          {profile.firstName} {profile.lastName}
          <span>.</span>
        </a>

        <div className="nav-links">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
              aria-current={isActive(link.href) ? "location" : undefined}
              onClick={() => handleNavClick(link.href)}
            >
              {link.name}
            </a>
          ))}
        </div>

        <a
          href={contactLink.href}
          className="nav-cta nav-cta-desktop"
          onClick={() => handleNavClick(contactLink.href)}
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
                {profile.firstName} {profile.lastName}
                <span>.</span>
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
                  aria-current={isActive(link.href) ? "location" : undefined}
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
