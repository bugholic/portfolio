import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="py-16 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-white/30 text-xs tracking-wider">© 2026 Developer Portfolio. All rights reserved.</div>
        <div className="flex gap-8">
          <a
            href="https://github.com/bugholic"
            target="_blank"
            rel="noreferrer"
            className="text-white/40 hover:text-accent transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
          >
            <Github size={14} /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ayuv"
            target="_blank"
            rel="noreferrer"
            className="text-white/40 hover:text-accent transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
          >
            <Linkedin size={14} /> LinkedIn
          </a>
          <a
            href="https://x.com/vaayussh"
            target="_blank"
            rel="noreferrer"
            className="text-white/40 hover:text-accent transition-colors flex items-center gap-2 text-xs uppercase tracking-widest"
          >
            <Twitter size={14} /> Twitter
          </a>
        </div>
      </div>
    </footer>
  );
}
