"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdditiveBlending } from "three";
import { easing } from "maath";
import { useMemo, useRef } from "react";

import { GLOBE_DOTS } from "./globe-dots";

import type { MemberHub } from "@/features/github";
import type { Group, PointsMaterial } from "three";

const RADIUS = 2;

const toVec3 = (lat: number, lng: number, radius: number): [number, number, number] => {
  const phi = (lat * Math.PI) / 180;
  const theta = (lng * Math.PI) / 180;
  return [radius * Math.cos(phi) * Math.sin(theta), radius * Math.sin(phi), radius * Math.cos(phi) * Math.cos(theta)];
};

const Globe = ({ dotColor, hubs }: { dotColor: string; hubs: MemberHub[] }) => {
  const group = useRef<Group>(null);
  const markerMaterial = useRef<PointsMaterial>(null);

  const landPositions = useMemo(() => {
    const positions = new Float32Array((GLOBE_DOTS.length / 2) * 3);
    for (let i = 0; i < GLOBE_DOTS.length / 2; i++) {
      const [x, y, z] = toVec3(GLOBE_DOTS[i * 2], GLOBE_DOTS[i * 2 + 1], RADIUS);
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, []);

  const hubPositions = useMemo(() => {
    const positions = new Float32Array(hubs.length * 3);
    hubs.forEach((hub, i) => {
      positions.set(toVec3(hub.lat, hub.lng, RADIUS * 1.008), i * 3);
    });
    return positions;
  }, [hubs]);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.07;
      easing.damp(group.current.rotation, "x", 0.18 - state.pointer.y * 0.25, 0.5, delta);
    }
    if (markerMaterial.current) {
      markerMaterial.current.size = 0.075 + Math.sin(state.clock.elapsedTime * 2.4) * 0.02;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute args={[landPositions, 3]} attach="attributes-position" />
        </bufferGeometry>
        <pointsMaterial color={dotColor} depthWrite={false} opacity={0.65} size={0.022} transparent />
      </points>
      {hubs.length > 0 && (
        <points>
          <bufferGeometry>
            <bufferAttribute args={[hubPositions, 3]} attach="attributes-position" />
          </bufferGeometry>
          <pointsMaterial
            blending={AdditiveBlending}
            color="#ffe34d"
            depthWrite={false}
            ref={markerMaterial}
            size={0.075}
            transparent
          />
        </points>
      )}
    </group>
  );
};

type MemberGlobeProps = {
  hubs: MemberHub[];
  dotColor: string;
};

/**
 * WebGL globe of ~10k land dots with pulsing yellow markers on every member hub.
 * Rotates slowly, tilts with the pointer. Import through next/dynamic (ssr off)
 * and mount only when the section is near the viewport.
 *
 * @param hubs - Geocoded member locations from the GitHub org.
 * @param dotColor - Land dot color, matched to the active theme.
 * @returns A transparent Canvas with the globe.
 * @example
 * const MemberGlobe = dynamic(() => import("./member-globe"), { ssr: false });
 */
const MemberGlobe = ({ hubs, dotColor }: MemberGlobeProps) => (
  <Canvas camera={{ position: [0, 0, 5.4], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
    <Globe dotColor={dotColor} hubs={hubs} />
  </Canvas>
);

export default MemberGlobe;
