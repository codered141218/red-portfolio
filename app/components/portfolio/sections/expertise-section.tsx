import Image from "next/image";
import { toolGroups } from "../data";

export default function ExpertiseSection() {
  return (
    <section className="section expertise" id="expertise">
      <h2 className="section-title">Tools &amp; systems</h2>

      <div className="tool-groups">
        {toolGroups.map((group) => (
          <article className="tool-group" key={group.title}>
            <h3><span aria-hidden="true" />{group.title}</h3>
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
    </section>
  );
}
