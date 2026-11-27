import Navbar from "@/app/components/navbar";
import GridBackground from "@/app/components/ui/grid-background";
import { mailtoHref, profile } from "./data";
import AboutSection from "./sections/about-section";
import AiSection from "./sections/ai-section";
import AppsSection from "./sections/apps-section";
import ContactSection from "./sections/contact-section";
import HeroSection from "./sections/hero-section";
import ProjectsSection from "./sections/projects-section";
import ServicesSection from "./sections/services-section";
import WhySection from "./sections/why-section";
import StickyCta from "./sticky-cta";

export default function PortfolioPage() {
  const externalLinks = [profile.linkedin, profile.upwork, profile.onlineJobs];

  return (
    <div className="portfolio-shell">
      <Navbar />
      <main id="main-content">
        <div className="hero-stage">
          <GridBackground />
          <HeroSection />
        </div>
        <AboutSection />
        <AppsSection />
        <ProjectsSection />
        <AiSection />
        <ServicesSection />
        <WhySection />
        <ContactSection />
      </main>

      <footer className="site-footer">
        <div className="footer-guild">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/guild-logo-horizontal-transparent.svg"
            alt="Guild"
            width={119}
            height={40}
            className="footer-logo"
          />
          <p>Guild is an app I built.</p>
        </div>
        <div className="footer-meta">
          <span className="footer-brand">
            © {new Date().getFullYear()} {profile.fullName}
          </span>
          <ul className="footer-links">
            <li>
              <a href={mailtoHref} rel="noopener noreferrer">
                Email
              </a>
            </li>
            {externalLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
      <StickyCta />
    </div>
  );
}
