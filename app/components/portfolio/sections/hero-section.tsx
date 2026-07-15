import Image from "next/image";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Mail,
  PanelsTopLeft,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="hero" id="top">
      <p className="hero-role">Operations &amp; Systems Specialist</p>

      <h1 className="hero-name">
        <span className="hero-name-line">John</span>
        <span className="hero-name-line">
          Reden<span className="hero-dot">.</span>
        </span>
      </h1>

      <div className="hero-orbit" aria-hidden="true" />

      <div className="hero-left-copy">
        <p>
          Hi, I&apos;m John Reden Gavieta, an Operations & Systems Specialist
          with 8+ years of experience in operations, project management,
          technical support, and virtual assistance.
        </p>
        <div className="hero-links" aria-label="John Reden links">
          <a
            href="mailto:jrgavieta.personal@gmail.com"
            aria-label="Email John Reden"
          >
            <Mail aria-hidden="true" />
          </a>
          <a
            href="https://www.onlinejobs.ph/jobseekers/info/3478596"
            target="_blank"
            rel="noreferrer"
            aria-label="View John Reden on OnlineJobs.ph"
          >
            <BriefcaseBusiness aria-hidden="true" />
          </a>
          <a href="#projects" aria-label="View selected work">
            <PanelsTopLeft aria-hidden="true" />
          </a>
        </div>
      </div>

      <figure className="hero-portrait">
        <Image
          src="/red-img.png"
          alt="John Reden, Operations and Systems Specialist"
          fill
          preload
          className="hero-image"
          sizes="(max-width: 760px) 92vw, 58vw"
        />
      </figure>

      <div className="hero-right-copy">
        <p>
          I specialize in streamlining workflows, improving processes, and
          implementing efficient systems that help businesses operate more
          effectively. I&apos;m organized, reliable, and committed to delivering
          high-quality results that support business growth.
        </p>
        <a
          href="mailto:jrgavieta.personal@gmail.com"
          className="button button-primary"
        >
          Let&apos;s talk <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
