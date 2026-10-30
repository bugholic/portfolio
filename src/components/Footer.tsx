import { motion } from "motion/react";
import { ArrowUp, ArrowUpRight, Download } from "lucide-react";
import { useMagneticEffect } from "../hooks/useMagneticEffect";
import { profile } from "../data/profile";
import { JumbleHeading } from "./JumbleHeading";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ayuv" },
  { label: "GitHub", href: "https://github.com/bugholic" },
  { label: "Twitter / X", href: "https://x.com/vaayussh" },
];

const sitemap = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
  { label: "Stack", href: "#stack" },
];

function MagneticCta() {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagneticEffect(0.25);

  return (
    <motion.a
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      href={`mailto:${profile.email}`}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="flex h-36 w-36 shrink-0 flex-col items-center justify-center gap-1 rounded-full bg-accent text-sm font-medium text-white transition-colors hover:bg-signal md:h-44 md:w-44"
    >
      <ArrowUpRight size={28} />
      Let's talk
    </motion.a>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-surface pt-24 md:pt-36">
      <div className="pointer-events-none absolute -bottom-60 left-1/2 h-[480px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(111,136,184,0.18),transparent)]" />

      <div className="container-x relative">
        <span className="eyebrow">
          <span className="text-accent">(05)</span> Contact
        </span>

        <div className="mt-8 flex flex-col gap-10 border-b border-line pb-16 md:flex-row md:items-end md:justify-between">
          <JumbleHeading
            lines={[[{ text: "Got a project" }], [{ text: "in mind?", className: "text-accent" }]]}
            className="font-display text-[clamp(3rem,9vw,8.5rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em]"
          />
          <MagneticCta />
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="max-w-sm text-[15px] leading-7 text-muted">
              Open for freelance projects and interesting collaborations. Reach out, I reply fast.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-6 inline-block font-display text-2xl font-semibold tracking-tight underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent md:text-3xl"
            >
              {profile.email}
            </a>
            <div className="mt-8">
              <a
                href={profile.cvUrl}
                download
                className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-5 py-3 text-sm font-medium text-white/85 transition-colors hover:border-accent/50"
              >
                Download CV <Download size={15} />
              </a>
            </div>
          </div>
          <div>
            <p className="eyebrow mb-4">Socials</p>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-white/80 transition-colors hover:text-accent"
                  >
                    {s.label}
                    <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4">Sitemap</p>
            <ul className="space-y-2">
              {sitemap.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-white/80 transition-colors hover:text-accent">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Oversized brand wordmark */}
      <div className="relative select-none overflow-hidden" aria-hidden>
        <p className="translate-y-[18%] text-center font-display text-[21vw] font-extrabold uppercase leading-[0.8] tracking-[-0.06em] text-white/[0.04]">
          Bugholic
        </p>
      </div>

      <div className="relative border-t border-line">
        <div className="container-x flex items-center justify-between py-6">
          <a href="#" className="flex items-center gap-2">
            <img src="/logo/bugholic-logo.png" alt="Bugholic" className="h-6 w-6 object-contain opacity-70" />
            <span className="font-mono text-xs text-muted">© 2026 Bugholic · Aayush</span>
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-white"
          >
            Back to top <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
