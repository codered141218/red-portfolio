import Navbar from "@/app/components/navbar";
import GridBackground from "@/app/components/ui/grid-background";
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
      <main>
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
  <a className="footer-brand" href="#top">
    John Reded<span>.</span>
  </a>

  <p>
    Helping businesses streamline operations, optimize systems, and build
    efficient workflows that drive sustainable growth.
  </p>

  <span>
    © {new Date().getFullYear()} John Reded C. Gavieta. All rights reserved.
  </span>
</footer>
    </div>
  );
}
