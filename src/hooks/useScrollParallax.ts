import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";

type Speeds = {
  slow?: number;
  mid?: number;
  fast?: number;
};

export function useScrollParallax(speeds: Speeds = {}) {
  const { slow = 30, mid = 60, fast = 100 } = speeds;
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: ref as any,
    offset: ["start end", "end start"],
  });

  const slowY = useTransform(scrollYProgress, [0, 1], [-slow, slow]);
  const midY = useTransform(scrollYProgress, [0, 1], [-mid, mid]);
  const fastY = useTransform(scrollYProgress, [0, 1], [-fast, fast]);

  return { ref, slowY, midY, fastY };
}
