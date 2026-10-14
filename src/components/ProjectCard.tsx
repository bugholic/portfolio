import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, Github, Lock } from "lucide-react";
import { ProjectCover } from "./ProjectCover";
import type { Project } from "../data/profile";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const href = project.live ?? project.repo;
  const CoverWrapper = href ? "a" : "div";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group ${index % 2 === 1 ? "md:mt-28" : ""}`}
    >
      <CoverWrapper
        {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
        className="relative block aspect-[16/11] overflow-hidden rounded-3xl border border-line"
      >
        <ProjectCover cover={project.cover} />
        <span className="absolute left-4 top-4 rounded-full bg-bg/70 px-3 py-1 font-mono text-[11px] text-white/80 backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </span>
        {href && (
          <span className="absolute right-4 top-4 flex h-12 w-12 scale-50 items-center justify-center rounded-full bg-accent text-white opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
            <ArrowUpRight size={20} />
          </span>
        )}
      </CoverWrapper>

      <div className="mt-6 flex items-start justify-between gap-6">
        <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
          {project.title}
        </h3>
        <span
          className={`mt-1 shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
            project.kind === "Client" ? "bg-accent-soft text-accent" : "bg-surface-2 text-white/60"
          }`}
        >
          {project.kind}
        </span>
      </div>
      <p className="mt-3 text-[15px] leading-7 text-muted">{project.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
        {project.stack.map((tech) => (
          <span key={tech} className="rounded-full border border-line px-3 py-1 text-white/70">
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-5 border-t border-line pt-5 text-sm">
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium text-white/85 transition-colors hover:text-accent"
          >
            <Github size={15} /> View code
          </a>
        )}
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium text-white/85 transition-colors hover:text-accent"
          >
            <ExternalLink size={15} /> Live site
          </a>
        )}
        {!project.repo && !project.live && (
          <span className="inline-flex items-center gap-2 text-muted">
            <Lock size={14} />
            {project.kind === "Client" ? "Client work · private codebase" : "Private repository"}
          </span>
        )}
      </div>
    </motion.article>
  );
}
