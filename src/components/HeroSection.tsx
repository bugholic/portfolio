import { motion } from "motion/react";
import { Terminal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="h-screen flex flex-col items-center justify-center relative px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-12 relative"
      >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent/20 blur-3xl absolute inset-0 -z-10" />
        <div className="w-20 h-20 md:w-24 md:h-24 border border-accent/30 rounded-2xl flex items-center justify-center bg-bg/50 backdrop-blur-sm rotate-12">
          <Terminal className="text-accent" size={40} />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-7xl md:text-[120px] font-bold tracking-[-0.04em] mb-8 text-center leading-none"
      >
        BUGHOLIC
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="text-white/40 max-w-xl text-center text-lg md:text-xl leading-relaxed mb-12"
      >
        Architecting robust full-stack solutions with{" "}
        <span className="text-accent italic">surgical precision</span> and minimalist design principles.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent" />
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll to Explore</span>
      </motion.div>

      <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between items-center font-mono text-[9px] tracking-widest text-white/20 uppercase">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System: Nominal
          </span>
          <span>Latency: 14ms</span>
          <span className="hidden md:inline">Loc: 40.7128° N, 74.0060° W</span>
        </div>
        <div className="hidden md:block">© 2026 BUGHOLIC ENGINEERING</div>
      </div>
    </section>
  );
}
