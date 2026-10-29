import { useState } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { profile, projects } from "../data/profile";

// One row of three fits a single screen; each "load more" adds another row.
const PAGE = 3;

export function ProjectsSection() {
  const [visible, setVisible] = useState(PAGE);
  const remaining = projects.length - visible;

  return (
    <section id="projects" className="scroll-mt-24 py-16 md:py-20">
      <div className="container-x">
        <SectionHeader
          label="Selected work"
          aside={`${projects.length} projects · client & personal`}
          title={[[{ text: "Selected " }, { text: "works", className: "text-accent" }]]}
          tight
        />

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, visible).map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {remaining > 0 ? (
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="inline-flex items-center gap-2 rounded-full bg-accent py-2 pl-6 pr-2 text-sm font-medium text-white transition-colors hover:bg-signal"
            >
              Load more projects
              <span className="flex h-9 items-center gap-1 rounded-full bg-white/20 px-3 font-mono text-[11px]">
                +{Math.min(PAGE, remaining)} <ChevronDown size={14} />
              </span>
            </button>
          ) : (
            projects.length > PAGE && (
              // A hash link, so the page scroller (horizontal on desktop) brings the section top back
              <a
                href="#projects"
                onClick={() => setVisible(PAGE)}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-2 pl-6 pr-2 text-sm font-medium transition-colors hover:border-accent/50"
              >
                Show fewer
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2">
                  <ChevronUp size={16} />
                </span>
              </a>
            )
          )}
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-line bg-surface py-2 pl-6 pr-2 text-sm font-medium transition-colors hover:border-accent/50"
          >
            More on GitHub
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
