import { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useXRInputSourceEvent } from "@react-three/xr";
import * as THREE from "three";
import { hitTestMatrices } from "../HitTest";

const MODEL_PATH = "/models/stellar_house.glb";

useGLTF.preload(MODEL_PATH);

type House = {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

export const House = () => {
  const [house, setHouse] = useState<House>(null!);
  const { nodes } = useGLTF(MODEL_PATH) as any;

  useXRInputSourceEvent(
    "all",
    "select",
    (event) => {
      const matrix = hitTestMatrices[event.inputSource.handedness];

      if (!matrix) {
        return;
      }

      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();

      matrix.decompose(position, quaternion, new THREE.Vector3());

      setHouse({
        position,
        quaternion,
      });
    },
    []
  );

  return (
    <group {...house} scale={0.3} dispose={null}>
      <mesh
        geometry={nodes.Plane.geometry}
        material={nodes.Plane.material}
        rotation={[0, 0, 0]}
      />
    </group>
  );
};
