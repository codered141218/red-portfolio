"use client";

import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { LinkedInIcon } from "./icons";
import { mailtoHref, profile } from "./data";

/**
 * Mobile-only bar. Shown once the hero buttons have scrolled away and hidden
 * while the Contact band is on screen. Without JS it stays visible (CSS).
 */
export default function StickyCta() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero-cta]");
    const contact = document.getElementById("contact");
    const observers: IntersectionObserver[] = [];
    if (hero) {
      const o = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting));
      o.observe(hero);
      observers.push(o);
    }
    if (contact) {
      const o = new IntersectionObserver(([e]) => setContactVisible(e.isIntersecting));
      o.observe(contact);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const hidden = heroVisible || contactVisible;

  return (
    <div className="sticky-cta" data-hidden={hidden ? "true" : undefined}>
      <a
        href={mailtoHref}
        rel="noopener noreferrer"
        className="button button-primary"
      >
        <Mail aria-hidden="true" /> Email me
      </a>
      <a
        href={profile.linkedin.href}
        target="_blank"
        rel="noopener noreferrer"
        className="button button-secondary sticky-cta-icon"
        aria-label="LinkedIn (opens in a new tab)"
      >
        <LinkedInIcon size={20} />
      </a>
    </div>
  );
}
