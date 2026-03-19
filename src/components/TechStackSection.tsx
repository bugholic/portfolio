import { motion } from "motion/react";
import { Layers, Code2, Database, Wind, Box, Cpu, Sparkles, Smartphone, Braces, Cylinder } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { TechCard } from "./TechCard";
import { useScrollParallax } from "../hooks/useScrollParallax";

const stackItems = [
  {
    icon: Layers,
    title: "Next.js",
    description: "High-performance React framework for the web with server-side rendering and static generation.",
  },
  {
    icon: Smartphone,
    title: "Expo",
    description: "Rapid cross-platform app delivery for polished React Native experiences without a heavy native workflow.",
  },
  {
    icon: Code2,
    title: "TypeScript",
    description: "Strongly typed JavaScript for better developer experience and more reliable codebases.",
  },
  {
    icon: Braces,
    title: "Python",
    description: "A practical language for automation, backend services, and workflows that need fast iteration.",
  },
  {
    icon: Database,
    title: "Redis",
    description: "Lightning-fast in-memory data structure store for caching and real-time data processing.",
  },
  {
    icon: Cylinder,
    title: "MongoDB",
    description: "Flexible document storage for products that evolve quickly and benefit from schema agility.",
  },
  {
    icon: Cpu,
    title: "PostgreSQL",
    description: "Reliable and extensible relational database system for complex data modeling.",
  },
  {
    icon: Wind,
    title: "Tailwind CSS",
    description: "Utility-first CSS framework for rapid UI development and consistent design systems.",
  },
  {
    icon: Box,
    title: "Docker",
    description: "Consistent environments for building and shipping apps across any infrastructure.",
  },
];

const workflowTags = [
  "React",
  "Expo",
  "Node.js",
  "Python",
  "APIs",
  "Automation",
  "MongoDB",
  "UI Systems",
  "Postgres",
  "Deployment",
];

const workflowStats = [
  { label: "Frontend", value: "React, Next.js, Tailwind" },
  { label: "Mobile", value: "Expo, React Native" },
  { label: "Backend", value: "Node.js, Python, APIs" },
  { label: "Data", value: "MongoDB, PostgreSQL, Redis" },
];

const workflowSteps = [
  "Design interfaces with motion and clear hierarchy.",
  "Build APIs and automation around practical workflows.",
  "Deploy with a focus on speed, stability, and iteration.",
];

export function TechStackSection() {
  const { ref, slowY, midY } = useScrollParallax({ slow: 30, mid: 55 });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section ref={ref as any} id="stack" className="relative scroll-mt-28 py-24 px-6 max-w-6xl mx-auto overflow-hidden">
      {/* Parallax depth layers */}
      <motion.div
        style={{ y: slowY }}
        className="pointer-events-none absolute top-0 -left-20 h-40 w-40 rounded-full bg-cyan-400/6 blur-3xl"
      />
      <motion.div
        style={{ y: midY }}
        className="pointer-events-none absolute -bottom-10 right-0 h-48 w-48 rounded-full bg-blue-500/6 blur-3xl"
      />

      <SectionHeader
        title="Tech Stack"
        subtitle="A compact look at the tools I rely on to ship clean interfaces, stable backends, and practical automation."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-8 md:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,163,255,0.18),transparent_38%)]" />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 font-mono text-[10px] tracking-[0.24em] uppercase text-white/60">
              <Sparkles size={12} className="text-accent" />
              Core Workflow
            </div>

            <h3 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              Lean stack, fast delivery, and a strong bias for maintainable systems.
            </h3>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/55 md:text-lg">
              I keep the toolset focused: frontend where motion feels sharp, backend where the logic stays predictable,
              and automation where repetitive work should disappear.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {workflowStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.12 + index * 0.07, duration: 0.35 }}
                  className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">{stat.label}</div>
                  <div className="mt-2 text-sm font-medium text-white/80">{stat.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {workflowTags.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.05, duration: 0.35 }}
                  whileHover={{ y: -3 }}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
                >
                  {tag}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + index * 0.08, duration: 0.35 }}
                  className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[10px] text-accent">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-6 text-white/55">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {stackItems.map((item, index) => (
            <div key={item.title}>
              <TechCard icon={item.icon} title={item.title} description={item.description} index={index} />
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mt-10 flex justify-center"
      >
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[10px] tracking-widest uppercase text-white/60">
            Available for new projects
          </span>
        </div>
      </motion.div>
    </section>
  );
}
