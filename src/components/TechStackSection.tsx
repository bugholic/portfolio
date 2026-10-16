import { motion } from "motion/react";
import { Layers, Code2, Server, Braces, Database, Zap, Bot, Container, Cloud } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SkillTree } from "./SkillTree";

const stackItems = [
  { icon: Layers, title: "React & Next.js", description: "Fast, accessible interfaces with SSR, static generation and Expo for mobile." },
  { icon: Code2, title: "TypeScript", description: "Strong types for a better developer experience and more reliable codebases." },
  { icon: Server, title: "Node.js & Express", description: "REST APIs, background jobs and cron scheduling that stay predictable." },
  { icon: Braces, title: "Python", description: "Automation, data pipelines and AI services that need fast iteration." },
  { icon: Database, title: "MongoDB & Postgres", description: "Document and relational data, with query optimization for concurrent users." },
  { icon: Zap, title: "Redis & Convex", description: "Caching, real-time state and live updates without the lag." },
  { icon: Bot, title: "RAG, LLMs & MCP", description: "Agents and retrieval pipelines on Qdrant and OpenRouter, built to limit hallucinations." },
  { icon: Container, title: "Docker & CI/CD", description: "Reproducible builds and GitHub Actions pipelines from commit to deploy." },
  { icon: Cloud, title: "AWS & GCP", description: "EC2 and S3 hosting, GCP auth, deployment and APIs." },
];

const workflowSteps = [
  "Turn business requirements into an actionable plan.",
  "Build APIs, interfaces and automation around the real workflow.",
  "Ship, measure and optimize: 10–15s pages down to 2–3s.",
];

export function TechStackSection() {
  return (
    <section id="stack" className="scroll-mt-24 py-24 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="04"
          label="Stack"
          aside={`${stackItems.length} core tools`}
          title={
            <>
              Lean stack,
              <br />
              <span className="text-muted">fast delivery.</span>
            </>
          }
        />

        <SkillTree skills={stackItems} />

        {/* <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 grid gap-10 rounded-3xl border border-line bg-surface-2 p-8 md:p-10 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <span className="eyebrow">Core workflow</span>
            <p className="mt-6 font-display text-2xl font-medium leading-[1.3] tracking-tight">
              Frontend where motion feels sharp, backend where logic stays predictable, and automation where repetitive
              work should disappear.
            </p>
          </div>

          <ol className="space-y-4 self-end lg:col-span-5">
            {workflowSteps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="font-mono text-xs text-accent">0{index + 1}</span>
                <p className="text-sm leading-6 text-muted">{step}</p>
              </li>
            ))}
          </ol>
        </motion.div> */}
      </div>
    </section>
  );
}
