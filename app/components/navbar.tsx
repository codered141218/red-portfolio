import { ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Expertise", href: "#expertise" },
  { name: "Services", href: "#services" },
  { name: "Work", href: "#projects" },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <a href="#top" className="brand" aria-label="John Reden portfolio home">
          John Reden<span>.</span>
        </a>

        <div className="nav-links">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">
              {link.name}
            </a>
          ))}
        </div>

        <a href="#contact" className="nav-cta">
          Let&apos;s talk <ArrowUpRight aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
}
