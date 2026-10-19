import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { LucideIcon } from "lucide-react";
import { usePanelScroller } from "./HorizontalScroll";

export type Skill = { icon: LucideIcon; title: string; description: string };

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- geometry ---------- */

type Pt = [number, number];

type Sprout = { x: number; y: number; angle: number };

type TreeLayout = {
  width: number;
  height: number;
  leafW: number;
  leafH: number;
  fontSize: number;
  // Where each leaf hangs, and where its branch leaves the trunk.
  spots: { at: Pt; from: Pt }[];
  // The leaf that sits on top of the leader instead of its own branch.
  leader: number;
  trunk: string;
  trunkWidth: number;
  leaderPath: string;
  leaderWidth: number;
  roots: string[];
  ground: { cx: number; cy: number; rx: number };
  sprouts: (spots: TreeLayout["spots"]) => Sprout[];
};

function controls([sx, sy]: Pt, [ex, ey]: Pt): [Pt, Pt] {
  return [
    [sx + (ex - sx) * 0.35, sy - 18],
    [ex - (ex - sx) * 0.25, ey + (sy - ey) * 0.45],
  ];
}

function branchPath(from: Pt, to: Pt) {
  const [c1, c2] = controls(from, to);
  return `M ${from[0]} ${from[1]} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${to[0]} ${to[1]}`;
}

// Point + tangent angle on the branch's cubic curve.
function pointOn(from: Pt, to: Pt, t: number) {
  const [c1, c2] = controls(from, to);
  const u = 1 - t;
  const x = u ** 3 * from[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * to[0];
  const y = u ** 3 * from[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * to[1];
  const dx = 3 * u * u * (c1[0] - from[0]) + 6 * u * t * (c2[0] - c1[0]) + 3 * t * t * (to[0] - c2[0]);
  const dy = 3 * u * u * (c1[1] - from[1]) + 6 * u * t * (c2[1] - c1[1]) + 3 * t * t * (to[1] - c2[1]);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

const lens = (w: number, h: number) =>
  `M 0 ${h / 2} C ${w * 0.22} ${-h * 0.12}, ${w * 0.78} ${-h * 0.12}, ${w} ${h / 2} C ${w * 0.78} ${h * 1.12}, ${w * 0.22} ${h * 1.12}, 0 ${h / 2} Z`;

// Wide canopy for desktop (viewBox 1200 x 760).
const wideTree: TreeLayout = {
  width: 1200,
  height: 760,
  leafW: 214,
  leafH: 58,
  fontSize: 14.5,
  spots: [
    { at: [150, 440], from: [594, 590] },
    { at: [250, 300], from: [594, 530] },
    { at: [340, 165], from: [598, 400] },
    { at: [470, 330], from: [596, 470] },
    { at: [600, 72], from: [600, 300] },
    { at: [730, 330], from: [604, 470] },
    { at: [860, 165], from: [602, 400] },
    { at: [950, 300], from: [606, 530] },
    { at: [1050, 440], from: [606, 590] },
  ],
  leader: 4,
  trunk: "M 600 724 C 596 640, 606 560, 600 470",
  trunkWidth: 34,
  leaderPath: "M 600 480 C 604 380, 596 220, 600 100",
  leaderWidth: 16,
  roots: ["M 600 720 C 580 728, 540 736, 500 738", "M 600 720 C 622 730, 660 736, 705 737", "M 600 718 C 596 730, 590 740, 572 746"],
  ground: { cx: 600, cy: 726, rx: 300 },
  sprouts: (spots) =>
    spots.flatMap(({ at, from }, i) =>
      [0.42, 0.68].map((t, k) => {
        const p = pointOn(from, at, t);
        return { x: p.x, y: p.y, angle: p.angle + ((i + k) % 2 === 0 ? -50 : 50) };
      }),
    ),
};

// Tall sapling for phones (viewBox 320 x 640, close to the real pixel width so
// text stays readable): leaves alternate up the stem.
const MOBILE_ROWS = Array.from({ length: 8 }, (_, k) => ({ y: 116 + k * 60, left: k % 2 === 0 }));

const tallTree: TreeLayout = {
  width: 320,
  height: 640,
  leafW: 150,
  leafH: 54,
  fontSize: 13,
  spots: [
    { at: [160, 42], from: [160, 300] },
    ...MOBILE_ROWS.map(({ y, left }) => ({
      at: [left ? 82 : 238, y] as Pt,
      from: [left ? 158 : 162, y + 36] as Pt,
    })),
  ],
  leader: 0,
  trunk: "M 160 606 C 157 550, 163 490, 160 430",
  trunkWidth: 20,
  leaderPath: "M 160 440 C 163 330, 157 180, 160 66",
  leaderWidth: 10,
  roots: ["M 160 602 C 146 610, 124 615, 100 617", "M 160 602 C 175 611, 198 615, 222 616", "M 160 600 C 158 612, 154 619, 144 624"],
  ground: { cx: 160, cy: 608, rx: 120 },
  // little leaves poke out of the stem on the side opposite each skill leaf
  sprouts: () => MOBILE_ROWS.map(({ y, left }) => ({ x: 160, y: y - 4, angle: left ? -35 : -145 })),
};

// Break a title over two lines when it would not fit inside the leaf.
function titleLines(title: string, room: number, fontSize: number) {
  if (title.length * fontSize * 0.58 <= room) return [title];
  const words = title.split(" ");
  let best = [title];
  let bestLen = Infinity;
  for (let i = 1; i < words.length; i++) {
    const lines = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const len = Math.max(...lines.map((l) => l.length));
    if (len < bestLen) [best, bestLen] = [lines, len];
  }
  return best;
}

/* ---------- scroll-driven growth ---------- */

/*
 * Growth is a single 0 -> 1 value that every stem, branch and leaf reads with
 * its own slice of the timeline, so new wood appears as you scroll instead of
 * on a timer. On desktop the panel pins the tree to the viewport for ~130vh, so
 * the tree is always fully grown before the panel slides sideways; on phones
 * the same value is animated once when the tree scrolls into view.
 */

type Growth = MotionValue<number>;

const GROW_START = 0.06;
const GROW_END = 0.86;

const WINDOWS = {
  ground: [0, 0.05],
  roots: [0.02, 0.13],
  trunk: [0.06, 0.24],
  leader: [0.22, 0.42],
  branchLead: 0.38,
  branchStep: 0.021,
  branchDur: 0.15,
  sproutLead: 0.44,
  sproutStep: 0.012,
  sproutDur: 0.13,
  leafLead: 0.46,
  leafStep: 0.026,
  leafDur: 0.2,
} as const;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

/** Map the shared growth value through this element's slice of the timeline. */
function useGrowthWindow(growth: Growth, from: number, to: number) {
  return useTransform(growth, [from, to], [0, 1], { clamp: true });
}

function GrowPath({
  growth,
  from,
  to,
  d,
  stroke,
  strokeWidth,
  transform,
  style,
}: {
  growth: Growth;
  from: number;
  to: number;
  d: string;
  stroke: string;
  strokeWidth: number;
  transform?: string;
  style?: CSSProperties;
}) {
  const drawn = useGrowthWindow(growth, from, to);
  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
      transform={transform}
      style={{ ...style, pathLength: drawn } as CSSProperties}
    />
  );
}

function Branch({
  growth,
  index,
  from,
  to,
  stroke,
  strokeWidth,
}: {
  growth: Growth;
  index: number;
  from: Pt;
  to: Pt;
  stroke: string;
  strokeWidth: number;
}) {
  const start = WINDOWS.branchLead + index * WINDOWS.branchStep;
  const drawn = useGrowthWindow(growth, start, start + WINDOWS.branchDur);
  return (
    <motion.path
      d={branchPath(from, to)}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      fill="none"
      style={{ transition: "stroke 300ms", pathLength: drawn } as CSSProperties}
    />
  );
}

function Sprout({
  growth,
  index,
  sprout,
}: {
  growth: Growth;
  index: number;
  sprout: Sprout;
}) {
  const start = WINDOWS.sproutLead + index * WINDOWS.sproutStep;
  const grown = useGrowthWindow(growth, start, start + WINDOWS.sproutDur);
  return (
    <g transform={`translate(${sprout.x} ${sprout.y}) rotate(${sprout.angle})`}>
      <motion.path
        d={lens(26, 12)}
        transform="translate(0 -6)"
        fill={index % 2 ? "rgba(61,107,255,0.6)" : "rgba(61,107,255,0.35)"}
        style={{ originX: 0, originY: 0.5, scale: grown }}
      />
    </g>
  );
}

function SkillLeaf({
  growth,
  index,
  spot,
  skill,
  active,
  onActive,
  layout,
}: {
  growth: Growth;
  index: number;
  spot: { at: Pt; from: Pt };
  skill: Skill;
  active: boolean;
  onActive: () => void;
  layout: TreeLayout;
}) {
  const { leafW, leafH, fontSize } = layout;
  const start = WINDOWS.leafLead + index * WINDOWS.leafStep;
  const grown = useGrowthWindow(growth, start, start + WINDOWS.leafDur);
  const rotate = useTransform(grown, [0, 1], [-18, 0]);

  const Icon = skill.icon;
  const iconSize = fontSize + 3.5;
  const textX = leafW * 0.14 + iconSize + 7;
  const lines = titleLines(skill.title, leafW - textX - 6, fontSize);
  const lineH = fontSize * 1.15;

  return (
    <g
      transform={`translate(${spot.at[0] - leafW / 2} ${spot.at[1] - leafH / 2})`}
      role="listitem"
      tabIndex={0}
      aria-label={`${skill.title}: ${skill.description}`}
      onMouseEnter={onActive}
      onFocus={onActive}
      onClick={onActive}
      className="cursor-pointer outline-none"
    >
      <motion.g style={{ originX: 0.5, originY: 0.5, scale: grown, rotate, opacity: grown }}>
        <g className="leaf-sway" style={{ animationDelay: `${(index % 4) * -1.1}s` }}>
          <path
            d={lens(leafW, leafH)}
            fill={active ? "#3d6bff" : "#1d2130"}
            stroke={active ? "#5a82ff" : "rgba(61,107,255,0.45)"}
            strokeWidth="1.5"
            style={{ transition: "fill 300ms, stroke 300ms" }}
          />
          <path
            d={`M 14 ${leafH / 2} Q ${leafW / 2} ${leafH / 2 + 5}, ${leafW - 10} ${leafH / 2}`}
            stroke={active ? "rgba(255,255,255,0.25)" : "rgba(61,107,255,0.18)"}
            strokeWidth="1"
            fill="none"
          />
          <Icon
            x={leafW * 0.14}
            y={leafH / 2 - iconSize / 2}
            width={iconSize}
            height={iconSize}
            color={active ? "#ffffff" : "#5a82ff"}
            strokeWidth={2}
          />
          <text
            x={textX}
            y={leafH / 2 + fontSize / 3 - ((lines.length - 1) * lineH) / 2}
            className="font-sans"
            fontSize={fontSize}
            fontWeight="600"
            fill="#ffffff"
          >
            {lines.map((line, k) => (
              <tspan key={line} x={textX} dy={k ? lineH : 0}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      </motion.g>
    </g>
  );
}

function TreeCanvas({
  layout,
  skills,
  active,
  onActive,
  growth,
  className,
}: {
  layout: TreeLayout;
  skills: Skill[];
  active: number;
  onActive: (i: number) => void;
  growth: Growth;
  className?: string;
}) {
  const { width, height } = layout;
  const spots = layout.spots.slice(0, skills.length);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`h-auto w-full overflow-visible ${className ?? ""}`}
      role="list"
      aria-label="Skill tree"
    >
      {/* ground */}
      <ellipse cx={layout.ground.cx} cy={layout.ground.cy} rx={layout.ground.rx} ry="16" fill="rgba(61,107,255,0.08)" />
      <GrowPath
        growth={growth}
        from={WINDOWS.ground[0]}
        to={WINDOWS.ground[1]}
        d={`M ${layout.ground.cx - layout.ground.rx * 0.9} ${layout.ground.cy} L ${layout.ground.cx + layout.ground.rx * 0.9} ${layout.ground.cy}`}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={2}
      />

      {/* roots */}
      {layout.roots.map((d, i) => (
        <GrowPath
          key={d}
          growth={growth}
          from={WINDOWS.roots[0]}
          to={WINDOWS.roots[1]}
          d={d}
          stroke="#2c2f37"
          strokeWidth={6 - i}
        />
      ))}

      {/* trunk + leader */}
      <GrowPath
        growth={growth}
        from={WINDOWS.trunk[0]}
        to={WINDOWS.trunk[1]}
        d={layout.trunk}
        stroke="#2c2f37"
        strokeWidth={layout.trunkWidth}
      />
      <GrowPath
        growth={growth}
        from={WINDOWS.trunk[0]}
        to={WINDOWS.trunk[1]}
        d={layout.trunk}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={layout.trunkWidth / 5}
        transform={`translate(${-layout.trunkWidth / 4} 0)`}
      />
      <GrowPath
        growth={growth}
        from={WINDOWS.leader[0]}
        to={WINDOWS.leader[1]}
        d={layout.leaderPath}
        stroke="#2c2f37"
        strokeWidth={layout.leaderWidth}
      />

      {/* branches */}
      {spots.map(({ at, from }, i) =>
        i === layout.leader ? null : (
          <Branch
            key={`branch-${i}`}
            growth={growth}
            index={i}
            from={from}
            to={at}
            stroke={active === i ? "#3d6bff" : "#2c2f37"}
            strokeWidth={layout.leaderWidth * (from[1] > height * 0.66 ? 0.7 : 0.58)}
          />
        ),
      )}

      {/* little leaves sprouting along the wood */}
      {layout.sprouts(spots).map((sprout, k) => (
        <Sprout key={k} growth={growth} index={k} sprout={sprout} />
      ))}

      {/* skill leaves */}
      {spots.map((spot, i) => {
        const skill = skills[i];
        if (!skill) return null;
        return (
          <SkillLeaf
            key={skill.title}
            growth={growth}
            index={i}
            spot={spot}
            skill={skill}
            active={active === i}
            onActive={() => onActive(i)}
            layout={layout}
          />
        );
      })}
    </svg>
  );
}

function ActiveSkill({ skill, hint, aside }: { skill: Skill; hint: string; aside?: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow">{hint}</span>
        {aside}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={skill.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease }}
        >
          <p className="mt-3 font-display text-2xl font-semibold tracking-tight">{skill.title}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{skill.description}</p>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export function SkillTree({ skills }: { skills: Skill[] }) {
  const [active, setActive] = useState(0);
  const runway = useRef<HTMLDivElement>(null);
  const panel = usePanelScroller();
  const pinned = panel !== null;
  const reducedMotion = useReducedMotion();
  const growth = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    container: panel ?? undefined,
    target: runway,
    offset: ["start start", "end end"],
  });

  // Desktop: growth follows the panel's own scroll position.
  useEffect(() => {
    if (!pinned || reducedMotion) return;
    const apply = (value: number) => {
      growth.set(smoothstep(clamp01((value - GROW_START) / (GROW_END - GROW_START))));
    };
    apply(scrollYProgress.get());
    return scrollYProgress.on("change", apply);
  }, [pinned, reducedMotion, scrollYProgress, growth]);

  // Phones: one-shot growth when the tree scrolls into view.
  const inView = useInView(runway, { once: true, amount: 0.3 });
  useEffect(() => {
    if (pinned || reducedMotion || !inView) return;
    const controls = animate(growth, 1, { duration: 2.2, ease });
    return () => controls.stop();
  }, [pinned, reducedMotion, inView, growth]);

  useEffect(() => {
    if (reducedMotion) growth.set(1);
  }, [reducedMotion, growth]);

  const current = skills[active];
  const counter = (
    <span className="eyebrow">
      <span className="text-accent">{String(active + 1).padStart(2, "0")}</span> / {String(skills.length).padStart(2, "0")}
    </span>
  );

  return (
    <div ref={runway} className="relative md:h-[230vh]">
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:items-center">
        <div className="relative w-full overflow-hidden rounded-3xl border border-line bg-surface p-5 md:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_50%_40%,black_20%,transparent_75%)]" />
          <div className="pointer-events-none absolute left-1/2 top-[30%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(61,107,255,0.22),transparent)]" />

          <div className="relative hidden lg:block">
            <TreeCanvas
              layout={wideTree}
              skills={skills}
              active={active}
              onActive={setActive}
              growth={growth}
              className="max-h-[74svh]"
            />
            <div className="pointer-events-none absolute bottom-0 left-0 max-w-[300px]">
              <ActiveSkill skill={current} hint="Hover a leaf" />
            </div>
            <div className="absolute bottom-0 right-0">{counter}</div>
          </div>

          <div className="relative mx-auto max-w-sm lg:hidden">
            <TreeCanvas
              layout={tallTree}
              skills={skills}
              active={active}
              onActive={setActive}
              growth={growth}
              className="md:max-h-[50svh]"
            />
            <div className="mt-6 border-t border-line pt-5">
              <ActiveSkill skill={current} hint="Tap a leaf" aside={counter} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
