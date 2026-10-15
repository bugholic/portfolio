import { motion } from "motion/react";
import { ArrowDownRight, Download, MousePointerClick } from "lucide-react";
import { profile } from "../data/profile";
import { HeroWorkspace } from "./HeroWorkspace";

const ease = [0.22, 1, 0.36, 1] as const;

const firstName = profile.name.split(" ")[0];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24">
      {/* Soft blue glow on the grey canvas */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]" />

      <div className="container-x relative flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="font-display text-[clamp(2.6rem,7vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.04em]"
        >
          Hi, I'm <span className="text-accent">{firstName}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="mt-4 max-w-xl text-base leading-7 text-muted md:text-lg"
        >
          {profile.role} turning business requirements into reliable web, mobile and AI-powered products.
        </motion.p>

        <div className="mt-10 w-full md:mt-12">
          <HeroWorkspace />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-4 inline-flex items-center gap-2 text-xs text-muted"
        >
          <MousePointerClick size={14} className="text-accent" />
          Hover or tap the objects to interact
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, ease }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
