import { memo, useRef, useState } from "react";
import { RingGeometry, CircleGeometry } from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
import { useFrame } from "@react-three/fiber";

// Stores
import { useHits } from "$stores/hits";

// Types
import type { FC, RefObject } from "react";
import type { Mesh } from "three";

type CrosshairMeshProps = {
  ref: RefObject<Mesh>;
  isVisible: boolean;
};

type CrosshairProps = {
  handedness: XRHandedness;
};

const CrosshairMesh: FC<CrosshairMeshProps> = ({ ref, isVisible }) => {
  const geometry = BufferGeometryUtils.mergeGeometries([
    new RingGeometry(0.05, 0.05, 30),
    new CircleGeometry(0.007, 12),
  ]).rotateX(-Math.PI / 2);

  return (
    <mesh geometry={geometry} ref={ref} visible={isVisible}>
      <meshBasicMaterial color="white" />
    </mesh>
  );
};

export const Crosshair: FC<CrosshairProps> = memo(({ handedness }) => {
  const [isVisible, setIsVisible] = useState(false);
  const hits = useHits((state) => state.hits);

  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    const hit = hits[handedness];

    if (!hit) {
      setIsVisible(false);
      return;
    }

    mesh.position.setFromMatrixPosition(hit);
    mesh.quaternion.setFromRotationMatrix(hit);

    setIsVisible(true);
  });

  return <CrosshairMesh ref={meshRef} isVisible={isVisible} />;
});
