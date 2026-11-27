import { aiTools, alsoToolkit } from "../data";

export default function AiSection() {
  return (
    <section className="section ai" id="ai" aria-labelledby="ai-title">
      <h2 id="ai-title" className="section-title section-title-left">
        How I build with AI
      </h2>
      <p className="section-intro">
        I use coding agents and AI tools to move faster. Here&apos;s what I use
        each for.
      </p>

      <div className="ai-grid">
        {aiTools.map((tool) => (
          <article className="card ai-card" key={tool.name}>
            <div className="ai-head">
              {tool.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={
                    tool.name === "Guild" ? "ai-logo ai-logo-wide" : "ai-logo"
                  }
                  src={tool.logo}
                  alt=""
                  width={28}
                  height={28}
                />
              ) : (
                <span className="ai-logo ai-mono" aria-hidden="true">
                  {tool.name.charAt(0)}
                </span>
              )}
              <h3>{tool.name}</h3>
            </div>
            <p>{tool.description}</p>
          </article>
        ))}
      </div>

      <h3 className="subheading">Also in my toolkit</h3>
      <ul className="chip-list">
        {alsoToolkit.map((item) => (
          <li className="chip" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
