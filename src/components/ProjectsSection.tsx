import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { profile, projects } from "../data/profile";

export function ProjectsSection() {
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

        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        <div className="mt-24 flex justify-center">
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
