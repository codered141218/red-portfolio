import { education, industries } from "../data";

export default function AboutSection() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <h2 id="about-title" className="section-title section-title-left">
        About
      </h2>

      <div className="about-grid">
        <div className="about-text">
          <p className="about-lead">
            I&apos;m not just a vibe coder. I&apos;m a freelance programmer of
            almost 8 years, with PHP as my main language.
          </p>
          <p>
            Before I built apps with coding agents, I ran the business side:
            functional consultant in ERP implementations, Software Project
            Manager covering implementations for our branch, branch manager over
            branch operations, sales, admin, purchases and team leadership, and
            regional branch manager across 3 Luzon branches of an IT company.
          </p>
          <p>
            That means I understand business processes, not only code.
            I&apos;ve worked on software implementations across retail, F&amp;B,
            distribution, schools, manufacturing, IT services and government.
          </p>
          <p>
            My workflow: understand the business process first, then work with
            the technical side to develop and recommend the right solution.
          </p>
        </div>

        <div className="about-side">
          <div className="stat-tile">
            <span className="stat-value">8+</span>
            <span className="stat-label">years of experience</span>
          </div>

          <article className="info-card">
            <h3>
              <span aria-hidden="true" />
              Industries I&apos;ve worked in
            </h3>
            <ul className="chip-list">
              {industries.map((industry) => (
                <li className="chip" key={industry}>
                  {industry}
                </li>
              ))}
            </ul>
          </article>

          <article className="info-card">
            <h3>
              <span aria-hidden="true" />
              Education
            </h3>
            <p>{education.years}</p>
            <strong>{education.degree}</strong>
            <p>{education.school}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
