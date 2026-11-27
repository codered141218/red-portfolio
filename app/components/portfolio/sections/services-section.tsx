import Image from "next/image";
import { experience, services, toolGroups } from "../data";
import WorkSection from "./work-section";

export default function ServicesSection() {
  return (
    <section
      className="section services"
      id="services"
      aria-labelledby="services-title"
    >
      <h2 id="services-title" className="section-title section-title-left">
        Other services
      </h2>
      <p className="section-intro">
        Beyond building apps, I still help with day-to-day operations and
        websites.
      </p>

      <div className="service-grid">
        {services.map((service, index) => (
          <article className="service" key={service.title}>
            <span className="service-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{service.title}</h3>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <h3 className="subheading">Experience</h3>
      <div className="experience-grid">
        {experience.map((item) => (
          <article className="info-card" key={item.role}>
            <h4>{item.role}</h4>
            <p className="experience-detail">{item.detail}</p>
            <ul>
              {item.items.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <h3 className="subheading">Tools and platforms</h3>
      <div className="tool-groups">
        {toolGroups.map((group) => (
          <article className="tool-group" key={group.title}>
            <h4>
              <span aria-hidden="true" />
              {group.title}
            </h4>
            <div className="tool-list">
              {group.tools.map((tool) => (
                <div className="tool" key={tool.name}>
                  <Image
                    src={tool.src}
                    alt=""
                    width={112}
                    height={40}
                    sizes="112px"
                  />
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <WorkSection />
    </section>
  );
}
