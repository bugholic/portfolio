import { motion } from "motion/react";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-16 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -18% 0px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: "0px 0px -18% 0px" }}
        transition={{ delay: 0.06, duration: 0.42, ease: "easeOut" }}
        className="text-white/50 max-w-2xl mx-auto text-lg"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
