import { useMemo } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

/** One line of a heading, split into differently coloured runs of text. */
export type HeadingLine = { text: string; className?: string }[];

type Scatter = { x: number; y: number; rotate: number; scale: number; delay: number };

const between = (min: number, max: number) => min + Math.random() * (max - min);

const letterVariants: Variants = {
  jumbled: (s: Scatter) => ({ x: s.x, y: s.y, rotate: s.rotate, scale: s.scale, opacity: 0.3 }),
  arranged: (s: Scatter) => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 75, damping: 13, mass: 0.9, delay: s.delay },
  }),
};

/**
 * A heading whose letters paint scrambled around it and fall into place once
 * the visitor reaches it. Words stay unbreakable so the settled text wraps normally.
 */
export function JumbleHeading({ lines, className }: { lines: HeadingLine[]; className: string }) {
  const reduce = useReducedMotion();
  const label = lines.map((line) => line.map((run) => run.text).join("")).join(" ");

  // A fresh scramble per mount, so every reload throws the letters differently
  const scatter = useMemo(
    () =>
      Array.from({ length: label.length }, (): Scatter => ({
        x: between(-260, 260),
        y: between(-150, 150),
        rotate: between(-90, 90),
        scale: between(0.5, 1.4),
        delay: between(0, 0.35),
      })),
    [label],
  );

  if (reduce) {
    return (
      <h2 className={className}>
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.map((run, ri) => (
              <span key={ri} className={run.className}>
                {run.text}
              </span>
            ))}
          </span>
        ))}
      </h2>
    );
  }

  let letter = 0;
  return (
    <motion.h2
      aria-label={label}
      className={className}
      initial="jumbled"
      whileInView="arranged"
      viewport={{ once: true, amount: 0.4 }}
    >
      {lines.map((line, li) => (
        <span key={li} aria-hidden className="block">
          {line.map((run, ri) => (
            <span key={ri} className={run.className}>
              {run.text.split(/(\s+)/).map((word, wi) =>
                /^\s+$/.test(word) || !word ? (
                  word
                ) : (
                  <span key={wi} className="inline-block whitespace-nowrap">
                    {[...word].map((char) => {
                      const i = letter++;
                      return (
                        <motion.span key={i} custom={scatter[i]} variants={letterVariants} className="inline-block">
                          {char}
                        </motion.span>
                      );
                    })}
                  </span>
                ),
              )}
            </span>
          ))}
        </span>
      ))}
    </motion.h2>
  );
}
