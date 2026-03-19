import { useEffect, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { ProjectCard } from "./ProjectCard";
import { getPortfolioProjects, type PortfolioProject } from "../mvc/controllers/projects/ProjectsController";

export function ProjectsSection() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRepos() {
      try {
        setLoading(true);
        const data = await getPortfolioProjects(controller.signal);
        setProjects(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError("Could not load projects from GitHub.");
      } finally {
        setLoading(false);
      }
    }

    loadRepos();
    return () => controller.abort();
  }, []);

  return (
    <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Selected Works"
        subtitle="Live repositories from my GitHub profile, focused on full-stack engineering and performance."
      />

      {loading && (
        <p className="text-center text-white/60 font-mono text-xs tracking-widest uppercase">Loading repositories...</p>
      )}

      {error && <p className="text-center text-red-300/90">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project) => (
            <div key={project.id}>
              <ProjectCard
                name={project.name}
                fullName={project.fullName}
                description={project.description}
                language={project.language}
                stars={project.stars}
                url={project.url}
                liveUrl={project.liveUrl}
                updatedAt={project.updatedAt}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
