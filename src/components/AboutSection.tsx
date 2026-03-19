import { motion } from "motion/react";
import { SectionHeader } from "./SectionHeader";

const aboutDescription =
  "Building the digital future with React, Node.js, and Python. As a developer and tech content creator, I don't just write code, I build tools that solve real-world problems. Whether I'm optimizing an Excel workflow or deploying a full-scale web app, I'm always focused on performance, precision, and a bit of innovation.";

export function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 max-w-5xl mx-auto">
      <SectionHeader title="About Me" subtitle="Engineering practical products with a builder's mindset." />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 backdrop-blur-sm"
      >
        <p className="text-lg md:text-2xl leading-relaxed text-white/75">{aboutDescription}</p>
      </motion.div>
    </section>
  );
}
