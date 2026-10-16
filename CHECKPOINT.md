# Checkpoint: horizontal scroll, tunnel removed

**Date:** 2026-10-17
**Goal:** Make the portfolio move horizontally and remove the laggy WebGL tunnel effect.

## Done (uncommitted)

- **Deleted** `src/components/ScrollJourney.tsx`, the Three.js tunnel, `JourneyStop` and `TunnelTransition`. It was staged with `git rm`.
- **Added** `src/components/HorizontalScroll.tsx`:
  - `HorizontalScroll` sets up a tall runway, a sticky 100svh viewport and a flex track of 100vw panels.
  - Scrolling first reads down the current panel by setting its `scrollTop`, then slides the track sideways by one viewport width to the next panel.
  - The runway height is recalculated with a `ResizeObserver` and on window resize.
  - Clicks on `#hash` links are intercepted and smooth-scrolled to the right panel and offset. `#` goes to the top. The page also jumps to the hash it was loaded with.
  - A 2px accent progress bar sits at the bottom of the viewport.
  - Below 768px it falls back to a normal vertical page with no `.hs` classes.
  - `Panel` wraps each section. `usePanelScroller()` returns the panel's scroll element in horizontal mode and `null` on mobile.
- **Changed** `src/App.tsx`: the sections are now wrapped in `<HorizontalScroll><Panel>…</Panel></HorizontalScroll>`.
- **Changed** `src/index.css`: all `.journey-*` CSS was removed and replaced with `.hs`, `.hs-viewport`, `.hs-track`, `.hs-panel` and `.hs-progress`. The tunnel rules in the reduced-motion block were removed too.
- **Changed** `src/components/ExperienceLaptop.tsx` and `src/hooks/useScrollParallax.ts`: `useScroll` now passes `container: usePanelScroller() ?? undefined`, so the laptop's sticky runway and the hero parallax follow the panel's scroll.

## Verified

- `npx tsc --noEmit` passes.
- Mobile at 390px: the vertical fallback works, with no horizontal overflow and no console errors.

## Not yet verified

- **Desktop at 1440×900 is not confirmed.** The first headless run sampled the page before Vite had finished its cold start, so the scroll height read as 900 and no panels were found. The rerun with a longer wait was interrupted.
- Test script: `C:/Users/ayush/AppData/Local/Temp/claude/C--Users-ayush-Desktop-Aayush-portfolio/b676d4ad-f9b1-4260-9387-4ea1acec5f1c/scratchpad/cdp.mjs`. It uses headless Chrome over CDP and is run as `node cdp.mjs <scratchpad>` against the dev server on port 3123.

## Next steps

1. Run `npm run dev` and check on desktop:
   - The track slides between sections.
   - The experience laptop animation runs inside its panel.
   - The navbar and footer anchor links land on the right section.
   - The "show more" button in Projects stretches the runway correctly.
2. Optional: add a subtle cue on the hero panel that the page moves sideways.
3. Commit.
4. Optional cleanup: `three`, `@react-three/fiber` and `drei` may still be used by `HeroScene.tsx`. Check that before removing any dependency.
