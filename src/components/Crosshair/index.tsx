import { forwardRef, memo, useRef } from "react";
import { ThreeElements, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

type CrosshairMeshProps = ThreeElements["mesh"] & {
  color: string;
};

type CrosshairProps = {
  handedness: XRHandedness;
};

const CrosshairMesh = forwardRef<THREE.Mesh, CrosshairMeshProps>(
  (props, ref) => {
    const geometry = BufferGeometryUtils.mergeGeometries([
      new THREE.RingGeometry(0.05, 0.05, 30),
      new THREE.CircleGeometry(0.007, 12),
    ]).rotateX(-Math.PI * 0.5);

    return (
      <mesh ref={ref} geometry={geometry} {...props}>
        <meshBasicMaterial side={THREE.DoubleSide} color={props.color} />
      </mesh>
    );
  }
);

export const Crosshair = memo<CrosshairProps>(({ handedness }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }

    // TODO: Rest hinzufügen.
  });

  return <CrosshairMesh ref={meshRef} visible={false} color="white" />;
});
