import { motion } from "motion/react";
import { Brain, Database, FileText, Wrench } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Engineer by craft: an editor typing itself ---------- */

const codeLines: { indent: number; tokens: [string, string][] }[] = [
  { indent: 0, tokens: [["text-accent-hover", "export async"], ["text-white/85", " ship"], ["text-white/40", "(spec) {"]] },
  { indent: 1, tokens: [["text-accent-hover", "const"], ["text-white/85", " api"], ["text-white/40", " = "], ["text-emerald-300/80", "design"], ["text-white/40", "(spec)"]] },
  { indent: 1, tokens: [["text-accent-hover", "await"], ["text-emerald-300/80", " test"], ["text-white/40", "(api)"]] },
  { indent: 1, tokens: [["text-accent-hover", "return"], ["text-emerald-300/80", " deploy"], ["text-white/40", "(api)"]] },
  { indent: 0, tokens: [["text-white/40", "}"]] },
];

export function CraftVisual() {
  return (
    <div className="h-full rounded-2xl border border-white/10 bg-[#121317] font-mono text-[11px] leading-[1.9]">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 text-[9px] text-white/35">ship.ts</span>
      </div>
      <div className="px-3 py-2.5">
        {codeLines.map((line, i) => (
          <div key={i} className="flex">
            <span className="w-5 shrink-0 select-none text-white/20">{i + 1}</span>
            <motion.span
              className="inline-block overflow-hidden whitespace-nowrap"
              style={{ marginLeft: line.indent * 14 }}
              initial={{ maxWidth: 0 }}
              whileInView={{ maxWidth: 280 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: 0.2 + i * 0.35, ease: "linear" }}
            >
              {line.tokens.map(([cls, text], k) => (
                <span key={k} className={cls}>
                  {text}
                </span>
              ))}
              {i === codeLines.length - 1 && <span className="caret ml-0.5 inline-block h-3 w-[6px] translate-y-0.5 bg-accent" />}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Product-minded: a roadmap shipping on time ---------- */

const milestones = ["Brief", "Plan", "Build", "Launch"];

export function ProductVisual() {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#121317] p-4">
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
        <span>Roadmap · Q3</span>
        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-emerald-300/90">On track</span>
      </div>

      <div className="relative mt-6 h-1.5 rounded-full bg-white/8">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 2.4, delay: 0.3, ease }}
        />
        {milestones.map((m, i) => {
          const pct = (i / (milestones.length - 1)) * 100;
          return (
            <motion.span
              key={m}
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#121317]"
              style={{ left: `${pct}%` }}
              initial={{ backgroundColor: "#3a3e47", scale: 0.8 }}
              whileInView={{ backgroundColor: "#3d6bff", scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.3, delay: 0.3 + (pct / 100) * 2.1 }}
            />
          );
        })}
      </div>
      <div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-wider text-white/50">
        {milestones.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          ["Stories", "24"],
          ["Sprint", "06"],
          ["Shipped", "100%"],
        ].map(([label, value], i) => (
          <motion.div
            key={label}
            className="rounded-lg bg-white/[0.04] px-2.5 py-2"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.12, ease }}
          >
            <p className="font-mono text-[8px] uppercase tracking-wider text-white/40">{label}</p>
            <p className="mt-0.5 font-display text-sm font-semibold">{value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------- AI in the loop: query -> model -> tools, and back ---------- */

const satellites = [
  { icon: FileText, label: "Docs", x: 14, y: 22 },
  { icon: Database, label: "Vectors", x: 86, y: 22 },
  { icon: Wrench, label: "MCP tools", x: 50, y: 88 },
];

export function AiVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#121317]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {satellites.map((s) => (
          <line
            key={s.label}
            x1="50"
            y1="50"
            x2={s.x}
            y2={s.y}
            stroke="rgba(61,107,255,0.45)"
            strokeWidth="0.6"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
            className="flow-dash"
          />
        ))}
      </svg>

      {/* packets travelling to each tool and back */}
      {satellites.map((s, i) => (
        <motion.span
          key={s.label}
          className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-hover shadow-[0_0_10px_#5a82ff]"
          animate={{ left: ["50%", `${s.x}%`, "50%"], top: ["50%", `${s.y}%`, "50%"] }}
          transition={{ duration: 2.6, delay: i * 0.85, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-ping rounded-2xl bg-accent/30 [animation-duration:2.4s]" />
        <div className="relative flex items-center gap-1.5 rounded-2xl bg-accent px-3 py-2 shadow-[0_0_30px_rgba(61,107,255,0.5)]">
          <Brain size={14} />
          <span className="font-mono text-[10px] font-medium uppercase tracking-wider">LLM</span>
        </div>
      </div>

      {satellites.map((s) => (
        <div
          key={s.label}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#1d1f25] px-2 py-1 font-mono text-[9px] text-white/70"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          <s.icon size={11} className="text-accent-hover" />
          {s.label}
        </div>
      ))}
    </div>
  );
}
