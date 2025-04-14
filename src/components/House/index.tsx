import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useXRInputSourceEvent } from "@react-three/xr";
import * as THREE from "three";
import { hitTestMatrices } from "../HitTest";

const MODEL_PATH = "/models/house.glb";

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
        geometry={nodes.House_1.geometry}
        material={nodes.House_1.material}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
      <mesh
        geometry={nodes.House_2.geometry}
        material={nodes.House_2.material}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
      <mesh
        geometry={nodes.House_3.geometry}
        material={nodes.House_3.material}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
      <mesh
        geometry={nodes.House_4.geometry}
        material={nodes.House_4.material}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
      />
    </group>
  );
};
