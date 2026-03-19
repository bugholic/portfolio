import { motion } from "motion/react";
import { useMagneticEffect } from "../hooks/useMagneticEffect";

function MagneticNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagneticEffect(0.35);

  return (
    <motion.a
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      href={href}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="hover:text-white transition-colors"
    >
      {children}
    </motion.a>
  );
}

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-5 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/20 px-5 py-4 backdrop-blur-xl">
        <a href="#" className="flex items-center gap-2.5">
          <img src="/logo/bugholic-logo.png" alt="Bugholic" className="h-9 w-9 object-contain" />
          <span className="font-mono text-[11px] tracking-widest text-white/60 uppercase">Bugholic</span>
        </a>
        <div className="hidden gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-white/60 md:flex">
          <MagneticNavLink href="#about">About</MagneticNavLink>
          <MagneticNavLink href="#experience">Experience</MagneticNavLink>
          <MagneticNavLink href="#projects">Projects</MagneticNavLink>
          <MagneticNavLink href="#stack">Stack</MagneticNavLink>
          <MagneticNavLink href="#contact">Contact</MagneticNavLink>
        </div>
        <div className="w-8 h-[1px] bg-accent" />
      </div>
    </nav>
  );
}
