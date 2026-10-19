import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { profile } from "../data/profile";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * 3D pop-out portrait: a cut-out photo that breaks out of the top of its frame,
 * with layers at different depths that tilt toward the cursor.
 */
export function HeroPortrait() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 140, damping: 16 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [12, -12]), { stiffness: 140, damping: 16 });
  const glowX = useTransform(px, [-0.5, 0.5], ["20%", "80%"]);
  const glowY = useTransform(py, [-0.5, 0.5], ["15%", "85%"]);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <div className="mx-auto w-full max-w-[340px] pt-[42%] lg:pt-[30%] [perspective:1100px]" onPointerMove={handleMove} onPointerLeave={reset}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease }}
        className="theme-dark group relative aspect-[4/5] w-full"
      >
        {/* Layer 0: frame */}
        <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(160deg,#4a76ff_0%,#2a4fd6_45%,#16204a_100%)] shadow-[0_40px_80px_-30px_rgba(61,107,255,0.6)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <motion.div
            style={{ left: glowX, top: glowY }}
            className="absolute h-72 w-72 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,0.28),transparent)]"
          />
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full border-[22px] border-white/10" />
        </div>

        {/* Layer 1: giant initials behind the cut-out */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[8%] select-none text-center font-display text-[150px] font-extrabold leading-none tracking-[-0.06em] text-white/15"
          style={{ transform: "translateZ(30px)" }}
          aria-hidden
        >
          AV
        </div>

        {/* Layer 2: the cut-out, clipped only at the bottom so the head pops out of the frame */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[-34%] overflow-hidden rounded-b-[28px]"
          style={{ transform: "translateZ(70px)" }}
        >
          <motion.img
            src="/images/aayush-ghibli.webp"
            alt={`${profile.name}, illustrated in a hand-painted anime style`}
            initial={{ y: "35%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.9 }}
            className="absolute left-1/2 top-[2%] w-[84%] max-w-none -translate-x-1/2 drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        </div>

        {/* Layer 3: floating badges */}
        {/* depth lives on the wrapper: motion owns the inner element's transform */}
        <div className="absolute -left-2 top-[18%] sm:-left-6" style={{ transform: "translateZ(110px)" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.3, ease }}
            className="rounded-2xl border border-white/10 bg-bg/90 px-3.5 py-2.5"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">Experience</p>
            <p className="font-display text-lg font-bold leading-tight">
              3<span className="text-accent">+</span> yrs
            </p>
          </motion.div>
        </div>

        <div className="absolute -right-2 top-[46%] sm:-right-5" style={{ transform: "translateZ(120px)" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.45, ease }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white px-3 py-2 text-bg shadow-xl"
          >
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-semibold">Open for freelance</span>
          </motion.div>
        </div>

        <div
          className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl border border-white/10 bg-bg/85 px-4 py-3"
          style={{ transform: "translateZ(90px)" }}
        >
          <div>
            <p className="text-sm font-semibold">{profile.name}</p>
            <p className="text-xs text-muted">FSD @ {profile.company}</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Pune</span>
        </div>
      </motion.div>
    </div>
  );
}
