import { motion } from "motion/react";
import { BriefcaseBusiness, MapPin } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { useScrollParallax } from "../hooks/useScrollParallax";
import { useMagneticEffect } from "../hooks/useMagneticEffect";

const experiences = [
  {
    role: "Full Stack Engineer",
    company: "Softwelve",
    employmentType: "Full-time",
    duration: "Apr 2025 - Present",
    tenure: "1 yr",
    location: "Pune City, Maharashtra, India",
    mode: "Remote",
    summary: "Building full-stack products with a focus on reliable delivery, clean implementation, and practical problem solving.",
    skills: "Engineering, Software Industry + 3 skills",
  },
  {
    role: "Digital Marketing Specialist",
    company: "VellKO Media",
    employmentType: "Full-time",
    duration: "Jul 2023 - Apr 2025",
    tenure: "1 yr 10 mos",
    location: "Bhopal, Madhya Pradesh, India",
    mode: "On-site",
    summary:
      "Worked on campaign analysis and digital marketing execution, turning campaign performance into numbers, reports, and actionable decisions.",
    skills: "Digital Marketing and Digital Direct Marketing",
  },
];

type Experience = (typeof experiences)[number];

function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagneticEffect(0.2);

  return (
    <motion.div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, delay: index * 0.08 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-7 md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,163,255,0.12),transparent_35%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-accent">
            <BriefcaseBusiness size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-white">{experience.role}</h3>
                <p className="mt-1 text-base text-white/70">
                  {experience.company} · {experience.employmentType}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60 md:min-w-[220px]">
                <div>{experience.duration}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
                  {experience.tenure}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/50">
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-accent" />
                {experience.location}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>{experience.mode}</span>
            </div>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/62">{experience.summary}</p>

            <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/60">
              {experience.skills}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ExperienceSection() {
  const { ref, slowY, midY } = useScrollParallax({ slow: 30, mid: 60 });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section ref={ref as any} id="experience" className="relative scroll-mt-28 py-24 px-6 max-w-6xl mx-auto overflow-hidden">
      {/* Parallax depth layers */}
      <motion.div
        style={{ y: slowY }}
        className="pointer-events-none absolute -top-12 right-0 h-28 w-28 rounded-full bg-cyan-400/8 blur-3xl"
      />
      <motion.div
        style={{ y: midY }}
        className="pointer-events-none absolute bottom-0 -left-12 h-36 w-36 rounded-full bg-sky-500/8 blur-3xl"
      />

      <SectionHeader
        title="Experience"
        subtitle="Roles across engineering and digital operations, with a steady focus on execution, analysis, and shipping useful work."
      />

      <div className="space-y-6">
        {experiences.map((experience, index) => (
          <ExperienceCard key={`${experience.company}-${experience.role}`} experience={experience} index={index} />
        ))}
      </div>
    </section>
  );
}
