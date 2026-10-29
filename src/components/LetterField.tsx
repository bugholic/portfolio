import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { motion } from "motion/react";

export type PhraseChar = { char: string; line: 0 | 1 };

type Home = { x: number; y: number; rotate: number; scale: number };
type Slot = { x: number; y: number; line: 0 | 1 } | null;

const FILLERS = 46;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const randomHome = (): Home => ({
  x: Math.random(),
  y: Math.random(),
  rotate: Math.random() * 120 - 60,
  scale: 0.16 + Math.random() * 0.3,
});

/** Every letter any phrase needs, plus random filler, so each phrase can be spelled from the pile. */
function buildPool(phrases: PhraseChar[][]) {
  const need = new Map<string, number>();
  for (const phrase of phrases) {
    const counts = new Map<string, number>();
    for (const { char } of phrase) counts.set(char, (counts.get(char) ?? 0) + 1);
    counts.forEach((n, c) => need.set(c, Math.max(need.get(c) ?? 0, n)));
  }
  const chars: string[] = [];
  need.forEach((n, c) => chars.push(...Array(n).fill(c)));
  for (let i = 0; i < FILLERS; i++) chars.push(ALPHABET[Math.floor(Math.random() * ALPHABET.length)]);
  return chars;
}

/**
 * A pile of letters scattered over the whole hero. On every phrase change the letters it needs
 * fly out of the pile into the slots of the hidden heading; the previous ones are thrown back.
 */
export function LetterField({
  phrases,
  index,
  container,
  targets,
  className,
}: {
  phrases: PhraseChar[][];
  index: number;
  container: RefObject<HTMLElement | null>;
  targets: RefObject<(HTMLSpanElement | null)[]>;
  className: string;
}) {
  const pool = useMemo(() => buildPool(phrases), [phrases]);
  const homes = useRef<Home[]>(pool.map(randomHome));
  const assigned = useRef<number[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [slots, setSlots] = useState<Slot[]>(() => pool.map(() => null));
  const [measureTick, setMeasureTick] = useState(0);
  const firstPaint = useRef(true);

  // Passive effects: the section and heading refs are attached after this child's layout effects run.
  // Re-measure on resize and once web fonts settle, since both move the heading's glyphs.
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setMeasureTick((t) => t + 1));
    observer.observe(el);
    document.fonts?.ready.then(() => setMeasureTick((t) => t + 1));
    return () => observer.disconnect();
  }, [container]);

  // Pick pile letters for the new phrase; letters that leave the heading land somewhere new.
  useLayoutEffect(() => {
    const free = pool.map((_, i) => i);
    const previous = new Set(assigned.current);
    const next: number[] = phrases[index].map(({ char }) => {
      const candidates = free.filter((i) => pool[i] === char);
      const fresh = candidates.filter((i) => !previous.has(i));
      const pickFrom = fresh.length ? fresh : candidates;
      const pick = pickFrom[Math.floor(Math.random() * pickFrom.length)];
      free.splice(free.indexOf(pick), 1);
      return pick;
    });
    const kept = new Set(next);
    previous.forEach((i) => {
      if (!kept.has(i)) homes.current[i] = randomHome();
    });
    assigned.current = next;
  }, [index, phrases, pool]);

  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    setSize({ w: box.width, h: box.height });
    const nextSlots: Slot[] = pool.map(() => null);
    assigned.current.forEach((poolIndex, charIndex) => {
      const target = targets.current?.[charIndex]?.getBoundingClientRect();
      if (target) {
        nextSlots[poolIndex] = {
          x: target.left - box.left,
          y: target.top - box.top,
          line: phrases[index][charIndex].line,
        };
      }
    });
    // On load, show the mess first and let the first phrase assemble out of it.
    if (firstPaint.current) {
      firstPaint.current = false;
      const id = window.setTimeout(() => setSlots(nextSlots), 450);
      return () => window.clearTimeout(id);
    }
    setSlots(nextSlots);
  }, [index, measureTick, container, targets, phrases, pool]);

  if (!size.w) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pool.map((char, i) => {
        const slot = slots[i];
        const home = homes.current[i];
        const placed = slot !== null;
        return (
          <motion.span
            key={i}
            className={`absolute left-0 top-0 inline-block transition-colors duration-700 ${className} ${
              placed ? (slot.line === 1 ? "text-accent" : "text-white") : "text-muted"
            }`}
            initial={false}
            animate={
              placed
                ? { x: slot.x, y: slot.y, rotate: 0, scale: 1, opacity: 1 }
                : {
                    x: home.x * size.w - size.w * 0.04,
                    y: home.y * size.h - size.h * 0.06,
                    rotate: home.rotate,
                    scale: home.scale,
                    opacity: 0.16,
                  }
            }
            transition={
              placed
                ? { type: "spring", stiffness: 70, damping: 13, mass: 0.9, delay: (slot.x / size.w) * 0.35 }
                : { type: "spring", stiffness: 40, damping: 9, mass: 1.1 }
            }
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
}
