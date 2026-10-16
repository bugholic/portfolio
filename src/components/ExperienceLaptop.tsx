import { motion, useMotionTemplate, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { usePanelScroller } from "./HorizontalScroll";
import { experiences } from "../data/profile";

/*
 * A laptop pinned to the viewport while its runway scrolls past. Scroll
 * progress drives everything (no timed animation): the lid opens, the screen
 * powers on, each role takes the screen in turn, then the lid shuts again
 * before the page moves on.
 */

type Experience = (typeof experiences)[number];

const OPEN_END = 0.16;
const SCREEN_ON: [number, number] = [0.13, 0.2];
const SLIDES: [number, number] = [0.2, 0.82];
const SCREEN_OFF: [number, number] = [0.82, 0.86];
const CLOSE: [number, number] = [0.85, 0.99];
const FADE = 0.035;

const LID_CLOSED = -87;
const LID_OPEN = 6;

const slideWindow = (index: number, count: number) => {
  const span = (SLIDES[1] - SLIDES[0]) / count;
  return [SLIDES[0] + span * index, SLIDES[0] + span * (index + 1)] as const;
};

const slug = (company: string) => company.toLowerCase().replace(/\s+/g, "-");

export function ExperienceLaptop() {
  const runway = useRef<HTMLDivElement>(null);
  const container = usePanelScroller() ?? undefined;
  const { scrollYProgress } = useScroll({ container, target: runway, offset: ["start start", "end end"] });
  // A little smoothing so wheel steps don't make the lid stutter.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  const count = experiences.length;

  const lid = useTransform(progress, [0, OPEN_END, CLOSE[0], CLOSE[1]], [LID_CLOSED, LID_OPEN, LID_OPEN, LID_CLOSED]);
  const lidTransform = useMotionTemplate`rotateX(${lid}deg)`;
  const scale = useTransform(progress, [0, OPEN_END, CLOSE[0], 1], [0.82, 1, 1, 0.86]);
  const tilt = useTransform(progress, [0, OPEN_END, CLOSE[0], 1], [-46, -22, -22, -40]);
  const laptopTransform = useMotionTemplate`rotateX(${tilt}deg) scale(${scale})`;
  const screenPower = useTransform(progress, [SCREEN_ON[0], SCREEN_ON[1], SCREEN_OFF[0], SCREEN_OFF[1]], [0, 1, 1, 0]);
  const glow = useTransform(screenPower, [0, 1], [0, 0.55]);
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  return (
    <div ref={runway} className="relative" style={{ height: `${(count + 2) * 100}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-clip px-4">
        {/* Desk glow from the screen */}
        <motion.div
          aria-hidden
          style={{ opacity: glow }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/40 blur-[120px]"
        />

        <div className="relative w-full max-w-[880px] -translate-y-[12vh]" style={{ perspective: "3000px", perspectiveOrigin: "50% 20%" }}>
          <motion.div className="relative mx-auto w-[min(88vw,760px)]" style={{ transformStyle: "preserve-3d", transform: laptopTransform }}>
            {/* Lid: hinged on its bottom edge, screen on the front, cover on the back */}
            <motion.div
              className="relative aspect-[10/9.5] w-full origin-bottom sm:aspect-[16/10.4]"
              style={{ transformStyle: "preserve-3d", transform: lidTransform }}
            >
              <div
                className="absolute inset-0 rounded-[18px] border border-[#3a3d45] bg-[#0b0c0f] p-[1.6%] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]"
                style={{ backfaceVisibility: "hidden" }}
              >
                <span className="absolute left-1/2 top-[0.7%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1e2128] ring-1 ring-[#2c3038]" />
                <div className="theme-dark relative h-full w-full overflow-hidden rounded-[8px] bg-[#0d0f14]">
                  <motion.div style={{ opacity: screenPower }} className="absolute inset-0">
                    <Screen progress={progress} />
                  </motion.div>
                  {/* Glass sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,transparent_38%)]" />
                </div>
              </div>
              <div
                className="absolute inset-0 grid place-items-center rounded-[18px] border border-[#9aa0aa] bg-[linear-gradient(160deg,#d9dce2_0%,#b7bcc6_55%,#a3a9b4_100%)]"
                style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
              >
                <span className="font-display text-2xl font-bold tracking-tight text-[#7d838f] md:text-4xl">AV</span>
              </div>
            </motion.div>

            {/* Base: keyboard deck lying flat toward the viewer */}
            <div
              className="absolute left-[-4%] top-full h-0 w-[108%] origin-top"
              style={{ transformStyle: "preserve-3d", transform: "rotateX(90deg)" }}
            >
              <div className="aspect-[16/9.6] w-full rounded-b-[22px] rounded-t-[6px] border border-[#9aa0aa] bg-[linear-gradient(180deg,#c9cdd4_0%,#b4b9c2_100%)] p-[4%]">
                <div className="grid h-[52%] grid-cols-[repeat(14,1fr)] gap-[0.5%] rounded-[6px] bg-[#2a2d33] p-[1.2%]">
                  {Array.from({ length: 14 * 5 }, (_, i) => (
                    <span key={i} className="rounded-[2px] bg-[#16181c]" />
                  ))}
                </div>
                <div className="mx-auto mt-[5%] h-[34%] w-[42%] rounded-[8px] border border-[#a2a7b1] bg-[#bfc3cb]" />
              </div>
            </div>
            {/* Front lip of the base, seen edge-on */}
            <div className="absolute left-[-4%] top-full h-[10px] w-[108%] rounded-b-[14px] bg-[linear-gradient(180deg,#a9aeb8,#7e848f)]" />
          </motion.div>
        </div>

        <Progress progress={progress} />

        <motion.p style={{ opacity: hintOpacity }} className="eyebrow absolute left-1/2 top-32 -translate-x-1/2 whitespace-nowrap">
          Scroll to open
        </motion.p>
      </div>
    </div>
  );
}

function Screen({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="flex h-full flex-col text-white">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-3 py-2 md:px-4 md:py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57] md:h-2.5 md:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e] md:h-2.5 md:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#28c840] md:h-2.5 md:w-2.5" />
        <span className="ml-3 truncate font-mono text-[9px] text-white/45 md:text-[11px]">~/aayush/experience</span>
      </div>
      <div className="relative flex-1">
        {experiences.map((exp, index) => (
          <Slide key={`${exp.company}-${exp.role}`} exp={exp} index={index} progress={progress} />
        ))}
      </div>
    </div>
  );
}

function Slide({ exp, index, progress }: { exp: Experience; index: number; progress: MotionValue<number> }) {
  const count = experiences.length;
  const [start, end] = slideWindow(index, count);
  const first = index === 0;
  const last = index === count - 1;
  // The first slide is already up when the screen powers on; the last holds until it powers off.
  const inStart = first ? start - 0.01 : start - FADE;
  const outEnd = last ? 1.01 : end + FADE;
  const opacity = useTransform(progress, [inStart, first ? start : start + FADE, last ? 1 : end - FADE, outEnd], [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, [inStart, first ? start : start + FADE, last ? 1 : end - FADE, outEnd], [first ? 0 : 40, 0, 0, last ? 0 : -40]);
  const fill = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.article style={{ opacity, y }} className="absolute inset-0 flex flex-col p-4 sm:p-6 md:p-9">
      <div className="flex items-center justify-between font-mono text-[9px] text-white/45 md:text-[11px]">
        <span>
          <span className="text-accent">$</span> cat {slug(exp.company)}.md
        </span>
        <span>
          0{index + 1} / 0{count}
        </span>
      </div>

      <h3 className="mt-3 font-display text-[clamp(1.4rem,4.6vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-tight md:mt-5">
        {exp.company}
      </h3>
      <p className="mt-1.5 text-[11px] text-white/80 sm:text-sm md:mt-2 md:text-base">
        {exp.role} <span className="text-white/45">· {exp.employmentType}</span>
        {exp.previously && <span className="text-white/45"> · {exp.previously}</span>}
      </p>
      <p className="mt-1 font-mono text-[9px] text-accent sm:text-[11px] md:text-xs">
        {exp.duration} · {exp.location}
      </p>

      <ul className="mt-3 space-y-1.5 md:mt-6 md:space-y-2.5">
        {exp.highlights.map((item, i) => (
          <li
            key={item}
            className={`gap-2.5 text-[10px] leading-[1.45] text-white/70 sm:text-xs md:text-[14px] md:leading-6 ${i > 1 ? "hidden sm:flex" : "flex"}`}
          >
            <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent md:h-1.5 md:w-1.5" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
        {exp.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-white/12 px-2 py-0.5 text-[9px] text-white/65 md:px-3 md:py-1 md:text-xs">
            {tag}
          </span>
        ))}
      </div>

      {/* Read-progress for this role */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5">
        <motion.div style={{ scaleX: fill }} className="h-full origin-left bg-accent" />
      </div>
    </motion.article>
  );
}

function Progress({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3">
      {experiences.map((exp, index) => (
        <ProgressDot key={exp.company} index={index} progress={progress} />
      ))}
    </div>
  );
}

function ProgressDot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const [start, end] = slideWindow(index, experiences.length);
  const fill = useTransform(progress, [start, end], [0, 1]);
  return (
    <span className="h-1 w-10 overflow-hidden rounded-full bg-line md:w-14">
      <motion.span style={{ scaleX: fill }} className="block h-full origin-left bg-accent" />
    </span>
  );
}
