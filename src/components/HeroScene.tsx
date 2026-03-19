import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, OrbitControls, Sphere, Trail } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

function FloatingCore() {
  const groupRef = useRef<Group>(null);
  const shellRef = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.28;
      groupRef.current.rotation.x = Math.sin(t * 0.35) * 0.12;
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.18;
    }

    if (shellRef.current) {
      shellRef.current.rotation.x = t * 0.2;
      shellRef.current.rotation.z = t * 0.16;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.2, 8]} />
          <MeshDistortMaterial
            color="#62d4ff"
            emissive="#0ea5e9"
            emissiveIntensity={1.4}
            roughness={0.18}
            metalness={0.6}
            distort={0.35}
            speed={2}
          />
        </mesh>
      </Float>

      <mesh ref={shellRef} scale={1.85}>
        <torusKnotGeometry args={[1.3, 0.1, 220, 24]} />
        <meshStandardMaterial color="#8ce7ff" emissive="#2563eb" emissiveIntensity={0.65} wireframe />
      </mesh>
    </group>
  );
}

function OrbitingNodes() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = -t * 0.22;
      groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.18;
    }
  });

  return (
    <group ref={groupRef}>
      {[
        { position: [2.7, 0.5, 0.4], color: "#34d399", scale: 0.34 },
        { position: [-2.4, -0.8, -0.4], color: "#f59e0b", scale: 0.28 },
        { position: [0.7, 2.25, -0.2], color: "#38bdf8", scale: 0.22 },
      ].map((node, index) => (
        <Float key={index} speed={2 + index} rotationIntensity={1.5} floatIntensity={1.2}>
          <Trail width={0.7} length={3} color={node.color} attenuation={(t) => t * t}>
            <mesh position={node.position as [number, number, number]} scale={node.scale}>
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={1.6} roughness={0.2} />
            </mesh>
          </Trail>
        </Float>
      ))}
    </group>
  );
}

function ParticleField() {
  const pointsRef = useRef<Group>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 80 }, (_, index) => ({
        key: index,
        position: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 8,
        ] as [number, number, number],
        scale: Math.random() * 0.045 + 0.015,
      })),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.03;
      pointsRef.current.position.y = Math.sin(t * 0.2) * 0.08;
    }
  });

  return (
    <group ref={pointsRef}>
      {particles.map((particle) => (
        <mesh key={particle.key} position={particle.position} scale={particle.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6.4], fov: 42 }} dpr={[1, 1.8]} gl={{ alpha: true }}>
      <fog attach="fog" args={["#050816", 6, 14]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#d8f7ff" />
      <pointLight position={[-4, -2, 1]} intensity={18} color="#0ea5e9" />
      <pointLight position={[3, 2, -1]} intensity={10} color="#22d3ee" />

      <ParticleField />
      <FloatingCore />
      <OrbitingNodes />

      <Sphere args={[6.5, 32, 32]} scale={1.1}>
        <meshBasicMaterial color="#0f172a" transparent opacity={0.08} wireframe />
      </Sphere>

      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
