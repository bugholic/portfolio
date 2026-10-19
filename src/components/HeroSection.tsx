import { motion } from "motion/react";
import { ArrowDownRight, Download } from "lucide-react";
import { useScrollParallax } from "../hooks/useScrollParallax";
import { profile } from "../data/profile";
import { HeroPortrait } from "./HeroPortrait";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "3", suffix: "+", label: "Years building" },
  { value: "5", suffix: "+", label: "Products shipped" },
  { value: "80", suffix: "%", label: "Faster page loads" },
];

const nameLetters = "AAYUSH".split("");

export function HeroSection() {
  const { ref, slowY } = useScrollParallax({ slow: 40 });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section ref={ref as any} className="relative overflow-hidden pt-28 md:pt-32">
      {/* Soft blue glow on the grey canvas */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(61,107,255,0.16),transparent)]" />

      <div className="container-x relative">
        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-white/75">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Available for freelance
          </span>
          <span className="eyebrow">{profile.role}</span>
          <span className="eyebrow hidden sm:block">Based in {profile.location}</span>
        </motion.div>

        {/* Giant name */}
        <motion.h1 style={{ y: slowY }} className="relative select-none" aria-label="Aayush">
          <span className="flex justify-between font-display text-[clamp(5rem,22.5vw,22rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.06em]">
            {nameLetters.map((letter, i) => (
              <span key={i} className="inline-block overflow-hidden pt-[0.06em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.06, ease }}
                >
                  {letter}
                </motion.span>
              </span>
            ))}
          </span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8, ease }}
            className="absolute -right-1 bottom-[8%] h-[3.2vw] w-[3.2vw] min-h-3 min-w-3 rounded-full bg-accent"
          />
        </motion.h1>

        {/* Intro row */}
        <div className="grid gap-10 border-t border-line pt-8 pb-16 md:pb-24 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease }}
            className="lg:col-span-5"
          >
            <p className="font-display text-2xl font-medium leading-[1.25] tracking-tight text-white md:text-[32px]">
              I turn business requirements into actionable plans and ship reliable software, end to end.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                View selected work
                <ArrowDownRight size={16} className="transition-transform group-hover:rotate-[-45deg]" />
              </a>
              <a
                href={profile.cvUrl}
                download
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3.5 text-sm font-medium text-white/85 transition-colors hover:bg-surface-2"
              >
                Download CV
                <Download size={16} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease }}
            className="flex flex-col justify-end lg:col-span-3 lg:col-start-7"
          >
            <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-3xl font-bold tracking-tight text-white">
                    {s.value}
                    <span className="text-accent">{s.suffix}</span>
                  </dt>
                  <dd className="mt-1 text-xs leading-5 text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <div className="relative z-10 lg:col-span-3 lg:col-start-10 lg:-mt-44">
            <HeroPortrait />
          </div>
        </div>
      </div>
    </section>
  );
}
