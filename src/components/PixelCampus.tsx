/* Pixel-art campus scenes for the education cards. Every shape sits on an
   integer grid (80 x 48) and renders with crisp edges. */

export type CampusScene = "university" | "college";

type Px = [x: number, y: number, w: number, h: number, fill: string, className?: string];

const C = {
  ground: "#1f2228",
  path: "#2e323b",
  stepDark: "#2a3a78",
  stepLight: "#4a4f5a",
  stone: "#5b6170",
  stoneLight: "#6b7280",
  column: "#c9ccd3",
  columnShade: "#9aa0ab",
  wall: "#2b2f37",
  wallLight: "#343844",
  window: "#9fb6ff",
  windowDim: "#2a3350",
  accent: "#6f88b8",
  accentLight: "#8499c6",
  pole: "#8b8f98",
  bark: "#4a3a30",
  leaf: "#2d5a45",
  leafLight: "#3b7a5c",
  star: "#ffffff",
  moon: "#e8e3c9",
  cloud: "#3a3f4b",
};

function tree(x: number, y: number): Px[] {
  return [
    [x + 3, y + 7, 2, 5, C.bark],
    [x + 1, y + 2, 6, 5, C.leaf],
    [x, y + 3, 8, 3, C.leaf],
    [x + 2, y, 4, 2, C.leaf],
    [x + 2, y + 2, 3, 2, C.leafLight],
    [x + 1, y + 4, 2, 1, C.leafLight],
  ];
}

const stars: Px[] = [
  [6, 4, 1, 1, C.star, "px-twinkle"],
  [22, 7, 1, 1, C.star, "px-twinkle px-delay-1"],
  [31, 2, 1, 1, C.star, "px-twinkle px-delay-2"],
  [55, 5, 1, 1, C.star, "px-twinkle px-delay-1"],
  [74, 13, 1, 1, C.star, "px-twinkle px-delay-2"],
  [3, 16, 1, 1, C.star, "px-twinkle"],
];

/* ---------- University: columns, pediment, waving flag ---------- */

function university(): Px[] {
  const px: Px[] = [...stars];

  // moon
  px.push([66, 4, 4, 6, C.moon], [65, 5, 6, 4, C.moon], [67, 5, 2, 2, "#d3cdb0"]);

  // ground + path
  px.push([0, 42, 80, 6, C.ground], [37, 42, 7, 6, C.path]);

  // pediment (stepped triangle) + entablature
  for (let i = 0; i < 8; i++) px.push([16 + i * 3, 19 - i, 48 - i * 6, 1, i % 2 ? C.stoneLight : C.stone]);
  px.push([38, 15, 4, 2, C.accent]); // crest
  px.push([14, 20, 52, 3, C.stone], [14, 22, 52, 1, C.stoneLight]);

  // wall behind the colonnade
  px.push([15, 23, 50, 15, C.wall]);

  // door (lit) and windows between columns
  px.push([39, 29, 5, 9, C.accent], [40, 30, 3, 8, C.accentLight]);
  for (const wx of [21, 30, 48, 57]) {
    px.push([wx, 26, 3, 4, C.window, "px-flicker"], [wx, 32, 3, 4, C.windowDim]);
  }

  // columns
  for (let k = 0; k < 6; k++) {
    const x = 17 + k * 9;
    px.push([x - 1, 23, 5, 1, C.column], [x, 24, 3, 14, C.column], [x + 2, 24, 1, 14, C.columnShade]);
  }

  // steps
  px.push([14, 38, 52, 2, C.stepLight], [12, 40, 56, 2, C.stepDark]);

  // flag pole
  px.push([40, 3, 1, 9, C.pole]);
  // two flag frames, toggled with CSS to fake a wave
  px.push([41, 3, 6, 4, C.accent, "px-flag-a"]);
  px.push([41, 3, 3, 4, C.accent, "px-flag-b"], [44, 4, 3, 4, C.accentLight, "px-flag-b"]);

  px.push(...tree(2, 30), ...tree(70, 30));
  return px;
}

/* ---------- College: clock tower, window rows, drifting cloud ---------- */

function college(): Px[] {
  const px: Px[] = [...stars];

  // ground + path
  px.push([0, 42, 80, 6, C.ground], [37, 40, 6, 8, C.path]);

  // main block + roof
  px.push([8, 22, 64, 2, C.stone], [10, 24, 60, 16, C.wallLight], [10, 38, 60, 2, C.wall]);

  // window rows (skip the tower column)
  for (const wx of [13, 19, 25, 51, 57, 63]) {
    px.push([wx, 27, 3, 3, C.window, wx % 4 === 1 ? "px-flicker" : undefined]);
    px.push([wx, 33, 3, 3, wx % 3 === 0 ? C.window : C.windowDim]);
  }

  // clock tower
  px.push([33, 10, 14, 30, C.wallLight], [33, 10, 1, 30, C.wall], [46, 10, 1, 30, C.wall]);
  px.push([32, 9, 16, 1, C.stone], [34, 8, 12, 1, C.stoneLight], [36, 7, 8, 1, C.stone], [38, 6, 4, 1, C.stoneLight]);
  px.push([39, 2, 2, 4, C.pole], [39, 1, 2, 1, C.accent]);

  // clock face
  px.push([38, 12, 4, 6, "#e5e7eb"], [37, 13, 6, 4, "#e5e7eb"]);
  px.push([39, 13, 1, 2, C.wall], [40, 15, 2, 1, C.wall, "px-tick"]);

  // tower window + door
  px.push([38, 21, 4, 3, C.window, "px-flicker"]);
  px.push([37, 30, 6, 10, C.accent], [38, 31, 4, 9, C.accentLight], [39, 31, 2, 9, C.accent]);

  // drifting cloud
  px.push(
    [4, 9, 10, 2, C.cloud, "px-drift"],
    [6, 8, 5, 1, C.cloud, "px-drift"],
    [2, 10, 14, 1, C.cloud, "px-drift"],
  );

  px.push(...tree(0, 30), ...tree(72, 30));
  return px;
}

const scenes: Record<CampusScene, () => Px[]> = { university, college };

export function PixelCampus({ scene }: { scene: CampusScene }) {
  const pixels = scenes[scene]();
  return (
    <svg
      viewBox="0 0 80 48"
      shapeRendering="crispEdges"
      className="block h-auto w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      {pixels.map(([x, y, w, h, fill, className], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill} className={className} />
      ))}
    </svg>
  );
}
