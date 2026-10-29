import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Download, Moon, Sun } from "lucide-react";
import { useMagneticEffect } from "../hooks/useMagneticEffect";
import { useTheme } from "../hooks/useTheme";
import { profile } from "../data/profile";
import { sectionOrder, type SectionKey } from "../data/sectionOrder";

const ease = [0.76, 0, 0.24, 1] as const;

const sectionLabels: Record<SectionKey, string> = {
  about: "About",
  experience: "Experience",
  projects: "Work",
  stack: "Stack",
};

const links = [
  // Same order as the page, which is shuffled per load; contact always closes the list
  ...sectionOrder.map((key) => ({ href: `#${key}`, label: sectionLabels[key] })),
  { href: "#contact", label: "Contact" },
];

const socials = [
  { label: "LinkedIn", href: profile.socials.linkedin },
  { label: "GitHub", href: profile.socials.github },
  { label: "Twitter / X", href: profile.socials.twitter },
];

function useLocalTime() {
  const format = () =>
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
  const [time, setTime] = useState(format);

  useEffect(() => {
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagneticEffect(0.35);

  return (
    <motion.button
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      type="button"
      onClick={onClick}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
      className="group flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-2 text-sm font-medium text-bg"
    >
      <span className="relative h-5 overflow-hidden">
        <span className={`block transition-transform duration-500 ${open ? "-translate-y-5" : ""}`}>
          <span className="block h-5 leading-5">Menu</span>
          <span className="block h-5 leading-5">Close</span>
        </span>
      </span>
      <span className="flex h-9 w-9 flex-col items-center justify-center gap-1 rounded-full bg-accent transition-transform duration-500 group-hover:scale-110">
        <span
          className={`h-[1.5px] w-3.5 bg-white transition-transform duration-500 ${open ? "translate-y-[3.25px] rotate-45" : ""}`}
        />
        <span
          className={`h-[1.5px] w-3.5 bg-white transition-transform duration-500 ${open ? "-translate-y-[3.25px] -rotate-45" : ""}`}
        />
      </span>
    </motion.button>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className="relative flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border border-line bg-surface text-white transition-colors hover:border-accent/50"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const time = useLocalTime();

  return (
    <motion.div
      initial={{ clipPath: "circle(0% at calc(100% - 64px) 44px)" }}
      animate={{ clipPath: "circle(150% at calc(100% - 64px) 44px)" }}
      exit={{ clipPath: "circle(0% at calc(100% - 64px) 44px)" }}
      transition={{ duration: 0.8, ease }}
      className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-surface"
      role="dialog"
      aria-modal="true"
    >
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[520px] w-[520px] bg-[radial-gradient(closest-side,rgba(65,105,225,0.22),transparent)]" />

      <div className="container-x relative flex items-center justify-between pt-5">
        <span className="eyebrow">Navigation</span>
        <MenuButton open onClick={onClose} />
      </div>

      <div className="container-x relative grid flex-1 gap-12 py-12 lg:grid-cols-12 lg:items-end">
        <nav className="lg:col-span-8">
          <ul>
            {links.map((link, i) => (
              <li key={link.href} className="overflow-hidden border-b border-line">
                <motion.a
                  href={link.href}
                  onClick={onClose}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-baseline gap-4 py-2 md:gap-8"
                >
                  <span className="font-mono text-xs text-muted transition-colors group-hover:text-accent">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[clamp(2.75rem,8.5vw,7.5rem)] font-extrabold uppercase leading-[1] tracking-[-0.05em] text-white/90 transition-all duration-500 group-hover:translate-x-3 group-hover:text-accent">
                    {link.label}
                  </span>
                  <ArrowUpRight
                    className="ml-auto self-center text-accent opacity-0 transition-all duration-500 group-hover:rotate-45 group-hover:opacity-100"
                    size={40}
                  />
                </motion.a>
              </li>
            ))}
          </ul>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="space-y-10 lg:col-span-3 lg:col-start-10"
        >
          <div>
            <p className="eyebrow mb-3">Say hello</p>
            <a href={`mailto:${profile.email}`} className="break-all text-lg text-white hover:text-accent">
              {profile.email}
            </a>
          </div>
          <div>
            <p className="eyebrow mb-3">Socials</p>
            <ul className="space-y-1.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-white/80 hover:text-accent">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <a
            href={profile.cvUrl}
            download
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-signal"
          >
            Download CV <Download size={15} />
          </a>
          <p className="eyebrow">Pune · {time} IST</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Scrolls away with the page: no sticky bar */}
      <header className="absolute inset-x-0 top-0 z-40">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="container-x flex items-center justify-between pt-5"
        >
          <a href="#" className="group flex items-center gap-3">
            <img
              src="/logo/bugholic-logo.png"
              alt="Bugholic"
              className="h-10 w-10 object-contain transition-transform duration-500 group-hover:rotate-[-12deg]"
            />
            <span className="font-display text-sm font-bold uppercase tracking-[0.18em]">Bugholic</span>
          </a>

          <p className="eyebrow hidden md:block">
            Code to evolve <span className="text-signal">/</span> innovate to assist
          </p>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <MenuButton open={false} onClick={() => setOpen(true)} />
          </div>
        </motion.div>
      </header>

      <AnimatePresence>{open && <MenuOverlay onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
