import { createXRStore } from "@react-three/xr";
import { useEnterXR } from "$hooks/xr-session";
import { usePose } from "$stores/pose";
import { useHits } from "$stores/hits";
import { useLabelOrigin } from "$demos/house/stores/label-origin";

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
  const resetLabelOrigin = useLabelOrigin((state) => state.resetLabelOrigin);

  const enterXR = useEnterXR("immersive-ar", () => {
    resetHits();
    resetPose();
    resetLabelOrigin();
  });

  return (
    <>
      <Welcome title="AR Immobilien Demo" onEnterXR={enterXR} />
      <Scene />
    </>
  );
};
