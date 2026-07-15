import { services } from "../data";

export default function ServicesSection() {
  return (
    <section className="section services" id="services">
      <div className="section-heading">
        <h2>Core services</h2>
      </div>

      <div className="service-grid">
        {services.map(([title, ...items], index) => (
          <article className="service" key={title}>
            <span className="service-number">0{index + 1}</span>
            <div>
              <h3>{title}</h3>
              <ul>
                {items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
