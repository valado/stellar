import { Quaternion, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useXRInputSourceEvent } from "@react-three/xr";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";
import { useScale } from "$hooks/scale";
import { useQuaternion } from "$hooks/quaternion";
import { useLabels } from "$demos/house/stores/labels";

// Components
import { Gltf } from "@react-three/drei";

// Types
import type { FC } from "react";

const INITIAL_SCALE = new Vector3(0.3, 0.3, 0.3);
const MIN_SCALE = new Vector3(0.2, 0.2, 0.2);
const MAX_SCALE = new Vector3(1, 1, 1);

export const House: FC = () => {
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);
  const setOrigin = useLabels((state) => state.setOrigin);
  const isLabelVisible = useLabels((state) => state.isVisible);

  const scale = useScale(INITIAL_SCALE, MIN_SCALE, MAX_SCALE);
  const quaternion = useQuaternion();

  // Logic for placing the house model at the selected location.
  useXRInputSourceEvent(
    "all",
    "select",
    (event) => {
      if (pose) {
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
    [pose, hits],
  );

  // Logic for determining the label origin.
  useFrame(({ camera }) => {
    if (!pose || !isLabelVisible) {
      return;
    }

    camera.updateMatrixWorld(true);
    setOrigin(pose.position.clone().project(camera));
  });

  if (!pose) {
    return null;
  }

  return (
    <Gltf
      src="/models/house.glb"
      position={pose.position}
      quaternion={quaternion}
      scale={scale}
      dispose={null}
    />
  );
};
