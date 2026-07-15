const experience = [
  {
    role: "Regional Branch Manager",
    detail: "Led daily branch operations, team coordination, and execution.",
    items: [
      "Led branch operations",
      "Managed teams",
      "Improved workflows",
      "Oversaw projects",
    ],
  },
  {
    role: "Software Project Manager",
    detail:
      "Built database systems, managed delivery timelines, and supported risk management.",
    items: [
      "Database build-IP",
      "Created project timelines",
      "Database disaster risk management",
      "User training",
      "Managed system implementation",
    ],
  },
  {
    role: "Virtual Assistant",
    detail:
      "Managed WordPress websites, maintenance tasks, and content publishing.",
    items: [
      "WordPress management",
      "Website maintenance",
      "AI-assisted content publishing",
      "Technical support",
      "Administrative support",
    ],
  },
];

export default function AboutSection() {
  return (
    <section className="section about" id="about">
      <h2 className="section-title section-title-left">About me</h2>

      <div className="about-grid">
        <div className="about-left">
          <article className="info-card">
            <h3>
              <span aria-hidden="true" />
              Education
            </h3>
            <p>2013–2017</p>
            <strong>Bachelor of Science in Information Technology</strong>
            <p>Binalbagan Catholic College</p>
          </article>

          <article className="info-card contact-card">
            <h3>
              <span aria-hidden="true" />
              Contact information
            </h3>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:jrgavieta.personal@gmail.com">
                    jrgavieta.personal@gmail.com
                  </a>
                </dd>
              </div>
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href="https://www.linkedin.com/in/john-reden-gavieta-8288a9240/">
                    John Reden Gavieta
                  </a>
                </dd>
              </div>
              <div>
                <dt>OnlineJobs profile</dt>
                <dd>
                  <a
                    href="https://www.onlinejobs.ph/jobseekers/info/3478596"
                    target="_blank"
                    rel="noreferrer"
                  >
                    onlinejobs.ph/jobseekers/info/3478596
                  </a>
                </dd>
              </div>
            </dl>
          </article>
        </div>

        <article className="info-card experience-card">
          <h3>
            <span aria-hidden="true" />
            Experience
          </h3>
          <div className="experience-list">
            {experience.map((item) => (
              <section key={item.role}>
                <h4>{item.role}</h4>
                {item.items.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
