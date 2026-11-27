import {
  ArrowUpRight,
  Clock,
  Landmark,
  Lock,
  Mail,
  ScanSearch,
  Users,
  type LucideIcon,
} from "lucide-react";
import { apps, mailtoHref, type App } from "../data";

const icons: Record<App["icon"], LucideIcon> = {
  crm: Users,
  loan: Landmark,
  guild: Clock,
  scopeit: ScanSearch,
};

export default function AppsSection() {
  return (
    <section className="section apps" id="apps" aria-labelledby="apps-title">
      <h2 id="apps-title" className="section-title section-title-left">
        Featured apps
      </h2>
      <p className="section-intro">
        Apps I&apos;ve built. I use coding agents and AI tools to build faster,
        and my business-systems background to build the right thing.
      </p>

      <div className="app-grid">
        {apps.map((app) => {
          const Icon = icons[app.icon];
          return (
            <article className="card app-card" key={app.name}>
              <div className="app-card-top">
                <span className="icon-tile" aria-hidden="true">
                  <Icon />
                </span>
                {app.tag ? <span className="chip">{app.tag}</span> : null}
              </div>
              <h3>{app.name}</h3>
              <p>{app.description}</p>
              {app.url ? (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-secondary app-card-button"
                >
                  View project <ArrowUpRight aria-hidden="true" />
                </a>
              ) : (
                <p className="app-card-footer">
                  <Lock aria-hidden="true" /> Private project, no public link
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="cta-center">
        <a
          href={mailtoHref}
          rel="noopener noreferrer"
          className="button button-primary"
        >
          <Mail aria-hidden="true" /> Email me about your app
        </a>
        <p>Tell me what you want to build.</p>
      </div>
    </section>
  );
}
