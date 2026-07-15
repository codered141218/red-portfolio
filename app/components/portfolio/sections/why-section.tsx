import { ArrowUpRight, Check } from "lucide-react";
import { whyItems } from "../data";

export default function WhySection() {
  return (
    <section className="section why" id="contact">
      <div className="section-heading">
        <h2>Why work with me</h2>
      </div>

      <div className="why-layout">
        <ul className="reason-list">
          {whyItems.map((item) => (
            <li key={item}>
              <Check aria-hidden="true" /> {item}
            </li>
          ))}
        </ul>

        <div className="contact-block">
          <h3>Have a process that needs attention?</h3>
          <p>
            Tell me what is slowing your team down. I&apos;ll help you find a
            clear, practical way forward.
          </p>
          <div className="contact-actions">
            <a
              href="mailto:jrgavieta.personal@gmail.com"
              className="button button-primary"
            >
              Start a conversation <ArrowUpRight aria-hidden="true" />
            </a>
            <a
              href="https://www.onlinejobs.ph/jobseekers/info/3478596"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              View my OnlineJobs.ph profile
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
