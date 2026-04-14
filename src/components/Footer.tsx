import { motion } from "motion/react";
import { Github, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { useScrollParallax } from "../hooks/useScrollParallax";

export function Footer() {
  const { ref, slowY, midY } = useScrollParallax({ slow: 20, mid: 40 });

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <footer ref={ref as any} id="contact" className="relative overflow-hidden border-t border-white/5">
      {/* Parallax depth layers */}
      <motion.div
        style={{ y: slowY }}
        className="pointer-events-none absolute -top-8 left-1/4 h-24 w-24 rounded-full bg-cyan-400/8 blur-3xl"
      />
      <motion.div
        style={{ y: midY }}
        className="pointer-events-none absolute -bottom-8 right-1/4 h-32 w-32 rounded-full bg-sky-500/8 blur-3xl"
      />

      {/* CTA block */}
      <div className="relative px-8 py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/35 mb-4"
        >
          Let's build something
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
        >
          Got a project in mind?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="text-white/50 max-w-lg mx-auto mb-10 text-base md:text-lg leading-7"
        >
          I'm open to full-time roles, freelance work, and interesting collaborations. Reach out — I reply fast.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://www.linkedin.com/in/ayuv"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent px-6 py-3 text-sm font-medium text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
          >
            Connect on LinkedIn
            <ArrowRight size={16} />
          </a>
          <a
            href="https://github.com/bugholic"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/10"
          >
            <Github size={15} />
            View GitHub
          </a>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5 px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <a href="#" className="flex items-center gap-2 group">
            <img src="/logo/bugholic-logo.png" alt="Bugholic" className="h-7 w-7 object-contain opacity-50 group-hover:opacity-80 transition-opacity" />
            <span className="text-white/25 text-xs tracking-wider font-mono group-hover:text-white/40 transition-colors">© 2026 Bugholic · Aayush</span>
          </a>
          <div className="flex gap-6">
            <a
              href="https://github.com/bugholic"
              target="_blank"
              rel="noreferrer"
              className="text-white/35 hover:text-accent transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              <Github size={13} /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/ayuv"
              target="_blank"
              rel="noreferrer"
              className="text-white/35 hover:text-accent transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              <Linkedin size={13} /> LinkedIn
            </a>
            <a
              href="https://x.com/vaayussh"
              target="_blank"
              rel="noreferrer"
              className="text-white/35 hover:text-accent transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              <Twitter size={13} /> Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
