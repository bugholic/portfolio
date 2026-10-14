import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

type TechCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
};

export function TechCard({ icon: Icon, title, description, index }: TechCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent hover:bg-accent"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent transition-colors duration-300 group-hover:bg-white/15 group-hover:text-white">
          <Icon size={20} />
        </div>
        <span className="font-mono text-[11px] text-muted transition-colors group-hover:text-white/70">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-10">
        <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted transition-colors group-hover:text-white/80">{description}</p>
      </div>
    </motion.div>
  );
}
