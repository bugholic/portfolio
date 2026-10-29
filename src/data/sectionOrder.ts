// Hero and footer stay put; the sections between them are reshuffled on every page load.
// Computed once per load so the page and the menu agree on the order.
export type SectionKey = "about" | "experience" | "projects" | "stack";

function shuffled<T>(items: T[]) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const sectionOrder: SectionKey[] = shuffled(["about", "experience", "projects", "stack"]);
