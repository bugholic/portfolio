import { useEffect, useRef } from "react";

/*
 * A soft light that follows the mouse. The native cursor stays visible; this is
 * an ambient layer that trails slightly behind the pointer and brightens the
 * surface underneath, so the cursor always feels present without stealing the
 * exact position. Runs only on fine pointers and is skipped for reduced motion.
 */
export function SpotlightCursor() {
  const follow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = follow.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let frame = 0;
    let running = false;

    const tick = () => {
      x += (targetX - x) * 0.16;
      y += (targetY - y) * 0.16;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      if (Math.abs(targetX - x) > 0.15 || Math.abs(targetY - y) > 0.15) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (el.style.opacity !== "1") el.style.opacity = "1";
      start();
    };

    const hide = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden motion-reduce:hidden [@media(pointer:fine)]:block"
    >
      <div
        ref={follow}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-500 will-change-transform"
      >
        {/* broad light, tinted with the accent */}
        <div
          className="absolute left-0 top-0 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 38%, transparent), transparent 72%)",
          }}
        />
        {/* hot core, lifts the surface directly under the pointer */}
        <div
          className="absolute left-0 top-0 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-plus-lighter"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.14), transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
