import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { experiences, profile } from "../data/profile";

/*
 * Experience as a `git log --format=fuller`: every role is a commit on main,
 * the highlights read as an added diff. Selecting a commit opens it; the panel
 * is plain DOM, so it stays cheap inside the scrolling track.
 */

const ease = [0.22, 1, 0.36, 1] as const;

function shortHash(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

export function ExperienceLog() {
  const [open, setOpen] = useState(0);

  return (
    <div className="container-x">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease }}
        className="theme-dark overflow-hidden rounded-2xl border border-line bg-[#0b0c0f] shadow-[0_40px_100px_-50px_rgba(0,0,0,0.95)]"
      >
        <div className="flex items-center gap-3 border-b border-white/8 bg-white/[0.03] px-4 py-3 md:px-5">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <p className="truncate font-mono text-[11px] text-white/45">aayush@portfolio:~/experience</p>
          <p className="ml-auto hidden font-mono text-[11px] text-white/30 sm:block">git log --oneline --graph</p>
        </div>

        <div>
          {experiences.map((exp, index) => (
            <Commit
              key={exp.company}
              exp={exp}
              index={index}
              total={experiences.length}
              open={open === index}
              onToggle={() => setOpen(index)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-white/8 bg-white/[0.02] px-4 py-3.5 font-mono text-[11px] md:px-5">
          <span className="text-accent">aayush@portfolio</span>
          <span className="text-white/30">:</span>
          <span className="text-accent-hover">~/experience</span>
          <span className="text-white/50">$</span>
          <span className="text-white/70">git status</span>
          <span className="caret inline-block h-3.5 w-1.5 bg-white/70" />
        </div>
      </motion.div>
    </div>
  );
}

type Experience = (typeof experiences)[number];

function Commit({
  exp,
  index,
  total,
  open,
  onToggle,
}: {
  exp: Experience;
  index: number;
  total: number;
  open: boolean;
  onToggle: () => void;
}) {
  const email = profile.email;
  const hash = shortHash(`${exp.company}-${exp.role}`);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-4 px-4 py-5 text-left transition-colors hover:bg-white/[0.02] md:gap-6 md:px-6 md:py-6"
      >
        {/* commit graph gutter */}
        <span className="relative flex w-4 shrink-0 justify-center self-stretch" aria-hidden="true">
          <span className={`w-px self-stretch ${index === total - 1 && !open ? "bg-white/8" : "bg-white/8"}`} />
          <span
            className={`absolute top-1 h-2.5 w-2.5 rounded-full border-2 transition-colors ${
              open ? "border-accent bg-accent" : "border-white/30 bg-[#0b0c0f]"
            }`}
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px]">
            <span className="text-white/35">commit {hash}</span>
            {index === 0 && (
              <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-accent-hover">
                HEAD -&gt; main
              </span>
            )}
            <span className="text-white/30">{exp.duration}</span>
            <span className="hidden text-white/30 sm:inline">{exp.location}</span>
          </span>

          <span className="mt-2.5 block font-display text-xl font-bold uppercase leading-none tracking-tight text-white md:text-3xl">
            {exp.role} <span className="text-accent">@ {exp.company}</span>
          </span>

          {exp.previously && <span className="eyebrow mt-2.5 block text-white/40">{exp.previously}</span>}
        </span>

        <span
          className={`mt-1 shrink-0 font-mono text-[11px] transition-colors ${open ? "text-accent" : "text-white/30"}`}
          aria-hidden="true"
        >
          {open ? "[-]" : "[+]"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-7 md:px-6 md:pb-8 md:pl-[3.25rem]">
              <dl className="grid gap-x-4 gap-y-1.5 font-mono text-[11px] sm:grid-cols-[6.5rem_1fr]">
                <dt className="text-white/30">Author</dt>
                <dd className="text-white/65">
                  {profile.name} &lt;{email}&gt;
                </dd>
                <dt className="text-white/30">Date</dt>
                <dd className="text-white/65">{exp.duration}</dd>
                <dt className="text-white/30">Location</dt>
                <dd className="text-white/65">{exp.location}</dd>
                <dt className="text-white/30">Branch</dt>
                <dd className="text-white/65">main → {exp.employmentType}</dd>
              </dl>

              <ul className="mt-5 space-y-2.5 border-t border-white/8 pt-5">
                {exp.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-[14px] leading-7 text-white/75 md:text-[15px]">
                    <span className="font-mono text-[13px] leading-7 text-accent">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap gap-2">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
