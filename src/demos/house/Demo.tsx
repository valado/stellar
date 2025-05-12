import { createXRStore } from "@react-three/xr";
import { useEnterXR } from "$hooks/xr-session";
import { usePose } from "$stores/pose";
import { useHits } from "$stores/hits";
import { useLabels } from "$demos/house/stores/labels";

// Components
import { Input } from "$components/Input";
import { Welcome } from "$components/Welcome";
import { Scene } from "$demos/house/components/Scene";

// Types
import type { FC } from "react";

export const xrStore = createXRStore({
  gaze: false,
  layers: false,
  meshDetection: false,
  planeDetection: false,
  hand: () => <Input kind="hand" />,
  controller: () => <Input kind="controller" />,
});

export const Demo: FC = () => {
  const resetHits = useHits((state) => state.resetHits);
  const resetPose = usePose((state) => state.resetPose);
  const resetOrigin = useLabels((state) => state.resetOrigin);

  const enterXR = useEnterXR("immersive-ar", () => {
    resetHits();
    resetPose();
    resetOrigin();
  });

  return (
    <>
      <Welcome title="AR Immobilien Demo" onEnterXR={enterXR} />
      <Scene />
    </>
  );
};
