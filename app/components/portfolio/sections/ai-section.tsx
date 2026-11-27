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
            <h3>{tool.name}</h3>
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
