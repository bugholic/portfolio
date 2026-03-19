import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";
import { useScrollParallax } from "../hooks/useScrollParallax";

const highlights = [
  { label: "Based in", value: "Pune, India" },
  { label: "Currently", value: "FSE @ Softwelve" },
  { label: "Also into", value: "Tech content creation" },
];

export function AboutSection() {
  const { ref, slowY, midY, fastY } = useScrollParallax({ slow: 25, mid: 50, fast: 80 });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section ref={ref as any} id="about" className="relative scroll-mt-28 py-32 px-6 max-w-5xl mx-auto overflow-hidden">
      {/* Parallax depth layers */}
      <motion.div
        style={{ y: slowY }}
        className="pointer-events-none absolute -top-8 -left-16 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl"
      />
      <motion.div
        style={{ y: midY }}
        className="pointer-events-none absolute -bottom-8 -right-16 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl"
      />
      <motion.div
        style={{ y: fastY }}
        className="pointer-events-none absolute top-1/2 -right-8 h-16 w-16 rounded-full bg-blue-400/15 blur-2xl"
      />

      <SectionHeader title="About Me" subtitle="Builder by nature. Engineer by craft. Content creator by choice." />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 backdrop-blur-sm"
      >
        <p className="text-lg md:text-2xl leading-relaxed text-white/75">
          I'm a full-stack engineer who cares about the whole thing — the interface, the API, the
          automation behind it, and whether it actually solves the problem. I've worked across marketing
          ops, digital campaigns, and production software, which gives me an unusual perspective: I
          understand what ships and what sells.
        </p>
        <p className="mt-6 text-base md:text-lg leading-relaxed text-white/50">
          Outside of code I create tech content, break down tools and workflows, and explore how software
          can make everyday work less painful. Practical over perfect — always.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 border-t border-white/8 pt-8">
          {highlights.map((h) => (
            <div key={h.label}>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">{h.label}</div>
              <div className="mt-2 text-sm font-medium text-white/75">{h.value}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
