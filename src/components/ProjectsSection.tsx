import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { profile, projects } from "../data/profile";

const MOBILE_VISIBLE = 3;

export function ProjectsSection() {
  const [showAll, setShowAll] = useState(false);
  const hiddenCount = projects.length - MOBILE_VISIBLE;

  return (
    <section id="projects" className="scroll-mt-24 py-24 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="03"
          label="Selected work"
          aside={`${projects.length} projects · client & personal`}
          title={
            <>
              Selected <span className="text-accent">works</span>
            </>
          }
        />

        <div className="grid grid-cols-1 gap-x-8 gap-y-20 md:grid-cols-2">
          {projects.map((project, index) => (
            <div key={project.title} className={!showAll && index >= MOBILE_VISIBLE ? "hidden min-w-0 md:block" : "min-w-0"}>
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        {!showAll && hiddenCount > 0 && (
          <div className="mt-14 flex justify-center md:hidden">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium transition-colors hover:bg-accent-hover"
            >
              Load more projects
              <span className="rounded-full bg-white/20 px-2 py-0.5 font-mono text-[11px]">+{hiddenCount}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        <div className="mt-10 flex justify-center md:mt-24">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-line bg-surface py-2 pl-6 pr-2 text-sm font-medium transition-colors hover:border-accent/50"
          >
            More experiments on GitHub
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
