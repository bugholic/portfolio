import { motion } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { profile } from "../data/profile";

const ease = [0.22, 1, 0.36, 1] as const;

const VIEW_W = 640;
const VIEW_H = 600;

type Spot = {
  id: string;
  title: string;
  note: string;
  /** Tooltip anchor in viewBox units (top-centre of the object) */
  at: [number, number];
  href?: string;
  download?: boolean;
  external?: boolean;
  cta?: string;
};

// Each hoverable object in the room. Edit titles/notes to taste.
const spots: Record<string, Spot> = {
  music: {
    id: "music",
    title: "Music on loop",
    note: "The reason Lyrics Overlay and SyncPlay exist.",
    at: [191, 62],
  },
  plant: {
    id: "plant",
    title: "Always growing",
    note: "Picking up something new every sprint.",
    at: [319, 40],
  },
  games: {
    id: "games",
    title: "Gamer after hours",
    note: "Boss fights beat merge conflicts.",
    at: [447, 60],
  },
  books: {
    id: "books",
    title: "Reading list",
    note: "System design, docs and the odd novel.",
    at: [191, 152],
  },
  mascot: {
    id: "mascot",
    title: "Meet Bugholic",
    note: "The bug who fixes bugs.",
    at: [319, 152],
    href: profile.socials.github,
    external: true,
    cta: "Say hi on GitHub",
  },
  cube: {
    id: "cube",
    title: "Problem solver",
    note: "Untangling messy requirements into clean plans.",
    at: [447, 160],
  },
  laptop: {
    id: "laptop",
    title: "My resume",
    note: "Everything on one page.",
    at: [167, 366],
    href: profile.cvUrl,
    download: true,
    cta: "Download CV",
  },
  monitor: {
    id: "monitor",
    title: "Currently shipping",
    note: "Web, mobile and AI-powered products.",
    at: [392, 262],
    href: "#projects",
    cta: "See the work",
  },
  hire: {
    id: "hire",
    title: "Available for freelance",
    note: "Open to new projects and collaborations.",
    at: [320, 436],
    href: "#contact",
    cta: "Let's talk",
  },
  mug: {
    id: "mug",
    title: "Fuel",
    note: "Powered by chai and curiosity.",
    at: [477, 394],
  },
  me: {
    id: "me",
    title: "Hey, that's me",
    note: `${profile.role} at ${profile.company}, ${profile.location.split(",")[0]}.`,
    at: [320, 302],
    href: "#about",
    cta: "More about me",
  },
};

const codeLines = [
  { indent: 0, w: 70, c: "#7aa2ff" },
  { indent: 1, w: 110, c: "#e8eaf0" },
  { indent: 2, w: 60, c: "#9ef0c0" },
  { indent: 2, w: 96, c: "#f7c66b" },
  { indent: 1, w: 40, c: "#e8eaf0" },
  { indent: 1, w: 120, c: "#7aa2ff" },
  { indent: 2, w: 84, c: "#9ef0c0" },
  { indent: 0, w: 30, c: "#e8eaf0" },
  { indent: 0, w: 100, c: "#f7c66b" },
];

/** Sticker grid for one face of the isometric cube, via bilinear interpolation of its corners */
function cubeFace(corners: [number, number][], fill: string) {
  const [a, b, c, d] = corners;
  const lerp = (
    p: [number, number],
    q: [number, number],
    t: number,
  ): [number, number] => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const pt = (u: number, v: number) => lerp(lerp(a, b, u), lerp(d, c, u), v);
  const cells: ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const inset = 0.06;
      const pts = [
        pt(i / 3 + inset, j / 3 + inset),
        pt((i + 1) / 3 - inset, j / 3 + inset),
        pt((i + 1) / 3 - inset, (j + 1) / 3 - inset),
        pt(i / 3 + inset, (j + 1) / 3 - inset),
      ];
      cells.push(
        <polygon
          key={`${i}${j}`}
          points={pts.map((p) => p.join(",")).join(" ")}
          fill={fill}
        />,
      );
    }
  }
  return cells;
}

export function HeroWorkspace() {
  const [active, setActive] = useState<string | null>(null);
  const pointerType = useRef<string>("mouse");

  function open(spot: Spot) {
    if (!spot.href) return;
    if (spot.download) {
      const a = document.createElement("a");
      a.href = spot.href;
      a.download = "";
      a.click();
    } else if (spot.external) {
      window.open(spot.href, "_blank", "noopener,noreferrer");
    } else {
      window.location.hash = spot.href;
    }
  }

  // Wraps an object so it lifts on hover/focus, dims its neighbours and shows a label.
  // On touch the first tap shows the label and a second tap follows the link.
  function hot(id: keyof typeof spots, children: ReactNode, delay = 0) {
    const spot = spots[id];
    const isActive = active === id;
    return (
      <motion.g
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay, ease }}
      >
        <g
          className={`hot ${isActive ? "is-active" : ""} ${spot.href ? "cursor-pointer" : "cursor-help"}`}
          role={spot.href ? "link" : "img"}
          tabIndex={0}
          aria-label={`${spot.title}: ${spot.note}${spot.cta ? ` ${spot.cta}.` : ""}`}
          onPointerDown={(e) => (pointerType.current = e.pointerType)}
          onPointerEnter={(e) => e.pointerType === "mouse" && setActive(id)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
          onFocus={() => setActive(id)}
          onBlur={() => setActive(null)}
          onClick={() => {
            if (pointerType.current !== "mouse" && active !== id) {
              setActive(id);
              return;
            }
            open(spot);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open(spot);
            }
          }}
        >
          {children}
        </g>
      </motion.g>
    );
  }

  const current = active ? spots[active] : null;

  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={`workspace block h-auto w-full overflow-visible ${active ? "has-active" : ""} ${active === "me" ? "me-turned" : ""}`}
        role="group"
        aria-label={`Illustration of ${profile.name} at a desk. Hover or tap the objects to learn more.`}
        onClick={(e) => e.target === e.currentTarget && setActive(null)}
      >
        <defs>
          <radialGradient id="ws-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d6bff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#3d6bff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ws-screen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#13204d" />
            <stop offset="100%" stopColor="#0c1330" />
          </linearGradient>
          <linearGradient id="ws-cubby" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#121317" />
            <stop offset="100%" stopColor="#1b1d23" />
          </linearGradient>
          <linearGradient id="ws-tee" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d6c9ab" />
            <stop offset="45%" stopColor="#ece1c6" />
            <stop offset="100%" stopColor="#cbbd9e" />
          </linearGradient>
          <linearGradient id="ws-laptop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dfe6ff" />
            <stop offset="100%" stopColor="#b8c6f5" />
          </linearGradient>
          <pattern
            id="ws-mesh"
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <rect width="6" height="6" fill="#454a56" />
            <path d="M0 0L6 6M6 0L0 6" stroke="#525866" strokeWidth="1" />
          </pattern>
        </defs>

        {/* ---------- Shelf ---------- */}
        <motion.g
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease }}
        >
          <rect
            x="114"
            y="16"
            width="412"
            height="222"
            rx="16"
            fill="#000"
            opacity="0.35"
            transform="translate(0 8)"
          />
          <rect
            x="120"
            y="20"
            width="400"
            height="210"
            rx="14"
            fill="#2a2d35"
          />
          <rect x="120" y="20" width="400" height="4" rx="2" fill="#363a44" />
          {[132, 260, 388].map((x) =>
            [32, 130].map((y) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width="118"
                height="88"
                rx="8"
                fill="url(#ws-cubby)"
              />
            )),
          )}
        </motion.g>

        {/* Music: records + headphones */}
        <g transform="translate(191 120)">
          {hot(
            "music",
            <>
              <circle cx="-14" cy="-32" r="25" fill="#0b0b0d" />
              <circle
                cx="-14"
                cy="-32"
                r="18"
                fill="none"
                stroke="#24252b"
                strokeWidth="1"
              />
              <circle cx="-14" cy="-32" r="7" fill="#f7c66b" />
              <rect
                x="-52"
                y="-58"
                width="44"
                height="58"
                rx="3"
                fill="#2c49b8"
              />
              <circle
                cx="-30"
                cy="-29"
                r="11"
                fill="none"
                stroke="#7aa2ff"
                strokeWidth="2"
                opacity="0.7"
              />
              <path
                d="M12 -8 C12 -48, 52 -48, 52 -8"
                stroke="#d9dbe1"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
              <rect
                x="5"
                y="-24"
                width="14"
                height="24"
                rx="6"
                fill="#3d6bff"
              />
              <rect
                x="45"
                y="-24"
                width="14"
                height="24"
                rx="6"
                fill="#3d6bff"
              />
            </>,
            0.5,
          )}
        </g>

        {/* Plant */}
        <g transform="translate(319 120)">
          {hot(
            "plant",
            <>
              <g className="leaf-sway">
                <path
                  d="M0 -32 C-4 -44 -12 -50 -20 -54 M0 -32 L1 -62 M0 -32 C6 -42 14 -48 22 -52"
                  stroke="#2f8f55"
                  strokeWidth="2.5"
                  fill="none"
                />
                <ellipse
                  cx="-22"
                  cy="-54"
                  rx="15"
                  ry="7"
                  fill="#3fae6a"
                  transform="rotate(-30 -22 -54)"
                />
                <ellipse
                  cx="22"
                  cy="-52"
                  rx="15"
                  ry="7"
                  fill="#2f8f55"
                  transform="rotate(30 22 -52)"
                />
                <ellipse cx="1" cy="-64" rx="8" ry="15" fill="#46c077" />
                <ellipse
                  cx="-12"
                  cy="-42"
                  rx="11"
                  ry="5.5"
                  fill="#2f8f55"
                  transform="rotate(-18 -12 -42)"
                />
                <ellipse
                  cx="13"
                  cy="-40"
                  rx="11"
                  ry="5.5"
                  fill="#3fae6a"
                  transform="rotate(18 13 -40)"
                />
              </g>
              <path d="M-19 0 L19 0 L23 -28 L-23 -28 Z" fill="#c96f4a" />
              <rect
                x="-26"
                y="-34"
                width="52"
                height="8"
                rx="3"
                fill="#dd8a62"
              />
            </>,
            0.58,
          )}
        </g>

        {/* Games: controller on a stack of cases */}
        <g transform="translate(447 120)">
          {hot(
            "games",
            <>
              <rect
                x="-42"
                y="-10"
                width="84"
                height="10"
                rx="2"
                fill="#3d6bff"
              />
              <rect
                x="-38"
                y="-20"
                width="78"
                height="10"
                rx="2"
                fill="#e5484d"
              />
              <rect
                x="-44"
                y="-30"
                width="86"
                height="10"
                rx="2"
                fill="#3a3e48"
              />
              <path
                d="M-30 -31 C-41 -31 -46 -50 -37 -58 C-29 -64 -19 -58 -11 -58 L11 -58 C19 -58 29 -64 37 -58 C46 -50 41 -31 30 -31 C22 -31 18 -41 10 -41 L-10 -41 C-18 -41 -22 -31 -30 -31 Z"
                fill="#d9dbe1"
              />
              <rect
                x="-28"
                y="-51.5"
                width="11"
                height="3.5"
                rx="1"
                fill="#3a3e48"
              />
              <rect
                x="-24.25"
                y="-55.25"
                width="3.5"
                height="11"
                rx="1"
                fill="#3a3e48"
              />
              <circle cx="21" cy="-54" r="2.6" fill="#3d6bff" />
              <circle cx="26" cy="-49.5" r="2.6" fill="#e5484d" />
              <circle cx="16" cy="-49.5" r="2.6" fill="#3fae6a" />
              <circle cx="21" cy="-45" r="2.6" fill="#f7c66b" />
            </>,
            0.66,
          )}
        </g>

        {/* Books */}
        <g transform="translate(191 218)">
          {hot(
            "books",
            <>
              {
                (
                  [
                    [12, 62, "#3d6bff"],
                    [10, 54, "#e5484d"],
                    [14, 66, "#f7c66b"],
                    [9, 50, "#3fae6a"],
                    [12, 58, "#d9dbe1"],
                    [11, 62, "#8b5cf6"],
                  ] as const
                ).reduce<{ x: number; nodes: ReactNode[] }>(
                  (acc, [w, h, c], i) => {
                    acc.nodes.push(
                      <g key={i}>
                        <rect
                          x={acc.x}
                          y={-h}
                          width={w}
                          height={h}
                          rx="1.5"
                          fill={c}
                        />
                        <rect
                          x={acc.x + 2}
                          y={-h + 8}
                          width={w - 4}
                          height="3"
                          fill="#000"
                          opacity="0.18"
                        />
                      </g>,
                    );
                    acc.x += w + 1.5;
                    return acc;
                  },
                  { x: -50, nodes: [] },
                ).nodes
              }
              <rect
                x="0"
                y="-56"
                width="12"
                height="56"
                rx="1.5"
                fill="#2c49b8"
                transform="translate(26 0) rotate(16)"
              />
            </>,
            0.74,
          )}
        </g>

        {/* Mascot: Bugholic figurine on a plinth */}
        <g transform="translate(319 218)">
          {hot(
            "mascot",
            <>
              <rect
                x="-28"
                y="-10"
                width="56"
                height="10"
                rx="3"
                fill="#3a3e48"
              />
              <path
                d="M-6 -66 C-10 -74 -16 -76 -20 -74 M6 -66 C10 -74 16 -76 20 -74"
                stroke="#9aa6c8"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="-20" cy="-74" r="2.5" fill="#f7c66b" />
              <circle cx="20" cy="-74" r="2.5" fill="#f7c66b" />
              <path
                d="M-16 -30 L-26 -20 M16 -30 L26 -20 M-17 -40 L-28 -40 M17 -40 L28 -40"
                stroke="#1d2f7a"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <ellipse cx="0" cy="-34" rx="18" ry="23" fill="#3d6bff" />
              <path d="M0 -55 L0 -12" stroke="#1d2f7a" strokeWidth="2" />
              <circle cx="-8" cy="-34" r="3.5" fill="#1d2f7a" />
              <circle cx="8" cy="-26" r="3" fill="#1d2f7a" />
              <circle cx="7" cy="-42" r="2.5" fill="#1d2f7a" />
              <circle cx="0" cy="-58" r="11" fill="#1d2f7a" />
              <circle cx="-4" cy="-59" r="3" fill="#fff" />
              <circle cx="4" cy="-59" r="3" fill="#fff" />
              <circle cx="-3.5" cy="-58.5" r="1.4" fill="#111215" />
              <circle cx="4.5" cy="-58.5" r="1.4" fill="#111215" />
            </>,
            0.82,
          )}
        </g>

        {/* Puzzle cube */}
        <g transform="translate(447 218)">
          {hot(
            "cube",
            <>
              <polygon points="0,-64 32,-48 0,-32 -32,-48" fill="#111215" />
              <polygon points="-32,-48 0,-32 0,4 -32,-12" fill="#111215" />
              <polygon points="0,-32 32,-48 32,-12 0,4" fill="#111215" />
              {cubeFace(
                [
                  [-32, -48],
                  [0, -64],
                  [32, -48],
                  [0, -32],
                ],
                "#f7c66b",
              )}
              {cubeFace(
                [
                  [-32, -48],
                  [0, -32],
                  [0, 4],
                  [-32, -12],
                ],
                "#e5484d",
              )}
              {cubeFace(
                [
                  [0, -32],
                  [32, -48],
                  [32, -12],
                  [0, 4],
                ],
                "#3d6bff",
              )}
            </>,
            0.9,
          )}
        </g>

        {/* ---------- Desk scene ---------- */}
        {/* Monitor light spilling onto the wall */}
        <ellipse
          cx="320"
          cy="330"
          rx="200"
          ry="120"
          fill="url(#ws-glow)"
          opacity="0.6"
        />

        {hot(
          "monitor",
          <>
            <rect
              x="226"
              y="262"
              width="188"
              height="130"
              rx="9"
              fill="#22252c"
            />
            <rect
              x="232"
              y="268"
              width="176"
              height="118"
              rx="5"
              fill="url(#ws-screen)"
            />
            <circle cx="241" cy="276" r="2" fill="#e5484d" />
            <circle cx="248" cy="276" r="2" fill="#f7c66b" />
            <circle cx="255" cy="276" r="2" fill="#3fae6a" />
            {codeLines.map((l, i) => (
              <rect
                key={i}
                className="code-line"
                style={{ animationDelay: `${i * 0.45}s` }}
                x={242 + l.indent * 10}
                y={286 + i * 10}
                width={l.w}
                height="4"
                rx="2"
                fill={l.c}
                opacity="0.85"
              />
            ))}
            <rect x="312" y="392" width="16" height="38" fill="#2a2d35" />
            <rect x="288" y="428" width="64" height="8" rx="3" fill="#2a2d35" />
            <g transform="rotate(8 404 270)">
              <rect
                x="392"
                y="256"
                width="26"
                height="24"
                rx="2"
                fill="#f7c66b"
              />
              <text
                x="405"
                y="271"
                textAnchor="middle"
                fontSize="6.5"
                fontWeight="700"
                fill="#5c4512"
                fontFamily="var(--font-mono)"
              >
                ship it
              </text>
            </g>
          </>,
          1.0,
        )}

        {/* Desk */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
        >
          <rect x="90" y="436" width="460" height="15" rx="4" fill="#2f333c" />
          <rect x="90" y="436" width="460" height="3" rx="1.5" fill="#3d424e" />
          <rect
            x="100"
            y="451"
            width="118"
            height="137"
            rx="4"
            fill="#23262d"
          />
          <rect x="110" y="462" width="98" height="54" rx="4" fill="#292c34" />
          <rect x="110" y="524" width="98" height="54" rx="4" fill="#292c34" />
          <rect x="146" y="486" width="26" height="4" rx="2" fill="#4a4f5b" />
          <rect x="146" y="548" width="26" height="4" rx="2" fill="#4a4f5b" />
          <rect x="524" y="451" width="16" height="137" rx="3" fill="#23262d" />
          <path
            d="M60 596 H580"
            stroke="#ffffff"
            strokeOpacity="0.07"
            strokeWidth="2"
          />
        </motion.g>

        {/* Laptop */}
        {hot(
          "laptop",
          <>
            <rect
              x="126"
              y="368"
              width="82"
              height="62"
              rx="5"
              fill="#2a2d35"
            />
            <rect
              x="131"
              y="373"
              width="72"
              height="52"
              rx="3"
              fill="url(#ws-laptop)"
            />
            <text
              x="139"
              y="388"
              fontSize="9"
              fontWeight="800"
              fill="#1d2f7a"
              fontFamily="var(--font-display)"
            >
              CV
            </text>
            <rect
              x="139"
              y="394"
              width="50"
              height="3"
              rx="1.5"
              fill="#1d2f7a"
              opacity="0.5"
            />
            <rect
              x="139"
              y="401"
              width="40"
              height="3"
              rx="1.5"
              fill="#1d2f7a"
              opacity="0.35"
            />
            <rect
              x="139"
              y="408"
              width="54"
              height="3"
              rx="1.5"
              fill="#1d2f7a"
              opacity="0.35"
            />
            <rect
              x="139"
              y="415"
              width="30"
              height="3"
              rx="1.5"
              fill="#3d6bff"
            />
            <path d="M118 437 L216 437 L208 429 L126 429 Z" fill="#4a4f5b" />
          </>,
          1.05,
        )}

        {/* Mug */}
        {hot(
          "mug",
          <>
            <path
              className="steam"
              d="M470 398 C466 390 474 386 470 378"
              stroke="#ffffff"
              strokeOpacity="0.35"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              className="steam steam-2"
              d="M482 398 C478 390 486 386 482 378"
              stroke="#ffffff"
              strokeOpacity="0.35"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M492 412 C505 412 505 429 492 429"
              stroke="#3d6bff"
              strokeWidth="5"
              fill="none"
            />
            <rect
              x="462"
              y="403"
              width="31"
              height="33"
              rx="5"
              fill="#3d6bff"
            />
            <text
              x="477.5"
              y="424"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#fff"
              fontFamily="var(--font-mono)"
            >
              {"</>"}
            </text>
          </>,
          1.1,
        )}

        {/* Me, from behind, in the chair */}
        {hot(
          "me",
          <>
            {/* chair base */}
            <rect x="314" y="552" width="12" height="30" fill="#2a2d35" />
            <path
              d="M320 584 L268 592 M320 584 L372 592 M320 584 L298 597 M320 584 L342 597"
              stroke="#2a2d35"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {[268, 372, 298, 342].map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy={i < 2 ? 594 : 598}
                r="4.5"
                fill="#1b1d22"
              />
            ))}
            <ellipse cx="320" cy="548" rx="72" ry="12" fill="#2a2d35" />

            {/* Fixed hit area so hover doesn't flicker while the views flip */}
            <rect
              x="236"
              y="294"
              width="210"
              height="306"
              fill="#000"
              fillOpacity="0"
            />

            {/* Back view: flips away on hover */}
            <g className="view view-back">
              {/* head */}
              <ellipse cx="289" cy="343" rx="5" ry="8" fill="#8a5a3c" />
              <ellipse cx="351" cy="343" rx="5" ry="8" fill="#8a5a3c" />
              <rect
                x="307"
                y="356"
                width="26"
                height="24"
                rx="6"
                fill="#7a4e33"
              />
              <g className="head-bob">
                <circle cx="320" cy="336" r="31" fill="#17110e" />
                {[
                  [296, 318],
                  [306, 309],
                  [320, 305],
                  [334, 309],
                  [344, 318],
                  [292, 332],
                  [348, 332],
                ].map(([cx, cy]) => (
                  <circle
                    key={`${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r="9"
                    fill="#17110e"
                  />
                ))}
                <path
                  d="M300 322 C310 316 330 316 340 322"
                  stroke="#2b211b"
                  strokeWidth="2"
                  fill="none"
                />
              </g>

              {/* torso + backpack straps */}
              <path
                d="M246 472 C246 412 262 384 300 376 L340 376 C378 384 394 412 394 472 Z"
                fill="url(#ws-tee)"
              />
              <path
                d="M302 376 C310 385 330 385 338 376"
                stroke="#bfb193"
                strokeWidth="3"
                fill="none"
              />
              <ellipse cx="252" cy="420" rx="14" ry="24" fill="#d2c5a6" />
              <ellipse cx="388" cy="420" rx="14" ry="24" fill="#d2c5a6" />
              <ellipse cx="246" cy="452" rx="9" ry="12" fill="#8a5a3c" />
              <ellipse cx="394" cy="452" rx="9" ry="12" fill="#8a5a3c" />
              <path
                d="M286 382 C280 410 276 440 274 472"
                stroke="#1c1d22"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M354 382 C360 410 364 440 366 472"
                stroke="#1c1d22"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />

              {/* chair back */}
              <rect
                x="264"
                y="418"
                width="112"
                height="124"
                rx="28"
                fill="#3a3e48"
              />
              <rect
                x="274"
                y="428"
                width="92"
                height="104"
                rx="20"
                fill="url(#ws-mesh)"
              />
              <rect
                x="282"
                y="500"
                width="76"
                height="14"
                rx="7"
                fill="#4a4f5b"
              />
              <rect
                x="244"
                y="470"
                width="24"
                height="8"
                rx="4"
                fill="#3a3e48"
              />
              <rect
                x="372"
                y="470"
                width="24"
                height="8"
                rx="4"
                fill="#3a3e48"
              />
              <rect x="253" y="478" width="6" height="64" fill="#2a2d35" />
              <rect x="381" y="478" width="6" height="64" fill="#2a2d35" />
            </g>

            {/* Front view: swivels in on hover, smiles and waves */}
            <g className="view view-front">
              {/* chair back behind him + armrests */}
              <rect
                x="264"
                y="418"
                width="112"
                height="124"
                rx="28"
                fill="#3a3e48"
              />
              <rect
                x="244"
                y="470"
                width="24"
                height="8"
                rx="4"
                fill="#3a3e48"
              />
              <rect x="253" y="478" width="6" height="64" fill="#2a2d35" />
              <rect x="381" y="478" width="6" height="64" fill="#2a2d35" />

              {/* legs in jeans, knees toward us */}
              <rect
                x="289"
                y="530"
                width="24"
                height="56"
                rx="8"
                fill="#2f3a52"
              />
              <rect
                x="327"
                y="530"
                width="24"
                height="56"
                rx="8"
                fill="#2f3a52"
              />
              <rect
                x="281"
                y="494"
                width="38"
                height="46"
                rx="16"
                fill="#3a4766"
              />
              <rect
                x="321"
                y="494"
                width="38"
                height="46"
                rx="16"
                fill="#3a4766"
              />
              <ellipse cx="299" cy="590" rx="15" ry="6" fill="#e9e6df" />
              <ellipse cx="341" cy="590" rx="15" ry="6" fill="#e9e6df" />

              {/* torso: tee, backpack straps, lanyard + badge */}
              <path
                d="M250 502 C248 430 262 386 300 378 L340 378 C378 386 392 430 390 502 Z"
                fill="url(#ws-tee)"
              />
              <path
                d="M286 382 C282 410 280 440 280 470"
                stroke="#1c1d22"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M354 382 C358 410 360 440 360 470"
                stroke="#1c1d22"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M303 380 L316 440 M337 380 L324 440"
                stroke="#1c1d22"
                strokeWidth="2.5"
                fill="none"
              />
              <rect
                x="309"
                y="438"
                width="22"
                height="28"
                rx="3"
                fill="#f8f8f6"
              />
              <rect
                x="313"
                y="443"
                width="14"
                height="10"
                rx="1.5"
                fill="#3d6bff"
              />
              <rect
                x="313"
                y="456"
                width="14"
                height="2.5"
                rx="1"
                fill="#9aa0ad"
              />

              {/* left arm resting, hand on knee */}
              <ellipse cx="256" cy="414" rx="14" ry="22" fill="#d2c5a6" />
              <path
                d="M252 430 L247 466 L286 494"
                stroke="#8a5a3c"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="244"
                y="470"
                width="20"
                height="7"
                rx="3"
                fill="#f7c66b"
                opacity="0.9"
              />

              {/* right arm: upper arm out, forearm waving */}
              <ellipse cx="384" cy="414" rx="14" ry="22" fill="#d2c5a6" />
              <path
                d="M390 428 L418 436"
                stroke="#8a5a3c"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
              />
              <g className="wave">
                <path
                  d="M418 436 L428 384"
                  stroke="#8a5a3c"
                  strokeWidth="13"
                  fill="none"
                  strokeLinecap="round"
                />
                <ellipse cx="430" cy="372" rx="10" ry="12" fill="#8a5a3c" />
                <ellipse
                  cx="420"
                  cy="378"
                  rx="3.5"
                  ry="6"
                  fill="#8a5a3c"
                  transform="rotate(-30 420 378)"
                />
              </g>

              {/* head: closed-eye smile and beard, like the LEGO portrait */}
              <rect
                x="308"
                y="356"
                width="24"
                height="26"
                rx="6"
                fill="#7a4e33"
              />
              <path
                d="M302 378 C310 390 330 390 338 378"
                stroke="#bfb193"
                strokeWidth="3"
                fill="none"
              />
              <ellipse cx="293" cy="342" rx="5" ry="8" fill="#7a4e33" />
              <ellipse cx="347" cy="342" rx="5" ry="8" fill="#7a4e33" />
              <ellipse cx="320" cy="338" rx="27" ry="31" fill="#8a5a3c" />
              <path
                d="M291 336 C288 306 304 295 320 295 C337 295 352 306 349 336 C345 320 334 313 320 313 C306 313 295 320 291 336 Z"
                fill="#17110e"
              />
              <path
                d="M295 340 C296 364 308 372 320 372 C332 372 344 364 345 340 C341 355 332 360 320 360 C308 360 299 355 295 340 Z"
                fill="#2a1d16"
              />
              <path
                d="M309 352 C314 348 326 348 331 352"
                stroke="#2a1d16"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M313 357 C317 362 323 362 327 357"
                stroke="#f4e7dc"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M304 337 C307 333 312 333 315 337 M325 337 C328 333 333 333 336 337"
                stroke="#17110e"
                strokeWidth="2.2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M303 327 L314 326 M326 326 L337 327"
                stroke="#17110e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          </>,
          0.95,
        )}

        {/* "Available for freelance" sign hung on the chair back */}
        {hot(
          "hire",
          <g className="sign-swing">
            <g transform="translate(320 423) scale(1.25) translate(-320 -423)">
              <path
                d="M296 442 L320 424 L344 442"
                stroke="#9aa0ad"
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="320" cy="423" r="2.5" fill="#c9ced8" />
              <rect
                x="280"
                y="440"
                width="80"
                height="50"
                rx="5"
                fill="#000"
                opacity="0.3"
                transform="translate(0 3)"
              />

              {/* Back face: shown when the sign flips over on hover */}
              <g className="card-face card-back">
                <rect
                  x="280"
                  y="440"
                  width="80"
                  height="50"
                  rx="5"
                  fill="#3d6bff"
                />
                <text
                  x="320"
                  y="463"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="800"
                  fill="#ffffff"
                  fontFamily="var(--font-display)"
                  letterSpacing="0.6"
                >
                  LET'S TALK
                </text>
                <text
                  x="320"
                  y="476"
                  textAnchor="middle"
                  fontSize="6"
                  fontWeight="600"
                  fill="#dfe6ff"
                  fontFamily="var(--font-mono)"
                >
                  hire me →
                </text>
              </g>

              {/* Front face */}
              <g className="card-face card-front">
                <rect
                  x="280"
                  y="440"
                  width="80"
                  height="50"
                  rx="5"
                  fill="#f4f1e8"
                />
                <rect
                  x="284"
                  y="444"
                  width="72"
                  height="42"
                  rx="3"
                  fill="none"
                  stroke="#22c55e"
                  strokeOpacity="0.45"
                  strokeDasharray="3 2"
                />
                <circle
                  className="blink-pulse"
                  cx="320"
                  cy="455"
                  r="5.5"
                  fill="#22c55e"
                />
                <circle
                  className="blink"
                  cx="320"
                  cy="455"
                  r="3"
                  fill="#22c55e"
                />
                <text
                  x="320"
                  y="471"
                  textAnchor="middle"
                  fontSize="8"
                  fontWeight="800"
                  fill="#14532d"
                  fontFamily="var(--font-display)"
                  letterSpacing="0.6"
                >
                  AVAILABLE
                </text>
                <text
                  x="320"
                  y="481"
                  textAnchor="middle"
                  fontSize="6"
                  fontWeight="600"
                  fill="#3f6b4f"
                  fontFamily="var(--font-mono)"
                >
                  for freelance
                </text>
              </g>
            </g>
          </g>,
          1.25,
        )}
      </svg>

      {/* Label for the active object */}
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease }}
          className="pointer-events-none absolute z-20 w-max max-w-[210px] -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-2xl border border-white/10 bg-surface-2/95 px-3.5 py-2.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md"
          style={{
            left: `clamp(110px, ${(current.at[0] / VIEW_W) * 100}%, calc(100% - 110px))`,
            top: `${(current.at[1] / VIEW_H) * 100}%`,
          }}
          role="status"
        >
          <p className="font-display text-sm font-semibold leading-tight text-white">
            {current.title}
          </p>
          <p className="mt-0.5 text-xs leading-5 text-muted">{current.note}</p>
          {current.cta && (
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {current.cta} →
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
