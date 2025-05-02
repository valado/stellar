import { Quaternion, Vector3 } from "three";
import { useXRInputSourceEvent } from "@react-three/xr";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";
import { useCashMultiplier } from "$demos/cash/stores/cash-multiplier";

// Components
import { Suspense } from "react";
import { Gltf } from "@react-three/drei";

// Types
import type { FC } from "react";

export const Cash: FC = () => {
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);
  const cashMultiplier = useCashMultiplier((state) => state.cashMultiplier);

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
    [pose, hits]
  );

  if (!pose || cashMultiplier === 0) {
    return null;
  }

  return (
    <group {...pose} dispose={null}>
      <Suspense>
        {new Array(cashMultiplier).fill(undefined).map((_, i) => (
          <Gltf
            key={i}
            src="/models/cash.glb"
            position={[
              (i % 5) / 6,
              ((i / 5) % 5 | 0) / 40,
              ((i / 25) | 0) / 12,
            ]}
          />
        ))}
      </Suspense>
    </group>
  );
};
