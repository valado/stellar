import { useXRInputSourceEvent } from "@react-three/xr";
import { Quaternion, Vector3 } from "three";

// Stores
import { useCashMultiplier } from "$stores/cash-multiplier";
import { useHits } from "$stores/hits";
import { usePose } from "$stores/pose";

// Components
import { Suspense } from "react";
import { Gltf } from "@react-three/drei";

// Types
import type { FC } from "react";

export const Cash: FC = () => {
  const hits = useHits((state) => state.hits);
  const pose = usePose((state) => state.pose);
  const setPose = usePose((state) => state.setPose);
  const isPoseSet = usePose((state) => state.isPoseSet);
  const multiplier = useCashMultiplier((state) => state.multiplier);

  // Logic for placing the cash model at the selected location.
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
    [isPoseSet, hits],
  );

  return isPoseSet ? (
    <Suspense fallback={null}>
      <group {...pose} dispose={null}>
        {new Array(multiplier).fill(null).map((_, i) => (
          <Gltf
            key={i}
            src="/models/10_racks.glb"
            // Achtung: Magic Numbers!
            position={[
              (i % 5) / 6,
              Math.floor((i / 5) % 5) / 40,
              Math.floor(i / 25) / 12,
            ]}
          />
        ))}
      </group>
    </Suspense>
  ) : null;
};
