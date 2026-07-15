"use client";

import { Float, Html, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { easing } from "maath";
import { useRef } from "react";

import { HeroCardFace } from "./hero-card-face";

import type { FeaturedMember } from "@/features/github";
import type { Group } from "three";

const CardRig = ({ children }: { children: React.ReactNode }) => {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    easing.damp(group.current.rotation, "x", -state.pointer.y * 0.3, 0.3, delta);
    easing.damp(group.current.rotation, "y", state.pointer.x * 0.45, 0.3, delta);
  });

  return <group ref={group}>{children}</group>;
};

type HeroCard3dProps = {
  member: FeaturedMember;
  practiceRepoName: string;
};

/**
 * WebGL hero card: a physical card mesh that tilts toward the pointer with damped
 * easing and floats idly, with the member's real data projected onto its face.
 * Import through next/dynamic with ssr disabled.
 *
 * @param member - Featured member rendered on the card face.
 * @param practiceRepoName - Practice repo name shown on the face.
 * @returns A transparent full-size Canvas containing the card.
 * @example
 * const HeroCard3d = dynamic(() => import("./hero-card-3d"), { ssr: false });
 */
const HeroCard3d = ({ member, practiceRepoName }: HeroCard3dProps) => {
  const { resolvedTheme } = useTheme();
  const cardColor = resolvedTheme === "dark" ? "#161613" : "#ffffff";

  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.4} />
      <directionalLight intensity={1.1} position={[4, 6, 5]} />
      <pointLight color="#ffe34d" intensity={30} position={[-4, -2, 4]} />
      <CardRig>
        <Float floatIntensity={0.7} rotationIntensity={0.25} speed={2}>
          <RoundedBox args={[3.2, 4, 0.16]} radius={0.14} smoothness={4}>
            <meshPhysicalMaterial clearcoat={1} clearcoatRoughness={0.6} color={cardColor} roughness={0.4} />
          </RoundedBox>
          <Html
            center
            className="pointer-events-none select-none"
            distanceFactor={2.4}
            position={[0, 0, 0.09]}
            transform
          >
            <HeroCardFace member={member} practiceRepoName={practiceRepoName} />
          </Html>
        </Float>
      </CardRig>
    </Canvas>
  );
};

export default HeroCard3d;
