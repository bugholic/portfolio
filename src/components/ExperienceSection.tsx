import { motion, useReducedMotion } from "motion/react";
import { GraduationCap } from "lucide-react";
import { ExperienceLog } from "./ExperienceLog";
import { PixelCampus } from "./PixelCampus";
import { SectionHeader } from "./SectionHeader";
import { education, experiences } from "../data/profile";

const ease = [0.22, 1, 0.36, 1] as const;

export function ExperienceSection() {
  const reducedMotion = useReducedMotion();
  return (
    <section id="experience" className="scroll-mt-24 py-24 md:py-36">
      <div className="container-x">
        <SectionHeader
          label="Experience"
          aside="2+ years"
          title={[[{ text: "Where I've " }, { text: "shipped", className: "text-accent" }]]}
        />
      </div>

      {reducedMotion ? <ExperienceList /> : <ExperienceLog />}

      <div className="container-x">
        <EducationGrid />
      </div>
    </section>
  );
}

/** Static list for visitors who prefer reduced motion. */
function ExperienceList() {
  return (
    <div className="container-x">
      <div className="border-b border-line">
        {experiences.map((exp, index) => (
          <motion.article
            key={`${exp.company}-${exp.role}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease }}
            className="group relative grid gap-6 border-t border-line py-10 md:grid-cols-12 md:py-14"
          >
            {/* Hover wash */}
            <span className="pointer-events-none absolute inset-0 origin-bottom scale-y-0 bg-surface transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />

            <div className="relative font-mono text-sm text-muted md:col-span-1">0{index + 1}</div>

            <div className="relative md:col-span-4">
              <h3 className="font-display text-3xl font-bold uppercase leading-none tracking-tight transition-colors group-hover:text-accent md:text-5xl">
                {exp.company}
              </h3>
              {exp.previously && <p className="eyebrow mt-3">{exp.previously}</p>}
              <p className="mt-3 text-base text-white/85">
                {exp.role} <span className="text-muted">· {exp.employmentType}</span>
              </p>
              <p className="mt-6 text-sm text-white/85">{exp.duration}</p>
              <p className="mt-1 text-xs text-muted">{exp.location}</p>
            </div>

            <div className="relative md:col-span-7">
              <ul className="space-y-3">
                {exp.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-7 text-white/70">
                    <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function EducationGrid() {
  return (
    <div className="mt-20 grid gap-4 md:grid-cols-12">
      <div className="md:col-span-4">
        <span className="eyebrow inline-flex items-center gap-2">
          <GraduationCap size={14} className="text-accent" />
          Education
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:col-span-8">
        {education.map((ed, index) => (
          <motion.div
            key={ed.degree}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease }}
            className="group overflow-hidden rounded-3xl border border-line bg-surface transition-colors hover:border-accent/40"
          >
            <div className="theme-dark relative border-b border-line bg-[linear-gradient(180deg,#0d1124_0%,#161b30_55%,#1c2133_100%)] px-4 pt-6">
              <span className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-bg/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/75">
                {ed.level}
              </span>
              <div className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
                <PixelCampus scene={ed.scene} />
              </div>
            </div>
            <div className="p-7">
              <p className="font-mono text-xs text-accent">{ed.years}</p>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight">{ed.degree}</h3>
              <p className="mt-2 text-sm text-muted">
                {ed.school} · {ed.location}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
