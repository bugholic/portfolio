import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

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

const BRANCH_START = 0.7;
const LEAF_START = 1.25;

const grow = { initial: { pathLength: 0 }, whileInView: { pathLength: 1 }, viewport: { once: true, amount: 0.25 } };

function TreeCanvas({
  layout,
  skills,
  active,
  onActive,
}: {
  layout: TreeLayout;
  skills: Skill[];
  active: number;
  onActive: (i: number) => void;
}) {
  const { width, height, leafW, leafH, fontSize } = layout;
  const spots = layout.spots.slice(0, skills.length);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible" role="list" aria-label="Skill tree">
      {/* ground */}
      <ellipse cx={layout.ground.cx} cy={layout.ground.cy} rx={layout.ground.rx} ry="16" fill="rgba(61,107,255,0.08)" />
      <motion.path
        d={`M ${layout.ground.cx - layout.ground.rx * 0.9} ${layout.ground.cy} L ${layout.ground.cx + layout.ground.rx * 0.9} ${layout.ground.cy}`}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="2"
        strokeLinecap="round"
        {...grow}
        transition={{ duration: 0.6, ease }}
      />

      {/* roots */}
      {layout.roots.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          stroke="#2c2f37"
          strokeWidth={6 - i}
          strokeLinecap="round"
          fill="none"
          {...grow}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        />
      ))}

      {/* trunk + leader */}
      <motion.path
        d={layout.trunk}
        stroke="#2c2f37"
        strokeWidth={layout.trunkWidth}
        strokeLinecap="round"
        fill="none"
        {...grow}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      />
      <motion.path
        d={layout.trunk}
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={layout.trunkWidth / 5}
        strokeLinecap="round"
        fill="none"
        transform={`translate(${-layout.trunkWidth / 4} 0)`}
        {...grow}
        transition={{ duration: 0.7, delay: 0.15, ease }}
      />
      <motion.path
        d={layout.leaderPath}
        stroke="#2c2f37"
        strokeWidth={layout.leaderWidth}
        strokeLinecap="round"
        fill="none"
        {...grow}
        transition={{ duration: 0.7, delay: 0.55, ease }}
      />

      {/* branches */}
      {spots.map(({ at, from }, i) =>
        i === layout.leader ? null : (
          <motion.path
            key={`branch-${i}`}
            d={branchPath(from, at)}
            stroke={active === i ? "#3d6bff" : "#2c2f37"}
            strokeWidth={layout.leaderWidth * (from[1] > layout.height * 0.66 ? 0.7 : 0.58)}
            strokeLinecap="round"
            fill="none"
            style={{ transition: "stroke 300ms" }}
            {...grow}
            transition={{ duration: 0.7, delay: BRANCH_START + i * 0.06, ease }}
          />
        ),
      )}

      {/* little leaves sprouting along the wood */}
      {layout.sprouts(spots).map((s, k) => (
        <g key={k} transform={`translate(${s.x} ${s.y}) rotate(${s.angle})`}>
          <motion.path
            d={lens(26, 12)}
            transform="translate(0 -6)"
            fill={k % 2 ? "rgba(61,107,255,0.6)" : "rgba(61,107,255,0.35)"}
            style={{ originX: 0, originY: 0.5 }}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ type: "spring", stiffness: 220, damping: 14, delay: LEAF_START + k * 0.05 }}
          />
        </g>
      ))}

      {/* skill leaves */}
      {spots.map(({ at }, i) => {
        const skill = skills[i];
        const isActive = active === i;
        const Icon = skill.icon;
        const iconSize = fontSize + 3.5;
        const textX = leafW * 0.14 + iconSize + 7;
        const lines = titleLines(skill.title, leafW - textX - 6, fontSize);
        const lineH = fontSize * 1.15;
        return (
          <g
            key={skill.title}
            transform={`translate(${at[0] - leafW / 2} ${at[1] - leafH / 2})`}
            role="listitem"
            tabIndex={0}
            aria-label={`${skill.title}: ${skill.description}`}
            onMouseEnter={() => onActive(i)}
            onFocus={() => onActive(i)}
            onClick={() => onActive(i)}
            className="cursor-pointer outline-none"
          >
            <motion.g
              style={{ originX: 0.5, originY: 0.5 }}
              initial={{ scale: 0, rotate: -18, opacity: 0 }}
              whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ type: "spring", stiffness: 160, damping: 13, delay: LEAF_START + 0.15 + i * 0.1 }}
            >
              <g className="leaf-sway" style={{ animationDelay: `${(i % 4) * -1.1}s` }}>
                <path
                  d={lens(leafW, leafH)}
                  fill={isActive ? "#3d6bff" : "#1d2130"}
                  stroke={isActive ? "#5a82ff" : "rgba(61,107,255,0.45)"}
                  strokeWidth="1.5"
                  style={{ transition: "fill 300ms, stroke 300ms" }}
                />
                <path
                  d={`M 14 ${leafH / 2} Q ${leafW / 2} ${leafH / 2 + 5}, ${leafW - 10} ${leafH / 2}`}
                  stroke={isActive ? "rgba(255,255,255,0.25)" : "rgba(61,107,255,0.18)"}
                  strokeWidth="1"
                  fill="none"
                />
                <Icon
                  x={leafW * 0.14}
                  y={leafH / 2 - iconSize / 2}
                  width={iconSize}
                  height={iconSize}
                  color={isActive ? "#ffffff" : "#5a82ff"}
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
  const current = skills[active];
  const counter = (
    <span className="eyebrow">
      <span className="text-accent">{String(active + 1).padStart(2, "0")}</span> / {String(skills.length).padStart(2, "0")}
    </span>
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-surface p-5 md:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_50%_40%,black_20%,transparent_75%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[30%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[110px]" />

      <div className="relative hidden lg:block">
        <TreeCanvas layout={wideTree} skills={skills} active={active} onActive={setActive} />
        <div className="pointer-events-none absolute bottom-0 left-0 max-w-[300px]">
          <ActiveSkill skill={current} hint="Hover a leaf" />
        </div>
        <div className="absolute bottom-0 right-0">{counter}</div>
      </div>

      <div className="relative mx-auto max-w-sm lg:hidden">
        <TreeCanvas layout={tallTree} skills={skills} active={active} onActive={setActive} />
        <div className="mt-6 border-t border-line pt-5">
          <ActiveSkill skill={current} hint="Tap a leaf" aside={counter} />
        </div>
      </div>
    </div>
  );
}
