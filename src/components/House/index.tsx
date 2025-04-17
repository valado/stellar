import { useGLTF } from "@react-three/drei";
import { useXRInputSourceEvent } from "@react-three/xr";
import * as THREE from "three";
import { usePoseStore } from "../../stores/pose";
import { hitTestMatrices } from "../HitTest";

const MODEL_PATH = "/models/house.glb";

useGLTF.preload(MODEL_PATH);

export const House = () => {
  const { pose, setPose } = usePoseStore();
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

      setPose({
        position,
        quaternion,
      });
    },
    []
  );

  return (
    <group {...pose} scale={0.3} dispose={null}>
      {Object.values(nodes).map((node: any, key) => (
        <mesh
          geometry={node.geometry}
          material={node.material}
          rotation={[0, -Math.PI / 2, 0]}
          key={key}
        />
      ))}
    </group>
  );
};
