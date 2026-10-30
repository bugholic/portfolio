import { BarChart3, Bot, Check, FileText, MessageCircle, Music2, Play, Scale, Search, ShieldCheck, Sparkles, Ticket } from "lucide-react";

export type CoverKey =
  | "lyrics"
  | "dashboard"
  | "odoo"
  | "pipeline"
  | "flowboard"
  | "foodox"
  | "inventory"
  | "law"
  | "itsm"
  | "syncplay"
  | "scrollface";

/* ---------- shared primitives ---------- */

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="theme-dark relative h-full w-full overflow-hidden bg-[#0a1340]">
      {/* grid + glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
      <div className="absolute -right-24 -top-24 h-72 w-72 bg-[radial-gradient(closest-side,rgba(111,136,184,0.3),transparent)] transition-transform duration-700 group-hover:scale-125" />
      <div className="absolute -bottom-32 -left-16 h-64 w-64 bg-[radial-gradient(closest-side,rgba(111,136,184,0.12),transparent)]" />
      <div className="absolute inset-0 flex items-center justify-center p-[7%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
        {children}
      </div>
      <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">{label}</span>
    </div>
  );
}

function Window({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: string }) {
  return (
    <div className={`rounded-xl border border-white/10 bg-[#13205a]/95 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        {title && <span className="ml-2 font-mono text-[9px] text-white/35">{title}</span>}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Line({ w, className = "" }: { w: string; className?: string }) {
  return <div className={`h-1.5 rounded-full bg-white/10 ${className}`} style={{ width: w }} />;
}

function Pill({ children, tone = "muted" }: { children: React.ReactNode; tone?: "accent" | "muted" | "solid" }) {
  const styles = {
    accent: "bg-accent/15 text-accent",
    muted: "bg-white/5 text-white/50",
    solid: "bg-accent text-white",
  }[tone];
  return <span className={`rounded-full px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider ${styles}`}>{children}</span>;
}

/* ---------- covers ---------- */

function LyricsCover() {
  return (
    <Frame label="Windows · C#">
      <div className="relative w-full max-w-[420px]">
        <Window title="youtube music" className="opacity-70">
          <div className="flex gap-3">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-accent/60 to-accent/10" />
            <div className="flex-1 space-y-2 pt-1">
              <Line w="70%" />
              <Line w="45%" />
              <div className="mt-3 h-1 rounded-full bg-white/10">
                <div className="h-1 w-2/5 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </Window>
        {/* Floating karaoke strip */}
        <div className="absolute -bottom-8 left-1/2 w-[110%] -translate-x-1/2 rounded-2xl border border-accent/40 bg-[#070f33]/95 px-5 py-3 text-center shadow-[0_0_40px_rgba(111,136,184,0.35)]">
          <p className="text-[10px] text-white/35">and I never felt so alive</p>
          <p className="mt-1 font-display text-base font-bold tracking-tight md:text-lg">
            <span className="text-accent">Singing every word</span>
            <span className="text-white/80"> out loud</span>
          </p>
          <p className="mt-1 text-[10px] text-white/35">under the city lights</p>
        </div>
        <Music2 className="absolute -right-3 -top-4 text-accent" size={22} />
      </div>
    </Frame>
  );
}

function FlowboardCover() {
  const cols = [
    { name: "To do", cards: 3 },
    { name: "In progress", cards: 2, live: true },
    { name: "Done", cards: 2 },
  ];
  return (
    <Frame label="Next.js · Socket.io">
      <Window title="flowboard / sprint-12" className="w-full max-w-[460px]">
        <div className="grid grid-cols-3 gap-2">
          {cols.map((col) => (
            <div key={col.name} className="rounded-lg bg-white/[0.03] p-2">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-wider text-white/40">{col.name}</span>
                <span className="text-[8px] text-white/30">{col.cards}</span>
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: col.cards }, (_, i) => (
                  <div
                    key={i}
                    className={`rounded-md border p-2 ${col.live && i === 0 ? "border-accent/60 bg-accent/10" : "border-white/5 bg-[#1a2864]"}`}
                  >
                    <Line w={i % 2 ? "60%" : "85%"} />
                    <div className="mt-2 flex items-center justify-between">
                      <span className={`h-1.5 w-6 rounded-full ${i === 0 ? "bg-accent/70" : "bg-white/10"}`} />
                      <span className="h-3 w-3 rounded-full bg-white/15" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[8px] text-white/40">3 teammates editing live</span>
        </div>
      </Window>
    </Frame>
  );
}

function FoodoxCover() {
  const orders = [
    { id: "#1042", status: "Preparing", tone: "accent" as const },
    { id: "#1041", status: "Ready", tone: "solid" as const },
    { id: "#1040", status: "Delivered", tone: "muted" as const },
  ];
  return (
    <Frame label="Next.js · Convex · AWS">
      <div className="relative w-full max-w-[440px]">
        <Window title="foodox / orders">
          <div className="mb-3 grid grid-cols-3 gap-2">
            {["Orders", "Revenue", "Customers"].map((k, i) => (
              <div key={k} className="rounded-lg bg-white/[0.04] p-2">
                <p className="font-mono text-[7px] uppercase tracking-wider text-white/35">{k}</p>
                <p className="mt-1 font-display text-sm font-bold">{["128", "₹42k", "86"][i]}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-md bg-[#1a2864] px-2.5 py-2">
                <span className="font-mono text-[9px] text-white/60">{o.id}</span>
                <Line w="35%" />
                <Pill tone={o.tone}>{o.status}</Pill>
              </div>
            ))}
          </div>
        </Window>
        <div className="absolute -bottom-6 -right-4 flex max-w-[180px] items-start gap-2 rounded-2xl rounded-br-sm bg-accent p-2.5 shadow-xl">
          <Bot size={14} className="mt-0.5 shrink-0" />
          <p className="text-[9px] leading-snug">Your order #1042 will be ready in 8 minutes.</p>
        </div>
      </div>
    </Frame>
  );
}

function InventoryCover() {
  return (
    <Frame label="LLM pipeline · RAG">
      <div className="flex w-full max-w-[480px] items-center gap-3">
        <div className="w-[34%] -rotate-3 rounded-xl border border-white/10 bg-[#f1f2f5] p-3 text-bg shadow-xl">
          <FileText size={14} className="text-bg/50" />
          <p className="mt-2 font-display text-[10px] font-bold">Seller catalog.pdf</p>
          <div className="mt-2 space-y-1">
            {[80, 60, 70, 50, 65].map((w, i) => (
              <div key={i} className="h-1 rounded-full bg-bg/15" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent shadow-[0_0_24px_rgba(111,136,184,0.6)]">
            <Sparkles size={14} />
          </span>
          <span className="font-mono text-[7px] uppercase tracking-wider text-white/40">AI parse</span>
        </div>
        <Window title="inventory sync" className="flex-1">
          <div className="space-y-1.5">
              <div className="grid grid-cols-[1fr_2fr_1fr] gap-2 font-mono text-[7px] uppercase tracking-wider text-white/35">
                <span>SKU</span>
                <span>Item</span>
                <span>Qty</span>
              </div>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-[1fr_2fr_1fr] items-center gap-2 rounded bg-white/[0.03] px-1 py-1.5">
                  <span className="font-mono text-[8px] text-accent">A-{204 + i}</span>
                  <Line w={`${60 + i * 8}%`} />
                  <span className="font-mono text-[8px] text-white/60">{[24, 8, 56, 12][i]}</span>
                </div>
              ))}
              <div className="flex justify-end pt-1">
                <Pill tone="accent">Synced to Qoyod</Pill>
              </div>
            </div>
        </Window>
      </div>
    </Frame>
  );
}

function LawCover() {
  return (
    <Frame label="RAG · Arabic / English">
      <div className="w-full max-w-[460px] space-y-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#13205a] px-4 py-2.5">
          <Search size={13} className="text-accent" />
          <span className="text-[11px] text-white/60">termination clause in the client's lease</span>
          <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[8px] font-medium">Analyze</span>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr] gap-3">
          <Window title="case_2291.pdf">
            <div className="space-y-1.5">
              <Line w="90%" />
              <Line w="75%" />
              <div className="rounded bg-accent/20 px-1 py-1">
                <Line w="95%" className="bg-accent/60" />
                <Line w="70%" className="mt-1 bg-accent/60" />
              </div>
              <Line w="85%" />
              <Line w="60%" />
            </div>
          </Window>
          <div className="space-y-2">
            {[
              { label: "Ruling match", v: 92 },
              { label: "Opposition risk", v: 34 },
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-white/10 bg-[#13205a] p-2.5">
                <p className="font-mono text-[7px] uppercase tracking-wider text-white/40">{m.label}</p>
                <p className="mt-1 font-display text-lg font-bold">{m.v}%</p>
                <div className="mt-1 h-1 rounded-full bg-white/10">
                  <div className="h-1 rounded-full bg-accent" style={{ width: `${m.v}%` }} />
                </div>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-white/40">
              <Scale size={12} />
              <span className="font-mono text-[8px]">14 similar cases</span>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function ItsmCover() {
  const tickets = [
    { t: "Laptop provisioning", s: "Open", tone: "accent" as const },
    { t: "VPN access request", s: "Approved", tone: "solid" as const },
    { t: "License renewal", s: "Pending", tone: "muted" as const },
    { t: "New hire onboarding", s: "Open", tone: "accent" as const },
  ];
  return (
    <Frame label="Entra SSO · Algolia">
      <Window title="service desk" className="w-full max-w-[460px]">
        <div className="grid grid-cols-[90px_1fr] gap-3">
          <div className="space-y-1.5 border-r border-white/5 pr-3">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-5 w-5 rounded-full bg-accent" />
              <div>
                <p className="text-[8px] font-medium">Admin</p>
                <p className="font-mono text-[6px] text-white/35">role · IT</p>
              </div>
            </div>
            {["Tickets", "Approvals", "Assets", "Reports"].map((n, i) => (
              <div key={n} className={`rounded px-1.5 py-1 text-[8px] ${i === 0 ? "bg-accent/15 text-accent" : "text-white/40"}`}>
                {n}
              </div>
            ))}
          </div>
          <div className="space-y-1.5">
            {tickets.map((tk, i) => (
              <div key={tk.t} className="flex items-center gap-2 rounded-md bg-[#1a2864] px-2 py-1.5">
                <Ticket size={10} className="shrink-0 text-white/40" />
                <span className="truncate text-[9px] text-white/75">{tk.t}</span>
                <span className="ml-auto font-mono text-[7px] text-white/30">#{318 - i}</span>
                <Pill tone={tk.tone}>{tk.s}</Pill>
              </div>
            ))}
            <div className="flex items-center gap-1.5 rounded-md border border-dashed border-accent/40 px-2 py-1.5">
              <Sparkles size={10} className="text-accent" />
              <span className="text-[8px] text-white/50">AI suggests: route to Network team</span>
            </div>
          </div>
        </div>
      </Window>
    </Frame>
  );
}

function SyncPlayCover() {
  const bars = [30, 55, 80, 45, 95, 60, 75, 40, 88, 50, 70, 35, 90, 58, 66, 42, 82, 48, 72, 38];
  return (
    <Frame label="Real-time · TypeScript">
      <div className="w-full max-w-[440px] rounded-3xl border border-white/10 bg-[#13205a] p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {["bg-accent", "bg-white/70", "bg-accent/50", "bg-white/30"].map((c, i) => (
              <span key={i} className={`h-6 w-6 rounded-full border-2 border-[#13205a] ${c}`} />
            ))}
          </div>
          <Pill tone="accent">4 listening together</Pill>
        </div>
        <div className="mt-5 flex h-16 items-end gap-[3px]">
          {bars.map((h, i) => (
            <span key={i} className={`flex-1 rounded-full ${i < 9 ? "bg-accent" : "bg-white/15"}`} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="font-display text-sm font-bold">Midnight Drive</p>
            <p className="text-[10px] text-white/40">in sync · 1:42 / 3:58</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
            <Play size={16} fill="currentColor" />
          </span>
        </div>
      </div>
    </Frame>
  );
}

function ScrollFaceCover() {
  return (
    <Frame label="Python · computer vision">
      <div className="flex w-full max-w-[440px] items-center justify-center gap-6">
        <div className="relative flex h-40 w-32 items-center justify-center">
          <svg viewBox="0 0 100 120" className="h-full w-full text-white/70" fill="none" stroke="currentColor" strokeWidth="1.5">
            <ellipse cx="50" cy="58" rx="34" ry="44" strokeDasharray="3 3" />
            <circle cx="37" cy="50" r="3" fill="currentColor" />
            <circle cx="63" cy="50" r="3" fill="currentColor" />
            <path d="M40 78 Q50 85 60 78" />
            {[
              [16, 20],
              [84, 20],
              [16, 100],
              [84, 100],
            ].map(([x, y], i) => (
              <path
                key={i}
                d={`M${x} ${y + (y < 60 ? 8 : -8)} V${y} H${x + (x < 50 ? 8 : -8)}`}
                className="text-accent"
                stroke="currentColor"
                strokeWidth="2.5"
              />
            ))}
          </svg>
          <span className="absolute -right-2 top-6 rounded-full bg-accent px-2 py-0.5 font-mono text-[8px]">tilt ↓</span>
        </div>
        <Window title="article.html" className="w-44">
          <div className="relative h-32 overflow-hidden">
            <div className="space-y-2">
              {[90, 70, 85, 60, 80, 75, 50, 88, 65].map((w, i) => (
                <Line key={i} w={`${w}%`} className={i === 4 ? "bg-accent/60" : ""} />
              ))}
            </div>
            <div className="absolute right-0 top-6 h-10 w-1 rounded-full bg-accent" />
          </div>
        </Window>
      </div>
    </Frame>
  );
}

function DashboardCover() {
  const bars = [42, 58, 50, 72, 64, 88];
  return (
    <Frame label="MCP · Dynamics 365">
      <div className="relative w-full max-w-[460px]">
        <div className="mb-3 ml-auto flex w-fit max-w-[75%] items-start gap-2 rounded-2xl rounded-br-sm bg-accent px-3 py-2 shadow-xl">
          <p className="text-[10px] leading-snug">prepare the FY2026 finance report</p>
        </div>
        <Window title="ai-dashboard / fy2026-finance">
          <div className="mb-3 grid grid-cols-4 gap-1.5">
            {["Revenue", "Invoices", "Avg deal", "Margin"].map((k, i) => (
              <div key={k} className="rounded-lg bg-white/[0.04] p-1.5">
                <p className="font-mono text-[6px] uppercase tracking-wider text-white/35">{k}</p>
                <p className="mt-0.5 font-display text-[11px] font-bold">{["4.2M", "1,284", "32k", "18%"][i]}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[1.6fr_1fr] gap-2">
            <div className="flex h-16 items-end gap-1.5 rounded-lg bg-white/[0.03] p-2">
              {bars.map((h, i) => (
                <span key={i} className={`flex-1 rounded-sm ${i === bars.length - 1 ? "bg-accent" : "bg-accent/40"}`} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex items-center justify-center rounded-lg bg-white/[0.03]">
              <span className="h-11 w-11 rounded-full bg-[conic-gradient(rgb(111,136,184)_0_55%,rgba(255,255,255,0.35)_55%_80%,rgba(255,255,255,0.12)_80%)] [mask:radial-gradient(circle,transparent_42%,black_43%)]" />
            </div>
          </div>
        </Window>
        <div className="absolute -bottom-5 -left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#070f33] px-2.5 py-1.5 shadow-xl">
          <ShieldCheck size={11} className="text-accent" />
          <span className="font-mono text-[8px] text-white/60">your Entra role · 50+ tables</span>
        </div>
        <BarChart3 className="absolute -left-2 -top-1 text-accent" size={20} />
      </div>
    </Frame>
  );
}

function OdooCover() {
  return (
    <Frame label="Python · MCP · Twilio">
      <div className="flex w-full max-w-[460px] items-center gap-3">
        <div className="w-[46%] rounded-2xl border border-white/10 bg-[#13205a] p-3 shadow-2xl">
          <div className="mb-2.5 flex items-center gap-1.5 border-b border-white/5 pb-2">
            <MessageCircle size={12} className="text-accent" />
            <span className="text-[9px] font-medium">HR assistant</span>
          </div>
          <div className="space-y-1.5">
            <p className="ml-auto w-fit max-w-[90%] rounded-xl rounded-br-sm bg-accent px-2 py-1.5 text-[8px] leading-snug">Log 6h on Project Atlas today</p>
            <p className="w-fit max-w-[90%] rounded-xl rounded-bl-sm bg-white/[0.06] px-2 py-1.5 text-[8px] leading-snug text-white/75">
              Draft ready. Sent to HR for approval.
            </p>
            <p className="ml-auto w-fit rounded-xl rounded-br-sm bg-accent px-2 py-1.5 text-[8px]">How much leave do I have?</p>
          </div>
        </div>
        <Window title="odoo-mcp · 19 tools" className="flex-1">
          <div className="space-y-1.5">
            {[
              { t: "timesheet.create", s: "Needs HR", tone: "accent" as const },
              { t: "leave.balance", s: "Own records", tone: "muted" as const },
              { t: "invoice.list", s: "Role: finance", tone: "muted" as const },
            ].map((row) => (
              <div key={row.t} className="flex items-center justify-between gap-2 rounded-md bg-[#1a2864] px-2 py-1.5">
                <span className="font-mono text-[8px] text-white/70">{row.t}</span>
                <Pill tone={row.tone}>{row.s}</Pill>
              </div>
            ))}
            <div className="flex items-center gap-1.5 pt-1">
              <Check size={10} className="text-accent" />
              <span className="font-mono text-[7px] text-white/40">every call written to audit log</span>
            </div>
          </div>
        </Window>
      </div>
    </Frame>
  );
}

function PipelineCover() {
  const nodes = [
    { name: "planner", x: "8%", y: "38%", state: "done" },
    { name: "coder", x: "38%", y: "12%", state: "live" },
    { name: "tester", x: "38%", y: "64%", state: "live" },
    { name: "reviewer", x: "70%", y: "38%", state: "idle" },
  ];
  return (
    <Frame label="Next.js · React Flow · SSE">
      <Window title="pipeline / run-482" className="w-full max-w-[460px]">
        <div className="relative h-36">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-white/15" fill="none" stroke="currentColor" strokeWidth="0.6">
            <path d="M24 46 C32 46, 32 22, 40 22" className="text-accent" strokeDasharray="2 2" />
            <path d="M24 46 C32 46, 32 74, 40 74" className="text-accent" strokeDasharray="2 2" />
            <path d="M56 22 C64 22, 64 46, 72 46" />
            <path d="M56 74 C64 74, 64 46, 72 46" />
          </svg>
          {nodes.map((n) => (
            <div
              key={n.name}
              className={`absolute flex w-[22%] items-center gap-1.5 rounded-lg border px-2 py-1.5 ${
                n.state === "live" ? "border-accent/60 bg-accent/10" : n.state === "done" ? "border-white/10 bg-[#1a2864]" : "border-white/5 bg-white/[0.02]"
              }`}
              style={{ left: n.x, top: n.y }}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${n.state === "idle" ? "bg-white/20" : "bg-accent"} ${n.state === "live" ? "animate-pulse" : ""}`} />
              <span className="truncate font-mono text-[8px] text-white/70">{n.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-1.5 border-t border-white/5 pt-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="font-mono text-[8px] text-white/40">streaming hook events · PostToolUse → tester</span>
        </div>
      </Window>
    </Frame>
  );
}

const covers: Record<CoverKey, () => React.JSX.Element> = {
  lyrics: LyricsCover,
  dashboard: DashboardCover,
  odoo: OdooCover,
  pipeline: PipelineCover,
  flowboard: FlowboardCover,
  foodox: FoodoxCover,
  inventory: InventoryCover,
  law: LawCover,
  itsm: ItsmCover,
  syncplay: SyncPlayCover,
  scrollface: ScrollFaceCover,
};

export function ProjectCover({ cover }: { cover: CoverKey }) {
  const Cover = covers[cover];
  return <Cover />;
}
