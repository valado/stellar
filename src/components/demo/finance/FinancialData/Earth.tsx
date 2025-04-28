import { useEffect, useRef, useState } from "react";
import { Vector3, Quaternion, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useXRInputSourceEvent } from "@react-three/xr";

// Components
import { Gltf } from "@react-three/drei";

// Stores
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";
import { useLabelOrigin } from "$stores/label-origin";

// Types
import type { FC } from "react";

const INITIAL_SCALE = new Vector3(0.3, 0.3, 0.3);

export const Earth: FC = () => {
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);
  const isPoseSet = usePose((state) => state.isPoseSet);
  const setLabelOrigin = useLabelOrigin((state) => state.setLabelOrigin);
  
  // Logic for placing the house model at the selected location.
  useXRInputSourceEvent(
    "all",
    "select",
    (event) => {
      if (isPoseSet) {
        return;
      }

      const hit = hits[event.inputSource.handedness];

      if (!hit) {
        return;
      }

      const position = new Vector3();
      const quaternion = new Quaternion();

      hit.decompose(position, quaternion, new Vector3());

      setPose({
        position,
        quaternion,
      });
    },
    [isPoseSet, hits]
  );

  // Logic for determining the label origin.
  useFrame(({ camera }) => {
    if (!pose) {
      return;
    }

    camera.updateMatrixWorld(true);
    setLabelOrigin(pose.position.clone().project(camera));
  });

  return isPoseSet ? (
    <group
      {...pose}
      rotation={[0, -Math.PI / 2, 0]}
      dispose={null}
    >
      <Gltf src="/models/world.glb" />
    </group>
  ) : null;
};
