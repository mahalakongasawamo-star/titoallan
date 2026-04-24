"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface TorusProps {
  rotationProgress: number;
  opacityProgress: number;
}

function PricingTorus({ rotationProgress, opacityProgress }: TorusProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#22d3ee",
        wireframe: true,
        transparent: true,
        opacity: 0.08,
      }),
    [],
  );

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = rotationProgress * Math.PI * 3;
    meshRef.current.rotation.x =
      Math.PI * 0.3 + rotationProgress * Math.PI * 0.8;
    material.opacity = 0.08 + opacityProgress * 0.72;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} material={material}>
        <torusGeometry args={[2, 0.35, 48, 160]} />
      </mesh>
    </Float>
  );
}

interface PricingCanvasProps {
  rotationProgress: number;
  opacityProgress: number;
}

export default function PricingCanvas({
  rotationProgress,
  opacityProgress,
}: PricingCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 5]} intensity={0.6} />
      <pointLight position={[-4, -2, 3]} intensity={0.4} color="#06b6d4" />
      <pointLight position={[3, -4, 1]} intensity={0.2} color="#8b5cf6" />
      <PricingTorus
        rotationProgress={rotationProgress}
        opacityProgress={opacityProgress}
      />
    </Canvas>
  );
}
