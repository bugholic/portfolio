import { motion } from "motion/react";

type SectionHeaderProps = {
  index: string;
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
};

export function SectionHeader({ index, label, title, aside }: SectionHeaderProps) {
  return (
    <div className="mb-14 md:mb-20">
      <div className="flex items-center justify-between border-t border-line pt-5">
        <span className="eyebrow">
          <span className="text-accent">({index})</span> {label}
        </span>
        {aside && <span className="eyebrow hidden sm:block">{aside}</span>}
      </div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8 max-w-5xl font-display text-[clamp(2.5rem,6.5vw,6rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em]"
      >
        {title}
      </motion.h2>
    </div>
  );
}
