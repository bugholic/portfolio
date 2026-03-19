import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { useMagneticEffect } from "../hooks/useMagneticEffect";

type TechCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
};

export function TechCard({ icon: Icon, title, description, index }: TechCardProps) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagneticEffect(0.3);

  return (
    <motion.div
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, delay: index * 0.06 }}
        whileHover={{ scale: 1.02 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,163,255,0.16),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-base font-semibold tracking-tight text-white">{title}</h3>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <p className="text-sm leading-6 text-white/50">{description}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
