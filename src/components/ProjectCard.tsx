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
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group flex min-w-0 flex-col"
    >
      <CoverWrapper
        {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
        className="relative block aspect-[16/10] overflow-hidden rounded-2xl border border-line"
      >
        <ProjectCover cover={project.cover} />
        <span className="absolute left-4 top-4 rounded-full bg-bg/85 px-3 py-1 font-mono text-[11px] text-white/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        {href && (
          <span className="absolute right-4 top-4 flex h-12 w-12 scale-50 items-center justify-center rounded-full bg-accent text-white opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
            <ArrowUpRight size={20} />
          </span>
        )}
      </CoverWrapper>

      <div className="mt-5 flex items-start justify-between gap-4">
        <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-tight md:text-2xl">
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
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted" title={project.summary}>
        {project.summary}
      </p>

      {/* Three tags keep every card the same height; the rest collapse into a count */}
      <div className="mb-5 mt-4 flex flex-wrap items-center gap-2 text-xs">
        {project.stack.slice(0, 3).map((tech) => (
          <span key={tech} className="rounded-full border border-line px-3 py-1 text-white/70">
            {tech}
          </span>
        ))}
        {project.stack.length > 3 && (
          <span className="px-1 font-mono text-[11px] text-muted">+{project.stack.length - 3}</span>
        )}
      </div>

      <div className="mt-auto flex items-center gap-5 border-t border-line pt-4 text-sm">
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
