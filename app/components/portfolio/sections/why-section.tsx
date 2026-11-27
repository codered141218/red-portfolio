import { Check } from "lucide-react";
import { whyItems } from "../data";

export default function WhySection() {
  return (
    <section className="section why" id="why" aria-labelledby="why-title">
      <h2 id="why-title" className="section-title section-title-left">
        Why work with me
      </h2>
      <ul className="reason-list">
        {whyItems.map((item) => (
          <li key={item}>
            <Check aria-hidden="true" /> {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
