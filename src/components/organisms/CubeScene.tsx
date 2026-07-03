import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Environment } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";
import { useCubeStore } from "../../stores/cubeStore";
import type { CubeItem } from "../../types/cube";

type CubeSceneProps = {
  cursorPosition?: [number, number, number] | null;
};

type CubeMeshProps = {
  cube: CubeItem;
};

function CubeMesh({ cube }: CubeMeshProps) {
  const meshRef = useRef<Mesh | null>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.008;
  });

  return (
    <mesh
      ref={meshRef}
      position={cube.position}
      rotation={cube.rotation}
      scale={cube.scale}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={cube.color} roughness={0.35} metalness={0.2} />
    </mesh>
  );
}

function FingerCursor({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <mesh position={[position[0], position[1], position[2] + 0.4]}>
      <sphereGeometry args={[0.09, 24, 24]} />
      <meshStandardMaterial
        color="#facc15"
        emissive="#facc15"
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}

export function CubeScene({ cursorPosition }: CubeSceneProps) {
  const cubes = useCubeStore((state) => state.cubes);

  return (
    <section className="h-[520px] overflow-hidden rounded-4xl border border-white/10 bg-slate-900 shadow-2xl shadow-cyan-950/30">
      <Canvas camera={{ position: [4, 4, 6], fov: 45 }}>
        <color attach="background" args={["#020617"]} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, 3, 2]} intensity={1} />

        <Grid
          position={[0, -1.4, 0]}
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.6}
          sectionSize={2}
          sectionThickness={1.2}
          fadeDistance={20}
          fadeStrength={1}
        />

        {cursorPosition ? <FingerCursor position={cursorPosition} /> : null}

        {cubes.map((cube) => (
          <CubeMesh key={cube.id} cube={cube} />
        ))}

        <Environment preset="city" />
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </section>
  );
}