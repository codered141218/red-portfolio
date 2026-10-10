import { services } from "../data";

export default function ServicesSection() {
  return (
    <section className="section services" id="services">
      <div className="section-heading">
        <h2>Core services</h2>
      </div>

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
    </section>
  );
}
