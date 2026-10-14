const items = [
  "Full Stack Development",
  "React & Next.js",
  "Node.js APIs",
  "AI Agents & RAG",
  "Python Automation",
  "Expo Mobile",
  "MCP Integrations",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-display text-2xl font-bold uppercase tracking-tight md:px-10 md:text-4xl">
            {item}
          </span>
          <span className="text-xl text-white/60 md:text-3xl">✦</span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="overflow-hidden py-6">
      <div className="-mx-4 -rotate-[1.2deg] overflow-hidden bg-accent py-4 md:py-6">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <Row />
          <Row />
        </div>
      </div>
    </div>
  );
}
