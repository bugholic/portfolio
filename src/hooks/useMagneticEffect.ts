import { useRef } from "react";
import { useMotionValue, useSpring } from "motion/react";

export function useMagneticEffect(strength = 0.4) {
  const ref = useRef<HTMLElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 15 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15 });

  const isTouch = typeof window !== "undefined" && window.matchMedia("(hover: none)").matches;

  function onMouseMove(event: React.MouseEvent) {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    rawY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return { ref, x, y, onMouseMove, onMouseLeave };
}
