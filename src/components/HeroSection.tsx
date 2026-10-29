import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDownRight, Download } from "lucide-react";
import { useScrollParallax } from "../hooks/useScrollParallax";
import { profile } from "../data/profile";
import { HeroPortrait } from "./HeroPortrait";
import { LetterField, type PhraseChar } from "./LetterField";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "3", suffix: "+", label: "Years building" },
  { value: "5", suffix: "+", label: "Products shipped" },
  { value: "80", suffix: "%", label: "Faster page loads" },
];

// Each highlight is two lines: plain ink on top, royal blue below
const highlights = [
  ["Full-Stack", "Developer"],
  ["Project", "Management"],
  ["Client", "Relationships"],
  ["AI", "Integration"],
  ["Product", "Delivery"],
];

const ROTATE_MS = 3000;

// Every character of both lines, in reading order, each tagged with its line
const phrases: PhraseChar[][] = highlights.map(([top, bottom]) => [
  ...[...top.toUpperCase()].map((char) => ({ char, line: 0 as const })),
  ...[...bottom.toUpperCase()].map((char) => ({ char, line: 1 as const })),
]);

// Sized so the longest word (RELATIONSHIPS) clears the portrait column on desktop and fits phones
const headingType =
  "font-display text-[clamp(2.25rem,11vw,6rem)] lg:text-[clamp(5rem,7.2vw,8.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em]";

export function HeroSection() {
  const { ref } = useScrollParallax({ slow: 40 });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const slots = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % highlights.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const [top, bottom] = highlights[index];
  // Flat letter index across both lines, matching the order in `phrases`
  let slot = 0;
  const line = (text: string, tone: string) => (
    <span className={`flex whitespace-nowrap ${tone}`}>
      {[...text.toUpperCase()].map((char) => {
        const i = slot++;
        return (
          <span key={i} ref={(el) => { slots.current[i] = el; }} className="inline-block">
            {char}
          </span>
        );
      })}
    </span>
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section ref={ref as any} className="relative overflow-hidden pt-28 md:pt-32">
      {/* Soft blue glow on the grey canvas */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(65,105,225,0.16),transparent)]" />

      {!reduce && (
        <LetterField phrases={phrases} index={index} container={ref} targets={slots} className={headingType} />
      )}

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
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Available for freelance
          </span>
          <span className="eyebrow">{profile.role}</span>
          <span className="eyebrow hidden sm:block">Based in {profile.location}</span>
        </motion.div>

        {/* Rotating highlights: the name stays in the heading for search and screen readers */}
        <h1 className="relative select-none py-6 md:py-10">
          <span className="sr-only">{profile.name}: {highlights.map((h) => h.join(" ")).join(", ")}</span>
          <span aria-hidden className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-muted">
            <span className="text-signal">{String(index + 1).padStart(2, "0")}</span>
            <span className="relative h-px w-16 overflow-hidden bg-line">
              <motion.span
                key={index}
                className="absolute inset-y-0 left-0 bg-signal"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
              />
            </span>
            <span>{String(highlights.length).padStart(2, "0")}</span>
          </span>
          {/* Hidden layout the flying letters land on; shown as-is when motion is reduced */}
          <span aria-hidden className={`relative block ${headingType}`}>
            <span className={reduce ? "" : "invisible"}>
              {line(top, "text-white")}
            </span>
            <span className="flex items-end gap-[0.12em]">
              <span className={reduce ? "" : "invisible"}>{line(bottom, "text-accent")}</span>
              <motion.span
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: reduce ? 0 : 1.1, ease }}
                className="mb-[0.12em] inline-block h-[0.14em] w-[0.14em] shrink-0 rounded-full bg-signal"
              />
            </span>
          </span>
        </h1>

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
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-signal"
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
                    <span className="text-signal">{s.suffix}</span>
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
