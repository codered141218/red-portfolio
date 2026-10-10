import { education, experience, highlights, mailtoHref, profile } from "../data";

export default function AboutSection() {
  return (
    <section className="section about" id="about">
      <h2 className="section-title section-title-left">About me</h2>

      <dl className="highlights" aria-label="Highlights">
        {highlights.map((item) => (
          <div className="highlight" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="about-grid">
        <div className="about-left">
          <article className="info-card">
            <h3>
              <span aria-hidden="true" />
              Education
            </h3>
            <p>{education.years}</p>
            <strong>{education.degree}</strong>
            <p>{education.school}</p>
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
                  <a href={mailtoHref}>{profile.email}</a>
                </dd>
              </div>
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={profile.linkedin.href} target="_blank" rel="noreferrer">
                    {profile.linkedin.label}
                  </a>
                </dd>
              </div>
              <div>
                <dt>OnlineJobs profile</dt>
                <dd>
                  <a href={profile.onlineJobs.href} target="_blank" rel="noreferrer">
                    {profile.onlineJobs.label}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{profile.location}</dd>
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
                <p className="experience-detail">{item.detail}</p>
                <ul>
                  {item.items.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
