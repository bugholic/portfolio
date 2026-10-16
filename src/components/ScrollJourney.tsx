import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  Euler,
  Float32BufferAttribute,
  HalfFloatType,
  LinearFilter,
  Matrix4,
  Mesh as ThreeMesh,
  NormalBlending,
  Object3D,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  Quaternion,
  SRGBColorSpace,
  ShaderMaterial,
  Vector3,
  WebGLRenderTarget,
  type Group,
  type InstancedMesh,
  type LineBasicMaterial,
  type Mesh,
  type MeshBasicMaterial,
  type PerspectiveCamera,
  type Sprite,
} from "three";
import { useTheme, type Theme } from "../hooks/useTheme";

/*
 * One continuous 3D world sits behind the page. Scrolling moves the camera
 * forward through it: slowly while a section is on screen, fast through the
 * tunnel between sections, so every section change reads as a warp. Each
 * tunnel is built from the idea of the section it leads into.
 */

const SECTION_LEN = 14;
const GATE_LEN = 46;
const STRIDE = SECTION_LEN + GATE_LEN;
const RADIUS = 3.6;

type TunnelKind = "code" | "timeline" | "gallery" | "blocks" | "signal";

const chapters: {
  number: string;
  title: string;
  destination: string;
  caption: string;
  kind: TunnelKind;
  hue: Record<Theme, string>;
}[] = [
  { number: "01", title: "The approach", destination: "About", caption: "A corridor of code: how I think and build.", kind: "code", hue: { dark: "#5a82ff", light: "#2f5ef5" } },
  { number: "02", title: "The path", destination: "Experience", caption: "Down the timeline, one milestone at a time.", kind: "timeline", hue: { dark: "#3fc8ff", light: "#0a86bd" } },
  { number: "03", title: "The work", destination: "Projects", caption: "Through a gallery of shipped screens.", kind: "gallery", hue: { dark: "#a07dff", light: "#6a43f0" } },
  { number: "04", title: "The toolkit", destination: "Stack", caption: "Blocks snapping into place, tool by tool.", kind: "blocks", hue: { dark: "#ffb547", light: "#c77700" } },
  { number: "05", title: "The signal", destination: "Contact", caption: "Follow the signal and say hello.", kind: "signal", hue: { dark: "#6df0c4", light: "#0b9469" } },
];

const STOPS = chapters.length + 1;

const PALETTES = {
  // `split` is the chromatic aberration in the rush blur; on a light ground it reads as rainbow fringing, so keep it faint.
  dark: { bg: "#111215", streak: "#8fb0ff", base: "#183ea9", wire: "#8eaaff", additive: true, glow: 1.1, streakOpacity: 0.16, split: 0.18, blockGlow: 0.35 },
  light: { bg: "#f2f3f6", streak: "#4061d6", base: "#c9d4ff", wire: "#3d5fd6", additive: false, glow: 0.45, streakOpacity: 0.12, split: 0.04, blockGlow: 0.85 },
} as const;

type Palette = (typeof PALETTES)[Theme];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

type JourneyInput = { distance: number; pointerX: number; pointerY: number };

type JourneyLive = {
  distance: number;
  speed: number;
  gateStrength: number;
  gate: number;
  time: number;
  pointerX: number;
  pointerY: number;
  compact: boolean;
};

type LiveRef = React.RefObject<JourneyLive>;

const stopCenter = (stop: number) => stop * STRIDE + SECTION_LEN * 0.5;
const gateStart = (gate: number) => gate * STRIDE + SECTION_LEN;
/** 0 at the tunnel mouth, 1 at its exit. */
const gateProgress = (live: JourneyLive, gate: number) => (live.distance - gateStart(gate)) / GATE_LEN;
/** 0 until the transition starts, 1 inside the tunnel, back to 0 once through it. */
const nearness = (into: number) => smoothstep(-0.03, 0.07, into) * (1 - smoothstep(0.93, 1.03, into));

function makeTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function textTexture(text: string, font: string, width = 256, height = 128) {
  return makeTexture(width, height, (ctx) => {
    ctx.fillStyle = "#ffffff";
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);
  });
}

function useDisposable<T extends { dispose: () => void }>(items: T[]) {
  useEffect(() => () => items.forEach((item) => item.dispose()), [items]);
}

/* ----------------------------------------------------------------------------
 * Camera: eases toward the scroll distance, widens its FOV and rolls inside a
 * tunnel, and follows the pointer a little for depth parallax.
 * ------------------------------------------------------------------------- */
function CameraRig({ input, live }: { input: React.RefObject<JourneyInput>; live: LiveRef }) {
  const { camera, viewport } = useThree();
  const lights = useRef<Group>(null);
  const last = useRef<number | null>(null);

  useFrame(({ clock }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const state = live.current;
    const target = input.current.distance;

    if (last.current === null) {
      state.distance = target;
      last.current = target;
    }
    state.distance += (target - state.distance) * (1 - Math.exp(-delta * 4.5));
    const velocity = (state.distance - last.current) / Math.max(delta, 1e-3);
    last.current = state.distance;

    state.speed += (clamp(Math.abs(velocity) / 36, 0, 1) - state.speed) * (1 - Math.exp(-delta * 6));
    state.pointerX += (input.current.pointerX - state.pointerX) * (1 - Math.exp(-delta * 3));
    state.pointerY += (input.current.pointerY - state.pointerY) * (1 - Math.exp(-delta * 3));
    state.time = clock.elapsedTime;
    state.compact = viewport.aspect < 0.9;

    const stride = Math.floor(state.distance / STRIDE);
    const local = state.distance - stride * STRIDE;
    const progress = local > SECTION_LEN ? (local - SECTION_LEN) / GATE_LEN : 0;
    state.gate = clamp(stride, 0, chapters.length - 1);
    state.gateStrength = Math.sin(progress * Math.PI);

    const cam = camera as PerspectiveCamera;
    cam.position.set(state.pointerX * 0.55, -state.pointerY * 0.35, -state.distance + 8);
    cam.rotation.set(state.pointerY * 0.04, -state.pointerX * 0.06, Math.sin(progress * Math.PI * 2) * 0.12 * state.gateStrength);
    const fov = 50 + state.gateStrength * 20 + state.speed * 8;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    if (lights.current) lights.current.position.z = cam.position.z;
  });

  return (
    <group ref={lights}>
      <pointLight position={[3, 3, -2]} intensity={34} distance={30} color="#4875ff" />
      <pointLight position={[-4, -2, -6]} intensity={22} distance={30} color="#52d5ff" />
      <pointLight position={[0, 4, -14]} intensity={18} distance={26} color="#9fb4ff" />
    </group>
  );
}

/* ----------------------------------------------------------------------------
 * Speed streaks: one line per particle that stretches with scroll speed and
 * takes on the colour of the tunnel you are in.
 * ------------------------------------------------------------------------- */
const streakVertex = /* glsl */ `
  uniform float uStretch;
  attribute float aEnd;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.z += aEnd * uStretch;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float dist = -mv.z;
    vAlpha = smoothstep(44.0, 8.0, dist) * smoothstep(0.2, 3.0, dist) * mix(1.0, 0.0, aEnd);
    gl_Position = projectionMatrix * mv;
  }
`;

const flatFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha * uOpacity);
  }
`;

function Streaks({ live, count, palette, theme }: { live: LiveRef; count: number; palette: Palette; theme: Theme }) {
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 6);
    const ends = new Float32Array(count * 2);
    const length = STOPS * STRIDE + 40;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.2 + Math.pow(Math.random(), 0.7) * 9;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.8;
      const z = 12 - Math.random() * length;
      positions.set([x, y, z, x, y, z], i * 6);
      ends.set([0, 1], i * 2);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(positions, 3));
    geo.setAttribute("aEnd", new BufferAttribute(ends, 1));
    const mat = new ShaderMaterial({
      vertexShader: streakVertex,
      fragmentShader: flatFragment,
      uniforms: { uStretch: { value: 0.3 }, uColor: { value: new Color() }, uOpacity: { value: 0.6 } },
      transparent: true,
      depthWrite: false,
    });
    return { geometry: geo, material: mat };
  }, [count]);
  const colors = useMemo(
    () => ({ base: new Color(palette.streak), hues: chapters.map((chapter) => new Color(chapter.hue[theme])) }),
    [palette, theme],
  );

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);
  useEffect(() => { material.blending = palette.additive ? AdditiveBlending : NormalBlending; }, [material, palette]);

  useFrame(() => {
    const state = live.current;
    material.uniforms.uStretch.value = 0.3 + state.speed * 4.5 + state.gateStrength * 3;
    material.uniforms.uOpacity.value = palette.streakOpacity + state.gateStrength * 0.7;
    (material.uniforms.uColor.value as Color).lerpColors(colors.base, colors.hues[state.gate], state.gateStrength);
  });

  return <lineSegments geometry={geometry} material={material} frustumCulled={false} />;
}

/* ----------------------------------------------------------------------------
 * Light at the end of every tunnel, tinted with its destination's colour.
 * ------------------------------------------------------------------------- */
const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float glow = pow(clamp(1.0 - d, 0.0, 1.0), 2.4);
    gl_FragColor = vec4(uColor, glow * uOpacity);
  }
`;

type TunnelProps = { index: number; live: LiveRef; hue: string; palette: Palette };

function GateGlow({ index, live, hue, palette }: TunnelProps) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: glowVertex,
        fragmentShader: glowFragment,
        uniforms: { uColor: { value: new Color() }, uOpacity: { value: 0 } },
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => {
    (material.uniforms.uColor.value as Color).set(hue);
    material.blending = palette.additive ? AdditiveBlending : NormalBlending;
  }, [material, hue, palette]);

  useFrame(() => {
    const into = gateProgress(live.current, index);
    material.uniforms.uOpacity.value = smoothstep(0.15, 0.85, into) * (1 - smoothstep(0.96, 1.02, into)) * palette.glow;
  });

  return (
    <mesh position={[0, 0, -(gateStart(index) + GATE_LEN + 2)]} material={material}>
      <planeGeometry args={[14, 14]} />
    </mesh>
  );
}

/** Lays out one instance per ring along a tunnel. */
function useRingInstances(
  mesh: React.RefObject<InstancedMesh | null>,
  count: number,
  index: number,
  place: (k: number, position: Vector3, euler: Euler, scale: Vector3, color: Color) => void,
  deps: unknown[],
) {
  useLayoutEffect(() => {
    const node = mesh.current;
    if (!node) return;
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const euler = new Euler();
    const position = new Vector3();
    const scale = new Vector3(1, 1, 1);
    const color = new Color();
    for (let k = 0; k < count; k++) {
      position.set(0, 0, -(gateStart(index) + (k + 0.5) * (GATE_LEN / count)));
      euler.set(0, 0, 0);
      scale.set(1, 1, 1);
      place(k, position, euler, scale, color);
      node.setMatrixAt(k, matrix.compose(position, rotation.setFromEuler(euler), scale));
      node.setColorAt(k, color);
    }
    node.instanceMatrix.needsUpdate = true;
    if (node.instanceColor) node.instanceColor.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* --- 01 About: a square corridor like an editor, with code drifting past --- */
const CODE_TOKENS = ["</>", "{ }", "=>", "fn()", "const", "async", "&&", "[ ]", "git", "npm", "if", "API", "RAG", "01"];

function CodeTunnel({ index, live, hue }: TunnelProps) {
  const frames = useRef<InstancedMesh>(null);
  const frameMaterial = useRef<MeshBasicMaterial>(null);
  const gridMaterial = useRef<LineBasicMaterial>(null);
  const glyphs = useRef<(Sprite | null)[]>([]);
  const start = gateStart(index);
  const count = 22;
  const half = RADIUS * Math.SQRT1_2;

  const textures = useMemo(() => CODE_TOKENS.map((token) => textTexture(token, "600 58px 'JetBrains Mono', ui-monospace, monospace")), []);
  useDisposable(textures);

  const grid = useMemo(() => {
    const points: number[] = [];
    for (let wall = 0; wall < 4; wall++) {
      for (let line = 0; line <= 4; line++) {
        const along = -half + (line / 4) * half * 2;
        const [x, y] = wall === 0 ? [along, -half] : wall === 1 ? [along, half] : wall === 2 ? [-half, along] : [half, along];
        points.push(x, y, -start, x, y, -(start + GATE_LEN));
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    return geometry;
  }, [start, half]);
  useDisposable(useMemo(() => [grid], [grid]));

  const seeds = useMemo(
    () =>
      Array.from({ length: 30 }, (_, k) => ({
        wall: k % 4,
        along: (Math.random() * 2 - 1) * (half - 0.6),
        offset: Math.random() * GATE_LEN,
        token: k % CODE_TOKENS.length,
        speed: 0.6 + Math.random() * 1.2,
      })),
    [half],
  );

  useRingInstances(frames, count, index, (k, _position, euler, _scale, color) => {
    euler.set(0, 0, Math.PI / 4);
    color.set(hue).multiplyScalar(k % 5 === 0 ? 1 : 0.55);
  }, [hue, index]);

  useFrame(() => {
    const state = live.current;
    const near = nearness(gateProgress(state, index));
    if (frameMaterial.current) frameMaterial.current.opacity = near * 0.8;
    if (gridMaterial.current) gridMaterial.current.opacity = near * 0.35;
    glyphs.current.forEach((sprite, k) => {
      if (!sprite) return;
      const seed = seeds[k];
      const travel = (seed.offset + state.time * seed.speed) % GATE_LEN;
      const inset = half - 0.35;
      const [x, y] = seed.wall === 0 ? [seed.along, -inset] : seed.wall === 1 ? [seed.along, inset] : seed.wall === 2 ? [-inset, seed.along] : [inset, seed.along];
      sprite.position.set(x, y, -(start + GATE_LEN - travel));
      sprite.material.opacity = near * 0.9;
    });
  });

  return (
    <group>
      <instancedMesh ref={frames} args={[undefined, undefined, count]} frustumCulled={false}>
        <torusGeometry args={[RADIUS, 0.03, 4, 4]} />
        <meshBasicMaterial ref={frameMaterial} transparent depthWrite={false} toneMapped={false} />
      </instancedMesh>
      <lineSegments geometry={grid}>
        <lineBasicMaterial ref={gridMaterial} color={hue} transparent depthWrite={false} />
      </lineSegments>
      {seeds.map((seed, k) => (
        <sprite key={k} ref={(node) => { glyphs.current[k] = node; }} scale={[1.1, 0.55, 1]}>
          <spriteMaterial map={textures[seed.token]} color={hue} transparent depthWrite={false} opacity={0} />
        </sprite>
      ))}
    </group>
  );
}

/* --- 02 Experience: a runway of arches, milestone years marked overhead --- */
const MILESTONES = [
  { arch: 3, label: "2020" },
  { arch: 8, label: "2023" },
  { arch: 13, label: "2025" },
  { arch: 17, label: "NOW" },
];

function TimelineTunnel({ index, live, hue }: TunnelProps) {
  const arches = useRef<InstancedMesh>(null);
  const archMaterial = useRef<MeshBasicMaterial>(null);
  const dashes = useRef<InstancedMesh>(null);
  const edgeMaterial = useRef<LineBasicMaterial>(null);
  const milestoneMaterials = useRef<(MeshBasicMaterial | null)[]>([]);
  const labels = useRef<(Sprite | null)[]>([]);
  const start = gateStart(index);
  const count = 20;
  const dashCount = 24;
  const floor = -2.3;
  const archZ = (k: number) => -(start + (k + 0.5) * (GATE_LEN / count));

  const textures = useMemo(() => MILESTONES.map((m) => textTexture(m.label, "800 104px 'Google Sans Flex', sans-serif", 512, 192)), []);
  useDisposable(textures);

  const edges = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute([-1.7, floor, -start, -1.7, floor, -(start + GATE_LEN), 1.7, floor, -start, 1.7, floor, -(start + GATE_LEN)], 3));
    return geometry;
  }, [start, floor]);
  useDisposable(useMemo(() => [edges], [edges]));

  const base = useMemo(() => new Color(hue), [hue]);
  const temp = useMemo(() => new Color(), []);

  useRingInstances(arches, count, index, (k, position, _euler, _scale, color) => {
    position.y = floor;
    color.set(hue).multiplyScalar(0.5);
  }, [hue, index]);

  useLayoutEffect(() => {
    const node = dashes.current;
    if (!node) return;
    const matrix = new Matrix4();
    for (let k = 0; k < dashCount; k++) {
      node.setMatrixAt(k, matrix.makeTranslation(0, floor, -(start + (k + 0.5) * (GATE_LEN / dashCount))));
      node.setColorAt(k, base);
    }
    node.instanceMatrix.needsUpdate = true;
  }, [start, floor, base]);

  useFrame(() => {
    const state = live.current;
    const near = nearness(gateProgress(state, index));
    if (archMaterial.current) archMaterial.current.opacity = near * 0.7;
    if (edgeMaterial.current) edgeMaterial.current.opacity = near * 0.6;
    milestoneMaterials.current.forEach((material) => { if (material) material.opacity = near; });
    labels.current.forEach((label) => { if (label) label.material.opacity = near; });

    // Runway lights chase forward along the floor.
    const node = dashes.current;
    if (node?.instanceColor) {
      for (let k = 0; k < dashCount; k++) {
        const pulse = 0.5 + 0.5 * Math.sin(state.time * 5 - k * 0.7);
        node.setColorAt(k, temp.copy(base).multiplyScalar((0.15 + pulse * 0.85) * near));
      }
      node.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={arches} args={[undefined, undefined, count]} frustumCulled={false}>
        <torusGeometry args={[3.4, 0.022, 4, 48, Math.PI]} />
        <meshBasicMaterial ref={archMaterial} transparent depthWrite={false} toneMapped={false} />
      </instancedMesh>
      {MILESTONES.map((milestone, k) => (
        <group key={milestone.label} position={[0, floor, archZ(milestone.arch)]}>
          <mesh>
            <torusGeometry args={[3.4, 0.07, 6, 64, Math.PI]} />
            <meshBasicMaterial ref={(node) => { milestoneMaterials.current[k] = node; }} color={hue} transparent depthWrite={false} toneMapped={false} />
          </mesh>
          <sprite ref={(node) => { labels.current[k] = node; }} position={[0, 5.1, 0]} scale={[2.4, 0.9, 1]}>
            <spriteMaterial map={textures[k]} color={hue} transparent depthWrite={false} opacity={0} />
          </sprite>
        </group>
      ))}
      <instancedMesh ref={dashes} args={[undefined, undefined, dashCount]} frustumCulled={false}>
        <boxGeometry args={[0.08, 0.02, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={edgeMaterial} color={hue} transparent depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/* --- 03 Projects: a helix of app windows lining the tunnel walls --- */
function windowTexture(variant: number) {
  return makeTexture(512, 320, (ctx) => {
    const round = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
    };
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    round(6, 6, 500, 308, 22);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, 52);
    ctx.lineTo(506, 52);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    [32, 56, 80].forEach((x) => { ctx.beginPath(); ctx.arc(x, 29, 7, 0, Math.PI * 2); ctx.fill(); });

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    if (variant === 0) {
      // Dashboard: bar chart and stat line
      [0.45, 0.7, 0.55, 0.9, 0.65, 0.8].forEach((h, k) => ctx.fillRect(40 + k * 50, 280 - h * 190, 30, h * 190));
      ctx.fillRect(360, 90, 110, 14);
      ctx.fillRect(360, 120, 80, 14);
    } else if (variant === 1) {
      // Article: hero image and text lines
      round(36, 80, 200, 200, 14);
      ctx.fill();
      [0, 1, 2, 3, 4].forEach((k) => ctx.fillRect(266, 92 + k * 38, k === 4 ? 120 : 200, 14));
    } else {
      // Board: three columns of cards
      [0, 1, 2].forEach((col) => [0, 1, 2 - col].forEach((row) => {
        round(36 + col * 152, 80 + row * 74, 132, 58, 10);
        ctx.fill();
      }));
    }
  });
}

function GalleryTunnel({ index, live, hue }: TunnelProps) {
  const group = useRef<Group>(null);
  const meshes = useRef<(InstancedMesh | null)[]>([]);
  const materials = useRef<(MeshBasicMaterial | null)[]>([]);
  const start = gateStart(index);
  const perVariant = 10;

  const textures = useMemo(() => [0, 1, 2].map(windowTexture), []);
  useDisposable(textures);

  useLayoutEffect(() => {
    const dummy = new Object3D();
    meshes.current.forEach((mesh, variant) => {
      if (!mesh) return;
      for (let k = 0; k < perVariant; k++) {
        const slot = k * 3 + variant;
        const angle = slot * ((Math.PI * 2) / 5) + slot * 0.09;
        const z = -(start + (slot + 0.5) * (GATE_LEN / (perVariant * 3)));
        dummy.position.set(Math.cos(angle) * 3.3, Math.sin(angle) * 3.3, z);
        dummy.lookAt(0, 0, z);
        dummy.updateMatrix();
        mesh.setMatrixAt(k, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  }, [start]);

  useFrame(() => {
    const state = live.current;
    const near = nearness(gateProgress(state, index));
    if (group.current) group.current.rotation.z = state.distance * 0.025;
    materials.current.forEach((material) => { if (material) material.opacity = near * 0.9; });
  });

  return (
    <group ref={group}>
      {textures.map((texture, variant) => (
        <instancedMesh key={variant} ref={(node) => { meshes.current[variant] = node; }} args={[undefined, undefined, perVariant]} frustumCulled={false}>
          <planeGeometry args={[2.1, 1.31]} />
          <meshBasicMaterial
            ref={(node) => { materials.current[variant] = node; }}
            map={texture}
            color={hue}
            transparent
            side={DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </instancedMesh>
      ))}
    </group>
  );
}

/* --- 04 Stack: scattered blocks assemble into rings as you approach --- */
function BlocksTunnel({ index, live, hue, palette }: TunnelProps) {
  const blocks = useRef<InstancedMesh>(null);
  const start = gateStart(index);
  const rings = 13;
  const perRing = 10;

  const layout = useMemo(() => {
    const euler = new Euler();
    return Array.from({ length: rings * perRing }, (_, k) => {
      const ring = Math.floor(k / perRing);
      const angle = (k % perRing) * ((Math.PI * 2) / perRing) + ring * 0.16;
      const depth = start + (ring + 0.5) * (GATE_LEN / rings);
      const scatter = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(2.5 + Math.random() * 3.5);
      return {
        depth,
        target: new Vector3(Math.cos(angle) * 3.4, Math.sin(angle) * 3.4, -depth),
        targetRotation: new Quaternion().setFromEuler(euler.set(0, 0, angle)),
        scatter: new Vector3(Math.cos(angle) * 3.4, Math.sin(angle) * 3.4, -depth).add(scatter),
        scatterRotation: new Quaternion().setFromEuler(euler.set(Math.random() * 6, Math.random() * 6, Math.random() * 6)),
      };
    });
  }, [start]);

  const temp = useMemo(() => ({ matrix: new Matrix4(), position: new Vector3(), rotation: new Quaternion(), scale: new Vector3() }), []);

  useLayoutEffect(() => {
    const node = blocks.current;
    if (!node) return;
    const color = new Color();
    layout.forEach((_, k) => node.setColorAt(k, color.set(hue).multiplyScalar(k % 3 === 0 ? 1 : 0.6)));
    if (node.instanceColor) node.instanceColor.needsUpdate = true;
  }, [layout, hue]);

  useFrame(() => {
    const node = blocks.current;
    if (!node) return;
    const state = live.current;
    const near = nearness(gateProgress(state, index));
    const cameraDepth = state.distance - 8;
    layout.forEach((block, k) => {
      const ahead = block.depth - cameraDepth;
      const built = smoothstep(30, 11, ahead);
      temp.position.lerpVectors(block.scatter, block.target, built);
      temp.rotation.slerpQuaternions(block.scatterRotation, block.targetRotation, built);
      temp.scale.setScalar(near * (0.55 + built * 0.45));
      node.setMatrixAt(k, temp.matrix.compose(temp.position, temp.rotation, temp.scale));
    });
    node.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={blocks} args={[undefined, undefined, rings * perRing]} frustumCulled={false}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#ffffff" emissive={hue} emissiveIntensity={palette.blockGlow} metalness={0.45} roughness={0.35} />
    </instancedMesh>
  );
}

/* --- 05 Contact: rings pulse outward like a broadcast, waveforms in between --- */
function SignalTunnel({ index, live, hue }: TunnelProps) {
  const rings = useRef<InstancedMesh>(null);
  const ringMaterial = useRef<MeshBasicMaterial>(null);
  const waves = useRef<(Mesh | null)[]>([]);
  const waveMaterials = useRef<(LineBasicMaterial | null)[]>([]);
  const start = gateStart(index);
  const count = 22;
  const waveCount = 5;

  const waveGeometry = useMemo(() => {
    const points: number[] = [];
    const segments = 240;
    for (let s = 0; s <= segments; s++) {
      const theta = (s / segments) * Math.PI * 2;
      const r = 3 + Math.sin(theta * 12) * 0.18 * Math.sin(theta * 3);
      points.push(Math.cos(theta) * r, Math.sin(theta) * r, 0);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
    return geometry;
  }, []);
  useDisposable(useMemo(() => [waveGeometry], [waveGeometry]));

  const base = useMemo(() => new Color(hue), [hue]);
  const temp = useMemo(() => ({ matrix: new Matrix4(), position: new Vector3(), rotation: new Quaternion(), scale: new Vector3(), color: new Color() }), []);

  useFrame(() => {
    const node = rings.current;
    const state = live.current;
    const near = nearness(gateProgress(state, index));
    if (ringMaterial.current) ringMaterial.current.opacity = near * 0.85;
    if (node) {
      for (let k = 0; k < count; k++) {
        const wave = Math.sin(state.time * 2.6 - k * 0.55);
        temp.position.set(0, 0, -(start + (k + 0.5) * (GATE_LEN / count)));
        temp.scale.setScalar(1 + wave * 0.09 + state.speed * 0.05);
        node.setMatrixAt(k, temp.matrix.compose(temp.position, temp.rotation, temp.scale));
        node.setColorAt(k, temp.color.copy(base).multiplyScalar(0.35 + (wave * 0.5 + 0.5) * 0.65));
      }
      node.instanceMatrix.needsUpdate = true;
      if (node.instanceColor) node.instanceColor.needsUpdate = true;
    }
    waves.current.forEach((wave, k) => {
      if (wave) wave.rotation.z = state.time * (k % 2 ? -0.4 : 0.4) + state.distance * 0.04;
    });
    waveMaterials.current.forEach((material) => { if (material) material.opacity = near * 0.8; });
  });

  return (
    <group>
      <instancedMesh ref={rings} args={[undefined, undefined, count]} frustumCulled={false}>
        <torusGeometry args={[3.8, 0.02, 4, 96]} />
        <meshBasicMaterial ref={ringMaterial} transparent depthWrite={false} toneMapped={false} />
      </instancedMesh>
      {Array.from({ length: waveCount }, (_, k) => (
        <lineLoop
          key={k}
          ref={(node: Mesh | null) => { waves.current[k] = node; }}
          geometry={waveGeometry}
          position={[0, 0, -(start + ((k + 0.5) / waveCount) * GATE_LEN)]}
        >
          <lineBasicMaterial ref={(node) => { waveMaterials.current[k] = node; }} color={hue} transparent depthWrite={false} opacity={0} />
        </lineLoop>
      ))}
    </group>
  );
}

function GateGroup({ index, live, children }: { index: number; live: LiveRef; children: React.ReactNode }) {
  const group = useRef<Group>(null);
  useFrame(() => {
    if (group.current) group.current.visible = nearness(gateProgress(live.current, index)) > 0.001;
  });
  return <group ref={group} visible={false}>{children}</group>;
}

const TUNNELS: Record<TunnelKind, (props: TunnelProps) => React.JSX.Element> = {
  code: CodeTunnel,
  timeline: TimelineTunnel,
  gallery: GalleryTunnel,
  blocks: BlocksTunnel,
  signal: SignalTunnel,
};

/* ----------------------------------------------------------------------------
 * Section landmarks: each reacts to scroll position, speed and the pointer,
 * and glows in the colour of the tunnel that led to it.
 * ------------------------------------------------------------------------- */
const LANDMARK_SIDE = [1, -1, 1, -1, 1, 0];

type LandmarkProps = { live: LiveRef; hue: string; palette: Palette };

function useLandmark(stop: number, live: LiveRef) {
  const anchor = useRef<Group>(null);
  const spin = useRef(0);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const node = anchor.current;
    if (!node) return;
    const state = live.current;
    const offset = state.distance - stopCenter(stop);
    // On phones the landmark peeks in from the edge instead of sitting behind the text column.
    const x = LANDMARK_SIDE[stop] * (state.compact ? 2.2 : 3.6);

    spin.current += delta * (0.25 + state.speed * 3.5);
    node.position.set(x + state.pointerX * 0.25, -0.2 + offset * 0.12 + state.pointerY * 0.2, -(stopCenter(stop) + 9));
    node.rotation.set(spin.current * 0.45 + state.pointerY * 0.3, spin.current + state.pointerX * 0.4, Math.sin(state.time * 0.3) * 0.15);
    node.scale.setScalar((state.compact ? 0.62 : 1) * (1 + state.speed * 0.18));
  });

  return anchor;
}

function CoreLandmark({ live, hue, palette }: LandmarkProps) {
  const anchor = useLandmark(0, live);
  const halo = useRef<Mesh>(null);
  useFrame(() => {
    if (halo.current) halo.current.rotation.z = -live.current.distance * 0.08 - live.current.time * 0.1;
  });
  return (
    <group ref={anchor}>
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color={palette.base} emissive={hue} emissiveIntensity={0.7} metalness={0.8} roughness={0.23} flatShading />
      </mesh>
      <mesh scale={1.24}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial color={palette.wire} wireframe transparent opacity={0.34} depthWrite={false} />
      </mesh>
      <mesh ref={halo} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[2.2, 0.014, 5, 96]} />
        <meshBasicMaterial color={hue} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh rotation={[0.7, -0.45, 0.5]}>
        <torusGeometry args={[1.75, 0.012, 5, 96]} />
        <meshBasicMaterial color="#43ceff" transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}

function KnotLandmark({ live, hue, palette }: LandmarkProps) {
  const anchor = useLandmark(1, live);
  return (
    <group ref={anchor}>
      <mesh>
        <torusKnotGeometry args={[1.1, 0.32, 160, 18, 2, 3]} />
        <meshStandardMaterial color={palette.base} emissive={hue} emissiveIntensity={0.55} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh scale={1.08}>
        <torusKnotGeometry args={[1.1, 0.32, 80, 8, 2, 3]} />
        <meshBasicMaterial color={palette.wire} wireframe transparent opacity={0.22} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GyroLandmark({ live, hue, palette }: LandmarkProps) {
  const anchor = useLandmark(2, live);
  const rings = useRef<(Mesh | null)[]>([]);
  useFrame(() => {
    const { distance, time, speed } = live.current;
    rings.current.forEach((ring, k) => {
      if (!ring) return;
      const turn = distance * 0.12 * (k + 1) + time * (0.2 + speed) * (k % 2 ? -1 : 1);
      ring.rotation.set(k === 0 ? turn : 0.6 * k, k === 1 ? turn : 0, k === 2 ? turn : 0.3);
    });
  });
  return (
    <group ref={anchor}>
      {[2, 1.55, 1.1].map((radius, k) => (
        <mesh key={k} ref={(node) => { rings.current[k] = node; }}>
          <torusGeometry args={[radius, 0.05, 8, 80]} />
          <meshStandardMaterial color={k === 1 ? hue : palette.base} emissive={hue} emissiveIntensity={0.7} metalness={0.8} roughness={0.25} />
        </mesh>
      ))}
      <mesh>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color={palette.wire} emissive={hue} emissiveIntensity={1.1} flatShading />
      </mesh>
    </group>
  );
}

function CubeLandmark({ live, hue, palette }: LandmarkProps) {
  const anchor = useLandmark(3, live);
  const cubes = useRef<InstancedMesh>(null);
  const cells = useMemo(() => {
    const list: Vector3[] = [];
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) list.push(new Vector3(x, y, z));
    return list;
  }, []);
  const temp = useMemo(() => ({ matrix: new Matrix4(), position: new Vector3(), rotation: new Quaternion(), euler: new Euler(), scale: new Vector3() }), []);

  useFrame(() => {
    const mesh = cubes.current;
    if (!mesh) return;
    const { speed, gateStrength, time, distance } = live.current;
    const spread = 0.82 + speed * 0.9 + gateStrength * 0.5 + Math.sin(time * 0.8) * 0.04;
    cells.forEach((cell, k) => {
      temp.position.copy(cell).multiplyScalar(spread);
      temp.rotation.setFromEuler(temp.euler.set(distance * 0.05 * cell.y, distance * 0.05 * cell.x, 0));
      temp.scale.setScalar(0.5);
      mesh.setMatrixAt(k, temp.matrix.compose(temp.position, temp.rotation, temp.scale));
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={anchor}>
      <instancedMesh ref={cubes} args={[undefined, undefined, cells.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={palette.base} emissive={hue} emissiveIntensity={0.5} metalness={0.75} roughness={0.28} />
      </instancedMesh>
    </group>
  );
}

function OrbitLandmark({ live, hue, palette }: LandmarkProps) {
  const anchor = useLandmark(4, live);
  const orbit = useRef<Group>(null);
  useFrame(() => {
    if (orbit.current) orbit.current.rotation.y = live.current.distance * 0.1 + live.current.time * 0.4;
  });
  return (
    <group ref={anchor}>
      <mesh>
        <dodecahedronGeometry args={[1.05, 0]} />
        <meshStandardMaterial color={palette.base} emissive={hue} emissiveIntensity={0.6} metalness={0.85} roughness={0.2} flatShading />
      </mesh>
      <mesh scale={1.35}>
        <dodecahedronGeometry args={[1.05, 0]} />
        <meshBasicMaterial color={palette.wire} wireframe transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <group ref={orbit} rotation={[0.35, 0, 0.2]}>
        {Array.from({ length: 6 }, (_, k) => {
          const angle = (k / 6) * Math.PI * 2;
          return (
            <mesh key={k} position={[Math.cos(angle) * 2.1, Math.sin(k * 1.7) * 0.3, Math.sin(angle) * 2.1]} scale={0.16}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={hue} emissive={hue} emissiveIntensity={1.2} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function BeaconLandmark({ live, hue, palette }: LandmarkProps) {
  const anchor = useLandmark(5, live);
  return (
    <group ref={anchor}>
      <mesh>
        <sphereGeometry args={[1.3, 48, 48]} />
        <meshStandardMaterial color={palette.base} emissive={hue} emissiveIntensity={0.9} metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh rotation={[1.25, 0, 0]}>
        <torusGeometry args={[2.3, 0.02, 4, 120]} />
        <meshBasicMaterial color={hue} transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

const LANDMARKS = [CoreLandmark, KnotLandmark, GyroLandmark, CubeLandmark, OrbitLandmark, BeaconLandmark];

/* ----------------------------------------------------------------------------
 * Rush blur: the scene renders to a texture, then a zoom blur streaks it away
 * from the vanishing point. Strength follows tunnel depth and scroll speed;
 * the centre stays sharp, the edges smear, split colour and close in.
 * ------------------------------------------------------------------------- */
const blurFragment = /* glsl */ `
  uniform sampler2D tScene;
  uniform float uStrength;
  uniform vec2 uCenter;
  uniform vec3 uVignette;
  uniform float uAspect;
  uniform float uSplit;
  varying vec2 vUv;
  void main() {
    vec2 dir = vUv - uCenter;
    float dist = length(dir * vec2(uAspect, 1.0));
    float reach = uStrength * smoothstep(0.04, 0.55, dist);
    vec3 sum = vec3(0.0);
    const int SAMPLES = 14;
    for (int i = 0; i < SAMPLES; i++) {
      float t = float(i) / float(SAMPLES - 1);
      sum += texture2D(tScene, vUv - dir * t * reach).rgb;
    }
    vec3 color = sum / float(SAMPLES);
    float split = reach * uSplit;
    color.r = mix(color.r, texture2D(tScene, vUv - dir * split).r, 0.5);
    color.b = mix(color.b, texture2D(tScene, vUv + dir * split).b, 0.5);
    float vignette = smoothstep(0.35, 0.95, dist) * clamp(uStrength * 4.0, 0.0, 0.75);
    gl_FragColor = vec4(mix(color, uVignette, vignette), 1.0);
    #include <colorspace_fragment>
  }
`;

function RushBlur({ live, palette, compact }: { live: LiveRef; palette: Palette; compact: boolean }) {
  const { gl, scene, camera, size, viewport } = useThree();
  const target = useMemo(
    () => new WebGLRenderTarget(1, 1, { samples: compact ? 0 : 4, type: HalfFloatType, minFilter: LinearFilter, magFilter: LinearFilter }),
    [compact],
  );
  useEffect(() => () => target.dispose(), [target]);
  useEffect(() => {
    target.setSize(Math.round(size.width * viewport.dpr), Math.round(size.height * viewport.dpr));
  }, [target, size.width, size.height, viewport.dpr]);
  const pass = useMemo(() => {
    const material = new ShaderMaterial({
      vertexShader: glowVertex,
      fragmentShader: blurFragment,
      uniforms: {
        tScene: { value: null },
        uStrength: { value: 0 },
        uCenter: { value: [0.5, 0.5] },
        uVignette: { value: new Color() },
        uAspect: { value: 1 },
        uSplit: { value: 0.18 },
      },
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const quad = new ThreeMesh(new PlaneGeometry(2, 2), material);
    quad.frustumCulled = false;
    const quadScene = new Scene();
    quadScene.add(quad);
    return { material, quad, quadScene, quadCamera: new OrthographicCamera(-1, 1, 1, -1, 0, 1) };
  }, []);

  useEffect(() => () => { pass.material.dispose(); pass.quad.geometry.dispose(); }, [pass]);
  useEffect(() => {
    (pass.material.uniforms.uVignette.value as Color).set(palette.bg);
    pass.material.uniforms.uSplit.value = palette.split;
  }, [pass, palette]);

  useFrame(() => {
    const state = live.current;
    // Mostly driven by actual speed, so stopping mid-tunnel settles back to a crisp view.
    const strength = clamp(state.gateStrength * (0.05 + state.speed * 0.2) + state.speed * 0.04, 0, 0.26);
    const uniforms = pass.material.uniforms;
    uniforms.uStrength.value += (strength - uniforms.uStrength.value) * 0.2;
    uniforms.uAspect.value = size.width / Math.max(size.height, 1);
    uniforms.uCenter.value = [0.5 - state.pointerX * 0.03, 0.5 + state.pointerY * 0.03];

    gl.setRenderTarget(target);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    uniforms.tScene.value = target.texture;
    gl.render(pass.quadScene, pass.quadCamera);
  }, 1);

  return null;
}

function JourneyScene({ input, compact, theme }: { input: React.RefObject<JourneyInput>; compact: boolean; theme: Theme }) {
  const live = useRef<JourneyLive>({ distance: 0, speed: 0, gateStrength: 0, gate: 0, time: 0, pointerX: 0, pointerY: 0, compact });
  const palette = PALETTES[theme];
  const heroHue = theme === "dark" ? "#2858ff" : "#3460f5";

  return (
    <>
      <color attach="background" args={[palette.bg]} />
      <fog attach="fog" args={[palette.bg, 9, 44]} />
      <ambientLight intensity={theme === "dark" ? 0.6 : 1.4} />
      <CameraRig input={input} live={live} />
      <RushBlur live={live} palette={palette} compact={compact} />
      <Streaks live={live} count={compact ? 380 : 900} palette={palette} theme={theme} />
      {chapters.map((chapter, index) => {
        const Tunnel = TUNNELS[chapter.kind];
        const props = { index, live, hue: chapter.hue[theme], palette };
        return (
          <GateGroup key={chapter.kind} index={index} live={live}>
            <Tunnel {...props} />
            <GateGlow {...props} />
          </GateGroup>
        );
      })}
      {LANDMARKS.map((Landmark, stop) => (
        <Landmark key={stop} live={live} palette={palette} hue={stop === 0 ? heroHue : chapters[stop - 1].hue[theme]} />
      ))}
    </>
  );
}

/* ----------------------------------------------------------------------------
 * DOM side
 * ------------------------------------------------------------------------- */
export function TunnelTransition({ index }: { index: number }) {
  const chapter = chapters[index];
  const { theme } = useTheme();
  return (
    <div className="journey-gate" data-journey-gate={index} aria-hidden="true" style={{ "--gate-hue": chapter.hue[theme] } as React.CSSProperties}>
      <div className="journey-gate__stage">
        <div className="journey-gate__copy">
          <span className="journey-gate__index">/{chapter.number} — {chapter.title}</span>
          <span className="journey-gate__destination">{chapter.destination}</span>
          <span className="journey-gate__caption">{chapter.caption}</span>
          <span className="journey-gate__line" />
        </div>
      </div>
    </div>
  );
}

export function JourneyStop({ children }: { children: React.ReactNode }) {
  return (
    <div className="journey-stop" data-journey-stop>
      {children}
    </div>
  );
}

function pageTop(element: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

const resetDepth = (node: HTMLElement) => {
  node.style.transform = "";
  node.style.transformOrigin = "";
  node.style.opacity = "";
  node.style.willChange = "";
};

export function ScrollJourney() {
  const input = useRef<JourneyInput>({ distance: 0, pointerX: 0, pointerY: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [compact, setCompact] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 768px)");
    const onChange = () => {
      setReducedMotion(preference.matches);
      setCompact(narrow.matches);
    };
    onChange();
    preference.addEventListener("change", onChange);
    narrow.addEventListener("change", onChange);
    return () => {
      preference.removeEventListener("change", onChange);
      narrow.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-journey-stop], [data-journey-gate]"));
      const vh = window.innerHeight;
      const center = vh * 0.5;
      const scrollY = window.scrollY;

      // Read every layout box first (offsets ignore our own transforms), then write.
      const boxes = nodes.map((node) => {
        const top = pageTop(node) - scrollY;
        return { node, top, height: node.offsetHeight, gate: node.hasAttribute("data-journey-gate") };
      });

      let distance = 0;
      boxes.forEach((box, index) => {
        const { node, top, height, gate } = box;
        const passed = clamp((center - top) / Math.max(height, 1), 0, 1);
        distance += passed * (gate ? GATE_LEN : SECTION_LEN);

        if (gate) {
          // Destination title rushes from deep in the tunnel toward the viewer.
          const copy = node.querySelector<HTMLElement>(".journey-gate__copy");
          if (!copy) return;
          const p = clamp(-top / Math.max(height - vh, 1), 0, 1);
          const opacity = smoothstep(0.02, 0.3, p) * (1 - smoothstep(0.62, 0.92, p));
          copy.style.opacity = opacity.toFixed(3);
          copy.style.transform = `translateZ(0) scale(${(0.22 * Math.pow(18, p)).toFixed(4)})`;
          copy.style.filter = p > 0.7 ? `blur(${((p - 0.7) * 18).toFixed(1)}px)` : "";
          return;
        }

        // Sections recede into the tunnel when leaving and rise out of it when arriving.
        const gateBefore = boxes[index - 1]?.gate ?? false;
        const gateAfter = boxes[index + 1]?.gate ?? false;
        const bottom = top + height;
        const enter = gateBefore ? smoothstep(0, 0.85, 1 - top / vh) : 1;
        const exit = gateAfter ? smoothstep(0.15, 1, 1 - bottom / vh) : 0;
        // Off-screen sections stay flat: a perspective tilt around a far-away
        // origin projects them to enormous boxes that stretch the scroll height.
        if ((enter >= 1 && exit <= 0) || top >= vh || bottom <= 0) {
          resetDepth(node);
          return;
        }
        const scale = (0.78 + enter * 0.22) * (1 + exit * 0.35);
        node.style.willChange = "transform, opacity";
        node.style.transformOrigin = `50% ${clamp(center - top, 0, height).toFixed(1)}px`;
        node.style.transform = `perspective(1400px) rotateX(${((1 - enter) * 9).toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        node.style.opacity = (enter * (1 - exit)).toFixed(3);
      });

      input.current.distance = distance;
    };

    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const onPointer = (event: PointerEvent) => {
      input.current.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      input.current.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    update();
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      window.cancelAnimationFrame(frame);
      document.querySelectorAll<HTMLElement>("[data-journey-stop]").forEach(resetDepth);
      document.querySelectorAll<HTMLElement>(".journey-gate__copy").forEach((copy) => {
        copy.style.opacity = "";
        copy.style.transform = "";
        copy.style.filter = "";
      });
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="journey-canvas" aria-hidden="true">
      <Canvas
        flat
        camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 90 }}
        dpr={[1, compact ? 1.25 : 1.5]}
        gl={{ antialias: !compact, powerPreference: "high-performance" }}
      >
        <JourneyScene input={input} compact={compact} theme={theme} />
      </Canvas>
    </div>
  );
}
