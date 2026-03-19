export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference">
      <div className="font-mono text-[10px] tracking-widest text-white/40">BH_OS v1.0</div>
      <div className="flex gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-white/60">
        <a href="#about" className="hover:text-white transition-colors">
          About
        </a>
        <a href="#experience" className="hover:text-white transition-colors">
          Experience
        </a>
        <a href="#projects" className="hover:text-white transition-colors">
          Projects
        </a>
        <a href="#stack" className="hover:text-white transition-colors">
          Stack
        </a>
        <a href="#contact" className="hover:text-white transition-colors">
          Contact
        </a>
      </div>
      <div className="w-8 h-[1px] bg-accent" />
    </nav>
  );
}
