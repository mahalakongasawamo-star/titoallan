"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface TorusProps {
  rotationProgress: number;
  opacityProgress: number;
}

function Torus({ rotationProgress, opacityProgress }: TorusProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#a78bfa",
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      }),
    [],
  );

  useFrame(() => {
    if (!meshRef.current) return;
    /* GSAP progress drives the main Y rotation */
    meshRef.current.rotation.y = rotationProgress * Math.PI * 2;
    meshRef.current.rotation.x = rotationProgress * Math.PI * 0.5;
    /* Wireframe opacity maps from 0.15 → 1 as user scrolls */
    material.opacity = 0.15 + opacityProgress * 0.85;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={meshRef} material={material}>
        <torusGeometry args={[1.6, 0.5, 64, 128]} />
      </mesh>
    </Float>
  );
}

interface FeatureCanvasProps {
  rotationProgress: number;
  opacityProgress: number;
}

export default function FeatureCanvas({
  rotationProgress,
  opacityProgress,
}: FeatureCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, -3, 2]} intensity={0.3} color="#818cf8" />
      <Torus
        rotationProgress={rotationProgress}
        opacityProgress={opacityProgress}
      />
    </Canvas>
  );
}
