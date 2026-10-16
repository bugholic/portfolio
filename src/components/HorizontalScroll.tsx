import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

/*
 * Sections sit side by side on a horizontal track. Scrolling the page first
 * reads down the current section, then slides the track sideways to the next
 * one. Everything is driven by plain transforms and scrollTop writes, so the
 * page stays native-scroll smooth. On narrow screens it falls back to a
 * normal vertical stack.
 */

const DESKTOP = "(min-width: 768px)";

type PanelScroller = React.RefObject<HTMLDivElement | null> | null;

const PanelContext = createContext<PanelScroller>(null);
const ModeContext = createContext(false);

/** The panel element that scrolls this content, or null when the page scrolls normally. */
export function usePanelScroller() {
  return useContext(PanelContext);
}

function useDesktop() {
  const [desktop, setDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia(DESKTOP).matches);
  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const onChange = () => setDesktop(query.matches);
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return desktop;
}

export function Panel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const horizontal = useContext(ModeContext);
  return (
    <div ref={ref} className="hs-panel" data-hs-panel>
      <PanelContext.Provider value={horizontal ? ref : null}>{children}</PanelContext.Provider>
    </div>
  );
}

type Layout = { start: number; vertical: number }[];

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  const desktop = useDesktop();
  const runway = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const runwayEl = runway.current;
    const trackEl = track.current;
    if (!desktop || !runwayEl || !trackEl) return;

    const panels = Array.from(trackEl.querySelectorAll<HTMLElement>("[data-hs-panel]"));
    let layout: Layout = [];
    let total = 0;
    let frame = 0;

    // Each panel owns a vertical stretch (its overflow) followed by one viewport width of sideways travel.
    const measure = () => {
      const vw = window.innerWidth;
      let cursor = 0;
      layout = panels.map((panel, index) => {
        const entry = { start: cursor, vertical: Math.max(panel.scrollHeight - panel.clientHeight, 0) };
        cursor += entry.vertical + (index < panels.length - 1 ? vw : 0);
        return entry;
      });
      total = cursor;
      runwayEl.style.height = `${total + window.innerHeight}px`;
    };

    const update = () => {
      frame = 0;
      const vw = window.innerWidth;
      const scrolled = Math.min(Math.max(window.scrollY - runwayEl.offsetTop, 0), total);
      let x = 0;
      layout.forEach(({ start, vertical }, index) => {
        const local = scrolled - start;
        panels[index].scrollTop = Math.min(Math.max(local, 0), vertical);
        if (local > vertical) x = index * vw + Math.min(local - vertical, vw);
      });
      trackEl.style.transform = `translate3d(${-x}px, 0, 0)`;
      if (progress.current) progress.current.style.transform = `scaleX(${total ? scrolled / total : 0})`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    // Page offset that brings `element` to the top of its panel's viewport.
    const scrollTargetFor = (element: HTMLElement) => {
      const panel = element.closest<HTMLElement>("[data-hs-panel]");
      const index = panel ? panels.indexOf(panel) : -1;
      if (index < 0) return null;
      const within = element.getBoundingClientRect().top - panel!.getBoundingClientRect().top + panel!.scrollTop;
      return runwayEl.offsetTop + layout[index].start + Math.min(within, layout[index].vertical);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href")!;
      const element = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      const top = hash === "#" ? 0 : element ? scrollTargetFor(element) : null;
      if (top === null) return;
      event.preventDefault();
      history.replaceState(null, "", hash === "#" ? location.pathname + location.search : hash);
      window.scrollTo({ top, behavior: "smooth" });
    };

    measure();
    update();

    const initial = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
    const initialTop = initial ? scrollTargetFor(initial) : null;
    if (initialTop !== null) window.scrollTo({ top: initialTop });

    // Panels grow as images load or lists expand, so keep the runway in sync.
    const resizeObserver = new ResizeObserver(remeasure);
    panels.forEach((panel) => Array.from(panel.children).forEach((child) => resizeObserver.observe(child)));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    document.addEventListener("click", onClick);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      runwayEl.style.height = "";
      trackEl.style.transform = "";
      panels.forEach((panel) => (panel.scrollTop = 0));
    };
  }, [desktop]);

  return (
    <ModeContext.Provider value={desktop}>
      <div ref={runway} className={desktop ? "hs" : undefined}>
        <div className={desktop ? "hs-viewport" : undefined}>
          <div ref={track} className={desktop ? "hs-track" : undefined}>
            {children}
          </div>
          {desktop && (
            <div className="hs-progress" aria-hidden="true">
              <div ref={progress} className="hs-progress__bar" />
            </div>
          )}
        </div>
      </div>
    </ModeContext.Provider>
  );
}
