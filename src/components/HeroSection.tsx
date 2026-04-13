import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, BriefcaseBusiness, Sparkles } from "lucide-react";
import { useScrollParallax } from "../hooks/useScrollParallax";

export function HeroSection() {
  const { ref: sectionRef, slowY, midY } = useScrollParallax({ slow: 20, mid: 40 });

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 100, damping: 20 });
  const rotateY = useSpring(rawRotateY, { stiffness: 100, damping: 20 });

  const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  useEffect(() => {
    if (isTouch) return;
    const section = sectionRef.current;
    if (!section) return;

    function handleMouseMove(e: MouseEvent) {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      rawRotateX.set(-y * 4);
      rawRotateY.set(x * 6);
    }

    function handleMouseLeave() {
      rawRotateX.set(0);
      rawRotateY.set(0);
    }

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section ref={sectionRef as any} className="relative min-h-screen overflow-hidden px-6 pt-28 pb-14 md:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.12),transparent_22%),radial-gradient(circle_at_80%_25%,rgba(16,185,129,0.08),transparent_18%),linear-gradient(180deg,rgba(5,8,22,0.03)_0%,rgba(5,8,22,0.46)_56%,rgba(4,6,15,0.84)_100%)]" />

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="max-w-3xl">
          <motion.div style={{ y: slowY }}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white/60 backdrop-blur-xl"
            >
              <Sparkles size={12} className="text-accent" />
              Full Stack Engineer · Available
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="mt-6 font-mono text-sm tracking-[0.18em] text-white/40 uppercase"
            >
              Hi, I'm Ayush —
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.14 }}
              className="mt-3 max-w-4xl text-6xl font-bold leading-[0.92] tracking-[-0.06em] md:text-[104px]"
              style={{
                color: "#f0faff",
                textShadow:
                  "1px 1px 0 rgba(14,165,233,0.5), 2px 2px 0 rgba(14,165,233,0.4), 3px 3px 0 rgba(14,165,233,0.3), 4px 4px 0 rgba(14,165,233,0.2), 5px 5px 0 rgba(14,165,233,0.12), 6px 6px 12px rgba(14,165,233,0.15)",
              }}
            >
              Building Softwares that 
              <span
                className="bg-[linear-gradient(135deg,#f8fdff_0%,#67e8f9_45%,#0ea5e9_100%)] bg-clip-text text-transparent"
                style={{
                  filter: "drop-shadow(0 4px 24px rgba(103,232,249,0.35)) drop-shadow(0 1px 0 rgba(14,165,233,0.6))",
                }}
              >
                bring values.
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22 }}
              className="mt-8 max-w-xl text-base leading-7 text-white/55 md:text-lg"
            >
              Full-stack engineer. React, Node.js, Python — shipping products that move beautifully and solve real problems.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="#projects"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent px-6 py-3 text-sm font-medium text-slate-950 transition-transform duration-300 hover:-translate-y-0.5"
              >
                View Projects
                <ArrowRight size={16} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 backdrop-blur-md transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/10"
              >
                Get in Touch
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: midY }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.42 }}
            className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3"
          >
            {[
              { value: "3+", label: "Years in tech" },
              { value: "60fps", label: "Performance goal" },
              { value: "Remote", label: "Available now" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">{item.value}</div>
                <div className="mt-2 text-sm text-white/50">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="hidden lg:flex lg:justify-end"
        >
          <div className="w-full max-w-sm rounded-[32px] border border-white/10 bg-black/25 p-5 backdrop-blur-2xl">
            <div className="mb-5 overflow-hidden rounded-[24px] border border-white/10 bg-black/30">
              <video
                src="/Bug_drinking_typing_202603191651.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="h-[320px] w-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/35">Currently</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Ayush · FSE @ Softwelve</h2>
              </div>
              <div className="rounded-2xl border border-accent/20 bg-accent/10 p-3 text-accent">
                <BriefcaseBusiness size={18} />
              </div>
            </div>

            <div className="space-y-4 pt-5">
              {[
                "Full-stack engineer shipping production software at Softwelve.",
                "React, Next.js, Node.js, Python, MongoDB, PostgreSQL — end to end.",
                "Open to freelance projects and new full-time opportunities.",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-mono text-[10px] text-accent">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-6 text-white/55">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-0 z-10 w-full px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 font-mono text-[9px] uppercase tracking-[0.3em] text-white/24 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Render pipeline active
            </span>
            <span>Depth-mapped interface</span>
            <span className="hidden md:inline">Realtime scene composition</span>
          </div>
          <div>Copyright 2026 Bugholic Engineering</div>
        </div>
      </div>
    </section>
  );
}
