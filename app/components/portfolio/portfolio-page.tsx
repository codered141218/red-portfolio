import { ArrowUp } from "lucide-react";
import Navbar from "@/app/components/navbar";
import GridBackground from "@/app/components/ui/grid-background";
import { contactLink, mailtoHref, navLinks, profile } from "./data";
import AboutSection from "./sections/about-section";
import ExpertiseSection from "./sections/expertise-section";
import HeroSection from "./sections/hero-section";
import ServicesSection from "./sections/services-section";
import WorkSection from "./sections/work-section";
import WhySection from "./sections/why-section";

export default function PortfolioPage() {
  return (
    <div className="portfolio-shell">
      <Navbar />
      <main id="main-content">
        <div className="hero-stage">
          <GridBackground />
          <HeroSection />
        </div>
        <AboutSection />
        <ExpertiseSection />
        <ServicesSection />
        <WorkSection />
        <WhySection />
      </main>

      <footer className="site-footer">
        <div className="footer-intro">
          <a className="footer-brand" href="#top">
            {profile.firstName} {profile.lastName}
            <span>.</span>
          </a>
          <p>{profile.tagline}</p>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <h3>Explore</h3>
          <ul>
            {[...navLinks, contactLink].map((link) => (
              <li key={link.name}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-nav">
          <h3>Connect</h3>
          <ul>
            <li>
              <a href={mailtoHref}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.linkedin.href} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.onlineJobs.href} target="_blank" rel="noreferrer">
                OnlineJobs.ph
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {profile.legalName}. All rights
            reserved.
          </span>
          <a href="#top" className="footer-top">
            Back to top <ArrowUp aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
