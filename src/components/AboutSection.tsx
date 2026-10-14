import { motion } from "motion/react";
import { Bot, Code2, MapPin, Workflow } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { profile } from "../data/profile";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease },
});

const principles = [
  { icon: Code2, title: "Engineer by craft", text: "Software design across web, mobile and APIs, owned end to end." },
  { icon: Workflow, title: "Product-minded", text: "Agile delivery, team and product management, client to launch." },
  { icon: Bot, title: "AI in the loop", text: "RAG pipelines, LLM agents and MCP integrations that do real work." },
];

const topSkills = ["Engineering", "Software Design", "Agile", "Team Management", "Product Management"];

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 py-24 md:py-36">
      <div className="container-x">
        <SectionHeader
          index="01"
          label="About"
          aside={profile.tagline}
          title={
            <>
              Code to evolve,
              <br />
              <span className="text-muted">innovate to assist.</span>
            </>
          }
        />

        <div className="grid gap-4 md:grid-cols-6">
          <motion.div {...reveal()} className="rounded-3xl border border-line bg-surface p-8 md:col-span-4 md:p-12">
            <p className="font-display text-2xl font-medium leading-[1.3] tracking-tight md:text-[34px]">
              I bridge the gap between client expectations and successful product delivery,{" "}
              <span className="text-accent">turning business requirements into reliable software.</span>
            </p>
            <p className="mt-8 max-w-2xl text-base leading-7 text-muted">
              Full-stack developer with 3+ years building web and mobile applications in JavaScript, TypeScript,
              React, Next.js, Node.js and Python. I care about performance and query optimization, background
              scheduling, real-time systems and AI/RAG-based applications, and I share what I build with a growing
              community on LinkedIn.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {topSkills.map((skill) => (
                <span key={skill} className="rounded-full border border-line px-3 py-1 text-xs text-white/70">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...reveal(0.1)}
            className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-accent p-8 md:col-span-2"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-white/10" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">Currently</span>
            <div className="mt-16">
              <p className="font-display text-4xl font-bold uppercase leading-none tracking-tight">Greenmint Labs</p>
              <p className="mt-3 text-sm text-white/80">Full-Stack Developer · Since Apr 2025</p>
            </div>
          </motion.div>

          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              {...reveal(0.1 + i * 0.08)}
              className="group rounded-3xl border border-line bg-surface p-7 transition-colors hover:border-accent/40 md:col-span-2"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-transform duration-300 group-hover:-rotate-6">
                <p.icon size={20} />
              </div>
              <h3 className="mt-10 font-display text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{p.text}</p>
            </motion.div>
          ))}

          <motion.div
            {...reveal(0.15)}
            className="relative overflow-hidden rounded-3xl border border-line bg-surface md:col-span-2 md:row-span-1"
          >
            <video
              src="/Bug_drinking_typing_202603191651.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full max-h-72 w-full object-cover md:max-h-none"
            />
            <span className="absolute left-4 top-4 rounded-full bg-bg/70 px-3 py-1 font-mono text-[11px] text-white/80 backdrop-blur-md">
              aka Bugholic
            </span>
          </motion.div>

          <motion.div
            {...reveal(0.2)}
            className="flex flex-col justify-between gap-6 rounded-3xl border border-line bg-surface-2 p-7 md:col-span-4"
          >
            <span className="eyebrow">Open to work</span>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="max-w-md font-display text-2xl font-semibold leading-tight tracking-tight">
                On-site, hybrid or remote. Full-time roles and freelance builds.
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-white/80">
                <MapPin size={16} className="text-accent" />
                {profile.location} · GMT +5:30
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
