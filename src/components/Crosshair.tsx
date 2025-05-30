import { memo, useRef, useState } from "react";
import { RingGeometry, CircleGeometry } from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";
import { useFrame } from "@react-three/fiber";
import { useHits } from "$stores/hits";

// Types
import type { FC } from "react";
import type { Mesh } from "three";

type Props = {
  handedness: XRHandedness;
};

export const Crosshair: FC<Props> = memo(({ handedness }) => {
  const [isVisible, setIsVisible] = useState(false);
  const hits = useHits((state) => state.hits);

  const meshRef = useRef<Mesh>(null!);

  const geometry = BufferGeometryUtils.mergeGeometries([
    new RingGeometry(0.05, 0.05, 30),
    new CircleGeometry(0.007, 12),
  ]).rotateX(-Math.PI / 2);

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

  return (
    <mesh geometry={geometry} ref={meshRef} visible={isVisible}>
      <meshBasicMaterial color="white" />
    </mesh>
  );
});
